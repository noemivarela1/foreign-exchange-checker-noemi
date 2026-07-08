import { useState } from 'react'
import {FavoritesProvider} from './context/FavoritesContext';
import { LogProvider } from './context/LogContext';
import { currencyRates } from './hooks/currencyRates';
import Header from './components/Header'
import LiveMarketsTicker from './components/LiveMarketsTicker'
import CurrencyConverter from './components/CurrencyConverter'
import { currencies, currenciesMap } from './data/currencies';
import DashBoard from './components/DashBoard';

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
    <FavoritesProvider>
      <LogProvider>
        <div className="app-container">
          {/* CABECEIRA CO LOGO */}
          <Header totalMoedas={totalMoedas} loading={loading} />
          {/* TICKER BANNER */}
          <LiveMarketsTicker />
          {/* CONTIDO PRINCIPAL*/}
          <main className="flex flex-col items-center card-container max-w-[1100px] py-400 mx-auto md:px-8 md:py-12">
            <CurrencyConverter
              amount={amount} setAmount={setAmount}
              fromCurrency={fromCurrency} setFromCurrency={setFromCurrency}
              toCurrency={toCurrency} setToCurrency={setToCurrency}
              convertedAmount={convertedAmount} loading={loading}
            />
            <DashBoard
              amount={amount}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
            />
          </main>
        </div>
      </LogProvider>
    </FavoritesProvider>
  );
}


export default App
