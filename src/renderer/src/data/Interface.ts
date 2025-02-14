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

export function LoadingStockInfo(): StockInfo {
    const stockInfo = EmptyStockInfo();
    stockInfo.name = 'Loading';
    return stockInfo;
}

export function EmptyStockInfo(): StockInfo {
    return { ticker: 'N/A', name: 'No Stock Selected', currPrice: 0, delta: 0, deltaPercentage: 0 };
}
