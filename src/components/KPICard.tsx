import { useEffect, useState } from 'react';
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';

type KPICardProps = {
  label: string;
  value: string;
  colorClass?: string;
  showPulse?: boolean;
  /** Atraso extra em segundos para escalar animações entre vários KPIs (0–3). */
  staggerIndex?: number;
};

function formatCount(n: number) {
  return String(Math.round(n)).padStart(2, '0');
}

export function KPICard({ label, value, colorClass, showPulse, staggerIndex = 0 }: KPICardProps) {
  const reduceMotion = useReducedMotion();
  const target = Number.parseInt(value, 10) || 0;
  const count = useMotionValue(0);
  const [text, setText] = useState(() => formatCount(count.get()));

  useMotionValueEvent(count, 'change', (latest) => {
    setText(formatCount(latest));
  });

  useEffect(() => {
    if (reduceMotion) {
      count.set(target);
      setText(formatCount(target));
      return;
    }
    const delay = 0.32 + Math.min(staggerIndex, 5) * 0.12;
    // Contagem legível após a planilha carregar: duração mínima ~2,4 s, sobe um pouco com o volume (teto ~4 s).
    const duration = Math.min(4, Math.max(2.4, 1.9 + target * 0.065));
    const controls = animate(count, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    });
    return () => controls.stop();
  }, [target, reduceMotion, count, staggerIndex]);

  return (
    <div className="bg-surface-container p-3 sm:p-4 rounded-xl border border-outline-variant/10 shadow-sm min-w-0 h-full min-h-[108px] flex flex-col justify-between">
      <p
        className={`font-label text-[11px] sm:text-xs uppercase tracking-wide leading-tight mb-1 whitespace-normal [overflow-wrap:anywhere] min-h-[30px] ${
          colorClass || 'text-on-surface-variant'
        }`}
      >
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-on-surface leading-none tabular-nums">{text}</span>
        {showPulse && (
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
        )}
      </div>
    </div>
  );
}
