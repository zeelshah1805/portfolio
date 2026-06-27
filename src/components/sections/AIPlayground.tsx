"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/Reveal";

// Lazy-load each interactive module; only the active tab mounts.
const NeuralPlayground = dynamic(() => import("@/components/advanced/NeuralPlayground"), {
  ssr: false,
  loading: () => <Loader label="Spinning up neural net..." />,
});
const AttentionPlayground = dynamic(() => import("@/components/advanced/AttentionPlayground"), {
  ssr: false,
  loading: () => <Loader label="Loading attention heads..." />,
});
const KnowledgeGraph = dynamic(() => import("@/components/advanced/KnowledgeGraph"), {
  ssr: false,
  loading: () => <Loader label="Building knowledge graph..." />,
});
const GPUCluster = dynamic(() => import("@/components/advanced/GPUCluster"), {
  ssr: false,
  loading: () => <Loader label="Booting GPU cluster..." />,
});

const TABS = [
  {
    id: "train",
    label: "Live Training",
    desc: "A real MLP learning a decision boundary",
    render: () => <NeuralPlayground />,
  },
  {
    id: "attention",
    label: "Attention",
    desc: "Interactive transformer self-attention",
    render: () => <AttentionPlayground />,
  },
  {
    id: "graph",
    label: "Knowledge Graph",
    desc: "Force-directed skills & projects",
    render: () => <KnowledgeGraph />,
  },
  {
    id: "gpu",
    label: "GPU Cluster",
    desc: "GLSL latent field & packet routing",
    render: () => <GPUCluster />,
  },
] as const;

export default function AIPlayground() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("train");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <section id="playground" className="section-pad relative">
      <SectionHeading
        eyebrow="// interactive lab"
        title="AI Playground"
        subtitle="Not screenshots — real, running AI in your browser. Train a network, probe attention, explore the knowledge graph, and watch a GPU cluster route packets."
      />

      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            data-cursor="button"
            onClick={() => setTab(t.id)}
            className={`relative rounded-xl px-4 py-2.5 text-sm transition-colors ${
              tab === t.id ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="playground-tab"
                className="absolute inset-0 -z-10 rounded-xl border border-primary/40 bg-primary/10 shadow-glow"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass relative min-h-[460px] overflow-hidden p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">{active.label}</h3>
          <p className="text-sm text-gray-500">{active.desc}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            {active.render()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Loader({ label }: { label: string }) {
  return (
    <div className="flex h-[360px] flex-col items-center justify-center gap-4 text-gray-400">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span className="font-mono text-xs">{label}</span>
    </div>
  );
}
