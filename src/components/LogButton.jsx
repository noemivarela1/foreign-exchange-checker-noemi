import React from 'react';
import { useLog } from '../context/LogContext'; 

export default function LogButton() {
    // Eliminamos o useState local e usamos o do contexto central
    const { isLogging, toggleLogging } = useLog();

    return (
        <button
            onClick={toggleLogging} // Agora activa o modo gravación en toda a web
            className={`h-[32px] py-100 cursor-pointer border rounded-8 text-preset-5-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500 focus-visible:outline-offset-2
                    ${isLogging //  Usa o estado global para cambiar o deseño
                    ? 'bg-lime-500 border-lime-500 text-neutral-900 w-[132px]'
                    : 'border-lime-500 bg-transparent text-lime-500 w-[132px] hover:bg-lime-950 uppercase'
                }`}>
            {/* O texto cambia de xeito sincronizado con toda a app */}
            <span>{isLogging ? 'Logged' : 'Log conversion'}</span>
        </button>
    );
}

