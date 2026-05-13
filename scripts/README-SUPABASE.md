# Supabase — armazenar cadastros / revisões

O portfólio pode gravar pedidos na tabela **`revisao_solicitacoes`** em vez da planilha (evita Apps Script / CORS / política de TI no Google).

## 1. Criar a tabela e RLS

No projeto Supabase: **SQL** → **New query** → Run.

- **Projeto novo:** cola `supabase-revisao.sql` (tabela já com colunas por campo + `payload`).
- **Já tinhas criado a tabela só com `payload`:** corre **`supabase-revisao-colunas.sql`** uma vez (adiciona as colunas sem perder dados).
- **Tinhas colunas `*_outro` (script antigo):** corre **`supabase-revisao-remover-colunas-outro.sql`** uma vez para juntar o texto na coluna principal e remover essas colunas (opcional; só se essas colunas existirem).

## 2. Onde está o **Project URL**

O URL da API **não aparece só com o nome “Project URL”** em todos os ecrãs. Usa sempre o **Project ID** (Definições gerais do projeto):

| Onde ver | O que copiar |
|----------|----------------|
| **Settings** (engrenagem) → **General** | **Project ID** (ex.: `fsiccogloebdkyttwhcz`) |
| URL que o site precisa | `https://` + Project ID + `.supabase.co` |

Exemplo:

```text
VITE_SUPABASE_URL=https://fsiccogloebdkyttwhcz.supabase.co
```

Também podes abrir o assistente **Connect** no dashboard do projeto — lá costuma aparecer o URL e a chave pública juntos.

## 3. Next.js vs **este projeto (Vite)**

O assistente do Supabase para **Next.js** sugere:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

No **Vite**, variáveis sem o prefixo `VITE_` **não entram** no código do browser. Renomeia assim no `.env` ou `.env.local`:

| Wizard Next.js | Neste portfólio (Vite) |
|----------------|------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `VITE_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `VITE_SUPABASE_PUBLISHABLE_KEY` |

Podes ainda usar `VITE_SUPABASE_ANON_KEY` em vez de `VITE_SUPABASE_PUBLISHABLE_KEY` se preferires o nome antigo — o valor pode ser o **publishable** (`sb_publishable_...`) ou o JWT **anon** legacy.

Exemplo completo:

```env
VITE_SUPABASE_URL=https://fsiccogloebdkyttwhcz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Reinicia `npm run dev` ou faz novo build.

## 4. Chave **secret** (`sb_secret_...` / `service_role`)

Serve só para **servidor**, Edge Functions ou jobs — **nunca** no React nem em variável `VITE_*`. Se a secret foi exposta, **revoga** em **Settings → API Keys** e cria outra.

## 5. Prioridade de envio

Se `VITE_SUPABASE_URL` e uma chave pública (`VITE_SUPABASE_PUBLISHABLE_KEY` ou `VITE_SUPABASE_ANON_KEY`) estiverem definidos, o site **usa Supabase** e ignora Apps Script / Google Form para esse fluxo.

## 6. Segurança

A política RLS de exemplo permite **INSERT** com a chave pública. Para endurecer: Edge Function com secret no servidor, rate limit, captcha, etc.
