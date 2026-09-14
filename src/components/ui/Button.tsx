'use client';

import Link from 'next/link';
import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'solid' | 'ghost';

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  type?: 'button' | 'submit';
};

/**
 * primary — graphite with hairline; Blueprint shimmer sweeps the border on hover
 *           and the border settles to Blueprint. (NVIDIA: transparent + accent edge.)
 * solid   — Blueprint fill, Warm White text. Used at most once per page.
 * ghost   — text + underline that arrives after hover.
 * Magnetic pull uses a spring (cursor-following, permitted).
 */
export function Button({ href, onClick, children, variant = 'primary', className, magnetic = true, type = 'button' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 220, damping: 22, mass: 0.5 });

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    mx.set(dx * 0.22);
    my.set(dy * 0.28);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const base =
    'group relative inline-flex items-center justify-center gap-3 px-7 py-4 label transition-colors duration-240 ease-cubic select-none';
  const styles: Record<Variant, string> = {
    primary: 'shimmer border border-hairline text-warm hover:border-blueprint focus-visible:border-blueprint outline-none',
    solid: 'bg-blueprint text-warm border border-blueprint hover:bg-[#1a4478]',
    ghost: 'px-0 py-2 text-current',
  };

  const inner = (
    <>
      {variant === 'primary' && (
        <>
          <span className="shimmer__spark" aria-hidden>
            <span className="shimmer__spark-inner" />
          </span>
          <span className="shimmer__backdrop" aria-hidden />
        </>
      )}
      <span className={cn('relative', variant === 'ghost' && 'u-line')}>{children}</span>
      <span
        aria-hidden
        className="relative inline-block h-px w-5 bg-current transition-transform duration-380 ease-expo group-hover:translate-x-1"
      />
    </>
  );

  const cls = cn(base, styles[variant], className);

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      {href ? (
        <Link href={href} className={cls} data-cursor="">
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
