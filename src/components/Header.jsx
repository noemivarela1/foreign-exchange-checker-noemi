
export default function Header() {
    return (
        <header className="main-header flex items-center justify-between h-[66px] px-6 py-5">
            <a href="./" className="gap-2 text-lg font-semibold text-slate-800">
                <img src="./images/logo.svg" alt="Logo da empresa" className="logo h-8 w-auto" />
            </a>
            <p className="text-neutral-200"><span></span>Currencies · EOD · ECB data</p>
        </header>
    )
}
