import React from 'react';
import { 
  PlusCircle, 
  Share2, 
  FileDown, 
  ShieldCheck, 
  DollarSign, 
  Building2,
  RefreshCw,
  Printer
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function Header({
  settings,
  onOpenAddModal,
  onOpenWhatsAppModal,
  onExportPDF,
  onOpenSecurityModal,
  currency,
  onChangeCurrency,
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Janith Income
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {settings.businessName}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                Financial Tracking & Profit Analytics
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-700 font-medium">
                  {isSupabaseConfigured ? 'Supabase Synced' : 'Secure Local Storage'}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons & Currency Selector */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <div className="relative inline-flex items-center">
              <select
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value)}
                className="bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 border border-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer appearance-none"
                title="Change display currency"
              >
                <option value="LKR">LKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AED">AED</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                ▼
              </div>
            </div>

            {/* WhatsApp Share Button */}
            <button
              onClick={onOpenWhatsAppModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg shadow-sm transition active:scale-95"
              title="Share financial summary on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Share</span>
            </button>

            {/* PDF Report Export Button */}
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg shadow-sm transition active:scale-95"
              title="Download PDF Financial Report"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              <span>PDF Report</span>
            </button>

            {/* Quick Print Button */}
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-sm transition"
              title="Print Financial Statement"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Security & Settings Button */}
            <button
              onClick={onOpenSecurityModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-sm transition"
              title="Security & Storage Settings"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm shadow-indigo-300 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
