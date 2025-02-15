import { Portfolio } from '@renderer/data/Interface';
import {
    CandlestickData,
    CandlestickSeries,
    ChartOptions,
    ColorType,
    createChart,
    IChartApi
} from 'lightweight-charts';
import { createRef, useEffect, useRef, useState } from 'react';

export function StockChartPanel(props: {
    market: Portfolio | undefined;
    tickerToShow?: string | undefined;
}) {
    const chartContainerRef = createRef<HTMLDivElement>();
    const chartRef = useRef<IChartApi>();
    const seriesRef = useRef();
    const [chartTicker, setChartTicker] = useState<string>('N/A');
    const [latestPriceUpdate, setLatestPriceUpdate] = useState();

    useEffect(() => {
        setChartTicker(props.tickerToShow ? props.tickerToShow : 'N/A');
    }, [props.tickerToShow]);

    useEffect(() => {
        chartRef.current = createChart(chartContainerRef.current!, chartOptions);

        seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            title: chartTicker
        });

        const GetStockHistory = async (ticker) => {
            if (ticker == 'N/A') {
                seriesRef.current.setData([]);
                return;
            }
            const reply = await window.api.getMarketStockHistory(ticker);
            const formattedHistory: {
                time: string;
                open: number;
                high: number;
                low: number;
                close: number;
            }[] = [];
            reply.forEach(
                (item: {
                    time: string;
                    price: { open: number; high: number; close: number; low: number };
                }) => {
                    formattedHistory.push({
                        time: item.time,
                        open: item.price.open,
                        high: item.price.high,
                        low: item.price.low,
                        close: item.price.close
                    });
                }
            );
            seriesRef.current.setData(formattedHistory);
        };
        GetStockHistory(chartTicker);

        return (): void => {
            chartRef.current?.remove();
        };
    }, [chartTicker]);

    useEffect(() => {
        //TODO: should there be a safe removal?
        window.api.onStockChartNewData((value) => {
            setLatestPriceUpdate(value);
        });
    }, []);

    useEffect(() => {
        if (!latestPriceUpdate) {
            return;
        }
        if (latestPriceUpdate.ticker != chartTicker) {
            console.log(latestPriceUpdate.ticker + chartTicker);
            return;
        }
        const filtered: CandlestickData = {
            time: latestPriceUpdate.price.time,
            open: latestPriceUpdate.price.price.open,
            high: latestPriceUpdate.price.price.high,
            low: latestPriceUpdate.price.price.low,
            close: latestPriceUpdate.price.price.close
        };
        seriesRef.current.update(filtered);
    }, [latestPriceUpdate, chartTicker]);

    const GetStockHistory = async (ticker) => {
        const reply = await window.api.getMarketStockHistory(ticker);
        return reply;
    };

    return <div style={{ width: '100%', height: '100%' }} ref={chartContainerRef} />;
}

const chartOptions: ChartOptions = {
    layout: {
        background: { type: ColorType.Solid, color: '#0d1224' },
        textColor: '#888888',
        fontFamily: 'Consolas',
        attributionLogo: true,
        colorSpace: 'display-p3',
        colorParsers: []
    },
    grid: {
        vertLines: {
            color: '#888888',
            visible: true,
            style: 4
        },
        horzLines: {
            color: '#222222',
            visible: true,
            style: 1
        }
    },
    autoSize: true
};
