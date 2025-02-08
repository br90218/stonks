import { BuyPanel } from '@renderer/components/BuyPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';

export function GameView() {
    return (
        <>
            <StockChartPanel />
            <BuyPanel />
            <StockInfoPanel />
        </>
    );
}
