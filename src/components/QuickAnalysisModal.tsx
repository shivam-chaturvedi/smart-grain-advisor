import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
}

const QuickAnalysisModal = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ temp: "", hum: "", co2: "", qty: "" });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      temp: form.temp,
      hum: form.hum,
      co2: form.co2,
      qty: form.qty,
    });
    onClose();
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border bg-card p-6 card-shadow">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Quick Analysis</h2>
        <p className="mb-5 text-sm text-muted-foreground">Enter sensor readings for instant analysis</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Temperature (°C)" value={form.temp} onChange={(v) => setForm({ ...form, temp: v })} />
          <Field label="Humidity (%)" value={form.hum} onChange={(v) => setForm({ ...form, hum: v })} />
          <Field label="CO₂ (PPM)" value={form.co2} onChange={(v) => setForm({ ...form, co2: v })} />
          <Field label="Wheat Quantity (quintals)" value={form.qty} onChange={(v) => setForm({ ...form, qty: v })} />
          <Button type="submit" className="w-full">Analyze</Button>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    <Input type="number" step="any" required value={value} onChange={(e) => onChange(e.target.value)} className="h-9" />
  </div>
);

export default QuickAnalysisModal;
