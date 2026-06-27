import { useState } from 'react'
import Header from './components/Header'
import LiveMarketsTicker from './components/LiveMarketsTicker'
import CurrencyPicker from './components/CurrencyPicker'
import CurrencyConverter from './components/CurrencyConverter'

function App() {
  const [isPinned, setIsPinned] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
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
          <div className="bg-neutral-700 radius-20 w-[1036px] h-[223px]">
            <CurrencyConverter />
            <div className="flex justify-between items-center h-[65px] border-t-[1.5px] border-dashed border-neutral-500 ">
              <p className="px-250">1 USD = 0.8539 EUR</p>
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
        </section>
        <p></p>
      </main>
    </div>



  );
}


export default App
