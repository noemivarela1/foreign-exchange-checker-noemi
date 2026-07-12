import React from 'react';
import { useState, useEffect } from 'react'
import CurrencyPicker from './CurrencyPicker'; // Asegúrate de que a ruta sexa correcta

export default function SendCard({ amount, setAmount, fromCurrency, setFromCurrency }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] gap-250px border-neutral-500 rounded-16 p-200 md:p-250 w-[311px] h-[109px] md:min-w-[292px] md:h-[117px] xl:min-w-[450px]">
            <h2 className="uppercase text-preset-4">Send</h2>
            <div className="flex justify-between items-baseline">
                <input
                    type="text"
                    aria-label="Amount to convert"
                    value={
                        amount === ''
                            ? ''
                            : isEditing
                                ? amount.toString()
                                : Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
                    }

                    // Cando entra a escribir, avisamos a React de que estamos editando
                    onFocus={() => setIsEditing(true)}

                    // Cando pincha fóra, avisamos de que rematou de escribir (aquí se pintan as comas visualmente)
                    onBlur={() => setIsEditing(false)}

                    onChange={(e) => {
                        // Limpamos calquera coma residual por seguridade
                        const val = e.target.value.replace(/,/g, '');

                        // Se o usuario borra todo, deixamos o campo baleiro
                        if (val === '') {
                            setAmount('');
                            return;
                        }

                        // Permitimos números enteiros ou decimais mentres escribe (Ex: "10" ou "10.")
                        if (/^\d*\.?\d*$/.test(val)) {
                            setAmount(val); // Gardamos o valor limpo para que o 'Receive' faga os seus cálculos
                        }
                    }}
                    className="xl:text-preset-1 text-preset-1-tablet w-[8ch] p-0 leading-none border border-transparent border-neutral-500 rounded-16 bg-transparent text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
                    
                />

                <CurrencyPicker
                    value={fromCurrency}
                    onChange={setFromCurrency}
                />
            </div>
        </article>
    );
}
