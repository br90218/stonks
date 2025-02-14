import { CallBackMessage, EmptyStockInfo, StockInfo } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';

export function StockInfoButton(props: {
    stock: StockInfo | undefined;
    gvCallback: (childData: CallBackMessage) => void;
}): JSX.Element {
    const [stock, setStock] = useState<StockInfo>(EmptyStockInfo());
    const [direction, setDirection] = useState('price-equal');
    //TODO: the loop here is wrong. Direction is usually one render slower than actual price move.
    useEffect(() => {
        if (props.stock) {
            setStock(props.stock);
            if (props.stock.lastDelta > 0) {
                setDirection('price-up');
            } else if (props.stock.lastDelta == 0) {
                setDirection('price-equal');
            } else {
                setDirection('price-down');
            }
        }
    }, [props.stock]);

    useEffect(() => {}, [stock]);

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
