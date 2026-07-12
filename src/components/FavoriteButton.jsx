import React from 'react';
// Importamos o noso hook do contexto global de favoritos
import { useFavorites } from '../context/FavoritesContext'; 

// Recibimos as dúas moedas actuais do conversor por props
export default function FavoriteButton({ fromCurrency, toCurrency }) {
    
    // Conectamos co almacén global de favoritos
    const { pinnedPairs, togglePinPair } = useFavorites();

    // Extraemos o texto simple (Ex: "USD") tanto se a moeda é un obxecto coma se é texto
    const fromCode = fromCurrency?.code || fromCurrency;
    const toCode = toCurrency?.code || toCurrency;
    const pairId = `${fromCode}-${toCode}`;

    // O botón sabe se esta parella exacta é favorita buscando na memoria
    const isPinned = pinnedPairs.some(pair => pair.id === pairId);

    const handleFavoriteClick = () => {
        if (!fromCode || !toCode) return;
        // Engade ou elimina do localStorage e avisa a toda a aplicación no acto
        togglePinPair(fromCurrency, toCurrency);
    };

    return (
        <button 
            type="button"
            onClick={handleFavoriteClick} // Executa a acción global
            className={`flex justify-between items-center cursor-pointer px-150 py-100 rounded-8 h-[32px] border-[1.5px] uppercase text-preset-5-medium transition-colors
                  ${isPinned
                    ? 'bg-lime-500 border-lime-500 w-[117px] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500 focus-visible:outline-offset-2'
                    : 'bg-neutral-600 border-neutral-500 w-[110px] hover:border-neutral-400 hover:bg-neutral-500 focus:outline-none focus-visible:outline-2 focus-visible:border-lime-500 focus-visible:outline-offset-2'
                }`}
        >
            <img
                src={isPinned ? "./images/icon-star-filled.svg" : "./images/icon-star.svg"}
                alt="star" 
                className={`transition-all ${isPinned ? 'brightness-0' : ''}`} 
            />
            <span className={`transition-colors ${isPinned ? 'text-neutral-900' : 'text-neutral-50'}`}>
                {isPinned ? 'Favorited' : 'Favorite'}
            </span>
        </button>
    );
}
