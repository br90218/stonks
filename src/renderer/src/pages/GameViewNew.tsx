import styles from '@renderer/assets/css/pages/gameview.module.css';
import { NewsFlashPanel } from '@renderer/components/NewsFlashPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';

export default function GameView(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <NewsFlashPanel />
            </div>
            <div className={styles.chart}></div>
            <div className={styles.stock}>
                <StockInfoPanel />
            </div>
            <div className={styles.trade}></div>
            <div className={styles.items}></div>
            <div className={styles.footer}></div>
            <div className={styles.control}></div>
        </div>
    );
}
