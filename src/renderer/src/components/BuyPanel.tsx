import { useState } from 'react';

export function BuyPanel() {
    const [stockName, setStockName] = useState('NVDA');

    return (
        <div id="buy-panel">
            <h1>{stockName}</h1>
            <button>Buy 1</button>
            <button>Buy 10</button>
            <button>Buy 100</button>
            <br />
            <button>Sell 1</button>
            <button>Sell 10</button>
            <button>Sell 100</button>
        </div>
    );
}
