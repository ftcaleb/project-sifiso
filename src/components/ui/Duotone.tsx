'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** vertical parallax travel in px */
  parallax?: number;
};

/** Desaturated photo with graphite multiply + optional scroll parallax. */
export function Duotone({ src, alt, className, sizes = '(max-width: 768px) 100vw, 50vw', priority, parallax = 40 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax]);

  return (
    <div ref={ref} className={cn('duotone relative overflow-hidden bg-charcoal', className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}
