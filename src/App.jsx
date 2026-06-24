import { useState } from 'react'

function App() {
  return (
    <div className="app-container">
      
      {/* CABECEIRA CO LOGO */}
      <header className="main-header flex items-center justify-between h-[66px] px-6 py-5">
        <a href="./" className=" gap-2 text-lg font-semibold text-slate-800">
          <img src="./images/logo.svg" alt="Logo da empresa" className="logo " />
        </a>
        <p className=""><span></span >Currencies · EOD · ECB data</p>
      </header>

      {/* CONTIDO PRINCIPAL*/}
      <main className="card-container">
        {/* Aquí segues poñendo os teus textos (h1, p, botóns...) */}
        <h1>Título do Reto</h1>
        <p>Texto do reto ...</p>
      </main>

    </div>

  
  );
}


export default App
