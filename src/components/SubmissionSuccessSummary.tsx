import type { Solution } from '../types/solution';

export type SummaryRow = { label: string; value: string };

export type SummarySection = { heading: string; rows: SummaryRow[] };

function asStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.length ? v.join(', ') : '';
  return String(v).trim();
}

function cell(v: unknown): string {
  const s = asStr(v);
  return s || '—';
}

/** Resumo em blocos para novo cadastro. */
export function getNovaSolucaoSummarySections(data: Record<string, unknown>): SummarySection[] {
  const tp = Array.isArray(data.tipoProblema) ? (data.tipoProblema as string[]) : [];
  const ti = Array.isArray(data.tipoImpacto) ? (data.tipoImpacto as string[]) : [];

  const categoria =
    data.categoria === 'Outros' && asStr(data.categoriaOutro)
      ? `Outros (${asStr(data.categoriaOutro)})`
      : cell(data.categoria);
  const area =
    data.areaResponsavel === 'Outros' && asStr(data.areaResponsavelOutro)
      ? `Outros (${asStr(data.areaResponsavelOutro)})`
      : cell(data.areaResponsavel);

  const informacoesGerais: SummaryRow[] = [
    { label: 'Nome da solução', value: cell(data.nomeSolucao) },
    { label: 'Categoria', value: categoria },
    { label: 'Área responsável', value: area },
    { label: 'Responsável(is)', value: cell(data.responsible) },
    { label: 'Status', value: cell(data.status) },
    { label: 'Nível de maturidade', value: cell(data.nivelMaturidade) },
  ];

  const descricaoValor: SummaryRow[] = [
    { label: 'O que é', value: cell(data.oQueE) },
    { label: 'Quando usar', value: cell(data.quandoUsar) },
    { label: 'Problema resolvido', value: cell(data.problemaResolvido) },
    { label: 'Resultado esperado', value: cell(data.resultadoEsperado) },
    { label: 'Impacto principal', value: cell(data.impactoPrincipal) },
    { label: 'Como usar', value: cell(data.comoUsar) },
  ];

  const classificacao: SummaryRow[] = [
    { label: 'Tipo de problema', value: tp.length ? tp.join(', ') : '—' },
    { label: 'Tipo de impacto', value: ti.length ? ti.join(', ') : '—' },
  ];

  if (tp.includes('Outros')) {
    classificacao.splice(1, 0, { label: 'Tipo de problema (outros)', value: cell(data.tipoProblemaOutro) });
  }
  if (ti.includes('Outros')) {
    const idx = classificacao.findIndex((r) => r.label === 'Tipo de impacto');
    classificacao.splice(idx + 1, 0, { label: 'Tipo de impacto (outros)', value: cell(data.tipoImpactoOutro) });
  }

  const linksObservacoes: SummaryRow[] = [
    { label: 'Link de acesso', value: cell(data.linkAcesso) },
    { label: 'Link demo', value: cell(data.linkDemo) },
    { label: 'Link documentação', value: cell(data.linkDocumentacao) },
    { label: 'Tags', value: cell(data.tags) },
    { label: 'Observações', value: cell(data.observacoes) },
  ];

  return [
    { heading: 'Informações gerais', rows: informacoesGerais },
    { heading: 'Descrição e valor', rows: descricaoValor },
    { heading: 'Classificação', rows: classificacao },
    { heading: 'Links e observações', rows: linksObservacoes },
  ];
}

export function normalizeUpdateFormValueForCompare(v: unknown): string {
  return String(v ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*;\s*/g, '; ')
    .replace(/;\s*$/, '')
    .trim();
}

/**
 * Valores iniciais do formulário «Sugerir atualização» — deve coincidir com o estado inicial em
 * `SolutionUpdateForm` (incl. nível de maturidade por omissão).
 */
export function getUpdateFormBaselineFromSolution(solution: Solution): Record<string, string> {
  return {
    nomeSolucao: solution.title,
    categoria: solution.category,
    responsible: solution.responsible,
    status: solution.status,
    nivelMaturidade: 'Médio',
    oQueE: solution.oQueE,
    quandoUsar: solution.quandoUsar.join('; '),
    problemaResolvido: solution.problemSolved || '',
    resultadoEsperado: solution.resultadoEsperado,
    impactoPrincipal: solution.impact,
    comoUsar: solution.comoUsar || '',
    tipoProblema: solution.problemTypes.join('; '),
    tipoImpacto: solution.impactTypes.join('; '),
    tags: solution.tags.join('; '),
    observacoes: solution.observacoes || '',
    linkAcesso: solution.link || '',
    linkDemo: solution.demoLink || '',
    linkDocumentacao: solution.documentationLink || '',
  };
}

function updateFieldChanged(
  key: string,
  baseline: Record<string, string>,
  submitted: Record<string, unknown>,
): boolean {
  return normalizeUpdateFormValueForCompare(baseline[key]) !== normalizeUpdateFormValueForCompare(submitted[key]);
}

/** Resumo de atualização só com campos diferentes da ficha atual no portfólio. */
export function getAtualizacaoSummarySectionsApenasAlteradas(
  solution: Solution,
  submitted: Record<string, unknown>,
): SummarySection[] {
  const baseline = getUpdateFormBaselineFromSolution(solution);

  const identificacao: SummaryRow[] = [
    {
      label: 'Tipo de pedido',
      value:
        submitted.tipo_solicitacao === 'atualizacao'
          ? 'Atualização de solução'
          : submitted.tipo_solicitacao === 'nova_solucao'
            ? 'Nova solução'
            : cell(submitted.tipo_solicitacao),
    },
    { label: 'Solução (ID original)', value: cell(submitted.original_id) },
    { label: 'Enviado em', value: cell(submitted.timestamp) },
  ];

  const groups: { heading: string; fields: { key: string; label: string }[] }[] = [
    {
      heading: 'Informações gerais',
      fields: [
        { key: 'nomeSolucao', label: 'Nome da solução' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'responsible', label: 'Responsável(is)' },
        { key: 'status', label: 'Status' },
        { key: 'nivelMaturidade', label: 'Nível de maturidade' },
      ],
    },
    {
      heading: 'Conteúdo',
      fields: [
        { key: 'oQueE', label: 'O que é' },
        { key: 'quandoUsar', label: 'Quando usar' },
        { key: 'problemaResolvido', label: 'Problema resolvido' },
        { key: 'resultadoEsperado', label: 'Resultado esperado' },
        { key: 'impactoPrincipal', label: 'Impacto principal' },
        { key: 'comoUsar', label: 'Como usar' },
      ],
    },
    {
      heading: 'Classificação',
      fields: [
        { key: 'tipoProblema', label: 'Tipo de problema' },
        { key: 'tipoImpacto', label: 'Tipo de impacto' },
        { key: 'tags', label: 'Tags' },
        { key: 'observacoes', label: 'Observações' },
      ],
    },
    {
      heading: 'Links',
      fields: [
        { key: 'linkAcesso', label: 'Link de acesso' },
        { key: 'linkDemo', label: 'Link demo' },
        { key: 'linkDocumentacao', label: 'Link documentação' },
      ],
    },
  ];

  const deltaSections: SummarySection[] = [];
  for (const g of groups) {
    const rows = g.fields
      .filter((f) => updateFieldChanged(f.key, baseline, submitted))
      .map((f) => ({ label: f.label, value: cell(submitted[f.key]) }));
    if (rows.length > 0) {
      deltaSections.push({ heading: g.heading, rows });
    }
  }

  if (deltaSections.length === 0) {
    deltaSections.push({
      heading: 'Campos alterados',
      rows: [
        {
          label: 'Comparação com o portfólio',
          value:
            'Não foram detectadas alterações nos campos editáveis em relação à ficha atual desta solução. O pedido foi na mesma registado.',
        },
      ],
    });
  }

  return [{ heading: 'Identificação do pedido', rows: identificacao }, ...deltaSections];
}

/** Payload mínimo de atualização: meta + só campos diferentes da ficha no portfólio. */
export function buildAtualizacaoDeltaPayload(
  solution: Solution,
  current: Record<string, string>,
): Record<string, unknown> {
  const baseline = getUpdateFormBaselineFromSolution(solution);
  const delta: Record<string, unknown> = {
    tipo_solicitacao: 'atualizacao',
    original_id: solution.id,
    timestamp: new Date().toISOString(),
  };
  for (const key of Object.keys(baseline)) {
    if (
      normalizeUpdateFormValueForCompare(baseline[key]) !== normalizeUpdateFormValueForCompare(current[key])
    ) {
      delta[key] = current[key];
    }
  }
  return delta;
}

/** Junta baseline + delta para ecrã de resumo (estado «como enviado»). */
export function mergeAtualizacaoBaselineWithDelta(
  solution: Solution,
  delta: Record<string, unknown>,
): Record<string, unknown> {
  const baseline = getUpdateFormBaselineFromSolution(solution);
  const merged: Record<string, unknown> = { ...baseline };
  for (const [k, v] of Object.entries(delta)) {
    if (k in baseline || k === 'tipo_solicitacao' || k === 'original_id' || k === 'timestamp') {
      merged[k] = v;
    }
  }
  return merged;
}

type SubmissionSuccessSummaryProps = {
  title: string;
  sections: SummarySection[];
};

export function SubmissionSuccessSummary({ title, sections }: SubmissionSuccessSummaryProps) {
  return (
    <div className="mx-auto w-full max-w-2xl text-left rounded-2xl border border-outline-variant/20 bg-surface-container-low/80 p-5 sm:p-6 shadow-inner space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-outline-variant/15 pb-2">
        {title}
      </h3>
      {sections.map((section) => (
        <div
          key={section.heading}
          className="rounded-xl border border-outline-variant/15 bg-surface-container/30 p-4 sm:p-5"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 pb-2 border-b border-outline-variant/10">
            {section.heading}
          </h4>
          <dl className="divide-y divide-outline-variant/10">
            {section.rows.map(({ label, value }, i) => (
              <div
                key={`${section.heading}-${label}-${i}`}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(140px,32%)_1fr] sm:gap-4 sm:items-start"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant shrink-0">
                  {label}
                </dt>
                <dd className="text-sm text-on-surface break-words whitespace-pre-wrap leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
