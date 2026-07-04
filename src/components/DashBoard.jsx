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

    return (
        <div className="w-[1036px] bg-neutral-900">
            <nav className="flex gap-1.5 border-b border-neutral-800 mt-400 w-full">
                <button
                    onClick={() => setActiveTab('history')}
                    onFocus={() => setActiveTab('history')}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'history'
                            ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                            : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    History
                </button>
                 <button
                    onClick={() => setActiveTab('compare')}
                    onFocus={() => setActiveTab('compare')}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'compare'
                            ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                            : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Compare
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    onFocus={() => setActiveTab('favorites')}
                    className={`uppercase text-preset-3 px-200 h-[40px] border-2 cursor-pointer focus:outline-none ${activeTab === 'favorites'
                            ? 'text-lime-500 border-b-lime-500 border-t-transparent border-x-transparent focus-visible:border-lime-500 rounded'
                            : 'text-neutral-50 border-transparent focus-visible:border-lime-500 rounded'
                        }`}
                >
                    Favorites
                </button>
                <button
                    onClick={() => setActiveTab('log')}
                    onFocus={() => setActiveTab('log')}
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
