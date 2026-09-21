import { STATS } from '@/lib/data';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Marquee } from '@/components/ui/Marquee';

const LOG = [
  'REG SYNC · OK',
  'mSCOA 6.7 · VALID',
  'GRAP 17 · PASS',
  'CADASTRE TILE 14/2048 · LOADED',
  'VALUATION ROLL · 1,204,318 PARCELS',
  'CONDITION MODEL · RUL RECOMPUTED',
  'AGSA FINDINGS · 0 OPEN',
  'PIPELINE 6,812 km · SURVEYED',
];

/** Mission-control stat bar. The single Blueprint element is the data-line under the panel. */
export function StatBar() {
  return (
    <section id="register" className="relative scroll-mt-32 bg-graphite pb-28 md:pb-40" data-section="Live register">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow index="02">Register status</Eyebrow>
        <Reveal className="mt-8 border border-hairline" delay={0.1}>
          <div className="grid divide-y divide-hairline md:grid-cols-4 md:divide-x md:divide-y-0">
            {STATS.map((s, i) => (
              <div key={s.label} className="relative p-7 md:p-9">
                <div className="label flex items-center justify-between text-stone">
                  <span>{s.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 animate-blink rounded-full bg-warm" />
                    LIVE
                  </span>
                </div>
                <div className="readout mt-8 whitespace-nowrap text-[clamp(1.75rem,3vw,3.1rem)] text-warm">
                  <NumberTicker value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} delay={i * 0.12} />
                </div>
                <div className="mt-3 text-xs text-stone">{s.note}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <DrawLine blueprint className="mt-0" delay={0.6} />
        <div className="mt-6">
          <Marquee items={LOG} speed={60} className="[&_span]:text-sm" />
        </div>
      </div>
    </section>
  );
}
