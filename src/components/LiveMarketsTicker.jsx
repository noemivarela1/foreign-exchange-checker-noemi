// src/LiveMarketsTicker.jsx
export default function LiveMarketsTicker() {
    return (
        <section className="w-full overflow-hidden border-b border-neutral-700 py-2 flex justify-start">
            <span className="bg-lime-500 px-4 py-3 text-preset-4-medium text-neutral-900 z-10 border-r border-neutral-700 whitespace-nowrap">
                ● LIVE MARKETS:
            </span>
            
            <div className="flex items-center justify-around gap-6 px-6 text-sm font-medium">

                <div className="flex items-center gap-125 px-250 py-150">
                    <span className="text-neutral-200 text-preset-5">EUR/USD</span>
                    <span className="text-neutral-50 text-preset-5-medium">1.0845</span>
                    <span className="text-red-500 text-preset-5">▼ -0.14%</span>
                </div>

                <div className="flex items-center gap-1.5 px-250 py-150">
                    <span className="text-neutral-200 text-preset-5">GBP/USD</span>
                    <span className="text-neutral-50 text-preset-5-medium">1.2630</span>
                    <span className="text-green-500 text-preset-5">▲ +0.13%</span>
                </div>

                <div className="flex items-center gap-1.5 px-250 py-150">
                    <span className="text-neutral-200 text-preset-5">USD/JPY</span>
                    <span className="text-neutral-50 text-preset-5-medium">151.42</span>
                    <span className="text-red-500 text-preset-5">▼ -0.22%</span>
                </div>

                <div className="flex items-center gap-1.5 px-250 py-150">
                    <span className="text-neutral-200 text-preset-5">AUD/USD</span>
                    <span className="text-neutral-50 text-preset-5-medium">0.6525</span>
                    <span className="text-green-500 text-preset-5">▲ +0.08%</span>
                </div>

            </div>
        </section>
    )
}
