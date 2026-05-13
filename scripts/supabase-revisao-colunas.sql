-- Migração: colunas explícitas além do JSONB `payload`.
-- Corre UMA vez no SQL Editor se a tabela `revisao_solicitacoes` já existir só com `payload`.

alter table public.revisao_solicitacoes add column if not exists nome_solucao text;
alter table public.revisao_solicitacoes add column if not exists categoria text;
alter table public.revisao_solicitacoes add column if not exists area_responsavel text;
alter table public.revisao_solicitacoes add column if not exists responsible text;
alter table public.revisao_solicitacoes add column if not exists status text;
alter table public.revisao_solicitacoes add column if not exists nivel_maturidade text;
alter table public.revisao_solicitacoes add column if not exists o_que_e text;
alter table public.revisao_solicitacoes add column if not exists quando_usar text;
alter table public.revisao_solicitacoes add column if not exists problema_resolvido text;
alter table public.revisao_solicitacoes add column if not exists resultado_esperado text;
alter table public.revisao_solicitacoes add column if not exists impacto_principal text;
alter table public.revisao_solicitacoes add column if not exists como_usar text;
alter table public.revisao_solicitacoes add column if not exists tipo_problema text;
alter table public.revisao_solicitacoes add column if not exists tipo_impacto text;
alter table public.revisao_solicitacoes add column if not exists link_acesso text;
alter table public.revisao_solicitacoes add column if not exists link_demo text;
alter table public.revisao_solicitacoes add column if not exists link_documentacao text;
alter table public.revisao_solicitacoes add column if not exists tags text;
alter table public.revisao_solicitacoes add column if not exists observacoes text;

comment on column public.revisao_solicitacoes.nome_solucao is 'Espelho do formulário; payload mantém JSON completo.';
