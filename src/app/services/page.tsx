import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { ServiceSection } from '@/components/services/ServiceSection';
import { RoadLines } from '@/components/services/RoadLines';
import { ClosingCTA } from '@/components/home/ClosingCTA';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Infrastructure asset management, spatial planning & GIS, valuations, and data & analytics.',
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Services"
        title="Four pillars. One practice."
        lede="Each discipline stands on its own. Together, on MERIDIAN™, they become a single register of what a client owns, where it stands and what it is worth."
        ref_="SERVICES · 04 PILLARS"
      >
        <Reveal delay={0.7} className="mt-14 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="group bg-graphite p-5 transition-colors duration-240 hover:bg-charcoal" data-cursor="Jump">
              <div className="label text-stone">{s.index}</div>
              <div className="mt-3 font-display text-lg font-light leading-tight">{s.title}</div>
              <div className="label mt-4 flex items-center gap-2 text-stone/80">
                Jump
                <span className="h-px w-4 bg-current transition-transform duration-380 ease-expo group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </Reveal>
      </PageHero>

      {SERVICES.map((s, i) => (
        <div key={s.id}>
          <RoadLines variant={(i % 3) as 0 | 1 | 2} />
          <ServiceSection s={s} flip={i % 2 === 1} />
        </div>
      ))}

      <ClosingCTA title="Scope an engagement." text="Tell us which register, roll or framework needs to be defensible by next audit cycle. We will come back within a day." />
    </>
  );
}
