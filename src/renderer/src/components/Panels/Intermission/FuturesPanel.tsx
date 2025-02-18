import styles from '@renderer/assets/css/components/panels/futurespanel.module.css';

function FuturesItem(): JSX.Element {
    return (
        <div className={styles.futuresitem}>
            <div className={styles.ticker}>NVDA</div>
            <button className={`${styles.direction} bgcolorpriceup`}>Rise</button>
            <button className={`${styles.direction} bgcolorpricedown`}>Fall</button>
        </div>
    );
}

export default function FuturesPanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.banner}>This is futures</div>
            <div className={styles.list}>
                <FuturesItem />
                <FuturesItem />
                <FuturesItem />
                <FuturesItem />
            </div>
        </div>
    );
}
