import { CLIENT_TYPES } from '@/lib/data';
import { Marquee } from '@/components/ui/Marquee';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

export function Clients() {
  return (
    <section className="relative bg-graphite py-24 md:py-32" data-section="Clients">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Eyebrow index="04">Trusted across the built environment</Eyebrow>
          <Reveal className="label text-stone" delay={0.2}>
            11 municipalities · 3 provincial departments · 4 lenders · 2 utilities
          </Reveal>
        </div>
      </div>
      <Reveal className="mt-12 border-y border-hairline py-8" delay={0.15}>
        <Marquee items={CLIENT_TYPES} speed={55} />
      </Reveal>
    </section>
  );
}
