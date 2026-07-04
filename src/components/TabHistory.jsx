import { useState, useEffect } from 'react';
export function TabHistory({ fromCurrency, toCurrency }) {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const icons = {
        up: '▲',
        down: '▼',
        flat: ''
    };

    useEffect(() => {
        async function fetchTabData() {
            try {
                const localDate = new Date();
                localDate.setDate(localDate.getDate() - 1);
                const yesterdayStr = localDate.toLocaleDateString('sv-SE');

                // 1. Chamada á mesma URL que manexa o teu proxecto
                const response = await fetch(`https://api.frankfurter.dev/v2/rates?from=${yesterdayStr}`);
                const data = await response.json();

                if (!data || data.length === 0) {
                    setLoading(false);
                    return;
                }

                // 2. Extraemos as datas para separar onte de hoxe
                const availableDates = [...new Set(data.map(item => item.date))].sort();
                const oldestDay = availableDates[0];
                const newestDay = availableDates[availableDates.length - 1] || oldestDay;

                // 3. Mapeamos os prezos baseados en EUR nativo
                const ratesYesterday = { EUR: 1 };
                const ratesToday = { EUR: 1 };

                data.forEach(item => {
                    if (item.date === oldestDay) ratesYesterday[item.quote] = item.rate;
                    if (item.date === newestDay) ratesToday[item.quote] = item.rate;
                });

                // 4. Calculamos os 4 datos requiridos de forma matemática para as moedas activas
                const rateToday = ratesToday[toCurrency.code] / ratesToday[fromCurrency.code];
                const rateYesterday = ratesYesterday[toCurrency.code] / ratesYesterday[fromCurrency.code];

                const openRate = rateYesterday;                        // 1. OPEN RATE
                const lastRate = rateToday;                            // 2. LAST RATE
                const changeValue = rateToday - rateYesterday;          // 3. CHANGE
                const percentChange = (changeValue / rateYesterday) * 100; // 4. % CHANGE

                const decimals = toCurrency.code === 'JPY' ? 2 : 4;

                let trend = 'flat';
                if (changeValue > 0) trend = 'up';
                if (changeValue < 0) trend = 'down';

                setMarketData({
                    open: openRate.toFixed(decimals),
                    last: lastRate.toFixed(decimals),
                    change: (changeValue > 0 ? '+' : '') + changeValue.toFixed(decimals),
                    percent: (percentChange > 0 ? '+' : '') + percentChange.toFixed(2) + '%',
                    trend: trend
                });

                setLoading(false);
            } catch (error) {
                console.error("Erro na pestana History:", error);
                setLoading(false);
            }
        }

        fetchTabData();
    }, [fromCurrency, toCurrency]);

    if (loading) return <div className="text-neutral-500 p-4">Cargando datos...</div>;
    if (!marketData) return (
        <div className="flex flex-col items-center justify-center w-[1036px] h-[154px] gap-200">
            <p className="text-neutral-100 text-preset-2">No chart data available.</p>
            <p className="text-preset-4 text-neutral-200 w-[508px] text-center">
                We could't load rate history for USD/EUR right now.
                This usually clears up in a minute.
            </p>
        </div>
    )
    console.log("historyTab executado coa moeda:", fromCurrency);
    return (
        <div className="">

            <div className="flex justify-start gap-200 w-[740px] h-[81px]">
                <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                    <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Open</span>
                    <span className="text-preset-2 text-neutral-50">{marketData.open}</span>
                </div>

                <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                    <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Last</span>
                    <span className="text-preset-2 text-neutral-50">{marketData.last}</span>
                </div>

                <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                    <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Change</span>
                    <span className={`text-preset-2 ${marketData.isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {marketData.change}
                    </span>
                </div>

                <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                    <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">% Change</span>
                    <span className={`text-preset-2 ${marketData.isUp ? 'text-green-500' : 'text-red-500'}`}>
                        <span>{icons[marketData.trend]}</span> {marketData.percent}
                    </span>
                </div>
            </div>
        </div>
    );
}
