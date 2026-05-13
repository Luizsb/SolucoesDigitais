type RevisaoSheetResponse = {
  ok?: boolean;
  error?: string;
  hint?: string;
};

export type SubmitToRevisaoSheetOptions = {
  /** JWT do Google Identity Services (corpo `google_id_token`); validado no Apps Script se configurado. */
  googleIdToken?: string | null;
};

export {
  isRevisaoAppsScriptSubmitActive,
  isRevisaoFormFallbackConfigured,
  isRevisaoSheetSubmitConfigured,
  isRevisaoSupabaseSubmitActive,
  isSupabaseRevisaoConfigured,
  revisaoGoogleFormUrl,
} from './revisaoSubmitMode';

/**
 * Envia o payload para a Web App do Apps Script (aba `solucoes_revisao`).
 * Opcional: `VITE_APPS_SCRIPT_INGEST_SECRET` — mesmo valor que a propriedade `REVIEW_INGEST_SECRET` no script.
 * Opcional: `googleIdToken` — quando o script tem `GOOGLE_OAUTH_CLIENT_ID`, valida conta Google (ex. domínio Arco).
 */
export async function submitToRevisaoSheet(
  payload: Record<string, unknown>,
  options?: SubmitToRevisaoSheetOptions,
): Promise<void> {
  const url = import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL?.trim();
  if (!url) {
    throw new Error('URL do Apps Script não configurada (VITE_APPS_SCRIPT_WEB_APP_URL).');
  }

  const secret = import.meta.env.VITE_APPS_SCRIPT_INGEST_SECRET?.trim();
  const body: Record<string, unknown> = { ...payload };
  if (secret) {
    body._ingestSecret = secret;
  }
  const gid = options?.googleIdToken?.trim();
  if (gid) {
    body.google_id_token = gid;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    const devProxyHint =
      import.meta.env.DEV && /^https?:\/\//i.test(url)
        ? ' Em `npm run dev`, use o proxy: `GAS_REVISAO_UPSTREAM_URL` = URL /exec completo e `VITE_APPS_SCRIPT_WEB_APP_URL=/__gas_revisao` (ver `.env.example`).'
        : '';
    throw new Error(
      `Falha de rede (${detail}). Pedidos diretos de localhost ou de outro site para script.google.com são frequentemente bloqueados por CORS no Workspace.${devProxyHint}`,
    );
  }

  const raw = await res.text();
  let parsed: RevisaoSheetResponse = {};
  try {
    parsed = JSON.parse(raw) as RevisaoSheetResponse;
  } catch {
    /* resposta não JSON */
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        'Acesso negado (HTTP ' +
          res.status +
          '). Na implementação da Web App, use "Qualquer pessoa" (ou equivalente) se o envio for público; ' +
          'implementações só para a organização exigem sessão Google e falham a partir do site.',
      );
    }
    throw new Error(parsed.error || raw.slice(0, 200) || `HTTP ${res.status}`);
  }
  if (parsed.ok === false) {
    const code = parsed.error || '';
    if (code === 'missing_google_token') {
      throw new Error(
        'O servidor exige autenticação Google. Use «Continuar com Google» no formulário e volte a enviar.',
      );
    }
    if (code === 'invalid_google_token') {
      throw new Error(
        'Token Google inválido ou conta fora do domínio permitido. Confirme a conta da empresa ou as propriedades do script (ALLOWED_GOOGLE_HD).',
      );
    }
    throw new Error(code || 'O servidor indicou falha (ok: false).');
  }
}
