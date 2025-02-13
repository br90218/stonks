import { StockInfo } from '@renderer/data/Interface';
import { useEffect, useRef, useState } from 'react';

export function StockInfoButton(props: { stock: StockInfo | undefined }): JSX.Element {
    const [stock, setStock] = useState<StockInfo | undefined>(props.stock);
    const direction = useRef('equal');
    useEffect(() => {
        if (!props.stock) {
            return;
        }

        //TODO: I kinda want this logic to be handled in the backend
        if (stock) {
            if (props.stock.currPrice > stock.currPrice) {
                direction.current = 'price-up';
            } else if (props.stock.currPrice == stock.currPrice) {
                direction.current = 'price-equal';
            } else {
                direction.current = 'price-down';
            }
        }

        setStock(props.stock);
    }, [props.stock]);
    return (
        <button className="stock-info-button">
            <h2 id="ticker">{stock?.ticker}</h2>
            <div id="name">{stock?.name}</div>
            <div className={direction.current} id="price">
                {stock?.currPrice.toFixed(2)}
            </div>
        </button>
    );
}
