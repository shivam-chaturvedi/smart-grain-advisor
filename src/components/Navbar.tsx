import { Link, useLocation } from "react-router-dom";
import { Wheat } from "lucide-react";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Wheat className="h-5 w-5 text-primary" />
          <span className="text-sm tracking-tight">Smart Sell Advisor</span>
        </Link>
        <div className="flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/dashboard", label: "Dashboard" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
