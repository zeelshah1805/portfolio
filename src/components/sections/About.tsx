"use client";

import { motion } from "framer-motion";
import { stats, aboutSkills } from "@/lib/data";
import Reveal, { SectionHeading, StaggerGroup } from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <section id="about" className="section-pad relative">
      <SectionHeading
        eyebrow="// about"
        title="Engineering Intelligence"
        subtitle="I design, train, and ship machine learning systems — from raw data pipelines to production LLM applications."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Skill timeline */}
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-secondary to-accent" />
          {aboutSkills.map((skill, i) => (
            <Reveal key={skill} direction="right" delay={i * 0.05} className="relative mb-7">
              <span className="absolute -left-[1.45rem] top-1.5 h-3 w-3 rounded-full bg-primary shadow-glow ring-4 ring-primary/15" />
              <h3 className="text-lg font-semibold text-white">{skill}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {descriptions[skill] ?? "Hands-on production experience."}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Stat cards */}
        <StaggerGroup className="grid grid-cols-2 gap-5 self-start">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              data-cursor="card"
              className="glass group relative overflow-hidden p-6"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="text-4xl font-bold text-gradient">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

const descriptions: Record<string, string> = {
  "AI/ML Developer": "Building end-to-end ML systems from research to deployment.",
  "Python Developer": "Clean, performant Python across data and backend stacks.",
  FastAPI: "High-performance async APIs serving models in production.",
  "LLM Systems": "RAG, agents, fine-tuning, and prompt engineering pipelines.",
  "Model Training": "Designing, training, and optimizing deep neural networks.",
  MLOps: "CI/CD for ML — tracking, registries, and automated deployment.",
  "Data Engineering": "Robust pipelines turning raw data into model-ready features.",
};
