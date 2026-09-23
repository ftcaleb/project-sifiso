'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { heroScan } from '@/lib/hero-scan';

/**
 * Procedural city that performs the firm's own service.
 *
 * At rest it is unsurveyed: flat graphite massing, no data. Scrolling drives a
 * survey sweep across it — everything the sweep passes resolves into surveyed
 * stock (edges legible, faces lifted), key assets get tagged, and data lifts
 * off the ground. The camera rises as the survey rolls outward.
 *
 * Accent discipline: at rest the hero's only Blueprint is the CTA. Blueprint
 * appears in the scene only on tagged assets, which is to say only once the
 * user has scrolled and the CTA has left the viewport. The sweep itself is
 * warm white, because it reads as light rather than as data.
 */

const N = 28;
const SPACING = 1.05;
const SCAN_FROM = 17;
const SCAN_TO = -19;

function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type Block = { x: number; z: number; h: number; s: number };

function useBlocks(): Block[] {
  return useMemo(() => {
    const items: Block[] = [];
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

/** Uniforms shared by every material that reacts to the survey. */
function useScanUniforms() {
  return useMemo(
    () => ({
      uScan: { value: SCAN_FROM },
      uTime: { value: 0 },
      /** 0 = idle sweep, band only. 1 = scroll-driven, surveyed state persists. */
      uPersist: { value: 0 },
      uWarm: { value: new THREE.Color('#EDEBE4') },
      uAccent: { value: new THREE.Color('#1D4E89') },
    }),
    [],
  );
}

/**
 * Patches a standard material so the survey is evaluated per fragment in world
 * space. Doing it on the GPU means one uniform drives ~700 instances with no
 * per-instance CPU work and no buffer uploads while scrolling.
 */
function patchForScan(
  material: THREE.Material,
  uniforms: ReturnType<typeof useScanUniforms>,
  opts: { lift: number; band: number; alpha: number },
) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.uniforms.uLift = { value: opts.lift };
    shader.uniforms.uBand = { value: opts.band };
    shader.uniforms.uAlpha = { value: opts.alpha };

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec4 iPos = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          iPos = instanceMatrix * iPos;
        #endif
        vWorldPos = (modelMatrix * iPos).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWorldPos;
        uniform float uScan;
        uniform float uPersist;
        uniform float uLift;
        uniform float uBand;
        uniform float uAlpha;
        uniform vec3 uWarm;
        uniform vec3 uAccent;`,
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        float d = vWorldPos.z - uScan;              // > 0 once the sweep has passed
        float surveyed = smoothstep(0.0, 2.2, d) * uPersist;
        float edge = exp(-abs(d) * 1.7);            // the sweep itself, tight
        // surveyed stock resolves rather than washes out
        gl_FragColor.rgb += uWarm * surveyed * uLift;
        gl_FragColor.rgb += uWarm * edge * uBand;
        gl_FragColor.a = clamp(gl_FragColor.a + (surveyed * 0.55 + edge * 0.8) * uAlpha, 0.0, 1.0);`,
      );
  };
  material.needsUpdate = true;
}

function DataMotes({ uniforms, blocks }: { uniforms: ReturnType<typeof useScanUniforms>; blocks: Block[] }) {
  const geo = useMemo(() => {
    const COUNT = 420;
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const b = blocks[Math.floor(seeded(i * 3.1) * blocks.length)];
      pos[i * 3] = b.x + (seeded(i * 5.7) - 0.5) * 0.8;
      pos[i * 3 + 1] = b.h;
      pos[i * 3 + 2] = b.z + (seeded(i * 9.3) - 0.5) * 0.8;
      seed[i] = seeded(i * 1.7);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [blocks]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uScan;
          uniform float uTime;
          uniform float uPersist;
          attribute float aSeed;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float d = p.z - uScan;
            float life = fract(uTime * 0.11 + aSeed);
            p.y += life * 3.4;
            float near = exp(-abs(d) * 0.30);
            float surveyed = smoothstep(0.0, 1.6, d);
            vAlpha = near * surveyed * (1.0 - life) * uPersist;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (1.6 + 5.0 * vAlpha) * (9.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uWarm;
          varying float vAlpha;
          void main() {
            float m = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
            if (vAlpha <= 0.001) discard;
            gl_FragColor = vec4(uWarm, vAlpha * m * 0.85);
          }`,
      }),
    [uniforms],
  );

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

function City({ pointer, reduce }: { pointer: React.MutableRefObject<{ x: number; y: number }>; reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.InstancedMesh>(null);
  const wire = useRef<THREE.InstancedMesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const tagGroup = useRef<THREE.Group>(null);
  const arcGroup = useRef<THREE.Group>(null);
  const blocks = useBlocks();
  const uniforms = useScanUniforms();
  const { camera } = useThree();

  const solidMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#14161A', roughness: 0.95, metalness: 0.05 });
    patchForScan(m, uniforms, { lift: 0.055, band: 0.30, alpha: 0 });
    return m;
  }, [uniforms]);

  const wireMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({ color: '#8A8D93', wireframe: true, transparent: true, opacity: 0.1 });
    patchForScan(m, uniforms, { lift: 0.0, band: 0.55, alpha: 0.42 });
    return m;
  }, [uniforms]);

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

  const towers = useMemo(() => [...blocks].sort((a, b) => b.h - a.h).slice(0, 10), [blocks]);

  const arcs = useMemo(() => {
    const out: { pts: THREE.Vector3[]; z: number }[] = [];
    for (let i = 0; i < towers.length - 1; i++) {
      const a = towers[i];
      const b = towers[i + 1];
      const start = new THREE.Vector3(a.x, a.h, a.z);
      const end = new THREE.Vector3(b.x, b.h, b.z);
      const mid = start.clone().lerp(end, 0.5);
      mid.y += start.distanceTo(end) * 0.35 + 1;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      out.push({ pts: curve.getPoints(24), z: Math.max(a.z, b.z) });
    }
    return out;
  }, [towers]);

  const t = useRef(0);
  const camAim = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    t.current += dt;
    const p = reduce ? 1 : THREE.MathUtils.clamp(heroScan.progress, 0, 1);

    // Before anyone scrolls the city runs its own sweep on a loop, so the page
    // is demonstrating itself on arrival. Scrolling takes the wheel almost
    // immediately, and the survey then persists behind the sweep instead of
    // passing over it.
    const takeover = THREE.MathUtils.clamp(p / 0.04, 0, 1);
    const idle = reduce ? 1 : (t.current % 11) / 11;
    uniforms.uScan.value = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(SCAN_FROM, SCAN_TO, idle),
      THREE.MathUtils.lerp(SCAN_FROM, SCAN_TO, p),
      takeover,
    );
    uniforms.uPersist.value = takeover;
    uniforms.uTime.value = t.current;

    if (group.current) {
      const px = pointer.current.x;
      const py = pointer.current.y;
      const drift = reduce ? 0.6 : t.current * 0.045 + 0.6;
      const targetY = drift + px * 0.28 + p * 0.5;
      const targetX = -0.02 + py * -0.06;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
      group.current.position.x += (px * 0.6 - group.current.position.x) * 0.05;
    }

    // the camera rises and pushes over the city as the survey rolls out
    if (!reduce) {
      const ease = p * p * (3 - 2 * p);
      camera.position.set(
        THREE.MathUtils.lerp(camera.position.x, 0, 0.08),
        THREE.MathUtils.lerp(camera.position.y, 7.5 + ease * 9.5, 0.08),
        THREE.MathUtils.lerp(camera.position.z, 13.5 - ease * 7.5, 0.08),
      );
      camAim.set(0, 0.4 - ease * 0.9, -ease * 3.5);
      camera.lookAt(camAim);
    }

    // tagged assets resolve as the sweep reaches them
    tagGroup.current?.children.forEach((child, i) => {
      const passed = THREE.MathUtils.clamp((towers[i].z - uniforms.uScan.value) / 2.2, 0, 1) * takeover;
      child.scale.setScalar(passed);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = passed;
    });

    arcGroup.current?.children.forEach((child, i) => {
      const passed = THREE.MathUtils.clamp((arcs[i].z - uniforms.uScan.value) / 3, 0, 1) * takeover;
      const mat = (child as THREE.Mesh).material as THREE.Material & { opacity: number };
      if (mat) mat.opacity = passed * 0.3;
    });

    if (ring.current) {
      const period = 6;
      const k = (t.current % period) / period;
      const sc = 0.5 + k * 16;
      ring.current.scale.set(sc, sc, 1);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.3 * (1 - p * 0.6);
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
        fadeDistance={30}
        fadeStrength={1.6}
        infiniteGrid
      />

      <instancedMesh ref={solid} args={[undefined, undefined, blocks.length]} material={solidMat}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>

      <instancedMesh ref={wire} args={[undefined, undefined, blocks.length]} material={wireMat}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>

      <DataMotes uniforms={uniforms} blocks={blocks} />

      <group ref={arcGroup}>
        {arcs.map((a, i) => (
          <Line key={i} points={a.pts} color="#EDEBE4" transparent opacity={0} lineWidth={1} />
        ))}
      </group>

      {/* tagged assets: the scene's only Blueprint, and only after the survey passes */}
      <group ref={tagGroup}>
        {towers.map((tw, i) => (
          <mesh key={i} position={[tw.x, tw.h + 0.12, tw.z]} scale={0}>
            <octahedronGeometry args={[0.13, 0]} />
            <meshBasicMaterial color="#1D4E89" transparent opacity={0} />
          </mesh>
        ))}
      </group>

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
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 });
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
        camera={{ position: [0, 7.5, 13.5], fov: 36, near: 0.1, far: 90 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#0B0C0E', 1);
          camera.lookAt(0, 0.4, 0);
        }}
      >
        <fog attach="fog" args={['#0B0C0E', 12, 34]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 12, 4]} intensity={1.5} color="#EDEBE4" />
        <directionalLight position={[-8, 4, -6]} intensity={0.35} color="#8A8D93" />
        <City pointer={pointer} reduce={reduce} />
      </Canvas>
    </div>
  );
}

export default Hero3D;
