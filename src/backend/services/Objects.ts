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
    directionInfluence: number;
    history: PriceDataAtTime[];
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
    data?: {
        newRemainingCash: number;
        stock: Stock;
    };
}

export interface StockGetResponse {
    result: boolean;
    detail: string;
    data?: {
        portfolio: Portfolio;
    };
}
