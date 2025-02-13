import { Server } from 'socket.io';
import { RandomGenerator } from '../RandomGenerator';
import { MarketHistory, Portfolio, PriceDataAtTime, Stock } from './Objects';
import { RunFile } from './Objects';
import { DateService } from './DateService';

export function BuyStock(
    runFile: RunFile,
    market: Portfolio,
    ticker: string,
    price: number,
    quantity: number
): RunFile {
    if (!runFile || !runFile.portfolio) {
        console.error(
            `did not supply runFile or runFile portfolio does not exist when buying stock`
        );
        return runFile;
    }
    if (!market) {
        console.error(`did not supply market when buying stock`);
        return runFile;
    }

    //NOTE: this buying mechanism assumes no slippage;
    // it also means that orders will be fulfilled regardless
    // of the quoted price.

    const portfolioStock = runFile.portfolio?.[ticker];
    const marketStock = market[ticker];
    const updateTime = new Date();

    const updatedStock: Stock = {
        ticker: ticker,
        name: portfolioStock ? portfolioStock.name : marketStock.name,
        currPrice: calculateAveragePrice(
            portfolioStock ? portfolioStock.currPrice : 0,
            portfolioStock ? portfolioStock.quantity : 0,
            price,
            quantity
        ),
        quantity: portfolioStock ? portfolioStock.quantity + quantity : quantity,
        tick: marketStock.tick,
        lastUpdate: updateTime
    };

    const updatedMarketStock: Stock = {
        ticker: ticker,
        name: marketStock.name,
        currPrice: marketStock.currPrice,
        quantity: marketStock.quantity - quantity,
        tick: marketStock.tick,
        lastUpdate: updateTime
    };

    runFile.portfolio[ticker] = updatedStock;
    marketStock[ticker] = updatedMarketStock;
    return runFile;
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
    const marketHistory = NewMarketHistory(market);

    Object.keys(market).forEach((ticker) => {
        stockSimulationLoops[ticker] = StockSimulationLoop(
            rng,
            io,
            ticker,
            market,
            marketHistory,
            dateService
        );
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

function StockSimulationLoop(
    rng: RandomGenerator,
    io: Server,
    ticker: string,
    market: Portfolio,
    history: MarketHistory,
    dateService: DateService
) {
    return rng.randomInterval(
        () => {
            const stock = market[ticker];
            const newPrice = stock.currPrice + rng.generateDirection() * stock.tick;
            const newStockInfo: Stock = {
                ticker: stock.ticker,
                name: stock.name,
                currPrice: newPrice,
                tick: stock.tick, // TODO: shuld change when price is at a certain threshold
                quantity: stock.quantity,
                lastUpdate: dateService.ParseDate()
            };
            market[stock.ticker] = newStockInfo;

            history[stock.ticker].priceHistory = AddNewPriceData(
                history[stock.ticker].priceHistory,
                newStockInfo.lastUpdate,
                newPrice
            );
            const latest =
                history[stock.ticker].priceHistory[history[stock.ticker].priceHistory.length - 1];
            io.emit('message', 'stockprice', { ticker: stock.ticker, data: latest });
        },
        300,
        1000
    );
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
    } else {
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
        } else {
            newPriceDataAtTime = {
                time: time,
                price: {
                    open: latestEntry.price.open,
                    high: price > latestEntry.price.high ? price : latestEntry.price.high,
                    low: price < latestEntry.price.low ? price : latestEntry.price.low,
                    close: price
                }
            };
        }
    }
    history.push(newPriceDataAtTime);
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
        quantity: 10_000
    } as Stock;

    stocks['AAPL'] = {
        ticker: 'AAPL',
        name: 'Apple',
        currPrice: 20,
        tick: 0.1,
        quantity: 10_000
    } as Stock;

    // stocks['TSMC'] = {
    //     ticker: 'TSMC',
    //     name: 'Taiwan Semiconductor Company',
    //     currPrice: 30,
    //     tick: 0.1,
    //     quantity: 10_000
    // } as Stock;

    // stocks['AMD'] = {
    //     ticker: 'AMD',
    //     name: 'Advanced Micro Devices',
    //     currPrice: 40,
    //     tick: 0.1,
    //     quantity: 10_000
    // } as Stock;

    // stocks['MSFT'] = {
    //     ticker: 'MSFT',
    //     name: 'Microsoft',
    //     currPrice: 50,
    //     tick: 0.5,
    //     quantity: 10_000
    // } as Stock;

    // stocks['U'] = {
    //     ticker: 'U',
    //     name: 'Unity',
    //     currPrice: 60,
    //     tick: 0.5,
    //     quantity: 10_000
    // } as Stock;

    // stocks['WBUY'] = {
    //     ticker: 'WBUY',
    //     name: 'Worst Buy',
    //     currPrice: 70,
    //     tick: 0.5,
    //     quantity: 10_000
    // } as Stock;

    // stocks['DUO'] = {
    //     ticker: 'DUO',
    //     name: 'DuoLingo',
    //     currPrice: 80,
    //     tick: 0.5,
    //     quantity: 10_000
    // } as Stock;

    // stocks['ETC'] = {
    //     ticker: 'ETC',
    //     name: 'Et Tu Chungus',
    //     currPrice: 90,
    //     tick: 0.5,
    //     quantity: 10_000
    // } as Stock;

    // stocks['BEEG'] = {
    //     ticker: 'BEEG',
    //     name: 'Beeg Beeg Games',
    //     currPrice: 100,
    //     tick: 1,
    //     quantity: 10_000
    // } as Stock;

    return stocks;
};
