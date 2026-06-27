"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BOOT_LINES = [
  "Initializing Neural Engine...",
  "Loading Models...",
  "Connecting to GPU Cluster...",
  "Optimizing Parameters...",
  "Ready.",
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Progress + boot lines
  useEffect(() => {
    const start = performance.now();
    const duration = 2600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      setLineIndex(Math.min(BOOT_LINES.length - 1, Math.floor(eased * BOOT_LINES.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mini neural graph animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 220;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const nodes = Array.from({ length: 16 }, () => ({
      x: Math.random() * size,
      y: Math.random() * size,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      p: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > size) n.vx *= -1;
        if (n.y < 0 || n.y > size) n.vy *= -1;
        n.p += 0.05;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 70) {
            ctx.strokeStyle = `rgba(0,217,255,${0.25 * (1 - d / 70)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const r = 2 + Math.sin(n.p) * 1.5;
        ctx.fillStyle = "#00D9FF";
        ctx.shadowColor = "#00D9FF";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

          <canvas
            ref={canvasRef}
            style={{ width: 220, height: 220 }}
            className="mb-8 opacity-90"
          />

          <div className="font-mono text-sm text-primary glow-text h-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={lineIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {BOOT_LINES[lineIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-6 h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 font-mono text-xs text-gray-500">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
