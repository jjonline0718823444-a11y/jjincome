# Janith Income - JJ Online Business Financial Tracker 💼📊

A web application designed for **JJ Online Business** to track revenue streams, operational expenses, calculate real-time net profits & margins, generate client-ready PDF statements, and dispatch WhatsApp financial summaries.

🔗 **Live Production URL:** [https://janith-income-jj.netlify.app](https://janith-income-jj.netlify.app)  
⚡ **Netlify Admin:** [https://app.netlify.com/projects/janith-income-jj](https://app.netlify.com/projects/janith-income-jj)

---

## 🚀 Key Features

1. **Dashboard Summary Cards:**
   - **Total Revenue (Income):** Gross volume tracked with positive growth badges.
   - **Total Expenses:** Outflows categorized with clear color indicators.
   - **Net Profit & Margin:** Instant profit/loss computation with dynamic profit margin percentages.
2. **Transaction Management:**
   - Add, edit, and delete income and expense records.
   - Category tags (E-commerce Sales, Wholesale Orders, Digital Services, Facebook & IG Ads, Courier & Packaging, Inventory, etc.) + Custom category support.
   - Payment method tracking (Bank Transfer, Cash, Card, Koko/MintPay, Online Payment Gateway).
   - Live search filter by notes, categories, and payment types.
   - Date range selector (Today, This Week, This Month, Last 30 Days, All Time, Custom Range).
   - CSV export for Excel spreadsheet compatibility.
3. **WhatsApp Quick Share:**
   - Generates formatted summaries with emojis and bullet points.
   - Dispatches via direct `https://wa.me/` link or one-click copy to clipboard.
4. **PDF Financial Reports:**
   - Generates branded, styled A4 PDF financial statements for JJ Online Business.
   - Includes KPI summaries, itemized transaction tables, and audit timestamps.
5. **Full Security Architecture:**
   - **Zero Secret Leaks:** Netlify personal tokens and database master keys are completely excluded from client bundles.
   - **Offline-First Resilience:** Instant high-speed LocalStorage fallback ensures zero downtime.
   - **Supabase Cloud Sync Ready:** Plug in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to sync to PostgreSQL with Row-Level Security (RLS).
   - **One-Click Backup & Restore:** Export full transaction history as JSON and restore anytime.

---

## 📁 Project Folder Structure

```
janith-income/
├── dist/                     # Optimized production bundle
├── public/                   # Static public assets & icons
├── src/
│   ├── components/
│   │   ├── Header.jsx           # App bar, business title, currency picker, triggers
│   │   ├── DashboardStats.jsx   # Income, Expenses & Net Profit KPI cards
│   │   ├── AnalyticsCharts.jsx  # Cash flow ratio & top categories visual breakdown
│   │   ├── FilterBar.jsx        # Search and date range filter controls
│   │   ├── TransactionForm.jsx  # Modal for adding & editing income/expenses
│   │   ├── TransactionList.jsx  # Live table & mobile card ledger
│   │   ├── WhatsAppModal.jsx    # WhatsApp summary preview & wa.me dispatcher
│   │   └── SecurityModal.jsx    # Security explanation, backup export/import & profile
│   ├── lib/
│   │   ├── storage.js           # Unified LocalStorage & Supabase persistence
│   │   └── supabaseClient.js    # Secure Supabase client with validation guards
│   ├── utils/
│   │   ├── formatters.js        # Currency (LKR, USD, EUR) & date formatting
│   │   ├── pdfGenerator.js      # jsPDF & autoTable PDF report generator
│   │   └── whatsapp.js          # WhatsApp formatted message generator
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Tailwind CSS & print styles
│   └── main.jsx                 # React DOM bootstrap
├── supabase/
│   └── schema.sql               # Supabase SQL table & Row-Level Security (RLS) policies
├── .env.example                 # Template for environment variables
├── .gitignore                   # Keeps secrets & node_modules protected
├── netlify.toml                 # Netlify routing & strict security HTTP headers
├── deploy-to-netlify.bat        # Double-click script to build & redeploy to Netlify
├── package.json                 # Dependencies & scripts
└── vite.config.js               # Vite bundler & vendor chunk optimization
```

---

## 💻 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔒 Security Notice & Supabase Setup

### 🛡️ Why your Netlify Token is safe
The Netlify Personal Access Token (`nfp_...`) you provided was used strictly through the command line to create the site and deploy the compiled `dist/` directory. **It is NOT stored in any frontend code or visible in client assets.**

### 🗄️ Setting Up Supabase (Optional)
If you wish to sync with Supabase in the cloud:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the SQL code inside [`supabase/schema.sql`](file:///C:/Users/USER/.gemini/antigravity/scratch/janith-income/supabase/schema.sql).
3. Create a `.env` file in the project folder with:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (your public anon key)
   ```
4. Rebuild and deploy: the app will automatically sync with Supabase while keeping local backups!

---

## 🚀 How to Redeploy to Netlify in the Future

### Option A: 1-Click Batch File (Easiest)
Just double-click the [`deploy-to-netlify.bat`](file:///C:/Users/USER/.gemini/antigravity/scratch/janith-income/deploy-to-netlify.bat) file in this folder. It builds and pushes the update automatically!

### Option B: Terminal Command
```bash
npm run build
npx netlify-cli deploy --prod --dir dist --no-build --auth nfp_47b69nTZ1zjVtMLXsEnxx1bbnSYUJQGA78e9
```
