import { GoogleLogin } from '@react-oauth/google';
import { isGoogleCredentialForSheetConfigured } from '../lib/googleCredentialForSheet';

type GoogleSheetSendAuthBarProps = {
  googleIdToken: string | null;
  onGoogleIdToken: (token: string | null) => void;
};

/**
 * Barra opcional: quando `VITE_GOOGLE_OAUTH_CLIENT_ID` está definido, o utilizador
 * obtém um JWT Google (GIS) a enviar no corpo do POST para validação no Apps Script.
 */
export function GoogleSheetSendAuthBar({ googleIdToken, onGoogleIdToken }: GoogleSheetSendAuthBarProps) {
  if (!isGoogleCredentialForSheetConfigured()) {
    return null;
  }

  return (
    <div className="rounded-xl border border-outline-variant/25 bg-surface-container-low/60 p-4 space-y-3 text-sm text-on-surface">
      <p className="font-semibold text-on-surface">Identidade para envio à planilha</p>
      <p className="text-on-surface-variant leading-relaxed">
        O pedido não usa a sessão do browser no domínio Google. Use <strong className="text-on-surface">Continuar com Google</strong> com a
        conta da empresa; o token é validado no Apps Script (domínio configurável).
      </p>
      {googleIdToken ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-secondary font-medium text-xs uppercase tracking-wide">Sessão Google pronta para enviar</span>
          <button
            type="button"
            onClick={() => onGoogleIdToken(null)}
            className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
          >
            Remover sessão
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <GoogleLogin
          text="continue_with"
          shape="rectangular"
          size="large"
          onSuccess={(res) => {
            onGoogleIdToken(res.credential ?? null);
          }}
          onError={() => {
            onGoogleIdToken(null);
          }}
        />
      </div>
    </div>
  );
}
