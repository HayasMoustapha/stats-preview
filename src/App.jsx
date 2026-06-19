import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const DATA = {
  "7j": {
    spark: [22, 30, 26, 38, 34, 46, 52],
    kpis: [
      { label: "Visiteurs", value: 8420, fmt: (v) => v.toLocaleString("fr-FR"), delta: +12.4 },
      { label: "Revenu", value: 12750, fmt: (v) => v.toLocaleString("fr-FR") + " €", delta: +8.1 },
      { label: "Conversion", value: 3.2, fmt: (v) => v.toFixed(1) + " %", delta: -0.3 },
    ],
  },
  "30j": {
    spark: [40, 44, 38, 52, 60, 55, 68, 64, 72, 80, 76, 90],
    kpis: [
      { label: "Visiteurs", value: 38120, fmt: (v) => v.toLocaleString("fr-FR"), delta: +18.6 },
      { label: "Revenu", value: 54300, fmt: (v) => v.toLocaleString("fr-FR") + " €", delta: +14.2 },
      { label: "Conversion", value: 3.6, fmt: (v) => v.toFixed(1) + " %", delta: +0.4 },
    ],
  },
  "12m": {
    spark: [30, 42, 48, 55, 60, 72, 70, 85, 90, 96, 88, 110],
    kpis: [
      { label: "Visiteurs", value: 462000, fmt: (v) => Math.round(v / 1000) + "k", delta: +42.0 },
      { label: "Revenu", value: 612000, fmt: (v) => Math.round(v / 1000) + "k €", delta: +36.5 },
      { label: "Conversion", value: 3.9, fmt: (v) => v.toFixed(1) + " %", delta: +0.8 },
    ],
  },
};
const periods = ["7j", "30j", "12m"];

function Count({ value, fmt }) {
  const mv = useMotionValue(0);
  const out = useTransform(mv, (v) => fmt(v));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] });
    return c.stop;
  }, [value, mv, fmt]);
  return <motion.span>{out}</motion.span>;
}

function Sparkline({ points }) {
  const max = Math.max(...points), min = Math.min(...points);
  const w = 100, h = 36;
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / (max - min || 1)) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full" preserveAspectRatio="none">
      <motion.polyline
        key={path}
        points={path}
        fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function App() {
  const [period, setPeriod] = useState("30j");
  const d = DATA[period];

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-card p-7 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Aperçu de performance</p>
            <h1 className="text-xl font-semibold">Analytics</h1>
          </div>
          <div className="flex gap-1 rounded-full border border-white/10 p-1">
            {periods.map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${period === p ? "bg-accent text-white" : "text-white/50 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-xs text-white/50">Tendance des visiteurs</p>
          <Sparkline points={d.spark} />
        </div>

        <div className="mt-5 grid gap-3">
          {d.kpis.map((k) => (
            <div key={k.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span className="text-sm text-white/60">{k.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold tabular-nums"><Count value={k.value} fmt={k.fmt} /></span>
                <span className={`flex items-center gap-1 text-xs font-medium ${k.delta >= 0 ? "text-up" : "text-down"}`}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: k.delta >= 0 ? "none" : "rotate(180deg)" }}>
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  {Math.abs(k.delta)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
