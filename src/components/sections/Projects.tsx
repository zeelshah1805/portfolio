"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects, projectCategories, type ProjectCategory } from "@/lib/data";
import { SectionHeading } from "@/components/ui/Reveal";

type Filter = ProjectCategory | "All";

function TiltCard({ project }: { project: (typeof projects)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      style={{ perspective: 1000 }}
    >
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="card"
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group glass relative h-full overflow-hidden p-6"
      >
        {/* Neural glow on hover */}
        <div
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${project.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <NeuralMini />
        </div>

        {/* Image placeholder / banner */}
        <div
          className={`mb-5 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br ${project.gradient} border border-white/10`}
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
            {project.category}
          </span>
        </div>

        <h3
          className="text-xl font-semibold text-white"
          style={{ transform: "translateZ(30px)" }}
        >
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{project.desc}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-4 text-sm">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="flex items-center gap-1.5 text-gray-300 transition-colors hover:text-primary"
            >
              <GithubIcon /> GitHub
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-gray-600">
              <GithubIcon /> Private
            </span>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              data-cursor="button"
              className="flex items-center gap-1.5 text-gray-300 transition-colors hover:text-accent"
            >
              <LinkIcon /> Live Demo
            </a>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-pad relative">
      <SectionHeading
        eyebrow="// projects"
        title="Things I've Built"
        subtitle="Production systems and experiments across LLMs, computer vision, MLOps, and more."
      />

      {/* Filters */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {projectCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            data-cursor="button"
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
              filter === c ? "text-[#04060f]" : "text-gray-300 hover:text-white"
            }`}
          >
            {filter === c && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary to-secondary"
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            )}
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <TiltCard key={p.title} project={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function NeuralMini() {
  return (
    <svg className="h-full w-full opacity-30" viewBox="0 0 200 200">
      <g stroke="#00D9FF" strokeWidth="0.5" fill="#00D9FF">
        {[
          [30, 40],
          [90, 30],
          [160, 60],
          [60, 110],
          [130, 130],
          [40, 170],
          [170, 160],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        <path d="M30 40 L90 30 L160 60 M90 30 L60 110 L130 130 M60 110 L40 170 M130 130 L170 160" fill="none" />
      </g>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 7.07c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
