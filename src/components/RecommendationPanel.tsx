import { TrendingUp, Calendar, IndianRupee, Sparkles } from "lucide-react";

interface Props {
  action: string;
  reason: string;
  recommendedDay: number;
  expectedPrice: number;
  expectedTotalValue: number;
}

const styles: Record<string, { bg: string; chip: string; glow: string }> = {
  SELL: {
    bg: "bg-gradient-to-br from-destructive/10 via-card to-card border-destructive/30",
    chip: "bg-destructive text-destructive-foreground",
    glow: "shadow-[0_8px_32px_-4px_hsl(var(--destructive)/0.35)]",
  },
  HOLD: {
    bg: "bg-gradient-to-br from-primary/10 via-card to-card border-primary/30",
    chip: "bg-primary text-primary-foreground",
    glow: "shadow-[0_8px_32px_-4px_hsl(var(--primary)/0.35)]",
  },
};

const RecommendationPanel = ({ action, reason, recommendedDay, expectedPrice, expectedTotalValue }: Props) => {
  const upper = action?.toUpperCase() ?? "HOLD";
  const s = styles[upper] ?? {
    bg: "bg-gradient-to-br from-warning/10 via-card to-card border-warning/30",
    chip: "bg-warning text-warning-foreground",
    glow: "shadow-[0_8px_32px_-4px_hsl(var(--warning)/0.35)]",
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 p-6 ${s.bg} ${s.glow}`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-current/5 to-transparent opacity-30" />
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontWeight: 500 }}>AI Recommendation</h3>
        </div>
        <span className={`rounded-md px-4 py-1.5 text-sm tracking-wider shadow-3d-sm ${s.chip}`} style={{ fontWeight: 600 }}>
          {upper}
        </span>
      </div>

      <p className="mb-6 text-base leading-relaxed text-foreground/85" style={{ fontWeight: 300 }}>
        {reason}
      </p>

      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={Calendar} label="Best Day" value={`Day ${recommendedDay}`} />
        <MiniStat icon={IndianRupee} label="Expected Price" value={`₹${expectedPrice?.toLocaleString()}`} />
        <MiniStat icon={TrendingUp} label="Total Value" value={`₹${expectedTotalValue?.toLocaleString()}`} />
      </div>
    </div>
  );
};

const MiniStat = ({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) => (
  <div className="rounded-lg border bg-card p-4 text-center shadow-3d-sm shadow-3d-hover">
    <Icon className="mx-auto mb-2 h-4 w-4 text-primary" strokeWidth={1.5} />
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>
    <p className="stat-number mt-1 text-base leading-tight">{value}</p>
  </div>
);

export default RecommendationPanel;
