"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  strength?: number;
}

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-colors duration-300 overflow-hidden";
  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-[#04060f] font-semibold shadow-glow hover:shadow-[0_0_40px_rgba(0,217,255,0.6)]",
    outline:
      "border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary",
    ghost: "text-gray-300 hover:text-white border border-white/10 hover:border-white/30",
  };

  const inner = (
    <motion.div
      ref={ref}
      data-cursor="button"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={cn(base, variants[variant], "will-change-transform", className)}
      style={{ transition: "transform 0.25s cubic-bezier(0.2,0.8,0.2,1)" }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}
