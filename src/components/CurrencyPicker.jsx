import { useState, useEffect, useRef } from 'react'
// Importamos directamente o teu array de moedas
import { currencies } from '../data/currencies';

export default function CurrencyPicker({ value, onChange}) {
    const [isOpen, setIsOpen] = useState(false)
    // Estado para controlar o texto que escribe o usuario no buscador
    const [searchTerm, setSearchTerm] = useState('')

    // Referencia para detectar clics fóra do compoñente
    const pickerRef = useRef(null)

    // Usamos o array tal e como vén de currencies.js
    // Asegúrate de que no teu mapa usas "currency.flag" ou o nome exacto da túa propiedade
    const currenciesList = currencies;

    // Opción seleccionada actualmente para o botón principal
    const currentOption = currenciesList.find(opt => opt.code === value.code) || currenciesList[0];

    // Función común para filtrar as moedas segundo o que se escribe no buscador
    const matchesSearch = (currency) =>
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase());

    // SECCIÓN POPULARES: Filtradas por popularidade e texto de busca
    const popularCurrencies = currenciesList.filter(currency => currency.popular && matchesSearch(currency));
    const numberOfPopular = popularCurrencies.length;

    // SECCIÓN OUTRAS MOEDAS: Filtradas por non popularidade e texto de busca
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
        <div ref={pickerRef} className="relative inline-block text-left">

            {/* BOTÓN PRINCIPAL (Popover trigger) */}
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchTerm(''); // Limpamos a busca ao abrir/pechar
                }}
                className="flex items-center h-500 w-[96px] border-solid justify-between gap-100 p-125 border-[1.5px] border-neutral-500 rounded-8 bg-neutral-500 text-neutral-50 cursor-pointer w-full transition-colors focus:outline-2 focus:outline-lime-500 focus:outline-offset-2 hover:border-neutral-500 overflow-hidden"
            >

                {/* Mostra a bandeira usando a propiedade nativa dos teus datos */}
                <img src={currentOption.flag} alt={currentOption.name} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-preset-4">{currentOption.code}</span>
                <img src="images/icon-chevron-down.svg" alt="chevron" className={`${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* <!-- Currency picker — popover opened from either currency button --> */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[295px] md:w-[400px] rounded-lg bg-neutral-600 border border-neutral-700 shadow-xl z-50 overflow-hidden">

                    {/* <!-- Search currencies... --> */}
                    <div className="m-2 p-3 h-{30px] border-[1.5px] border-neutral-50 rounded-6 flex items-center gap-2 bg-neutral-600">
                        <img src="images/icon-search.svg" alt="search" />
                        <input
                            type="text"
                            placeholder="Search currencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent text-sm text-neutral-50 placeholder-neutral-200 focus:outline-none"
                            autoFocus
                        />
                    </div>

                    {/* CONTEDOR DE LISTAS — Con altura máxima e scroll invisible */}
                    <div className="py-1 flex flex-col max-h-80 overflow-y-auto no-scrollbar">

                        {/* <!-- Popular --> */}
                        {numberOfPopular > 0 && (
                            <>
                                <div className="flex justify-between p-3 text-preset-5 text-neutral-200">
                                    <div className="uppercase tracking-wider">
                                        Popular
                                    </div>
                                    <div>
                                        ({numberOfPopular})
                                    </div>
                                </div>

                                <div className="flex flex-col border-b border-neutral-800 pb-2 ">
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
                                                className="flex items-center h-[46px] justify-between px-4 py-2  text-left text-sm text-neutral-200 hover:bg-neutral-800 hover:text-lime-500 transition-colors cursor-pointer w-full"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={currency.flag} alt="" className="w-5 h-5 rounded-full object-cover" />
                                                    <div className="flex gap-4 items-center">
                                                        <span className="text-preset-4 text-neutral-50">{currency.code}</span>
                                                        <span className="text-preset-5 text-neutral-200">{currency.name}</span>
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
                                <div className="flex justify-between p-3 text-preset-5 text-neutral-200">
                                    <div className="uppercase tracking-wider">
                                        Other currencies
                                    </div>
                                    <div>
                                        ({numberOfOther})
                                    </div>
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
                                                className="flex items-center h-[46px] gap-3 px-4 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800 hover:text-lime-500 transition-colors cursor-pointer w-full"
                                            >
                                                <img src={currency.flag} alt="" className="w-5 h-5 rounded-full object-cover" />
                                                <div className="flex items-center gap-3">
                                                    <span className="text-preset-4 text-neutral-50">{currency.code}</span>
                                                    <span className="text-preset-5 text-neutral-200">{currency.name}</span>
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





