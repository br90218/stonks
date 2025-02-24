import { Item, RunFile, ItemOperationResponse } from './Objects';

export function BuyItem(runFile: RunFile, itemId: string): ItemOperationResponse {
    const item = GetItem(itemId);
    if (!item) {
        return {
            result: false,
            detail: 'no-item-found',
            data: undefined
        };
    }

    if (runFile.cash < item.price) {
        return {
            result: false,
            detail: 'insufficent-cash',
            data: undefined
        };
    }

    runFile.items = [...runFile.items, item];
    runFile.cash -= item.price;

    let newRunFileItems: { id: string; name: string; description: string }[] = [];
    runFile.items.forEach((item) => {
        newRunFileItems = [
            ...newRunFileItems,
            { id: item.id, name: item.name, description: item.description }
        ];
    });

    return {
        result: true,
        detail: 'ok',
        data: {
            newRemainingCash: runFile.cash,
            items: newRunFileItems
        }
    };
}

export function SellItem(runFile: RunFile, itemId: string): ItemOperationResponse {
    const item = GetItem(itemId);
    if (!item) {
        return {
            result: false,
            detail: 'no-item-found',
            data: undefined
        };
    }
    const originalSize = runFile.items.length;
    runFile.items = runFile.items.filter((item) => item.id !== itemId);
    if (originalSize === runFile.items.length) {
        return {
            result: false,
            detail: 'item-not-owned',
            data: undefined
        };
    } else {
        runFile.cash += item.price * 0.75;
        let newRunFileItems: { id: string; name: string; description: string }[] = [];
        runFile.items.forEach((item) => {
            newRunFileItems = [
                ...newRunFileItems,
                { id: item.id, name: item.name, description: item.description }
            ];
        });
        return {
            result: true,
            detail: 'ok',
            data: {
                newRemainingCash: runFile.cash,
                items: newRunFileItems
            }
        };
    }
}

export function GetItem(itemId: string): Item {
    return ItemsList[itemId];
}

const ItemsList: { [id: string]: Item } = {
    ['fomo']: {
        id: 'fomo',
        name: 'FOMO',
        description: 'Makes stock crash',
        price: 1_000,
        function: () => {}
    }
};
