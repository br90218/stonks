export interface RunFile {
    name: string;
    seed: string;
}

export interface StockInfo {
    ticker: string;
    name: string;
    currPrice: number;
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
