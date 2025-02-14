import { EmptyStockInfo, StockInfo } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';

export function StockInfoButton(props: {
    stock: StockInfo | undefined;
    gvCallback: (childData: { msgType: string; arg?: string[] }) => void;
}): JSX.Element {
    const [stock, setStock] = useState<StockInfo>(EmptyStockInfo());
    const [direction, setDirection] = useState('equal');
    useEffect(() => {
        if (props.stock) setStock(props.stock);
    }, [props.stock]);

    useEffect(() => {
        console.log(stock.lastDelta);
        if (stock.lastDelta > 0) {
            setDirection('price-up');
        } else if (stock.lastDelta == 0) {
            setDirection('price-equal');
        } else {
            setDirection('price-down');
        }
    }, [stock]);

    function selectTicker(): void {
        if (stock) {
            props.gvCallback({ msgType: 'selectNewTicker', arg: [stock.ticker] });
        }
    }
    return (
        <button className="stock-info-button" onClick={selectTicker}>
            <h2 id="ticker">{stock?.ticker}</h2>
            <div id="name">{stock?.name}</div>
            <div className={direction} id="price">
                {stock?.currPrice.toFixed(2)}
            </div>
        </button>
    );
}
