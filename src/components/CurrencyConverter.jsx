import { useState, useEffect } from 'react'
import CurrencyPicker from './CurrencyPicker.jsx'

export default function CurrencyConverter() {
  // 1. Estados para o control do usuario
  const [amount, setAmount] = useState(1000)
  const [resultAmount, setResultAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);


  const [fromCurrency, setFromCurrency] = useState({ code: 'USD', name: 'US Dollar', flag: './images/flags/us.webp' });
  const [toCurrency, setToCurrency] = useState({ code: 'EUR', name: 'Euro', flag: './images/flags/eu.webp' });

  // 2. Estados para os datos da API
  const [rates, setRates] = useState({})        // Gardará o obxecto con todas as moedas
  const [loading, setLoading] = useState(true)  // Para saber se a API está cargando
  const [error, setError] = useState(null)      // Por se falla a conexión á internet

  const [isPinned, setIsPinned] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // 3. Chamada á API cando se monta a web
  useEffect(() => {
    setLoading(true);
    // Usamos a API gratuíta baseada en USD por comodidade
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao conectar coa API de moedas')
        return response.json()
      })
      .then((data) => {

        console.log(data.rates)

        setRates(data.rates) // Gardamos o obxecto de taxas (Ex: { EUR: 0.92, GBP: 0.78... })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Calculamos a conversión en tempo real
  // Fórmula matemática universal: (Cantidade / Taxa_Orixe) * Taxa_Destino
  let convertedAmount = 0;

  let unitFromAmount = 0;

  if (!loading && rates && rates[fromCurrency.code] && rates[toCurrency.code]) {
    const amountInUSD = amount / rates[fromCurrency.code]
    convertedAmount = Number(amountInUSD * rates[toCurrency.code]);

    unitFromAmount = (rates[toCurrency.code] / rates[fromCurrency.code]).toFixed(4);
  }

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Se a API aínda está cargando, podemos dar un aviso discreto
  if (loading) return <div className="text-center text-neutral-400 py-10">Loading live exchange rates...</div>
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>

  return (
    <div className="bg-neutral-700 radius-20 w-[1036px] h-[223px]">
      <div className="flex items-center justify-center gap-300 h-[158px]">
        <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] border-neutral-500 rounded-16 p-250 w-[450px] h-[118px] p-0">
          <h2 className="uppercase text-preset-4">Send</h2>
          <div className="flex justify-between items-end">
            <input
              type="text"
              value={
                amount === ''
                  ? ''
                  : isEditing
                    ? amount.toString()
                    : Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
              }

              // Cando entra a escribir, avisamos a React de que estamos editando
              onFocus={() => setIsEditing(true)}

              // Cando pincha fóra, avisamos de que rematou de escribir (aquí se pintan as comas visualmente)
              onBlur={() => setIsEditing(false)}

              onChange={(e) => {
                // Limpamos calquera coma residual por seguridade
                const val = e.target.value.replace(/,/g, '');

                // Se o usuario borra todo, deixamos o campo baleiro
                if (val === '') {
                  setAmount('');
                  return;
                }

                // Permitimos números enteiros ou decimais mentres escribe (Ex: "10" ou "10.")
                if (/^\d*\.?\d*$/.test(val)) {
                  setAmount(val); // Gardamos o valor limpo para que o 'Receive' faga os seus cálculos
                }
              }}
              className="text-preset-1 w-[8ch] p-0 border border-neutral-500 rounded-lg bg-transparent text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
            />

            <CurrencyPicker
              value={fromCurrency}
              onChange={setFromCurrency}
            />
          </div>
        </article>
        <button onClick={handleSwap} 
          className="flex items-center justify-center w-12 h-12 bg-neutral-600 rounded-lg border-[1.5px] border-neutral-500">
          <img src="./images/icon-exchange.svg" alt="swap currencies" className="" />
        </button>
        <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] border-neutral-500 rounded-16 p-250 w-[450px] h-[118px]">
          <h2 className="uppercase text-preset-4">Receive</h2>
          <div className="flex justify-between items-end">
            <input
              type="text"
              value={convertedAmount ? convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
              readOnly
              className="text-preset-1 w-[8ch] p-0 border border-neutral-500 rounded-lg bg-transparent text-lime-500 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
            />
            <CurrencyPicker
              value={toCurrency}
              onChange={setToCurrency}
            />
          </div>
        </article>

      </div>


      <div className="flex justify-between items-center h-[65px] border-t-[1.5px] border-dashed border-neutral-500 ">
        <p className="px-250">1 {fromCurrency.code} = {unitFromAmount} {toCurrency.code}</p>
        <div className="flex gap-1.5 px-250 py-200">
          <button onClick={() => setIsPinned(!isPinned)}
            className={`flex justify-between items-center px-150 py-100 rounded-8  w-[110px] h-[32px] border-[1.5px]  uppercase text-preset-5-medium  transition-colors
                  ${isPinned
                ? 'bg-lime-500 border-lime-500  w-[117px] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500 focus-visible:outline-offset-2'
                : 'bg-neutral-600 border-neutral-500 w-[110px] hover:border-neutral-400 hover:bg-neutral-500 focus:outline-none focus-visible:outline-2 focus-visible:border-lime-500 focus-visible:outline-offset-2'
              }`}>
            <img
              src={isPinned ? "./images/icon-star-filled.svg" : "./images/icon-star.svg"}
              alt="star" className={`transition-all ${isPinned ? 'brightness-0' : ''}`} />
            <span className={`transition-colors ${isPinned ? 'text-neutral-900' : 'text-neutral-50'}`}>{isPinned ? 'Favorited' : 'Favorite'}</span>
          </button>
          <button
            onClick={() => setIsPressed(!isPressed)}
            className={`h-[32px] py-100 border rounded-8 text-preset-5-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-500 focus-visible:outline-offset-2
                    ${isPressed
                ? 'bg-lime-500 border-lime-500 text-neutral-900 w-[132px]'
                : 'border-lime-500 bg-transparent text-lime-500 w-[132px] hover:bg-lime-950 uppercase' // Cando está NORMAL
              }`}>
            <span>{isPressed ? 'Logged' : 'Log conversion'}</span>
          </button>

        </div>
      </div>
    </div>


  )
}
