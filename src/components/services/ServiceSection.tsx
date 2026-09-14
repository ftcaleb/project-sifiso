import type { Service } from '@/lib/data';
import { Duotone } from '@/components/ui/Duotone';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { Button } from '@/components/ui/Button';

export function ServiceSection({ s, flip = false }: { s: Service; flip?: boolean }) {
  return (
    <section id={s.id} className="relative scroll-mt-24 bg-graphite py-24 md:py-36" data-section={s.title}>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:gap-10 md:px-10">
        <div className={`md:col-span-6 ${flip ? 'md:order-2' : ''}`}>
          <Eyebrow index={s.index}>{s.short}</Eyebrow>
          <SplitText as="h2" text={s.title} className="display mt-6 text-[clamp(2.4rem,5.5vw,4.75rem)]" />
          <Reveal delay={0.3} className="mt-8 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {s.summary}
          </Reveal>

          <ul className="mt-12">
            {s.capabilities.map((c, i) => (
              <li key={c}>
                <DrawLine delay={0.1 + i * 0.06} />
                <Reveal delay={0.15 + i * 0.06} y={12} className="flex items-baseline gap-5 py-3.5 text-sm text-warm/85 md:text-[0.95rem]">
                  <span className="label w-6 shrink-0 text-stone">{String(i + 1).padStart(2, '0')}</span>
                  {c}
                </Reveal>
              </li>
            ))}
            <DrawLine delay={0.5} />
          </ul>

          <Reveal delay={0.5} className="mt-8 flex flex-wrap gap-2">
            {s.standards.map((st) => (
              <span key={st} className="label border border-hairline px-3 py-1.5 text-stone">
                {st}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.6} className="mt-10">
            <Button href="/contact" variant="ghost">
              Discuss {s.title.toLowerCase()}
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
