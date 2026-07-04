import { useState, useEffect } from 'react';

export function TabFavorites({ pinnedPairs = [], amount }) {
    // 1. Control de conexión a internet
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

    // 2. Condición: se non hai internet, se amount é 0, ou se a lista de favoritos está baleira
    const hasNoAmount = Number(amount) === 0;
    const hasNoFavorites = pinnedPairs.length === 0;

    if (!isOnline || hasNoAmount || hasNoFavorites) {
        return (
            <div className="flex flex-col items-center justify-center w-[1036px] h-[154px] gap-200">
                {/* Título dinámico segundo o erro */}
                <p className="text-neutral-100 text-preset-2">
                    {!isOnline || hasNoAmount ? "No comparison available." : "No pinned pairs yet."}
                </p>
                
                {/* Descrición dinámica segundo o erro */}
                <p className="text-preset-4 text-neutral-200 text-center w-[460px]">
                    {!isOnline ? (
                        "You are currently offline. Please check your internet connection."
                    ) : hasNoAmount ? (
                        "Enter an amount in SEND to see what your money is worth in your favorite currencies."
                    ) : (
                        "Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row."
                    )}
                </p>
            </div>
        );
    }

    // 3. Cando si hai internet, hai amount e hai favoritos gardados
    return (
        <div className="text-neutral-200 p-4">
            {/* Aquí irá o mapeo (map) das túas parellas fixadas */}
            Contido de Parellas Fixadas ({pinnedPairs.length})
        </div>
    );
}
