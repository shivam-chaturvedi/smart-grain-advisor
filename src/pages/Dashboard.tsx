import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { mockDashboardData, mockPriceForecast } from "@/lib/mockData";
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
import {
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
        result = await getCurrentStatus();
      }
      setData(result);

      const fc = await getPriceForecast();
      setForecast(fc);
    } catch {
      toast.error("Backend unavailable — showing demo data");
      setData(mockDashboardData);
      setForecast(mockPriceForecast);
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
    await fetchData();
    toast.success("Data refreshed");
  };

  const handleManualSubmit = async (sensor: SensorData) => {
    setLoading(true);
    try {
      const result = await submitManualInput(sensor);
      setData(result);
      const fc = await getPriceForecast();
      setForecast(fc);
      toast.success("Analysis updated");
    } catch {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetData();
      toast.info("Data reset");
      await fetchData();
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Wheat Storage Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time monitoring and AI recommendations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
              <Edit3 className="mr-1.5 h-3.5 w-3.5" />
              Manual Input
            </Button>
          </div>
        </div>

        {loading && !data ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Current Conditions */}
              <Section title="Current Conditions" icon={Thermometer}>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Temperature" value={data.temperature?.toFixed(1)} unit="°C" icon={Thermometer} />
                  <StatCard label="Humidity" value={data.humidity?.toFixed(1)} unit="%" icon={Droplets} color="text-secondary" />
                  <StatCard label="CO₂" value={data.co2?.toFixed(0)} unit="PPM" icon={Wind} color="text-warning" />
                </div>
                <div className="mt-4">
                  <RiskMeter level={data.risk_level} score={data.risk_score} lastUpdated={data.last_updated} />
                </div>
              </Section>

              {/* Confidence */}
              <Section title="Analysis Confidence" icon={BarChart3}>
                <ConfidenceCircle confidence={data.confidence} flags={data.confidence_flags} />
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

              {/* Detailed Report */}
              {data.detailed_report && (
                <Section title="Detailed Report" icon={FileText}>
                  <div className="max-h-56 overflow-y-auto rounded-md border bg-accent/30 p-3 font-mono text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">
                    {data.detailed_report}
                  </div>
                </Section>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <ManualInputModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleManualSubmit} />
    </div>
  );
};

/* Helpers */
const Section = ({ title, icon: Icon, children }: { title: string; icon: typeof Thermometer; children: React.ReactNode }) => (
  <div className="rounded-lg border bg-card p-5 card-shadow">
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
    {children}
  </div>
);

const Mini = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border bg-accent/30 p-3 text-center">
    <p className="text-[10px] text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

export default Dashboard;
