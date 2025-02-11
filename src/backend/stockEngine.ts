import {
    CreateNewRunFile,
    RetrieveRunFile,
    RunFile,
    SaveRunFile
} from './services/SaveFileService';

import StockInfo from './services/Objects';

import express, { Express } from 'express';
//TODO: investigate what cors really does to maximize inter-process security.
import { RandomGenerator } from './RandomGenerator';
import { Server } from 'socket.io';
import { createServer } from 'http';

// class StockEngine {
//     private engine: Express;
//     private rng: RandomGenerator;
//     private io: Server;

//     constructor() {
//         this.engine = express();
//         let server = createServer(this.engine);
//         this.io = new Server(server, {
//             cors: {
//                 origin: 'http://localhost:5173', // Adjust if your React app is hosted elsewhere
//                 methods: ['GET', 'POST']
//             }
//         });
//         this.rng = new RandomGenerator('1111');

//         server.listen(3333, () => {
//             console.log('listening to 3333');
//         });

//         this.io.on('connection', (socket) => {
//             console.log('frontend connected');
//         });
//     }

//     startExpressServer(port: number) {
//         this.engine.get('/get-runfile', cors(), (req, res) => {
//             console.log('getting existing runfile. expecting only 1');
//             let runFile = RetrieveRunFile(true);
//             res.send(JSON.stringify(runFile));
//         });

//         this.io.on('connection', (socket) => {
//             console.log('frontend connected');
//         });
//     }

//     startStockEngineLoop() {
//         let directionLoop = this.rng.randomInterval(
//             () => {
//                 let direction = this.rng.generateDirection();
//                 console.log(direction);
//                 this.engine.post('http://localhost:5173/direction');
//             },
//             300,
//             1000
//         );
//     }
// }

// function startStockEngine() {
//     // let rng = new RandomGenerator('111');
//     // setInterval(() => {
//     //     console.log('this is ping cycle 1000' + rng.generatePosOrNeg());
//     // }, 1000);
//     // setInterval(() => {
//     //     console.log('this is ping cycle 500' + rng.generatePosOrNeg());
//     // }, 500);
//     let stockEngine = new StockEngine();
//     //stockEngine.startExpressServer(3333);
//     //stockEngine.startStockEngineLoop();
//     return stockEngine;
// }

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

startStockEngine();
function startStockEngine(): void {
    let NVDASTOCKLOOP = rng.randomInterval(
        () => {
            const newStockInfo: StockInfo = {
                name: 'NVDA',
                currPrice: 10 + rng.generateDirection() * 0.1,
                tick: 0.1
            };
            io.emit('message', 'stockinfo', newStockInfo);
        },
        300,
        1000
    );
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
});

backendServer.listen(3333, () => {
    console.log('listening at 3333');
});
