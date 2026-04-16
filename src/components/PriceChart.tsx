import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

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
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={forecast} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          {bestDay != null && bestPrice != null && (
            <ReferenceDot x={bestDay} y={bestPrice} r={6} fill="hsl(var(--success))" stroke="white" strokeWidth={2} />
          )}
        </LineChart>
      </ResponsiveContainer>
      {bestDay != null && (
        <div className="rounded-md border bg-accent/50 p-3 text-sm text-foreground/80">
          <strong>Best selling price</strong> expected on <strong>Day {bestDay}</strong> at{" "}
          <strong>₹{bestPrice?.toLocaleString()}/quintal</strong>. Market trend is{" "}
          <strong>{trend ?? "stable"}</strong>.
        </div>
      )}
    </div>
  );
};

export default PriceChart;
