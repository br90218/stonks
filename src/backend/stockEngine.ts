import { RandomGenerator } from './RandomGenerator';

startStockEngine();

process.on('message', function (message) {
    console.log(`Message from main: ${message}`);
    process.send!('pong');
});

function startStockEngine() {
    let rng = new RandomGenerator('111');

    setInterval(() => {
        console.log('this is ping cycle 1000' + rng.generatePosOrNeg());
    }, 1000);

    setInterval(() => {
        console.log('this is ping cycle 500' + rng.generatePosOrNeg());
    }, 500);
}
