import { Market, StockInfo } from '@renderer/data/Interface';
import { StockInfoButton } from './Buttons/StockInfoButton';
import { useEffect, useState } from 'react';

function StockButtonList(props: { stockList: { id: string; stock: StockInfo }[] | undefined }) {
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
        <ul>
            {buttonsList.map((item) => {
                return (
                    <li key={item.id}>
                        <StockInfoButton
                            stock={{
                                ticker: item.stock.ticker,
                                name: item.stock.name,
                                currPrice: item.stock.currPrice
                            }}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

export function StockInfoPanel(props: { market?: Market | undefined }) {
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
        <div>
            <StockButtonList stockList={stockList} />
        </div>
    );
}
