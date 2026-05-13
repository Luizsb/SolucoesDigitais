import { useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, CircleHelp, Edit3, Info, X } from 'lucide-react';
import {
  SOLUTION_STATUS_OPTION_TITLE,
  SOLUTION_STATUS_ORDER,
} from '../lib/solutionStatusFormCopy';
import { StatusFieldLegend } from './StatusFieldLegend';
import {
  isRevisaoAppsScriptSubmitActive,
  isRevisaoFormFallbackConfigured,
  isRevisaoSupabaseSubmitActive,
  revisaoGoogleFormUrl,
} from '../lib/revisaoSubmitMode';
import { submitToRevisaoSheet } from '../lib/submitToRevisaoSheet';
import { submitToSupabaseRevisao } from '../lib/submitToSupabaseRevisao';
import { isGoogleCredentialForSheetConfigured } from '../lib/googleCredentialForSheet';
import { GoogleSheetSendAuthBar } from './GoogleSheetSendAuthBar';
import { RevisaoSupabaseUnavailablePanel } from './RevisaoSupabaseUnavailablePanel';
import {
  buildAtualizacaoDeltaPayload,
  getAtualizacaoSummarySectionsApenasAlteradas,
  getUpdateFormBaselineFromSolution,
  mergeAtualizacaoBaselineWithDelta,
  SubmissionSuccessSummary,
} from './SubmissionSuccessSummary';
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

function baselineRecordToFormData(b: Record<string, string>): FormData {
  return {
    nomeSolucao: b.nomeSolucao,
    categoria: b.categoria,
    responsible: b.responsible,
    status: b.status as FormData['status'],
    nivelMaturidade: b.nivelMaturidade as FormData['nivelMaturidade'],
    oQueE: b.oQueE,
    quandoUsar: b.quandoUsar,
    problemaResolvido: b.problemaResolvido,
    resultadoEsperado: b.resultadoEsperado,
    impactoPrincipal: b.impactoPrincipal,
    comoUsar: b.comoUsar,
    tipoProblema: b.tipoProblema,
    tipoImpacto: b.tipoImpacto,
    tags: b.tags,
    observacoes: b.observacoes,
    linkAcesso: b.linkAcesso,
    linkDemo: b.linkDemo,
    linkDocumentacao: b.linkDocumentacao,
  };
}

function formDataToStringRecord(f: FormData): Record<string, string> {
  return {
    nomeSolucao: String(f.nomeSolucao),
    categoria: String(f.categoria),
    responsible: String(f.responsible),
    status: String(f.status),
    nivelMaturidade: String(f.nivelMaturidade),
    oQueE: String(f.oQueE),
    quandoUsar: String(f.quandoUsar),
    problemaResolvido: String(f.problemaResolvido),
    resultadoEsperado: String(f.resultadoEsperado),
    impactoPrincipal: String(f.impactoPrincipal),
    comoUsar: String(f.comoUsar),
    tipoProblema: String(f.tipoProblema),
    tipoImpacto: String(f.tipoImpacto),
    tags: String(f.tags),
    observacoes: String(f.observacoes),
    linkAcesso: String(f.linkAcesso),
    linkDemo: String(f.linkDemo),
    linkDocumentacao: String(f.linkDocumentacao),
  };
}

export function SolutionUpdateForm({ solution, onCancel }: SolutionUpdateFormProps) {
  const [form, setForm] = useState<FormData>(() =>
    baselineRecordToFormData(getUpdateFormBaselineFromSolution(solution)),
  );

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [failedSupabasePayloadJson, setFailedSupabasePayloadJson] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<Record<string, unknown> | null>(null);
  const [lastSubmittedDelta, setLastSubmittedDelta] = useState<Record<string, unknown> | null>(null);
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const supabaseActive = isRevisaoSupabaseSubmitActive();
  const appsScriptActive = isRevisaoAppsScriptSubmitActive();
  const formFallback = isRevisaoFormFallbackConfigured();
  const formUrl = revisaoGoogleFormUrl();
  const googleAuthRequired = appsScriptActive && isGoogleCredentialForSheetConfigured();

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setFailedSupabasePayloadJson(null);

    if (googleAuthRequired && !googleIdToken) {
      setSubmitError('Use «Continuar com Google» com a conta da empresa antes de enviar à planilha.');
      return;
    }

    const currentRecord = formDataToStringRecord(form);
    const deltaPayload = buildAtualizacaoDeltaPayload(solution, currentRecord);
    const mergedPayload = mergeAtualizacaoBaselineWithDelta(solution, deltaPayload);

    if (supabaseActive) {
      setIsSubmitting(true);
      try {
        await submitToSupabaseRevisao(deltaPayload);
        setLastSubmittedPayload(mergedPayload);
        setLastSubmittedDelta(deltaPayload);
        setFailedSupabasePayloadJson(null);
        setSubmitError(null);
        setSubmitted(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Não foi possível enviar o pedido.';
        setSubmitError(msg);
        setFailedSupabasePayloadJson(JSON.stringify(deltaPayload, null, 2));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (appsScriptActive) {
      setIsSubmitting(true);
      try {
        await submitToRevisaoSheet(deltaPayload, {
          googleIdToken: googleAuthRequired ? googleIdToken : null,
        });
        setLastSubmittedPayload(mergedPayload);
        setLastSubmittedDelta(deltaPayload);
        setSubmitted(true);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Não foi possível enviar o pedido.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (formFallback) {
      setLastSubmittedPayload(mergedPayload);
      setLastSubmittedDelta(deltaPayload);
      setSubmitted(true);
      return;
    }

    setLastSubmittedPayload(mergedPayload);
    setLastSubmittedDelta(deltaPayload);
    setSubmitted(true);
    console.log('Payload de atualização (delta, sem URL Apps Script):', deltaPayload);
  };

  if (submitted) {
    const payloadForDisplay = lastSubmittedPayload ?? {};
    const payloadText = formFallback
      ? JSON.stringify(lastSubmittedDelta ?? payloadForDisplay, null, 2)
      : '';

    const copyPayloadJson = async () => {
      if (!payloadText) return;
      try {
        await navigator.clipboard.writeText(payloadText);
        setCopyHint('Resumo copiado para a área de transferência.');
        window.setTimeout(() => setCopyHint(null), 2500);
      } catch {
        setCopyHint('Não foi possível copiar automaticamente; selecione o texto abaixo.');
        window.setTimeout(() => setCopyHint(null), 4000);
      }
    };

    return (
      <div className="w-full py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface">
            {formFallback ? 'Concluir no formulário' : 'Sugestão enviada!'}
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            {formFallback && formUrl ? (
              <>
                Envio automático a partir deste site não está disponível pela política de TI. Os dados estão prontos
                para <strong className="text-on-surface">{solution.title}</strong> — abra o formulário corporativo
                (sessão Google Arco) e cole o JSON ou preencha os campos.
              </>
            ) : supabaseActive || appsScriptActive ? (
              <>
                O pedido foi enviado para <strong className="text-on-surface">revisão</strong>, referente a{' '}
                <strong className="text-on-surface">{solution.title}</strong>. Após validação, as alterações poderão
                constar no portfólio em breve.
              </>
            ) : (
              <>
                Modo local — sugestões para <strong>{solution.title}</strong>. Confira o resumo abaixo.
              </>
            )}
          </p>
        </div>
        {formFallback && formUrl ? (
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Abrir formulário de envio
            </a>
            <button
              type="button"
              onClick={() => void copyPayloadJson()}
              className="inline-flex px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
            >
              Copiar resumo (JSON)
            </button>
          </div>
        ) : null}
        {copyHint ? <p className="text-sm text-secondary">{copyHint}</p> : null}
        <SubmissionSuccessSummary
          title="Resumo das alterações enviadas"
          sections={getAtualizacaoSummarySectionsApenasAlteradas(solution, payloadForDisplay)}
        />
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

      {supabaseActive && failedSupabasePayloadJson ? (
        <RevisaoSupabaseUnavailablePanel
          payloadJson={failedSupabasePayloadJson}
          errorDetail={submitError}
          onDismiss={() => {
            setFailedSupabasePayloadJson(null);
            setSubmitError(null);
          }}
        />
      ) : submitError ? (
        <div className="rounded-xl border border-tertiary/40 bg-tertiary/10 p-4 text-sm text-on-surface">
          <p className="font-semibold text-tertiary mb-1">Erro ao enviar o pedido</p>
          <p>{submitError}</p>
        </div>
      ) : null}

      {appsScriptActive ? (
        <GoogleSheetSendAuthBar googleIdToken={googleIdToken} onGoogleIdToken={setGoogleIdToken} />
      ) : null}

      {formFallback ? (
        <div className="rounded-xl border border-primary/25 bg-primary/10 p-4 text-sm text-on-surface">
          <p className="font-semibold text-on-surface mb-1">Envio via formulário corporativo</p>
          <p className="text-on-surface-variant leading-relaxed">
            Após editar, use <strong className="text-on-surface">Enviar sugestão</strong>: o site valida e mostra o
            link para o formulário Google (política de TI).
          </p>
        </div>
      ) : null}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-10">
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
            <div className="space-y-2 block">
              <div className="inline-flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface-variant">
                <label htmlFor="update-status">Status *</label>
                <StatusFieldLegend />
              </div>
              <select
                id="update-status"
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as FormData['status'])}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {SOLUTION_STATUS_ORDER.map((value) => (
                  <option key={value} value={value} title={SOLUTION_STATUS_OPTION_TITLE[value]}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
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
            disabled={isSubmitting}
            className="flex-grow md:flex-none px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'A enviar…' : 'Enviar sugestão'}
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
