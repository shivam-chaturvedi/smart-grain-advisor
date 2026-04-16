import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  color?: string;
}

const StatCard = ({ label, value, unit, icon: Icon, color = "text-primary" }: StatCardProps) => (
  <div className="flex items-center gap-3 rounded-lg border bg-card p-4 card-shadow">
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold leading-tight text-foreground">
        {value}
        {unit && <span className="ml-0.5 text-xs font-normal text-muted-foreground">{unit}</span>}
      </p>
    </div>
  </div>
);

export default StatCard;
