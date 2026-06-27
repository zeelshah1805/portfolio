"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { labMetrics } from "@/lib/data";
import Reveal, { SectionHeading } from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import BinaryRain from "@/components/effects/BinaryRain";

const PIPELINE = ["Dataset", "Training", "Evaluation", "Deployment"];

export default function AILab() {
  return (
    <section id="lab" className="section-pad relative overflow-hidden">
      <BinaryRain opacity={0.06} />
      <SectionHeading
        eyebrow="// ai lab"
        title="Inside the Model"
        subtitle="A live look at the training pipeline — data flowing from raw datasets to deployed inference."
      />

      {/* Pipeline */}
      <Reveal className="mb-16">
        <div className="glass relative flex flex-col items-stretch gap-4 overflow-hidden p-8 md:flex-row md:items-center">
          {PIPELINE.map((stage, i) => (
            <div key={stage} className="flex flex-1 items-center gap-4">
              <div className="flex-1 rounded-xl border border-primary/20 bg-primary/5 py-5 text-center">
                <div className="text-xs font-mono uppercase tracking-widest text-accent">
                  Stage {i + 1}
                </div>
                <div className="mt-1 font-semibold text-white">{stage}</div>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="relative hidden h-px flex-1 bg-white/10 md:block">
                  <motion.span
                    className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent shadow-glow-green"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Metrics */}
        <Reveal direction="right" className="glass p-6">
          <h3 className="mb-5 font-semibold text-white">Evaluation Metrics</h3>
          <div className="space-y-4">
            {[
              ["Accuracy", labMetrics.accuracy],
              ["Precision", labMetrics.precision],
              ["Recall", labMetrics.recall],
              ["F1 Score", labMetrics.f1],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-mono text-primary">
                    <CountUp end={val as number} decimals={1} suffix="%" />
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${val}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Loss curve */}
        <Reveal direction="up" className="glass p-6">
          <h3 className="mb-5 font-semibold text-white">Training Loss</h3>
          <LossCurve />
        </Reveal>

        {/* Confusion matrix */}
        <Reveal direction="left" className="glass p-6">
          <h3 className="mb-5 font-semibold text-white">Confusion Matrix</h3>
          <ConfusionMatrix matrix={labMetrics.confusion} />
        </Reveal>
      </div>
    </section>
  );
}

function LossCurve() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const w = 280;
  const h = 160;
  // Converging loss curve
  const points = Array.from({ length: 50 }, (_, i) => {
    const x = (i / 49) * w;
    const loss = 1.6 * Math.exp(-i / 9) + 0.08 + Math.sin(i) * 0.02 * Math.exp(-i / 12);
    const y = h - (1 - loss / 1.7) * h;
    return [x, Math.max(6, Math.min(h - 4, y))];
  });
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.06)" />
      ))}
      <motion.path
        d={`${d} L ${w} ${h} L 0 ${h} Z`}
        fill="url(#lossGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1, delay: 1 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#00D9FF"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 6px rgba(0,217,255,0.6))" }}
      />
      <text x="4" y="14" fill="#6b7280" fontSize="9" fontFamily="monospace">
        loss
      </text>
      <text x={w - 30} y={h - 4} fill="#6b7280" fontSize="9" fontFamily="monospace">
        epochs
      </text>
    </svg>
  );
}

function ConfusionMatrix({ matrix }: { matrix: number[][] }) {
  const max = Math.max(...matrix.flat());
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {matrix.map((row, i) =>
        row.map((val, j) => {
          const intensity = val / max;
          const diag = i === j;
          return (
            <motion.div
              key={`${i}-${j}`}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i * 4 + j) * 0.03 }}
              className="grid aspect-square place-items-center rounded-md text-xs font-mono"
              style={{
                background: diag
                  ? `rgba(0,255,170,${0.15 + intensity * 0.6})`
                  : `rgba(139,92,246,${0.08 + intensity * 0.5})`,
                color: intensity > 0.5 ? "#fff" : "#9ca3af",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {val}
            </motion.div>
          );
        })
      )}
    </div>
  );
}
