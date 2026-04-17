import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  forecast: { day: number; price: number }[];
  bestDay?: number;
  bestPrice?: number;
  trend?: string;
}

const PriceChart = ({ forecast, bestDay, bestPrice, trend }: Props) => {
  if (!forecast?.length) return <p className="text-sm text-muted-foreground">No forecast data available.</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-br from-card to-accent/30 p-3 shadow-[inset_0_2px_8px_hsl(var(--foreground)/0.06)]">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={forecast} margin={{ top: 10, right: 14, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="priceStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 400 }}
              stroke="hsl(var(--border))"
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 400 }}
              stroke="hsl(var(--border))"
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 400,
                boxShadow: "0 8px 24px -6px hsl(var(--foreground) / 0.15)",
              }}
              formatter={(v: number) => [`₹${v}/quintal`, "Price"]}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="url(#priceStroke)"
              strokeWidth={2.5}
              fill="url(#priceFill)"
              activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
            />
            {bestDay != null && bestPrice != null && (
              <ReferenceDot
                x={bestDay} y={bestPrice} r={8}
                fill="hsl(var(--success))" stroke="white" strokeWidth={3}
                style={{ filter: "drop-shadow(0 2px 6px hsl(var(--success)/0.5))" }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {bestDay != null && (
        <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-4 shadow-3d-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
            <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div className="text-sm leading-relaxed text-foreground/85" style={{ fontWeight: 300 }}>
            Best price expected on <span className="text-foreground" style={{ fontWeight: 500 }}>Day {bestDay}</span> at{" "}
            <span className="text-foreground tabular-nums" style={{ fontWeight: 500 }}>₹{bestPrice?.toLocaleString()}/quintal</span>.{" "}
            Market trend is <span className="text-foreground" style={{ fontWeight: 500 }}>{trend ?? "stable"}</span>.
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
