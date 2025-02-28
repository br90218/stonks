import { FrontendItem } from '@renderer/data/Interface';
import InventoryButton from './Buttons/InventoryButton';
import styles from '@renderer/assets/css/components/panels/inventorypanel.module.css';
import { ReactNode, useEffect, useRef } from 'react';

function ItemsList(props: { items: FrontendItem[] }): JSX.Element {
    if (!props.items || props.items.length == 0) {
        return <div> No items </div>;
    }
    let itemButtons: JSX.Element[] = [];
    props.items.forEach((item) => {
        itemButtons = [
            ...itemButtons,
            <li key={item.id}>
                {/* TODO: can tidy this up into using one params struct */}
                <InventoryButton name={item.name} description={item.description} />
            </li>
        ];
    });

    return <ul>{itemButtons}</ul>;
}

export function InventoryPanel(props: { inventory: FrontendItem[] }): JSX.Element {
    const playerItems = useRef<FrontendItem[]>([]);

    function AddInfluence(ticker: string, influence: number): void {
        window.api.setStockInfluence([ticker, influence.toString()]);
    }
    function SetTick(ticker: string, tick: number): void {
        window.api.setStockTick([ticker, tick.toString()]);
    }

    return (
        <div className={styles.wrapper}>
            <h1>Inventory Panel</h1>
            <ItemsList items={props.inventory} />
        </div>
    );
}
