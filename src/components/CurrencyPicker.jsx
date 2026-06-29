import { useState, useEffect, useRef } from 'react'
// Importamos directamente o teu array de moedas
import { currencies } from '../data/currencies'; 

export default function CurrencyPicker({ value, onChange, defaultValue }) {
  const [isOpen, setIsOpen] = useState(false)
  // Estado para controlar o texto que escribe o usuario no buscador
  const [searchTerm, setSearchTerm] = useState('')
  
  // Referencia para detectar clics fóra do compoñente
  const pickerRef = useRef(null)

  // 1. SOLUCIÓN CORRECTA: Usamos o teu array tal e como vén de currencies.js
  // Asegúrate de que no teu mapa usas "currency.flag" ou o nome exacto da túa propiedade
  const currenciesList = currencies;

  // 2. Opción seleccionada actualmente para o botón principal
  const currentOption = currenciesList.find(opt => opt.code === value.code) || currenciesList[0];

  // Función común para filtrar as moedas segundo o que se escribe no buscador
  const matchesSearch = (currency) => 
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchTerm.toLowerCase());

  // 3. SECCIÓN POPULARES: Filtradas por popularidade e texto de busca
  const popularCurrencies = currenciesList.filter(currency => currency.popular && matchesSearch(currency));
  const numberOfPopular = popularCurrencies.length;

  // 4. SECCIÓN OUTRAS MOEDAS: Filtradas por non popularidade e texto de busca
  const otherCurrencies = currenciesList.filter(currency => !currency.popular && matchesSearch(currency));
  const numberOfOther = otherCurrencies.length;

  // Lóxica para pechar ao facer clic fóra
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={pickerRef} className="relative inline-block text-left w-full sm:w-auto">
      
      {/* BOTÓN PRINCIPAL (Popover trigger) */}
      <button 
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchTerm(''); // Limpamos a busca ao abrir/pechar
        }}
        className="flex items-center justify-between gap-1 p-125 border-[1.5px] border-neutral-400 rounded-lg bg-neutral-500 text-neutral-50 cursor-pointer w-full transition-colors focus:outline-2 focus:outline-lime-500 focus:outline-offset-2 hover:border-neutral-500"
      >
        <div className="flex items-center gap-2">
          {/* Mostra a bandeira usando a propiedade nativa dos teus datos */}
          <img src={currentOption.flag} alt={currentOption.name} className="w-5 h-5 rounded-full object-cover" />
          <span className="text-preset-4">{currentOption.code}</span>
        </div>
        <img src="images/icon-chevron-down.svg" alt="chevron" className={`${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {/* <!-- Currency picker — popover opened from either currency button --> */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-full sm:w-64 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl z-50 overflow-hidden">
          
          {/* <!-- Search currencies... --> */}
          <div className="p-3 border-b border-neutral-800 flex items-center gap-2 bg-neutral-950">
            <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* CONTEDOR DE LISTAS — Con altura máxima e scroll invisible */}
          <div className="py-1 flex flex-col max-h-80 overflow-y-auto no-scrollbar">
            
            {/* <!-- Popular --> */}
            {numberOfPopular > 0 && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Popular ({numberOfPopular})
                  </span>
                </div>
                
                <div className="flex flex-col border-b border-neutral-800 pb-2">
                  {popularCurrencies.map((currency) => {
                    const isSelected = currency.code === value.code;
                    return (
                      <button
                        key={`popular-${currency.code}`}
                        type="button"
                        onClick={() => {
                          onChange(currency);
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 hover:text-lime-500 transition-colors cursor-pointer w-full"
                      >
                        <div className="flex items-center gap-3">
                          <img src={currency.flag} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <span className="font-bold">{currency.code}</span>
                            <span className="text-xs text-neutral-50">{currency.name}</span>
                          </div>
                        </div>
                        {isSelected && <img src="images/icon-check.svg" alt="seleccionado" className="w-4 h-4 object-contain" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* <!-- Other currencies --> */}
            {numberOfOther > 0 && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Other currencies ({numberOfOther})
                  </span>
                </div>

                <div className="flex flex-col pt-1">
                  {otherCurrencies.map((currency) => {
                    return (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => {
                          onChange(currency);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 hover:text-lime-500 transition-colors cursor-pointer w-full"
                      >
                        <img src={currency.flag} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <div className="flex flex-col">
                          <span className="font-bold">{currency.code}</span>
                          <span className="text-xs text-neutral-50">{currency.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Estado baleiro */}
            {numberOfPopular === 0 && numberOfOther === 0 && (
              <div className="px-4 py-6 text-center text-sm text-neutral-500">
                No currencies found
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  )
}





