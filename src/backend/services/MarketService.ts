import { Server } from 'socket.io';
import { RandomGenerator } from '../RandomGenerator';
import {
    MarketHistory,
    Portfolio,
    PriceDataAtTime,
    Stock,
    StockGetResponse,
    StockOperationResponse
} from './Objects';
import { RunFile } from './Objects';
import { DateService } from './DateService';

export function GetMarketStock(marketPortfolio: Portfolio, tickers?: string[]): StockGetResponse {
    if (tickers && tickers.length > 0) {
        const result: Portfolio = {};
        tickers.forEach((ticker) => {
            if (ticker != '') {
                result[ticker] = marketPortfolio[ticker];
            }
        });
        return {
            result: true,
            detail: 'ok',
            data: { portfolio: result }
        };
    }
    const portfolio = marketPortfolio;
    return {
        result: true,
        detail: 'ok',
        data: { portfolio: portfolio }
    };
}

export function GetPlayerStock(runFile: RunFile, tickers?: string[]): StockGetResponse {
    if (!runFile.portfolio) {
        console.log('1');
        return {
            result: true,
            detail: 'ok',
            data: { portfolio: {} }
        };
    }
    if (tickers && tickers.length > 0) {
        console.log(runFile.portfolio);
        console.log('2');
        const result: Portfolio = {};
        tickers.forEach((ticker) => {
            if (ticker != '') {
                result[ticker] = runFile.portfolio![ticker];
            }
        });
        return {
            result: true,
            detail: 'ok',
            data: { portfolio: result }
        };
    }
    console.log('3');
    const portfolio = runFile.portfolio;
    return {
        result: true,
        detail: 'ok',
        data: { portfolio: portfolio }
    };
}

export function BuyStock(
    runFile: RunFile,
    market: Portfolio,
    dateService: DateService,
    ticker: string,
    price: number,
    quantity: number
): StockOperationResponse {
    if (!runFile || !runFile.portfolio) {
        console.error(
            `did not supply runFile or runFile portfolio does not exist when buying stock`
        );
        return { result: false, detail: 'runFile-error' };
    }
    if (!market || !dateService) {
        console.error(`did not supply market or dateService when buying stock`);
        return { result: false, detail: 'internal-error' };
    }

    if (runFile.cash < price * quantity) {
        return { result: false, detail: 'insufficient-cash' };
    }

    //NOTE: this buying mechanism assumes no slippage;
    // it also means that orders will be fulfilled regardless
    // of the quoted price.

    const currentUserStock = runFile.portfolio[ticker];
    const marketStock = market[ticker];
    const updateTime = dateService.ParseDate();

    const updatedUserStock: Stock = {
        ticker: ticker,
        name: currentUserStock ? currentUserStock.name : marketStock.name,
        currPrice: calculateAveragePrice(
            currentUserStock ? currentUserStock.currPrice : 0,
            currentUserStock ? currentUserStock.quantity : 0,
            price,
            quantity
        ),
        quantity: currentUserStock ? currentUserStock.quantity + quantity : quantity,
        tick: marketStock.tick,
        lastUpdate: updateTime
    };

    const updatedMarketStock: Stock = {
        ticker: marketStock.ticker,
        name: marketStock.name,
        currPrice: marketStock.currPrice,
        quantity: marketStock.quantity - quantity,
        tick: marketStock.tick,
        delta: marketStock.delta,
        deltaPercentage: marketStock.deltaPercentage,
        lastDelta: marketStock.lastDelta,
        lastUpdate: updateTime
    };
    runFile.portfolio[ticker] = updatedUserStock;
    marketStock[ticker] = updatedMarketStock;
    runFile.cash -= quantity * price;

    return {
        result: true,
        detail: 'ok',
        data: { newRemainingCash: runFile.cash, stock: updatedUserStock }
    };
}

export function SellStock(
    runFile: RunFile,
    market: Portfolio,
    dateService: DateService,
    ticker: string,
    price: number,
    quantity: number
): StockOperationResponse {
    if (!runFile || !runFile.portfolio) {
        console.error(
            `did not supply runFile or runFile portfolio does not exist when selling stock`
        );
        return { result: false, detail: 'runFile-error' };
    }
    if (!market || !dateService) {
        console.error(`did not supply market or dateService when selling stock`);
        return { result: false, detail: 'internal-error' };
    }

    const portfolioStock = runFile.portfolio[ticker];

    if (!portfolioStock || portfolioStock.quantity < quantity) {
        return { result: false, detail: 'insufficient-stock' };
    }

    const marketStock = market[ticker];
    const updateTime = dateService.ParseDate();

    const updatedUserStock: Stock = {
        ticker: ticker,
        name: portfolioStock.name,
        currPrice: portfolioStock.currPrice,
        quantity: portfolioStock.quantity - quantity,
        tick: marketStock.tick,
        lastUpdate: updateTime
    };

    console.log(portfolioStock.quantity - quantity);

    const updatedMarketStock: Stock = {
        ticker: marketStock.ticker,
        name: marketStock.name,
        currPrice: marketStock.currPrice,
        quantity: marketStock.quantity + quantity,
        tick: marketStock.tick,
        delta: marketStock.delta,
        deltaPercentage: marketStock.deltaPercentage,
        lastDelta: marketStock.lastDelta,
        lastUpdate: updateTime
    };
    runFile.portfolio[ticker] = updatedUserStock;
    marketStock[ticker] = updatedMarketStock;
    runFile.cash += quantity * price;

    return {
        result: true,
        detail: 'ok',
        data: { newRemainingCash: runFile.cash, stock: updatedUserStock }
    };
}

function calculateAveragePrice(
    priceA: number,
    quantityA: number,
    priceB: number,
    quantityB: number
): number {
    return (priceA * quantityA + priceB * quantityB) / (quantityA + quantityB);
}

export function InstantiateMarket(): Portfolio {
    return DefaultMarketPortfolio();
}

export function LoadMarket(): Portfolio {
    let marketPf: Portfolio;

    return marketPf;
}

export function startAllStockSimulation(
    rng: RandomGenerator,
    io: Server,
    market: Portfolio,
    dateService: DateService
): object {
    const stockSimulationLoops = {};

    Object.keys(market).forEach((ticker) => {
        stockSimulationLoops[ticker] = StockSimulationLoop(rng, io, ticker, market, dateService);
    });

    dateService.StartDateProgression();
    return stockSimulationLoops;
}

export function stopStockSimulation(stockSimulationLoops: object, ticker: string[]): object {
    if (!ticker) {
        // stop all simulation
        Object.keys(stockSimulationLoops).forEach((ticker) => {
            clearInterval(stockSimulationLoops[ticker]);
        });
        return {};
    }

    return stockSimulationLoops;
}

export function GetMarketStockHistory(market: Portfolio, ticker: string) {
    return market[ticker].history;
}

//TODO: does not catch exception when market[ticker] returns jackshit
export function AddInfluenceToStock(market: Portfolio, ticker: string, influence: number): void {
    const newStock = ReturnStockCopy(market[ticker]);
    newStock.directionInfluence = Math.max(0, Math.min(newStock.directionInfluence + influence, 1));
    console.log(newStock.directionInfluence);
    market[ticker] = newStock;
}

//TODO: does not catch exception when market[ticker] returns jackshit
export function SetTickToStock(market: Portfolio, ticker: string, newTick: number): void {
    const newStock = ReturnStockCopy(market[ticker]);
    newStock.tick = newTick;
    market[ticker] = newStock;
}

function StockSimulationLoop(
    rng: RandomGenerator,
    io: Server,
    ticker: string,
    market: Portfolio,
    dateService: DateService
) {
    return rng.randomInterval(
        () => {
            const stock = market[ticker];
            const currPrice = stock.currPrice;
            const newPrice = GenerateNewPrice(
                stock.currPrice,
                rng,
                stock.tick,
                stock.directionInfluence
            );
            const date = dateService.ParseDate();

            const newStockHistory: PriceDataAtTime[] = AddNewPriceData(
                stock.history,
                date,
                newPrice
            );
            const latest = newStockHistory[newStockHistory.length - 1];

            const openPrice = newStockHistory[0].price.close;
            const delta = latest.price.close - openPrice;
            const percentage = delta / openPrice;
            const lastDelta = newPrice - currPrice;

            const newStockInfo = ReturnStockCopy(stock);
            newStockInfo.currPrice = newPrice;
            newStockInfo.delta = delta;
            newStockInfo.deltaPercentage = percentage;
            newStockInfo.lastDelta = lastDelta;
            newStockInfo.lastUpdate = date;
            newStockInfo.history = newStockHistory;

            market[stock.ticker] = newStockInfo;
            io.emit('message', 'stockinfo', { ticker: stock.ticker, data: newStockInfo });
            io.emit('message', 'stockprice', { ticker: stock.ticker, price: latest });
        },
        300,
        1000
    );
}

function GenerateNewPrice(
    currPrice: number,
    rng: RandomGenerator,
    tick: number,
    influence?: number
): number {
    return currPrice + rng.generateDirection(influence) * tick;
}

function AddNewPriceData(
    priceHistory: PriceDataAtTime[],
    time: string,
    price: number
): PriceDataAtTime[] {
    const history = priceHistory;
    let newPriceDataAtTime: PriceDataAtTime;
    if (history.length == 0) {
        newPriceDataAtTime = {
            time: time,
            price: {
                open: price,
                high: price,
                low: price,
                close: price
            }
        };
        history.push(newPriceDataAtTime);
        return history;
    }
    const latestEntry = history[history.length - 1];
    if (time != latestEntry.time) {
        //means we're one day ahead now
        newPriceDataAtTime = {
            time: time,
            price: {
                open: price,
                high: price,
                low: price,
                close: price
            }
        };
        history.push(newPriceDataAtTime);
        return history;
    }
    newPriceDataAtTime = {
        time: time,
        price: {
            open: latestEntry.price.open,
            high: price > latestEntry.price.high ? price : latestEntry.price.high,
            low: price < latestEntry.price.low ? price : latestEntry.price.low,
            close: price
        }
    };
    history[history.length - 1] = newPriceDataAtTime;
    return history;
}

function NewMarketHistory(market: Portfolio): MarketHistory {
    const history = {};
    Object.keys(market).forEach((ticker) => {
        history[ticker] = { ticker: ticker, priceHistory: [] };
    });
    return history;
}
//TODO: I don't like this, but i'm tired of dealing with I/O from file at this point.
const DefaultMarketPortfolio = function (): Portfolio {
    const stocks = {};
    stocks['NVDA'] = {
        ticker: 'NVDA',
        name: 'NVidia',
        currPrice: 10,
        tick: 0.1,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['AAPL'] = {
        ticker: 'AAPL',
        name: 'Apple',
        currPrice: 100,
        tick: 1,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['TSMC'] = {
        ticker: 'TSMC',
        name: 'Taiwan Semiconductor Company',
        currPrice: 30,
        tick: 0.1,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['AMD'] = {
        ticker: 'AMD',
        name: 'Advanced Micro Devices',
        currPrice: 40,
        tick: 0.1,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['MSFT'] = {
        ticker: 'MSFT',
        name: 'Microsoft',
        currPrice: 50,
        tick: 0.5,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['U'] = {
        ticker: 'U',
        name: 'Unity',
        currPrice: 60,
        tick: 0.5,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['WBUY'] = {
        ticker: 'WBUY',
        name: 'Worst Buy',
        currPrice: 70,
        tick: 0.5,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['DUO'] = {
        ticker: 'DUO',
        name: 'DuoLimbo',
        currPrice: 80,
        tick: 0.5,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['ETC'] = {
        ticker: 'ETC',
        name: 'Et Tu Chungus',
        currPrice: 90,
        tick: 0.5,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    stocks['BEEG'] = {
        ticker: 'BEEG',
        name: 'Beeg Beeg Games',
        currPrice: 100,
        tick: 1,
        quantity: 10_000,
        directionInfluence: 0.5,
        history: []
    };

    return stocks;
};

function ReturnStockCopy(stock: Stock): Stock {
    return {
        ticker: stock.ticker,
        name: stock.name,
        currPrice: stock.currPrice,
        quantity: stock.quantity,
        delta: stock.delta,
        deltaPercentage: stock.deltaPercentage,
        lastDelta: stock.lastDelta,
        tick: stock.tick,
        lastUpdate: stock.lastUpdate,
        directionInfluence: stock.directionInfluence,
        history: stock.history
    };
}
