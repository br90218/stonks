import { CallBackMessage, Portfolio, StockInfo } from '@renderer/data/Interface';
import { StockInfoButton } from './Buttons/StockInfoButton';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/stockinfopanel.module.css';

function StockButtonList(props: {
    stockList: { id: string; stock: StockInfo }[] | undefined;
    gvCallback: (childData: CallBackMessage) => void;
}): JSX.Element {
    const [buttonsList, setButtonsList] = useState<{ id: string; stock: StockInfo }[]>([]);

    useEffect(() => {
        let list: { id: string; stock: StockInfo }[] = [];
        props.stockList?.forEach((stock) => {
            list = list.concat({ id: stock.id, stock: stock.stock });
        });
        setButtonsList(list);
        // console.log(buttonsList);
    }, [props.stockList]);

    return (
        <ul className={styles.stockList} style={{ height: '100%', padding: '10px' }}>
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
    const [stockList, setStockList] = useState<{ id: string; stock: StockInfo }[]>();
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
    return (
        <div className={styles.stockListWrapper}>
            <StockButtonList stockList={stockList} gvCallback={props.gvCallback} />
        </div>
    );
}
