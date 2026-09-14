'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Reticle cursor. Springs are permitted here because this is cursor-following,
 * not a reveal (investigation flag F-3).
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'default' | 'link' | 'hidden'>('hidden');
  const [label, setLabel] = useState<string>('');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const hit = target?.closest('a, button, [role="button"], [data-cursor]') as HTMLElement | null;
      if (hit) {
        setMode('link');
        setLabel(hit.dataset.cursor ?? '');
      } else {
        setMode('default');
        setLabel('');
      }
    };
    const leave = () => setMode('hidden');
    const enter = () => setMode('default');
    window.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ring = mode === 'link' ? 44 : 28;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy, opacity: mode === 'hidden' ? 0 : 1 }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* ring */}
        <motion.div
          className="rounded-full border border-warm"
          animate={{ width: ring, height: ring, opacity: mode === 'link' ? 1 : 0.7 }}
          transition={{ duration: 0.24, ease: [0.215, 0.61, 0.355, 1] }}
          style={{ marginLeft: -ring / 2, marginTop: -ring / 2, position: 'absolute', left: 0, top: 0 }}
        />
        {/* crosshair */}
        <div className="absolute left-0 top-0 h-px w-3 -translate-x-1/2 bg-warm" style={{ marginTop: -0.5 }} />
        <div className="absolute left-0 top-0 h-3 w-px -translate-y-1/2 bg-warm" style={{ marginLeft: -0.5 }} />
        {/* ticks */}
        <div className="absolute left-0 top-0 h-px w-2 bg-warm" style={{ transform: `translate(${ring / 2 + 4}px, -0.5px)` }} />
        <div className="absolute left-0 top-0 h-px w-2 bg-warm" style={{ transform: `translate(${-ring / 2 - 12}px, -0.5px)` }} />
        {label && (
          <div className="label absolute left-6 top-4 whitespace-nowrap text-warm">{label}</div>
        )}
      </div>
    </motion.div>
  );
}
