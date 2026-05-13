import { useState } from 'react';
import { CloudOff, Copy } from 'lucide-react';

/** Perfil Slack Enterprise (Arco) — contacto para falhas de envio / revisão. */
export const REVISAO_SLACK_LUIZ_URL = 'https://arco.enterprise.slack.com/team/U0830TU216H';

type RevisaoSupabaseUnavailablePanelProps = {
  /** JSON formatado do pedido (para copiar e não perder dados). */
  payloadJson: string;
  /** Mensagem técnica devolvida pelo cliente (opcional). */
  errorDetail?: string | null;
  /** Limpa o aviso para voltar a tentar enviar. */
  onDismiss?: () => void;
};

export function RevisaoSupabaseUnavailablePanel({
  payloadJson,
  errorDetail,
  onDismiss,
}: RevisaoSupabaseUnavailablePanelProps) {
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(payloadJson);
      setCopyHint(
        'Copiado. No Slack, envie-me o JSON numa mensagem e diga que o envio falhou ou que a plataforma estava instável — assim consigo guardar o que preencheu.',
      );
      window.setTimeout(() => setCopyHint(null), 5000);
    } catch {
      setCopyHint('Não foi possível copiar automaticamente: selecione todo o texto na caixa abaixo e use Ctrl+C (ou Cmd+C).');
      window.setTimeout(() => setCopyHint(null), 6000);
    }
  };

  return (
    <div
      className="rounded-2xl border border-tertiary/35 bg-tertiary/5 p-5 sm:p-6 space-y-4 text-left shadow-inner"
      role="alert"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
          <CloudOff size={22} aria-hidden />
        </div>
        <div className="min-w-0 space-y-2">
          <h3 className="text-base font-bold text-on-surface">Não foi possível guardar o pedido neste momento</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            A plataforma de envio pode estar temporariamente instável ou indisponível. O que preencheu neste
            formulário <strong className="text-on-surface">mantém-se no ecrã</strong> — mas, para não perder o que
            preencheu se fechar o separador ou o site falhar, use <strong className="text-on-surface">Copiar JSON do pedido</strong>, abra o Slack e envie-me uma mensagem para{' '}
            <a
              href={REVISAO_SLACK_LUIZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              Luiz Barbosa
            </a>{' '}
            (Arco Enterprise) com o JSON colado na conversa, e explique que o envio pelo site falhou ou que a
            plataforma estava instável — assim consigo registar o pedido manualmente. Pode também guardar o texto num
            ficheiro. Depois pode tentar enviar de novo aqui no site.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void copyJson()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary hover:opacity-90 transition-opacity"
        >
          <Copy size={16} aria-hidden />
          Copiar JSON do pedido
        </button>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm font-semibold text-on-surface-variant hover:text-on-surface underline-offset-2 hover:underline"
          >
            Fechar este aviso
          </button>
        ) : null}
        {copyHint ? <p className="w-full text-sm text-secondary">{copyHint}</p> : null}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          JSON do formulário (cole na mensagem no Slack)
        </p>
        <textarea
          readOnly
          value={payloadJson}
          rows={10}
          className="w-full resize-y rounded-xl border border-outline-variant/25 bg-surface-container-high px-3 py-2.5 font-mono text-xs text-on-surface leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
          spellCheck={false}
          aria-label="JSON do pedido para cópia manual"
        />
      </div>

      {errorDetail ? (
        <details className="text-xs text-on-surface-variant">
          <summary className="cursor-pointer font-medium text-on-surface">Detalhe técnico (opcional)</summary>
          <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-surface-container/60 p-3 border border-outline-variant/15">
            {errorDetail}
          </p>
        </details>
      ) : null}
    </div>
  );
}
