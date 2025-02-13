export interface RunFile {
    name: string;
    seed: string;
}

export interface StockInfo {
    ticker: string;
    name: string;
    currPrice: number;
}

export interface Market {
    [ticker: string]: StockInfo;
}
