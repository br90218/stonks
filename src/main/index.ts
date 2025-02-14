import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { fork } from 'child_process';
import { resolve } from 'path';
import { io, Socket } from 'socket.io-client';

const stockEngineChild = fork(resolve(__dirname, 'stockEngine.js'), ['stockEngine']);

async function waitForSocketConnected(socket: Socket) {
    while (!socket.connected) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
            // contextIsolation: false
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }

    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    const socket = io('http://localhost:3333');

    const mainWindow = createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.handle('waitUntilConnected', async () => {
        //await waitForSocketConnected(socket);
        //return true;
    });

    ipcMain.handle('getRunFile', async () => {
        if (!socket.connected) {
            console.error('socket is not connected yet');
            return;
        }
        const value = await socket.emitWithAck('get-runfile');
        return value.response;
    });

    ipcMain.handle('backendStatus', () => {
        return socket.connected;
    });

    ipcMain.handle('command', (event, command, args) => {
        console.log(args);
        socket.emit(command, args);
    });

    ipcMain.handle('request', async (event, message, args) => {
        if (!socket.connected) {
            console.error('socket is not connected yet');
            return;
        }
        const reply = await socket.emitWithAck(message, args);
        return reply.response;
    });

    socket.on('message', (event, value) => {
        mainWindow.webContents.send(event, value);
    });

    socket.on('connect', () => {
        console.log('socket is connected');
        mainWindow.webContents.send('backendStatus', 'connected');
    });

    socket.on('disconnected', () => {
        app.quit();
    });
    socket.on('connect-error', () => {
        app.quit();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
