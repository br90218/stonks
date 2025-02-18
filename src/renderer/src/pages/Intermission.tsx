import styles from '@renderer/assets/css/pages/intermission.module.css';
import BalancePanel from '@renderer/components/Panels/Intermission/BalancePanel';
import FuturesPanel from '@renderer/components/Panels/Intermission/FuturesPanel';
import NextQuarterPanel from '@renderer/components/Panels/Intermission/NextQuarterPanel';
import IPOPanel from '@renderer/components/Panels/Intermission/IPOPanel';
import PerformancePanel from '@renderer/components/Panels/Intermission/PerformancePanel';
import StorePanel from '@renderer/components/Panels/Intermission/StorePanel';
import TickersPanel from '@renderer/components/Panels/Intermission/TickersPanel';

export default function Intermission(): JSX.Element {
    return (
        <div className={styles.intermission}>
            <div className={styles.tickersPanel}>
                <TickersPanel />
            </div>
            <div className={styles.storePanel}>
                <StorePanel />
            </div>
            <div className={styles.performancePanel}>
                <PerformancePanel />
            </div>
            <div className={styles.balancePanel}>
                <BalancePanel />
            </div>
            <div className={styles.futuresPanel}>
                <FuturesPanel />
            </div>
            <div className={styles.nextQuarterPanel}>
                <NextQuarterPanel />
            </div>
            <div className={styles.optionsPanel}>
                <IPOPanel />
            </div>
        </div>
    );
}
