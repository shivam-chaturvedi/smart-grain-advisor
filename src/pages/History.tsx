import { useCallback, useEffect, useState } from "react";
import { History as HistoryIcon, Thermometer, Droplets, Wind, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { mockSensorHistory } from "@/lib/mockData";

export interface SensorHistoryEntry {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  co2: number;
  quantity: number;
  risk_level: string;
  risk_score: number;
  source: "sensor" | "manual";
}

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const riskColor = (level: string) => {
  switch (level.toUpperCase()) {
    case "LOW": return "bg-success/15 text-success";
    case "MODERATE": return "bg-warning/15 text-warning";
    case "HIGH": return "bg-destructive/15 text-destructive";
    case "CRITICAL": return "bg-destructive/20 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
};

const History = () => {
  const [data, setData] = useState<SensorHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/sensor-history`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {
      toast.info("Using demo history data");
      setData(mockSensorHistory);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const stats = data.length > 0 ? {
    avgTemp: (data.reduce((s, d) => s + d.temperature, 0) / data.length).toFixed(1),
    avgHum: (data.reduce((s, d) => s + d.humidity, 0) / data.length).toFixed(1),
    avgCo2: Math.round(data.reduce((s, d) => s + d.co2, 0) / data.length),
    highRisk: data.filter(d => ["HIGH", "CRITICAL"].includes(d.risk_level.toUpperCase())).length,
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <HistoryIcon className="h-5 w-5 text-primary" />
              Sensor History
            </h1>
            <p className="text-sm text-muted-foreground">Previous sensor readings and risk assessments</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
            {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        {stats && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard icon={Thermometer} label="Avg Temp" value={`${stats.avgTemp}°C`} />
            <SummaryCard icon={Droplets} label="Avg Humidity" value={`${stats.avgHum}%`} />
            <SummaryCard icon={Wind} label="Avg CO₂" value={`${stats.avgCo2} PPM`} />
            <SummaryCard icon={AlertTriangle} label="High Risk Events" value={String(stats.highRisk)} accent />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center card-shadow">
            <p className="text-sm text-muted-foreground">No history data available yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-card card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Temp (°C)</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Humidity (%)</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">CO₂ (PPM)</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Qty (q)</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Risk</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, i) => (
                    <tr key={entry.id} className={`border-b last:border-0 transition-colors hover:bg-muted/20 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{entry.id}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground">{entry.timestamp}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.temperature.toFixed(1)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.humidity.toFixed(1)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.co2}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.quantity}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${riskColor(entry.risk_level)}`}>
                          {entry.risk_level}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.risk_score.toFixed(1)}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${entry.source === "sensor" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                          {entry.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value, accent }: { icon: typeof Thermometer; label: string; value: string; accent?: boolean }) => (
  <div className="rounded-lg border bg-card p-4 card-shadow">
    <div className="mb-1 flex items-center gap-1.5">
      <Icon className={`h-3.5 w-3.5 ${accent ? "text-destructive" : "text-primary"}`} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
    <p className={`text-lg font-semibold ${accent ? "text-destructive" : "text-foreground"}`}>{value}</p>
  </div>
);

export default History;
