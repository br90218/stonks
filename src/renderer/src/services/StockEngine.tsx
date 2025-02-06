import { Portfolio } from './objects/Portfolio';
import { Stock } from './objects/Stock';

let market: Portfolio;

// saved stock snapshot should be saved in runfile?
function startStockEngine() {
    //TODO: check if runfile has stock snapshot
    market = generateNewMarket();
    stockEngineLoop(market);
}

function generateNewMarket() {
    return {
        stocks: [
            {
                name: 'NVDA',
                currPrice: 10,
                category: 'Tech'
            },
            {
                name: '3M',
                currPrice: 20,
                category: 'Cons'
            },
            {
                name: 'ATT',
                currPrice: 30,
                category: 'Tele'
            },
            {
                name: 'BEEG',
                currPrice: 40,
                category: 'Heal'
            }
        ]
    };
}

function stockEngineLoop(market: Portfolio) {
    SetRandomInterval(
        () => {
            console.log('Hi');
        },
        200,
        1000
    );
}

function stockGenerateNextPrice(stock: Stock) {}

function stopStockEngine() {}

onmessage = (event) => {
    console.log('stock Engine begin');
    startStockEngine();
};

function SetRandomInterval(intervalFunction, minDelay, maxDelay, ...args) {
    let timeout;

    const runInterval = () => {
        const timeoutFunction = () => {
            intervalFunction(args);
            runInterval();
        };

        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        timeout = setTimeout(timeoutFunction, delay);
    };

    runInterval();

    return {
        clear() {
            clearTimeout(timeout);
        }
    };
}
