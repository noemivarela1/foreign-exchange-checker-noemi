import React, { useState } from 'react';

export default function FavoriteButton() {
    // O botón xestiona o seu propio estado fixado (estrela) de forma autónoma
    const [isPinned, setIsPinned] = useState(false);

    return (
        <button onClick={() => setIsPinned(!isPinned)}
            className={`flex justify-between items-center cursor-pointer px-150 py-100 rounded-8  w-[110px] h-[32px] border-[1.5px]  uppercase text-preset-5-medium  transition-colors
                  ${isPinned
                    ? 'bg-lime-500 border-lime-500  w-[117px] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500 focus-visible:outline-offset-2'
                    : 'bg-neutral-600 border-neutral-500 w-[110px] hover:border-neutral-400 hover:bg-neutral-500 focus:outline-none focus-visible:outline-2 focus-visible:border-lime-500 focus-visible:outline-offset-2'
                }`}>
            <img
                src={isPinned ? "./images/icon-star-filled.svg" : "./images/icon-star.svg"}
                alt="star" className={`transition-all ${isPinned ? 'brightness-0' : ''}`} />
            <span className={`transition-colors ${isPinned ? 'text-neutral-900' : 'text-neutral-50'}`}>{isPinned ? 'Favorited' : 'Favorite'}</span>
        </button>
    );
}
