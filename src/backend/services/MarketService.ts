import { Portfolio, Stock } from './Objects';
import { RunFile } from './Objects';

export function BuyStock(
    runFile: RunFile,
    market: Portfolio,
    stockName: string,
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

    const portfolioStock = runFile.portfolio?.collection[stockName];
    const marketStock = market.collection[stockName];

    const updatedStock: Stock = {
        name: portfolioStock ? portfolioStock.name : marketStock.name,
        currPrice: calculateAveragePrice(
            portfolioStock ? portfolioStock.currPrice : 0,
            portfolioStock ? portfolioStock.quantity : 0,
            price,
            quantity
        ),
        quantity: portfolioStock ? portfolioStock.quantity + quantity : quantity,
        tick: marketStock.tick
    };

    const updatedMarketStock: Stock = {
        name: marketStock.name,
        currPrice: marketStock.currPrice,
        quantity: marketStock.quantity - quantity,
        tick: marketStock.tick
    };

    runFile.portfolio.collection[stockName] = updatedStock;
    marketStock.collection[stockName] = updatedMarketStock;
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
    let marketPf: Portfolio;

    return marketPf;
}
