import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Thermometer,
  Droplets,
  Wind,
  RefreshCw,
  Edit3,
  RotateCcw,
  Timer,
  TrendingUp,
  BarChart3,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import RiskMeter from "@/components/RiskMeter";
import ConfidenceCircle from "@/components/ConfidenceCircle";
import RecommendationPanel from "@/components/RecommendationPanel";
import PriceChart from "@/components/PriceChart";
import ManualInputModal from "@/components/ManualInputModal";
import BackendUnavailableBanner from "@/components/BackendUnavailableBanner";
import {
  BackendUnavailableError,
  getCurrentStatus,
  submitManualInput,
  getPriceForecast,
  resetData,
  type DashboardData,
  type PriceForecast,
  type SensorData,
} from "@/lib/api";

const REFRESH_MS = 30_000;

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [forecast, setForecast] = useState<PriceForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [backendDown, setBackendDown] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const fetchData = useCallback(async () => {
    try {
      const temp = searchParams.get("temp");
      const hum = searchParams.get("hum");
      const co2 = searchParams.get("co2");
      const qty = searchParams.get("qty");

      let result: DashboardData;
      if (temp && hum && co2 && qty) {
        result = await submitManualInput({
          temperature: Number(temp),
          humidity: Number(hum),
          co2: Number(co2),
          quantity: Number(qty),
        });
      } else {
        const status = await getCurrentStatus();
        if (!status) {
          setData(null);
          setForecast(await getPriceForecast());
          setBackendDown(false);
          return true;
        }
        result = status;
      }
      setData(result);

      const fc = await getPriceForecast();
      setForecast(fc);
      setBackendDown(false);
      return true;
    } catch (e) {
      if (e instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error(e instanceof Error ? e.message : "Failed to load dashboard data");
      }
      setData(null);
      setForecast(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  const handleRefresh = async () => {
    setLoading(true);
    const ok = await fetchData();
    if (ok) toast.success("Data refreshed");
  };

  const handleManualSubmit = async (sensor: SensorData) => {
    setLoading(true);
    try {
      if (
        !Number.isFinite(sensor.temperature) ||
        !Number.isFinite(sensor.humidity) ||
        !Number.isFinite(sensor.co2) ||
        !Number.isFinite(sensor.quantity) ||
        (sensor.quantity ?? 0) <= 0
      ) {
        throw new Error("Please enter valid numeric values (quantity must be > 0).");
      }
      const result = await submitManualInput(sensor);
      setData(result);
      const fc = await getPriceForecast();
      setForecast(fc);
      setBackendDown(false);
      toast.success("Analysis updated");
    } catch (e) {
      if (e instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error(e instanceof Error ? e.message : "Submission failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetData();
      toast.info("Data reset");
      const ok = await fetchData();
      if (ok) setBackendDown(false);
    } catch (e) {
      if (e instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error("Reset failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background grain-texture">
      <Navbar />

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary" style={{ fontWeight: 500 }}>Live Monitoring</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground" style={{ fontWeight: 300 }}>
              Wheat Storage <span style={{ fontWeight: 500 }}>Dashboard</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
              Real-time monitoring and AI-powered selling recommendations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleRefresh} disabled={loading} className="btn-3d btn-3d-secondary text-xs sm:text-sm disabled:opacity-60 flex-1 sm:flex-none min-w-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </button>
            <button onClick={() => setModalOpen(true)} className="btn-3d text-xs sm:text-sm flex-1 sm:flex-none min-w-0">
              <Edit3 className="h-4 w-4" />
              Manual Input
            </button>
          </div>
        </div>

        {backendDown ? <BackendUnavailableBanner className="mb-6" /> : null}

        {backendDown ? null : loading && !data ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Current Conditions */}
              <Section title="Current Conditions" icon={Thermometer}>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <StatCard label="Temperature" value={data.temperature?.toFixed(1)} unit="°C" icon={Thermometer} />
                  <StatCard label="Humidity" value={data.humidity?.toFixed(1)} unit="%" icon={Droplets} color="text-secondary" />
                  <StatCard label="Gas" value={data.co2?.toFixed(0)} unit="PPM" icon={Wind} color="text-warning" />
                </div>
                <div className="mt-4">
                  <RiskMeter level={data.risk_level} score={data.risk_score} lastUpdated={data.last_updated} />
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>
                    Risk Level summarizes spoilage risk from current readings and predicted safe storage days. Higher score means higher risk.
                  </p>
                </div>
              </Section>

              {/* Confidence */}
              <Section title="Analysis Confidence" icon={BarChart3}>
                <ConfidenceCircle confidence={data.confidence} flags={data.confidence_flags} />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>
                  Confidence is a 0–100 score showing how reliable the analysis is based on sensor validity, extreme-value checks,
                  and whether the ML models are loaded. Flags indicate: AI Model (models loaded), Valid Data (readings in range),
                  Normal Values (no extreme conditions).
                </p>
              </Section>

              {/* Storage Status */}
              <Section title="Storage Status" icon={Timer}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Safe Storage Days</span>
                  <span className="font-semibold text-foreground">{data.safe_storage_days?.toFixed(1)} days</span>
                </div>
                <div className="h-2 overflow-hidden rounded-sm bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${Math.min((data.safe_storage_days / 60) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>
                  Safe Storage Days is the estimated remaining time before quality becomes unsafe under current conditions.
                </p>
                {data.recommendations?.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {data.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleRefresh}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Update Analysis
                </Button>
                <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                  <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                  Enter Values
                </Button>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset Data
                </Button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* Recommendation */}
              {data.recommendation && (
                <RecommendationPanel
                  action={data.recommendation.action}
                  reason={data.recommendation.reason}
                  recommendedDay={data.recommendation.recommended_day}
                  expectedPrice={data.recommendation.expected_price}
                  expectedTotalValue={data.recommendation.expected_total_value}
                />
              )}

              {/* Price Forecast */}
              <Section title="Price Forecast (30 Days)" icon={TrendingUp}>
                <PriceChart
                  forecast={forecast?.forecast ?? []}
                  bestDay={forecast?.best_day}
                  bestPrice={forecast?.best_price}
                  trend={forecast?.trend}
                />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>
                  Forecast shows predicted market prices for the next 30 days. “Best Day” is the highest expected price day.
                </p>
              </Section>

              {/* Market Analysis */}
              {data.market_analysis && (
                <Section title="Market Analysis" icon={BarChart3}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <Mini label="Trend" value={data.market_analysis.trend} />
                    <Mini label="Volatility" value={`${data.market_analysis.volatility?.toFixed(1)}%`} />
                    <Mini label="Max Price" value={`₹${data.market_analysis.max_price?.toLocaleString()}`} />
                    <Mini label="Avg Price" value={`₹${data.market_analysis.avg_price?.toLocaleString()}`} />
                    <Mini label="Min Price" value={`₹${data.market_analysis.min_price?.toLocaleString()}`} />
                  </div>
                </Section>
              )}
            </div>
          </div>
        ) : null}

        {/* Full-width Detailed Report */}
        {data?.detailed_report ? (
          <div className="mt-6">
            <Section title="Detailed Report" icon={FileText}>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 min-w-0">
                  <div className="max-h-[24rem] sm:max-h-[32rem] overflow-y-auto overflow-x-auto rounded-lg border bg-accent/30 p-3 sm:p-4 font-mono text-[10px] sm:text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap break-all sm:break-words">
                    {data.detailed_report}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4 shadow-3d-sm min-w-0">
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>
                    Key Insights
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
                    <li className="break-words">
                      <span className="text-muted-foreground">Action:</span>{" "}
                      <span className="font-semibold">{data.recommendation?.action ?? "—"}</span>
                    </li>
                    <li className="text-muted-foreground break-words">
                      {data.recommendation?.reason ?? "No recommendation reason available."}
                    </li>
                    <li className="break-words">
                      <span className="text-muted-foreground">Risk:</span>{" "}
                      <span className="font-semibold">{data.risk_level ?? "—"}</span>{" "}
                      <span className="text-muted-foreground">({data.risk_score?.toFixed(1) ?? "—"}/100)</span>
                    </li>
                    <li className="break-words">
                      <span className="text-muted-foreground">Safe Storage:</span>{" "}
                      <span className="font-semibold">{data.safe_storage_days?.toFixed(1) ?? "—"} days</span>
                    </li>
                    {forecast ? (
                      <li className="break-words">
                        <span className="text-muted-foreground">Best Sell Day:</span>{" "}
                        <span className="font-semibold">Day {forecast.best_day}</span>{" "}
                        <span className="text-muted-foreground">at ₹{forecast.best_price?.toLocaleString()}</span>
                      </li>
                    ) : null}
                    {data.market_analysis ? (
                      <li className="break-words">
                        <span className="text-muted-foreground">Market:</span>{" "}
                        <span className="font-semibold">{data.market_analysis.trend}</span>{" "}
                        <span className="text-muted-foreground">({data.market_analysis.volatility?.toFixed(1)}% vol)</span>
                      </li>
                    ) : null}
                    {data.recommendations?.length ? (
                      <li className="break-words">
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        <span className="text-foreground/90">{data.recommendations.slice(0, 2).join(" • ")}</span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-8 sm:p-12 text-center card-shadow">
            <p className="text-sm text-muted-foreground">No sensor data yet. Use “Manual Input” or send readings to `POST /api/sensor-data`.</p>
          </div>
        )}
      </div>
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>
                    Key Insights
                  </p>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    <li>
                      <span className="text-muted-foreground">Action:</span>{" "}
                      <span className="font-semibold">{data.recommendation?.action ?? "—"}</span>
                    </li>
                    <li className="text-muted-foreground">
                      {data.recommendation?.reason ?? "No recommendation reason available."}
                    </li>
                    <li>
                      <span className="text-muted-foreground">Risk:</span>{" "}
                      <span className="font-semibold">{data.risk_level ?? "—"}</span>{" "}
                      <span className="text-muted-foreground">({data.risk_score?.toFixed(1) ?? "—"}/100)</span>
                    </li>
                    <li>
                      <span className="text-muted-foreground">Safe Storage:</span>{" "}
                      <span className="font-semibold">{data.safe_storage_days?.toFixed(1) ?? "—"} days</span>
                    </li>
                    {forecast ? (
                      <li>
                        <span className="text-muted-foreground">Best Sell Day:</span>{" "}
                        <span className="font-semibold">Day {forecast.best_day}</span>{" "}
                        <span className="text-muted-foreground">at ₹{forecast.best_price?.toLocaleString()}</span>
                      </li>
                    ) : null}
                    {data.market_analysis ? (
                      <li>
                        <span className="text-muted-foreground">Market:</span>{" "}
                        <span className="font-semibold">{data.market_analysis.trend}</span>{" "}
                        <span className="text-muted-foreground">({data.market_analysis.volatility?.toFixed(1)}% vol)</span>
                      </li>
                    ) : null}
                    {data.recommendations?.length ? (
                      <li>
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        <span className="text-foreground/90">{data.recommendations.slice(0, 2).join(" • ")}</span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center card-shadow">
            <p className="text-sm text-muted-foreground">No sensor data yet. Use “Manual Input” or send readings to `POST /api/sensor-data`.</p>
          </div>
        )}
      </div>

      <ManualInputModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleManualSubmit} />
    </div>
  );
};

/* Helpers */
const Section = ({ title, icon: Icon, children }: { title: string; icon: typeof Thermometer; children: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-3d">
    <div className="mb-4 sm:mb-5 flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-3d-sm">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <h2 className="text-xs sm:text-sm uppercase tracking-wider text-foreground" style={{ fontWeight: 500 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Mini = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-card p-4 text-center shadow-3d-sm">
    <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>
    <p className="stat-number text-base">{value}</p>
  </div>
);

export default Dashboard;
