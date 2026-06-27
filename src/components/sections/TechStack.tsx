"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { techStack } from "@/lib/data";
import { SectionHeading, StaggerGroup } from "@/components/ui/Reveal";

const card = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function TechStack() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="skills" className="section-pad relative">
      <SectionHeading
        eyebrow="// tech stack"
        title="Tools of the Trade"
        subtitle="A curated stack spanning AI/ML research, scalable backends, and modern MLOps."
      />

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {techStack.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: gi * 0.08 }}
            className="glass relative p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: group.color, boxShadow: `0 0 12px ${group.color}` }}
              />
              <h3 className="text-lg font-semibold text-white">{group.category}</h3>
            </div>

            <StaggerGroup className="flex flex-wrap gap-2.5" stagger={0.04}>
              {group.skills.map((skill) => (
                <motion.button
                  key={skill.name}
                  variants={card}
                  data-cursor="button"
                  onMouseEnter={() => setHovered(skill.name)}
                  onMouseLeave={() => setHovered(null)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="group relative rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-gray-200 transition-colors hover:border-white/30"
                  style={{
                    boxShadow:
                      hovered === skill.name ? `0 0 18px ${group.color}55` : "none",
                  }}
                >
                  {skill.name}

                  {/* Proficiency reveal */}
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: hovered === skill.name ? 1 : 0,
                      y: hovered === skill.name ? 0 : 6,
                    }}
                    className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a0e2a] px-2 py-1 text-xs font-medium"
                    style={{ color: group.color, border: `1px solid ${group.color}55` }}
                  >
                    {skill.level}% proficiency
                  </motion.span>

                  {/* Proficiency bar */}
                  <span className="absolute inset-x-1 bottom-0 h-0.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: group.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </span>
                </motion.button>
              ))}
            </StaggerGroup>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
