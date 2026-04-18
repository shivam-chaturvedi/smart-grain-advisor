// Human-readable timestamp formatting helpers.
// Backend returns ISO strings like "2026-04-18T17:21:08.772656+00:00".

const WEEKDAY_FMT = new Intl.DateTimeFormat(undefined, { weekday: "short" });
const DATE_FMT = new Intl.DateTimeFormat(undefined, {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export interface FormattedTimestamp {
  weekday: string;   // e.g. "Tue"
  date: string;      // e.g. "18 Apr 2026"
  time: string;      // e.g. "5:21 PM"
  full: string;      // e.g. "Tue, 18 Apr 2026 · 5:21 PM"
  relative: string;  // e.g. "2h ago"
  raw: string;       // original input
}

export const formatTimestamp = (input: string | number | Date | null | undefined): FormattedTimestamp => {
  const raw = typeof input === "string" ? input : String(input ?? "");
  if (input == null || input === "") {
    return { weekday: "—", date: "—", time: "—", full: "—", relative: "—", raw };
  }
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    return { weekday: "—", date: raw, time: "", full: raw, relative: "", raw };
  }
  const weekday = WEEKDAY_FMT.format(d);
  const date = DATE_FMT.format(d);
  const time = TIME_FMT.format(d);
  return {
    weekday,
    date,
    time,
    full: `${weekday}, ${date} · ${time}`,
    relative: relativeTime(d),
    raw,
  };
};

const relativeTime = (d: Date): string => {
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const abs = Math.abs(sec);
  if (abs < 60) return sec >= 0 ? "just now" : "in a moment";
  const min = Math.round(sec / 60);
  if (Math.abs(min) < 60) return min >= 0 ? `${min}m ago` : `in ${-min}m`;
  const hr = Math.round(min / 60);
  if (Math.abs(hr) < 24) return hr >= 0 ? `${hr}h ago` : `in ${-hr}h`;
  const day = Math.round(hr / 24);
  if (Math.abs(day) < 30) return day >= 0 ? `${day}d ago` : `in ${-day}d`;
  const mo = Math.round(day / 30);
  if (Math.abs(mo) < 12) return mo >= 0 ? `${mo}mo ago` : `in ${-mo}mo`;
  const yr = Math.round(mo / 12);
  return yr >= 0 ? `${yr}y ago` : `in ${-yr}y`;
};
