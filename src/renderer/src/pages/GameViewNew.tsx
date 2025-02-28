import styles from '@renderer/assets/css/pages/gameview.module.css';
import { BuyPanel } from '@renderer/components/BuyPanel';
import { InventoryPanel } from '@renderer/components/InventoryPanel';
import { NewsFlashPanel } from '@renderer/components/NewsFlashPanel';
import ControlsPanel from '@renderer/components/Panels/ControlsPanel';
import StatusPanel from '@renderer/components/Panels/StatusPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { CallBackMessage } from '@renderer/data/Interface';
import { useEffect } from 'react';

export default function GameView(): JSX.Element {
    useEffect(() => {
        window.api.startStockSim();
    }, []);
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <NewsFlashPanel />
            </div>
            <div className={styles.chart}>
                <StockChartPanel market={undefined} />
            </div>
            <div className={styles.stock}>
                <StockInfoPanel
                    gvCallback={function (childData: { msgType: string; arg?: string[] }): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            </div>
            <div className={styles.trade}>
                <BuyPanel
                    tickerToShow={''}
                    marketStockInfo={undefined}
                    playerStockPortfolio={undefined}
                    gvCallback={function (childData: CallBackMessage): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            </div>
            <div className={styles.items}>
                <InventoryPanel />
            </div>
            <div className={styles.footer}>
                <StatusPanel />
            </div>
            <div className={styles.control}>
                <ControlsPanel />
            </div>
        </div>
    );
}
