import { RunFile, StockInfo } from '@renderer/data/Interface';
import { useRef } from 'react';

const Backend = () => {
    const connected = useRef(false);

    window.api.onConnectionStatusChanged((value) => {
        connected.current = value;
        console.log('connection status changed to ' + connected.current);
    });
};

export async function RetrieveRunFile(): Promise<RunFile> {
    const result = await window.api.retrieveRunFile();
    return result;
}

export async function GetStockCurrentInfo(stock: string): Promise<StockInfo> {
    const result = await window.api.getStockCurrentInfo();
    return result;
}
