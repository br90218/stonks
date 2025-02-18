import styles from '@renderer/assets/css/components/panels/nextquarterpanel.module.css';

export default function NextQuarterPanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.nextquarteris}>Next Quarter:</div>
            <div className={styles.nextquarter}>Q3</div>
            <div className={styles.modifiers}>
                <ul>
                    <li>modifier 1</li>
                    <li>modifier 1</li>
                    <li>modifier 1</li>
                </ul>
            </div>
            <button className={styles.proceed}>Continue</button>
        </div>
    );
}
