import { useState } from 'react'

export default function CurrencyPicker({ value, onChange, defaultValue }) {
  console.log("Moeda recibida no Picker:",value.code);
  // Estado para saber se a lista está aberta ou pechada
  const [isOpen, setIsOpen] = useState(false)

  // 2. Datos das moedas (Bandeira, código e nome)
  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: './images/flags/us.webp' },
    { code: 'EUR', name: 'Euro', flag: './images/flags/eu.webp' },
    { code: 'GBP', name: 'British Pound', flag: './images/flags/gb.webp' },
    { code: 'CAD', name: 'Canadian Dollar', flag: './images/flags/ca.webp' },
    { code: 'JPY', name: 'Japanese Yen', flag: './images/flags/jp.webp' }
  ]

  // Estado para gardar a moeda seleccionada (Empeza con USD)
  //const [selected, setSelected] = useState(currencies[0])

  //const [selected, setSelected] = useState(defaultValue || currencies[0].value);

  // Asegúrate de que a bandeira dependa estritamente do elemento seleccionado
  const currentOption = currencies.find(opt => opt.code === value.code)|| currencies[0];
  console.log("currentOption",currentOption.code);
  const handleSelectChange = (e) => {
   if (onChange) onChange(e.target.value);
  };


  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      
      {/* BOTÓN PRINCIPAL (O que ve o usuario) */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1 p-125 border-[1.5px] border-neutral-400 rounded-lg bg-neutral-500 text-neutral-50 cursor-pointer w-full transition-colors focus:outline-2 focus:outline-lime-500 focus:outline-offset-2 hover:border-neutral-500"
      >
        <div className="flex items-center gap-2">
          {/* Imaxe da bandeira seleccionada */}
          <img src={currentOption.flag} alt={currentOption.name} className="w-5 h-5 rounded-full object-cover" />
          <span className="text-preset-4">{currentOption.code}</span>
        </div>
        {/* Frecha indicadora (podes poñer un SVG se prefires) */}
        <img src="images/icon-chevron-down.svg" alt="chevron" className={`${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {/* LISTA DESPREGABLE FLOTANTE (Só se mostra se isOpen é true) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-full sm:w-56 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl z-50 overflow-hidden">
          <div className="py-1 flex flex-col">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => {
                  onChange(currency) // Cambiamos a moeda seleccionada
                  setIsOpen(false)       // Pechamos a lista
                }}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm text-neutral-200 hover:bg-neutral-800 hover:text-lime-500 transition-colors cursor-pointer w-full"
              >
                {/* Imaxe da bandeira na lista */}
                <img src={currency.flag} alt="" className="w-5 h-5 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-bold">{currency.code}</span>
                  <span className="text-xs text-neutral-50">{currency.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
