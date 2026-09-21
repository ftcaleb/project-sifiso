import type { Metadata } from 'next';
import Link from 'next/link';
import { TEAM, TIMELINE, VALUES } from '@/lib/data';
import { IMG } from '@/lib/images';
import { PageHero } from '@/components/ui/PageHero';
import { Duotone } from '@/components/ui/Duotone';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { PathDraw } from '@/components/ui/PathDraw';
import { GlassCard } from '@/components/ui/GlassCard';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export const metadata: Metadata = { title: 'About', description: 'Who we are: the story, values and leadership of Sifiso Holdings.' };

export default function AboutPage() {
  const leaders = TEAM.filter((p) => p.leadership);
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Who we are"
        title="Built for the people who are audited on what they own."
        lede="Sifiso Holdings began with a register nobody could stand behind. Twenty years on, we build the systems that let municipalities, utilities and lenders stand behind theirs."
        ref_="ABOUT · EST. 2006"
      />

      {/* Story */}
      <section className="relative bg-graphite pb-28 md:pb-40" data-section="Our story">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-10">
          <Reveal className="md:col-span-7" y={40}>
            <Duotone src={IMG.blueprintDraft} alt="Engineer drafting on a technical drawing" className="aspect-[16/10] w-full" parallax={50} />
          </Reveal>
          <div className="md:col-span-5 md:pt-10">
            <Eyebrow index="01">The story</Eyebrow>
            <SplitText as="h2" text="From one register to an operating system." className="display-md mt-6 text-3xl md:text-4xl" />
            <Reveal delay={0.3} className="mt-6 space-y-5 text-base leading-relaxed text-stone">
              <p>
                In 2006 a metropolitan municipality asked us to fix an asset register that had failed its audit for the third
                consecutive year. The problem was not the numbers. It was that no number could be traced to the ground.
              </p>
              <p>
                We rebuilt it component by component, with a coordinate on every line. That discipline — spatial first,
                defensible by design — became the firm, and then became MERIDIAN™.
              </p>
              <p>
                Today the same platform holds the registers, rolls and frameworks of 27 institutions, from district
                municipalities to commercial banks.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative border-t border-hairline bg-graphite py-20 md:py-40" data-section="Values">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Eyebrow index="02">Values</Eyebrow>
          <SplitText as="h2" text="Four rules we do not bend." className="display mt-6 text-[clamp(2.1rem,6vw,5.5rem)]" />
          <ul className="mt-16 grid gap-x-10 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <li key={v.index}>
                <DrawLine delay={i * 0.08} />
                <Reveal delay={0.1 + i * 0.08} className="grid grid-cols-[3rem_1fr] gap-4 py-8">
                  <span className="label tnum text-stone">{v.index}</span>
                  <div>
                    <h3 className="display-md text-2xl md:text-3xl">{v.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">{v.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <DrawLine delay={0.4} />
        </div>
      </section>

      {/* Timeline */}
      <section className="relative border-t border-hairline bg-graphite py-20 md:py-40" data-section="Timeline">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Eyebrow index="03">Timeline</Eyebrow>
          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <PathDraw className="hidden md:col-span-1 md:block" start="top 80%" end="bottom 60%" scrub={0.5}>
              <svg viewBox="0 0 20 600" className="h-[600px] w-5" preserveAspectRatio="none" aria-hidden>
                <line x1="10" y1="0" x2="10" y2="600" stroke="#1D4E89" strokeWidth="1.5" />
              </svg>
            </PathDraw>
            <ol className="md:col-span-11 space-y-10">
              {TIMELINE.map((t, i) => (
                <li key={t.year}>
                  <Reveal delay={i * 0.06} className="grid gap-3 md:grid-cols-[8rem_1fr]">
                    <span className="readout text-4xl text-warm/90">{t.year}</span>
                    <p className="max-w-xl border-t border-hairline pt-3 text-base leading-relaxed text-stone md:border-t-0 md:pt-2">{t.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative border-t border-hairline bg-graphite py-20 md:py-40" data-section="Leadership">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow index="04">Leadership</Eyebrow>
              <SplitText as="h2" text="The people who sign the reports." className="display mt-6 text-[clamp(2.1rem,6vw,5.5rem)]" />
            </div>
            <Reveal delay={0.3}>
              <Link href="/team" className="label u-line inline-flex min-h-11 items-center text-warm/80 md:min-h-0">
                Full team
              </Link>
            </Reveal>
          </div>
          <ul className="mt-16 grid gap-4 md:grid-cols-3">
            {leaders.map((p, i) => (
              <li key={p.slug}>
                <GlassCard delay={i * 0.1} className="h-full">
                  <Link href={`/team/${p.slug}`} className="block p-4" data-cursor="Profile">
                    <Duotone src={p.image} alt={p.name} className="aspect-[4/5] w-full" parallax={20} sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="px-2 pt-6 pb-3">
                      <div className="font-display text-xl font-light">{p.name}</div>
                      <div className="mt-1 text-sm text-stone">{p.role}</div>
                      <div className="label mt-4 text-stone/70">{p.focus}</div>
                    </div>
                  </Link>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCTA title="Work with us." text="We hire engineers, planners, valuers and data people who care whether a number can be defended." cta="Get in touch" />
    </>
  );
}
