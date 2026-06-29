import React from 'react';
import CurrencyPicker from './CurrencyPicker'; // Asegúrate de que a ruta sexa correcta

export default function ReceiveCard({ convertedAmount, toCurrency, setToCurrency }) {
  return (
    <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] border-neutral-500 rounded-16 p-250 w-[450px] h-[118px]">
      <h2 className="uppercase text-preset-4">Receive</h2>
      <div className="flex justify-between items-end">
        <input
          type="text"
          value={convertedAmount ? convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
          readOnly
          className="text-preset-1 w-[8ch] p-0 border border-neutral-500 rounded-lg bg-transparent text-lime-500 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
        />
        <CurrencyPicker
          value={toCurrency}
          onChange={setToCurrency}
        />
      </div>
    </article>
  );
}
