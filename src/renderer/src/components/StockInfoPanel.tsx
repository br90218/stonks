import { CallBackMessage, EmptyStockInfo, Portfolio, StockInfo } from '@renderer/data/Interface';
import { StockInfoButton } from './Buttons/StockInfoButton';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/stockinfopanel.module.css';

const MARKET_UPDATE_INTERVAL = 1_000;

function StockButtonList(props: {
    stockList: { id: string; stock: StockInfo }[] | undefined;
    gvCallback: (childData: CallBackMessage) => void;
}): JSX.Element {
    const [buttonsList, setButtonsList] = useState<{ id: string; stock: StockInfo }[]>([
        { id: 'NVDA', stock: EmptyStockInfo() }
    ]);

    useEffect(() => {
        let list: { id: string; stock: StockInfo }[] = [];
        props.stockList?.forEach((stock) => {
            list = list.concat({ id: stock.id, stock: stock.stock });
        });
        setButtonsList(list);
    }, [props.stockList]);

    return (
        <ul className={styles.stockList}>
            {buttonsList.map((item) => {
                return (
                    <li style={{ float: 'left', height: '100%' }} key={item.id}>
                        <StockInfoButton
                            stock={{
                                ticker: item.stock.ticker,
                                name: item.stock.name,
                                currPrice: item.stock.currPrice,
                                delta: item.stock.delta,
                                deltaPercentage: item.stock.deltaPercentage,
                                lastDelta: item.stock.lastDelta
                            }}
                            gvCallback={props.gvCallback}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export function StockInfoPanel(props: {
    market?: Portfolio | undefined;
    gvCallback: (childData: { msgType: string; arg?: string[] }) => void;
}): JSX.Element {
    const [stockList, setStockList] = useState<{ id: string; stock: StockInfo }[]>([
        { id: 'NVDA', stock: EmptyStockInfo() }
    ]);

    useEffect(() => {
        const timeout = setTimeout(getNewStockInfos, MARKET_UPDATE_INTERVAL);
        return (): void => clearTimeout(timeout);
    }, [stockList]);

    useEffect(() => {
        const list: { id: string; stock: StockInfo }[] = [];
        if (!props.market) {
            return;
        }
        Object.keys(props.market).forEach((ticker) => {
            list.push({ id: ticker, stock: props.market[ticker] });
        });
        setStockList(list);
    }, [props.market]);

    const getNewStockInfos = async (): Promise<void> => {
        const request = await window.api.getMarketStock();
        if (request.result) {
            const list: { id: string; stock: StockInfo }[] = [];
            request.data.stocks.forEach((item) => {
                list.push({
                    id: item.ticker,
                    stock: {
                        ticker: item.ticker,
                        name: item.name,
                        currPrice: item.currPrice,
                        delta: item.delta,
                        deltaPercentage: item.deltaPercentage,
                        lastDelta: item.lastDelta,
                        quantity: /*TODO:CHANGE THIS*/ 100_000
                    }
                });
            });
            setStockList(list);
        }
    };

    return (
        <div className={styles.wrapper}>
            <StockButtonList stockList={stockList} gvCallback={props.gvCallback} />
        </div>
    );
}
