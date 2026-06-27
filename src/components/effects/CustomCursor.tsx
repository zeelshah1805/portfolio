"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "button" | "card" | "neural";

interface Trail {
  x: number;
  y: number;
  id: number;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [hidden, setHidden] = useState(true);
  const [trails, setTrails] = useState<Trail[]>([]);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const trailId = useRef(0);

  useEffect(() => {
    // Only enable on devices with a fine pointer
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    setHidden(false);

    let lastTrail = 0;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      // Throttle particle trail
      const now = performance.now();
      if (now - lastTrail > 45) {
        lastTrail = now;
        const id = trailId.current++;
        setTrails((prev) => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id }]);
        setTimeout(() => {
          setTrails((prev) => prev.filter((t) => t.id !== id));
        }, 600);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      if (target) {
        setVariant(
          (target.getAttribute("data-cursor") as CursorVariant) || "default"
        );
      } else {
        setVariant("default");
      }
    };

    const onDown = () => ringRef.current?.classList.add("cursor-click");
    const onUp = () => ringRef.current?.classList.remove("cursor-click");
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf = 0;
    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;

  const ringSize =
    variant === "button" ? 64 : variant === "card" ? 56 : variant === "neural" ? 72 : 36;
  const borderRadius = variant === "card" ? "14%" : "50%";

  return (
    <>
      {/* Particle trail */}
      {trails.map((t, i) => (
        <div
          key={t.id}
          className="pointer-events-none fixed z-[9998] h-1.5 w-1.5 rounded-full"
          style={{
            left: t.x,
            top: t.y,
            transform: "translate(-50%, -50%)",
            background:
              i % 2 === 0 ? "rgba(0,217,255,0.8)" : "rgba(139,92,246,0.8)",
            boxShadow: "0 0 8px rgba(0,217,255,0.7)",
            opacity: (i + 1) / trails.length,
            animation: "trail-fade 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 transition-[width,height,border-radius,border-color] duration-200 ease-out"
          style={{
            width: ringSize,
            height: ringSize,
            borderRadius,
            border: `1.5px solid ${
              variant === "neural" ? "#00FFAA" : "#00D9FF"
            }`,
            boxShadow: `0 0 18px ${
              variant === "neural"
                ? "rgba(0,255,170,0.5)"
                : "rgba(0,217,255,0.5)"
            }`,
            background:
              variant === "button"
                ? "rgba(0,217,255,0.08)"
                : "transparent",
          }}
        >
          {variant === "neural" && (
            <svg viewBox="0 0 72 72" className="h-full w-full opacity-80">
              <g stroke="#00FFAA" strokeWidth="0.6" fill="#00FFAA">
                <line x1="18" y1="20" x2="50" y2="30" />
                <line x1="18" y1="20" x2="36" y2="52" />
                <line x1="50" y1="30" x2="36" y2="52" />
                <circle cx="18" cy="20" r="2.5" />
                <circle cx="50" cy="30" r="2.5" />
                <circle cx="36" cy="52" r="2.5" />
              </g>
            </svg>
          )}
        </div>
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ width: 6, height: 6, boxShadow: "0 0 6px #fff" }}
        />
      </div>

      <style jsx global>{`
        .cursor-click > div {
          transform: translate(-50%, -50%) scale(0.7);
        }
        @keyframes trail-fade {
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }
        }
      `}</style>
    </>
  );
}
