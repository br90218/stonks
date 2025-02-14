import {
    CreateNewRunFile,
    RetrieveRunFile,
    RunFile,
    SaveRunFile
} from './services/SaveFileService';

import express, { Express } from 'express';
//TODO: investigate what cors really does to maximize inter-process security.
import { RandomGenerator } from './RandomGenerator';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { InstantiateMarket, startAllStockSimulation } from './services/MarketService';
import { DateService } from './services/DateService';

const app = express();
const backendServer = createServer(app);
const io = new Server(backendServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

//TODO: magic number 1111
const rng = new RandomGenerator('1111');

let runFile: RunFile | null;

//HACK: new market always
const market = InstantiateMarket();
let marketSimLoop: object;
let dateService: DateService;

function startStockEngine(): void {
    dateService = new DateService('2030-01-01');
    marketSimLoop = startAllStockSimulation(rng, io, market, dateService);
}

io.on('connection', (socket) => {
    socket.on('get-runfile', (callback): void => {
        runFile = RetrieveRunFile(true);
        callback({
            response: runFile
        });
    });

    socket.on('buy-stock', (stockName, price, quantity, callback): void => {
        console.log(`buying ${stockName} @ ${price} x ${quantity}`);

        callback({
            response: true
        });
    });

    socket.on('get-marketPortfolio', (callback): void => {
        callback({
            response: market
        });
    });

    socket.on('get-cash', (callback): void => {
        callback({
            response: runFile.cash
        });
    });

    socket.on('start-stocksim', (): void => {
        startStockEngine();
    });
});

backendServer.listen(3333, () => {
    console.log('listening at 3333');
});
