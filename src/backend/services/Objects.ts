import { Data } from 'electron';

export interface Stock {
    ticker: string;
    name: string;
    currPrice: number;
    quantity: number; //NOTE: i would actually like to separate SHARE from STOCK. quantity should not be here.
    tick: number;
    lastUpdate: Date;
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

interface PriceDataAtTime {
    time: Date;
    price: OHLC;
}

interface OHLC {
    open: number;
    high: number;
    low: number;
    close: number;
}
