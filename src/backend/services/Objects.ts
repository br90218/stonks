export interface Stock {
    ticker: string;
    name: string;
}

export interface MarketStock extends Stock {
    currPrice: number;
    delta: number;
    deltaPercentage: number;
    lastDelta: number;
    tick: number;
    lastUpdate: string;
    influenceDirection: number;
    history: PriceDataAtTime[];
}

export interface PlayerPosition extends Stock {
    isLongPosition: boolean;
    averagePrice: number;
    quantity: number;
}

export interface RunFile {
    name: string;
    seed: string;
    portfolio?: PlayerPortfolio;
    cash: number;
    privileges: string[];
}

export interface PlayerPortfolio {
    shortPosition: Portfolio;
    longPosition: Portfolio;
}

export interface Portfolio {
    stocks: { [ticker: string]: Stock };
}

export interface MarketPortfolio extends Portfolio {
    stocks: { [ticker: string]: MarketStock };
}

export interface MarketHistory {
    [ticker: string]: StockHistory;
}

export interface StockHistory {
    priceHistory: PriceDataAtTime[];
}

export interface PriceDataAtTime {
    time: string;
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
        stocks: Stock[];
    };
}
