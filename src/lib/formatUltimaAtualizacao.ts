/**
 * Interpreta valores típicos da planilha (texto pt-BR, ISO) e devolve `Date` ou null.
 */
function parseSheetDatetime(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoTry = Date.parse(trimmed);
  if (!Number.isNaN(isoTry)) return new Date(isoTry);

  // dd/MM/aaaa [HH:mm[:ss]] — formato comum em planilhas em português
  const slash = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (slash) {
    const p1 = parseInt(slash[1], 10);
    const p2 = parseInt(slash[2], 10);
    const year = parseInt(slash[3], 10);
    const h = slash[4] !== undefined ? parseInt(slash[4], 10) : 0;
    const min = slash[5] !== undefined ? parseInt(slash[5], 10) : 0;
    const s = slash[6] !== undefined ? parseInt(slash[6], 10) : 0;

    let day: number;
    let monthIndex: number;
    if (p1 > 12) {
      day = p1;
      monthIndex = p2 - 1;
    } else if (p2 > 12) {
      monthIndex = p1 - 1;
      day = p2;
    } else {
      day = p1;
      monthIndex = p2 - 1;
    }

    const d = new Date(year, monthIndex, day, h, min, s);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/** Texto curto para UI (pt-BR); se não der para interpretar, devolve o valor original. */
export function formatUltimaAtualizacaoDisplay(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  const parsed = parseSheetDatetime(trimmed);
  if (!parsed) return trimmed;

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed);
}
