import React, { useState, useEffect } from 'react';

export function CurrencyChart({ fromCurrency, toCurrency, lastToRange, activeRange, isOnline = true }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formattedDate, setFormattedDate] = useState('');
    console.log("last:" + lastToRange);

    useEffect(() => {
        const now = new Date();

        // Obtemos o mes abreviado de 3 letras en inglés (Ex: "Jul") e pasámolo a maiúsculas ("JUL")
        const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();

        // Obtemos o día con dous díxitos (Ex: "06")
        const day = now.toLocaleString('en-US', { day: '2-digit' });

        // Obtemos a hora e minutos con formato 24 horas (Ex: "17:42")
        const time = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Obtemos de forma intelixente a zona horaria curta oficial (Ex: "CEST" ou "CET")
        // Se por algún motivo o navegador devolve un huso longo, aplicamos un "fallback" seguro a CET
        const timeZoneParts = now.toLocaleDateString('en-US', { day: 'numeric', timeZoneName: 'short' }).split(', ');
        const timeZone = timeZoneParts[1] || 'CET';

        // Xuntamos todas as pezas co teu formato exacto
        setFormattedDate(`${month} ${day} ${time} ${timeZone}`);
    }, []);

    useEffect(() => {
        if (!isOnline) return;

        async function fetchChartHistory() {
            try {
                setLoading(true);
                const fromCode = fromCurrency?.code || fromCurrency;
                const toCode = toCurrency?.code || toCurrency;

                if (fromCode === toCode) {
                    setChartData([]);
                    setLoading(false);
                    return;
                }

                // CALCULAMOS A DATA DE INICIO SEGUNDO OS TEUS 6 RANGOS EXACTOS
                const endDate = new Date();
                const startDate = new Date();
                console.log("activeRange:" + activeRange);
                if (activeRange === '1D') startDate.setDate(endDate.getDate() - 1);
                else if (activeRange === '1W') startDate.setDate(endDate.getDate() - 7);
                else if (activeRange === '1M') startDate.setDate(endDate.getDate() - 30);
                else if (activeRange === '3M') startDate.setDate(endDate.getDate() - 90);
                else if (activeRange === '1Y') startDate.setFullYear(endDate.getFullYear() - 1);
                else if (activeRange === '5Y') startDate.setFullYear(endDate.getFullYear() - 5);

                // Control de fin de semana para os rangos curtos (Evita NaN)
                const dayOfWeek = endDate.getDay();
                if ((dayOfWeek === 0 || dayOfWeek === 6) && (activeRange === '1D' || activeRange === '1W')) {
                    startDate.setDate(startDate.getDate() - 2);
                }

                const startDateStr = startDate.toISOString().split('T')[0];

                // PETICIÓN Á API DE FRANKFURTER V2
                const url = `https://api.frankfurter.dev/v2/rates?from=${startDateStr}&base=${fromCode}&quotes=${toCode}`;
                console.log("url:" + url);
                const response = await fetch(`https://api.frankfurter.dev/v2/rates?from=${startDateStr}&base=${fromCode}&quotes=${toCode}`);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setChartData(data);
                } else {
                    setChartData([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Erro no gráfico SVG:", error);
                setLoading(false);
            }
        }

        fetchChartHistory();
    }, [fromCurrency, toCurrency, activeRange, isOnline]);

    

    // MATEMÁTICAS DO SVG PARA AXUSTAR OS PREZOS ÁS DIMENSIÓNS DO CADRADO
    //const width = 996;
    //const height = 298;

    const getGraphWidth = () => {
        const widthNow = window.innerWidth;
        if (widthNow < 768) {
            return 319;   //Ancho estrito para móbil
        } else if (widthNow >= 768 && widthNow < 1024) {
            return 680;   // Ancho estrito para tablet
        } else {
            return 996;   //Ancho estrito para desktop
        }
    };

    // 2. ESTADOS DINÁMICOS DO GRÁFICO
    const [width, setWidth] = useState(getGraphWidth());
    const height = 298; // O alto mantense fixo a 298px en tódolos tamaños

    // 3. EFECTO QUE ESCOITA O RESIZE E ACTUALIZA O ANCHO DE SOLPETO
    useEffect(() => {
        const handleResize = () => {
            setWidth(getGraphWidth());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const paddingX = 60; // Espazo para as etiquetas do eixe Y
    const paddingY = 30; // Espazo para as etiquetas do eixe X

    const rates = chartData.map(d => d.rate);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);
    const rateRange = maxRate - minRate === 0 ? 1 : maxRate - minRate;

    // Protexemos o cálculo de puntos da liña se só hai un dato
    const points = chartData.map((d, index) => {
        const x = chartData.length <= 1
            ? paddingX + (width - paddingX - 20) / 2
            : paddingX + (index / (chartData.length - 1)) * (width - paddingX - 20);

        const y = height - paddingY - ((d.rate - minRate) / rateRange) * (height - 2 * paddingY);
        return `${x},${y}`;
    }).join(' ');


    // Escollemos 3 etiquetas representativas para o eixe X (Inicio, Medio, Final)
    const totalPoints = chartData.length;
    console.log("totalPoints:" + totalPoints);
    const rawIndexes = [0, Math.floor(totalPoints / 2), totalPoints - 1];

    const xLabelIndexes = [...new Set(
        rawIndexes.filter(i => i >= 0 && i < totalPoints)
    )];

    if (loading) return <div className="text-neutral-500 p-4 text-preset-5 uppercase animate-pulse">Loading chart...</div>;
    if (chartData.length === 0) return null;

    return (
        <div className="w-[319px] h-[398px] md:w-[720px] md:h-[377px] md:gap-250 xl:w-[1036px] xl:h-[377px] md:p-250 bg-neutral-800/20 rounded-16 border border-neutral-700/50 flex flex-col justify-center items-center">
            <div className="flex justify-between items-center text-neutral-50 md:w-[680px] w-[319px] xl:w-[996px]">
                <span className="text-preset-3-medium">{fromCurrency.code}/{toCurrency.code}</span>
                <span className="text-preset-5"> {lastToRange} • {formattedDate}</span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none" focusable="false">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#CEF739" stopOpacity="0.90" />
                        <stop offset="0%" stopColor="#CEF739" stopOpacity="0.70" />
                        <stop offset="100%" stopColor="#2E2E2E" stopOpacity="0.50" />
                    </linearGradient>
                </defs>

                {/* REIXAS HORIZONTAIS DE FONDO (Líneas guía discretas) */}
                {[0, 0.5, 1].map((ratio, i) => {
                    const y = paddingY + ratio * (height - 2 * paddingY);
                    const value = maxRate - ratio * rateRange;
                    return (
                        <g key={i}>
                            {/* Liña sutil gris */}
                            <line x1={paddingX} y1={y} x2={width - 20} y2={y} className="stroke-neutral-500" strokeDasharray="3 3" />
                            {/* Texto de prezos á esquerda (Eixe Y) */}
                            <text x={paddingX - 10} y={y + 4} textAnchor="end" style={{ fill: 'var(--color-neutral-200)' }} className="text-[11px] font-mono">
                                {value.toFixed(4)}
                            </text>
                        </g>
                    );
                })}

                {/* EIXE X (Etiquetas de datas debaixo do gráfico) */}
                {xLabelIndexes.map((index) => {
                    const d = chartData[index];
                    if (!d) return null;

                    const x = chartData.length <= 1
                        ? paddingX + (width - paddingX - 20) / 2
                        : paddingX + (index / (chartData.length - 1)) * (width - paddingX - 20);

                    const isLongRange = activeRange === '1Y' || activeRange === '5Y';

                    // 1. Sacamos o Mes e o Día para que sexa igual en tódolos rangos
                    const baseDate = new Date(d.date);
                    const monthDay = baseDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

                    // 2. AMAÑO COHERENTE: Se é rango longo, engadímoslle a coma e os 2 díxitos do ano á dereita
                    const formattedDateStr = isLongRange
                        ? `${monthDay}, ${baseDate.getFullYear().toString().slice(-2)}` // Amosa: "Jul 07, 25" ou "Jan 06, 26"
                        : monthDay; // Amosa: "Jun 07" ou "Jul 07" coma sempre


                    return (
                        <text key={index} x={x - 10} y={height - 5} textAnchor="middle" style={{ fill: 'var(--color-neutral-200)' }} className="text-preset-6">
                            {formattedDateStr}
                        </text>
                    );
                })}

                {/* Separamos e calculamos as coordenadas X e Y de forma limpa para o path do degradado */}
                {chartData.length > 1 && (() => {
                    const firstPoint = points.split(' ')[0].split(',');
                    const lastPoint = points.split(' ').pop().split(',');

                    return (
                        <path
                            fill="url(#areaGradient)"
                            // M movese ao primeiro punto, logo debuxa a liña (L), baixa en vertical (V), vai ao inicio (H) e pecha (Z)
                            d={`M ${firstPoint[0]} ${firstPoint[1]} L ${points.replace(/,/g, ' ')} V ${height - paddingY} H ${firstPoint[0]} Z`}
                        />
                    );
                })()}

                {/* A LIÑA DO GRÁFICO REAL EN VERDE LIMA */}
                {chartData.length > 1 && (
                    <polyline
                        fill="none"
                        className="stroke-lime-500"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                    />
                )}

            </svg>
        </div>
    );

}
