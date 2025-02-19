import styles from '@renderer/assets/css/components/panels/controlspanel.module.css';

export default function ControlsPanel(): JSX.Element {
    return (
        <div className={styles.wrapper}>
            <button>Config</button>
            <button>Help</button>
            <button>Quit</button>
        </div>
    );
}
