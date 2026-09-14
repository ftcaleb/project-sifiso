'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { Application, SPEObject } from '@splinetool/runtime';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });
const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

const SCENE = process.env.NEXT_PUBLIC_SPLINE_SCENE;

/**
 * Hero canvas switch.
 *  - With NEXT_PUBLIC_SPLINE_SCENE set: mounts the Spline scene. If the scene
 *    contains an object named "Rig", it is steered by the cursor from here
 *    (in addition to any Look At / Follow events authored in Spline).
 *  - Without it: the procedural react-three-fiber spatial grid.
 */
export function SplineHero() {
  const app = useRef<Application | null>(null);
  const rig = useRef<SPEObject | null>(null);

  useEffect(() => {
    if (!SCENE) return;
    const onMove = (e: MouseEvent) => {
      if (!rig.current) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      rig.current.rotation.y = nx * 0.25;
      rig.current.rotation.x = ny * -0.08;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (SCENE) {
    return (
      <div className="absolute inset-0">
        <Spline
          scene={SCENE}
          className="h-full w-full"
          renderOnDemand={false}
          onLoad={(a: Application) => {
            app.current = a;
            rig.current = a.findObjectByName('Rig') ?? null;
          }}
        />
      </div>
    );
  }

  return <Hero3D />;
}
