/** Client ID OAuth (tipo Web) — igual ao configurado no Apps Script em `GOOGLE_OAUTH_CLIENT_ID`. */
export function isGoogleCredentialForSheetConfigured(): boolean {
  return Boolean(import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID?.trim());
}
