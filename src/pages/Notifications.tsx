import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2, AlertTriangle, TrendingUp, Activity, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackendUnavailableBanner from "@/components/BackendUnavailableBanner";
import {
  type AppNotification,
  BackendUnavailableError,
  getNotifications,
  markAllNotificationsRead,
  clearAllNotifications,
} from "@/lib/api";
import { toast } from "sonner";

const typeMeta: Record<AppNotification["type"], { icon: typeof Bell; bg: string; color: string; label: string }> = {
  sell:      { icon: TrendingUp,   bg: "bg-success/15",     color: "text-success",     label: "Sell Alert" },
  ai_change: { icon: Activity,     bg: "bg-primary/15",     color: "text-primary",     label: "AI Update" },
  sensor:    { icon: AlertTriangle,bg: "bg-warning/15",     color: "text-warning",     label: "Sensor" },
  info:      { icon: Info,         bg: "bg-muted",          color: "text-muted-foreground", label: "Info" },
};

const Notifications = () => {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      try {
        setItems(await getNotifications(50));
        setBackendDown(false);
      } catch (e) {
        if (e instanceof BackendUnavailableError) {
          setBackendDown(true);
        } else {
          toast.error(e instanceof Error ? e.message : "Failed to load notifications");
        }
        setItems([]);
      }
    };
    refresh();
  }, []);

  const unread = items.filter((i) => !i.read).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems(await getNotifications(50));
      setBackendDown(false);
    } catch (e) {
      if (e instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error("Failed to mark notifications read");
      }
    }
  };

  const handleClear = async () => {
    try {
      await clearAllNotifications();
      setItems([]);
      setBackendDown(false);
    } catch (e) {
      if (e instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error("Failed to clear notifications");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background grain-texture">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-primary" style={{ fontWeight: 500 }}>Inbox</p>
            <h1 className="flex items-center gap-3 text-4xl tracking-tight text-foreground" style={{ fontWeight: 300 }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-3d">
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </span>
              Notifications
            </h1>
            <p className="mt-2 text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
              {unread > 0 ? `${unread} unread` : "All caught up"} · Alerts for SELL signals, AI updates and sensor changes
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleMarkAllRead} className="btn-3d btn-3d-secondary text-sm">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
            <button onClick={handleClear} className="btn-3d btn-3d-secondary text-sm">
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {backendDown ? <BackendUnavailableBanner className="mb-6" /> : null}

        {backendDown ? null : items.length === 0 ? (
          <div className="rounded-2xl border bg-card p-16 text-center shadow-3d">
            <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground" strokeWidth={1} />
            <p className="text-base text-foreground" style={{ fontWeight: 400 }}>No notifications yet</p>
            <p className="mt-1 text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
              You'll see alerts here when AI recommendations change or sensor values shift.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => {
              const meta = typeMeta[n.type];
              const I = meta.icon;
              return (
                <div
                  key={n.id}
                  className={`group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-3d shadow-3d-hover ${
                    !n.read ? "border-primary/30 bg-gradient-to-r from-primary/5 to-transparent" : ""
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.color} shadow-3d-sm`}>
                    <I className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-[10px] uppercase tracking-wider ${meta.color}`} style={{ fontWeight: 600 }}>
                        {meta.label}
                      </span>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />}
                    </div>
                    <h3 className="text-base text-foreground" style={{ fontWeight: 500 }}>{n.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>{n.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground/70">{n.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
