import { useState } from 'react'
import { FavoritesProvider } from './context/FavoritesContext';
import { LogProvider } from './context/LogContext';
import { currencyRates } from './hooks/currencyRates';
import Header from './components/Header'

import CurrencyConverter from './components/CurrencyConverter'
import { currencies, currenciesMap } from './data/currencies';
import DashBoard from './components/DashBoard';

function App() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState(currenciesMap['USD']);
  const [toCurrency, setToCurrency] = useState(currenciesMap['EUR']);

  const { convertedAmount, loading, rates } = currencyRates(amount, fromCurrency.code, toCurrency.code);

  const totalMoedas = rates && Object.keys(rates).length > 0
    ? currencies.filter(moneda => rates[moneda.code] !== undefined).length
    : 0;


  return (
    <FavoritesProvider>
      <LogProvider>
        <div className="app-container">
          {/* CABECEIRA CO LOGO */}
          <Header totalMoedas={totalMoedas} loading={loading}/>
          
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
              setFromCurrency={setFromCurrency}
              setToCurrency={setToCurrency}
            />
          </main>
        </div>
      </LogProvider>
    </FavoritesProvider>
  );
}


export default App
