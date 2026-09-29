-- ==============================================================================
-- Janith Income - Database Schema for Supabase
-- Target Business: JJ Online Business
-- ==============================================================================

-- 1. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    user_id UUID DEFAULT auth.uid()
);

-- 2. Create index for fast date querying and sorting
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- 3. Enable Row Level Security (RLS) - CRUCIAL FOR SECURITY
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies
-- If using anonymous public access for your private business dashboard:
CREATE POLICY "Allow public read access" 
ON public.transactions FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.transactions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.transactions FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.transactions FOR DELETE 
USING (true);

-- (OPTIONAL) If you enable Supabase Auth (Email/Password Login), replace the above policies with:
-- CREATE POLICY "Users can only access their own transactions" 
-- ON public.transactions FOR ALL 
-- USING (auth.uid() = user_id);
