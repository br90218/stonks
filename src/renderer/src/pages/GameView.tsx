import { BuyPanel } from '@renderer/components/BuyPanel';
import { NewsFlashPanel } from '@renderer/components/NewsFlashPanel';
import { StatusPanel } from '@renderer/components/StatusPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { Portfolio } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/gameview.module.css';
import { InventoryPanel } from '@renderer/components/InventoryPanel';

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
        <div className={styles.gameview}>
            <div className={styles.header}>
                <NewsFlashPanel />
            </div>
            <div className={styles.main}>
                <div className={styles.mainLeft}>
                    <div className={styles.chart}>
                        <StockChartPanel market={market} />
                    </div>
                    <div className={styles.info}>
                        <StockInfoPanel market={market} />
                    </div>
                </div>
                <div className={styles.mainRight}>
                    <div className={styles.buypanel}>
                        <BuyPanel />
                    </div>
                    <div className={styles.inventory}>
                        <InventoryPanel />
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <StatusPanel />
            </div>
        </div>
    );
}
