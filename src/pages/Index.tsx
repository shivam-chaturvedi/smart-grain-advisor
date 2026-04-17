import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Thermometer, Brain, TrendingUp, ArrowRight, Zap, Cpu, Wifi,
  ShieldCheck, BarChart3, Bell, Wheat, IndianRupee, Activity,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import QuickAnalysisModal from "@/components/QuickAnalysisModal";
import deviceFront from "@/assets/device-front.png";
import deviceProduct from "@/assets/device-product.png";
import deviceOpen from "@/assets/device-open.png";
import deviceSide from "@/assets/device-side.png";

const Index = () => {
  const [modal, setModal] = useState(false);

  return (
    <div className="min-h-screen bg-background grain-texture">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-32 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-xs text-muted-foreground shadow-3d-sm backdrop-blur" style={{ fontWeight: 500 }}>
            <Zap className="h-3 w-3 text-secondary" />
            AI-Powered Agriculture · IoT Sensors · Market Intelligence
          </div>
          <h1 className="mb-6 text-5xl tracking-tight text-foreground sm:text-7xl" style={{ fontWeight: 300 }}>
            Smart Sell <span className="bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent" style={{ fontWeight: 500 }}>Advisor</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ fontWeight: 300 }}>
            AI-powered wheat storage optimization and market timing system.
            Make data-driven decisions to maximize your harvest value.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-3d text-base">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => setModal(true)} className="btn-3d btn-3d-secondary text-base">
              Quick Analysis
            </button>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: "30%", l: "Loss Reduction" },
              { v: "15-20%", l: "Profit Increase" },
              { v: "96%", l: "AI Confidence" },
              { v: "24/7", l: "Live Monitoring" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border bg-card/70 p-5 shadow-3d backdrop-blur shadow-3d-hover">
                <p className="stat-number text-3xl">{s.v}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <SectionHeader eyebrow="What we offer" title="Built for the modern farmer" />
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Thermometer, t: "Real-time Monitoring", d: "Live tracking of temperature, humidity & CO₂ inside your storage." },
            { icon: Brain, t: "AI Predictions", d: "Predict spoilage risk and the optimal day to sell with high confidence." },
            { icon: TrendingUp, t: "Market Analysis", d: "30-day price forecast, volatility analysis, and smart recommendations." },
          ].map((f) => (
            <div key={f.t} className="group rounded-xl border bg-card p-7 shadow-3d shadow-3d-hover">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-3d-sm">
                <f.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-lg text-foreground" style={{ fontWeight: 500 }}>{f.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGE LEFT — CONTENT RIGHT */}
      <ImageRow
        reverse={false}
        image={deviceFront}
        eyebrow="The hardware"
        title="Meet GrainOS — your storage co-pilot"
        body="A handcrafted IoT box that sits inside your wheat storage. Industrial-grade DHT22 and MQ-series sensors continuously monitor climate conditions and stream data to your dashboard."
        bullets={[
          { icon: Cpu, t: "ESP32 microcontroller" },
          { icon: Wifi, t: "Wi-Fi data streaming" },
          { icon: ShieldCheck, t: "Battery backup, 30+ days" },
        ]}
      />

      {/* CONTENT LEFT — IMAGE RIGHT */}
      <ImageRow
        reverse={true}
        image={deviceOpen}
        eyebrow="Inside the box"
        title="Engineered for accuracy"
        body="Each unit ships with calibrated DHT22 (temperature + humidity), MQ-135 (CO₂/air quality) and MQ-2 (gas) sensors mounted on a custom PCB inside a wooden enclosure — built to withstand barn conditions."
        bullets={[
          { icon: Activity, t: "±0.5°C temperature accuracy" },
          { icon: BarChart3, t: "Continuous sampling every 30s" },
          { icon: Wheat, t: "Designed for grain storage" },
        ]}
      />

      {/* IMAGE LEFT — CONTENT RIGHT */}
      <ImageRow
        reverse={false}
        image={deviceSide}
        eyebrow="Smart alerts"
        title="Get notified when it matters"
        body="Receive instant alerts when AI recommendation flips to SELL, or when sensor readings cross safe thresholds. Never miss a market peak again."
        bullets={[
          { icon: Bell, t: "Real-time SELL alerts" },
          { icon: IndianRupee, t: "Best-price day notifications" },
          { icon: ShieldCheck, t: "Spoilage risk warnings" },
        ]}
      />

      {/* CONTENT LEFT — IMAGE RIGHT */}
      <ImageRow
        reverse={true}
        image={deviceProduct}
        eyebrow="Plug & play"
        title="Setup in under 5 minutes"
        body="Power it on, connect to Wi-Fi, place it in your storage. Your dashboard starts populating immediately with live readings, AI insights, and a 30-day price forecast tailored to your region."
        bullets={[
          { icon: Zap, t: "USB-C powered" },
          { icon: Wifi, t: "Auto-connect to dashboard" },
          { icon: Brain, t: "AI insights from minute one" },
        ]}
      />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <SectionHeader eyebrow="How it works" title="From sensor to sale in 4 steps" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Sense", d: "GrainOS captures temperature, humidity & CO₂ every 30 seconds." },
            { n: "02", t: "Analyze", d: "Our AI scores spoilage risk and forecasts 30-day market prices." },
            { n: "03", t: "Recommend", d: "Get a clear SELL or HOLD signal with the best day & expected value." },
            { n: "04", t: "Act", d: "Sell at the right time and maximize your profit per quintal." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-xl border bg-card p-6 shadow-3d shadow-3d-hover">
              <span className="stat-number absolute -top-3 right-4 text-5xl opacity-20">{s.n}</span>
              <h3 className="mb-2 text-base text-foreground" style={{ fontWeight: 500 }}>{s.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-10 text-center shadow-3d-lg sm:p-14">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 text-3xl tracking-tight sm:text-4xl" style={{ fontWeight: 300 }}>
              Reduce post-harvest losses by up to{" "}
              <span className="bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent" style={{ fontWeight: 500 }}>30%</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground" style={{ fontWeight: 300 }}>
              Increase profit margins by 15–20% with data-driven storage and timing decisions.
            </p>
            <Link to="/dashboard" className="btn-3d text-base">
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/50 py-8 text-center text-xs text-muted-foreground" style={{ fontWeight: 300 }}>
        © {new Date().getFullYear()} Smart Sell Advisor · Built for farmers
      </footer>

      <QuickAnalysisModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
};

const SectionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-12 text-center">
    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary" style={{ fontWeight: 500 }}>{eyebrow}</p>
    <h2 className="text-3xl tracking-tight text-foreground sm:text-4xl" style={{ fontWeight: 300 }}>{title}</h2>
  </div>
);

interface ImageRowProps {
  reverse: boolean;
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: { icon: typeof Zap; t: string }[];
}

const ImageRow = ({ reverse, image, eyebrow, title, body, bullets }: ImageRowProps) => (
  <section className="mx-auto max-w-6xl px-4 py-16">
    <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
      <div className="relative">
        <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-2xl bg-primary/15 blur-xl" />
        <div className="overflow-hidden rounded-2xl border bg-card shadow-3d-lg">
          <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary" style={{ fontWeight: 500 }}>{eyebrow}</p>
        <h2 className="mb-4 text-3xl tracking-tight text-foreground sm:text-4xl" style={{ fontWeight: 300 }}>
          {title}
        </h2>
        <p className="mb-7 text-base leading-relaxed text-muted-foreground" style={{ fontWeight: 300 }}>
          {body}
        </p>
        <ul className="space-y-3">
          {bullets.map((b) => (
            <li key={b.t} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-card text-primary shadow-3d-sm">
                <b.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-foreground" style={{ fontWeight: 400 }}>{b.t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Index;
