# Aba `solucoes_revisao` + Apps Script

## O que o script faz

Recebe um **POST** com JSON (`nova_solucao` ou `atualizacao`) e acrescenta uma linha na folha **`solucoes_revisao`**:

| Coluna | Conteúdo (fase de teste) |
|--------|---------------------------|
| A | `tipo_solicitacao` |
| B | data/hora ISO (`recebido_em`) |
| C | JSON completo do pedido (`payload_json`) |

Quando definires colunas fixas na folha, podes alterar o `.gs` para escrever célula a célula em vez de colocar tudo em C.

## Passos rápidos

1. Na planilha: **Extensões** → **Apps Script**.
2. Cola o código de `solucoes-revisao.gs`, **Guardar**.
3. **Implementar** → **Nova implementação** → tipo **Aplicação Web**:
   - Executar como: a tua conta
   - Quem tem acesso: *Qualquer pessoa* (teste) ou restringir depois
4. Copia o URL **`.../exec`**.
5. No projeto do portfólio, cria `.env` (local) com:
   - `VITE_APPS_SCRIPT_WEB_APP_URL=<url /exec>`
   - Opcional: `VITE_APPS_SCRIPT_INGEST_SECRET=<segredo>` e no Script **Definições do projeto** → **Propriedades do script** → `REVIEW_INGEST_SECRET` com o mesmo valor.
6. `npm run dev` ou rebuild para Pages com essas variáveis no build.

## Autenticação Google (conta empresa) + 401/CORS

O browser **não envia** a sessão Google (cookies) em `fetch` de `localhost` ou do GitHub Pages para `script.google.com`. Por isso a implementação da Web App deve permitir que o **POST chegue ao script** (ex.: **Qualquer pessoa** ao nível HTTP). A restrição “só Arco” faz-se com:

1. **Propriedades do script** (Definições do projeto → Propriedades do script):
   - `GOOGLE_OAUTH_CLIENT_ID` = o mesmo Client ID OAuth (tipo Web) que usas em `VITE_GOOGLE_OAUTH_CLIENT_ID` no site.
   - `ALLOWED_GOOGLE_HD` = `arcoeducacao.com.br` (opcional mas recomendado).
2. No site: define `VITE_GOOGLE_OAUTH_CLIENT_ID` e, no Google Cloud Console, **origens JavaScript autorizadas** = `http://localhost:3000` e o URL de produção do portfólio.

Com `npm run dev`, mantém o proxy (`GAS_REVISAO_UPSTREAM_URL` + `VITE_APPS_SCRIPT_WEB_APP_URL=/__gas_revisao`) para evitar CORS.

`REVIEW_INGEST_SECRET` continua opcional; se existir, aceita-se **segredo OU** token Google válido.

## Se a TI só permitir «Qualquer pessoa em Arco» (sem Web App pública)

Neste caso o `fetch` a partir do portfólio (outro site) **continua a falhar** (401/CORS): o Google não trata o pedido como «dentro da org» só porque o utilizador tem sessão Arco.

**Caminhos possíveis:**

1. **Formulário Google (recomendado sem Google Cloud no portfólio)**  
   Cria um Google Form ligado à mesma planilha (ou processado por Apps Script ao submeter). No `.env` define só:
   - `VITE_REVISAO_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/.../viewform`  
   **Não** definas `VITE_APPS_SCRIPT_WEB_APP_URL` ao mesmo tempo (o formulário desliga o POST automático). O site valida o cadastro e oferece **Abrir formulário** + **Copiar JSON** para colar no form.

2. **API interna** (Node, Azure Function, etc.) na rede Arco: o browser chama `https://api-interna.../revisao` com cookie/sessão corporativa; o servidor grava na Sheet com **conta de serviço** ou outro método aprovado pela TI.

3. **Pedir exceção** para uma Web App «Qualquer pessoa» só para esse endpoint (avaliar risco com TI).
