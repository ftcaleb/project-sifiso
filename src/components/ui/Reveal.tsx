'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { EASE_EXPO } from '@/lib/utils';

type Props = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({ delay = 0, y = 28, once = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Hairline that draws itself in from the left when it enters the viewport. */
export function DrawLine({ delay = 0, className = '', blueprint = false }: { delay?: number; className?: string; blueprint?: boolean }) {
  return (
    <motion.div
      className={`h-px w-full origin-left ${blueprint ? 'bg-blueprint' : 'bg-hairline'} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay }}
    />
  );
}
