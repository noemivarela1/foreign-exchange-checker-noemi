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
        localDate.setDate(localDate.getDate() - 1);
        const yesterdayStr = localDate.toLocaleDateString('sv-SE'); 

        // 1. Chamada á API coa túa URL exacta
        const response = await fetch(`https://api.frankfurter.dev/v2/rates?from=${yesterdayStr}`);
        const data = await response.json(); 

        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Extraemos dinamicamente as datas do array para saber cal é onte e cal é hoxe
        const availableDates = [...new Set(data.map(item => item.date))].sort();
        
        // Se por fins de semana ou festivos só vén unha data, poñemos as dúas iguais para evitar erros
        const oldestDay = availableDates[0];
        const newestDay = availableDates[availableDates.length - 1] || oldestDay;

        // 3. Inicializamos dous mapas baleiros para separar os prezos de cada día (Base EUR)
        const ratesYesterday = { EUR: 1 };
        const ratesToday = { EUR: 1 };

        // 4. Clasificamos cada obxecto do Array plano segundo a súa data real
        data.forEach(item => {
          if (item.date === oldestDay) {
            ratesYesterday[item.quote] = item.rate;
          }
          if (item.date === newestDay) {
            ratesToday[item.quote] = item.rate;
          }
        });

        // 5. Calculamos as taxas reais de Forex para os teus 7 pares de xeito matemático
        const calculatedPairs = PAIRS_TO_SHOW.map(pair => {
          // Fórmula cruzada: Taxa do par = Valor do Target en EUR / Valor da Base en EUR
          const rateToday = ratesToday[pair.target] / ratesToday[pair.base];
          const rateYesterday = ratesYesterday[pair.target] / ratesYesterday[pair.base];

          // CÁLCULO REAL: Porcentaxe de variación de 24h sen inventar nada
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
    <div className="relative w-full bg-neutral-900 border-y border-neutral-800 py-2 overflow-hidden flex whitespace-nowrap">
    
    <div className="absolute left-0 top-0 z-10 bg-lime-500 px-4 py-3 text-preset-4-medium text-neutral-900 z-10 border-r border-neutral-700 whitespace-nowrap">
      ● LIVE MARKETS
    </div>

      {/* Cinta con movemento continuo e pausa ao pasar o rato */}
      <div className="flex gap-10 animate-marquee shrink-0">
        {duplicatedItems.map((pair, index) => (
          <div 
            key={`${pair.base}-${pair.target}-${index}`} 
            className="flex items-center gap-3 text-sm font-medium bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-md select-none cursor-pointer"
          >
            {/* Nome do Par */}
            <span className="text-neutral-200 text-preset-5">
              {pair.base}/{pair.target}
            </span>
            
            {/* Prezo actual */}
            <span className="text-neutral-50 text-preset-5-medium">
              {pair.rate}
            </span>
            
            {/* Variación 100% matemática calculada coa API */}
            <span className={`flex items-center gap-0.5 font-bold text-preset-5 ${
              pair.trend === 'up' ? 'text-green-500' : 
              pair.trend === 'down' ? 'text-red-500' : 'text-neutral-400'
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
