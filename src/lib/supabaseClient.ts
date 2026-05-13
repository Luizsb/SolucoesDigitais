import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseProjectUrl, getSupabasePublicKey } from './supabaseEnv';

let client: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = getSupabaseProjectUrl();
  const key = getSupabasePublicKey();
  if (!url || !key) {
    return null;
  }
  if (!client || url !== lastUrl || key !== lastKey) {
    client = createClient(url, key);
    lastUrl = url;
    lastKey = key;
  }
  return client;
}
