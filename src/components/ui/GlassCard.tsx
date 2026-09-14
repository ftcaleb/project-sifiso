'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { cn, EASE_EXPO } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'article' | 'li';
};

/**
 * Glassmorphic panel: one hairline border. On hover the border alone glows in
 * Blueprint, following the cursor (Magic UI spotlight mechanism, spring
 * stiffness 250 / damping 30 / mass 0.6, 200px radius). The fill never turns blue.
 */
export function GlassCard({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const x = useSpring(mx, { stiffness: 250, damping: 30, mass: 0.6 });
  const y = useSpring(my, { stiffness: 250, damping: 30, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(220px circle at ${x}px ${y}px, rgba(29,78,137,0.9), rgba(29,78,137,0.25) 40%, transparent 70%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const onLeave = () => {
    mx.set(-400);
    my.set(-400);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      className={cn('group relative isolate transition-transform duration-380 ease-expo hover:-translate-y-0.5', className)}
    >
      {/* Blueprint ring: visible only through the 1px border area */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px -z-20 opacity-0 transition-opacity duration-380 ease-cubic group-hover:opacity-100"
        style={{ background: glow }}
      />
      {/* Glass body sits above the ring so only the border shows the glow */}
      <div className="glass absolute inset-0 -z-10 transition-colors duration-380 ease-cubic group-hover:border-transparent" />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
