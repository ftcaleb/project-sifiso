'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardPreview, type PreviewVariant } from './DashboardPreview';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SplitText } from '@/components/ui/SplitText';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { cn, EASE_CUBIC, EASE_EXPO } from '@/lib/utils';

const MODULES: { id: PreviewVariant; index: string; title: string; text: string }[] = [
  { id: 'register', index: '01', title: 'Asset Register', text: 'Componentised, GRAP-aligned registers with condition, remaining useful life and replacement cost on every line.' },
  { id: 'spatial', index: '02', title: 'Spatial Layer', text: 'Cadastre, zoning, land use scheme and SDF in one coordinate system. Every asset and every parcel has a place.' },
  { id: 'valuation', index: '03', title: 'Valuation Roll', text: 'Mass-appraisal models, ratio studies and roll certification with a full audit trail per parcel.' },
  { id: 'compliance', index: '04', title: 'Compliance Engine', text: 'Continuous checks against GRAP, mSCOA, MPRA, GIAMA and ISO 55001 — findings surfaced before the auditor does.' },
];

/** Active tab is shown with a warm rule; the preview's single Blueprint data-line owns the accent in this viewport. */
export function FeatureToggles() {
  const [active, setActive] = useState<PreviewVariant>('register');
  const current = MODULES.find((m) => m.id === active)!;

  return (
    <section id="modules" className="relative scroll-mt-20 border-t border-hairline bg-graphite py-28 md:py-40" data-section="Modules">
      <SectionFrame tl="SEC 02" tr="MODULES" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow index="02">Modules</Eyebrow>
        <SplitText as="h2" text="Toggle a module. Watch the data change." className="display mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)]" />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4" role="tablist" aria-label="MERIDIAN modules">
            {MODULES.map((m) => {
              const on = m.id === active;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(m.id)}
                  className={cn('group relative block w-full border-t border-hairline py-6 text-left transition-colors duration-240', on ? 'text-warm' : 'text-warm/55 hover:text-warm/85')}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="label tnum w-6 text-stone">{m.index}</span>
                    <span className="font-display text-2xl font-light tracking-tight md:text-3xl">{m.title}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease: EASE_CUBIC }}
                        className="overflow-hidden pl-10 pt-3 text-sm leading-relaxed text-stone"
                      >
                        {m.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {on && <motion.span layoutId="tab-rule" className="absolute -top-px left-0 h-px w-full bg-warm" transition={{ duration: 0.5, ease: EASE_EXPO }} />}
                </button>
              );
            })}
            <div className="border-t border-hairline" />
          </div>

          <div className="lg:col-span-8">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(55%_55%_at_50%_50%,rgba(244,242,237,0.045),transparent)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.38, ease: EASE_CUBIC }}
                >
                  <DashboardPreview variant={active} />
                </motion.div>
              </AnimatePresence>
              <div className="label mt-4 flex items-center justify-between text-stone">
                <span>{current.title} · simulated data</span>
                <span className="tnum">MERIDIAN™ / {current.index}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
