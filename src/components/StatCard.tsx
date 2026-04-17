import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  color?: string;
}

const StatCard = ({ label, value, unit, icon: Icon, color = "text-primary" }: StatCardProps) => (
  <div className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-3d shadow-3d-hover">
    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent ${color} shadow-3d-sm`}>
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </div>
    <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>
    <p className="stat-number text-3xl leading-none">
      {value}
      {unit && <span className="ml-1 text-sm font-light text-muted-foreground">{unit}</span>}
    </p>
  </div>
);

export default StatCard;
