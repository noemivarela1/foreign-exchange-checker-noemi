import { useState, useEffect } from 'react'
import CurrencyPicker from './CurrencyPicker'
import SwapButton from './SwapButton';
import SendCard from './SendCard';
import ReceiveCard from './ReceiveCard';
import ConversionFooter from './ConversionFooter';

//import LogButton from './LogButton';
//import FavoriteButton from './FavoriteButton';

export default function CurrencyConverter({ amount, setAmount, fromCurrency, setFromCurrency, toCurrency, setToCurrency, convertedAmount, loading }) {
  // Estados para o control do usuario
  const [resultAmount, setResultAmount] = useState(0);
  //const [isEditing, setIsEditing] = useState(false);

  // Estados para os datos da API
  const [rates, setRates] = useState({})        // Gardará o obxecto con todas as moedas
  //const [loading, setLoading] = useState(true)  // Para saber se a API está cargando
  const [error, setError] = useState(null)      // Por se falla a conexión á internet

  //const [isPinned, setIsPinned] = useState(false)
  // const [isPressed, setIsPressed] = useState(false)

  const unitFromAmount = amount && Number(amount) !== 0
    ? (convertedAmount / Number(amount)).toFixed(4)
    : "0.0000";

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };


  // Se a API aínda está cargando, podemos dar un aviso discreto
  if (loading) return <div className="text-center text-neutral-400 py-10">Loading live exchange rates...</div>
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>

  return (


    <section className="flex flex-col justify-around gap-4">
      <h1 className="uppercase text-preset-2">Check the rate</h1>
      <div className="bg-neutral-700 radius-20 w-[1036px] h-[223px]">
        <div className="flex items-center justify-center gap-300 h-[158px]">
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
