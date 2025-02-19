import InventoryButton from './Buttons/InventoryButton';
import styles from '@renderer/assets/css/components/panels/inventorypanel.module.css';

export function InventoryPanel(): JSX.Element {
    function AddInfluence(ticker: string, influence: number): void {
        window.api.setStockInfluence([ticker, influence.toString()]);
    }
    function SetTick(ticker: string, tick: number): void {
        window.api.setStockTick([ticker, tick.toString()]);
    }
    return (
        <div className={styles.wrapper}>
            <h1>Inventory Panel</h1>
            {/* <button onClick={() => AddInfluence('NVDA', +0.5)}>
                TEST add influence to nvda + 0.5
            </button>
            <button onClick={() => SetTick('NVDA', 4)}>TEST set tick to nvda = 4</button> */}
            <ul>
                <li>
                    <InventoryButton />
                </li>
                <li>
                    <InventoryButton />
                </li>
                <li>
                    <InventoryButton />
                </li>
                <li>
                    <InventoryButton />
                </li>
                <li>
                    <InventoryButton />
                </li>
                <li>
                    <InventoryButton />
                </li>
            </ul>
        </div>
    );
}
