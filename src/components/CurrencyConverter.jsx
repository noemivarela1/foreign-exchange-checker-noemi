import { useState, useEffect } from 'react'
import CurrencyPicker from './CurrencyPicker.jsx'

export default function CurrencyConverter() {
  // 1. Estados para o control do usuario
  const [amount, setAmount] = useState(1000)
  const [resultAmount, setResultAmount] = useState(0);

  const [fromCurrency, setFromCurrency] = useState({ code: 'USD', name: 'US Dollar', flag: './images/flags/us.webp' });
  const [toCurrency, setToCurrency] = useState({ code: 'EUR', name: 'Euro', flag: './images/flags/eu.webp' });

  // 2. Estados para os datos da API
  const [rates, setRates] = useState({})        // Gardará o obxecto con todas as moedas
  const [loading, setLoading] = useState(true)  // Para saber se a API está cargando
  const [error, setError] = useState(null)      // Por se falla a conexión á internet


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
  let convertedAmount = 0
  if (!loading && rates && rates[fromCurrency.code] && rates[toCurrency.code]) {
    const amountInUSD = amount / rates[fromCurrency.code]
    convertedAmount = Number(amountInUSD * rates[toCurrency.code]);
  }

  // Se a API aínda está cargando, podemos dar un aviso discreto
  if (loading) return <div className="text-center text-neutral-400 py-10">Loading live exchange rates...</div>
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>

  return (
    <div className="flex items-center justify-center gap-300 h-[158px]">
      <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] border-neutral-500 rounded-16 p-250 w-[450px] h-[118px] p-0">
        <h2 className="uppercase text-preset-4">Send</h2>
        <div className="flex justify-between items-end">
          <input
            type="text"
            defaultValue="1,000"
            onChange={(e) => setAmount(Number(e.target.value))} /* Actualiza o número ao escribir */
            className="text-preset-1 w-[6ch] p-0 border border-neutral-500 rounded-lg bg-transparent text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
          />

          <CurrencyPicker
            value={fromCurrency}
            onChange={setFromCurrency}
          />
        </div>
      </article>
      <button className="flex items-center justify-center w-12 h-12 bg-neutral-600 rounded-lg border-[1.5px] border-neutral-500">
        <img src="./images/icon-exchange.svg" alt="swap currencies" className="" />
      </button>
      <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] border-neutral-500 rounded-16 p-250 w-[450px] h-[118px]">
        <h2 className="uppercase text-preset-4">Receive</h2>
        <div className="flex justify-between items-end">
          <input
            type="text"
            /* `.toFixed(3)` fai que se mostren só 3 decimais, exacto coma o teu '0.854' de Figma */
            value={convertedAmount ? convertedAmount.toFixed(2) : '0.00'}
            readOnly
            className="text-preset-1 w-[6ch] p-0 border border-neutral-500 rounded-lg bg-transparent text-lime-500 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
          />
          <CurrencyPicker
            value={toCurrency}
            onChange={setToCurrency}
          />
        </div>
      </article>

    </div>




  )
}
