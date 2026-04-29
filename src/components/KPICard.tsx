type KPICardProps = {
  label: string;
  value: string;
  colorClass?: string;
  showPulse?: boolean;
};

export function KPICard({ label, value, colorClass, showPulse }: KPICardProps) {
  return (
    <div className="bg-surface-container p-3 sm:p-4 rounded-xl border border-outline-variant/10 shadow-sm min-w-0">
      <p
        className={`font-label text-[11px] sm:text-xs uppercase tracking-wide leading-tight mb-1 break-words ${
          colorClass || 'text-on-surface-variant'
        }`}
      >
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-2xl sm:text-3xl font-bold text-on-surface leading-none">{value}</p>
        {showPulse && (
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
        )}
      </div>
    </div>
  );
}
