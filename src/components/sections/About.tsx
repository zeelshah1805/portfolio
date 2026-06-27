"use client";

import { motion } from "framer-motion";
import { stats, aboutSkills, profile } from "@/lib/data";
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
        subtitle="I build and ship production AI systems — LLM integrations, RAG pipelines, agentic workflows, and the backends that serve them."
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

        {/* Right column: stat cards + education */}
        <div className="self-start">
          <StaggerGroup className="grid grid-cols-2 gap-5">
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

          {/* Education */}
          <Reveal direction="up" delay={0.1} className="mt-5">
            <div
              data-cursor="card"
              className="glass relative overflow-hidden p-6"
            >
              <div className="absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-secondary/10 blur-2xl" />
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent">
                <GradCapIcon />
                Education
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {profile.education.degree}
              </h3>
              <p className="mt-1 text-sm text-primary">{profile.education.school}</p>
              <p className="mt-1 text-xs text-gray-500">{profile.education.period}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function GradCapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10 12 5 2 10l10 5 10-5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const descriptions: Record<string, string> = {
  "LLM & GenAI Systems": "Production LLM integrations, prompt engineering, and agentic workflows.",
  "RAG Pipelines": "Hybrid retrieval, reranking, and validated citations over enterprise data.",
  "Agentic Workflows": "Orchestrator–worker agents that plan, search, and synthesize end-to-end.",
  "NLP Automation": "Resume parsing, candidate ranking, and document understanding pipelines.",
  "Model Fine-tuning (QLoRA)": "Parameter-efficient fine-tuning with rigorous base-vs-tuned evaluation.",
  "Backend Engineering": "FastAPI, WebSockets, and REST services that serve models in production.",
  "Python Development": "Clean, performant Python across AI, data, and backend stacks.",
};
