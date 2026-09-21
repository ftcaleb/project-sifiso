'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollTicker } from '@/components/ui/NumberTicker';
import { SplitText } from '@/components/ui/SplitText';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { Button } from '@/components/ui/Button';
import { EASE_EXPO } from '@/lib/utils';

const READOUTS = [
  { label: 'Asset value on register', value: 2.41, prefix: 'R ', suffix: 'bn', decimals: 2, from: 0 },
  { label: 'Hectares mapped', value: 1846300, suffix: ' ha', decimals: 0, from: 0 },
  { label: 'Compliance score', value: 98.6, suffix: '%', decimals: 1, from: 0 },
  { label: 'Registers in sync', value: 27, decimals: 0, from: 0 },
];

export function MeridianHero() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section className="relative overflow-hidden bg-graphite pt-32 md:pt-56" data-section="MERIDIAN™ overview">
      <div className="blueprint-grid absolute inset-0 opacity-80 [mask-image:radial-gradient(70%_70%_at_50%_30%,#000,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scan bg-warm/10" />
      <SectionFrame tl="MERIDIAN™ · v4.2" tr="SPATIAL & ASSET INTELLIGENCE" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="label flex items-center gap-3 text-stone"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-warm" />
          Platform · Production · 27 tenants
        </motion.div>
        <SplitText as="h1" text="MERIDIAN™" className="display mt-8 text-[clamp(2.75rem,13vw,13rem)]" immediate delay={0.3} />
        <SplitText
          as="p"
          text="One platform. Every asset. Every hectare. Every valuation."
          className="display-md mt-2 max-w-4xl text-[clamp(1.25rem,3.2vw,2.75rem)] text-warm/85"
          immediate
          delay={0.7}
        />
        <motion.div
          className="mt-12 flex flex-wrap items-center gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 1.2 }}
        >
          <Button href="#demo" variant="primary">
            Request a demonstration
          </Button>
          <Button href="#modules" variant="ghost">
            Explore modules
          </Button>
        </motion.div>
      </div>

      {/* Live readouts — tick up as the user scrolls this band */}
      <div ref={ref} className="relative mx-auto mt-16 max-w-7xl px-6 pb-16 md:mt-32 md:px-10 md:pb-32">
        <div className="grid border border-hairline md:grid-cols-4">
          {READOUTS.map((r, i) => (
            <div key={r.label} className={`p-7 md:p-9 ${i > 0 ? 'border-t border-hairline md:border-l md:border-t-0' : ''}`}>
              <div className="label flex items-center justify-between text-stone">
                <span>{r.label}</span>
                <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="readout mt-7 text-[clamp(1.9rem,4.4vw,3.8rem)] text-warm">
                <ScrollTicker target={ref} value={r.value} prefix={r.prefix} suffix={r.suffix} decimals={r.decimals} from={r.from} />
              </div>
              <div className="mt-4 h-px w-full bg-hairline">
                <motion.div
                  className="h-px bg-warm/60"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: EASE_EXPO, delay: 0.2 + i * 0.1 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
