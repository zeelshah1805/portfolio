"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/* ----------------------------------------------------------------
   GPU cluster visualization with a custom GLSL "latent field" shader
   plane behind animated compute nodes exchanging data packets.
-----------------------------------------------------------------*/

const N = 8;
const RADIUS = 3.2;

const nodePositions: THREE.Vector3[] = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS * 0.7, 0);
});
const hub = new THREE.Vector3(0, 0, 0);

// edges: hub<->node and ring neighbors
const edges: [THREE.Vector3, THREE.Vector3][] = [];
nodePositions.forEach((p, i) => {
  edges.push([hub, p]);
  edges.push([p, nodePositions[(i + 1) % N]]);
});

// ---- Custom shader: flowing latent / embedding field ----
const fieldShader = {
  uniforms: { uTime: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1.,0.)), u.x),
                 mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
      return v;
    }
    void main(){
      vec2 uv = (vUv - 0.5) * 4.0;
      float t = uTime * 0.12;
      float f = fbm(uv + vec2(t, -t*0.7) + fbm(uv*1.5 - t)*0.6);
      vec3 cyan = vec3(0.0, 0.85, 1.0);
      vec3 purple = vec3(0.545, 0.36, 0.96);
      vec3 col = mix(purple, cyan, smoothstep(0.3, 0.8, f));
      float glow = pow(f, 3.0) * 1.4;
      float vignette = smoothstep(1.4, 0.2, length(vUv - 0.5) * 2.0);
      gl_FragColor = vec4(col * glow * vignette, glow * vignette * 0.5);
    }
  `,
};

function LatentField() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...fieldShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );
  useFrame((s) => {
    material.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0, -2]} material={material}>
      <planeGeometry args={[16, 10]} />
    </mesh>
  );
}

function Node({ pos, util, idx }: { pos: THREE.Vector3; util: number; idx: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(s.clock.elapsedTime * 2 + idx) * 0.08;
      ref.current.scale.setScalar(pulse);
    }
  });
  return (
    <group position={pos}>
      <mesh ref={ref}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <Html center distanceFactor={10} position={[0, -0.7, 0]}>
        <div className="whitespace-nowrap rounded bg-[#04060f]/80 px-1.5 py-0.5 font-mono text-[9px] text-accent">
          GPU{idx} · {util}%
        </div>
      </Html>
    </group>
  );
}

function Edges() {
  const geo = useMemo(() => {
    const positions: number[] = [];
    edges.forEach(([a, b]) => positions.push(a.x, a.y, a.z, b.x, b.y, b.z));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
    </lineSegments>
  );
}

function Packets() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const packets = useMemo(
    () =>
      edges.flatMap((_, i) =>
        Array.from({ length: 2 }, (_, k) => ({
          edge: i,
          t: Math.random(),
          speed: 0.3 + Math.random() * 0.4,
          dir: k === 0 ? 1 : -1,
        }))
      ),
    []
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    packets.forEach((p, i) => {
      p.t += delta * p.speed * p.dir;
      if (p.t > 1) p.t = 0;
      if (p.t < 0) p.t = 1;
      const [a, b] = edges[p.edge];
      dummy.position.lerpVectors(a, b, p.t);
      dummy.scale.setScalar(0.12);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, packets.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#00FFAA" toneMapped={false} />
    </instancedMesh>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const utils = useMemo(() => nodePositions.map(() => 70 + Math.floor(Math.random() * 28)), []);
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.1) * 0.1;
      group.current.rotation.x = s.pointer.y * 0.2;
      group.current.rotation.y = s.pointer.x * 0.3;
    }
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 6]} intensity={2} color="#00D9FF" />
      <LatentField />
      <group ref={group}>
        <Edges />
        <Packets />
        {/* hub */}
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.7}
            wireframe
          />
        </mesh>
        {nodePositions.map((p, i) => (
          <Node key={i} pos={p} util={utils[i]} idx={i} />
        ))}
      </group>
    </>
  );
}

export default function GPUCluster() {
  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#04060f]">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] text-gray-500">
        custom GLSL latent field · {N} nodes · live packet routing
      </div>
    </div>
  );
}
