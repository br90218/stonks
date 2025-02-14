export interface RunFile {
    name: string;
    seed: string;
}

export interface StockInfo {
    ticker: string;
    name: string;
    currPrice: number;
    delta: number;
    deltaPercentage: number;
    lastDelta: number;
}

export interface Portfolio {
    [ticker: string]: StockInfo;
}

export interface UserPortfolio {
    cash: number;
    portfolio: Portfolio;
}

export interface StockChartDataCollection {
    [ticker: string]: StockChartDataSeries;
}

interface StockChartDataSeries {
    data: StockChartData[];
}

interface StockChartData {
    x: Date;
    y: number[];
}

export interface CallBackMessage {
    msgType: string;
    arg?: string[];
}

export function LoadingStockInfo(): StockInfo {
    const stockInfo = EmptyStockInfo();
    stockInfo.name = 'Loading';
    return stockInfo;
}

export function EmptyStockInfo(): StockInfo {
    return {
        ticker: 'N/A',
        name: 'No Stock Selected',
        currPrice: 0,
        delta: 0,
        deltaPercentage: 0,
        lastDelta: 0
    };
}

export function EmptyUserPortfolio(): UserPortfolio {
    return {
        cash: 0,
        portfolio: {}
    };
}
