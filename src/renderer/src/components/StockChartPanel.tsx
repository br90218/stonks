import { Portfolio, StockChartDataCollection } from '@renderer/data/Interface';
import {
    CandlestickData,
    CandlestickSeries,
    ChartOptions,
    ColorType,
    createChart,
    IChartApi,
    ISeriesApi
} from 'lightweight-charts';
import { createRef, useEffect, useRef, useState } from 'react';

export function StockChartPanel(props: {
    market: Portfolio | undefined;
    tickerToShow?: string | undefined;
}) {
    const chartContainerRef = createRef<HTMLDivElement>();
    const chartRef = useRef<IChartApi>();
    const seriesRef = useRef();
    const listeningTicker = useRef('NVDA');

    useEffect(() => {}, [props.market, props.tickerToShow]);
    useEffect(() => {
        chartRef.current = createChart(chartContainerRef.current!, chartOptions);

        seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350'
        });
        seriesRef.current.setData([]);

        return (): void => {
            chartRef.current?.remove();
        };
    }, [listeningTicker]);

    useEffect(() => {
        //TODO: should there be a safe removal?
        window.api.onStockChartNewData((value) => {
            if (value.ticker != listeningTicker.current) {
                return;
            }
            const filtered: CandlestickData = {
                time: value.data.time,
                open: value.data.open,
                high: value.data.high,
                low: value.data.low,
                close: value.data.close
            };
            //seriesRef.current.update(filtered);
        });
    }, []);

    return <div style={{ width: '100%', height: '100%' }} ref={chartContainerRef} />;
}

const chartOptions: ChartOptions = {
    layout: {
        background: { type: ColorType.Solid, color: 'black' },
        textColor: 'white',
        fontFamily: '',
        attributionLogo: false,
        colorSpace: 'display-p3',
        colorParsers: []
    },
    autoSize: true
};
