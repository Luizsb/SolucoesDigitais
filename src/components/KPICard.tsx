type KPICardProps = {
  label: string;
  value: string;
  colorClass?: string;
  showPulse?: boolean;
};

export function KPICard({ label, value, colorClass, showPulse }: KPICardProps) {
  return (
    <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/10 shadow-sm">
      <p
        className={`font-label text-xs uppercase tracking-wider mb-1 ${colorClass || 'text-on-surface-variant'}`}
      >
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-bold text-on-surface">{value}</p>
        {showPulse && (
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        )}
      </div>
    </div>
  );
}
