import React from 'react';
import FavoriteButton from './FavoriteButton';
import LogButton from './LogButton';

export default function conversionFooter({ fromCurrency, toCurrency, unitFromAmount, loading }) {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center h-[91px] md:h-[65px] border-t-[1.5px] border-dashed border-neutral-500 ">
      <p className="px-250 text-preset-6 md:text-preset-5">
        {loading ? "Cargando..." : `1 ${fromCurrency.code} = ${unitFromAmount} ${toCurrency.code}`}
      </p>
      <div className="flex gap-1.5 px-250 py-200">
        <FavoriteButton fromCurrency={fromCurrency} toCurrency={toCurrency} /> 
        <LogButton />
      </div>
    </footer>
  );
}
