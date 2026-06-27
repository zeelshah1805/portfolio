"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy-load the heavy Three.js scene only on the client, after mount.
const NeuralScene = dynamic(() => import("./NeuralScene"), {
  ssr: false,
  loading: () => null,
});

export default function NeuralBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Respect reduced motion and skip on small / low-power screens
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    // Defer mount so it doesn't block first paint
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setEnabled(true))
      : window.setTimeout(() => setEnabled(true), 400);
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id as number);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Static gradient glow fallback (always present) */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute left-1/4 top-0 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-1/4 top-1/3 h-[50vh] w-[50vh] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[40vh] w-[40vh] rounded-full bg-accent/[0.07] blur-[120px]" />
      {enabled && (
        <div className="absolute inset-0 opacity-70">
          <NeuralScene />
        </div>
      )}
    </div>
  );
}
