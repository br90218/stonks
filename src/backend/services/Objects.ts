export interface Stock {
    ticker: string;
    name: string;
    currPrice: number;
    quantity: number; //NOTE: i would actually like to separate SHARE from STOCK. quantity should not be here.
    tick: number;
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
