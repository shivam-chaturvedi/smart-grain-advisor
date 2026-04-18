import { Link, useLocation } from "react-router-dom";
import { Wheat, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUnreadCount } from "@/lib/api";

const Navbar = () => {
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const update = async () => {
      try {
        const unread = await getUnreadCount();
        if (mounted) setCount(unread);
      } catch {
        if (mounted) setCount(0);
      }
    };
    update();
    const id = window.setInterval(update, 15_000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/history", label: "History" },
    { to: "/conf", label: "Config" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-3d-sm">
            <Wheat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-base font-400 tracking-tight text-foreground" style={{ fontWeight: 500 }}>
            Smart Sell Advisor
          </span>
        </Link>

        <div className="flex items-center gap-1">
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
      </div>
    </nav>
  );
};

export default Navbar;
