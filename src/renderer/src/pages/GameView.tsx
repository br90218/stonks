import { BuyPanel } from '@renderer/components/BuyPanel';
import { NewsFlashPanel } from '@renderer/components/NewsFlashPanel';
import { StatusPanel } from '@renderer/components/StatusPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { LoadingStockInfo, Portfolio, StockInfo } from '@renderer/data/Interface';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/gameview.module.css';
import { InventoryPanel } from '@renderer/components/InventoryPanel';

export function GameView(): JSX.Element {
    const [market, setMarket] = useState<Portfolio>();
    const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
    const [latestStockInfo, setLatestStockInfo] = useState<StockInfo>(LoadingStockInfo());
    useEffect(() => {
        window.api.startStockSim();
        window.api.onStockInfo((value) => {
            const stockInfo: StockInfo = {
                ticker: value.ticker,
                name: value.data.name,
                currPrice: value.data.currPrice,
                delta: value.data.delta,
                deltaPercentage: value.data.deltaPercentage
            };
            setLatestStockInfo(stockInfo);
        });
    }, []);

    useEffect(() => {
        const timeout = setTimeout(marketInfo, 1000);
        return (): void => clearTimeout(timeout);
    }, [market]);

    const marketInfo = async (): Promise<void> => {
        const fetched = await window.api.getMarketPortfolio();
        setMarket(fetched);
    };

    const handleChildCallback = (childData: { msgType: string; arg?: string[] }): void => {
        switch (childData.msgType) {
            case 'selectNewTicker':
                if (childData.arg && childData.arg.length == 1) {
                    setSelectedTicker(childData.arg[0]);
                }
                break;
            case 'buyStock':
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.gameview}>
            <div className={styles.header}>
                <NewsFlashPanel />
            </div>
            <div className={styles.main}>
                <div className={styles.mainLeft}>
                    <div className={styles.chart}>
                        <StockChartPanel market={market} tickerToShow={selectedTicker} />
                    </div>
                    <div className={styles.info}>
                        <StockInfoPanel market={market} gvCallback={handleChildCallback} />
                    </div>
                </div>
                <div className={styles.mainRight}>
                    <div className={styles.buypanel}>
                        <BuyPanel tickerToShow={selectedTicker} stockInfo={latestStockInfo} />
                    </div>
                    <div className={styles.inventory}>
                        <InventoryPanel />
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <StatusPanel cash={100000} />
            </div>
        </div>
    );
}
