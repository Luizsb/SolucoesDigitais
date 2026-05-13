/**
 * Mapeia o payload do formulário (camelCase) para colunas SQL em `revisao_solicitacoes`.
 * Arrays (tipo problema/impacto no cadastro novo) viram texto separado por vírgula.
 * Valores «Outros» + texto livre ficam na mesma coluna principal (ex.: `Outros (descrição)`),
 * sem colunas separadas *_outro.
 * Em **atualização**, só entram colunas espelhadas cujas chaves existem no payload (delta);
 * assim não se grava `null` em campos que o utilizador não mexeu (ex.: `area_responsavel`).
 */

function pickText(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (Array.isArray(v)) {
    const joined = v.map((x) => String(x).trim()).filter(Boolean);
    return joined.length ? joined.join(', ') : null;
  }
  const s = String(v).trim();
  return s || null;
}

/** Categoria ou área: se for literal «Outros», incorpora o texto livre na mesma coluna. */
function mergeOutrosEscalar(principal: unknown, textoOutro: unknown): string | null {
  const main = String(principal ?? '').trim();
  const other = String(textoOutro ?? '').trim();
  if (!main && !other) return null;
  if (main === 'Outros' && other) return `Outros (${other})`;
  return main || null;
}

/**
 * Tipo problema / impacto: em array, cada «Outros» vira `Outros (texto)`; em string (ex.: atualização),
 * substitui a palavra Outros pelo detalhe quando há texto livre.
 */
function mergeTipoComOutro(
  raw: unknown,
  outroKey: 'tipoProblemaOutro' | 'tipoImpactoOutro',
  payload: Record<string, unknown>,
): string | null {
  const outro = String(payload[outroKey] ?? '').trim();

  if (Array.isArray(raw)) {
    const parts = raw.map((x) => String(x).trim()).filter(Boolean);
    if (!parts.length && !outro) return null;
    const mapped = parts.map((p) => (p === 'Outros' && outro ? `Outros (${outro})` : p));
    return mapped.length ? mapped.join(', ') : outro ? `Outros (${outro})` : null;
  }

  const base = pickText(raw);
  if (!outro) return base;
  if (!base) return `Outros (${outro})`;
  if (/\boutros\b/i.test(base)) {
    return base.replace(/\boutros\b/gi, `Outros (${outro})`);
  }
  return `${base} | Outros (${outro})`;
}

function fullMirrorsFromPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return {
    nome_solucao: pickText(payload.nomeSolucao),
    categoria: mergeOutrosEscalar(payload.categoria, payload.categoriaOutro),
    area_responsavel: mergeOutrosEscalar(payload.areaResponsavel, payload.areaResponsavelOutro),
    responsible: pickText(payload.responsible),
    status: pickText(payload.status),
    nivel_maturidade: pickText(payload.nivelMaturidade),
    o_que_e: pickText(payload.oQueE),
    quando_usar: pickText(payload.quandoUsar),
    problema_resolvido: pickText(payload.problemaResolvido),
    resultado_esperado: pickText(payload.resultadoEsperado),
    impacto_principal: pickText(payload.impactoPrincipal),
    como_usar: pickText(payload.comoUsar),
    tipo_problema: mergeTipoComOutro(payload.tipoProblema, 'tipoProblemaOutro', payload),
    tipo_impacto: mergeTipoComOutro(payload.tipoImpacto, 'tipoImpactoOutro', payload),
    link_acesso: pickText(payload.linkAcesso),
    link_demo: pickText(payload.linkDemo),
    link_documentacao: pickText(payload.linkDocumentacao),
    tags: pickText(payload.tags),
    observacoes: pickText(payload.observacoes),
  };
}

function hasOwn(payload: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(payload, key);
}

/** Espelhos só para chaves presentes no payload (fluxo de atualização em delta). */
function partialMirrorsFromPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const m: Record<string, unknown> = {};

  const setIf = (camel: string, snake: string, value: string | null) => {
    if (hasOwn(payload, camel)) m[snake] = value;
  };

  setIf('nomeSolucao', 'nome_solucao', pickText(payload.nomeSolucao));
  if (hasOwn(payload, 'categoria') || hasOwn(payload, 'categoriaOutro')) {
    m.categoria = mergeOutrosEscalar(payload.categoria, payload.categoriaOutro);
  }
  if (hasOwn(payload, 'areaResponsavel') || hasOwn(payload, 'areaResponsavelOutro')) {
    m.area_responsavel = mergeOutrosEscalar(payload.areaResponsavel, payload.areaResponsavelOutro);
  }
  setIf('responsible', 'responsible', pickText(payload.responsible));
  setIf('status', 'status', pickText(payload.status));
  setIf('nivelMaturidade', 'nivel_maturidade', pickText(payload.nivelMaturidade));
  setIf('oQueE', 'o_que_e', pickText(payload.oQueE));
  setIf('quandoUsar', 'quando_usar', pickText(payload.quandoUsar));
  setIf('problemaResolvido', 'problema_resolvido', pickText(payload.problemaResolvido));
  setIf('resultadoEsperado', 'resultado_esperado', pickText(payload.resultadoEsperado));
  setIf('impactoPrincipal', 'impacto_principal', pickText(payload.impactoPrincipal));
  setIf('comoUsar', 'como_usar', pickText(payload.comoUsar));
  if (hasOwn(payload, 'tipoProblema') || hasOwn(payload, 'tipoProblemaOutro')) {
    m.tipo_problema = mergeTipoComOutro(payload.tipoProblema, 'tipoProblemaOutro', payload);
  }
  if (hasOwn(payload, 'tipoImpacto') || hasOwn(payload, 'tipoImpactoOutro')) {
    m.tipo_impacto = mergeTipoComOutro(payload.tipoImpacto, 'tipoImpactoOutro', payload);
  }
  setIf('linkAcesso', 'link_acesso', pickText(payload.linkAcesso));
  setIf('linkDemo', 'link_demo', pickText(payload.linkDemo));
  setIf('linkDocumentacao', 'link_documentacao', pickText(payload.linkDocumentacao));
  setIf('tags', 'tags', pickText(payload.tags));
  setIf('observacoes', 'observacoes', pickText(payload.observacoes));

  return m;
}

export function buildRevisaoSolicitacaoRow(
  tipo: string,
  originalId: string | null,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const isAtualizacao = tipo === 'atualizacao';
  const mirrors = isAtualizacao ? partialMirrorsFromPayload(payload) : fullMirrorsFromPayload(payload);

  return {
    tipo_solicitacao: tipo,
    original_id: originalId,
    ...mirrors,
    payload,
  };
}
