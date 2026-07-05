import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    // Inicializamos lendo do localStorage do navegador
    const [pinnedPairs, setPinnedPairs] = useState(() => {
        const savedFavorites = localStorage.getItem('currency_favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    // Gardamos os cambios automaticamente no navegador
    useEffect(() => {
        localStorage.setItem('currency_favorites', JSON.stringify(pinnedPairs));
    }, [pinnedPairs]);

    // Función que engade ou quita o par directamente (Toggle)
    const togglePinPair = (fromCurrency, toCurrency) => {
        const fromCode = fromCurrency?.code || fromCurrency;
        const toCode = toCurrency?.code || toCurrency;
        const pairId = `${fromCode}-${toCode}`;
        
        setPinnedPairs(prev => {
            const exists = prev.some(pair => pair.id === pairId);
            if (exists) {
                // Se xa existía, eliminámolo (Unpin / Desmarcar)
                return prev.filter(pair => pair.id !== pairId);
            } else {
                // Se non existía, engadímolo (Pin / Marcar)
                return [...prev, { id: pairId, from: fromCurrency, to: toCurrency }];
            }
        });
    };

    // Función directa para borrar dende a estrela da fila
    const unpinPair = (id) => {
        setPinnedPairs(prev => prev.filter(pair => pair.id !== id));
    };

    return (
        <FavoritesContext.Provider value={{ pinnedPairs, togglePinPair, unpinPair }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);
