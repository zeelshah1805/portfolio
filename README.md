# Zeel Shah — AI/ML Engineer Portfolio

A premium, futuristic AI/ML engineer portfolio with neural-network-inspired animations, built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Three.js / React Three Fiber**.

## ✨ Features

- **AI boot loading screen** — animated neural graph, progress bar, and boot sequence
- **Custom cursor** — glowing trailing ring, white dot, particle trail, magnetic buttons, and context-aware shapes (button / card / neural-node)
- **3D neural background** — rotating node graph + parallax embedding particles (R3F), lazy-loaded and reduced-motion aware
- **Hero** — 3D particle brain, role typing animation, magnetic CTAs
- **About** — animated skill timeline + count-up stat cards
- **Tech Stack** — categorized skill cloud with proficiency reveals
- **Experience** — vertical animated timeline with glow-on-hover cards
- **Projects** — 3D tilt cards, category filter (Framer Motion `layout`), neural glow on hover
- **AI Lab** — training pipeline, evaluation metrics, animated loss curve, confusion matrix, subtle binary rain
- **AI Playground** — four live, in-browser demos: a real MLP training via gradient descent, transformer self-attention, a force-directed knowledge graph, and a GLSL GPU-cluster scene
- **Achievements** — count-up animations
- **Contact** — glassmorphism form with ripple submit button
- **Footer** — animated constellation network
- **Easter egg** — press `Ctrl + Shift + A` for the AI command center terminal
- **Smooth scrolling** via Lenis, SEO metadata, sitemap/robots, and `prefers-reduced-motion` support

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## 🎨 Customizing

- **Content** — edit [`src/lib/data.ts`](src/lib/data.ts) (name, roles, projects, experience, skills, metrics, socials).
- **Theme colors** — [`tailwind.config.ts`](tailwind.config.ts) and CSS variables in [`src/app/globals.css`](src/app/globals.css).
- **Resume** — replace [`public/resume.pdf`](public/resume.pdf) with your real CV.
- **Sections** — composed in [`src/components/Portfolio.tsx`](src/components/Portfolio.tsx).

## 🧱 Tech

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Three.js · @react-three/fiber · @react-three/drei · Lenis

## ⚡ Performance

- Three.js scenes are lazy-loaded after first paint via `next/dynamic` + `requestIdleCallback`.
- Particle counts and DPR are capped; animations use `requestAnimationFrame`.
- All motion respects `prefers-reduced-motion`.
