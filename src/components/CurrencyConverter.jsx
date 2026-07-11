import { useState, useEffect } from 'react'
import CurrencyPicker from './CurrencyPicker'
import SwapButton from './SwapButton';
import SendCard from './SendCard';
import ReceiveCard from './ReceiveCard';
import ConversionFooter from './ConversionFooter';
import { useLog } from '../context/LogContext';

export default function CurrencyConverter({ amount, setAmount, fromCurrency, setFromCurrency, toCurrency, setToCurrency, convertedAmount, loading }) {
  // Estados para o control do usuario
  const [resultAmount, setResultAmount] = useState(0);

  // Estados para os datos da API
  const [rates, setRates] = useState({})        // Gardará o obxecto con todas as moedas
  //const [loading, setLoading] = useState(true)  // Para saber se a API está cargando
  const [error, setError] = useState(null)      // Por se falla a conexión á internet

  const { isLogging, addLogEntry } = useLog();

  const unitFromAmount = amount && Number(amount) !== 0
    ? (convertedAmount / Number(amount)).toFixed(4)
    : "0.0000";

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Efecto que escoita en tempo real as variables e as grava se o interruptor está "On"
  useEffect(() => { 
    // Filtro rápido: se non gravamos ou as cantidades son cero, paramos aquí
    if (!isLogging || Number(amount) === 0 || Number(convertedAmount) === 0) return;

    // Engadimos o temporizador para que non grave mentres estás a borrar ou escribir rápido
    const timer = setTimeout(() => {
        addLogEntry(amount, fromCurrency, convertedAmount, toCurrency);
    }, 1000); // Agarda 1 segundo de calma antes de gardar

    // Cancela o reloxo anterior se o usuario preme outra tecla antes de que pase o segundo
    return () => clearTimeout(timer);

}, [amount, fromCurrency, convertedAmount, toCurrency, isLogging]); 

  // Se a API aínda está cargando, podemos dar un aviso discreto
  if (loading) return <div className="text-center text-neutral-400 py-10">Loading live exchange rates...</div>
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>

  return (
    <section className="flex flex-col w-[343px] md:w-[720px] xl:w-[1036px] md:justify-around gap-200">
      <h1 className="uppercase text-preset-2 w-full self-start md:w-[720px] ">Check the rate</h1>
      <div className="self-center bg-neutral-700 radius-20 w-[343px] h-[421px] md:w-[720px] xl:w-[1036px] md:h-[223px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-200 p-200 md:p-250">
          <SendCard
            amount={amount}
            setAmount={setAmount}
            fromCurrency={fromCurrency}
            setFromCurrency={setFromCurrency}
          />
          <SwapButton handleSwap={handleSwap} />
          <ReceiveCard
            convertedAmount={convertedAmount}
            toCurrency={toCurrency}
            setToCurrency={setToCurrency}
          />
        </div>
        <ConversionFooter
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          unitFromAmount={unitFromAmount}
          loading={loading}
        />
      </div>
    </section>
  )
}
