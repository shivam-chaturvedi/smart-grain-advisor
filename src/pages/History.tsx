import { useCallback, useEffect, useState } from "react";
import { History as HistoryIcon, Thermometer, Droplets, Wind, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import BackendUnavailableBanner from "@/components/BackendUnavailableBanner";
import { BackendUnavailableError, getSensorHistory, type SensorHistoryEntry } from "@/lib/api";

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
  const [backendDown, setBackendDown] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const json = await getSensorHistory(200);
      setData(json);
      setBackendDown(false);
    } catch (e) {
      if (e instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error(e instanceof Error ? e.message : "Failed to load history");
      }
      setData([]);
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
    <div className="min-h-screen bg-background grain-texture">
      <Navbar />
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary" style={{ fontWeight: 500 }}>Archive</p>
            <h1 className="flex items-center gap-2.5 sm:gap-3 text-2xl sm:text-4xl md:text-5xl tracking-tight text-foreground" style={{ fontWeight: 300 }}>
              <span className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-3d">
                <HistoryIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              </span>
              Sensor <span style={{ fontWeight: 500 }}>History</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
              Previous sensor readings, manual inputs and risk assessments
            </p>
          </div>
          <button onClick={fetchHistory} disabled={loading} className="btn-3d btn-3d-secondary text-xs sm:text-sm disabled:opacity-60 self-start sm:self-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>

        {backendDown ? <BackendUnavailableBanner className="mb-6" /> : null}

        {/* Summary Cards */}
        {!backendDown && stats && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard icon={Thermometer} label="Avg Temp" value={`${stats.avgTemp}°C`} />
            <SummaryCard icon={Droplets} label="Avg Humidity" value={`${stats.avgHum}%`} />
            <SummaryCard icon={Wind} label="Avg Gas (PPM)" value={`${stats.avgCo2} PPM`} />
            <SummaryCard icon={AlertTriangle} label="High Risk Events" value={String(stats.highRisk)} accent />
          </div>
        )}

        {/* Table */}
        {backendDown ? null : loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center card-shadow">
            <p className="text-sm text-muted-foreground">No history data available yet.</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="grid gap-3 sm:hidden">
              {data.map((entry) => (
                <div key={entry.id} className="rounded-xl border bg-card p-4 shadow-3d-sm">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] text-muted-foreground truncate">{entry.timestamp}</span>
                    <span className={`shrink-0 inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${riskColor(entry.risk_level)}`}>
                      {entry.risk_level}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <MobileMini label="Temp" value={`${entry.temperature.toFixed(1)}°C`} />
                    <MobileMini label="Humidity" value={`${entry.humidity.toFixed(1)}%`} />
                    <MobileMini label="Gas" value={`${Number(entry.gas_ppm ?? entry.co2).toFixed(0)}`} />
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>Qty: <span className="text-foreground tabular-nums">{entry.quantity}</span></span>
                    <span>Score: <span className="text-foreground tabular-nums">{entry.risk_score.toFixed(1)}</span></span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${entry.source === "sensor" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                      {entry.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-hidden rounded-lg border bg-card card-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Device</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Temp (°C)</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Humidity (%)</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Gas (PPM)</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Gas Raw</th>
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
                        <td className="px-4 py-2.5 font-mono text-xs text-foreground whitespace-nowrap">{entry.timestamp}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{entry.device_id ?? "—"}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.temperature.toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{entry.humidity.toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-foreground">{Number(entry.gas_ppm ?? entry.co2).toFixed(0)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{entry.gas_raw ?? "—"}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value, accent }: { icon: typeof Thermometer; label: string; value: string; accent?: boolean }) => (
  <div className="rounded-xl border bg-card p-5 shadow-3d shadow-3d-hover">
    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg shadow-3d-sm ${accent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </div>
    <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>
    <p className={`stat-number text-2xl ${accent ? "!bg-none text-destructive" : ""}`}>{value}</p>
  </div>
);

export default History;
