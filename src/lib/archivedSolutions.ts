/**
 * IDs de soluções forçadas como Arquivado no app (mesmo que a planilha ainda diga outro status).
 * Para reativar: remova o id desta lista e, se necessário, atualize o status na planilha.
 */
export const ARCHIVED_SOLUTION_IDS = new Set<string>([
  '1', // Brieflab — descontinuado
]);

export function isForcedArchived(solutionId: string): boolean {
  return ARCHIVED_SOLUTION_IDS.has(solutionId.trim());
}
