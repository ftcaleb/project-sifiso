import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import { GlassCard } from '@/components/ui/GlassCard';
import { SplitText } from '@/components/ui/SplitText';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SectionFrame } from '@/components/ui/SectionFrame';

/**
 * Home-page teaser for the four pillars.
 *
 * Deliberately thin: index, title, one line, and a way through. The capability
 * detail that used to sit in each card is the substance of /services, and
 * repeating it here made four tall cards that pushed the rest of the page down
 * by most of a screen on a phone.
 */
export function Pillars() {
  return (
    <section id="pillars" className="relative scroll-mt-16 bg-graphite py-20 md:py-40" data-section="Service pillars">
      <SectionFrame tl="SEC 01" tr="SERVICE PILLARS" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-8">
            <Eyebrow index="01">Service pillars</Eyebrow>
            <SplitText as="h2" text="Four disciplines. One register of truth." className="display mt-6 text-[clamp(2.1rem,6vw,5.5rem)]" />
          </div>
          <Reveal className="md:col-span-4 md:pb-3" delay={0.3}>
            <p className="text-base leading-relaxed text-stone">
              Asset management, spatial planning, valuation and analytics are usually four vendors and four spreadsheets. We
              run them as one practice on one platform.
            </p>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-16 md:gap-4 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <li key={s.id} className="h-full">
              <GlassCard delay={i * 0.08} className="h-full">
                <Link href={`/services#${s.id}`} className="flex h-full flex-col p-5 md:p-6" data-cursor="Explore">
                  <div className="flex items-center justify-between gap-3">
                    <span className="label text-stone">{s.index}</span>
                    <span className="label text-stone/60">{s.standards[0]}</span>
                  </div>
                  <h3 className="display-md mt-6 text-xl md:mt-8 md:text-[1.45rem]">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{s.short}</p>
                  <div className="label mt-auto flex items-center gap-3 pt-6 text-warm/80 md:pt-8">
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
