"use client";

import { useEffect, useRef, useState } from "react";

/* ----------------------------------------------------------------
   Force-directed knowledge graph connecting skills, projects and
   technologies. Real-time physics: charge repulsion + spring links +
   centering. Nodes are draggable; clicking highlights its neighborhood.
-----------------------------------------------------------------*/

type NType = "skill" | "project" | "tech";
interface GNode {
  id: string;
  type: NType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  fixed?: boolean;
}

const COLORS: Record<NType, string> = {
  skill: "#00D9FF",
  project: "#8B5CF6",
  tech: "#00FFAA",
};

const RAW: { nodes: [string, NType][]; links: [string, string][] } = {
  nodes: [
    ["AI/ML", "skill"],
    ["MLOps", "skill"],
    ["Backend", "skill"],
    ["RAG Engine", "project"],
    ["Vision Detector", "project"],
    ["ML Platform", "project"],
    ["Inference API", "project"],
    ["PyTorch", "tech"],
    ["LangChain", "tech"],
    ["OpenCV", "tech"],
    ["Docker", "tech"],
    ["Kubernetes", "tech"],
    ["FastAPI", "tech"],
    ["Redis", "tech"],
    ["Python", "tech"],
  ],
  links: [
    ["AI/ML", "PyTorch"],
    ["AI/ML", "LangChain"],
    ["AI/ML", "OpenCV"],
    ["AI/ML", "Python"],
    ["MLOps", "Docker"],
    ["MLOps", "Kubernetes"],
    ["Backend", "FastAPI"],
    ["Backend", "Redis"],
    ["Backend", "Python"],
    ["RAG Engine", "LangChain"],
    ["RAG Engine", "FastAPI"],
    ["RAG Engine", "AI/ML"],
    ["Vision Detector", "OpenCV"],
    ["Vision Detector", "PyTorch"],
    ["Vision Detector", "AI/ML"],
    ["ML Platform", "Docker"],
    ["ML Platform", "Kubernetes"],
    ["ML Platform", "MLOps"],
    ["Inference API", "FastAPI"],
    ["Inference API", "Redis"],
    ["Inference API", "Backend"],
  ],
};

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const stateRef = useRef<{ nodes: GNode[]; selected: string | null; drag: GNode | null }>({
    nodes: [],
    selected: null,
    drag: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const nodes: GNode[] = RAW.nodes.map(([id, type]) => ({
      id,
      type,
      x: W / 2 + (Math.random() - 0.5) * 200,
      y: H / 2 + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      r: type === "skill" ? 16 : type === "project" ? 13 : 9,
    }));
    stateRef.current.nodes = nodes;
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const links = RAW.links.map(([a, b]) => [byId.get(a)!, byId.get(b)!] as [GNode, GNode]);
    const neighbors = new Map<string, Set<string>>();
    RAW.links.forEach(([a, b]) => {
      if (!neighbors.has(a)) neighbors.set(a, new Set());
      if (!neighbors.has(b)) neighbors.set(b, new Set());
      neighbors.get(a)!.add(b);
      neighbors.get(b)!.add(a);
    });

    let raf = 0;
    const step = () => {
      raf = requestAnimationFrame(step);
      const { selected, drag } = stateRef.current;

      // forces
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) d2 = 1;
          const f = 1400 / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
      // springs
      for (const [a, b] of links) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - 90) * 0.012;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      // centering + integrate
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.002;
        n.vy += (H / 2 - n.y) * 0.002;
        n.vx *= 0.85;
        n.vy *= 0.85;
        if (n !== drag) {
          n.x += n.vx;
          n.y += n.vy;
        }
        n.x = Math.max(n.r, Math.min(W - n.r, n.x));
        n.y = Math.max(n.r, Math.min(H - n.r, n.y));
      }

      // draw
      ctx.clearRect(0, 0, W, H);
      const nbr = selected ? neighbors.get(selected) : null;
      for (const [a, b] of links) {
        const lit = selected && (a.id === selected || b.id === selected);
        ctx.strokeStyle = lit
          ? "rgba(0,217,255,0.55)"
          : selected
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.12)";
        ctx.lineWidth = lit ? 1.6 : 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      for (const n of nodes) {
        const dim = selected && n.id !== selected && !nbr?.has(n.id);
        ctx.globalAlpha = dim ? 0.25 : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[n.type];
        ctx.shadowColor = COLORS[n.type];
        ctx.shadowBlur = n.id === selected ? 22 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = dim ? "rgba(255,255,255,0.4)" : "#fff";
        ctx.font = `${n.type === "skill" ? 11 : 10}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.fillText(n.id, n.x, n.y - n.r - 5);
        ctx.globalAlpha = 1;
      }
    };
    step();

    const pick = (mx: number, my: number) =>
      nodes.find((n) => Math.hypot(n.x - mx, n.y - my) < n.r + 6) || null;

    const pos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onDown = (e: PointerEvent) => {
      const { x, y } = pos(e);
      const hit = pick(x, y);
      if (hit) {
        stateRef.current.drag = hit;
        canvas.setPointerCapture(e.pointerId);
      }
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = pos(e);
      if (stateRef.current.drag) {
        stateRef.current.drag.x = x;
        stateRef.current.drag.y = y;
        stateRef.current.drag.vx = 0;
        stateRef.current.drag.vy = 0;
      }
    };
    const onUp = (e: PointerEvent) => {
      const wasDrag = stateRef.current.drag;
      stateRef.current.drag = null;
      const { x, y } = pos(e);
      const hit = pick(x, y);
      if (hit && hit === wasDrag) {
        const next = stateRef.current.selected === hit.id ? null : hit.id;
        stateRef.current.selected = next;
        setActive(next);
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        {(["skill", "project", "tech"] as NType[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5 capitalize text-gray-400">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: COLORS[t], boxShadow: `0 0 8px ${COLORS[t]}` }}
            />
            {t}s
          </span>
        ))}
        <span className="ml-auto text-gray-600">drag nodes · click to focus</span>
      </div>
      <canvas
        ref={canvasRef}
        data-cursor="neural"
        className="h-[420px] w-full rounded-xl border border-white/10 bg-[#04060f] touch-none"
      />
      <p className="mt-3 text-xs text-gray-500">
        {active ? (
          <>
            Focused on <span className="text-primary">{active}</span> — highlighting
            its direct connections. Click again to release.
          </>
        ) : (
          "Live force simulation: charge repulsion, spring-linked edges, and a centering force keep the graph self-organizing."
        )}
      </p>
    </div>
  );
}
