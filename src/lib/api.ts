const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export interface SensorData {
  temperature: number;
  humidity: number;
  co2: number;
  quantity?: number;
}

export interface DashboardData {
  temperature: number;
  humidity: number;
  co2: number;
  quantity: number;
  risk_level: string;
  risk_score: number;
  safe_storage_days: number;
  confidence: number;
  recommendation: {
    action: string;
    reason: string;
    recommended_day: number;
    expected_price: number;
    expected_total_value: number;
  };
  market_analysis: {
    trend: string;
    volatility: number;
    max_price: number;
    avg_price: number;
    min_price: number;
  };
  recommendations: string[];
  detailed_report: string;
  last_updated: string;
  confidence_flags?: {
    ai_model: boolean;
    valid_data: boolean;
    extreme_values: boolean;
  };
}

export interface PriceForecast {
  forecast: { day: number; price: number }[];
  best_day: number;
  best_price: number;
  trend: string;
}

export async function getCurrentStatus(): Promise<DashboardData> {
  const res = await fetch(`${BASE}/api/current-status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

export async function submitManualInput(data: SensorData): Promise<DashboardData> {
  const res = await fetch(`${BASE}/api/manual-input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit data");
  return res.json();
}

export async function getPriceForecast(): Promise<PriceForecast> {
  const res = await fetch(`${BASE}/api/price-forecast`);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}

export async function resetData(): Promise<void> {
  const res = await fetch(`${BASE}/api/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset");
}
