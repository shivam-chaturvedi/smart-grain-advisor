interface RiskMeterProps {
  level: string;
  score: number;
  lastUpdated?: string;
}

const palette: Record<string, { bar: string; chip: string; glow: string }> = {
  LOW: { bar: "from-success to-success/70", chip: "bg-success/15 text-success border-success/30", glow: "shadow-[0_0_20px_-4px_hsl(var(--success)/0.4)]" },
  MODERATE: { bar: "from-warning to-warning/70", chip: "bg-warning/15 text-warning border-warning/30", glow: "shadow-[0_0_20px_-4px_hsl(var(--warning)/0.4)]" },
  HIGH: { bar: "from-destructive/80 to-destructive/60", chip: "bg-destructive/15 text-destructive border-destructive/30", glow: "shadow-[0_0_20px_-4px_hsl(var(--destructive)/0.4)]" },
  CRITICAL: { bar: "from-destructive to-destructive/80", chip: "bg-destructive/20 text-destructive border-destructive/40", glow: "shadow-[0_0_24px_-4px_hsl(var(--destructive)/0.5)]" },
};

const RiskMeter = ({ level, score, lastUpdated }: RiskMeterProps) => {
  const pct = Math.min(score, 100);
  const upper = level?.toUpperCase() ?? "LOW";
  const p = palette[upper] ?? palette.LOW;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>Risk Level</span>
        <span className={`rounded-md border px-2.5 py-1 text-xs ${p.chip} ${p.glow}`} style={{ fontWeight: 600 }}>
          {upper}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted shadow-[inset_0_2px_4px_hsl(var(--foreground)/0.1)]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${p.bar} transition-all duration-700`}
          style={{ width: `${pct}%`, boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.4)" }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="tabular-nums">Score: <span className="text-foreground" style={{ fontWeight: 500 }}>{score}/100</span></span>
        {lastUpdated && <span>Updated: {lastUpdated}</span>}
      </div>
    </div>
  );
};

export default RiskMeter;
