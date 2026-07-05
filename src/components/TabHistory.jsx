import { useState, useEffect } from 'react';

export function TabHistory({ fromCurrency, toCurrency }) {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeRange, setActiveRange] = useState('1M'); // '1M' activo por defecto
    const timeRanges = ['1D', '1W', '1M', "3M", '1Y', '5Y'];

    const icons = {
        up: '▲',
        down: '▼',
        flat: ''
    };

    useEffect(() => {
        async function fetchTabData() {
            try {
                const localDate = new Date();
                const dayOfWeek = localDate.getDay(); // 0 = Domingo, 1 = Luns, 6 = Sábado

                // LÓXICA ANTIL-NaN PARA FINS DE SEMANA:
                // Aseguramos que a url reciba unha data na que a bolsa estivo aberta
                if (dayOfWeek === 0) { // Domingo ➔ Pedimos dende o xoves anterior para pillar xoves e venres
                    localDate.setDate(localDate.getDate() - 3);
                } else if (dayOfWeek === 6) { // Sábado ➔ Pedimos dende o xoves anterior para pillar xoves e venres
                    localDate.setDate(localDate.getDate() - 2);
                } else if (dayOfWeek === 1) { // Luns ➔ Pedimos dende o xoves anterior para pillar o venres
                    localDate.setDate(localDate.getDate() - 4);
                } else { // Martes a Venres ➔ Onte normal
                    localDate.setDate(localDate.getDate() - 1);
                }

                const yesterdayStr = localDate.toISOString().split('T')[0];

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
                const formattedPercent = percentChange.toFixed(2);

                // Lóxica estrita de 3 estados para tendencias e signos (Evita o -0.00%)
                let trend = 'flat';
                let changeSign = '';
                let percentSign = '';

                if (Number(changeValue) > 0) {
                    trend = 'up';
                    changeSign = '+';
                    percentSign = '+';
                } else if (Number(changeValue) < 0) {
                    trend = 'down';
                    // O signo menos xa ven de forma nativa no número de JavaScript
                }

                setMarketData({
                    open: openRate.toFixed(decimals),
                    last: lastRate.toFixed(decimals),
                    change: (Number(changeValue.toFixed(decimals)) === 0 ? '' : changeSign) + changeValue.toFixed(decimals),
                    percent: (Number(changeValue) === 0 ? '0.00%' : percentSign + formattedPercent + '%'),
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

    // Controis para as túas clases dinámicas do teu return
    const isZero = marketData.trend === 'flat';
    const isPositive = marketData.trend === 'up';

    return (
        <div className="">
            <div className="flex items-center">
                <div className="flex justify-start gap-200 w-[740px] h-[81px]">
                    <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Open</span>
                        <span className="text-preset-2 text-neutral-50">{marketData.open}</span>
                    </div>

                    <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Last</span>
                        <span className="text-preset-2 text-neutral-50">{marketData.last}</span>
                    </div>

                    {/* CORRECCIÓN: Aplicamos os 3 estados visuais (neutro/gris se vale 0) coa túa sintaxe exacta */}
                    <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Change</span>
                        <span className={`text-preset-2 ${isZero ? 'text-neutral-200' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {marketData.change}
                        </span>
                    </div>

                    {/* CORRECCIÓN: O mesmo para o % Change, controlando os 3 estados e as iconas */}
                    <div className="flex flex-col gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-700 w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">% Change</span>
                        <span className={`text-preset-2 ${isZero ? 'text-neutral-200' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            <span>{icons[marketData.trend]}</span> {marketData.percent}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end items-center bg-neutral-700">
                    {timeRanges.map((range) => {
                        const isActive = activeRange === range;
                        return (
                            <button
                                key={range}
                                onClick={() => setActiveRange(range)}
                                onFocus={() => setActiveRange(range)}
                                className={`uppercase text-preset-5 border-2 border-transparent rounded-8 px-200 py-150 cursor-pointer focus:outline-none transition-all duration-150 h-[38px] w-[47px]
                            ${isActive
                                        ? 'text-neutral-50 bg-neutral-500 focus-visible:border-lime-500 focus-visible:outline-2 focus-visible:outline-2 focus-visible:outline-offset-2'
                                        : 'border-transparent text-neutral-200 hover:text-neutral-50 hover:bg-neutral-500 '
                                    }`}
                            >
                                {range}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
