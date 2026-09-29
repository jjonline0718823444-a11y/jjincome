import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Key, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function SecurityModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetData,
  onClearData,
  transactions,
  onImportData,
}) {
  const [businessName, setBusinessName] = useState(settings.businessName || 'JJ Online Business');
  const [ownerName, setOwnerName] = useState(settings.ownerName || 'Janith');
  const [defaultCurrency, setDefaultCurrency] = useState(settings.currency || 'LKR');
  const [whatsappPhone, setWhatsappPhone] = useState(settings.whatsappPhone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      currency: defaultCurrency,
      whatsappPhone: whatsappPhone.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Janith_Income_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportData(parsed);
            alert(`Successfully restored ${parsed.length} transactions!`);
          } else {
            alert("Invalid backup file format. Expected a JSON array.");
          }
        } catch (err) {
          alert("Could not parse file. Make sure it is a valid JSON file.");
        }
      };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 cursor-default flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Security & Business Settings
              </h3>
              <p className="text-xs text-slate-500">
                Data privacy, secret protection, and business profile
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold transition active:scale-95 shadow-sm"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 text-slate-700" />
            <span>Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Security Architecture Notice */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  Zero Client-Side Secret Leak Guarantee
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                </h4>
                <p className="text-emerald-800 leading-relaxed">
                  Netlify deployment tokens (<code>nfp_...</code>) and database master keys are completely isolated from client browser code. They are <strong>never</strong> rendered in HTML or visible to visitors.
                </p>
                <div className="pt-1 flex items-center gap-2 text-emerald-900 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active Backend: {isSupabaseConfigured ? 'Supabase with Row-Level Security' : 'Isolated Local Storage'}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Business Profile Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Business Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner / Administrator
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="LKR">LKR - Sri Lankan Rupee (Rs.)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="AED">AED - UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="94771234567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-emerald-600 font-semibold">
                {savedSuccess && '✓ Settings saved successfully!'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* 3. Data Backup and Management */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Data Management & Backup
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export Data (JSON)</span>
              </button>

              <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Import Data (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Reload demo sample data for JJ Online Business?")) {
                    onResetData();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm("WARNING: Are you sure you want to delete ALL records? This cannot be undone.")) {
                    onClearData();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Clear All Records</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition"
          >
            Close / වසන්න
          </button>
        </div>
      </div>
    </div>
  );
}
