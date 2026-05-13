import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, CircleHelp, Info, Layers, Link, MessageSquare, X } from 'lucide-react';
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
import {
  submitToRevisaoSheet,
} from '../lib/submitToRevisaoSheet';
import { submitToSupabaseRevisao } from '../lib/submitToSupabaseRevisao';
import { isGoogleCredentialForSheetConfigured } from '../lib/googleCredentialForSheet';
import { GoogleSheetSendAuthBar } from './GoogleSheetSendAuthBar';
import { RevisaoSupabaseUnavailablePanel } from './RevisaoSupabaseUnavailablePanel';
import { getNovaSolucaoSummarySections, SubmissionSuccessSummary } from './SubmissionSuccessSummary';

type SolutionSubmissionFormProps = {
  onCancel: () => void;
};

type ValidationIssue = { message: string; anchorId: string };

type FormData = {
  nomeSolucao: string;
  categoria: string;
  categoriaOutro: string;
  areaResponsavel: string;
  areaResponsavelOutro: string;
  responsible: string;
  status: '' | 'Em uso' | 'Em desenvolvimento' | 'Piloto';
  nivelMaturidade: '' | 'Baixo' | 'Médio' | 'Alto';
  oQueE: string;
  quandoUsar: string;
  problemaResolvido: string;
  resultadoEsperado: string;
  impactoPrincipal: string;
  comoUsar: string;
  tipoProblema: string[];
  tipoProblemaOutro: string;
  tipoImpacto: string[];
  tipoImpactoOutro: string;
  linkAcesso: string;
  linkDemo: string;
  linkDocumentacao: string;
  tags: string;
  observacoes: string;
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

const TIPO_PROBLEMA_OPTIONS = [
  'Manual',
  'Organização',
  'Padronização',
  'Escalabilidade',
  'Acessibilidade',
  'Visibilidade',
  'Dependência externa',
  'Workflow',
  'Limitação de experiência',
];

const TIPO_IMPACTO_OPTIONS = [
  'Tempo',
  'Qualidade',
  'Organização',
  'Escala',
  'Custo',
  'Visibilidade',
  'Segurança',
  'Experiência',
];

const AREA_RESPONSAVEL_OPTIONS = [
  'Interações Digitais',
  'Operações',
  'Tecnologia',
  'Produto',
  'Atendimento',
  'Dados e BI',
];

const INITIAL_FORM: FormData = {
  nomeSolucao: '',
  categoria: '',
  categoriaOutro: '',
  areaResponsavel: '',
  areaResponsavelOutro: '',
  responsible: '',
  status: '',
  nivelMaturidade: '',
  oQueE: '',
  quandoUsar: '',
  problemaResolvido: '',
  resultadoEsperado: '',
  impactoPrincipal: '',
  comoUsar: '',
  tipoProblema: [],
  tipoProblemaOutro: '',
  tipoImpacto: [],
  tipoImpactoOutro: '',
  linkAcesso: '',
  linkDemo: '',
  linkDocumentacao: '',
  tags: '',
  observacoes: '',
};

export function SolutionSubmissionForm({ onCancel }: SolutionSubmissionFormProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [failedSupabasePayloadJson, setFailedSupabasePayloadJson] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const supabaseActive = isRevisaoSupabaseSubmitActive();
  const appsScriptActive = isRevisaoAppsScriptSubmitActive();
  const formFallback = isRevisaoFormFallbackConfigured();
  const formUrl = revisaoGoogleFormUrl();
  const googleAuthRequired = appsScriptActive && isGoogleCredentialForSheetConfigured();

  const requiredFields = useMemo(
    () => [
      { key: 'nomeSolucao', label: 'Nome da solução' },
      { key: 'categoria', label: 'Categoria' },
      { key: 'areaResponsavel', label: 'Área responsável' },
      { key: 'status', label: 'Status' },
      { key: 'nivelMaturidade', label: 'Nível de maturidade' },
      { key: 'responsible', label: 'Responsável(is)' },
      { key: 'oQueE', label: 'O que é' },
      { key: 'quandoUsar', label: 'Quando usar' },
      { key: 'problemaResolvido', label: 'Problema resolvido' },
      { key: 'resultadoEsperado', label: 'Resultado esperado' },
      { key: 'impactoPrincipal', label: 'Impacto principal' },
    ] as const,
    [],
  );

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setFailedSupabasePayloadJson(null);

    const issues: ValidationIssue[] = [];
    for (const { key, label } of requiredFields) {
      if (!form[key].trim()) {
        issues.push({
          message: `Preencha «${label}».`,
          anchorId: `submission-anchor-${key}`,
        });
      }
    }

    if (form.tipoProblema.length === 0) {
      issues.push({
        message: 'Selecione ao menos um tipo de problema.',
        anchorId: 'submission-anchor-tipoProblema',
      });
    }
    if (form.tipoImpacto.length === 0) {
      issues.push({
        message: 'Selecione ao menos um tipo de impacto.',
        anchorId: 'submission-anchor-tipoImpacto',
      });
    }
    if (form.categoria === 'Outros' && !form.categoriaOutro.trim()) {
      issues.push({
        message: 'Informe a categoria em «Categoria (outros)».',
        anchorId: 'submission-anchor-categoriaOutro',
      });
    }
    if (form.areaResponsavel === 'Outros' && !form.areaResponsavelOutro.trim()) {
      issues.push({
        message: 'Informe a área em «Área responsável (outros)».',
        anchorId: 'submission-anchor-areaResponsavelOutro',
      });
    }
    if (form.tipoProblema.includes('Outros') && !form.tipoProblemaOutro.trim()) {
      issues.push({
        message: 'Descreva o tipo de problema em «Tipo de problema (outros)».',
        anchorId: 'submission-anchor-tipoProblemaOutro',
      });
    }
    if (form.tipoImpacto.includes('Outros') && !form.tipoImpactoOutro.trim()) {
      issues.push({
        message: 'Descreva o tipo de impacto em «Tipo de impacto (outros)».',
        anchorId: 'submission-anchor-tipoImpactoOutro',
      });
    }

    if (issues.length > 0) {
      setValidationIssues(issues);
      setSubmitted(false);
      queueMicrotask(() => {
        document.getElementById(issues[0].anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    if (googleAuthRequired && !googleIdToken) {
      setSubmitError('Use «Continuar com Google» com a conta da empresa antes de enviar à planilha.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = { ...form, tipo_solicitacao: 'nova_solucao' as const };

    if (supabaseActive) {
      setIsSubmitting(true);
      try {
        await submitToSupabaseRevisao(payload as unknown as Record<string, unknown>);
        setValidationIssues([]);
        setFailedSupabasePayloadJson(null);
        setSubmitError(null);
        setSubmitted(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Não foi possível enviar o pedido.';
        setSubmitError(msg);
        setFailedSupabasePayloadJson(JSON.stringify(payload, null, 2));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (appsScriptActive) {
      setIsSubmitting(true);
      try {
        await submitToRevisaoSheet(payload as unknown as Record<string, unknown>, {
          googleIdToken: googleAuthRequired ? googleIdToken : null,
        });
        setValidationIssues([]);
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
      setValidationIssues([]);
      setSubmitted(true);
      return;
    }

    setValidationIssues([]);
    setSubmitted(true);
    console.log('Payload de nova solução (sem URL Apps Script):', payload);
  };

  const toggleMultiOption = (key: 'tipoProblema' | 'tipoImpacto', option: string) => {
    setForm((prev) => {
      const exists = prev[key].includes(option);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((item) => item !== option) : [...prev[key], option],
      };
    });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setValidationIssues([]);
    setSubmitted(false);
    setSubmitError(null);
    setFailedSupabasePayloadJson(null);
    setGoogleIdToken(null);
    setCopyHint(null);
  };

  if (submitted) {
    const payloadObj = { ...form, tipo_solicitacao: 'nova_solucao' as const };
    const payloadText = formFallback ? JSON.stringify(payloadObj, null, 2) : '';

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
      <div className="mx-auto w-full max-w-3xl py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface">
            {formFallback ? 'Formulário pronto a concluir' : 'Enviado com sucesso!'}
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            {formFallback && formUrl ? (
              <>
                A TI restringe o envio automático a partir deste site. Os dados foram validados aqui; abra o{' '}
                <strong className="text-on-surface">formulário corporativo</strong> (sessão Google Arco) e transcreva ou
                cole o resumo JSON nos campos do formulário.
              </>
            ) : supabaseActive || appsScriptActive ? (
              <>
                O pedido foi enviado para <strong className="text-on-surface">revisão</strong>. Após validação, a
                solução poderá ser incluída no portfólio em breve.
              </>
            ) : (
              'Envio em modo local (sem destino remoto configurado neste ambiente). O resumo abaixo serve apenas para conferência.'
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
          title="Resumo do cadastro enviado"
          sections={getNovaSolucaoSummarySections(payloadObj as unknown as Record<string, unknown>)}
        />
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all"
        >
          Voltar ao Portfólio
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          <Layers size={14} />
          Novo cadastro
        </div>
        <h1 className="text-3xl font-bold text-on-surface">Cadastro de nova solução</h1>
        <p className="text-on-surface-variant">
          Inclua no portfólio uma ferramenta, solução ou iniciativa digital da sua área — em uso, em piloto ou ainda em desenvolvimento.
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
            Após preencher, use <strong className="text-on-surface">Enviar cadastro</strong>: o site valida os campos e
            mostra o link para o formulário Google (compatível com a política de TI da Arco).
          </p>
        </div>
      ) : null}

      {validationIssues.length > 0 && (
        <div className="rounded-xl border border-tertiary/35 bg-tertiary/10 p-4">
          <p className="text-sm font-semibold text-tertiary mb-2">Corrija os campos indicados:</p>
          <ul className="space-y-2 text-sm text-on-surface">
            {validationIssues.map((issue, index) => (
              <li key={`${issue.anchorId}-${index}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span>{issue.message}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary underline-offset-2 hover:underline shrink-0"
                  onClick={() =>
                    document.getElementById(issue.anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                >
                  Ir ao campo
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-10">
        {/* Bloco 1: Informações Gerais */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <Info size={18} className="text-primary" />
            Informações gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Nome da solução *"
              hint="Nome como a solução será identificada no portfólio para busca e leitura."
              fieldAnchorId="submission-anchor-nomeSolucao"
            >
              <input
                value={form.nomeSolucao}
                onChange={(e) => updateField('nomeSolucao', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex.: Assistente de triagem documental"
              />
            </FormField>
            <FormField
              label="Categoria *"
              hint="Classificação principal da solução para facilitar filtros e descoberta."
              fieldAnchorId="submission-anchor-categoria"
            >
              <select
                value={form.categoria}
                onChange={(e) => updateField('categoria', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione uma categoria</option>
                {CATEGORIA_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                <option value="Outros">Outros</option>
              </select>
            </FormField>
            {form.categoria === 'Outros' && (
              <FormField label="Categoria (outros) *" fieldAnchorId="submission-anchor-categoriaOutro">
                <input
                  value={form.categoriaOutro}
                  onChange={(e) => updateField('categoriaOutro', e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Informe a categoria"
                />
              </FormField>
            )}
            <FormField
              label="Área responsável *"
              hint="Time ou área dona da solução dentro da organização."
              fieldAnchorId="submission-anchor-areaResponsavel"
            >
              <select
                value={form.areaResponsavel}
                onChange={(e) => updateField('areaResponsavel', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione uma área</option>
                {AREA_RESPONSAVEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
                <option value="Outros">Outros</option>
              </select>
            </FormField>
            {form.areaResponsavel === 'Outros' && (
              <FormField label="Área responsável (outros) *" fieldAnchorId="submission-anchor-areaResponsavelOutro">
                <input
                  value={form.areaResponsavelOutro}
                  onChange={(e) => updateField('areaResponsavelOutro', e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Informe a área responsável"
                />
              </FormField>
            )}
            <FormField
              label="Responsável(is) *"
              hint="Pessoa(s) de referência para dúvidas, evolução e manutenção da solução."
              fieldAnchorId="submission-anchor-responsible"
            >
              <input
                value={form.responsible}
                onChange={(e) => updateField('responsible', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex.: Nome 1; Nome 2"
              />
            </FormField>
            <div id="submission-anchor-status" className="space-y-2 block scroll-mt-28">
              <div className="inline-flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface-variant">
                <label htmlFor="submission-status">Status *</label>
                <StatusFieldLegend />
              </div>
              <select
                id="submission-status"
                value={form.status}
                onChange={(e) => updateField('status', e.target.value as FormData['status'])}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione o status</option>
                {SOLUTION_STATUS_ORDER.map((value) => (
                  <option key={value} value={value} title={SOLUTION_STATUS_OPTION_TITLE[value]}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              className="md:col-span-2"
              label="Nível de maturidade *"
              hint="O quão pronta e confiável a solução está para uso real por outras pessoas."
              fieldAnchorId="submission-anchor-nivelMaturidade"
            >
              <select
                value={form.nivelMaturidade}
                onChange={(e) => updateField('nivelMaturidade', e.target.value as FormData['nivelMaturidade'])}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Selecione o nível de maturidade</option>
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
            <FormField label="O que é *" hint="Descrição curta e objetiva da solução e do seu propósito." fieldAnchorId="submission-anchor-oQueE">
              <textarea
                value={form.oQueE}
                onChange={(e) => updateField('oQueE', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Resumo objetivo da solução."
              />
            </FormField>
            <FormField
              label="Quando usar * (separe itens por ; )"
              hint="Descreva cenários de uso prático. Use ';' para separar múltiplos contextos."
              fieldAnchorId="submission-anchor-quandoUsar"
            >
              <textarea
                value={form.quandoUsar}
                onChange={(e) => updateField('quandoUsar', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Quando precisar de X; Quando quiser ganhar Y..."
              />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Problema resolvido *" hint="Dor real que a solução elimina ou reduz." fieldAnchorId="submission-anchor-problemaResolvido">
                <textarea
                  value={form.problemaResolvido}
                  onChange={(e) => updateField('problemaResolvido', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </FormField>
              <FormField
                label="Resultado esperado *"
                hint="Resultados concretos esperados após adoção da solução."
                fieldAnchorId="submission-anchor-resultadoEsperado"
              >
                <textarea
                  value={form.resultadoEsperado}
                  onChange={(e) => updateField('resultadoEsperado', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </FormField>
            </div>
            <FormField label="Impacto principal *" hint="Principal benefício estratégico ou operacional gerado." fieldAnchorId="submission-anchor-impactoPrincipal">
              <textarea
                value={form.impactoPrincipal}
                onChange={(e) => updateField('impactoPrincipal', e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Resumo do principal ganho da solução."
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
            <Layers size={18} className="text-primary" />
            Classificação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiSelectField
              label="Tipo de problema *"
              hint="Selecione os tipos de dor atendidos pela solução."
              options={[...TIPO_PROBLEMA_OPTIONS, 'Outros']}
              selected={form.tipoProblema}
              onToggle={(option) => toggleMultiOption('tipoProblema', option)}
              anchorId="submission-anchor-tipoProblema"
            />
            <MultiSelectField
              label="Tipo de impacto *"
              hint="Selecione os tipos de ganho entregues pela solução."
              options={[...TIPO_IMPACTO_OPTIONS, 'Outros']}
              selected={form.tipoImpacto}
              onToggle={(option) => toggleMultiOption('tipoImpacto', option)}
              anchorId="submission-anchor-tipoImpacto"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {form.tipoProblema.includes('Outros') && (
              <FormField label="Tipo de problema (outros) *" labelClassName="mt-[2px]" fieldAnchorId="submission-anchor-tipoProblemaOutro">
                <input
                  value={form.tipoProblemaOutro}
                  onChange={(e) => updateField('tipoProblemaOutro', e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Descreva outro tipo de problema"
                />
              </FormField>
            )}
            {form.tipoImpacto.includes('Outros') && (
              <FormField label="Tipo de impacto (outros) *" fieldAnchorId="submission-anchor-tipoImpactoOutro">
                <input
                  value={form.tipoImpactoOutro}
                  onChange={(e) => updateField('tipoImpactoOutro', e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Descreva outro tipo de impacto"
                />
              </FormField>
            )}
          </div>
          <FormField label="Tags (separadas por ;)">
            <input
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ex.: IA; Automação; PDF"
            />
          </FormField>
        </div>

        {/* Bloco 4: Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <Link size={18} className="text-primary" />
            Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Link de acesso">
              <input
                value={form.linkAcesso}
                onChange={(e) => updateField('linkAcesso', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </FormField>
            <FormField label="Link demo">
              <input
                value={form.linkDemo}
                onChange={(e) => updateField('linkDemo', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </FormField>
            <FormField label="Link documentação">
              <input
                value={form.linkDocumentacao}
                onChange={(e) => updateField('linkDocumentacao', e.target.value)}
                className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </FormField>
          </div>
        </div>

        {/* Bloco 5: Observações */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
            <MessageSquare size={18} className="text-primary" />
            Observações
          </h3>
          <FormField label="Observações adicionais">
            <textarea
              value={form.observacoes}
              onChange={(e) => updateField('observacoes', e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-outline-variant/25 bg-surface-container-high px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Alguma informação extra que não se encaixa nos campos acima."
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'A enviar…' : 'Enviar cadastro'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface font-semibold hover:border-primary/50 hover:text-primary transition-colors"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-semibold hover:text-on-surface transition-colors"
          >
            Voltar
          </button>
        </div>
      </form>
    </section>
  );
}

type FormFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  /** Âncora para validação e scroll (id no DOM). */
  fieldAnchorId?: string;
};

function FormField({ label, hint, children, className, labelClassName, fieldAnchorId }: FormFieldProps) {
  const inner = (
    <label className={`space-y-2 block ${className ?? ''}`}>
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface-variant ${labelClassName ?? ''}`}
      >
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      {children}
    </label>
  );
  if (!fieldAnchorId) return inner;
  return <div id={fieldAnchorId} className="scroll-mt-28">{inner}</div>;
}

type MultiSelectFieldProps = {
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  anchorId?: string;
};

function MultiSelectField({ label, hint, options, selected, onToggle, anchorId }: MultiSelectFieldProps) {
  return (
    <div id={anchorId} className={`space-y-2${anchorId ? ' scroll-mt-28' : ''}`}>
      <span className="inline-flex items-center gap-1.5 text-xs font-label uppercase tracking-wider text-on-surface-variant">
        {label}
        {hint && <InfoHint text={hint} />}
      </span>
      <div className="rounded-xl border border-outline-variant/25 bg-surface-container-high p-3">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-primary/15 text-primary border-primary/35'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/20 hover:border-primary/35 hover:text-on-surface'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
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
        aria-label="Informações do campo"
      >
        <CircleHelp size={14} />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-5 z-20 hidden w-72 -translate-x-1/2 rounded-lg border border-outline-variant/20 bg-surface-container p-2 text-[11px] normal-case tracking-normal text-on-surface shadow-lg group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}
