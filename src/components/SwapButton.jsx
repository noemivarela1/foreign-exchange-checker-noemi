
// Recibimos a función handleSwap dende o pai a través das props
export default function SwapButton({ handleSwap }) {
    return (
        <button 
            type="button"
            onClick={handleSwap}
            className="flex items-center cursor-pointer justify-center w-12 h-12 bg-neutral-600 rounded-lg border-[1.5px] border-neutral-500">
            <img src="./images/icon-exchange.svg" alt="swap currencies" className="rotate-90 md:rotate-none" />
        </button>
    );
}
