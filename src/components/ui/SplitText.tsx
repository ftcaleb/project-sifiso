'use client';

import { motion, type Variants } from 'framer-motion';
import { cn, EASE_EXPO } from '@/lib/utils';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span';

type Props = {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean;
};

const parent: Variants = { hidden: {}, visible: {} };

/**
 * Kinetic headline: each word clip-reveals from below with a per-word stagger
 * (900ms expo-out, no blur — investigation §9.3). The viewport observer sits on
 * the unclipped parent and propagates to the words via variants; observing each
 * clipped word directly is unreliable because IntersectionObserver clips by
 * overflow-hidden ancestors and a word translated 110% out of its wrapper has
 * zero intersection area.
 */
export function SplitText({ text, as = 'h2', className, delay = 0, stagger = 0.045, once = true, immediate = false }: Props) {
  const words = text.split(' ');
  const M = motion[as];
  const child: Variants = {
    hidden: { y: '110%', rotate: 2 },
    visible: (i: number) => ({
      y: '0%',
      rotate: 0,
      transition: { duration: 0.9, ease: EASE_EXPO, delay: delay + i * stagger },
    }),
  };

  return (
    <M
      className={cn(className)}
      aria-label={text}
      variants={parent}
      initial="hidden"
      {...(immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport: { once, margin: '-10% 0px -10% 0px' } })}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span custom={i} variants={child} className="inline-block will-change-transform">
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </M>
  );
}
