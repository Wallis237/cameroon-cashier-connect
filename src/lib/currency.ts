
// Currency formatting utilities with dynamic currency support

const getCurrencySettings = () => {
  const settingsStr = localStorage.getItem('app-settings');
  if (settingsStr) {
    try {
      const settings = JSON.parse(settingsStr);
      return settings.currency || 'XAF';
    } catch {
      return 'XAF';
    }
  }
  return 'XAF';
};

export const formatCurrency = (amount: number): string => {
  const currency = getCurrencySettings();
  
  const currencyMap: { [key: string]: { symbol: string; locale: string } } = {
    'XAF': { symbol: '₣', locale: 'fr-CM' },
    'EUR': { symbol: '€', locale: 'fr-FR' },
    'USD': { symbol: '$', locale: 'en-US' },
    'NGN': { symbol: '₦', locale: 'en-NG' },
  };

  const currencyInfo = currencyMap[currency] || currencyMap['XAF'];
  
  const formatted = new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return formatted.replace(/[A-Z]{3}/, currencyInfo.symbol);
};

export const formatPrice = (amount: number): string => {
  const currency = getCurrencySettings();
  const currencyMap: { [key: string]: string } = {
    'XAF': '₣',
    'EUR': '€', 
    'USD': '$',
    'NGN': '₦',
  };
  
  const symbol = currencyMap[currency] || '₣';
  return `${amount.toLocaleString()} ${symbol}`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
};

export const CURRENCY_SYMBOL = '₣';
export const CURRENCY_CODE = 'XAF';
export const CURRENCY_NAME = 'Central African CFA Franc';
