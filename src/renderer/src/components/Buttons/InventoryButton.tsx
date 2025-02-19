import styles from '@renderer/assets/css/components/buttons/inventorybutton.module.css';
import icon from '@renderer/assets/electron.svg';

export default function InventoryButton(): JSX.Element {
    return (
        <button className={styles.button}>
            <div className={styles.image}>
                <img src={icon}></img>
            </div>
            <div className={styles.words}>
                <div className={styles.title}>
                    <h2>Company Update</h2>
                </div>
                <div className={styles.description}>
                    Freezes selected stock for x days. On the xth day, generate trend.
                </div>
            </div>
        </button>
    );
}
