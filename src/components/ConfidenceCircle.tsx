import { CheckCircle, AlertTriangle } from "lucide-react";

interface ConfidenceCircleProps {
  confidence: number;
  flags?: { ai_model: boolean; valid_data: boolean; extreme_values: boolean };
}

const ConfidenceCircle = ({ confidence, flags }: ConfidenceCircleProps) => {
  const pct = Math.round(confidence);
  const r = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-40 w-40">
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-card to-accent shadow-[inset_0_4px_12px_hsl(var(--foreground)/0.1),0_8px_24px_-6px_hsl(var(--primary)/0.3)]" />
        <svg className="relative h-full w-full -rotate-90" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke="url(#confGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
            style={{ filter: "drop-shadow(0 2px 6px hsl(var(--primary)/0.4))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="stat-number text-4xl">{pct}<span className="text-2xl text-muted-foreground">%</span></span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">Confidence</span>
        </div>
      </div>
      {flags && (
        <div className="flex flex-wrap justify-center gap-2">
          <Badge ok={flags.ai_model} label="AI Model" />
          <Badge ok={flags.valid_data} label="Valid Data" />
          <Badge ok={!flags.extreme_values} label="Normal Values" warn={flags.extreme_values} />
        </div>
      )}
    </div>
  );
};

const Badge = ({ ok, label, warn }: { ok: boolean; label: string; warn?: boolean }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs shadow-3d-sm ${
      warn
        ? "border-warning/30 bg-warning/10 text-warning"
        : ok
        ? "border-success/30 bg-success/10 text-success"
        : "border-border bg-muted text-muted-foreground"
    }`}
    style={{ fontWeight: 500 }}
  >
    {warn ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
    {label}
  </span>
);

export default ConfidenceCircle;
