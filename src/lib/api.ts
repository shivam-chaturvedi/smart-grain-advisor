const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050";

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

export interface NoDataResponse {
  status: "no_data";
  message: string;
}

export interface PriceForecast {
  forecast: { day: number; price: number }[];
  best_day: number;
  best_price: number;
  trend: string;
}

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

export async function getCurrentStatus(): Promise<DashboardData | null> {
  const res = await fetch(`${BASE}/api/current-status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  const json = await res.json();
  if (json && typeof json === "object" && "status" in json && (json as any).status === "no_data") return null;
  return json;
}

export async function submitManualInput(data: SensorData): Promise<DashboardData> {
  const wheatQuantity = data.quantity ?? 100;
  const res = await fetch(`${BASE}/api/manual-input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      temperature: data.temperature,
      humidity: data.humidity,
      co2: data.co2,
      wheat_quantity: wheatQuantity,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? err?.error ?? "Failed to submit data");
  }
  return res.json();
}

export async function getPriceForecast(): Promise<PriceForecast> {
  const res = await fetch(`${BASE}/api/price-forecast`);
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? err?.error ?? "Failed to fetch forecast");
  }
  return res.json();
}

export async function getSensorHistory(limit = 200): Promise<SensorHistoryEntry[]> {
  const res = await fetch(`${BASE}/api/sensor-history?limit=${encodeURIComponent(String(limit))}`);
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? err?.error ?? "Failed to fetch history");
  }
  return res.json();
}

export type NotificationType = "sell" | "ai_change" | "sensor" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export async function getNotifications(limit = 50): Promise<AppNotification[]> {
  const res = await fetch(`${BASE}/api/notifications?limit=${encodeURIComponent(String(limit))}`);
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? err?.error ?? "Failed to fetch notifications");
  }
  return res.json();
}

export async function getUnreadCount(): Promise<number> {
  const res = await fetch(`${BASE}/api/notifications/unread-count`);
  if (!res.ok) return 0;
  const json = await res.json();
  return Number(json.unread ?? 0);
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await fetch(`${BASE}/api/notifications/mark-all-read`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to mark all read");
}

export async function clearAllNotifications(): Promise<void> {
  const res = await fetch(`${BASE}/api/notifications/clear`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to clear notifications");
}

export interface SensorConfig {
  id: string;
  created_at: string;
  updated_at: string;
  device_id: string;
  sensor_name: string | null;
  wheat_quantity: number;
}

export async function getSensorConfig(deviceId: string): Promise<SensorConfig | null> {
  const res = await fetch(`${BASE}/api/sensors/${encodeURIComponent(deviceId)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? err?.error ?? "Failed to fetch sensor config");
  }
  return res.json();
}

export async function registerSensorConfig(input: {
  device_id: string;
  sensor_name?: string | null;
  wheat_quantity: number;
}): Promise<SensorConfig> {
  const res = await fetch(`${BASE}/api/sensors/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_id: input.device_id,
      sensor_name: input.sensor_name,
      wheat_quantity: input.wheat_quantity,
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message ?? json?.error ?? "Failed to save sensor config");
  return json.sensor;
}

export async function resetData(): Promise<void> {
  const res = await fetch(`${BASE}/api/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset");
}
