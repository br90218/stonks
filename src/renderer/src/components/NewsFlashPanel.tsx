import styles from '@renderer/assets/css/newspanel.module.css';

export function NewsFlashPanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <div>
                <div className={styles.front}>
                    This just in: Hawaiian pizza no longer legal in Hawaii.axsxasxaxdasdsada
                </div>
            </div>
            <div>Market close: 120 days</div>
        </div>
    );
}
