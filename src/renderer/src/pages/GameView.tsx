import { BuyPanel } from '@renderer/components/BuyPanel';
import { StockChartPanel } from '@renderer/components/StockChartPanel';
import { StockInfoPanel } from '@renderer/components/StockInfoPanel';
import { CreateRandomInstance } from '@renderer/services/Random';
import { RetrieveRunFile, RunFile } from '@renderer/services/SaveFile';
import { useEffect, useRef, useState } from 'react';

export function GameView() {
    const worker = new Worker(new URL('@renderer/services/StockEngine.tsx', import.meta.url), {
        type: 'module'
    });
    const [result, setResult] = useState('something');
    const rng = useRef<any>(); //HACK: type gymnastics needed here]
    const runFile = useRef<RunFile>(RetrieveRunFile());

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

    setInterval(() => {
        let seed = '';
        seed = runFile.current!.seed;
        rng.current = CreateRandomInstance(seed);
        let value = rng.current.GetRandomInt(1, 6);
        console.log(value);
    }, 1000);

    return (
        <>
            {result}
            <StockChartPanel />
            <BuyPanel />
            <StockInfoPanel />
        </>
    );
}
