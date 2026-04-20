import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

const FRAME_COUNT = 121;
const framePath = (i: number) =>
  `/hero-frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;

interface ScrollHeroProps {
  onQuickAnalysis: () => void;
}

const ScrollHero = ({ onQuickAnalysis }: ScrollHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [endReached, setEndReached] = useState(false);

  // Preload frames
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        count++;
        setLoaded(count);
        if (i === 0) drawFrame(0);
      };
      imgs[i] = img;
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    // cover fit
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max((cw * dpr) / iw, (ch * dpr) / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw * dpr - dw) / 2;
    const dy = (ch * dpr - dh) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Scroll mapping
  useEffect(() => {
    const animate = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;
      if (Math.abs(diff) < 0.05) {
        currentFrameRef.current = target;
        drawFrame(Math.round(target));
      } else {
        currentFrameRef.current = current + diff * 0.18; // easing
        drawFrame(Math.round(currentFrameRef.current));
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      rafRef.current = null;
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh; // scrollable distance
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const target = progress * (FRAME_COUNT - 1);
      targetFrameRef.current = target;
      setEndReached(progress > 0.95);
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onResize = () => drawFrame(Math.round(currentFrameRef.current));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const loadProgress = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    // Tall container = scroll length. Shorter on mobile for a snappier feel.
    <section
      ref={containerRef}
      className="relative h-[220vh] sm:h-[280vh] lg:h-[320vh]"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ background: "hsl(var(--background))" }}
        />

        {/* Top vignette for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/10 to-background/80" />

        {/* Loading state */}
        {loaded < 8 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground" style={{ fontWeight: 400 }}>
              Loading · {loadProgress}%
            </div>
          </div>
        )}

        {/* HERO content overlay (fades out as scroll progresses) */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4 transition-opacity duration-500"
          style={{ opacity: endReached ? 0 : 1, pointerEvents: endReached ? "none" : "auto" }}
        >
          <div className="relative mx-auto max-w-5xl w-full text-center translate-y-10 sm:translate-y-14">
            <div
              className="mb-4 sm:mb-6 inline-flex max-w-full items-center gap-2 rounded-full border bg-card/70 px-3 py-1.5 text-[10px] sm:text-xs text-muted-foreground shadow-3d-sm backdrop-blur-md"
              style={{ fontWeight: 500 }}
            >
              <Zap className="h-3 w-3 shrink-0 text-secondary" />
              <span className="truncate">AI · IoT Sensors · Market Intelligence</span>
            </div>
            <h1
              className="mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground drop-shadow-sm"
              style={{ fontWeight: 300 }}
            >
              Grain{" "}
              <span
                className="bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent"
                style={{ fontWeight: 500 }}
              >
                OS
              </span>
            </h1>
            <p
              className="mx-auto mt-6 sm:mt-8 mb-6 sm:mb-10 max-w-2xl text-sm sm:text-lg md:text-xl leading-relaxed text-white drop-shadow-sm px-2"
              style={{
                fontWeight: 600,
                textShadow:
                  "0 1px 0 rgba(0,0,0,0.35), 0 3px 10px rgba(0,0,0,0.35), 0 10px 24px rgba(0,0,0,0.25)",
              }}
            >
              AI-powered wheat storage optimization and market timing system.
              Make data-driven decisions to maximize your harvest value.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to="/dashboard" className="btn-3d text-sm sm:text-base">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={onQuickAnalysis} className="btn-3d btn-3d-secondary text-sm sm:text-base">
                Quick Analysis
              </button>
            </div>

            {/* Stats */}
            <div className="mt-8 sm:mt-14 grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4 px-2 sm:px-0">
              {[
                { v: "30%", l: "Loss Reduction" },
                { v: "15-20%", l: "Profit Increase" },
                { v: "96%", l: "AI Confidence" },
                { v: "24/7", l: "Live Monitoring" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border bg-card/70 p-3 sm:p-5 shadow-3d backdrop-blur-md"
                >
                  <p className="stat-number text-xl sm:text-3xl">{s.v}</p>
                  <p
                    className="mt-1 text-[9px] sm:text-xs uppercase tracking-wider text-muted-foreground"
                    style={{ fontWeight: 500 }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="mt-6 sm:mt-10 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70"
              style={{ fontWeight: 400 }}
            >
              ↓ Scroll to explore
            </p>
          </div>
        </div>

        {/* End-of-animation: Grain OS reveal */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{ opacity: endReached ? 1 : 0 }}
        >
          <div className="text-center px-4">
            <p
              className="mb-3 sm:mb-4 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-foreground/60"
              style={{ fontWeight: 400 }}
            >
              Introducing
            </p>
            <h2
              className="text-4xl sm:text-6xl md:text-8xl tracking-[0.05em] text-foreground/90"
              style={{ fontWeight: 300, textShadow: "0 2px 30px hsl(var(--background) / 0.6)" }}
            >
              Grain<span className="text-primary/90">OS</span>
            </h2>
            <p
              className="mt-3 sm:mt-4 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground"
              style={{ fontWeight: 300 }}
            >
              The storage co-pilot · Continue scrolling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollHero;
