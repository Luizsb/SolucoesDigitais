/**
 * Google Apps Script — anexar pedidos na aba "solucoes_revisao"
 *
 * Autenticação (escolher conforme necessidade):
 * - Nada definido: aceita POST (apenas para testes controlados).
 * - REVIEW_INGEST_SECRET: campo JSON `_ingestSecret` deve coincidir.
 * - GOOGLE_OAUTH_CLIENT_ID (+ opcional ALLOWED_GOOGLE_HD): campo JSON `google_id_token` (JWT do GIS)
 *   deve ser válido; se ALLOWED_GOOGLE_HD = arcoeducacao.com.br, só contas desse domínio.
 * - Podes ter os dois: basta secret OU token válido.
 *
 * IMPORTANTE: para o POST chegar a este script a partir do portfólio (outro site), a Web App
 * deve permitir execução anónima ao nível HTTP (ex.: "Qualquer pessoa"). A restrição à empresa
 * faz-se aqui com token Google ou segredo partilhado — não com "só utilizadores da org" na
 * implementação, porque o browser não envia cookies Google em fetch cross-origin.
 *
 * Colunas (fase de teste): A tipo_solicitacao, B recebido_em ISO, C payload_json
 */

var REVISAO_SHEET_NAME = 'solucoes_revisao';

function doGet() {
  return jsonOut({ ok: true, hint: 'Use POST com body JSON (Content-Type: application/json).' });
}

/**
 * Valida JWT de ID do Google (GIS). Usa tokeninfo (adequado a Apps Script sem bibliotecas).
 * allowedHd: ex. "arcoeducacao.com.br" — exige info.hd ou email nesse domínio.
 */
function verifyGoogleIdToken_(idToken, expectedAud, allowedHd) {
  var url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
  var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) {
    return null;
  }
  var info = JSON.parse(r.getContentText());
  if (String(info.aud || '') !== String(expectedAud || '')) {
    return null;
  }
  if (info.exp && Number(info.exp) * 1000 < new Date().getTime()) {
    return null;
  }
  var domain = String(allowedHd || '')
    .toLowerCase()
    .replace(/^@/, '');
  if (!domain) {
    return info;
  }
  var hd = String(info.hd || '').toLowerCase();
  if (hd === domain) {
    return info;
  }
  var email = String(info.email || '').toLowerCase();
  var suffix = '@' + domain;
  if (email.length > suffix.length && email.substring(email.length - suffix.length) === suffix) {
    return info;
  }
  return null;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return jsonOut({ ok: false, error: 'lock_timeout' });
  }
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: 'empty_body' });
    }
    var data = JSON.parse(e.postData.contents);

    var props = PropertiesService.getScriptProperties();
    var expectedSecret = props.getProperty('REVIEW_INGEST_SECRET');
    var googleClientId = props.getProperty('GOOGLE_OAUTH_CLIENT_ID');
    var allowedHd = props.getProperty('ALLOWED_GOOGLE_HD') || '';

    var authed = false;

    if (expectedSecret && data._ingestSecret === expectedSecret) {
      delete data._ingestSecret;
      authed = true;
    }

    var idTok = data.google_id_token;
    delete data.google_id_token;

    if (!authed && googleClientId) {
      if (!idTok) {
        return jsonOut({ ok: false, error: 'missing_google_token' });
      }
      var verified = verifyGoogleIdToken_(idTok, googleClientId, allowedHd);
      if (!verified) {
        return jsonOut({ ok: false, error: 'invalid_google_token' });
      }
      data._authenticated_email = verified.email;
      authed = true;
    }

    if (!authed && expectedSecret) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }

    if (!authed && !googleClientId && !expectedSecret) {
      authed = true;
    }

    if (!authed) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }

    var tipo = data.tipo_solicitacao || 'sem_tipo';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(REVISAO_SHEET_NAME);
    if (!sh) {
      return jsonOut({ ok: false, error: 'sheet_not_found: ' + REVISAO_SHEET_NAME });
    }

    sh.appendRow([tipo, new Date().toISOString(), JSON.stringify(data)]);
    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
