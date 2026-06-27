"use client";

import { motion } from "framer-motion";
import { achievements } from "@/lib/data";
import { StaggerGroup } from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Achievements() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 md:px-10">
      <div className="glass-strong relative overflow-hidden p-10">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <StaggerGroup className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
          {achievements.map((a) => (
            <motion.div key={a.label} variants={item} className="text-center">
              <div className="text-4xl font-bold text-gradient md:text-5xl glow-text">
                <CountUp end={a.value} suffix={a.suffix} duration={2000} />
              </div>
              <div className="mt-2 text-sm text-gray-400">{a.label}</div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
