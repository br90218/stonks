import { useEffect, useState } from 'react';

interface StockInfo {
    name: string;
    price: number;
    delta: number;
}

export function StockInfoButton(props: StockInfo) {
    const [name, setName] = useState(props.name);
    const [price, setPrice] = useState(props.price);
    const [delta, setDelta] = useState(props.delta);

    return (
        <button className="stock-info-button">
            <h1>{name}</h1>
            {price}
            <br />
            {delta}
        </button>
    );
}
