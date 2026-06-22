import { useState } from 'react'
import './App.css'

function App() {
  return (
    // <main> indica o contido principal e único da páxina
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      
      {/* <article> representa unha composición autónoma e reutilizable (como a nosa aplicación/tarxeta) */}
      <article className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        
        {/* <header> define a cabeceira desta sección ou aplicación */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-400 tracking-wide">
            Currency Converter
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time foreign exchange rates</p>
        </header>

        {/* <form> agrupando os elementos de entrada, idóneo para a semántica de formularios */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          
          {/* <section> para dividir as diferentes partes lóxicas do formulario */}
          <section className="flex flex-col">
            <label htmlFor="amount" className="text-sm font-medium text-slate-400 mb-2">
              Amount to Convert
            </label>
            <input 
              id="amount"
              type="number" 
              placeholder="100" 
              min="0"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-blue-500 transition-colors"
            />
          </section>

          {/* Outra <section> para os selectores de divisas */}
          <section className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="from-currency" className="text-sm font-medium text-slate-400 mb-2">
                From
              </label>
              <select 
                id="from-currency"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="to-currency" className="text-sm font-medium text-slate-400 mb-2">
                To
              </label>
              <select 
                id="to-currency"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </section>

          {/* O botón para activar a conversión ou inversión (se fose necesario) */}
          <button 
            type="submit" 
            className="w-full mt-2 p-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Convert
          </button>
        </form>

        {/* <section> ou <output> para amosar o resultado final ao usuario */}
        <section className="mt-6 p-4 bg-slate-950 border border-slate-800 rounded-xl text-center" aria-live="polite">
          <h2 className="text-sm text-slate-500 mb-1 font-normal">Conversion Result</h2>
          <output className="text-3xl font-extrabold text-emerald-400 block">
            0.00
          </output>
        </section>

      </article>

      {/* <footer> na parte inferior da páxina cos teus dereitos ou ligazón a Frontend Mentor */}
      <footer className="mt-6 text-xs text-slate-600 text-center">
        <p>Challenge by <a href="https://frontendmentor.io" target="_blank" rel="noreferrer" className="hover:underline text-slate-500">Frontend Mentor</a>.</p>
        <p className="mt-1">Coded with 💙 by You.</p>
      </footer>

    </main>
  );
}


export default App
