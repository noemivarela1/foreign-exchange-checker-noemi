// src/data/currencies.js

// Dicionario base que relaciona a túa imaxe co código da moeda e o seu nome oficial
const currencyData = {
  ae: { code: 'AED', name: 'UAE Dirham' },
  ar: { code: 'ARS', name: 'Argentine Peso' },
  au: { code: 'AUD', name: 'Australian Dollar' },
  bd: { code: 'BDT', name: 'Bangladeshi Taka' },
  bh: { code: 'BHD', name: 'Bahraini Dinar' },
  br: { code: 'BRL', name: 'Brazilian Real' },
  ca: { code: 'CAD', name: 'Canadian Dollar' },
  ch: { code: 'CHF', name: 'Swiss Franc' },
  cl: { code: 'CLP', name: 'Chilean Peso' },
  cn: { code: 'CNY', name: 'Chinese Yuan' },
  co: { code: 'COP', name: 'Colombian Peso' },
  cz: { code: 'CZK', name: 'Czech Koruna' },
  dk: { code: 'DKK', name: 'Danish Krone' },
  eg: { code: 'EGP', name: 'Egyptian Pound' },
  eu: { code: 'EUR', name: 'Euro' },
  gb: { code: 'GBP', name: 'British Pound' },
  hk: { code: 'HKD', name: 'Hong Kong Dollar' },
  hn: { code: 'HNL', name: 'Honduran Lempira' },
  ht: { code: 'HTG', name: 'Haitian Gourde' },
  hu: { code: 'HUF', name: 'Hungarian Forint' },
  id: { code: 'IDR', name: 'Indonesian Rupiah' },
  in: { code: 'INR', name: 'Indian Rupee' },
  is: { code: 'ISK', name: 'Icelandic Króna' },
  jo: { code: 'JOD', name: 'Jordanian Dinar' },
  jp: { code: 'JPY', name: 'Japanese Yen' },
  ke: { code: 'KES', name: 'Kenyan Shilling' },
  kr: { code: 'KRW', name: 'South Korean Won' },
  kw: { code: 'KWD', name: 'Kuwaiti Dinar' },
  lb: { code: 'LBP', name: 'Lebanese Pound' },
  lc: { code: 'XCD', name: 'East Caribbean Dollar' }, // Santa Lucía usa o XCD
  lk: { code: 'LKR', name: 'Sri Lankan Rupee' },
  ma: { code: 'MAD', name: 'Moroccan Dirham' },
  mx: { code: 'MXN', name: 'Mexican Peso' },
  my: { code: 'MYR', name: 'Malaysian Ringgit' },
  ng: { code: 'NGN', name: 'Nigerian Naira' },
  no: { code: 'NOK', name: 'Norwegian Krone' },
  np: { code: 'NPR', name: 'Nepalese Rupee' },
  nz: { code: 'NZD', name: 'New Zealand Dollar' },
  om: { code: 'OMR', name: 'Omani Rial' },
  pe: { code: 'PEN', name: 'Peruvian Sol' },
  ph: { code: 'PHP', name: 'Philippine Peso' },
  pk: { code: 'PKR', name: 'Pakistani Rupee' },
  pl: { code: 'PLN', name: 'Polish Zloty' },
  qa: { code: 'QAR', name: 'Qatari Riyal' },
  ro: { code: 'RON', name: 'Romanian Leu' },
  ru: { code: 'RUB', name: 'Russian Ruble' },
  sa: { code: 'SAR', name: 'Saudi Riyal' },
  se: { code: 'SEK', name: 'Swedish Krona' },
  sg: { code: 'SGD', name: 'Singapore Dollar' },
  th: { code: 'THB', name: 'Thai Baht' },
  tr: { code: 'TRY', name: 'Turkish Lira' },
  tw: { code: 'TWD', name: 'New Taiwan Dollar' },
  ua: { code: 'UAH', name: 'Ukrainian Hryvnia' },
  us: { code: 'USD', name: 'US Dollar' },
  vn: { code: 'VND', name: 'Vietnamese Dong' },
  za: { code: 'ZAR', name: 'South African Rand' }
};

// Xeramos automaticamente a listaxe en formato Array asociando as túas rutas locais .webp
export const currencies = Object.entries(currencyData).map(([key, item]) => ({
  code: item.code,
  name: item.name,
  flag: `./images/flags/${key}.webp` // Automatiza a ruta usando o nome do teu ficheiro
}));

// Xeramos un mapa indexado por código para inicializar os useState de forma rápida
export const currenciesMap = currencies.reduce((acc, curr) => {
  acc[curr.code] = curr;
  return acc;
}, {});

