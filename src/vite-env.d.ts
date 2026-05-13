/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  /** Legacy JWT anon ou use VITE_SUPABASE_PUBLISHABLE_KEY */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Chave publishable `sb_publishable_...` (preferível ao nome anon no .env) */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_APPS_SCRIPT_WEB_APP_URL?: string;
  /** Opcional: igual à propriedade REVIEW_INGEST_SECRET no Apps Script */
  readonly VITE_APPS_SCRIPT_INGEST_SECRET?: string;
  /** OAuth 2.0 Client ID (tipo Web) para Google Identity Services — envio à planilha com `google_id_token` */
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID?: string;
  /** Se definido, não chama Apps Script: após validar o formulário, orienta abertura deste Google Form (conta Arco). */
  readonly VITE_REVISAO_GOOGLE_FORM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
