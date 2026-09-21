'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { EASE_CUBIC, pad } from '@/lib/utils';

const EVENTS = [
  ['REGISTER', 'Component WTR-0418-P condition updated C3 → C3 (verified)'],
  ['SPATIAL', 'Cadastre tile 14/2048 refreshed · 1,204 parcels'],
  ['VALUATION', 'Ratio study batch 07 complete · median 0.97'],
  ['COMPLIANCE', 'mSCOA segment mapping validated · 0 exceptions'],
  ['MODEL', 'Renewal demand recomputed · horizon 20 yr'],
  ['INGEST', 'ERP sync · 3,118 transactions reconciled'],
  ['SPATIAL', 'Drone survey Ward 12 georeferenced · 42 ha'],
  ['GOVERN', 'Approval: supplementary roll 2026/03 · 2 of 2 signatures'],
  ['REGISTER', 'New component BLD-0311-F created from as-built'],
  ['COMPLIANCE', 'GIAMA U-AMP pack generated · 9,412 facilities'],
];

type Row = { id: number; t: string; k: string; v: string };

export function LiveLog() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let i = 0;
    const push = () => {
      const [k, v] = EVENTS[i % EVENTS.length];
      const d = new Date();
      const t = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      setRows((r) => [{ id: Date.now() + i, t, k, v }, ...r].slice(0, 7));
      i++;
    };
    push();
    push();
    push();
    const iv = setInterval(push, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative border-t border-hairline bg-graphite py-20 md:py-36" data-section="Live log">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <Eyebrow index="05">Event stream</Eyebrow>
          <h2 className="display-md mt-6 text-3xl md:text-4xl">Nothing on the platform is static. Neither is this page.</h2>
          <p className="mt-6 text-sm leading-relaxed text-stone">
            Every change to a register, a layer or a roll is an event with an author, a timestamp and a diff. This is a
            simulated stream of the kinds of events a tenant sees.
          </p>
        </div>
        <Reveal className="md:col-span-8" delay={0.2}>
          <div className="border border-hairline">
            <div className="label flex items-center justify-between border-b border-hairline px-4 py-3 text-stone">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-warm" />
                LIVE · SIMULATED
              </span>
              <span>tenant: demo-metro</span>
            </div>
            <ul className="min-h-[19rem] p-2">
              <AnimatePresence initial={false}>
                {rows.map((r) => (
                  <motion.li
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.38, ease: EASE_CUBIC }}
                    className="tnum grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1 border-b border-hairline/50 px-2 py-2.5 text-xs sm:grid-cols-[4.5rem_6rem_1fr]"
                  >
                    <span className="text-stone">{r.t}</span>
                    <span className="label text-[0.65rem] text-warm/70">{r.k}</span>
                    {/* the message needs the full width on a phone, so it wraps
                        to its own row under the time and channel */}
                    <span className="col-span-2 text-warm/85 sm:col-span-1 sm:truncate">{r.v}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
