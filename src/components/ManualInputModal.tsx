import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SensorData } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SensorData) => void;
}

const ManualInputModal = ({ open, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState({ temperature: "", humidity: "", co2: "", quantity: "" });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      co2: Number(form.co2),
      quantity: Number(form.quantity),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border bg-card p-6 card-shadow">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Manual Input</h2>
        <p className="mb-5 text-sm text-muted-foreground">Enter current sensor readings</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Temperature (°C)" value={form.temperature} onChange={(v) => setForm({ ...form, temperature: v })} />
          <Field label="Humidity (%)" value={form.humidity} onChange={(v) => setForm({ ...form, humidity: v })} />
          <Field label="CO₂ (PPM)" value={form.co2} onChange={(v) => setForm({ ...form, co2: v })} />
          <Field label="Wheat Quantity (quintals)" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
          <Button type="submit" className="w-full">Submit</Button>
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

export default ManualInputModal;
