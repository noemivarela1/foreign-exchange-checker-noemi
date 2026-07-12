import { useState, useEffect } from 'react';
import { useLog } from '../context/LogContext';

// Función auxiliar para calcular as diferenzas de tempo estilizadas dende a conversión
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const differenceInSeconds = Math.floor((now - timestamp) / 1000);

    if (differenceInSeconds < 60) return 'Just now';

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) return `${differenceInMinutes}M`;

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) return `${differenceInHours}H`;

    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });

    return `${day} ${month}`;
}

export function TabLog({ amount }) {
    const { conversionLog, clearLog, deleteLogEntry } = useLog();
    // Control de conexión a internet
    const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    // Condición: se non hai internet, se amount é 0, ou se o historial está baleiro
    const hasNoAmount = Number(amount) === 0;
    const hasNoLogs = conversionLog.length === 0;

    if (!isOnline || hasNoAmount || hasNoLogs) {
        return (
            <div className="flex flex-col items-center justify-center p-125 xl:w-[1036px] md:w-[768px] xl:h-[154px] gap-200">
                {/* Título dinámico segundo o estado */}
                <p className="text-neutral-100 text-preset-2">
                    {hasNoLogs ? "No conversions logged yet." : ""}
                </p>

                {/* Descrición dinámica segundo o estado */}
                <p className="text-preset-4 text-neutral-200 text-center  md:w-[500px] w-[343px]">
                    {!isOnline ? (
                        "You are currently offline. Please check your internet connection."
                    ) : hasNoLogs ? (
                        "Enter an amount in SEND to see what your money is worth in your conversion log."
                    ) : (
                        "Every conversion is recorded here when you tap LOG CONVERSION. Your log is private to this session and this browser."
                    )}
                </p>
            </div>
        );
    }

    // Cando hai internet, hai amount e hai conversións rexistradas
    return (
        <section className="flex flex-col w-[343px] md:w-[720px] xl:w-[1036px] md:gap-250 md:p-250 text-neutral-200 mx-auto bg-neutral-900/30 rounded-xl border border-neutral-800">
            {/* Cabeceira co contador e o botón de borrar */}
            <header className="flex flex-col md:flex-row gap-125 justify-between items-center border-b border-neutral-600">
                <h3 className="text-preset-3 self-start uppercase text-lime-50 tracking-wider">
                    Conversion Log
                </h3>
                <div className="flex w-full md:w-1/2 md:justify-end justify-between items-center  gap-200">
                    <p className="uppercase text-preset-5 text-neutral-50 opacity-70">{conversionLog.length} logged</p>
                    <button
                        type="button"
                        onClick={clearLog}
                        className="text-preset-5 uppercase text-neutral-200 h-[30px] w-[93px] border border-neutral-400 radius-8 bg-neutral-600 hover:text-red-400 transition-colors cursor-pointer focus:outline-none"
                    >
                        Clear all
                    </button>
                </div>
            </header>

            {/* Lista con scroll se acumulas moitos logs */}
            <div className="flex flex-col gap-2 md:max-h-[596px] gap-250 xl:w-[996px] overflow-y-auto pr-2 no-scrollbar">
                {conversionLog.map((log) => (
                    <article
                        key={log.id}
                        className="flex justify-between items-center h-[64px] gap-150 p-150 md:gap-200 md:p-200 bg-neutral-600/80 rounded-lg border border-neutral-600/50 hover:border-neutral-500/50 transition-all duration-150"
                    >
                        <div className="flex flex-col gap-050 md:flex-row items-center">
                            {/* Tempo transcorrido relativo */}
                            <div className="text-preset-4 self-start text-neutral-200 gap-100 bg-neutral-900/60 w-[64px] rounded-full border border-neutral-700/30">
                                {formatTimeAgo(log.timestamp)}
                            </div>
                            <span className="text-neutral-50 text-preset-4">{log.fromCurrency.code} ➔ {log.toCurrency.code}</span>
                        </div>
                        <div className="flex gap-125 items-center">
                            {/* Cantidades e Moedas de orixe e destino */}
                            <div className="flex flex-col md:flex-row md:gap-250 gap-025 items-end">
                                <span className="text-neutral-100 text-preset-3">
                                    {log.fromAmount !== undefined && log.fromAmount !== null
                                        ? Number(log.fromAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : "0.00"
                                    }
                                </span>
                                <span className="text-lime-500 text-preset-3">
                                    {log.toAmount !== undefined && log.toAmount !== null
                                        ? Number(log.toAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : "0.00"
                                    }
                                </span>
                            </div>
                            <img onClick={() => deleteLogEntry(log.id)} src="./images/icon-delete.svg" alt="delete" />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
