import StoreItemButton from '@renderer/components/Buttons/StoreItemButton';
import styles from '@renderer/assets/css/components/panels/storepanel.module.css';

export default function StorePanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.banner}>
                <div className={styles.title}>
                    <h1>Options</h1>
                </div>
                <div className={styles.subtitle}>This is the subtiltes for thie sotor.</div>
            </div>
            <div className={styles.catalogue}>
                <StoreItemButton
                    data={{
                        title: 'Hostile Takeover',
                        description: 'Makes a stock crash immediately for x days.',
                        price: 100
                    }}
                />
                <StoreItemButton
                    data={{
                        title: 'Sector Boom',
                        description: 'Choose a stock category; all stocks in that category boom.',
                        price: 100
                    }}
                />
                <StoreItemButton
                    data={{ title: 'FOMO', description: 'Increase stock volatility.', price: 100 }}
                />
                <StoreItemButton
                    data={{
                        title: 'Stock Split',
                        description: 'Perform a 5-to-1 stock split.',
                        price: 100
                    }}
                />
            </div>
        </div>
    );
}
