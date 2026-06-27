"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";
import { SectionHeading } from "@/components/ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section-pad relative">
      <SectionHeading
        eyebrow="// experience"
        title="The Journey So Far"
        subtitle="Internships, open source, and research that shaped how I build intelligent systems."
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Center line */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-secondary to-accent md:left-1/2 md:-translate-x-1/2" />

        {experience.map((exp, i) => (
          <motion.div
            key={exp.role}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className={`relative mb-12 pl-12 md:w-1/2 md:pl-0 ${
              i % 2 === 0
                ? "md:pr-12 md:text-right"
                : "md:ml-auto md:pl-12"
            }`}
          >
            {/* Node */}
            <span
              className={`absolute left-2.5 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background shadow-glow md:left-auto ${
                i % 2 === 0 ? "md:-right-2" : "md:-left-2"
              }`}
            />

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              data-cursor="card"
              className="group glass relative overflow-hidden p-6 transition-shadow hover:shadow-glow"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-secondary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                {exp.period}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-white">{exp.role}</h3>
              <p className="text-sm text-primary">{exp.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{exp.desc}</p>
              <div
                className={`mt-4 flex flex-wrap gap-2 ${
                  i % 2 === 0 ? "md:justify-end" : ""
                }`}
              >
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
