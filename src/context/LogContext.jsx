import { createContext, useContext, useState, useEffect } from 'react';

const LogContext = createContext();

export function LogProvider({ children }) {
    // Inicializamos o estado lendo de sessionStorage para manter o historial na sesión do navegador
    const [conversionLog, setConversionLog] = useState(() => {
        const savedLog = sessionStorage.getItem('currency_conversion_log');
        return savedLog ? JSON.parse(savedLog) : [];
    });

    // Controla se o modo gravación está acendido ou apagado
    const [isLogging, setIsLogging] = useState(false);

    // Vixía o historial e garda os cambios en sessionStorage automaticamente
    useEffect(() => {
        sessionStorage.setItem('currency_conversion_log', JSON.stringify(conversionLog));
    }, [conversionLog]);

    // Función para acender/apagar o interruptor do botón
    const toggleLogging = () => setIsLogging(prev => !prev);
    // Engade unha nova liña recollendo o timestamp numérico para poder calcular o tempo despois
    const addLogEntry = (fromAmount, fromCurrency, toAmount, toCurrency) => {
        console.log("Contexto recibiu os datos 2:", { fromAmount, fromCurrency, toAmount, toCurrency });
        if (!isLogging || Number(fromAmount) === 0) return;

        const newEntry = {
            id: crypto.randomUUID(),
            fromAmount: Number(fromAmount),
            fromCurrency,
            toAmount: Number(toAmount),
            toCurrency,
            timestamp: Date.now() // Milisegundos actuais
        };

        setConversionLog(prev => [newEntry, ...prev]);
    };

    // Función para limpar o historial da sesión
    const clearLog = () => setConversionLog([]);

    const deleteLogEntry = (id) => {
        setConversionLog(prev => prev.filter(log => log.id !== id));
    };

    return (
        <LogContext.Provider value={{ conversionLog, isLogging, toggleLogging, addLogEntry, clearLog, deleteLogEntry }}>
            {children}
        </LogContext.Provider>
    );
}

export const useLog = () => useContext(LogContext);
