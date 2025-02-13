import { BuyPanel } from '@renderer/components/BuyPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { Portfolio } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';

export function GameView(): JSX.Element {
    const [market, setMarket] = useState<Portfolio>();
    useEffect(() => {
        window.api.startStockSim();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(marketInfo, 1000);
        return (): void => clearTimeout(timeout);
    }, [market]);

    const marketInfo = async (): void => {
        const fetched = await window.api.getMarketPortfolio();
        setMarket(fetched);
    };

    return (
        <>
            <StockChartPanel market={market} />
            <BuyPanel />
            <StockInfoPanel market={market} />
        </>
    );
}
