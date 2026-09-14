'use client';

import { motion } from 'framer-motion';
import { cn, EASE_EXPO } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  index?: string;
  /** class for the short rule between index and label (defaults to stone) */
  lineClassName?: string;
};

export function Eyebrow({ children, className = '', index, lineClassName = 'bg-stone/60' }: Props) {
  return (
    <motion.div
      className={cn('label flex items-center gap-3 text-stone', className)}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
    >
      {index && <span className="tnum">{index}</span>}
      <span className={cn('h-px w-6', lineClassName)} />
      <span>{children}</span>
    </motion.div>
  );
}
