import { CheckCircle, AlertTriangle } from "lucide-react";

interface ConfidenceCircleProps {
  confidence: number;
  flags?: {
    ai_model: boolean;
    valid_data: boolean;
    extreme_values: boolean;
  };
}

const ConfidenceCircle = ({ confidence, flags }: ConfidenceCircleProps) => {
  const pct = Math.round(confidence);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-foreground">{pct}%</span>
          <span className="text-[10px] text-muted-foreground">Confidence</span>
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
    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
      warn ? "bg-warning/10 text-warning" : ok ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
    }`}
  >
    {warn ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
    {label}
  </span>
);

export default ConfidenceCircle;
