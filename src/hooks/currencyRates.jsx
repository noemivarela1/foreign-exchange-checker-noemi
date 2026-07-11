import { useState, useEffect } from 'react';

export function currencyRates(amount, fromCode, toCode) {
  const [rates, setRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Descarga e garda as taxas na memoria unha soa vez ao cargar a web
  useEffect(() => {
    fetch("https://api.frankfurter.dev/v2/rates?base=USD")
      .then((res) => {
        if (!res.ok) throw new Error("Erro na API");
        return res.json();
      })
      .then((data) => {
        const ratesMap = { "USD": 1 };
        data.forEach((item) => {
          ratesMap[item.quote] = item.rate;
        });
        setRates(ratesMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading rates:", err);
        setLoading(false);
      });
  }, []);

  // 2. Fai os cálculos matemáticos na memoria en tempo real
  useEffect(() => {
    if (loading || !amount || !fromCode || !toCode) {
      setConvertedAmount(0);
      return;
    }

    const rateFrom = rates[fromCode];
    const rateTo = rates[toCode];

    if (rateFrom && rateTo) {
      // Fórmula cruzada co USD en memoria
      const result = (Number(amount) / rateFrom) * rateTo;
      setConvertedAmount(result);
    } else {
      setConvertedAmount(0);
    }
  }, [amount, fromCode, toCode, rates, loading]);
 
  // O hook devolve só o que o compoñente preciso para debuxar
  return { convertedAmount, loading, rates };
}
