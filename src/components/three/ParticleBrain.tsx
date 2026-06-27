"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BrainPoints() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const count = 2600;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cA = new THREE.Color("#00D9FF");
    const cB = new THREE.Color("#8B5CF6");
    const cC = new THREE.Color("#00FFAA");

    for (let i = 0; i < count; i++) {
      // Two hemispheres forming a brain-like shape with surface noise
      const side = i % 2 === 0 ? 1 : -1;
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);

      const noise = 1 + (Math.sin(theta * 6) * Math.cos(phi * 5)) * 0.12;
      const r = 1.6 * noise;

      let x = r * Math.sin(phi) * Math.cos(theta) * 0.78 + side * 0.55;
      let y = r * Math.cos(phi) * 0.95;
      let z = r * Math.sin(phi) * Math.sin(theta);

      // squash to brain proportions and add folds
      y += Math.sin(x * 4) * 0.06;
      z *= 1.05;

      positions.set([x, y, z], i * 3);

      const mix = Math.random();
      const col =
        mix < 0.5 ? cA.clone().lerp(cB, mix * 2) : cB.clone().lerp(cC, (mix - 0.5) * 2);
      colors.set([col.r, col.g, col.b], i * 3);
    }
    return { positions, colors };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.25;
      ref.current.rotation.z = Math.sin(t * 0.2) * 0.08;
      // gentle parallax
      ref.current.rotation.x += (state.pointer.y * 0.3 - ref.current.rotation.x) * 0.05;
    }
    if (matRef.current) {
      matRef.current.size = 0.028 + Math.sin(t * 2) * 0.004;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        vertexColors
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Orbiting synapse rings
function Synapses() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = -state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });
  return (
    <group ref={ref}>
      {[2.2, 2.6, 3].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.5, i * 0.7, 0]}>
          <torusGeometry args={[r, 0.006, 8, 100]} />
          <meshBasicMaterial
            color={i === 0 ? "#00D9FF" : i === 1 ? "#8B5CF6" : "#00FFAA"}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleBrain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <BrainPoints />
      <Synapses />
    </Canvas>
  );
}
