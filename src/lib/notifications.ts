export type NotificationType = "sell" | "ai_change" | "sensor" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const KEY = "ssa_notifications";
const STATE_KEY = "ssa_last_state";

export function getNotifications(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addNotification(n: Omit<AppNotification, "id" | "timestamp" | "read">) {
  const list = getNotifications();
  const item: AppNotification = {
    ...n,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toLocaleString(),
    read: false,
  };
  const updated = [item, ...list].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notifications-updated"));
  return item;
}

export function markAllRead() {
  const list = getNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("notifications-updated"));
}

export function clearNotifications() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("notifications-updated"));
}

export function unreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

interface LastState {
  action?: string;
  temperature?: number;
  humidity?: number;
  co2?: number;
}

export function detectChanges(curr: {
  action?: string;
  temperature?: number;
  humidity?: number;
  co2?: number;
}) {
  let prev: LastState = {};
  try {
    prev = JSON.parse(localStorage.getItem(STATE_KEY) ?? "{}");
  } catch { /* ignore */ }

  const TH = { temperature: 5, humidity: 5, co2: 100 };

  if (curr.action && prev.action && curr.action !== prev.action) {
    addNotification({
      type: curr.action.toUpperCase() === "SELL" ? "sell" : "ai_change",
      title: `AI Recommendation changed → ${curr.action.toUpperCase()}`,
      message: `Previous: ${prev.action}. Review your dashboard for the updated reasoning.`,
    });
  }
  if (curr.action?.toUpperCase() === "SELL" && prev.action?.toUpperCase() !== "SELL") {
    addNotification({
      type: "sell",
      title: "🟢 Time to SELL",
      message: "Market conditions are optimal. Check expected price and total value.",
    });
  }
  (["temperature", "humidity", "co2"] as const).forEach((k) => {
    const a = prev[k]; const b = curr[k];
    if (a != null && b != null && Math.abs(b - a) >= TH[k]) {
      const dir = b > a ? "↑" : "↓";
      addNotification({
        type: "sensor",
        title: `${k.toUpperCase()} ${dir} by ${Math.abs(b - a).toFixed(1)}`,
        message: `Reading shifted from ${a.toFixed(1)} to ${b.toFixed(1)}.`,
      });
    }
  });

  localStorage.setItem(STATE_KEY, JSON.stringify(curr));
}

export function seedDemoNotifications() {
  if (getNotifications().length > 0) return;
  const seed: AppNotification[] = [
    { id: "1", type: "sell", title: "🟢 Time to SELL", message: "Market peak detected on Day 14 at ₹2,540/quintal.", timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleString(), read: false },
    { id: "2", type: "ai_change", title: "AI Recommendation updated → HOLD", message: "Confidence rose to 96%. Hold for 12 days.", timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleString(), read: false },
    { id: "3", type: "sensor", title: "Humidity ↑ by 6.2", message: "Reading shifted from 58.1 to 64.3. Consider dehumidification.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toLocaleString(), read: true },
    { id: "4", type: "info", title: "Weekly report ready", message: "30-day forecast updated with new market data.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toLocaleString(), read: true },
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
  window.dispatchEvent(new Event("notifications-updated"));
}
