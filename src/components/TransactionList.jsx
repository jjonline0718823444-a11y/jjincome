import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  Edit3, 
  Download, 
  Inbox, 
  Tag, 
  CreditCard 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionList({
  transactions,
  currency = 'LKR',
  onEdit,
  onDelete,
  onOpenAddModal,
}) {
  // Export to CSV helper
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Payment Method', 'Amount'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.payment_method || 'Cash',
      t.amount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JJ_Online_Business_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Table Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Live Transaction History
          </h3>
          <p className="text-xs text-slate-500">
            Real-time ledger of earnings and business expenditures
          </p>
        </div>

        <div className="flex items-center gap-2">
          {transactions.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Export visible list to CSV (Excel)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* When List is Empty */}
      {transactions.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No transactions found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No entries match your current search or date range filters. Try clearing filters or add a new transaction.
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            + Add Transaction
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Type & Date</th>
                  <th scope="col" className="px-5 py-3.5">Category</th>
                  <th scope="col" className="px-5 py-3.5">Description</th>
                  <th scope="col" className="px-5 py-3.5">Method</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Amount</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Type & Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isIncome 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-rose-100 text-rose-600'
                          }`}>
                            {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold uppercase ${
                              isIncome ? 'text-emerald-700' : 'text-rose-700'
                            }`}>
                              {isIncome ? 'Income' : 'Expense'}
                            </span>
                            <p className="text-xs text-slate-400">
                              {formatDate(tx.date)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {tx.category}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <p className="text-xs text-slate-700 truncate" title={tx.description}>
                          {tx.description || <span className="text-slate-300 italic">No notes</span>}
                        </p>
                      </td>

                      {/* Payment Method */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          {tx.payment_method || 'Cash'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <span className={`text-sm font-bold tracking-tight ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(tx)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit transaction"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${tx.category}" (${formatCurrency(tx.amount, currency)})?`)) {
                                onDelete(tx.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-slate-800">{tx.category}</span>
                        <p className="text-[10px] text-slate-400">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </span>
                  </div>

                  {tx.description && (
                    <p className="text-xs text-slate-500 pl-9">
                      {tx.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pl-9 pt-1">
                    <span className="text-[10px] text-slate-400">
                      {tx.payment_method || 'Cash'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(tx)}
                        className="text-xs text-indigo-600 font-medium px-2 py-0.5 rounded hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this record?')) {
                            onDelete(tx.id);
                          }
                        }}
                        className="text-xs text-rose-600 font-medium px-2 py-0.5 rounded hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
