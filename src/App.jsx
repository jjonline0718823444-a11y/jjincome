import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import FilterBar from './components/FilterBar';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import WhatsAppModal from './components/WhatsAppModal';
import SecurityModal from './components/SecurityModal';
import { StorageService } from './lib/storage';
import { calculateTotals } from './utils/formatters';
import { exportToPDF } from './utils/pdfGenerator';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(() => StorageService.getSettings());

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'last30' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Load transactions on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await StorageService.fetchTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return transactions.filter((tx) => {
      // 1. Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = (tx.category || '').toLowerCase();
        const desc = (tx.description || '').toLowerCase();
        const method = (tx.payment_method || '').toLowerCase();
        if (!cat.includes(q) && !desc.includes(q) && !method.includes(q)) {
          return false;
        }
      }

      // 3. Date presets
      if (!tx.date) return true;
      const txDate = new Date(tx.date);

      if (datePreset === 'today') {
        return tx.date === todayStr;
      }

      if (datePreset === 'week') {
        const dayOfWeek = now.getDay() || 7; // 1 is Monday, 7 is Sunday
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek + 1);
        monday.setHours(0, 0, 0, 0);
        return txDate >= monday;
      }

      if (datePreset === 'month') {
        return (
          txDate.getFullYear() === now.getFullYear() &&
          txDate.getMonth() === now.getMonth()
        );
      }

      if (datePreset === 'last30') {
        const past30 = new Date(now.getTime() - 30 * 86400000);
        return txDate >= past30;
      }

      if (datePreset === 'custom') {
        if (startDate && tx.date < startDate) return false;
        if (endDate && tx.date > endDate) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, searchQuery, datePreset, startDate, endDate]);

  // Totals for filtered transactions
  const totals = useMemo(() => {
    return calculateTotals(filteredTransactions);
  }, [filteredTransactions]);

  // Overall period description
  const periodLabel = useMemo(() => {
    if (datePreset === 'today') return 'Today';
    if (datePreset === 'week') return 'This Week';
    if (datePreset === 'month') return 'This Month';
    if (datePreset === 'last30') return 'Last 30 Days';
    if (datePreset === 'custom') {
      if (startDate && endDate) return `${startDate} to ${endDate}`;
      if (startDate) return `Since ${startDate}`;
      if (endDate) return `Until ${endDate}`;
      return 'Custom Range';
    }
    return 'All Time';
  }, [datePreset, startDate, endDate]);

  // Handlers
  const handleSaveTransaction = async (formData) => {
    if (formData.id) {
      // Update
      const updated = await StorageService.updateTransaction(formData.id, formData);
      setTransactions(updated);
    } else {
      // Create
      const updated = await StorageService.addTransaction(formData);
      setTransactions(updated);

      // Celebrate profit / big income
      if (formData.type === 'income' && formData.amount >= 25000) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id) => {
    const updated = await StorageService.deleteTransaction(id);
    setTransactions(updated);
  };

  const handleEditClick = (tx) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleExportPDF = () => {
    exportToPDF({
      businessName: settings.businessName || 'JJ Online Business',
      currency: settings.currency || 'LKR',
      periodName: periodLabel,
      totals,
      transactions: filteredTransactions,
    });
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleResetData = async () => {
    const res = await StorageService.resetToSampleData();
    setTransactions(res);
  };

  const handleClearData = async () => {
    const res = await StorageService.clearAll();
    setTransactions(res);
  };

  const handleImportData = (imported) => {
    localStorage.setItem('janith_income_jj_transactions_v1', JSON.stringify(imported));
    setTransactions(imported);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header Navigation */}
      <Header
        settings={settings}
        currency={settings.currency || 'LKR'}
        onChangeCurrency={(curr) => handleSaveSettings({ ...settings, currency: curr })}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsFormOpen(true);
        }}
        onOpenWhatsAppModal={() => setIsWhatsAppOpen(true)}
        onExportPDF={handleExportPDF}
        onOpenSecurityModal={() => setIsSecurityOpen(true)}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Dashboard Summary Cards */}
        <DashboardStats
          totals={totals}
          currency={settings.currency || 'LKR'}
          periodName={periodLabel}
        />

        {/* Visual Analytics and Distribution */}
        <AnalyticsCharts
          transactions={filteredTransactions}
          totals={totals}
          currency={settings.currency || 'LKR'}
        />

        {/* Filters and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          totalResults={filteredTransactions.length}
        />

        {/* Live Transaction Ledger */}
        <TransactionList
          transactions={filteredTransactions}
          currency={settings.currency || 'LKR'}
          onEdit={handleEditClick}
          onDelete={handleDeleteTransaction}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsFormOpen(true);
          }}
        />

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-slate-700">{settings.businessName}</span>. Built for Janith.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSecurityOpen(true)} 
              className="hover:text-indigo-600 transition"
            >
              Privacy & Security
            </button>
            <span>•</span>
            <button 
              onClick={handleExportPDF} 
              className="hover:text-indigo-600 transition"
            >
              Print Financial Report
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsWhatsAppOpen(true)} 
              className="hover:text-emerald-600 transition"
            >
              WhatsApp Assistant
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveTransaction}
        editingTransaction={editingTransaction}
        currency={settings.currency || 'LKR'}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        totals={totals}
        transactions={filteredTransactions}
        periodName={periodLabel}
        currency={settings.currency || 'LKR'}
        businessName={settings.businessName || 'JJ Online Business'}
        defaultPhone={settings.whatsappPhone || ''}
        onSavePhone={(num) => handleSaveSettings({ ...settings, whatsappPhone: num })}
      />

      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetData={handleResetData}
        onClearData={handleClearData}
        transactions={transactions}
        onImportData={handleImportData}
      />

    </div>
  );
}
