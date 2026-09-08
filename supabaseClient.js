// E&B MARKETIZA - Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.EB_CONFIG || {};
export const supabaseReady = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
);
export const supabase = supabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
