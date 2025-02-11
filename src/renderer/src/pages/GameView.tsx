import { BuyPanel } from '@renderer/components/BuyPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { StockInfo } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';

export function GameView(): JSX.Element {
    const [stockInfo, setStockInfo] = useState<StockInfo>();
    useEffect(() => {
        window.api.onStockInfoChanged((value) => {
            setStockInfo({
                name: value.name,
                currPrice: parseFloat(value.currPrice)
            });
        });
    }, []);

    return (
        <>
            <StockChartPanel />
            <BuyPanel stock={stockInfo} />
            <StockInfoPanel />
        </>
    );
}
