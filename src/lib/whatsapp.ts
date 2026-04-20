import { type AppNotification, type DashboardData } from "@/lib/api";
import { toast } from "sonner";

const ACCOUNT_SID = "AC765e1f54ca2da7372abd41b2e1eefb4d";
const AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN as string;
const TO_NUMBERS: string[] = (import.meta.env.VITE_TWILIO_TO_NUMBERS as string)
  .split(",")
  .map((n) => n.trim())
  .filter(Boolean);

const TYPE_LABEL: Record<AppNotification["type"], string> = {
  sell: "SELL ALERT",
  ai_change: "AI UPDATE",
  sensor: "SENSOR",
  info: "INFO",
};

export async function sendWhatsAppAlerts(
  alerts: AppNotification[],
  options: {
    silent?: boolean;
    aiRec?: DashboardData["recommendation"] | null;
  } = {},
): Promise<void> {
  const { silent = false, aiRec } = options;

  if (alerts.length === 0) {
    if (!silent) toast.info("No unread alerts to send.");
    return;
  }

  const lines = alerts.map((n) => `[${TYPE_LABEL[n.type]}] ${n.title}\n${n.message}`);

  const hasAiAlert = alerts.some((n) => n.type === "sell" || n.type === "ai_change");
  const aiBlock =
    aiRec && hasAiAlert
      ? `\n📊 *Current AI Recommendation*\n` +
        `Action: *${aiRec.action}*\n` +
        `Reason: ${aiRec.reason}\n` +
        `Best Day: Day ${aiRec.recommended_day}\n` +
        `Expected Price: ₹${aiRec.expected_price?.toLocaleString()}\n` +
        `Total Value: ₹${aiRec.expected_total_value?.toLocaleString()}\n`
      : "";

  const body =
    `🌾 *GrainOS — New Alert${alerts.length > 1 ? "s" : ""} (${alerts.length})*\n` +
    `─────────────────────\n` +
    lines.join("\n─────────────────────\n") +
    `\n─────────────────────\n` +
    aiBlock +
    `Open the app to take action.`;

  const credentials = btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);

  const results = await Promise.allSettled(
    TO_NUMBERS.map((toNumber) => {
      const params = new URLSearchParams({
        From: "whatsapp:+14155238886",
        To: `whatsapp:${toNumber}`,
        Body: body,
      });
      return fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      ).then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(`${toNumber}: ${err.message || "Failed"}`);
        }
        return toNumber;
      });
    }),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason?.message ?? "Unknown error");

  if (succeeded > 0) {
    toast.success(
      `WhatsApp alert sent to ${succeeded}/${TO_NUMBERS.length} number${succeeded > 1 ? "s" : ""} — ${alerts.length} notification${alerts.length > 1 ? "s" : ""} delivered!`,
    );
  }
  if (failed.length > 0) {
    toast.error(
      `WhatsApp failed for ${failed.length} number${failed.length > 1 ? "s" : ""}: ${failed.join("; ")}`,
    );
  }
}
