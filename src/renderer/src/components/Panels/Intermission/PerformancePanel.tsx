import styles from '@renderer/assets/css/components/panels/performancepanel.module.css';

export default function PerformancePanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Your Performance: 100%</div>
            <div className={styles.detail}>
                Top Gaining: NVFA +20<br></br>Top Losing: NVFA -20
            </div>
        </div>
    );
}
