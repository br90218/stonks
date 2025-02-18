import styles from '@renderer/assets/css/components/panels/ipopanel.module.css';

export default function IPOPanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div className={styles.banner}>
                <h1>IPO</h1>
            </div>
            <div className={styles.list}></div>
        </div>
    );
}
