import { BuyPanel } from '@renderer/components/BuyPanel';
import { NewsFlashPanel } from '@renderer/components/NewsFlashPanel';
import { StatusPanel } from '@renderer/components/StatusPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import {
    CallBackMessage,
    EmptyUserPortfolio,
    LoadingStockInfo,
    Portfolio,
    StockInfo,
    UserPortfolio
} from '@renderer/data/Interface';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/gameview.module.css';
import { InventoryPanel } from '@renderer/components/InventoryPanel';

export function GameView(): JSX.Element {
    const [market, setMarket] = useState<Portfolio>();
    const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
    const [latestStockInfo, setLatestStockInfo] = useState<StockInfo>(LoadingStockInfo());
    const [latestUserPortfolio, setLatestUserPortfolio] =
        useState<UserPortfolio>(EmptyUserPortfolio());
    useEffect(() => {
        window.api.startStockSim();
        window.api.onStockInfo((value) => {
            const stockInfo: StockInfo = {
                ticker: value.ticker,
                name: value.data.name,
                currPrice: value.data.currPrice,
                delta: value.data.delta,
                deltaPercentage: value.data.deltaPercentage,
                lastDelta: value.data.lastDelta
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

    const handleChildCallback = async (childData: CallBackMessage): Promise<void> => {
        switch (childData.msgType) {
            case 'selectNewTicker':
                if (childData.arg && childData.arg.length == 1) {
                    setSelectedTicker(childData.arg[0]);
                }
                break;
            case 'buyStock':
                if (childData.arg && childData.arg.length == 3) {
                    const result = await window.api.buyStock(
                        childData.arg[0],
                        childData.arg[1],
                        childData.arg[2]
                    );
                    if (result.result) {
                        setLatestUserPortfolio({
                            cash: result.file.cash,
                            portfolio: result.file.portfolio
                        });
                    } else {
                        //TODO: handle something here
                    }
                }
                break;
            case 'sellStock':
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
                        <BuyPanel
                            tickerToShow={selectedTicker}
                            stockInfo={latestStockInfo}
                            gvCallback={handleChildCallback}
                        />
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
