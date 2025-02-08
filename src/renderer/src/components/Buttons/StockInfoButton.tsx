import { useState } from 'react';

interface StockInfo {
    name: string;
    price: number;
    delta: number;
}

export function StockInfoButton(props: StockInfo) {
    const name = useState(props.name)[0];
    const price = useState(props.price)[0];
    const delta = useState(props.delta)[0];

    return (
        <button className="stock-info-button">
            <h1>{name}</h1>
            {price}
            <br />
            {delta}
        </button>
    );
}
