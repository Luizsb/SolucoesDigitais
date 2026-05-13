/**
 * Variáveis de ambiente do Supabase no Vite.
 * O wizard do Supabase para Next.js sugere `NEXT_PUBLIC_*` — aqui usamos sempre o prefixo `VITE_`
 * (só assim o Vite expõe valores ao browser).
 */

export function getSupabaseProjectUrl(): string | undefined {
  return import.meta.env.VITE_SUPABASE_URL?.trim() || undefined;
}

/** Chave pública: publishable (`sb_publishable_...`) ou legacy anon JWT. */
export function getSupabasePublicKey(): string | undefined {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    undefined
  );
}

export function isSupabaseEnvComplete(): boolean {
  return Boolean(getSupabaseProjectUrl() && getSupabasePublicKey());
}
