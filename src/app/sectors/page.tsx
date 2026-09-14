import type { Metadata } from 'next';
import { SECTORS, TRACK_RECORD } from '@/lib/data';
import { IMG } from '@/lib/images';
import { PageHero } from '@/components/ui/PageHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { Duotone } from '@/components/ui/Duotone';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export const metadata: Metadata = { title: 'Sectors & Track Record', description: 'Who we work with and what we have delivered.' };

export default function SectorsPage() {
  return (
    <>
      <PageHero
        index="05"
        eyebrow="Sectors & clients"
        title="Every institution that owns ground, or lends against it."
        lede="Our clients are custodians: of infrastructure, of land, of balance sheets. The common thread is that someone, eventually, audits what they own."
        ref_="SECTORS · 06"
      />

      <section className="relative bg-graphite pb-28 md:pb-40" data-section="Sectors">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SECTORS.map((s, i) => (
              <li key={s.index} className="h-full">
                <GlassCard delay={i * 0.06} className="h-full">
                  <div className="flex h-full flex-col p-7 md:p-8">
                    <div className="label flex items-center justify-between text-stone">
                      <span>{s.index}</span>
                      <span className="text-stone/60">{s.clients}</span>
                    </div>
                    <h3 className="display-md mt-8 text-2xl md:text-[1.7rem]">{s.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-stone">{s.text}</p>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative border-t border-hairline bg-graphite py-28 md:py-40" data-section="Track record">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow index="02">Track record</Eyebrow>
              <SplitText as="h2" text="Delivered, certified, audited." className="display-md mt-6 text-3xl md:text-4xl" />
              <Reveal delay={0.3} className="mt-6 text-sm leading-relaxed text-stone">
                A selection of engagements. Client names are withheld by agreement; references are available on request.
              </Reveal>
              <Reveal delay={0.4} y={30} className="mt-10">
                <Duotone src={IMG.siteWorkers} alt="Engineers on an infrastructure site" className="aspect-[4/3] w-full" parallax={30} />
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <div className="label grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-4 pb-3 text-stone">
                <span>Client</span>
                <span>Scope</span>
                <span className="text-right">Scale</span>
                <span className="text-right">Outcome</span>
              </div>
              <ul>
                {TRACK_RECORD.map((r, i) => (
                  <li key={r.scope}>
                    <DrawLine delay={i * 0.05} />
                    <Reveal delay={0.05 + i * 0.05} y={10} className="grid grid-cols-[1.2fr_2fr_1fr_1fr] gap-4 py-5 text-sm">
                      <span className="text-warm/90">{r.client}</span>
                      <span className="text-stone">{r.scope}</span>
                      <span className="text-right">
                        <span className="readout text-xl text-warm">{r.metric}</span>
                        <span className="label ml-1.5 text-stone">{r.unit}</span>
                      </span>
                      <span className="label text-right text-warm/80">{r.value}</span>
                    </Reveal>
                  </li>
                ))}
                <DrawLine delay={0.4} blueprint />
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA title="Add your institution to the record." text="Tell us what you are custodian of. We will tell you what it would take to make it defensible." />
    </>
  );
}
