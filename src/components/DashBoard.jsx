import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useLog } from '../context/LogContext';
import { TabHistory } from './TabHistory';
import { TabCompare } from './TabCompare';
import { TabFavorites } from './TabFavorites';
import { TabLog } from './TabLog';

export default function Dashboard({ amount, fromCurrency, toCurrency }) {
    const [activeTab, setActiveTab] = useState('history'); // Estado inicial
    const [isKeyboard, setIsKeyboard] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const options = ['history', 'compare', 'favorites', 'log'];
    const { pinnedPairs } = useFavorites();
    const { conversionLog } = useLog();

    const handleDropdownKeyDown = (e) => {
        if (!isOpen) {
            // Se está pechado e premen Enter ou Frecha Abaixo, ábrese
            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(options.indexOf(activeTab));
            }
            return;
        }

        // Se xa está aberto, navegamos polas opcións
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % options.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        } else if (e.key === 'Enter' && focusedIndex !== -1) {
            e.preventDefault();
            setActiveTab(options[focusedIndex]);
            setIsOpen(false);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    // Detectamos se usa o rato ou o teclado para os bordos
    const handleMouseDown = () => setIsKeyboard(false);
    const handleKeyDownCapture = (e) => {
        if (e.key === 'Tab' || e.key.startsWith('Arrow')) {
            setIsKeyboard(true);
        }
    };

    // Función axudante para renderizar a pestana correcta
    const renderTabContent = () => {
        switch (activeTab) {
            case 'history':
                return <TabHistory fromCurrency={fromCurrency} toCurrency={toCurrency} />;
            case 'compare':
                return <TabCompare amount={amount} fromCurrency={fromCurrency} toCurrency={toCurrency} />;
            case 'favorites':
                return <TabFavorites amount={amount} />;
            case 'log':
                return <TabLog amount={amount} />;
            default:
                return <TabHistory fromCurrency={fromCurrency} toCurrency={toCurrency} />;
        }
    };

    const handleKeyDown = (e) => {
        const tabs = ['history', 'compare', 'favorites', 'log'];
        const currentIndex = tabs.indexOf(activeTab);

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % tabs.length;
            setActiveTab(tabs[nextIndex]);
            // Buscamos o botón no DOM para mover o foco visual do bordo verde
            document.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            setActiveTab(tabs[prevIndex]);
            document.querySelectorAll('[role="tab"]')[prevIndex]?.focus();
        }
    };

    return (

        <div className="flex flex-col justify-center items-center w-[343px] md:w-[720px] xl:w-[1036px] bg-neutral-900">

            {/* CONTEDOR DO DROPDOWN ACCESIBLE */}
            <div
                className="block md:hidden mt-400 w-[343px] mx-auto relative"
                onKeyDown={handleDropdownKeyDown} // 🚀 Controla as frechas Arriba/Abaixo e Enter
            >
                {/* Botón principal (O que abre o menú) */}
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    onMouseDown={handleMouseDown}
                    onKeyDown={handleKeyDownCapture}
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setFocusedIndex(options.indexOf(activeTab));
                    }}
                    className={`w-full h-[40px] px-150 flex justify-between items-center bg-neutral-700 text-preset-3 uppercase text-neutral-50 border border-neutral-400 rounded-8 cursor-pointer outline-none focus-visible:outline-none transition-colors ${isKeyboard ? 'focus-visible:border-neutral-400 focus-visible:border-2' : 'focus-visible:border-lime-500 focus-visible:border-2'
                        }`}
                >
                    <div className="">
                    <span>{activeTab}</span>
                    {activeTab.toLowerCase().includes('favorit') && (
                        <span className="bg-lime-800 px-150 text-lime-500 rounded-full text-preset-6 shrink-0">
                            {pinnedPairs ? pinnedPairs.length : 0}
                        </span>
                    )}

                    {activeTab.toLowerCase().includes('log') && (
                        <span className="bg-lime-800 px-150 text-lime-500 rounded-full text-preset-6 font-mono shrink-0">
                            {conversionLog ? conversionLog.length : 0}
                        </span>
                    )}
                    </div>
                    <span className="text-[12px] opacity-60 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>

                {/* LISTAXE DE OPCIÓNS COMPATIBLE CO RATO E O TECLADO */}
                {isOpen && (
                    <ul
                        role="listbox"
                        aria-activedescendant={focusedIndex !== -1 ? options[focusedIndex] : undefined}
                        className="absolute left-0 right-0 mt-1 z-50 bg-black border border-neutral-700 overflow-hidden p-0 m-0 list-none shadow-2xl"
                    >
                        {options.map((tab, index) => (
                            <li key={tab} role="option" aria-selected={activeTab === tab}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setIsOpen(false);
                                    }}
                                    // Cando o rato entra, sincronizamos o índice para que teclado e rato non pelexen
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`w-full h-[40px] px-150 text-left uppercase rounded-8 text-preset-3 text-neutral-50 bg-neutral-700 border transition-all cursor-pointer outline-none
                            
                            /* Bordo branco co rato enriba (hover) OU coas frechas do teclado (focusedIndex) */
                            hover:bg-neutral-800 hover:border-neutral-50 hover:text-neutral-50
                            ${focusedIndex === index ? 'border-neutral-50 text-neutral-50 border-2' : 'border-neutral-400'}
                            
                            /* Estilo da pestana seleccionada de fondo */
                            ${activeTab === tab ? 'text-lime-500 border-2' : ''}
                        `}
                                >
                                    {tab}
                                    {tab.toLowerCase().includes('favorit') && (
                                        <span className="bg-lime-800 text-lime-500 px-2 py-0.5 rounded-full text-preset-6 shrink-0 ml-2">
                                            {pinnedPairs ? pinnedPairs.length : 0}
                                        </span>
                                    )}

                                    {tab.toLowerCase().includes('log') ? (
                                        <span className="bg-lime-800 text-lime-500 px-2 py-0.5 rounded-full text-preset-6 shrink-0 ml-2">
                                            {conversionLog ? conversionLog.length : 0}
                                        </span>
                                    ) : null}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            <nav onKeyDown={handleKeyDown} role="tablist" className="hidden md:flex gap-1.5 border-b border-neutral-800 mt-400 w-full">
                <button
                    onClick={() => setActiveTab('history')}
                    role="tab"
                    aria-selected={activeTab === 'history'}
                    tabIndex={activeTab === 'history' ? 0 : -1}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'history'
                        ? 'bg-[#2D1E35]  text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                        : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    History
                </button>
                <button
                    onClick={() => setActiveTab('compare')}
                    role="tab"
                    aria-selected={activeTab === 'compare'}
                    tabIndex={activeTab === 'compare' ? 0 : -1}
                    className={`uppercase  text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'compare'
                        ? 'bg-[#2D1E35] text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                        : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Compare
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    role="tab"
                    aria-selected={activeTab === 'favorites'}
                    tabIndex={activeTab === 'favorites' ? 0 : -1}
                    className={`uppercase  text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'favorites'
                        ? 'bg-[#2D1E35] text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                        : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Favorites
                    <span className="bg-lime-800 text-lime-500 px-100 rounded-full text-preset-6">
                        {pinnedPairs ? pinnedPairs.length : 0}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('log')}
                    role="tab"
                    aria-selected={activeTab === 'log'}
                    tabIndex={activeTab === 'log' ? 0 : -1}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'log'
                        ? 'bg-[#2D1E35] text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                        : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Log
                    <span className="bg-lime-800 text-lime-500 px-100 rounded-full text-preset-6">
                        {conversionLog ? conversionLog.length : 0}
                    </span>
                </button>

            </nav>

            {/* CONTIDO DINÁMICO DA PESTANA */}
            <div className="mt-6 w-full">
                {renderTabContent()}
            </div>

        </div >
    );
}
