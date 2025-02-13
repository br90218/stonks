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

const app = express();
const backendServer = createServer(app);
const io = new Server(backendServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

//TODO: magic number 1111
//TODO: can we object-ify these loops so each of them represent a stock?
const rng = new RandomGenerator('1111');

let runFile: RunFile | null;

//HACK: new market always
const market = InstantiateMarket();
let marketSimLoop: object;

function startStockEngine(): void {
    marketSimLoop = startAllStockSimulation(rng, io, market);
}

io.on('connection', (socket) => {
    socket.on('get-runfile', (callback): void => {
        console.log('retrieving runfile... expect only 1');
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

    socket.on('start-stocksim', (): void => {
        startStockEngine();
    });
});

backendServer.listen(3333, () => {
    console.log('listening at 3333');
});
