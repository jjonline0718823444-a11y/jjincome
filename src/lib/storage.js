import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'janith_income_jj_transactions_v1';
const SETTINGS_KEY = 'janith_income_settings_v1';

// Initial starter data for JJ Online Business
const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx-001',
    type: 'income',
    category: 'E-commerce Sales',
    amount: 145000,
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    description: 'Bulk orders via Facebook Shop & Website',
    payment_method: 'Bank Transfer',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'tx-002',
    type: 'income',
    category: 'Digital Services',
    amount: 85000,
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    description: 'Web development & marketing consultation',
    payment_method: 'Bank Transfer',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'tx-003',
    type: 'expense',
    category: 'Facebook & IG Ads',
    amount: 32000,
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    description: 'Meta Ad campaigns for product launch',
    payment_method: 'Card',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'tx-004',
    type: 'expense',
    category: 'Inventory Restock',
    amount: 68000,
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    description: 'Stock purchase from wholesale supplier',
    payment_method: 'Cash',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'tx-005',
    type: 'income',
    category: 'Wholesale Orders',
    amount: 98000,
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    description: 'Colombo retail partner bulk delivery',
    payment_method: 'Bank Transfer',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'tx-006',
    type: 'expense',
    category: 'Courier & Packaging',
    amount: 14500,
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    description: 'Courier dispatch fees + bubble wraps',
    payment_method: 'Cash',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'tx-007',
    type: 'expense',
    category: 'Cloud & Domain Hosting',
    amount: 7800,
    date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
    description: 'Monthly server hosting and domain renewal',
    payment_method: 'Card',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  }
];

export const StorageService = {
  // Load transactions from Supabase or LocalStorage
  async fetchTransactions() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data) {
          // Sync with local storage as backup
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
        console.error('Supabase query error, falling back to local cache:', error);
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }

    // LocalStorage fallback
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!local) {
      // First time initialization
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
      return DEFAULT_TRANSACTIONS;
    }

    try {
      return JSON.parse(local);
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  },

  // Add a new transaction
  async addTransaction(newTx) {
    const formatted = {
      ...newTx,
      id: newTx.id || (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'tx-' + Date.now()),
      amount: parseFloat(newTx.amount) || 0,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('transactions')
          .insert([formatted]);
        if (error) throw error;
      } catch (err) {
        console.error('Error inserting to Supabase:', err);
      }
    }

    // Always update local cache
    const current = await this.fetchTransactions();
    const updated = [formatted, ...current.filter((item) => item.id !== formatted.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Update existing transaction
  async updateTransaction(id, updatedFields) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('transactions')
          .update(updatedFields)
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Error updating in Supabase:', err);
      }
    }

    const current = await this.fetchTransactions();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Delete transaction
  async deleteTransaction(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting from Supabase:', err);
      }
    }

    const current = await this.fetchTransactions();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // Reset to sample data
  async resetToSampleData() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
    return DEFAULT_TRANSACTIONS;
  },

  // Clear all data
  async clearAll() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return [];
  },

  // Load Settings (Business Name, Currency, WhatsApp Number)
  getSettings() {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        businessName: 'JJ Online Business',
        ownerName: 'Janith',
        currency: import.meta.env.VITE_DEFAULT_CURRENCY || 'LKR',
        whatsappPhone: import.meta.env.VITE_WHATSAPP_PHONE || '',
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        businessName: 'JJ Online Business',
        ownerName: 'Janith',
        currency: 'LKR',
        whatsappPhone: '',
      };
    }
  },

  // Save Settings
  saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
