import { useState } from 'react'
import Header from './components/Header'
import LiveMarketsTicker from './components/LiveMarketsTicker'
import CurrencyConverter from './components/CurrencyConverter'

function App() {
  
  return (
    <div className="app-container">
      {/* CABECEIRA CO LOGO */}
      <Header />
      {/* TICKER BANNER */}
      <LiveMarketsTicker />
      {/* CONTIDO PRINCIPAL*/}
      <main className="card-container w-full max-w-[1100px] mx-auto px-8 py-12">
        {/* Aquí segues poñendo os teus textos (h1, p, botóns...) */}
        <section className="flex flex-col justify-around gap-4">
          <h1 className="uppercase text-preset-2">Check the rate</h1>
         
            <CurrencyConverter />
        </section>
        <p></p>
      </main>
    </div>



  );
}


export default App
