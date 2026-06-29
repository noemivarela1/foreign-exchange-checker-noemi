import { useState } from 'react'
import { currencyRates } from './hooks/currencyRates';
import Header from './components/Header'
import LiveMarketsTicker from './components/LiveMarketsTicker'
import CurrencyConverter from './components/CurrencyConverter'
import { currencies, currenciesMap } from './data/currencies';

function App() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState(currenciesMap['USD']);
  const [toCurrency, setToCurrency] = useState(currenciesMap['EUR']);

  const { convertedAmount, loading, rates } = currencyRates(amount, fromCurrency.code, toCurrency.code);
  //const totalMoedas = rates ? Object.keys(rates).length : 0;
  const totalMoedas = rates && Object.keys(rates).length > 0
    ? currencies.filter(moneda => rates[moneda.code] !== undefined).length
    : 0;
  console.log("rates ", rates);
  console.log("totalMoedas ", totalMoedas);

  // NOVOS ESTADOS PARA AS 4 LAPELAS
  const [activeTab, setActiveTab] = useState('history') // Controla que lapela se ve
  const [logs, setLogs] = useState([])              // Historial de conversións do usuario
  const [favorites, setFavorites] = useState([])    // Lista de parellas favoritas

  if (rates && Object.keys(rates).length > 0) {
    const moedasActivas = currencies.filter(m => rates[m.code] !== undefined);
    console.log("Moedas que están a funcionar (Total " + moedasActivas.length + "):", moedasActivas.map(m => m.code));

    const moedasFallidas = currencies.filter(m => rates[m.code] === undefined);
    console.log("ATOPADA! Esta é a moeda da túa lista que a API NON cargou:", moedasFallidas.map(m => m.code));
  }

  return (
    <div className="app-container">
      {/* CABECEIRA CO LOGO */}
      <Header totalMoedas={totalMoedas} loading={loading} />
      {/* TICKER BANNER */}
      <LiveMarketsTicker />
      {/* CONTIDO PRINCIPAL*/}
      <main className="card-container w-full max-w-[1100px] mx-auto px-8 py-12">
        <CurrencyConverter
          amount={amount} setAmount={setAmount}
          fromCurrency={fromCurrency} setFromCurrency={setFromCurrency}
          toCurrency={toCurrency} setToCurrency={setToCurrency}
          convertedAmount={convertedAmount} loading={loading}
        />
        <p></p>
        <nav className="flex gap-1.5 border-b border-neutral-800 mt-4 w-full">
          <button onClick={() => setActiveTab('history')} className={`uppercase text-preset-5-medium pb-2 -mb-[1px] border-b-2 cursor-pointer ${activeTab === 'history' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-400'}`}>History</button>
          <button onClick={() => setActiveTab('compare')} className={`uppercase text-preset-5-medium pb-2 -mb-[1px] border-b-2 cursor-pointer ${activeTab === 'compare' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-400'}`}>Compare</button>
          <button onClick={() => setActiveTab('favorites')} className={`uppercase text-preset-5-medium pb-2 -mb-[1px] border-b-2 cursor-pointer ${activeTab === 'favorites' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-400'}`}>Favorites</button>
          <button onClick={() => setActiveTab('log')} className={`uppercase text-preset-5-medium pb-2 -mb-[1px] border-b-2 cursor-pointer ${activeTab === 'log' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-400'}`}>Log</button>
        </nav>
      </main>
    </div>
  );
}


export default App
