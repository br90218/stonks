import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
    retrieveRunFile: async (): Promise<string> => {
        const value = await ipcRenderer.invoke('getRunFile');
        return value;
    },
    waitUntilConnected: async () => {
        return await ipcRenderer.invoke('waitUntilConnected');
    },
    onConnectionStatusChanged: (callback): void => {
        ipcRenderer.on('backendStatus', (_event, value) => {
            callback(value);
        });
    },
    getConnectionStatus: (): void => {
        return ipcRenderer.invoke('backendStatus');
    },
    onStockInfoChanged: (callback): void => {
        ipcRenderer.on('stockinfo', (_event, value) => {
            callback(value);
        });
    }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
