import { formatCurrency, formatDate } from './formatters';

/**
 * Generate formatted text message for WhatsApp sharing
 */
export function generateWhatsAppMessage({
  businessName = 'JJ Online Business',
  currency = 'LKR',
  periodName = 'Current Period',
  totals,
  recentTransactions = [],
}) {
  const { totalIncome, totalExpense, netProfit, profitMargin } = totals;
  const statusEmoji = netProfit >= 0 ? '🟢' : '🔴';
  const profitStatus = netProfit >= 0 ? 'Net Profit' : 'Net Loss';

  let message = `📊 *${businessName} - Financial Summary*\n`;
  message += `📅 *Report Period:* ${periodName}\n`;
  message += `⏱️ *Generated:* ${new Date().toLocaleString()}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *Total Income:* ${formatCurrency(totalIncome, currency)}\n`;
  message += `💸 *Total Expenses:* ${formatCurrency(totalExpense, currency)}\n`;
  message += `${statusEmoji} *${profitStatus}:* ${formatCurrency(netProfit, currency)}\n`;
  message += `📈 *Profit Margin:* ${profitMargin}%\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (recentTransactions && recentTransactions.length > 0) {
    message += `📋 *Latest Transactions:*\n`;
    recentTransactions.slice(0, 5).forEach((tx) => {
      const typeSign = tx.type === 'income' ? '➕ [INCOME]' : '➖ [EXPENSE]';
      message += `${typeSign} ${tx.category} - ${formatCurrency(tx.amount, currency)}\n`;
      if (tx.description) {
        message += `   _Note: ${tx.description}_\n`;
      }
    });
    message += `\n`;
  }

  message += `💼 _Tracked via Janith Income System_`;

  return message;
}

/**
 * Generate wa.me link
 * @param {string} message 
 * @param {string} [phone] - Optional phone number in international format without '+' or '00' (e.g. 94771234567)
 */
export function createWhatsAppUrl(message, phone = '') {
  const encodedText = encodeURIComponent(message);
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
  
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}
