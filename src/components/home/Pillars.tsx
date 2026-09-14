import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import { GlassCard } from '@/components/ui/GlassCard';
import { SplitText } from '@/components/ui/SplitText';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SectionFrame } from '@/components/ui/SectionFrame';

export function Pillars() {
  return (
    <section id="pillars" className="relative scroll-mt-16 bg-graphite py-28 md:py-40" data-section="Service pillars">
      <SectionFrame tl="SEC 01" tr="SERVICE PILLARS" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow index="01">Service pillars</Eyebrow>
            <SplitText as="h2" text="Four disciplines. One register of truth." className="display mt-6 text-[clamp(2.5rem,6vw,5.5rem)]" />
          </div>
          <Reveal className="md:col-span-4 md:pb-3" delay={0.3}>
            <p className="text-base leading-relaxed text-stone">
              Asset management, spatial planning, valuation and analytics are usually four vendors and four spreadsheets. We
              run them as one practice on one platform.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="h-full">
              <GlassCard delay={i * 0.08} className="h-full">
                <Link href={`/services#${s.id}`} className="flex h-full flex-col p-7 md:p-8" data-cursor="Explore">
                  <div className="flex items-center justify-between">
                    <span className="label text-stone">{s.index}</span>
                    <span className="label text-stone/60">{s.standards[0]}</span>
                  </div>
                  <h3 className="display-md mt-10 text-2xl md:text-[1.7rem]">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone">{s.short}</p>
                  <ul className="mt-8 space-y-0 text-sm">
                    {s.capabilities.slice(0, 3).map((c) => (
                      <li key={c} className="border-t border-hairline py-2.5 text-warm/75">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="label mt-auto flex items-center gap-3 pt-10 text-warm/80">
                    Explore
                    <span className="h-px w-5 bg-current transition-transform duration-380 ease-expo group-hover:translate-x-1" />
                  </div>
                </Link>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
