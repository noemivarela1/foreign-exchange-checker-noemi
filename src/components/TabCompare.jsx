import React, { useState, useEffect, Fragment } from 'react';
import { currenciesMap } from '../data/currencies';
import { useFavorites } from '../context/FavoritesContext';

export function TabCompare({ amount, fromCurrency, toCurrency }) {
    // Estado para controlar se o usuario ten internet
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);

    // 🚀 Extraemos as tres ferramentas reais do teu contexto de favoritos
    const { pinnedPairs, togglePinPair, unpinPair } = useFavorites();
    const favoritesContext = useFavorites();
    console.log("Ferramentas reais do meu contexto:", favoritesContext);

    useEffect(() => {
        // Funcións para actualizar o estado cando cambie a rede
        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);

        // Limpeza dos eventos ao desmontar o compoñente
        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    useEffect(() => {
        if (!fromCurrency || !fromCurrency.code) return;

        setLoading(true);
        const todayStr = new Date().toLocaleDateString('sv-SE'); // "2026-07-09"

        fetch(`https://api.frankfurter.dev/v2/rates?date=${todayStr}&base=${fromCurrency.code}`, {
            cache: "no-store" // Forza a consulta en tempo real
        })
            .then((res) => res.json())
            .then((data) => {
                // Se data é o array nativo da API v2, transformámolo
                if (Array.isArray(data)) {
                    const formattedRates = {};

                    // Percorremos o array e enchemos o noso mapa: {"USD": 1.0925, "GBP": 0.8340}
                    data.forEach((item) => {
                        if (item.quote && item.rate) {
                            formattedRates[item.quote] = item.rate;
                        }
                    });

                    setRates(formattedRates);
                    console.log("Rates convertidos con éxito para o teu .map():", formattedRates);
                } else {
                    console.warn("A API v2 non devolveu o array agardado. Revisa o endpoint.");
                    setRates({});
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro cargando comparativas:", err);
                setLoading(false);
            });
    }, [fromCurrency.code]); // Escoitamos a propiedade primitiva do texto para evitar bucles

    // Condición combinada: se amount é 0 OU se non hai internet
    if (Number(amount) === 0 || !isOnline) {
        return (
            <div className="flex flex-col items-center justify-center p-125 w-[343px] xl:w-[1036px] md:w-[768px] xl:h-[154px] gap-200">
                <p className="text-neutral-100 text-preset-2">No comparison available.</p>
                <p className="text-preset-4 text-neutral-200 text-center w-[343px] md:w-[460px]">
                    {!isOnline
                        ? "You are currently offline. Please check your internet connection."
                        : "Enter an amount in SEND above to see what your money is worth in other currencies."
                    }
                </p>
            </div>
        );
    }

    const targetCurrencies = Object.keys(currenciesMap).filter(code => code !== fromCurrency.code && code !== toCurrency.code);


    return (
        <div className="flex flex-col items-center w-[343px] xl:w-[1036px] md:w-[720px]  gap-250 p-200 text-neutral-200 bg-neutral-700/30 border border-neutral-600 rounded-16">
            {/* Cabeceira coa cantidade e a moeda orixe */}
            <div className="flex flex-col md:justify-between md:w-[680px] md:flex-row items-start md:items-center gap-150" >
                <h3 className="uppercase text-neutral-50 tracking-wider uppercase">
                    <span className="text-preset-4">multi-currency</span> <span className="text-preset-3-medium">{amount} from {fromCurrency.code}</span>
                </h3>
                <p className="uppercase text-preset-5">{targetCurrencies.length} pairs</p>
            </div>

            {loading ? (
                <div className="text-center text-neutral-400 py-4">Cargando tarifas...</div>
            ) : (
                <div className="flex flex-wrap gap-200 w-[311px] md:w-[680px] md:max-h-[572px] overflow-y-auto no-scrollbar xl:w-[996px] justify-start items-center">
                    {targetCurrencies.map((code, index) => {
                        // 1. Buscamos a taxa que vén do servizo web para este código de 3 letras (Ex: rates["USD"])
                        const rate = rates[code] || 0;
                        console.log("rate:" + rate);
                        // 2. Calculamos a conversión multiplicando a cantidade do Converter por ese número
                        const totalConversion = (Number(amount) * rate).toFixed(2);

                        // 3. Extraemos os datos locais do teu currencies.js (Trae code, name, flag en webp)
                        const currencyInfo = currenciesMap[code] || { name: code, flag: './images/flags/default.webp' };

                        // Verificamos se coincide co destino elixido no converter para o bordo verde lima
                        const isTargetSelected = code === toCurrency?.code;

                        // Xestión dos favoritos conectada de xeito seguro
                        const existingPair = pinnedPairs?.find(pair => {
                            const pairFrom = pair.from?.code || pair.from;
                            const pairTo = pair.to?.code || pair.to;
                            return pairFrom === fromCurrency.code && pairTo === code;
                        });


                        const isPinned = !!existingPair;
                        console.log("isPinned" + isPinned);
                        const handleFavoriteToggle = () => {
                            if (isPinned) {
                                // Se xa é favorito, chamamos á túa función directa de borrar pasando o ID
                                unpinPair(existingPair.id);
                            } else {
                                // Se non é favorito, chamamos a togglePinPair pasándolle os dous obxectos de moeda
                                // Extraemos os datos da moeda destino do teu currenciesMap para que vaia o obxecto completo
                                const targetCurrencyObj = currenciesMap[code];

                                // Enviamos os dous obxectos exactamente como os procesa o teu FavoritesContext
                                togglePinPair(fromCurrency, targetCurrencyObj);
                            }
                        };

                        return (
                            <Fragment key={code}>
                                {/* CARD INDIVIDUAL DA MOEDA (Mantendo o teu deseño exacto) */}
                                <div className={`w-[311px] h-[61px] md:w-[680px] md:h-[61px] p-150 bg-neutral-600 border rounded-8 p-150 flex  justify-between items-center transition-all ${isTargetSelected
                                    ? 'border-lime-500'
                                    : 'border-neutral-800 hover:border-neutral-600'
                                    }`}>
                                    {/* Parte esquerda: bandeira automatizada en webp e código da moeda de conversión */}
                                    <div className="flex justify-between w-full items-center">
                                        {/* Mellorado cun contedor redondeado para que as túas imaxes .webp queden niqueladas */}
                                        <span className="w-300 h-300 overflow-hidden rounded-full flex items-center justify-center bg-neutral-800">
                                            <img src={currencyInfo.flag} alt={`${code} flag`} className="w-300 h-300 object-cover" />
                                        </span>
                                        <div className="flex flex-col justify-between w-[215px] md:w-[584px] gap-075">
                                            <div className="flex justify-between">
                                                <span className="text-preset-4 text-neutral-50 uppercase">{code}</span>
                                                <span className="text-neutral-50 text-preset-3 uppercase tracking-wider font-bold">
                                                    {rate > 0
                                                        ? Number(totalConversion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                        : "0.00"
                                                    }
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-preset-5 text-neutral-200 truncate">{currencyInfo.name}</span>
                                                    <span className="text-preset-5 text-neutral-200">
                                                        @ {rate > 0 ? Number(rate).toFixed(4) : "0.0000"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Botón da estrela conectado ao teu contexto */}
                                        {/* Ao facer clic executa unpinPair e a fila desaparece instantaneamente */}
                                        <button
                                            onClick={handleFavoriteToggle}
                                            className="hover:text-neutral-500 cursor-pointer transition-colors focus:outline-non w-400"
                                            aria-label="Unpin currency pair"
                                        >
                                            <img src={isPinned ? "./images/icon-star-filled.svg" : "./images/icon-star.svg"}
                                                alt="favorite"
                                                className={isPinned ? "border-2 border-lime-500 p-100 rounded-8 w-400" : "p-100 w-400"} />
                                        </button>
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>


            )}
        </div >
    );
}
