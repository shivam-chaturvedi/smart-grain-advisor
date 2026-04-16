import { useState } from "react";
import { Link } from "react-router-dom";
import { Thermometer, Brain, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import QuickAnalysisModal from "@/components/QuickAnalysisModal";

const features = [
  {
    icon: Thermometer,
    title: "Real-time Monitoring",
    desc: "Track temperature, humidity & CO₂ levels in your storage facility.",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    desc: "Predict spoilage risk and determine the optimal selling time.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    desc: "Analyze price trends to maximize your profit margins.",
  },
];

const Index = () => {
  const [modal, setModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center px-4 pt-20 pb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground card-shadow">
          <Zap className="h-3 w-3 text-primary" />
          AI-Powered Agriculture
        </div>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Smart Sell Advisor
        </h1>
        <p className="mb-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
          AI-powered wheat storage optimization and market timing system.
          Make data-driven decisions to maximize your harvest value.
        </p>
        <div className="flex gap-3">
          <Button asChild size="default">
            <Link to="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setModal(true)}>
            Quick Analysis
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-lg border bg-card p-5 transition-shadow hover:card-shadow-hover card-shadow"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-4 w-4" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom stat */}
      <section className="border-t bg-card py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Reduce post-harvest losses by up to <strong className="text-foreground">30%</strong> · Increase profits by{" "}
          <strong className="text-foreground">15–20%</strong>
        </p>
      </section>

      <QuickAnalysisModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
};

export default Index;
