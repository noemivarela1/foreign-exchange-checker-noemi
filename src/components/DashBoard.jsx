import { useState } from 'react';
import { TabHistory } from './TabHistory';
import { TabCompare } from './TabCompare';
import { TabFavorites } from './TabFavorites';
import { TabLog } from './TabLog';

export default function Dashboard({ fromCurrency, toCurrency }) {
    const [activeTab, setActiveTab] = useState('history'); // Estado inicial

    // Función axudante para renderizar a pestana correcta
    const renderTabContent = () => {
        switch (activeTab) {
            case 'history':
                return <TabHistory fromCurrency={fromCurrency} toCurrency={toCurrency} />;
            case 'compare':
                return <TabCompare />;
            case 'favorites':
                return <TabFavorites />;
            case 'log':
                return <TabLog />;
            default:
                return <TabHistory fromCurrency={fromCurrency} toCurrency={toCurrency} />;
        }
    };

    return (
        <div className="w-[1036px] bg-neutral-900">

            {/* O teu menú de botóns */}
            <nav className="flex gap-1.5 border-b border-neutral-800 mt-400 w-full">
                <button onClick={() => setActiveTab('history')} className={`uppercase text-preset-3 px-200 h-[40px] border-b-2 cursor-pointer ${activeTab === 'history' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-50'}`}>History</button>
                <button onClick={() => setActiveTab('compare')} className={`uppercase text-preset-3 px-200 h-[40px] border-b-2 cursor-pointer ${activeTab === 'compare' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-50'}`}>Compare</button>
                <button onClick={() => setActiveTab('favorites')} className={`uppercase text-preset-3 px-200 h-[40px] border-b-2 cursor-pointer ${activeTab === 'favorites' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-50'}`}>Favorites</button>
                <button onClick={() => setActiveTab('log')} className={`uppercase text-preset-3 px-200 h-[40px] border-b-2 cursor-pointer ${activeTab === 'log' ? 'border-lime-500 text-lime-500' : 'border-transparent text-neutral-50'}`}>Log</button>
            </nav>
           
            {/* CONTIDO DINÁMICO DA PESTANA */}
            <div className="mt-6 w-full">
                {renderTabContent()}
            </div>

        </div >
    );
}
