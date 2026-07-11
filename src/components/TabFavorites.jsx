import { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';


export function TabFavorites({ amount, setFromCurrency, setToCurrency }) {
    // Control de conexión a internet
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const { pinnedPairs, unpinPair } = useFavorites();
    const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState(-1);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);

    // Almacén local para gardar as taxas e porcentaxes calculadas de Frankfurter
    const [ratesData, setRatesData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    useEffect(() => {
        if (pinnedPairs.length === 0 || !isOnline) return;

        async function fetchRates() {
            setLoading(true);
            const updatedRates = {};

            for (const pair of pinnedPairs) {
                try {
                    const fromCode = typeof pair.from === 'object' ? pair.from.code : pair.from;
                    const toCode = typeof pair.to === 'object' ? pair.to.code : pair.to;

                    //  CONTROL DE SEGURIDADE: Se son as mesmas moedas, poñemos 1.0000
                    if (fromCode === toCode) {
                        updatedRates[pair.id] = {
                            rate: "1.0000",
                            change: "0.00%"
                        };
                        continue;
                    }

                    // Devolve un array co último día de bolsa dispoñible (Venres se é fin de semana)
                    const resLatest = await fetch(`https://api.frankfurter.dev/v2/rates?base=${fromCode}&quotes=${toCode}`);
                    const dataLatest = await resLatest.json();

                    // Ao ser un array, buscamos a fila correspondente á moeda de destino
                    const latestRow = Array.isArray(dataLatest) ? dataLatest.find(row => row.quote === toCode) : null;
                    const rateToday = latestRow ? latestRow.rate : null;

                    // Se por un erro crítico da API non hai taxa, saltamos de forma segura
                    if (!rateToday) {
                        updatedRates[pair.id] = { rate: 'Error', change: '0.00%' };
                        continue;
                    }

                    // DATAS PARA FIN DE SEMANA: Lemos a data REAL que devolve a API (o venres se estamos en domingo)
                    // Usamos a data que ven dentro da fila para saber que día pechou a bolsa
                    const apiDateStr = latestRow?.date || new Date().toISOString().split('T')[0];
                    const apiDate = new Date(apiDateStr);

                    // Se a data do mercado foi un luns (1), o día anterior foi o venres (-3 días). Se non, restamos 1 día.
                    if (apiDate.getDay() === 1) {
                        apiDate.setDate(apiDate.getDate() - 3);
                    } else {
                        apiDate.setDate(apiDate.getDate() - 1);
                    }
                    const formattedYesterday = apiDate.toISOString().split('T')[0];

                    // Pedimos o prezo do día anterior de mercado (Xoves se a data base era o venres)
                    const resYesterday = await fetch(`https://api.frankfurter.dev/v2/rates?date=${formattedYesterday}&base=${fromCode}&quotes=${toCode}`);
                    const dataYesterday = await resYesterday.json();

                    // Buscamos a taxa no array de onte
                    const yesterdayRow = Array.isArray(dataYesterday) ? dataYesterday.find(row => row.quote === toCode) : null;
                    const rateYesterday = yesterdayRow ? yesterdayRow.rate : null;

                    // CONTROL EXTRA: Se non hai taxa de onte, poñemos 0% para non romper o deseño
                    if (!rateYesterday) {
                        updatedRates[pair.id] = {
                            rate: rateToday.toFixed(4),
                            change: '0.00%'
                        };
                        continue;
                    }

                    // CÁLCULO DA PORCENTAXE REAL DE 24H (Venres vs Xoves durante a fin de semana)
                    const changePct = ((rateToday - rateYesterday) / rateYesterday) * 100;

                    // Redondeamos primeiro a dous decimais para evitar problemas de micro-decimais
                    const formattedChange = changePct.toFixed(2);

                    let changeText = '';

                    // Aplicamos a túa lóxica estrita de tres estados
                    if (Number(formattedChange) > 0) {
                        changeText = '+' + formattedChange + '%'; // Maior que 0.00 ➔ Signo +
                    } else if (Number(formattedChange) === 0) {
                        changeText = '0.00%';                      // Igual a 0.00 ➔ Sen signo
                    } else {
                        changeText = formattedChange + '%';        // Menor que 0.00 ➔ Signo - (xa o trae JavaScript por defecto)
                    }

                    // Gardamos o texto limpo no almacén de taxas
                    updatedRates[pair.id] = {
                        rate: rateToday.toFixed(4),
                        change: changeText
                    };
                } catch (error) {
                    console.error("Erro cargando taxas en favoritos:", error);
                    updatedRates[pair.id] = { rate: 'Error', change: '0.00%' };
                }
            }

            setRatesData(updatedRates);
            setLoading(false);
        }

        fetchRates();
    }, [pinnedPairs, isOnline]);

    useEffect(() => {
        // Buscamos o primeiro artigo da túa listaxe (o índice 0)
        const firstArticle = document.getElementById('fav-item-0');
        if (firstArticle) {
            // Forzamos ao navegador a poñer o foco nel ao instante
            firstArticle.focus();
            setKeyboardFocusedIndex(0);
        }
    }, [pinnedPairs]);


    // Condición: se non hai internet, se amount é 0, ou se a lista de favoritos está baleira
    const hasNoAmount = Number(amount) === 0;
    const hasNoFavorites = pinnedPairs.length === 0;

    if (!isOnline || hasNoAmount || hasNoFavorites) {
        return (
            <div className="flex flex-col items-center justify-center p-125 xl:w-[1036px] md:w-[768px] xl:h-[154px] gap-200">
                {/* Título dinámico segundo o erro */}
                <p className="text-neutral-100 text-preset-2">
                    {hasNoFavorites ? "No pinned pairs yet" : ""}
                </p>

                {/* Descrición dinámica segundo o erro */}
                <p className="text-preset-4 text-neutral-200 text-center xl:md-[460px] w-[343px]">
                    {!isOnline ? (
                        "You are currently offline. Please check your internet connection."
                    ) :
                        (
                            "Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row."
                        )}
                </p>
            </div>
        );
    }
    return (
        <div className="flex flex-col w-[343px] md:w-[720px] xl:w-[1036px] gap-200 p-200 md:gap-250 md:p-250 text-neutral-200 mx-auto bg-neutral-700/30 rounded-xl border border-neutral-600 rounded-16">
            {/* Cabeceira co contador oficial esixido ("10 favorites") */}
            <div className="flex justify-between items-center">
                <h3 className="text-preset-3-medium uppercase text-neutral-50  tracking-wider">
                    {pinnedPairs.length === 1 ? 'Pinned pair' : 'Pinned pairs'}
                </h3>
                {loading && <span className="text-xs text-neutral-400 animate-pulse">Updating rates...</span>}
                <p className="uppercase text-preset-5 text-neutral-50 opacity-70">{pinnedPairs.length}  {pinnedPairs.length === 1 ? 'favorite' : 'favorites'}</p>
            </div>

            {/* Mapeo dinámico da lista de favoritos con estrelas cheas permanentes */}
            <div className="flex flex-col w-[311px] md:w-[680px] md:max-h-[596px] xl:w-[996px] overflow-y-auto gap-250 no-scrollbar">
                {pinnedPairs.map((pair, index) => {
                    // Lemos os datos cargados de Frankfurter ou poñemos un indicador de carga
                    const liveData = ratesData[pair.id] || { rate: 'Loading...', change: '0.00%' };
                    const isZero = liveData.change.includes('0.00%');
                    const isPositive = !isZero && !liveData.change.startsWith('-');
                    const fromCurrencyObj = pair.from;
                    const toCurrencyObj = pair.to;

                    const handleKeyDown = (e) => {
                        console.log("Teclado pulsado:", e.key, "Índice actual:", index);
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setIsKeyboardActive(true);
                            // Se o estado estaba apagado (-1), a primeira frecha acende estritamente a primeira tarxeta (0)
                            const nextIdx = !isKeyboardActive ? 0 : index + 1;
                            const nextArticle = document.getElementById(`fav-item-${nextIdx}`);

                            if (nextArticle) {
                                nextArticle.focus();
                                setKeyboardFocusedIndex(nextIdx);
                                setTimeout(() => {
                                    nextArticle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }, 0);
                            }
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setIsKeyboardActive(true);
                            const prevArticle = document.getElementById(`fav-item-${index - 1}`);
                            if (prevArticle) {
                                prevArticle.focus();
                                setKeyboardFocusedIndex(index - 1);
                                prevArticle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        } else if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (fromCurrencyObj && toCurrencyObj) {
                                setFromCurrency(fromCurrencyObj);
                                setToCurrency(toCurrencyObj);
                            }
                        }
                    };


                    return (
                        <article
                            key={pair.id}
                            id={`fav-item-${index}`} /* ID único para poder identificalo coas frechas */
                            tabIndex={0}
                            onKeyDown={handleKeyDown} //Captura as frechas, Enter e Espacio
                            onClick={() => {
                                if (fromCurrencyObj && toCurrencyObj) {
                                    setFromCurrency(fromCurrencyObj); // Enche a caixa orixe de arriba
                                    setToCurrency(toCurrencyObj);     // Enche a caixa destino de arriba
                                }
                            }}
                            className={"flex justify-between items-center h-[59px] md:px-200 md:py-150 gap-200 p-200 bg-neutral-600/80 rounded-10 border-2 border-transparent hover:border-neutral-50 focus:outline-none  transition-all duration-150 " +
                                (isKeyboardActive && keyboardFocusedIndex === index
                                    ? "!border-lime-500 ring-1 ring-lime-500"
                                    : "")}
                        >
                            {/* Nome do par co formato esixido: "USD ➔ EUR" */}
                            <div className="flex items-center gap-100 text-preset-4">
                                <span className="text-neutral-50">
                                    {typeof pair.from === 'object' ? pair.from.code : pair.from}
                                </span>
                                <span className="text-neutral-200">➔</span>
                                <span className="text-neutral-50">
                                    {typeof pair.to === 'object' ? pair.to.code : pair.to}
                                </span>
                            </div>

                            {/* Taxa en vivo, cambio 24h e a estrela para borrar */}
                            < div className="flex items-center gap-250" >
                                <div className="flex flex-col items-end gap-075">
                                    <div className="text-preset-3 text-neutral-50">
                                        {liveData && liveData.rate !== undefined && liveData.rate !== null
                                            ? Number(liveData.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : "0.00"
                                        }
                                    </div>

                                    {/* Etiqueta de porcentaxe verde se é positivo, ou vermella se é negativo */}
                                    <div className={`text-preset-6 ${isZero
                                        ? 'text-neutral-200'
                                        : isPositive ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {liveData.change}
                                    </div>
                                </div>

                                {/* Ao facer clic executa unpinPair e a fila desaparece instantaneamente */}
                                < button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unpinPair(pair.id);
                                    }}
                                    className="hover:text-neutral-500 cursor-pointer transition-colors focus:outline-none"
                                    aria-label="Unpin currency pair"
                                    tabIndex={-1}
                                >
                                    <img src="./images/icon-star-filled.svg" alt="favorite" className="border-2 border-lime-500  rounded-8 w-400 p-100" />
                                </button>
                            </div>
                        </article >
                    );
                })}
            </div >
        </div >
    );
}
