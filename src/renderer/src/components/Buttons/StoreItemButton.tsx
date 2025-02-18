import styles from '@renderer/assets/css/components/buttons/storeitembutton.module.css';
import icon from '@renderer/assets/electron.svg';

export default function StoreItemButton(props: {
    data: { title: string; description: string; price: number };
}): JSX.Element {
    return (
        <button className={styles.button}>
            <div className={styles.icon}>
                <div className={styles.image}>
                    <img src={icon}></img>
                </div>
                <div className={styles.price}>{props.data.price}</div>
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{props.data.title}</div>
                <div className={styles.description}>{props.data.description}</div>
            </div>
        </button>
    );
}
