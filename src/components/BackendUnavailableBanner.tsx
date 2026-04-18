import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiBaseUrl } from "@/lib/api";

export default function BackendUnavailableBanner({ className }: { className?: string }) {
  const baseUrl = getApiBaseUrl();

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-5 shadow-3d",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground shadow-3d-sm">
        <AlertCircle className="h-4 w-4" strokeWidth={2} />
      </div>
      <p className="text-sm leading-relaxed text-foreground" style={{ fontWeight: 400 }}>
        Backend unavailable. Start the backend on {baseUrl}
      </p>
    </div>
  );
}

