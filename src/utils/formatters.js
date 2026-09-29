/**
 * Utility functions for currency and date formatting
 */

export const CURRENCY_SYMBOLS = {
  LKR: 'Rs.',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'AED',
};

/**
 * Format a number into currency representation
 * @param {number} amount
 * @param {string} currencyCode (default 'LKR')
 * @returns {string} e.g. "Rs. 45,250.00"
 */
export function formatCurrency(amount, currencyCode = 'LKR') {
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  
  const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  const formattedNumber = Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol} ${formattedNumber}`;
}

/**
 * Format ISO date string or YYYY-MM-DD into human-readable string
 * @param {string|Date} dateVal
 * @returns {string} e.g. "Sep 29, 2026"
 */
export function formatDate(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for input elements (YYYY-MM-DD)
 */
export function getTodayInputDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate totals for a list of transactions
 */
export function calculateTotals(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amt = parseFloat(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amt;
    } else if (tx.type === 'expense') {
      totalExpense += amt;
    }
  });

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0;

  return {
    totalIncome,
    totalExpense,
    netProfit,
    profitMargin: Number(profitMargin),
    count: transactions.length,
  };
}
