/**
 * Destinos para pedidos de revisão / cadastro.
 *
 * Prioridade: **Supabase** → Apps Script → Google Form → standby local.
 */

import { isSupabaseEnvComplete } from './supabaseEnv';

export function isSupabaseRevisaoConfigured(): boolean {
  return isSupabaseEnvComplete();
}

export function revisaoGoogleFormUrl(): string | undefined {
  const u = import.meta.env.VITE_REVISAO_GOOGLE_FORM_URL?.trim();
  return u || undefined;
}

/** Formulário Google só quando Supabase não está ativo. */
export function isRevisaoFormFallbackConfigured(): boolean {
  return Boolean(revisaoGoogleFormUrl()) && !isSupabaseRevisaoConfigured();
}

/** Apps Script só quando não há Supabase nem formulário como destino principal. */
export function isRevisaoAppsScriptSubmitActive(): boolean {
  const url = import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL?.trim();
  return Boolean(url) && !isRevisaoFormFallbackConfigured() && !isSupabaseRevisaoConfigured();
}

export function isRevisaoSupabaseSubmitActive(): boolean {
  return isSupabaseRevisaoConfigured();
}

/** Qualquer fluxo remoto configurado (Supabase, planilha ou form). */
export function isRevisaoSheetSubmitConfigured(): boolean {
  return (
    isSupabaseRevisaoConfigured() ||
    isRevisaoAppsScriptSubmitActive() ||
    isRevisaoFormFallbackConfigured()
  );
}
