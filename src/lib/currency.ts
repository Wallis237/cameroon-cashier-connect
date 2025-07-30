// Currency formatting utilities for Central African CFA Franc

export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return formatted.replace('FCFA', '₣').replace('XAF', '₣');
};

export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString('fr-CM')} ₣`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
};

export const CURRENCY_SYMBOL = '₣';
export const CURRENCY_CODE = 'XAF';
export const CURRENCY_NAME = 'Central African CFA Franc';