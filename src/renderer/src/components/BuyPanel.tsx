import {
    CallBackMessage,
    EmptyPortfolio,
    EmptyStockInfo,
    Portfolio,
    StockInfo
} from '@renderer/data/Interface';
import styles from '@renderer/assets/css/buypanel.module.css';
import { useEffect, useRef, useState } from 'react';

export function BuyPanel(props: {
    tickerToShow: string;
    marketStockInfo: StockInfo | undefined;
    playerStockPortfolio: Portfolio | undefined;
    gvCallback: (childData: CallBackMessage) => void;
}): JSX.Element {
    const [marketStockInfo, setMarketStockInfo] = useState<StockInfo>(EmptyStockInfo);
    const [playerStockInfoToDisplay, setPlayerStockInfoToDisplay] =
        useState<StockInfo>(EmptyStockInfo);
    const gvCallback = useRef(props.gvCallback);
    const tickerShown = useRef('NVDA');

    useEffect(() => {
        if (props.tickerToShow == props.marketStockInfo?.ticker) {
            setMarketStockInfo(props.marketStockInfo);
        }
        if (props.tickerToShow && props.tickerToShow != '') {
            tickerShown.current = props.tickerToShow;
        }
    }, [props.tickerToShow, props.marketStockInfo]);

    useEffect(() => {
        if (props.playerStockPortfolio && marketStockInfo) {
            Object.keys(props.playerStockPortfolio).forEach((ticker) => {
                console.log(marketStockInfo.ticker);
                if (ticker == tickerShown.current) {
                    setPlayerStockInfoToDisplay(props.playerStockPortfolio![ticker]);
                } else {
                    setPlayerStockInfoToDisplay(EmptyStockInfo);
                }
            });
        }
    }, [props.playerStockPortfolio]);

    function buyStock(quantity: number): void {
        if (marketStockInfo) {
            gvCallback.current({
                msgType: 'buyStock',
                arg: [
                    marketStockInfo.ticker,
                    marketStockInfo.currPrice.toFixed(2),
                    quantity.toString()
                ]
            });
        }
    }

    function sellStock(quantity: number): void {
        if (marketStockInfo) {
            gvCallback.current({
                msgType: 'sellStock',
                arg: [
                    marketStockInfo.ticker,
                    marketStockInfo.currPrice.toFixed(2),
                    quantity.toString()
                ]
            });
        }
    }

    return (
        <div className={styles.buyPanel}>
            <div className={styles.upperPane}>
                <div className={styles.stockInfo}>
                    <h1>{marketStockInfo.ticker}</h1>
                    <p>{marketStockInfo.name}</p>
                </div>
                <div className={styles.priceInfo}>
                    <h1>{marketStockInfo.currPrice.toFixed(2)}</h1>
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
                    <h1>Shares: {playerStockInfoToDisplay.quantity}</h1>
                </div>
                <div className={styles.sellColumn}>
                    <h1>Sell</h1>
                    <button onClick={() => sellStock(1)}>1</button>
                    <button onClick={() => sellStock(10)}>10</button>
                    <button onClick={() => sellStock(100)}>100</button>
                </div>
            </div>
            <br />
        </div>
    );
}
