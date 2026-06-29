import React from 'react';
import { useState, useEffect } from 'react'
import CurrencyPicker from './CurrencyPicker'; // Asegúrate de que a ruta sexa correcta

export default function SendCard({ amount, setAmount, fromCurrency, setFromCurrency }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <article className="flex flex-col justify-between bg-neutral-600 border-[1.5px] border-neutral-500 rounded-16 p-250 w-[450px] h-[118px] p-0">
            <h2 className="uppercase text-preset-4">Send</h2>
            <div className="flex justify-between items-end">
                <input
                    type="text"
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
                    className="text-preset-1 w-[8ch] p-0 border border-neutral-500 rounded-lg bg-transparent text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-lime-500 transition-colors"
                />

                <CurrencyPicker
                    value={fromCurrency}
                    onChange={setFromCurrency}
                />
            </div>
        </article>
    );
}
