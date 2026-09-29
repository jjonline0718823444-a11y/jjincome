import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function DashboardStats({ totals, currency = 'LKR', periodName = 'All Time' }) {
  const { totalIncome, totalExpense, netProfit, profitMargin, count } = totals;
  const isProfitable = netProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      
      {/* 1. Total Income Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Total Revenue
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalIncome, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Gross earnings for {periodName.toLowerCase()}</span>
          </p>
        </div>

        {/* Decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Total Expenses
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalExpense, currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Total business operational outflow
          </p>
        </div>

        {/* Decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-600"></div>
      </div>

      {/* 3. Net Profit Card */}
      <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow ${
        isProfitable 
          ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-800' 
          : 'bg-rose-50/50 border-rose-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
            isProfitable 
              ? 'text-indigo-200 bg-indigo-900/60 border-indigo-700' 
              : 'text-rose-700 bg-rose-100 border-rose-200'
          }`}>
            <Wallet className="w-3.5 h-3.5" />
            {isProfitable ? 'Net Profit' : 'Net Loss'}
          </span>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isProfitable ? 'bg-indigo-800/80 text-emerald-400' : 'bg-rose-100 text-rose-600'
          }`}>
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isProfitable ? 'text-white' : 'text-rose-600'
          }`}>
            {formatCurrency(netProfit, currency)}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
              isProfitable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-200 text-rose-800'
            }`}>
              {profitMargin}% Margin
            </span>
            <span className={`text-xs ${isProfitable ? 'text-indigo-300' : 'text-slate-500'}`}>
              ({count} transactions)
            </span>
          </div>
        </div>

        {/* Decorative bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${
          isProfitable 
            ? 'bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-400' 
            : 'bg-rose-500'
        }`}></div>
      </div>

    </div>
  );
}
