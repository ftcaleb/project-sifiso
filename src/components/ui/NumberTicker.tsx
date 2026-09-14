'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

type Common = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

function fmt(n: number, decimals: number) {
  // en-US grouping/decimal so figures read "R2.4B" and "14,000" as specified.
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

/**
 * Count-up on first viewport entry. Spring damping 60 / stiffness 100
 * (Magic UI number-ticker; matches NVIDIA "metric counter, first entry only").
 */
export function NumberTicker({ value, prefix = '', suffix = '', decimals = 0, className = '', delay = 0 }: Common & { delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 60, stiffness: 100 });
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => mv.set(value), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay, mv]);

  useEffect(
    () =>
      spring.on('change', (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${fmt(Number(v.toFixed(decimals)), decimals)}${suffix}`;
      }),
    [spring, prefix, suffix, decimals],
  );

  return (
    <span ref={ref} className={`tnum inline-block ${className}`}>
      {prefix}
      {fmt(0, decimals)}
      {suffix}
    </span>
  );
}

/**
 * Scroll-scrubbed readout: ticks up as the user scrolls the target range
 * (MERIDIAN™ live readouts). Pure scroll position → value, no spring.
 */
export function ScrollTicker({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  target,
  from = 0,
}: Common & { target: React.RefObject<HTMLElement>; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ['start 85%', 'end 35%'] });
  const v = useTransform(scrollYProgress, [0, 1], [from, value]);
  useMotionValueEvent(v, 'change', (latest) => {
    if (ref.current) ref.current.textContent = `${prefix}${fmt(Number(latest.toFixed(decimals)), decimals)}${suffix}`;
  });
  return (
    <span ref={ref} className={`tnum inline-block ${className}`}>
      {prefix}
      {fmt(from, decimals)}
      {suffix}
    </span>
  );
}
