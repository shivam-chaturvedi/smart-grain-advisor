import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BackendUnavailableBanner from "@/components/BackendUnavailableBanner";
import { BackendUnavailableError, getSensorConfig, registerSensorConfig, type SensorConfig } from "@/lib/api";

const DEVICE_ID = "001";
const SENSOR_NAME = "Grain OS";

const isoNow = () => new Date().toISOString();

const Conf = () => {
  const now = useMemo(() => isoNow(), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SensorConfig | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const row = await getSensorConfig(DEVICE_ID);
        setConfig(row);
        setQuantity(row ? String(row.wheat_quantity) : "");
        setBackendDown(false);
      } catch (e) {
        if (e instanceof BackendUnavailableError) {
          setBackendDown(true);
        } else {
          toast.error(e instanceof Error ? e.message : "Failed to load configuration");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const createdAt = config?.created_at ?? now;
  const updatedAt = config?.updated_at ?? now;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(quantity);
    if (!Number.isFinite(q) || q <= 0) {
      toast.error("Please enter a valid wheat quantity (> 0).");
      return;
    }
    setSaving(true);
    try {
      const saved = await registerSensorConfig({
        device_id: DEVICE_ID,
        sensor_name: SENSOR_NAME,
        wheat_quantity: q,
      });
      setConfig(saved);
      setQuantity(String(saved.wheat_quantity));
      setBackendDown(false);
      toast.success("Configuration saved");
    } catch (err) {
      if (err instanceof BackendUnavailableError) {
        setBackendDown(true);
      } else {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grain-texture">
      <Navbar />
      <div className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary" style={{ fontWeight: 500 }}>
            Config
          </p>
          <h1 className="text-3xl sm:text-4xl tracking-tight text-foreground" style={{ fontWeight: 300 }}>
            Sensor <span style={{ fontWeight: 500 }}>Configuration</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground" style={{ fontWeight: 300 }}>
            Set default wheat quantity for device submissions. Sensors send only temperature/humidity/CO₂; the backend uses this quantity automatically.
          </p>
        </div>

        {backendDown ? <BackendUnavailableBanner className="mb-6" /> : null}

        {backendDown ? null : (
        <div className="rounded-2xl border bg-card p-5 sm:p-7 shadow-3d">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Created At</Label>
                  <Input value={createdAt} readOnly className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Updated At</Label>
                  <Input value={updatedAt} readOnly className="h-9" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Device ID</Label>
                  <Input value={DEVICE_ID} readOnly className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Sensor Name</Label>
                  <Input value={SENSOR_NAME} readOnly className="h-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Wheat Quantity (quintals)</Label>
                <Input
                  type="number"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity in quintals"
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground" style={{ fontWeight: 300 }}>
                  This value is stored in Supabase (`public.sensors`) and reused for every `POST /api/sensor-data` call from device `{DEVICE_ID}`.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Conf;
