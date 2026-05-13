-- Executar no Supabase: SQL Editor → New query → Run
-- Tabela de pedidos de cadastro / atualização (novos projetos).
-- Se a tabela JÁ EXISTIR só com `payload`, corre em vez disso (ou depois) `supabase-revisao-colunas.sql`.

create table if not exists public.revisao_solicitacoes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo_solicitacao text not null,
  original_id text,
  nome_solucao text,
  categoria text,
  area_responsavel text,
  responsible text,
  status text,
  nivel_maturidade text,
  o_que_e text,
  quando_usar text,
  problema_resolvido text,
  resultado_esperado text,
  impacto_principal text,
  como_usar text,
  tipo_problema text,
  tipo_impacto text,
  link_acesso text,
  link_demo text,
  link_documentacao text,
  tags text,
  observacoes text,
  payload jsonb not null
);

comment on table public.revisao_solicitacoes is 'Cadastros e sugestões de atualização enviados pelo portfólio.';
comment on column public.revisao_solicitacoes.tipo_solicitacao is 'nova_solucao | atualizacao';
comment on column public.revisao_solicitacoes.original_id is 'ID da solução no CSV (só atualizacao).';
comment on column public.revisao_solicitacoes.payload is 'JSON completo (auditoria); colunas ao lado espelham o formulário para relatórios.';

create index if not exists revisao_solicitacoes_created_at_idx on public.revisao_solicitacoes (created_at desc);
create index if not exists revisao_solicitacoes_tipo_idx on public.revisao_solicitacoes (tipo_solicitacao);

alter table public.revisao_solicitacoes enable row level security;

drop policy if exists "revisao_insert_anon" on public.revisao_solicitacoes;
create policy "revisao_insert_anon"
  on public.revisao_solicitacoes
  for insert
  to anon
  with check (true);

drop policy if exists "revisao_insert_authenticated" on public.revisao_solicitacoes;
create policy "revisao_insert_authenticated"
  on public.revisao_solicitacoes
  for insert
  to authenticated
  with check (true);
