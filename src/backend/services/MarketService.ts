import { Server } from 'socket.io';
import { RandomGenerator } from '../RandomGenerator';
import {
    MarketPortfolio,
    MarketStock,
    PlayerPosition,
    Portfolio,
    PriceDataAtTime,
    Stock,
    StockGetResponse,
    StockOperationResponse
} from './Objects';
import { RunFile } from './Objects';
import { DateService } from './DateService';

export function GetMarketStock(
    marketPortfolio: MarketPortfolio,
    tickers?: string[]
): StockGetResponse {
    const result: MarketStock[] = [];

    if (tickers && tickers.length > 0) {
        tickers.forEach((ticker) => {
            result.push(marketPortfolio.stocks[ticker]);
        });
    } else {
        Object.keys(marketPortfolio.stocks).forEach((ticker) => {
            result.push(marketPortfolio.stocks[ticker]);
        });
    }
    return {
        result: true,
        detail: 'ok',
        data: { stocks: result }
    };
}

export function GetPlayerStock(runFile: RunFile, tickers?: string[]): StockGetResponse {
    if (!runFile.portfolio) {
        return {
            result: false,
            detail: 'no-portfolio',
            data: undefined
        };
    }
    const playerLongPositions = runFile.portfolio.longPosition;
    const playerShortPositions = runFile.portfolio.shortPosition;
    const stocks: Stock[] = [];
    if (tickers && tickers.length > 0) {
        tickers.forEach((ticker) => {
            if (playerLongPositions[ticker]) {
                stocks.push(playerLongPositions[ticker]);
            }
            if (playerShortPositions[ticker]) {
                stocks.push(playerShortPositions[ticker]);
            }
        });
    } else {
        Object.keys(playerLongPositions).forEach((ticker) => {
            stocks.push(playerLongPositions[ticker]);
        });
        Object.keys(playerShortPositions).forEach((ticker) => {
            stocks.push(playerShortPositions[ticker]);
        });
    }
    return {
        result: true,
        detail: 'ok',
        data: { stocks: stocks }
    };
}

export function BuyStock(
    runFile: RunFile,
    market: MarketPortfolio,
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

    //NOTE: buying assumes no slippage;
    // it also means that orders will be fulfilled regardless
    // of the quoted price.

    const currentUserStock = runFile.portfolio.longPosition[ticker];
    const stockName = market.stocks[ticker].name;

    const updatedUserStock: PlayerPosition = {
        ticker: ticker,
        name: currentUserStock ? currentUserStock.name : stockName,
        averagePrice: calculateAveragePrice(
            currentUserStock ? currentUserStock.currPrice : 0,
            currentUserStock ? currentUserStock.quantity : 0,
            price,
            quantity
        ),
        quantity: currentUserStock ? currentUserStock.quantity + quantity : quantity,
        isLongPosition: true
    };

    runFile.portfolio.longPosition[ticker] = updatedUserStock;
    runFile.cash -= quantity * price;

    return {
        result: true,
        detail: 'ok',
        data: { newRemainingCash: runFile.cash, stock: updatedUserStock }
    };
}

export function SellStock(
    runFile: RunFile,
    market: MarketPortfolio,
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

    const playerPosition = runFile.portfolio.longPosition[ticker];

    if (!playerPosition || playerPosition.quantity < quantity) {
        return { result: false, detail: 'insufficient-stock' };
    }

    if (quantity == playerPosition.quantity) {
        delete runFile.portfolio.longPosition[ticker];
    } else {
        const updatedUserStock: PlayerPosition = {
            ticker: ticker,
            name: playerPosition.name,
            quantity: playerPosition.quantity - quantity,
            isLongPosition: true,
            averagePrice: playerPosition.averagePrice
        };
        runFile.portfolio.longPosition[ticker] = updatedUserStock;
    }

    runFile.cash += quantity * price;
    return {
        result: true,
        detail: 'ok',
        data: {
            newRemainingCash: runFile.cash,
            stock: runFile.portfolio.longPosition[ticker] ?? undefined
        }
    };
}

export function ShortStock(
    runFile: RunFile,
    market: MarketPortfolio,
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

    const shortPositionExists = runFile.portfolio.shortPosition.stocks[ticker] != undefined;
    const stockName = market.stocks[ticker].name;

    if (shortPositionExists) {
        const currentPosition = runFile.portfolio.shortPosition.stocks[ticker] as PlayerPosition;
        const newAveragePrice =
            (currentPosition.quantity * currentPosition.averagePrice + quantity * price) /
            (quantity + currentPosition.quantity);

        const newPosition: PlayerPosition = {
            ticker: ticker,
            name: stockName,
            quantity: quantity + currentPosition.quantity,
            averagePrice: newAveragePrice,
            isLongPosition: false
        };
        runFile.portfolio.shortPosition[ticker] = newPosition;
    } else {
        const newPosition: PlayerPosition = {
            ticker: ticker,
            name: stockName,
            quantity: quantity,
            averagePrice: price,
            isLongPosition: false
        };
        runFile.portfolio.shortPosition[ticker] = newPosition;
    }
    runFile.cash = runFile.cash + quantity * price;

    return {
        result: true,
        detail: 'ok',
        data: {
            newRemainingCash: runFile.cash,
            stock: runFile.portfolio.shortPosition[ticker]
        }
    };
}

export function BuybackStock(
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

    const playerPosition: PlayerPosition = runFile.portfolio.shortPosition[ticker];

    if (!playerPosition || playerPosition.quantity < quantity) {
        console.error(`player has not enough position`);
        return { result: false, detail: 'insufficient-quantity' };
    }

    if (quantity * price > runFile.cash) {
        console.error(`player has not enough cash`);
        return { result: false, detail: 'insufficient-cash' };
    }

    if (playerPosition.quantity == quantity) {
        delete runFile.portfolio.shortPosition[ticker];
    } else {
        const updatedPosition: PlayerPosition = {
            isLongPosition: false,
            averagePrice: playerPosition.averagePrice,
            quantity: playerPosition.quantity - quantity,
            ticker: ticker,
            name: playerPosition.name
        };
        runFile.portfolio.shortPosition[ticker] = updatedPosition;
    }
    runFile.cash = runFile.cash - quantity * price;
    return {
        result: true,
        detail: 'ok',
        data: {
            newRemainingCash: runFile.cash,
            stock: runFile.portfolio.shortPosition[ticker] ?? undefined
        }
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

// export function LoadMarket(): Portfolio {
//     let marketPf: Portfolio;

//     return marketPf;
// }

export function startAllStockSimulation(
    rng: RandomGenerator,
    io: Server,
    market: MarketPortfolio,
    dateService: DateService
): {
    [ticker: string]: { clear(): void };
} {
    const stockSimulationLoops: {
        [ticker: string]: { clear(): void };
    } = {};

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

export function GetMarketStockHistory(market: Portfolio, ticker: string): PriceDataAtTime[] {
    return market[ticker].history;
}

//TODO: does not catch exception when market[ticker] returns jackshit
export function AddInfluenceToStock(
    market: MarketPortfolio,
    ticker: string,
    influence: number
): void {
    const newStock = MakeMarketStockCopy(market[ticker]);
    newStock.influenceDirection = Math.max(0, Math.min(newStock.influenceDirection + influence, 1));
    market[ticker] = newStock;
}

//TODO: does not catch exception when market[ticker] returns jackshit
export function SetTickToStock(market: Portfolio, ticker: string, newTick: number): void {
    const newStock = MakeMarketStockCopy(market[ticker]);
    newStock.tick = newTick;
    market[ticker] = newStock;
}

function StockSimulationLoop(
    rng: RandomGenerator,
    io: Server,
    ticker: string,
    market: MarketPortfolio,
    dateService: DateService
): { clear(): void } {
    return rng.randomInterval(
        () => {
            const stock = market[ticker];
            const currPrice = stock.currPrice;
            const newPrice = GenerateNewPrice(
                stock.currPrice,
                rng,
                stock.tick,
                stock.influenceDirection
            );
            const date = dateService.ParseDate();

            const newStockHistory: PriceDataAtTime[] = AddNewPriceData(
                stock.history,
                date,
                newPrice
            );
            const latest = newStockHistory[newStockHistory.length - 1];

            const openPrice = newStockHistory[0].close;
            const delta = latest.close - openPrice;
            const percentage = delta / openPrice;
            const lastDelta = newPrice - currPrice;

            const newStockInfo = MakeMarketStockCopy(stock);
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
            open: price,
            high: price,
            low: price,
            close: price
        };
        history.push(newPriceDataAtTime);
        return history;
    }
    const latestEntry = history[history.length - 1];
    if (time != latestEntry.time) {
        //means we're one day ahead now
        newPriceDataAtTime = {
            time: time,
            open: price,
            high: price,
            low: price,
            close: price
        };
        history.push(newPriceDataAtTime);
        return history;
    }
    newPriceDataAtTime = {
        time: time,
        open: latestEntry.open,
        high: price > latestEntry.high ? price : latestEntry.high,
        low: price < latestEntry.low ? price : latestEntry.low,
        close: price
    };
    history[history.length - 1] = newPriceDataAtTime;
    return history;
}

// function NewMarketHistory(market: Portfolio): MarketHistory {
//     const history = {};
//     Object.keys(market).forEach((ticker) => {
//         history[ticker] = { ticker: ticker, priceHistory: [] };
//     });
//     return history;
// }
//TODO: I don't like this, but i'm tired of dealing with I/O from file at this point.
const DefaultMarketPortfolio = function (): MarketPortfolio {
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

    return { stocks: stocks };
};

function MakeMarketStockCopy(stock: MarketStock): MarketStock {
    return {
        ticker: stock.ticker,
        name: stock.name,
        currPrice: stock.currPrice,
        delta: stock.delta,
        deltaPercentage: stock.deltaPercentage,
        lastDelta: stock.lastDelta,
        tick: stock.tick,
        lastUpdate: stock.lastUpdate,
        influenceDirection: stock.influenceDirection,
        history: stock.history
    };
}
