import React, { useState, useEffect } from 'react';
import { X, Check, Tag, Calendar, CreditCard, FileText } from 'lucide-react';
import { getTodayInputDate } from '../utils/formatters';

const DEFAULT_INCOME_CATEGORIES = [
  'E-commerce Sales',
  'Wholesale Orders',
  'Digital Services',
  'Website Development',
  'Consulting',
  'Affiliate / Commission',
  'Other Income',
];

const DEFAULT_EXPENSE_CATEGORIES = [
  'Facebook & IG Ads',
  'Inventory Restock',
  'Courier & Packaging',
  'Cloud & Domain Hosting',
  'Software Subscriptions',
  'Staff & Wages',
  'Office Utilities',
  'Tax & Banking Fees',
  'Other Expense',
];

const PAYMENT_METHODS = [
  'Bank Transfer',
  'Cash',
  'Credit/Debit Card',
  'Koko / MintPay',
  'Online Payment Gateway',
  'Cheque',
];

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction = null,
  currency = 'LKR',
}) {
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayInputDate());
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [error, setError] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pre-fill when editing or reset when opening
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'income');
      setAmount(editingTransaction.amount ? String(editingTransaction.amount) : '');
      setDate(editingTransaction.date || getTodayInputDate());
      setDescription(editingTransaction.description || '');
      setPaymentMethod(editingTransaction.payment_method || 'Bank Transfer');

      const catList = editingTransaction.type === 'expense' 
        ? DEFAULT_EXPENSE_CATEGORIES 
        : DEFAULT_INCOME_CATEGORIES;

      if (catList.includes(editingTransaction.category)) {
        setCategory(editingTransaction.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(editingTransaction.category || '');
      }
    } else {
      setType('income');
      setCategory(DEFAULT_INCOME_CATEGORIES[0]);
      setCustomCategory('');
      setAmount('');
      setDate(getTodayInputDate());
      setDescription('');
      setPaymentMethod('Bank Transfer');
      setError('');
    }
  }, [editingTransaction, isOpen]);

  // When type changes, default category to first preset
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? DEFAULT_INCOME_CATEGORIES[0] : DEFAULT_EXPENSE_CATEGORIES[0]);
    setCustomCategory('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    const finalCategory = category === 'Other' && customCategory.trim() 
      ? customCategory.trim() 
      : category || 'General';

    const transactionData = {
      ...(editingTransaction ? { id: editingTransaction.id } : {}),
      type,
      category: finalCategory,
      amount: numAmount,
      date,
      description: description.trim(),
      payment_method: paymentMethod,
    };

    onSubmit(transactionData);
    onClose();
  };

  if (!isOpen) return null;

  const currentCategoryPresets = type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-indigo-600 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 cursor-default flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Bright Red Close Button */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-indigo-700 text-white flex-shrink-0 shadow-sm">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <p className="text-xs text-indigo-200">
              JJ Online Business Financial Record
            </p>
          </div>
          
          {/* Unmissable High-Contrast Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold shadow-md border border-rose-400 transition cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>CLOSE / වසන්න</span>
          </button>
        </div>

        {/* Scrollable Form Body with Visible Scrollbar on right */}
        <form onSubmit={handleSubmit} className="flex-1 visible-scrollbar p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Type Toggle: Income vs Expense */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 px-3 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                  type === 'income'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Income (+)
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 px-3 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center gap-2 cursor-pointer ${
                  type === 'expense'
                    ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Expense (-)
              </button>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount ({currency}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  {currency === 'LKR' ? 'Rs.' : currency}
                </span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {currentCategoryPresets.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setCustomCategory('');
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                    category === cat
                      ? type === 'income'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCategory('Other')}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                  category === 'Other'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                + Custom
              </button>
            </div>

            {category === 'Other' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category name..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
              />
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-8 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Customer invoice #, delivery tracking code, etc."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </form>

        {/* Sticky Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-200 bg-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 border border-slate-300 transition cursor-pointer"
          >
            ✕ Cancel / වසන්න
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{editingTransaction ? 'Save Changes' : 'Record Transaction'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
