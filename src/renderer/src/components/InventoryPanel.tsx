export function InventoryPanel(): JSX.Element {
    function AddInfluence(ticker: string, influence: number): void {
        window.api.setStockInfluence([ticker, influence.toString()]);
    }
    return (
        <div>
            <h1>Inventory Panel</h1>
            <button onClick={() => AddInfluence('NVDA', +0.5)}>
                TEST add influence to nvda + 0.5
            </button>
        </div>
    );
}
