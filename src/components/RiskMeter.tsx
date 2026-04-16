interface RiskMeterProps {
  level: string;
  score: number;
  lastUpdated?: string;
}

const riskColors: Record<string, string> = {
  LOW: "bg-success text-success-foreground",
  MODERATE: "bg-warning text-warning-foreground",
  HIGH: "bg-destructive/80 text-destructive-foreground",
  CRITICAL: "bg-destructive text-destructive-foreground",
};

const barColor: Record<string, string> = {
  LOW: "bg-success",
  MODERATE: "bg-warning",
  HIGH: "bg-destructive/80",
  CRITICAL: "bg-destructive",
};

const RiskMeter = ({ level, score, lastUpdated }: RiskMeterProps) => {
  const pct = Math.min(score, 100);
  const upper = level?.toUpperCase() ?? "LOW";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${riskColors[upper] ?? riskColors.LOW}`}>
          {upper}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-sm bg-muted">
        <div
          className={`h-full transition-all duration-700 ${barColor[upper] ?? barColor.LOW}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Risk Score: {score}/100</span>
        {lastUpdated && <span>Updated: {lastUpdated}</span>}
      </div>
    </div>
  );
};

export default RiskMeter;
