import { useState, useEffect } from 'react';

export function TabCompare({ amount, fromCurrency }) {
    // 1. Estado para controlar se o usuario ten internet
    const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    // 2. Condición combinada: se amount é 0 OU se non hai internet
    if (Number(amount) === 0 || !isOnline) {
        return (
            <div className="flex flex-col items-center justify-center w-[1036px] h-[154px] gap-200">
                <p className="text-neutral-100 text-preset-2">No comparison available.</p>
                <p className="text-preset-4 text-neutral-200 text-center w-[460px]">
                    {!isOnline 
                        ? "You are currently offline. Please check your internet connection."
                        : "Enter an amount in SEND above to see what your money is worth in other currencies."
                    }
                </p>
            </div>
        );
    }

    return <div className="text-neutral-200 p-4">Contido de Comparación de moedas</div>;
}
