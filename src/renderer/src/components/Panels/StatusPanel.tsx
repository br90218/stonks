import styles from '@renderer/assets/css/components/panels/statuspanel.module.css';

export default function StatusPanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.balance}>Balance: 10000000</div>
            <div className={styles.positions}>Open positions: 1000000</div>
            <div className={styles.performance}>Current performance: 999%</div>
        </div>
    );
}
