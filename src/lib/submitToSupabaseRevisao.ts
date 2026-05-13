import { getSupabaseBrowserClient } from './supabaseClient';
import { buildRevisaoSolicitacaoRow } from './supabaseRevisaoRow';

const TABLE = 'revisao_solicitacoes';

/**
 * Insere uma linha em `revisao_solicitacoes` com colunas espelhadas + `payload` (auditoria).
 * Requer política RLS de INSERT para `anon` e colunas criadas (ver scripts/supabase-revisao*.sql).
 */
export async function submitToSupabaseRevisao(payload: Record<string, unknown>): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error(
      'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (ou VITE_SUPABASE_ANON_KEY).',
    );
  }

  const tipo =
    typeof payload.tipo_solicitacao === 'string' && payload.tipo_solicitacao.trim()
      ? payload.tipo_solicitacao.trim()
      : 'sem_tipo';
  const originalId =
    typeof payload.original_id === 'string' && payload.original_id.trim()
      ? payload.original_id.trim()
      : null;

  const row = buildRevisaoSolicitacaoRow(tipo, originalId, payload);

  const { error } = await supabase.from(TABLE).insert(row);

  if (error) {
    throw new Error(
      error.message.includes('column') || error.code === 'PGRST204'
        ? `${error.message} — Corre o SQL em scripts/supabase-revisao-colunas.sql no Supabase (adiciona colunas à tabela).`
        : error.message || 'Falha ao gravar no Supabase.',
    );
  }
}
