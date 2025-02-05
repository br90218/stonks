import { StockInfoButton } from './Buttons/StockInfoButton';

function StockButtonList() {
    const buttons = [
        StockInfoButton({ name: 'NVDA', price: 10, delta: 1 }),
        StockInfoButton({ name: 'SOME', price: 10, delta: 1 }),
        StockInfoButton({ name: 'OHHH', price: 10, delta: 1 }),
        StockInfoButton({ name: 'AAPL', price: 10, delta: 1 })
    ];

    const listButtons = buttons.map((button) => <li>{button}</li>);

    return <ul>{listButtons}</ul>;
}

export function StockInfoPanel() {
    return (
        <div>
            <StockButtonList />
        </div>
    );
}
