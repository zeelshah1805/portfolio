"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 90;
const MAX_DIST = 2.4;

function NeuralGraph() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Generate node positions within a sphere
  const { positions, basePositions, phases } = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 3);
    const basePositions = new Float32Array(NODE_COUNT * 3);
    const phases = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const z = r * Math.cos(phi);
      positions.set([x, y, z], i * 3);
      basePositions.set([x, y, z], i * 3);
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, basePositions, phases };
  }, []);

  const lineGeo = useMemo(() => new THREE.BufferGeometry(), []);
  const linePositions = useMemo(
    () => new Float32Array(NODE_COUNT * NODE_COUNT * 3),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const posAttr = pointsRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;

    // Pulse / drift nodes
    if (posAttr) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const idx = i * 3;
        const drift = Math.sin(t * 0.5 + phases[i]) * 0.25;
        positions[idx] = basePositions[idx] + drift;
        positions[idx + 1] = basePositions[idx + 1] + Math.cos(t * 0.4 + phases[i]) * 0.25;
        positions[idx + 2] = basePositions[idx + 2] + drift * 0.5;
      }
      posAttr.array = positions;
      posAttr.needsUpdate = true;
    }

    // Build connection lines
    let ptr = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const ax = positions[i * 3],
        ay = positions[i * 3 + 1],
        az = positions[i * 3 + 2];
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const bx = positions[j * 3],
          by = positions[j * 3 + 1],
          bz = positions[j * 3 + 2];
        const d = Math.hypot(ax - bx, ay - by, az - bz);
        if (d < MAX_DIST) {
          linePositions[ptr++] = ax;
          linePositions[ptr++] = ay;
          linePositions[ptr++] = az;
          linePositions[ptr++] = bx;
          linePositions[ptr++] = by;
          linePositions[ptr++] = bz;
        }
      }
    }
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions.subarray(0, ptr), 3)
    );
    lineGeo.setDrawRange(0, ptr / 3);
    lineGeo.attributes.position.needsUpdate = true;

    // Slow 3D rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;

      // Parallax toward mouse
      const mx = (state.pointer.x * viewport.width) / 14;
      const my = (state.pointer.y * viewport.height) / 14;
      groupRef.current.position.x += (mx - groupRef.current.position.x) * 0.04;
      groupRef.current.position.y += (my - groupRef.current.position.y) * 0.04;
    }
  });

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial
          color="#00D9FF"
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Floating embedding particles (parallax dust)
function EmbeddingDust() {
  const ref = useRef<THREE.Points>(null);
  const count = 240;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.position.x = state.pointer.x * 0.6;
      ref.current.position.y = state.pointer.y * 0.4;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8B5CF6"
        size={0.045}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function NeuralScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <NeuralGraph />
      <EmbeddingDust />
    </Canvas>
  );
}
