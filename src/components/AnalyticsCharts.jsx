import React from 'react';
import { PieChart, BarChart3, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function AnalyticsCharts({ transactions, totals, currency = 'LKR' }) {
  const { totalIncome, totalExpense } = totals;
  const totalFlow = totalIncome + totalExpense;

  const incomePercent = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePercent = 100 - incomePercent;

  // Aggregate category breakdowns
  const incomeCategories = {};
  const expenseCategories = {};

  transactions.forEach((tx) => {
    const amt = parseFloat(tx.amount) || 0;
    if (tx.type === 'income') {
      incomeCategories[tx.category] = (incomeCategories[tx.category] || 0) + amt;
    } else {
      expenseCategories[tx.category] = (expenseCategories[tx.category] || 0) + amt;
    }
  });

  const sortedIncomeCats = Object.entries(incomeCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const sortedExpenseCats = Object.entries(expenseCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Cashflow Distribution Ratio */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Cash Flow Ratio
          </h4>
          <span className="text-xs font-semibold text-slate-500">
            Total Flow: {formatCurrency(totalFlow, currency)}
          </span>
        </div>

        {/* Dual Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${incomePercent}%` }} 
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Income: ${incomePercent}%`}
          />
          <div 
            style={{ width: `${expensePercent}%` }} 
            className="bg-rose-500 h-full transition-all duration-500"
            title={`Expense: ${expensePercent}%`}
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Income ({incomePercent}%)
          </div>
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Expense ({expensePercent}%)
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          {incomePercent > 60 ? (
            <span className="text-emerald-700 font-medium">
              Healthy margin! Your business is retaining over {incomePercent}% of incoming volume.
            </span>
          ) : incomePercent > 40 ? (
            <span className="text-amber-700 font-medium">
              Balanced cash flow. Keep monitoring recurring ad and operational expenses.
            </span>
          ) : (
            <span className="text-rose-700 font-medium">
              Expenses currently exceed revenue for this period.
            </span>
          )}
        </div>
      </div>

      {/* 2. Top Income Categories */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Top Revenue Streams
          </h4>
          <span className="text-xs text-slate-400">By category</span>
        </div>

        {sortedIncomeCats.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No income records in this period</p>
        ) : (
          <div className="space-y-3">
            {sortedIncomeCats.map(([cat, amt]) => {
              const pct = totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[150px]">{cat}</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(amt, currency)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Top Expense Categories */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-600" />
            Top Expense Categories
          </h4>
          <span className="text-xs text-slate-400">By category</span>
        </div>

        {sortedExpenseCats.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No expense records in this period</p>
        ) : (
          <div className="space-y-3">
            {sortedExpenseCats.map(([cat, amt]) => {
              const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[150px]">{cat}</span>
                    <span className="font-bold text-rose-600">{formatCurrency(amt, currency)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-rose-500 h-1.5 rounded-full" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
