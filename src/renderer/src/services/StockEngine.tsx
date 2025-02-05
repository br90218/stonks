import { Stock } from './objects/Stock';

// saved stock snapshot should be saved in runfile?
function startStockEngine() {
    //TODO: check if runfile has stock snapshot
}

onmessage = (event) => {
    console.log('stock Engine begin');
    startStockEngine();
};
