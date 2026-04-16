import { TrendingUp, Calendar, IndianRupee } from "lucide-react";

interface Props {
  action: string;
  reason: string;
  recommendedDay: number;
  expectedPrice: number;
  expectedTotalValue: number;
}

const actionStyle: Record<string, string> = {
  SELL: "border-destructive/30 bg-destructive/5",
  HOLD: "border-primary/30 bg-primary/5",
};

const actionBadge: Record<string, string> = {
  SELL: "bg-destructive text-destructive-foreground",
  HOLD: "bg-primary text-primary-foreground",
};

const RecommendationPanel = ({ action, reason, recommendedDay, expectedPrice, expectedTotalValue }: Props) => {
  const upper = action?.toUpperCase() ?? "HOLD";
  const style = actionStyle[upper] ?? "border-warning/30 bg-warning/5";
  const badge = actionBadge[upper] ?? "bg-warning text-warning-foreground";

  return (
    <div className={`rounded-lg border-2 p-5 ${style}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">AI Recommendation</h3>
        <span className={`rounded px-3 py-1 text-sm font-bold ${badge}`}>{upper}</span>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-foreground/80">{reason}</p>
      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={Calendar} label="Best Day" value={`Day ${recommendedDay}`} />
        <MiniStat icon={IndianRupee} label="Expected Price" value={`₹${expectedPrice?.toLocaleString()}`} />
        <MiniStat icon={TrendingUp} label="Total Value" value={`₹${expectedTotalValue?.toLocaleString()}`} />
      </div>
    </div>
  );
};

const MiniStat = ({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) => (
  <div className="rounded-md bg-card p-3 text-center card-shadow">
    <Icon className="mx-auto mb-1 h-4 w-4 text-primary" />
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

export default RecommendationPanel;
