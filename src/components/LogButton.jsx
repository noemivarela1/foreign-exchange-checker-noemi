import React, { useState } from 'react';

export default function LogButton() {
    // O propio botón controla se está premido ou no seu estado normal
    const [isPressed, setIsPressed] = useState(false);

    return (
        <button
            onClick={() => setIsPressed(!isPressed)}
            className={`h-[32px] py-100 border rounded-8 text-preset-5-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500 focus-visible:outline-offset-2
                    ${isPressed
                    ? 'bg-lime-500 border-lime-500 text-neutral-900 w-[132px]'
                    : 'border-lime-500 bg-transparent text-lime-500 w-[132px] hover:bg-lime-950 uppercase' // Cando está NORMAL
                }`}>
            <span>{isPressed ? 'Logged' : 'Log conversion'}</span>
        </button>
    );
}
