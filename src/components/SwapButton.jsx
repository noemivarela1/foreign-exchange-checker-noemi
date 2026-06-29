import React from 'react';

// Recibimos a función handleSwap dende o pai a través das props
export default function SwapButton({ handleSwap }) {
    return (
        <button onClick={handleSwap}
            className="flex items-center justify-center w-12 h-12 bg-neutral-600 rounded-lg border-[1.5px] border-neutral-500">
            <img src="./images/icon-exchange.svg" alt="swap currencies" className="" />
        </button>
    );
}
