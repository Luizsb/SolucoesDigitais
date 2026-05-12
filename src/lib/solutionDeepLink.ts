import type { Solution } from '../types/solution';

/** Query string para abrir o detalhe (valor = slug do nome ou, em links legados, o `id`). */
export const SOLUTION_QUERY_PARAM = 'solucao';

const DEFAULT_SLUG = 'solucao';

/** Gera um segmento de URL estável a partir do nome da solução. */
export function slugifyTitle(title: string): string {
  const t = title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return t || DEFAULT_SLUG;
}

/**
 * Slug usado na URL e em `?solucao=`.
 * Se várias soluções tiverem o mesmo título (mesmo slug base), acrescenta sufixo com o id para desambiguar.
 */
export function getSolutionShareSlug(solution: Solution, allSolutions: Solution[]): string {
  const base = slugifyTitle(solution.title);
  const othersWithSameBase = allSolutions.filter(
    (s) => s.id !== solution.id && slugifyTitle(s.title) === base,
  );
  if (othersWithSameBase.length === 0) {
    return base;
  }
  const idPart = solution.id.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'id';
  return `${base}-${idPart}`;
}

/** Valor atual de `?solucao=` (slug, id legado, etc.). */
export function getSolutionShareParamFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get(SOLUTION_QUERY_PARAM);
  const v = raw?.trim();
  return v ? decodeURIComponent(v) : null;
}

/**
 * Resolve solução a partir do parâmetro da URL:
 * 1) match exato por `id` (links antigos, ex. `csv-3`);
 * 2) match pelo slug atual (`getSolutionShareSlug`).
 */
export function findSolutionByShareParam(param: string | null, solutions: Solution[]): Solution | null {
  if (!param) return null;
  const trimmed = param.trim();
  if (!trimmed) return null;

  const byId = solutions.find((s) => s.id === trimmed);
  if (byId) return byId;

  return solutions.find((s) => getSolutionShareSlug(s, solutions) === trimmed) ?? null;
}

/** Atualiza o URL sem recarregar a página (`replaceState`). */
export function setSolutionShareParamInLocation(slugOrNull: string | null): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (slugOrNull) {
    url.searchParams.set(SOLUTION_QUERY_PARAM, slugOrNull);
  } else {
    url.searchParams.delete(SOLUTION_QUERY_PARAM);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', next);
}

/** URL completo para partilhar (abre esta ficha no portfólio). */
export function buildSolutionShareUrl(solution: Solution, allSolutions: Solution[]): string {
  const url = new URL(window.location.href);
  url.searchParams.set(SOLUTION_QUERY_PARAM, getSolutionShareSlug(solution, allSolutions));
  url.hash = '';
  return url.toString();
}
