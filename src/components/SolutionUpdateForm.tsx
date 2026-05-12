import { useState, type ReactNode } from 'react';
import { CheckCircle2, CircleHelp, Edit3, Info, X } from 'lucide-react';
import type { Solution } from '../types/solution';

type SolutionUpdateFormProps = {
  solution: Solution;
  onCancel: () => void;
};

type FormData = {
  nomeSolucao: string;
  categoria: string;
  responsible: string;
  status: 'Em uso' | 'Em desenvolvimento' | 'Piloto';
  nivelMaturidade: 'Baixo' | 'Médio' | 'Alto';
  oQueE: string;
  quandoUsar: string;
  problemaResolvido: string;
  resultadoEsperado: string;
  impactoPrincipal: string;
  comoUsar: string;
  tipoProblema: string;
  tipoImpacto: string;
  tags: string;
  observacoes: string;
  linkAcesso: string;
  linkDemo: string;
  linkDocumentacao: string;
};

const CATEGORIA_OPTIONS = [
  'Automação / IA',
  'Plataforma',
  'Dashboard',
  'Produto Digital',
  'Ferramenta',
  'Script',
  'Repositório Técnico',
  'Ferramenta Interna',
  'Ferramenta de Gestão',
  'Hub de Conteúdo',
  'Processo',
];

export function SolutionUpdateForm({ solution, onCancel }: SolutionUpdateFormProps) {
  const [form, setForm] = useState<FormData>({
    nomeSolucao: solution.title,
    categoria: solution.category,
    responsible: solution.responsible,
    status: solution.status,
    nivelMaturidade: 'Médio', // Fallback as it's not in the base Solution type yet
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
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const payload = {
      ...form,
      tipo_solicitacao: 'atualizacao',
      original_id: solution.id,
      timestamp: new Date().toISOString(),
    };

    console.log('Payload de atualização:', payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface">Sugestão enviada!</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Obrigado por contribuir. Suas sugestões para <strong>{solution.title}</strong> foram capturadas e serão revisadas pelo time responsável.
          </p>
        </div>
        <div className="pt-4 text-xs text-on-surface-variant font-mono bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-left overflow-auto max-h-40">
          <p className="mb-2 font-bold uppercase tracking-widest text-[10px]">Fluxo em preparação (Payload Log):</p>
          <pre>{JSON.stringify({ ...form, tipo_solicitacao: 'atualizacao' }, null, 2)}</pre>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Edit3 size={14} />
            Sugestão de atualização
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container"
            aria-label="Fechar"
            title="Fechar"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-on-surface">✏️ Sugerir atualização</h1>
        <p className="text-on-surface-variant">
          Sugira melhorias ou atualizações para esta solução. As alterações serão revisadas antes da publicação.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Bloco 1: Informações Gerais */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <Info size={18} className="text-primary" />
            Informações gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Nome da solução *">
              <input
                value={form.nomeSolucao}
                onChange={(e) => updateField('nomeSolucao', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Categoria *">
              <select
                value={form.categoria}
                onChange={(e) => updateField('categoria', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORIA_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Responsáveis *">
              <input
                value={form.responsible}
                onChange={(e) => updateField('responsible', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex.: Nome 1; Nome 2"
              />
            </FormField>
            <FormField label="Status *">
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as FormData['status'])}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Em uso">Em uso</option>
                <option value="Em desenvolvimento">Em desenvolvimento</option>
                <option value="Piloto">Piloto</option>
              </select>
            </FormField>
            <FormField label="Nível de maturidade *" className="md:col-span-2">
              <select
                value={form.nivelMaturidade}
                onChange={(e) => updateField('nivelMaturidade', e.target.value as FormData['nivelMaturidade'])}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Baixo">🟡 Baixo — ideia/protótipo, uso individual, instável</option>
                <option value="Médio">🟠 Médio — funcional, uso real pontual, depende do criador</option>
                <option value="Alto">🟢 Alto — estável, documentado, uso escalável</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Bloco 2: Entenda Rápido */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <CheckCircle2 size={18} className="text-primary" />
            Entenda rápido
          </h3>
          <div className="space-y-4">
            <FormField label="O que é *">
              <textarea
                value={form.oQueE}
                onChange={(e) => updateField('oQueE', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Quando usar * (separe por ; )">
              <textarea
                value={form.quandoUsar}
                onChange={(e) => updateField('quandoUsar', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Problema resolvido *">
                <textarea
                  value={form.problemaResolvido}
                  onChange={(e) => updateField('problemaResolvido', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </FormField>
              <FormField label="Resultado esperado *">
                <textarea
                  value={form.resultadoEsperado}
                  onChange={(e) => updateField('resultadoEsperado', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </FormField>
            </div>
            <FormField label="Impacto principal *">
              <textarea
                value={form.impactoPrincipal}
                onChange={(e) => updateField('impactoPrincipal', e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Como acessar / usar">
              <textarea
                value={form.comoUsar}
                onChange={(e) => updateField('comoUsar', e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
          </div>
        </div>

        {/* Bloco 3: Classificação */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <Info size={18} className="text-primary" />
            Classificação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Tipo de problema (separe por ; )">
              <input
                value={form.tipoProblema}
                onChange={(e) => updateField('tipoProblema', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Tipo de impacto (separe por ; )">
              <input
                value={form.tipoImpacto}
                onChange={(e) => updateField('tipoImpacto', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Tags (separe por ; )">
              <input
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
          </div>
        </div>

        {/* Bloco 4: Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <Info size={18} className="text-primary" />
            Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Link de acesso">
              <input
                value={form.linkAcesso}
                onChange={(e) => updateField('linkAcesso', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Link demo">
              <input
                value={form.linkDemo}
                onChange={(e) => updateField('linkDemo', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
            <FormField label="Link documentação">
              <input
                value={form.linkDocumentacao}
                onChange={(e) => updateField('linkDocumentacao', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </FormField>
          </div>
        </div>

        {/* Bloco 5: Observações */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <Info size={18} className="text-primary" />
            Observações
          </h3>
          <FormField label="Observações adicionais">
            <textarea
              value={form.observacoes}
              onChange={(e) => updateField('observacoes', e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </FormField>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="flex-grow md:flex-none px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Enviar sugestão
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-grow md:flex-none px-8 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-bold hover:bg-surface-container-high transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

function FormField({ label, hint, children, className }: FormFieldProps) {
  return (
    <label className={`space-y-2 block ${className ?? ''}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface-variant">
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      {children}
    </label>
  );
}

type InfoHintProps = {
  text: string;
};

function InfoHint({ text }: InfoHintProps) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-on-surface-variant/80 hover:text-primary"
        title={text}
      >
        <CircleHelp size={14} />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-5 z-20 hidden w-72 -translate-x-1/2 rounded-lg border border-outline-variant/20 bg-surface-container p-2 text-[11px] normal-case tracking-normal text-on-surface shadow-lg group-hover:block">
        {text}
      </span>
    </span>
  );
}
