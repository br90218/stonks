import { Server } from 'socket.io';
import { RandomGenerator } from '../RandomGenerator';
import { Portfolio, Stock } from './Objects';
import { RunFile } from './Objects';

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
    market: Portfolio
): object {
    const stockSimulationLoops = {};

    Object.keys(market).forEach((ticker) => {
        stockSimulationLoops[ticker] = StockSimulationLoop(rng, io, ticker, market);
    });

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

function StockSimulationLoop(rng: RandomGenerator, io: Server, ticker: string, market: Portfolio) {
    return rng.randomInterval(
        () => {
            const stock = market[ticker];
            const newStockInfo: Stock = {
                ticker: stock.ticker,
                name: stock.name,
                currPrice: stock.currPrice + rng.generateDirection() * stock.tick,
                tick: stock.tick, // TODO: shuld change when price is at a certain threshold
                quantity: stock.quantity,
                lastUpdate: new Date()
            };
            market[stock.ticker] = newStockInfo;
            io.emit('message', 'stockinfo', newStockInfo);
        },
        300,
        1000
    );
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
