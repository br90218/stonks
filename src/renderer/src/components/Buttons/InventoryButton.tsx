import styles from '@renderer/assets/css/components/buttons/inventorybutton.module.css';
import icon from '@renderer/assets/electron.svg';

export default function InventoryButton(props: { name: string; description: string }): JSX.Element {
    return (
        <button className={styles.button}>
            <div className={styles.image}>
                <img src={icon}></img>
            </div>
            <div className={styles.words}>
                <div className={styles.title}>
                    <h2>{props.name}</h2>
                </div>
                <div className={styles.description}>{props.description}</div>
            </div>
        </button>
    );
}
