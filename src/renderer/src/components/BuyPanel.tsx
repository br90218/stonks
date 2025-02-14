import { CallBackMessage, EmptyStockInfo, StockInfo } from '@renderer/data/Interface';
import styles from '@renderer/assets/css/buypanel.module.css';
import { useEffect, useState } from 'react';

export function BuyPanel(props: {
    tickerToShow: string;
    stockInfo: StockInfo | undefined;
    gvCallback: (childData: CallBackMessage) => void;
}): JSX.Element {
    const [stock, setStock] = useState<StockInfo>(EmptyStockInfo());
    useEffect(() => {
        if (props.tickerToShow == props.stockInfo?.ticker) {
            setStock(props.stockInfo);
        }
    }, [props.tickerToShow, props.stockInfo]);

    function buyStock(quantity: number): void {
        if (stock) {
            props.gvCallback({
                msgType: 'buyStock',
                arg: [stock.ticker, stock.currPrice.toFixed(2), quantity.toString()]
            });
        }
    }

    return (
        <div className={styles.buyPanel}>
            <div className={styles.upperPane}>
                <div className={styles.stockInfo}>
                    <h1>{stock.ticker}</h1>
                    <p>{stock.name}</p>
                </div>
                <div className={styles.priceInfo}>
                    <h1>{stock.currPrice.toFixed(2)}</h1>
                </div>
            </div>
            <div className={styles.lowerPane}>
                <div className={styles.buyColumn}>
                    <h1>Buy</h1>
                    <button onClick={() => buyStock(1)}>1</button>
                    <button onClick={() => buyStock(10)}>10</button>
                    <button onClick={() => buyStock(100)}>100</button>
                </div>
                <div className={styles.portfolioColumn}>
                    <h1>Shares: 1000</h1>
                </div>
                <div className={styles.sellColumn}>
                    <h1>Sell</h1>
                    <button>1</button>
                    <button>10</button>
                    <button>100</button>
                </div>
            </div>
            <br />
        </div>
    );
}
