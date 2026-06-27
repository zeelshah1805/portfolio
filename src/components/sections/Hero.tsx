"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import TypeCycle from "@/components/ui/TypeCycle";
import MagneticButton from "@/components/ui/MagneticButton";

const ParticleBrain = dynamic(
  () => import("@/components/three/ParticleBrain"),
  { ssr: false, loading: () => null }
);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 md:px-10 lg:grid-cols-2">
        {/* Left */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for AI/ML opportunities
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            <span className="text-white">{profile.name}</span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-4 h-9 text-2xl font-semibold md:text-3xl"
          >
            <TypeCycle words={profile.roles} className="text-gradient glow-text" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-3 max-w-md text-sm font-medium uppercase tracking-[0.2em] text-gray-500"
          >
            {profile.title}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <MagneticButton href="#projects" variant="primary">
              View Projects
            </MagneticButton>
            <MagneticButton href="/resume.pdf" variant="outline">
              Download Resume
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Contact Me
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right — 3D particle brain */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative h-[340px] w-full md:h-[520px]"
          data-cursor="neural"
        >
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-[100px]" />
          <ParticleBrain />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="flex h-9 w-5 justify-center rounded-full border border-white/20 p-1">
          <motion.div
            className="h-1.5 w-1 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
