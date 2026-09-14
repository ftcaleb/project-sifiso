'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  className?: string;
  /** ScrollTrigger start/end */
  start?: string;
  end?: string;
  /** scrub smoothing seconds; false = play once on enter */
  scrub?: number | boolean;
  stagger?: number;
};

/**
 * Scroll-driven SVG stroke drawing. Every path/line/polyline/circle inside is
 * measured, dashed to its own length, then its dashoffset is scrubbed to 0 by
 * GSAP ScrollTrigger as the wrapper crosses the viewport.
 */
export function PathDraw({ children, className, start = 'top 85%', end = 'bottom 45%', scrub = 0.6, stagger = 0.08 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const shapes = Array.from(root.querySelectorAll<SVGGeometryElement>('path, line, polyline, polygon, circle, rect'));
    if (!shapes.length) return;

    shapes.forEach((s) => {
      const len = typeof s.getTotalLength === 'function' ? s.getTotalLength() : 0;
      if (!len) return;
      s.style.strokeDasharray = `${len}`;
      s.style.strokeDashoffset = `${len}`;
    });

    const ctx = gsap.context(() => {
      gsap.to(shapes, {
        strokeDashoffset: 0,
        ease: 'none',
        stagger,
        scrollTrigger: {
          trigger: root,
          start,
          end,
          scrub,
        },
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [start, end, scrub, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
