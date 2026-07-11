import { useState, useEffect } from 'react';
import { CurrencyChart } from './CurrencyChart';

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

                const endDate = new Date();
                const startDate = new Date();
                
                if (activeRange === '1D') startDate.setDate(endDate.getDate() - 1);
                else if (activeRange === '1W') startDate.setDate(endDate.getDate() - 7);
                else if (activeRange === '1M') startDate.setDate(endDate.getDate() - 30);
                else if (activeRange === '3M') startDate.setDate(endDate.getDate() - 90);
                else if (activeRange === '1Y') startDate.setFullYear(endDate.getFullYear() - 1);
                else if (activeRange === '5Y') startDate.setFullYear(endDate.getFullYear() - 5);

                // CORRECCIÓN DO FIN DE SEMANA: Comprobamos o día da semana da data calculated (startDate)
                const startDayOfWeek = startDate.getDay(); // 0 = Domingo, 6 = Sábado

                if (startDayOfWeek === 0) {
                    startDate.setDate(startDate.getDate() - 2); // Se caeu en domingo, recuamos ao venres (-2 días)
                } else if (startDayOfWeek === 6) {
                    startDate.setDate(startDate.getDate() - 1); // Se caeu en sábado, recuamos ao venres (-1 día)
                }

                const startDateStr = startDate.toISOString().split('T')[0];

                // Chamada á mesma URL que manexa o teu proxecto
                const response = await fetch(`https://api.frankfurter.dev/v2/rates?from=${startDateStr}&base=${fromCurrency.code}&quotes=${toCurrency.code}`, {
                    cache: "no-store" // Forza a consulta en tempo real
                });
                const data = await response.json();
                if (!data || data.length === 0) {
                    setLoading(false);
                    return;
                }
                // Lemos o primeiro elemento do array e o último de forma estrita
                const firstRow = data[0];
                const lastRow = data[data.length - 1];
                // Mapeamos os prezos baseados en EUR nativo de forma directa dende as filas de v2
                // Frankfurter v2 en rangos devolve estruturas con .rate directo na fila
                const openRate = firstRow.rate;   // O prezo de apertura ao INICIO do rango
                const lastRate = lastRow.rate;     // O prezo de peche de HOXE ao FINAL do rango
                
                // Calculamos os 4 datos requiridos de forma matemática segura
                const changeValue = lastRate - openRate;
                const percentChange = (changeValue / openRate) * 100;

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
    }, [fromCurrency, toCurrency, activeRange]);

    if (loading) return <div className="text-neutral-500 p-4">Loading data...</div>;
    if (!marketData) return (
        <div className="flex flex-col items-center justify-center p-125 xl:w-[1036px] md:w-[768px] xl:h-[154px] gap-200">
            <p className="text-neutral-100 text-preset-2">No chart data available.</p>
            <p className="text-preset-4 text-neutral-200 w-[343px] md:w-[508px] text-center">
                We could't load rate history for USD/EUR right now.
                This usually clears up in a minute.
            </p>
        </div>
    )

    // Controis para as túas clases dinámicas do teu return
    const isZero = marketData.trend === 'flat';
    const isPositive = marketData.trend === 'up';

    return (
        <div className="flex items-center flex-col gap-250">
            <div className="flex flex-col xl:flex-row items-center justify-between w-[343px] h-[234px] md:w-[720px] md:h-[143px] gap-250 xl:w-[1036px] xl:h-[81px]">
                <div className="flex justify-center gap-125 items-center md:gap-200 items-center md:justify-start flex-wrap gap-125 w-[343px] h-[172px] md:w-[720px] xl:w-[1036px] xl:h-[81px]">
                    <div className="flex flex-col gap-125 md:gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[166px] md:w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Open</span>
                        <span className="text-preset-2 text-neutral-50">{marketData.open}</span>
                    </div>

                    <div className="flex flex-col gap-125 md:gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[166px] md:w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Last</span>
                        <span className="text-preset-2 text-neutral-50">{marketData.last}</span>
                    </div>

                    {/* Aplicamos os 3 estados visuais (neutro/gris se vale 0) coa túa sintaxe exacta */}
                    <div className="flex flex-col gap-125 md:gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-600 w-[166px] md:w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">Change</span>
                        <span className={`text-preset-2 ${isZero ? 'text-neutral-200' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {marketData.change}
                        </span>
                    </div>

                    {/* O mesmo para o % Change, controlando os 3 estados e as iconas */}
                    <div className="flex flex-col gap-125 md:gap-200 bg-neutral-700 px-250 py-150 rounded-16 border border-neutral-700 w-[166px] md:w-[140px] h-[81px]">
                        <span className="text-preset-4 text-neutral-50 block uppercase opacity-70">% Change</span>
                        <span className={`text-preset-2 ${isZero ? 'text-neutral-200' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            <span>{icons[marketData.trend]}</span> {marketData.percent}
                        </span>
                    </div>
                </div>
                <div className="flex self-start p-025 md:justify-end items-center bg-neutral-700 xl:self-end">
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
            <CurrencyChart
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                lastToRange={marketData.last}
                activeRange={activeRange}
            />
        </div>
    );
}