'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { SplineHero } from '@/components/hero/SplineHero';
import { SplitText } from '@/components/ui/SplitText';
import { Button } from '@/components/ui/Button';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { heroScan, TOTAL_COMPONENTS } from '@/lib/hero-scan';
import { EASE_EXPO } from '@/lib/utils';

const READOUTS = [
  ['Register', 'Componentised · GRAP 17'],
  ['Spatial', 'Cadastre · SDF · LUS'],
  ['Valuation', 'MPRA · IVS · IFRS 13'],
  ['Platform', 'MERIDIAN™ v4.2'],
];

/**
 * The hero runs a survey of the city behind it as you scroll: the sweep, the
 * camera rise and this readout all come off one scroll progress value.
 *
 * The count and the bar are written straight to the DOM rather than held in
 * state — they change every frame while scrolling, and re-rendering the hero
 * that often would cost far more than it is worth.
 */
export function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });

  // content lifts and fades as the survey takes over
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    heroScan.progress = v;
    const surveyed = Math.round(TOTAL_COMPONENTS * v);
    if (countRef.current) countRef.current.textContent = surveyed.toLocaleString('en-US');
    if (barRef.current) barRef.current.style.width = `${(v * 100).toFixed(1)}%`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(v * 100)}%`;
  });

  useEffect(() => () => {
    heroScan.progress = 0;
  }, []);

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-graphite"
      data-section="Overview"
    >
      <SplineHero />

      {/* legibility gradients — graphite only */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_20%_50%,rgba(11,12,14,0.85),rgba(11,12,14,0.2)_60%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-graphite to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-graphite/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scan bg-warm/10" />

      <SectionFrame tr="LAT −26.2041 · LNG 28.0473" className="z-10" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pt-32 pb-28 md:px-10"
      >
        <motion.div
          className="label flex items-center gap-3 text-stone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-warm" />
          Infrastructure · Spatial · Valuation
        </motion.div>

        <SplitText
          as="h1"
          text="The Operating System for Africa’s Built Environment."
          className="display mt-8 text-[clamp(2.25rem,8.5vw,8.25rem)] text-warm md:max-w-[15ch]"
          immediate
          delay={0.35}
        />

        <motion.p
          className="mt-10 max-w-xl text-base leading-relaxed text-stone md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 1.1 }}
        >
          Sifiso Holdings puts every asset, every hectare and every valuation on one register of truth — governed, spatial
          and audit-defensible — through MERIDIAN™.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 1.3 }}
        >
          <Button href="/meridian" variant="primary">
            Enter MERIDIAN™
          </Button>
          <Button href="/services" variant="ghost">
            Our services
          </Button>
        </motion.div>
      </motion.div>

      {/* survey instrumentation — climbs as the sweep crosses the city */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.55 }}
      >
        <div className="flex items-end justify-between gap-6 border-t border-hairline pt-3">
          <div className="label flex items-center gap-3 text-stone">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-warm" />
            <span className="hidden sm:inline">Survey in progress</span>
            <span className="sm:hidden">Survey</span>
          </div>
          <div className="label flex items-baseline gap-2 text-stone">
            <span ref={countRef} className="readout text-base text-warm md:text-lg">
              0
            </span>
            <span>/ {TOTAL_COMPONENTS.toLocaleString('en-US')} components</span>
          </div>
        </div>
        <div className="mt-2 h-px w-full bg-hairline">
          <span ref={barRef} className="block h-px bg-warm transition-[width] duration-100 ease-linear" style={{ width: '0%' }} />
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-6 pb-24 pt-6 md:grid-cols-4 md:px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
      >
        {READOUTS.map(([k, v]) => (
          <div key={k} className="border-t border-hairline pt-3">
            <div className="label text-stone">{k}</div>
            <div className="mt-1 font-display text-sm font-light text-warm/80">{v}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
