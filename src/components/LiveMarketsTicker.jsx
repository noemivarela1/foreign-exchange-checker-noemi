import { useState, useEffect } from 'react';

const PAIRS_TO_SHOW = [
    { base: 'USD', target: 'JPY' },
    { base: 'GBP', target: 'USD' },
    { base: 'USD', target: 'CHF' },
    { base: 'EUR', target: 'GBP' },
    { base: 'AUD', target: 'USD' },
    { base: 'USD', target: 'CAD' },
    { base: 'NZD', target: 'USD' }
];

export default function LiveMarketsTicker() {
    const [tickerData, setTickerData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLiveMarkets() {
            try {
                const localDate = new Date();
                const todayDay = localDate.getDay(); // 0 = Domingo, 1 = Luns, ..., 6 = Sábado

                // Decidimos cantos días restar dependendo de que día é HOXE
                if (todayDay === 0) {
                    // Se hoxe é domingo ➔ Pedimos o venres anterior (-2 días)
                    localDate.setDate(localDate.getDate() - 2);
                } else if (todayDay === 6) {
                    // Se hoxe é sábado ➔ Pedimos o venres anterior (-1 día)
                    localDate.setDate(localDate.getDate() - 1);
                } else if (todayDay === 1) {
                    // Se hoxe é luns ➔ Pedimos o venres anterior (-3 días) para ver o último peche real
                    localDate.setDate(localDate.getDate() - 3);
                } else {
                    // De martes a venres ➔ Pedimos onte de forma normal (-1 día)
                    localDate.setDate(localDate.getDate() - 1);
                }
                const yesterdayStr = localDate.toLocaleDateString('sv-SE');
                console.log("data de onte:" + yesterdayStr);
                // Chamada á API coa URL de frankfurter
                const response = await fetch(`https://api.frankfurter.dev/v2/rates?from=${yesterdayStr}`, {
                    cache: "no-store" // Forza a consulta en tempo real
                });
                const data = await response.json();

                if (!data || data.length === 0) {
                    setLoading(false);
                    return;
                }

                // Extraemos dinamicamente as datas do array para saber cal é onte e cal é hoxe
                const availableDates = [...new Set(data.map(item => item.date))].sort();

                // Se por ser fin de semana ou festivo só vén unha data, poñemos as dúas iguais para evitar erros
                const oldestDay = availableDates[0];
                const newestDay = availableDates[availableDates.length - 1] || oldestDay;

                // 3. Inicializamos dous mapas baleiros para separar os prezos de cada día (Base EUR)
                const ratesYesterday = { EUR: 1 };
                const ratesToday = { EUR: 1 };

                // Clasificamos cada obxecto do Array plano segundo a súa data real
                data.forEach(item => {
                    if (item.date === oldestDay) {
                        ratesYesterday[item.quote] = item.rate;
                    }
                    if (item.date === newestDay) {
                        ratesToday[item.quote] = item.rate;
                    }
                });

                // Calculamos as taxas reais de Forex para os teus 7 pares de xeito matemático
                const calculatedPairs = PAIRS_TO_SHOW.map(pair => {
                    // Fórmula cruzada: Taxa do par = Valor do Target en EUR / Valor da Base en EUR
                    const rateToday = ratesToday[pair.target] / ratesToday[pair.base];
                    const rateYesterday = ratesYesterday[pair.target] / ratesYesterday[pair.base];

                    // Porcentaxe de variación de 24h
                    let changePercent = 0;
                    if (rateYesterday && rateYesterday !== 0) {
                        changePercent = ((rateToday - rateYesterday) / rateYesterday) * 100;
                    }

                    // Definimos a tendencia exacta (sube, baixa ou mantense)
                    let trend = 'equal';
                    if (changePercent > 0.001) trend = 'up';
                    if (changePercent < -0.001) trend = 'down';

                    const decimals = pair.target === 'JPY' ? 2 : 4;

                    return {
                        base: pair.base,
                        target: pair.target,
                        rate: rateToday.toFixed(decimals),
                        change: Math.abs(changePercent).toFixed(2),
                        trend
                    };
                });

                setTickerData(calculatedPairs);
                setLoading(false);
            } catch (error) {
                console.error("Erro procesando o Live Ticker real:", error);
                setLoading(false);
            }
        }

        fetchLiveMarkets();
    }, []);

    if (loading || tickerData.length === 0) {
        return (
            <div className=" w-full text-center py-3 text-neutral-500 text-sm bg-neutral-950 border-y border-neutral-800">
                Loading live markets...
            </div>
        );
    }

    // Duplicamos os elementos para que o carrusel infinito non teña saltos visuais na pantalla
    const duplicatedItems = [...tickerData, ...tickerData];

    return (
        <div className="relative w-full bg-neutral-900 border-y border-neutral-800 overflow-hidden flex whitespace-nowrap">

            <div className="absolute left-0 top-0 z-10 bg-lime-500 px-100 py-150 md:px-200 md:py-150 md:text-preset-5-medium text-preset-6 text-neutral-900 z-10 border-r border-neutral-700 whitespace-nowrap">
                ● LIVE MARKETS
            </div>

            {/* Cinta con movemento continuo e pausa ao pasar o rato */}
            <div className="flex animate-marquee shrink-0">
                {duplicatedItems.map((pair, index) => (
                    <div
                        key={`${pair.base}-${pair.target}-${index}`}
                        className="flex items-center gap-125 px-150 py-150 md:px-250 md:py-150 bg-neutral-700 select-none cursor-pointer"
                    >
                        {/* Nome do Par */}
                        <span className="text-neutral-200 md:text-preset-5 text-preset-6">
                            {pair.base}/{pair.target}
                        </span>

                        {/* Prezo actual */}
                        <span className="text-neutral-50 md:text-preset-5-medium text-preset-6">
                            {pair.rate}
                        </span>
                        {/* Variación 100% matemática calculada coa API */}
                        <span className={`flex items-center gitmd:text-preset-5 text-preset-6 ${pair.trend === 'up' ? 'text-green-500' :
                            pair.trend === 'down' ? 'text-red-500' : 'text-neutral-200'
                            }`}>
                            {pair.trend === 'up' && '▲ +'}
                            {pair.trend === 'down' && '▼ -'}
                            {pair.change}%
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}
