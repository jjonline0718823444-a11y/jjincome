import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Security check: Ensure we only initialize if valid Supabase URL and Anon key are provided.
// Note: Netlify personal tokens (starting with nfp_) or invalid URLs must NOT be used here.
const isValidSupabaseConfig = 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.startsWith('nfp_');

export const isSupabaseConfigured = Boolean(isValidSupabaseConfig);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

if (!isSupabaseConfigured && (supabaseUrl || supabaseAnonKey)) {
  console.warn(
    '[Janith Income Security]: Supabase environment variables were detected but seem invalid or misconfigured. Falling back to local offline storage.'
  );
}
