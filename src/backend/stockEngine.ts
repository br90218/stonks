import { RetrieveRunFile } from './services/SaveFileService';

import express from 'express';
import { RandomGenerator } from './RandomGenerator';
import { Server } from 'socket.io';
import { createServer } from 'http';
import {
    AddInfluenceToStock,
    BuyStock,
    GetMarketStock,
    GetMarketStockHistory,
    GetPlayerStock,
    InstantiateMarket,
    SellStock,
    SetTickToStock,
    StartAllStockSimulation
} from './services/MarketService';
import { DateService } from './services/DateService';
import { RunFile } from './services/Objects';

const app = express();
const backendServer = createServer(app);

//TODO: investigate what cors really does
const io = new Server(backendServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

//TODO: magic number 1111
const rng = new RandomGenerator('1111');

let runFile: RunFile | undefined;

//HACK: new market always
const market = InstantiateMarket();
// let marketSimLoop: {
//     [ticker: string]: { clear(): void };
// };
let dateService: DateService;

function startStockEngine(): void {
    dateService = new DateService('2030-01-01');
    // marketSimLoop = startAllStockSimulation(rng, io, market, dateService);
    StartAllStockSimulation(rng, io, market, dateService);
}

io.on('connection', (socket) => {
    socket.on('get-runfile', (_, callback): void => {
        runFile = RetrieveRunFile(true);
        callback({
            response: runFile
        });
    });

    socket.on('buy-stock', (args, callback): void => {
        //This should only return the updated / bought stock
        const result = BuyStock(runFile!, market, dateService, args[0], args[1], args[2]);
        callback({
            response: result
        });
    });

    socket.on('sell-stock', (args, callback): void => {
        //This should only return the updated / bought stock
        const result = SellStock(runFile!, market, dateService, args[0], args[1], args[2]);
        callback({
            response: result
        });
    });

    socket.on('get-marketPortfolio', (_, callback): void => {
        callback({
            response: market
        });
    });

    socket.on('set-stock-influence', (args): void => {
        AddInfluenceToStock(market, args[0], args[1]);
    });

    socket.on('set-stock-tick', (args): void => {
        SetTickToStock(market, args[0], args[1]);
    });

    socket.on('get-marketStock', (args, callback): void => {
        callback({
            response: GetMarketStock(market, args)
        });
    });

    socket.on('get-marketStock-history', (args, callback): void => {
        callback({
            response: GetMarketStockHistory(market, args[0])
        });
    });

    socket.on('get-playerStock', (args, callback): void => {
        callback({
            response: GetPlayerStock(runFile!, args)
        });
    });

    socket.on('get-cash', (_, callback): void => {
        callback({
            response: runFile!.cash
        });
    });

    socket.on('start-stocksim', (): void => {
        startStockEngine();
    });
});

backendServer.listen(3333, () => {
    console.log('listening at 3333');
});
