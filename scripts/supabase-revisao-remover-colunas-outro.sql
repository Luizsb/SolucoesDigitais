-- Migração única: bases que já tinham categoria_outro, area_responsavel_outro,
-- tipo_problema_outro, tipo_impacto_outro (script antigo).
-- Consolida na coluna principal e remove as colunas redundantes.
-- Se estas colunas não existirem, não corras este ficheiro (a app já grava só nas principais).
-- Faz backup antes se tiveres dados importantes.

update public.revisao_solicitacoes
set categoria = case
  when trim(coalesce(categoria, '')) = 'Outros' and nullif(trim(coalesce(categoria_outro, '')), '') is not null
    then 'Outros (' || trim(categoria_outro) || ')'
  else categoria
end
where nullif(trim(coalesce(categoria_outro, '')), '') is not null;

update public.revisao_solicitacoes
set area_responsavel = case
  when trim(coalesce(area_responsavel, '')) = 'Outros' and nullif(trim(coalesce(area_responsavel_outro, '')), '') is not null
    then 'Outros (' || trim(area_responsavel_outro) || ')'
  else area_responsavel
end
where nullif(trim(coalesce(area_responsavel_outro, '')), '') is not null;

update public.revisao_solicitacoes
set tipo_problema = case
  when nullif(trim(coalesce(tipo_problema_outro, '')), '') is null then tipo_problema
  when nullif(trim(coalesce(tipo_problema, '')), '') is null then 'Outros (' || trim(tipo_problema_outro) || ')'
  else trim(tipo_problema) || ' | Outros (' || trim(tipo_problema_outro) || ')'
end
where nullif(trim(coalesce(tipo_problema_outro, '')), '') is not null;

update public.revisao_solicitacoes
set tipo_impacto = case
  when nullif(trim(coalesce(tipo_impacto_outro, '')), '') is null then tipo_impacto
  when nullif(trim(coalesce(tipo_impacto, '')), '') is null then 'Outros (' || trim(tipo_impacto_outro) || ')'
  else trim(tipo_impacto) || ' | Outros (' || trim(tipo_impacto_outro) || ')'
end
where nullif(trim(coalesce(tipo_impacto_outro, '')), '') is not null;

alter table public.revisao_solicitacoes drop column if exists categoria_outro;
alter table public.revisao_solicitacoes drop column if exists area_responsavel_outro;
alter table public.revisao_solicitacoes drop column if exists tipo_problema_outro;
alter table public.revisao_solicitacoes drop column if exists tipo_impacto_outro;
