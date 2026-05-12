import { CircleHelp } from 'lucide-react';
import { SOLUTION_STATUS_TOOLTIP } from '../lib/solutionStatusFormCopy';

/**
 * Ícone (?) ao lado de « Status »: resumo dos três estados com cor por nome (bloco único com separadores).
 */
export function StatusFieldLegend() {
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-on-surface-variant/80 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container"
        aria-label="Significado de cada status"
      >
        <CircleHelp size={14} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-5 z-30 hidden w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-outline-variant/25 bg-surface-container p-2.5 text-[11px] font-normal normal-case leading-snug tracking-normal text-left text-on-surface shadow-lg group-hover:block group-focus-within:block md:w-[22rem]"
      >
        <span className="inline">
          {SOLUTION_STATUS_TOOLTIP.map((row, i) => (
            <span key={row.key} className="inline">
              {i > 0 ? <span className="text-on-surface-variant/50"> · </span> : null}
              <strong className={`font-semibold ${row.emphasisClass}`}>{row.short}</strong>
              <span className="text-on-surface-variant"> {row.body}</span>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
