import { BuyPanel } from '@renderer/components/BuyPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { useEffect, useState } from 'react';

export function GameView() {
    const worker = new Worker(new URL('@renderer/services/StockEngine.tsx', import.meta.url));
    const [result, setResult] = useState('something');

    useEffect(() => {
        return () => {
            //worker.terminate();
        };
    });
    worker.onmessage = (event) => {
        console.log(event.data);
        setResult(event.data);
    };

    worker.postMessage('');
    return (
        <>
            {result}
            <StockChartPanel />
            <BuyPanel />
            <StockInfoPanel />
        </>
    );
}
