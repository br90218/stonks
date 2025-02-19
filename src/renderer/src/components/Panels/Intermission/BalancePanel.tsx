import styles from '@renderer/assets/css/components/panels/balancepanel.module.css';

export default function BalancePanel(): JSX.Element {
    return (
        <div>
            <div className={styles.title}>
                <h1>Balance</h1>
            </div>
            <div>10000000</div>
        </div>
    );
}
