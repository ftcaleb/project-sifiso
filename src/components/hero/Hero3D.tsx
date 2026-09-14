'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, Line } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural spatial grid / city model. Monochrome by design: the hero's one
 * Blueprint element is the CTA, so the model stays graphite, stone and warm.
 * Cursor movement steers the rig (look-at parallax); the model also rotates
 * slowly and a radar ring sweeps outward. Rendering pauses when off-screen.
 */

const N = 28;
const SPACING = 1.05;

function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function useBlocks() {
  return useMemo(() => {
    const items: { x: number; z: number; h: number; s: number }[] = [];
    const half = (N - 1) / 2;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = (i - half) * SPACING;
        const z = (j - half) * SPACING;
        const r = Math.sqrt(x * x + z * z) / (half * SPACING);
        const rnd = seeded(i * N + j);
        // leave roads: every 5th row/col is empty
        if (i % 5 === 2 || j % 5 === 2) continue;
        const falloff = Math.max(0, 1 - r * 1.15);
        let h = (0.15 + rnd * 1.6) * falloff + 0.08;
        if (rnd > 0.955 && falloff > 0.35) h *= 2.6;
        items.push({ x, z, h, s: 0.62 + seeded(i + j * 7) * 0.22 });
      }
    }
    return items;
  }, []);
}

function City({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.InstancedMesh>(null);
  const wire = useRef<THREE.InstancedMesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const blocks = useBlocks();
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    blocks.forEach((b, i) => {
      p.set(b.x, b.h / 2, b.z);
      s.set(b.s, b.h, b.s);
      m.compose(p, q, s);
      solid.current?.setMatrixAt(i, m);
      wire.current?.setMatrixAt(i, m);
    });
    if (solid.current) solid.current.instanceMatrix.needsUpdate = true;
    if (wire.current) wire.current.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  const towers = useMemo(() => [...blocks].sort((a, b) => b.h - a.h).slice(0, 9), [blocks]);
  const arcs = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (let i = 0; i < towers.length - 1; i++) {
      const a = towers[i];
      const b = towers[i + 1];
      const start = new THREE.Vector3(a.x, a.h, a.z);
      const end = new THREE.Vector3(b.x, b.h, b.z);
      const mid = start.clone().lerp(end, 0.5);
      mid.y += start.distanceTo(end) * 0.35 + 1;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      out.push(curve.getPoints(24));
    }
    return out;
  }, [towers]);

  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    if (!group.current) return;
    const px = pointer.current.x;
    const py = pointer.current.y;
    const baseY = reduce ? 0.6 : t.current * 0.045 + 0.6;
    const targetY = baseY + px * 0.28;
    const targetX = -0.02 + py * -0.06;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
    group.current.position.x += (px * 0.6 - group.current.position.x) * 0.05;

    if (ring.current) {
      const period = 6;
      const k = (t.current % period) / period;
      const sc = 0.5 + k * 16;
      ring.current.scale.set(sc, sc, 1);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.35;
    }
  });

  return (
    <group ref={group} rotation={[-0.02, 0.6, 0]}>
      <Grid
        position={[0, 0.001, 0]}
        args={[40, 40]}
        cellSize={SPACING}
        cellThickness={0.6}
        cellColor="#2A2D33"
        sectionSize={SPACING * 5}
        sectionThickness={1}
        sectionColor="#8A8D93"
        fadeDistance={26}
        fadeStrength={1.8}
        infiniteGrid
      />
      <instancedMesh ref={solid} args={[undefined, undefined, blocks.length]} castShadow={false} receiveShadow={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#14161A" roughness={0.95} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={wire} args={[undefined, undefined, blocks.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#8A8D93" wireframe transparent opacity={0.16} />
      </instancedMesh>
      {arcs.map((pts, i) => (
        <Line key={i} points={pts} color="#EDEBE4" transparent opacity={0.22} lineWidth={1} />
      ))}
      {towers.map((tw, i) => (
        <mesh key={i} position={[tw.x, tw.h + 0.05, tw.z]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#EDEBE4" />
        </mesh>
      ))}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.98, 1, 96]} />
        <meshBasicMaterial color="#EDEBE4" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Hero3D() {
  const pointer = useRef({ x: 0, y: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener('mousemove', onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 7.5, 13.5], fov: 36, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#0B0C0E', 1);
          camera.lookAt(0, 0.4, 0);
        }}
      >
        <fog attach="fog" args={['#0B0C0E', 11, 30]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 12, 4]} intensity={1.6} color="#EDEBE4" />
        <directionalLight position={[-8, 4, -6]} intensity={0.35} color="#8A8D93" />
        <City pointer={pointer} />
      </Canvas>
    </div>
  );
}

export default Hero3D;
