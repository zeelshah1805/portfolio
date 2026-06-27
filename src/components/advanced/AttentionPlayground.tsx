"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ----------------------------------------------------------------
   A transformer self-attention visualizer. Tokens get deterministic
   pseudo-embeddings; we compute real scaled dot-product attention
   (Q·Kᵀ / √d → softmax) per head and render the weights as a heatmap
   plus weighted connection arcs.
-----------------------------------------------------------------*/

const HEADS = 4;
const DIM = 24; // embedding dim
const HEAD_DIM = DIM / HEADS;

function hash(str: string, seed: number) {
  let h = seed ^ 0x9e3779b9;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x85ebca6b);
    h ^= h >>> 13;
  }
  return h >>> 0;
}

function embed(token: string): number[] {
  // deterministic vector in [-1,1]
  return Array.from({ length: DIM }, (_, i) => {
    const r = hash(token.toLowerCase(), i * 2654435761);
    return ((r % 2000) / 1000 - 1) * 0.9;
  });
}

function softmax(arr: number[]) {
  const m = Math.max(...arr);
  const ex = arr.map((v) => Math.exp(v - m));
  const s = ex.reduce((a, b) => a + b, 0);
  return ex.map((v) => v / s);
}

function attention(tokens: string[], head: number): number[][] {
  const embs = tokens.map(embed);
  const start = head * HEAD_DIM;
  // small random-but-fixed per-head projection mixing
  const proj = (v: number[], salt: number) =>
    Array.from({ length: HEAD_DIM }, (_, i) => {
      let s = 0;
      for (let k = 0; k < DIM; k++) {
        const w = ((hash(`${head}-${i}-${k}-${salt}`, 7) % 2000) / 1000 - 1) * 0.4;
        s += v[k] * w;
      }
      return s;
    });
  const Q = embs.map((e) => proj(e, 1));
  const K = embs.map((e) => proj(e, 2));
  const scale = Math.sqrt(HEAD_DIM);
  return Q.map((q) => {
    const scores = K.map((k) => k.reduce((s, kv, i) => s + kv * q[i], 0) / scale);
    return softmax(scores);
  });
}

export default function AttentionPlayground() {
  const [text, setText] = useState("the cat sat on the mat");
  const [head, setHead] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const tokens = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).slice(0, 10),
    [text]
  );
  const weights = useMemo(
    () => (tokens.length ? attention(tokens, head) : []),
    [tokens, head]
  );

  const n = tokens.length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: input + token flow */}
      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-gray-400">
          Input sequence
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-cursor="button"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:shadow-glow"
          placeholder="Type a sentence..."
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {(["the cat sat on the mat", "attention is all you need", "models learn from data"]).map(
            (ex) => (
              <button
                key={ex}
                data-cursor="button"
                onClick={() => setText(ex)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400 hover:text-primary"
              >
                {ex}
              </button>
            )
          )}
        </div>

        <div className="mt-5">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
            Heads
          </span>
          <div className="mt-2 flex gap-2">
            {Array.from({ length: HEADS }).map((_, h) => (
              <button
                key={h}
                data-cursor="button"
                onClick={() => setHead(h)}
                className={`h-9 w-9 rounded-lg font-mono text-sm transition-colors ${
                  head === h
                    ? "bg-secondary/30 text-secondary border border-secondary/50"
                    : "border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {h + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Token connection arcs */}
        <div className="mt-6 rounded-xl border border-white/10 bg-[#04060f] p-4">
          <svg viewBox={`0 0 ${Math.max(n * 70, 120)} 150`} className="w-full">
            {/* arcs */}
            {weights.map((row, i) =>
              row.map((w, j) => {
                if (i === j || w < 0.08) return null;
                if (selected !== null && selected !== i) return null;
                const x1 = 35 + i * 70;
                const x2 = 35 + j * 70;
                const mid = (x1 + x2) / 2;
                return (
                  <path
                    key={`${i}-${j}`}
                    d={`M ${x1} 110 Q ${mid} ${110 - Math.abs(x2 - x1) * 0.5 - 20} ${x2} 110`}
                    fill="none"
                    stroke="#00D9FF"
                    strokeWidth={w * 4}
                    strokeOpacity={w}
                  />
                );
              })
            )}
            {/* token nodes */}
            {tokens.map((t, i) => (
              <g
                key={i}
                onMouseEnter={() => setSelected(i)}
                onMouseLeave={() => setSelected(null)}
                style={{ cursor: "none" }}
              >
                <circle cx={35 + i * 70} cy={110} r={6} fill="#8B5CF6" />
                <text
                  x={35 + i * 70}
                  y={134}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="monospace"
                  fill={selected === i ? "#00D9FF" : "#9ca3af"}
                >
                  {t.length > 8 ? t.slice(0, 8) : t}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-1 text-center text-[10px] text-gray-600">
            hover a token to isolate its attention
          </p>
        </div>
      </div>

      {/* Right: heatmap */}
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Attention matrix · head {head + 1}
        </span>
        <div className="mt-3 overflow-x-auto">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `60px repeat(${n}, minmax(28px, 1fr))` }}
          >
            <div />
            {tokens.map((t, j) => (
              <div
                key={j}
                className="truncate text-center font-mono text-[10px] text-gray-500"
                title={t}
              >
                {t.slice(0, 5)}
              </div>
            ))}
            {weights.map((row, i) => (
              <Row key={i} token={tokens[i]} row={row} highlight={selected === i} />
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-500">
          Each row is a query token; cells show softmax(
          <span className="text-primary">QKᵀ/√d</span>) attention paid to every
          key token. Switch heads to see different learned relationship patterns.
        </p>
      </div>
    </div>
  );
}

function Row({
  token,
  row,
  highlight,
}: {
  token: string;
  row: number[];
  highlight: boolean;
}) {
  return (
    <>
      <div
        className={`truncate font-mono text-[10px] ${
          highlight ? "text-primary" : "text-gray-500"
        } self-center text-right pr-1`}
        title={token}
      >
        {token.slice(0, 7)}
      </div>
      {row.map((w, j) => (
        <motion.div
          key={j}
          initial={false}
          animate={{ opacity: 1 }}
          className="grid aspect-square place-items-center rounded text-[9px] font-mono"
          style={{
            background: `rgba(0,217,255,${0.05 + w * 0.85})`,
            color: w > 0.4 ? "#04060f" : "#6b7280",
            boxShadow: highlight ? "0 0 0 1px rgba(0,217,255,0.4)" : "none",
          }}
        >
          {w > 0.15 ? w.toFixed(2).slice(1) : ""}
        </motion.div>
      ))}
    </>
  );
}
