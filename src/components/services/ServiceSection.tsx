import type { Service } from '@/lib/data';
import { CapabilityList } from '@/components/services/CapabilityList';
import { DocumentDownload } from '@/components/services/DocumentDownload';
import { Duotone } from '@/components/ui/Duotone';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { Button } from '@/components/ui/Button';

export function ServiceSection({ s, flip = false }: { s: Service; flip?: boolean }) {
  return (
    <section id={s.id} className="relative scroll-mt-24 bg-graphite py-20 md:py-36" data-section={s.title}>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:gap-10 md:px-10">
        <div className={`md:col-span-6 ${flip ? 'md:order-2' : ''}`}>
          <Eyebrow index={s.index}>{s.short}</Eyebrow>
          <SplitText as="h2" text={s.title} className="display mt-6 text-[clamp(2rem,5.5vw,4.75rem)]" />
          <Reveal delay={0.3} className="mt-8 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {s.summary}
          </Reveal>

          <CapabilityList items={s.capabilities} />

          <Reveal delay={0.5} className="mt-8 flex flex-wrap gap-2">
            {s.standards.map((st) => (
              <span key={st} className="label border border-hairline px-3 py-1.5 text-stone">
                {st}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.55} y={20}>
            <DocumentDownload service={s} />
          </Reveal>

          <Reveal delay={0.6} className="mt-10">
            <Button href="/contact" variant="ghost">
              Discuss this service
            </Button>
          </Reveal>
        </div>

        <div className={`md:col-span-6 ${flip ? 'md:order-1' : ''}`}>
          <Reveal y={40} className="relative">
            <Duotone src={s.image} alt={s.imageAlt} className="aspect-[4/5] w-full md:aspect-[4/5]" parallax={60} />
            <div className="label pointer-events-none absolute left-4 top-4 flex items-center gap-2 bg-graphite/70 px-2 py-1 text-stone backdrop-blur">
              FIG {s.index} · {s.id.replace('-', ' ')}
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-warm/50" />
            <div className="pointer-events-none absolute left-4 bottom-4 h-4 w-4 border-b border-l border-warm/50" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
