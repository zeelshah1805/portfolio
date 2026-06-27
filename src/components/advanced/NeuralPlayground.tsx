"use client";

import { useEffect, useRef, useState } from "react";

/* ----------------------------------------------------------------
   A real, tiny multi-layer perceptron trained in the browser with
   actual forward + backprop (no scripted fakery). It learns to
   separate a 2D dataset; the decision boundary and loss curve update
   live as gradient descent runs.
-----------------------------------------------------------------*/

type Dataset = "spiral" | "circle" | "xor";

function makeData(kind: Dataset, n = 220): { x: number[]; y: number }[] {
  const pts: { x: number[]; y: number }[] = [];
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  if (kind === "spiral") {
    const per = n / 2;
    for (let c = 0; c < 2; c++) {
      for (let i = 0; i < per; i++) {
        const r = (i / per) * 0.9;
        const t = ((i / per) * 3 + c * Math.PI) * 1.2 + rnd(-0.15, 0.15);
        pts.push({ x: [r * Math.sin(t), r * Math.cos(t)], y: c });
      }
    }
  } else if (kind === "circle") {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2);
      const inner = Math.random() < 0.5;
      const r = inner ? rnd(0, 0.4) : rnd(0.6, 0.95);
      pts.push({ x: [r * Math.cos(a), r * Math.sin(a)], y: inner ? 1 : 0 });
    }
  } else {
    for (let i = 0; i < n; i++) {
      const px = rnd(-0.9, 0.9);
      const py = rnd(-0.9, 0.9);
      pts.push({ x: [px, py], y: px * py > 0 ? 1 : 0 });
    }
  }
  return pts;
}

// Dense layer
class Dense {
  W: number[][];
  b: number[];
  input: number[] = [];
  z: number[] = [];
  out: number[] = [];
  constructor(inN: number, outN: number) {
    const scale = Math.sqrt(2 / inN);
    this.W = Array.from({ length: outN }, () =>
      Array.from({ length: inN }, () => (Math.random() * 2 - 1) * scale)
    );
    this.b = Array.from({ length: outN }, () => 0);
  }
  forward(x: number[], act: "tanh" | "sigmoid") {
    this.input = x;
    this.z = this.W.map((row, j) => row.reduce((s, w, i) => s + w * x[i], this.b[j]));
    this.out = this.z.map((v) => (act === "tanh" ? Math.tanh(v) : 1 / (1 + Math.exp(-v))));
    return this.out;
  }
}

class MLP {
  layers: Dense[];
  acts: ("tanh" | "sigmoid")[];
  constructor(sizes: number[]) {
    this.layers = [];
    this.acts = [];
    for (let i = 0; i < sizes.length - 1; i++) {
      this.layers.push(new Dense(sizes[i], sizes[i + 1]));
      this.acts.push(i === sizes.length - 2 ? "sigmoid" : "tanh");
    }
  }
  predict(x: number[]) {
    let a = x;
    this.layers.forEach((l, i) => (a = l.forward(a, this.acts[i])));
    return a[0];
  }
  trainStep(data: { x: number[]; y: number }[], lr: number) {
    let loss = 0;
    // accumulate gradients
    const gW = this.layers.map((l) => l.W.map((r) => r.map(() => 0)));
    const gB = this.layers.map((l) => l.b.map(() => 0));

    for (const { x, y } of data) {
      const p = this.predict(x);
      const eps = 1e-7;
      loss += -(y * Math.log(p + eps) + (1 - y) * Math.log(1 - p + eps));

      // backprop: start with dL/dz for output (sigmoid+BCE => p - y)
      let delta = [p - y];
      for (let li = this.layers.length - 1; li >= 0; li--) {
        const layer = this.layers[li];
        for (let j = 0; j < layer.W.length; j++) {
          gB[li][j] += delta[j];
          for (let i = 0; i < layer.W[j].length; i++) {
            gW[li][j][i] += delta[j] * layer.input[i];
          }
        }
        if (li > 0) {
          const prev = this.layers[li - 1];
          const newDelta = new Array(prev.out.length).fill(0);
          for (let i = 0; i < prev.out.length; i++) {
            let s = 0;
            for (let j = 0; j < layer.W.length; j++) s += layer.W[j][i] * delta[j];
            // tanh derivative
            newDelta[i] = s * (1 - prev.out[i] * prev.out[i]);
          }
          delta = newDelta;
        }
      }
    }
    const m = data.length;
    this.layers.forEach((l, li) => {
      for (let j = 0; j < l.W.length; j++) {
        l.b[j] -= (lr * gB[li][j]) / m;
        for (let i = 0; i < l.W[j].length; i++) l.W[j][i] -= (lr * gW[li][j][i]) / m;
      }
    });
    return loss / m;
  }
}

export default function NeuralPlayground() {
  const boundaryRef = useRef<HTMLCanvasElement>(null);
  const lossRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<Dataset>("spiral");
  const [running, setRunning] = useState(true);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [acc, setAcc] = useState(0);

  const stateRef = useRef<{
    net: MLP;
    data: { x: number[]; y: number }[];
    history: number[];
    epoch: number;
  } | null>(null);

  // (re)initialize whenever dataset changes
  useEffect(() => {
    stateRef.current = {
      net: new MLP([2, 10, 8, 1]),
      data: makeData(dataset),
      history: [],
      epoch: 0,
    };
    setEpoch(0);
    setRunning(true);
  }, [dataset]);

  useEffect(() => {
    const bCanvas = boundaryRef.current;
    const lCanvas = lossRef.current;
    if (!bCanvas || !lCanvas) return;
    const bx = bCanvas.getContext("2d");
    const lx = lCanvas.getContext("2d");
    if (!bx || !lx) return;

    const SIZE = 300;
    const GRID = 44;
    let raf = 0;
    let frame = 0;

    const toPx = (v: number) => ((v + 1) / 2) * SIZE;

    const drawBoundary = () => {
      const st = stateRef.current;
      if (!st) return;
      const cell = SIZE / GRID;
      for (let gx = 0; gx < GRID; gx++) {
        for (let gy = 0; gy < GRID; gy++) {
          const x = (gx / (GRID - 1)) * 2 - 1;
          const y = (gy / (GRID - 1)) * 2 - 1;
          const p = st.net.predict([x, y]);
          // blend cyan (0) -> purple (1)
          const r = Math.round(0 + p * 139);
          const g = Math.round(217 - p * 125);
          const b = Math.round(255 - p * 9);
          bx.fillStyle = `rgba(${r},${g},${b},${0.16 + Math.abs(p - 0.5) * 0.28})`;
          bx.fillRect(gx * cell, SIZE - (gy + 1) * cell, cell + 1, cell + 1);
        }
      }
      // data points
      let correct = 0;
      for (const { x, y } of st.data) {
        const p = st.net.predict(x);
        if (Math.round(p) === y) correct++;
        bx.beginPath();
        bx.arc(toPx(x[0]), SIZE - toPx(x[1]), 3, 0, Math.PI * 2);
        bx.fillStyle = y === 1 ? "#8B5CF6" : "#00D9FF";
        bx.shadowColor = y === 1 ? "#8B5CF6" : "#00D9FF";
        bx.shadowBlur = 6;
        bx.fill();
      }
      bx.shadowBlur = 0;
      return correct / st.data.length;
    };

    const drawLoss = () => {
      const st = stateRef.current;
      if (!st) return;
      const w = lCanvas.width;
      const h = lCanvas.height;
      lx.clearRect(0, 0, w, h);
      const hist = st.history;
      if (hist.length < 2) return;
      const max = Math.max(...hist);
      lx.beginPath();
      hist.forEach((v, i) => {
        const px = (i / (hist.length - 1)) * w;
        const py = h - (v / max) * (h - 8) - 4;
        i === 0 ? lx.moveTo(px, py) : lx.lineTo(px, py);
      });
      lx.strokeStyle = "#00FFAA";
      lx.lineWidth = 2;
      lx.shadowColor = "#00FFAA";
      lx.shadowBlur = 8;
      lx.stroke();
      lx.shadowBlur = 0;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const st = stateRef.current;
      if (!st) return;
      if (running) {
        // several gradient steps per frame to speed convergence
        let l = 0;
        for (let s = 0; s < 3; s++) l = st.net.trainStep(st.data, 0.4);
        st.epoch += 3;
        st.history.push(l);
        if (st.history.length > 200) st.history.shift();
        if (frame % 2 === 0) {
          const a = drawBoundary();
          drawLoss();
          setEpoch(st.epoch);
          setLoss(l);
          if (a !== undefined) setAcc(a);
        }
      }
      frame++;
    };
    // initial render even if paused
    drawBoundary();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const reset = () => {
    const st = stateRef.current;
    if (st) {
      st.net = new MLP([2, 10, 8, 1]);
      st.history = [];
      st.epoch = 0;
      setEpoch(0);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center">
        <canvas
          ref={boundaryRef}
          width={300}
          height={300}
          className="rounded-xl border border-white/10 bg-[#04060f]"
        />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {(["spiral", "circle", "xor"] as Dataset[]).map((d) => (
            <button
              key={d}
              data-cursor="button"
              onClick={() => setDataset(d)}
              className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                dataset === d
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Epoch" value={epoch.toString()} />
          <Stat label="Loss" value={loss.toFixed(3)} accent />
          <Stat label="Accuracy" value={`${(acc * 100).toFixed(0)}%`} accent />
        </div>

        <div className="glass mt-4 flex-1 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
              Training Loss (live BCE)
            </span>
          </div>
          <canvas ref={lossRef} width={380} height={110} className="w-full" />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            data-cursor="button"
            onClick={() => setRunning((r) => !r)}
            className="flex-1 rounded-full bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-semibold text-[#04060f]"
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            data-cursor="button"
            onClick={reset}
            className="flex-1 rounded-full border border-white/15 py-2.5 text-sm text-gray-200 hover:border-white/40"
          >
            Reinitialize
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          A 2-10-8-1 MLP (tanh + sigmoid) trained with real mini-batch gradient
          descent on binary cross-entropy. The shaded field is the live decision
          boundary — everything runs client-side via{" "}
          <span className="text-primary">requestAnimationFrame</span>.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass p-3 text-center">
      <div className={`text-xl font-bold ${accent ? "text-accent" : "text-white"} font-mono`}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
    </div>
  );
}
