import { useState } from 'react';
import { TabHistory } from './TabHistory';
import { TabCompare } from './TabCompare';
import { TabFavorites } from './TabFavorites';
import { TabLog } from './TabLog';

export default function Dashboard({ amount, fromCurrency, toCurrency }) {
    const [activeTab, setActiveTab] = useState('history'); // Estado inicial

    // Función axudante para renderizar a pestana correcta
    const renderTabContent = () => {
        switch (activeTab) {
            case 'history':
                return <TabHistory fromCurrency={fromCurrency} toCurrency={toCurrency} />;
            case 'compare':
                return <TabCompare amount={amount} fromCurrency={fromCurrency} />;
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
        <div className="w-[1036px] bg-neutral-900">
            <nav onKeyDown={handleKeyDown} role="tablist" className="flex gap-1.5 border-b border-neutral-800 mt-400 w-full">
                <button
                    onClick={() => setActiveTab('history')}
                    role="tab"
                    aria-selected={activeTab === 'history'}
                    tabIndex={activeTab === 'history' ? 0 : -1}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'history'
                        ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
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
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'compare'
                        ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
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
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'favorites'
                        ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                        : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Favorites
                </button>
                <button
                    onClick={() => setActiveTab('log')}
                    role="tab"
                    aria-selected={activeTab === 'log'}
                    tabIndex={activeTab === 'log' ? 0 : -1}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'log'
                        ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                        : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Log
                </button>

            </nav>

            {/* CONTIDO DINÁMICO DA PESTANA */}
            <div className="mt-6 w-full">
                {renderTabContent()}
            </div>

        </div >
    );
}
