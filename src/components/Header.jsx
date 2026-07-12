import LiveMarketsTicker from './LiveMarketsTicker'
export default function Header({ totalMoedas }) {
    return (
        <header className="main-header flex flex-col">
            <div className="flex items-center justify-between  md:px-6 md:py-5 p-200">
                <a href="./" className="gap-2 text-lg font-semibold text-slate-800 w-[28.6vw] max-w-[139px] min-w-[107px]  h-auto">
                    <img src="./images/logo.svg" alt="Logo da empresa" className="logo h-8 w-auto" />
                </a>
                <p className="text-neutral-200 md:text-preset-4 text-preset-6 uppercase">{totalMoedas} Currencies · EOD · ECB data</p>
            </div>
            {/* TICKER BANNER */}
            <LiveMarketsTicker />
        </header>
    )
}
