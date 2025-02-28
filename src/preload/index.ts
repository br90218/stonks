import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

//TODO: need a better message format convention, it's everywhere.
// Custom APIs for renderer
const api = {
    retrieveRunFile: async (): Promise<string> => {
        return await ipcRenderer.invoke('request', 'get-runfile');
    },
    waitUntilConnected: async () => {
        return await ipcRenderer.invoke('waitUntilConnected');
    },
    onConnectionStatusChanged: (callback): void => {
        ipcRenderer.on('backendStatus', (_event, value) => {
            callback(value);
        });
    },
    onStockChartNewData: (callback): void => {
        ipcRenderer.on('stockprice', (_event, value) => {
            callback(value);
        });
    },
    onStockInfo: (callback): void => {
        ipcRenderer.on('stockinfo', (_event, value) => {
            callback(value);
        });
    },
    getConnectionStatus: () => {
        return ipcRenderer.invoke('backendStatus');
    },
    getCurrentCash: async () => {
        return await ipcRenderer.invoke('request', 'get-cash');
    },
    startStockSim: () => {
        return ipcRenderer.invoke('command', 'start-stocksim');
    },
    buyStock: async (ticker: string, price: string, quantity: string) => {
        return await ipcRenderer.invoke('request', 'buy-stock', [
            ticker,
            Number(price),
            Number(quantity)
        ]);
    },
    sellStock: async (ticker: string, price: string, quantity: string) => {
        return await ipcRenderer.invoke('request', 'sell-stock', [
            ticker,
            Number(price),
            Number(quantity)
        ]);
    },
    getMarketStock: async (tickers?: string[]): Promise<any> => {
        return await ipcRenderer.invoke('request', 'get-marketStock', tickers);
    },
    getPlayerStock: async (tickers?: string[]) => {
        return await ipcRenderer.invoke('request', 'get-playerStock', tickers);
    },
    getMarketStockHistory: async (ticker) => {
        return await ipcRenderer.invoke('request', 'get-marketStock-history', [ticker]);
    },
    setStockInfluence: (args): Promise<void> => {
        return ipcRenderer.invoke('command', 'set-stock-influence', [args[0], Number(args[1])]);
    },
    setStockTick: (args): Promise<void> => {
        return ipcRenderer.invoke('command', 'set-stock-tick', [args[0], Number(args[1])]);
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
