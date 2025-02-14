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
import { BuyStock, InstantiateMarket, startAllStockSimulation } from './services/MarketService';
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
    socket.on('get-runfile', (args, callback): void => {
        runFile = RetrieveRunFile(true);
        callback({
            response: runFile
        });
    });

    socket.on('buy-stock', (args, callback): void => {
        console.log('bbb');
        const result = BuyStock(runFile, market, dateService, args[0], args[1], args[2]);
        callback({
            response: result
        });
    });

    socket.on('get-marketPortfolio', (args, callback): void => {
        callback({
            response: market
        });
    });

    socket.on('get-cash', (args, callback): void => {
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
