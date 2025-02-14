import { BuyPanel } from '@renderer/components/BuyPanel';
import { NewsFlashPanel } from '@renderer/components/NewsFlashPanel';
import { StatusPanel } from '@renderer/components/StatusPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import {
    CallBackMessage,
    EmptyPortfolio,
    EmptyStockInfo,
    EmptyStockOperationResponse,
    EmptyUserPortfolio,
    LoadingStockInfo,
    Portfolio,
    StockInfo,
    StockOperationResponse,
    UserPortfolio
} from '@renderer/data/Interface';
import { useEffect, useState } from 'react';
import styles from '@renderer/assets/css/gameview.module.css';
import { InventoryPanel } from '@renderer/components/InventoryPanel';

export function GameView(): JSX.Element {
    const [market, setMarket] = useState<Portfolio>();
    const [selectedTicker, setSelectedTicker] = useState<string>('NVDA');
    const [latestStockInfo, setLatestStockInfo] = useState<StockInfo>(LoadingStockInfo());
    const [latestStockOperation, setLatestStockOperation] = useState<StockOperationResponse>(
        EmptyStockOperationResponse
    );
    const [latestPlayerStockPortfolioGET, setLatestPlayerStockPortfolioGET] =
        useState<Portfolio>(EmptyPortfolio);

    //TODO: we can use states to check if we really need to make another call to update, or we can just use cached results.
    useEffect(() => {
        window.api.startStockSim();
        window.api.onStockInfo((value) => {
            const stockInfo: StockInfo = {
                ticker: value.ticker,
                name: value.data.name,
                currPrice: value.data.currPrice,
                delta: value.data.delta,
                deltaPercentage: value.data.deltaPercentage,
                lastDelta: value.data.lastDelta,
                quantity: value.data.quantity
            };
            setLatestStockInfo(stockInfo);
        });
    }, []);

    useEffect(() => {
        const timeout = setTimeout(marketInfo, 1000);
        return (): void => clearTimeout(timeout);
    }, [market]);

    useEffect(() => {
        handleChildCallback({
            msgType: 'getPlayerStock'
        });
    }, [selectedTicker]);

    const marketInfo = async (): Promise<void> => {
        const result = await window.api.getMarketStock();
        if (result.result) {
            setMarket(result.data.portfolio);
        } else {
            //TODO: handle result.result == false conditions
        }
    };

    const handleChildCallback = async (childData: CallBackMessage): Promise<void> => {
        switch (childData.msgType) {
            case 'selectNewTicker': {
                if (childData.arg && childData.arg.length == 1) {
                    setSelectedTicker(childData.arg[0]);
                }
                break;
            }

            case 'buyStock': {
                if (childData.arg && childData.arg.length == 3) {
                    const result = await window.api.buyStock(
                        childData.arg[0],
                        childData.arg[1],
                        childData.arg[2]
                    );
                    if (result.result) {
                        setLatestStockOperation({
                            newCash: result.data.newRemainingCash,
                            operatedStock: result.data.stock
                        });
                    } else {
                        //TODO: handle result.result == false situations
                    }
                }
                break;
            }

            case 'sellStock': {
                if (childData.arg && childData.arg.length == 3) {
                    const result = await window.api.sellStock(
                        childData.arg[0],
                        childData.arg[1],
                        childData.arg[2]
                    );
                    if (result.result) {
                        setLatestStockOperation({
                            newCash: result.data.newRemainingCash,
                            operatedStock: result.data.stock
                        });
                    } else {
                        //TODO: handle result.result == false situations
                    }
                }
                break;
            }

            case 'getPlayerStock': {
                const result = await window.api.getPlayerStock(childData.arg ? childData.arg : []);
                setLatestPlayerStockPortfolioGET(result.data.portfolio);
                break;
            }
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
                            marketStockInfo={latestStockInfo}
                            playerStockPortfolio={latestPlayerStockPortfolioGET}
                            gvCallback={handleChildCallback}
                        />
                    </div>
                    <div className={styles.inventory}>
                        <InventoryPanel />
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <StatusPanel cash={10000} />
            </div>
        </div>
    );
}
