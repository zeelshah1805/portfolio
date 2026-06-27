"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "> Booting AI Command Center...",
  "> Loading models...",
  "> GPU Utilization 92%",
  "> Epoch 47/50",
  "> Validation Accuracy 98.3%",
  "> Deployment Ready",
];

export default function EasterEgg() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (open) {
      setShown([]);
      LINES.forEach((line, i) => {
        const t = setTimeout(() => {
          setShown((prev) => [...prev, line]);
        }, i * 420);
        timers.current.push(t);
      });
    }
    return () => timers.current.forEach(clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-primary/30 bg-[#04060f]/95 shadow-[0_0_60px_rgba(0,217,255,0.3)]"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-gray-400">
                zeel@neural-engine: ~/command-center
              </span>
            </div>

            {/* Terminal body */}
            <div className="min-h-[220px] space-y-2 p-5 font-mono text-sm">
              {shown.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    line.includes("Ready") || line.includes("98.3")
                      ? "text-accent glow-text"
                      : "text-primary"
                  }
                >
                  {line}
                </motion.div>
              ))}
              {shown.length === LINES.length && (
                <div className="mt-2 flex items-center gap-1 text-accent">
                  <span>$</span>
                  <span className="inline-block h-4 w-2 animate-pulse bg-accent" />
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-5 py-2 text-center font-mono text-[10px] text-gray-600">
              press ESC to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
