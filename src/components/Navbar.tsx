import { Link, useLocation } from "react-router-dom";
import { Wheat, Bell, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications, getCurrentStatus } from "@/lib/api";
import { sendWhatsAppAlerts } from "@/lib/whatsapp";

const POLL_MS = Number(import.meta.env.VITE_ALERT_POLL_MS) || 15_000;
const SEEN_KEY = "naysa_seen_notification_ids";

function loadSeen(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeen(ids: Set<string>) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

// true once the very first fetch has completed and seenIds is populated
let firstLoadDone = false;

const Navbar = () => {
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const [notifications, status] = await Promise.all([
          getNotifications(50),
          getCurrentStatus().catch(() => null),
        ]);
        if (!mounted) return;

        setCount(notifications.filter((n) => !n.read).length);

        const seen = loadSeen();

        if (!firstLoadDone) {
          // First successful fetch — record all existing IDs, send nothing
          notifications.forEach((n) => seen.add(n.id));
          saveSeen(seen);
          firstLoadDone = true;
          return;
        }

        // Detect brand-new IDs
        const brandNew = notifications.filter((n) => !seen.has(n.id));
        if (brandNew.length > 0) {
          notifications.forEach((n) => seen.add(n.id));
          saveSeen(seen);
          sendWhatsAppAlerts(brandNew, {
            silent: true,
            aiRec: status?.recommendation ?? null,
          });
        }
      } catch {
        if (mounted) setCount(0);
      }
    };

    poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/history", label: "History" },
    { to: "/conf", label: "Config" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg gradient-primary shadow-3d-sm shrink-0">
            <Wheat className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <span className="text-sm sm:text-base tracking-tight text-foreground truncate" style={{ fontWeight: 500 }}>
            GrainOS
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3.5 py-2 text-sm transition-all ${
                pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              style={{ fontWeight: 400 }}
            >
              {l.label}
            </Link>
          ))}

          <Link
            to="/notifications"
            className={`relative ml-2 flex h-9 w-9 items-center justify-center rounded-lg border bg-card transition-all hover:shadow-3d-sm ${
              pathname === "/notifications" ? "border-primary/40 bg-primary/5" : "border-border"
            }`}
            aria-label="Notifications"
          >
            <Bell className={`h-4 w-4 ${pathname === "/notifications" ? "text-primary" : "text-muted-foreground"}`} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground shadow-3d-sm">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: bell + hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            to="/notifications"
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border bg-card ${
              pathname === "/notifications" ? "border-primary/40 bg-primary/5" : "border-border"
            }`}
            aria-label="Notifications"
          >
            <Bell className={`h-4 w-4 ${pathname === "/notifications" ? "text-primary" : "text-muted-foreground"}`} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-3 py-2 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-md px-3 py-2.5 text-sm transition-all ${
                  pathname === l.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                style={{ fontWeight: 400 }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
