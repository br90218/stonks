import { Data } from 'electron';

export interface Stock {
    ticker: string;
    name: string;
    currPrice: number;
    quantity: number; //NOTE: i would actually like to separate SHARE from STOCK. quantity should not be here.
    delta?: number;
    deltaPercentage?: number;
    lastDelta?: number;
    tick: number;
    lastUpdate: string;
}

export interface RunFile {
    name: string;
    seed: string;
    portfolio?: Portfolio;
    cash: number;
}

export interface Portfolio {
    [ticker: string]: Stock;
}

export interface MarketHistory {
    [ticker: string]: StockHistory;
}

export interface StockHistory {
    ticker: string;
    priceHistory: PriceDataAtTime[];
}

export interface PriceDataAtTime {
    time: string;
    price: OHLC;
}

interface OHLC {
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface StockOperationResponse {
    result: boolean;
    detail: string;
    file?: {
        cash: number;
        portfolio: Portfolio;
    };
}
