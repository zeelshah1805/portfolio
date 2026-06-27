"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/data";

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > w) s.vx *= -1;
        if (s.y < 0 || s.y > h) s.vy *= -1;
      }
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(0,217,255,${0.18 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
      for (const s of stars) {
        ctx.fillStyle = "rgba(139,92,246,0.9)";
        ctx.shadowColor = "#00D9FF";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:px-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary font-mono text-lg font-bold text-[#04060f]">
          Z
        </div>
        <p className="mt-6 text-lg font-medium text-white glow-text">
          Designed and engineered by {profile.name}.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Building intelligent systems that transform data into decisions.
        </p>

        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
          <a href={profile.socials.github} target="_blank" rel="noreferrer" data-cursor="button" className="transition-colors hover:text-primary">
            GitHub
          </a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" data-cursor="button" className="transition-colors hover:text-primary">
            LinkedIn
          </a>
          <a href={`mailto:${profile.socials.email}`} data-cursor="button" className="transition-colors hover:text-primary">
            Email
          </a>
        </div>

        <p className="mt-10 font-mono text-xs text-gray-600">
          © {new Date().getFullYear()} {profile.name}. Press{" "}
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-primary">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-primary">
            Shift
          </kbd>{" "}
          +{" "}
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-primary">
            A
          </kbd>{" "}
          for the AI command center.
        </p>
      </div>
    </footer>
  );
}
