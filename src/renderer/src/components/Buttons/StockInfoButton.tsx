import { CallBackMessage, EmptyStockInfo, StockInfo } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/components/buttons/stockinfobutton.module.css';

export function StockInfoButton(props: {
    stock: StockInfo | undefined;
    gvCallback: (childData: CallBackMessage) => void;
}): JSX.Element {
    const [stock, setStock] = useState<StockInfo>(EmptyStockInfo);
    const [direction, setDirection] = useState('price-equal');
    //TODO: the loop here is wrong. Direction is usually one render slower than actual price move.
    useEffect(() => {
        if (props.stock) {
            setStock(props.stock);
            if (props.stock.lastDelta > 0) {
                setDirection(`${styles.priceUp}`);
            } else if (props.stock.lastDelta == 0) {
                setDirection(`${styles.priceEqual}`);
            } else {
                setDirection(`${styles.priceDown}`);
            }
        }
    }, [props.stock]);

    function selectTicker(): void {
        if (stock) {
            props.gvCallback({ msgType: 'selectNewTicker', arg: [stock.ticker] });
        }
    }

    useEffect(() => {}, []);

    return (
        <button className={styles.Button} onClick={selectTicker}>
            <h2 className={styles.Ticker}>{stock?.ticker}</h2>
            <div className={styles.Name}>{stock?.name}</div>
            <div className={`${styles.Price} ${direction}`}>{stock?.currPrice.toFixed(2)}</div>
            <div>+100%</div>
        </button>
    );
}
