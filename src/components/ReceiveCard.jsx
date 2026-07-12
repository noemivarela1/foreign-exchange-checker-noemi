
import CurrencyPicker from './CurrencyPicker'; // Asegúrate de que a ruta sexa correcta

export default function ReceiveCard({ convertedAmount, toCurrency, setToCurrency }) {
    return (
        <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] gap-250px border-neutral-500 rounded-16 p-200 md:p-250 w-[311px] h-[109px] md:min-w-[292px] md:h-[117px] xl:min-w-[450px]">
            <h2 className="uppercase text-preset-4">Receive</h2>
            <div className="flex justify-between items-end">
                <input
                    type="text"
                    aria-label="Amount converted"
                    value={convertedAmount ? convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
                    readOnly
                    className="xl:text-preset-1 text-preset-1-tablet w-[8ch] p-0 leading-none border border-transparent border-neutral-500 rounded-16 bg-transparent text-lime-500 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
                />
                <CurrencyPicker
                    value={toCurrency}
                    onChange={setToCurrency}
                />
            </div>
        </article>
    );
}
