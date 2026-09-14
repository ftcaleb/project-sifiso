import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEAM } from '@/lib/data';
import { Duotone } from '@/components/ui/Duotone';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { Button } from '@/components/ui/Button';

export function generateStaticParams() {
  return TEAM.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = TEAM.find((x) => x.slug === params.slug);
  return { title: p ? `${p.name} — ${p.role}` : 'Team', description: p?.bio[0] };
}

/** Repeatable bio template. */
export default function PersonPage({ params }: { params: { slug: string } }) {
  const idx = TEAM.findIndex((x) => x.slug === params.slug);
  if (idx < 0) notFound();
  const p = TEAM[idx];
  const next = TEAM[(idx + 1) % TEAM.length];
  const prev = TEAM[(idx - 1 + TEAM.length) % TEAM.length];

  return (
    <>
      <section className="relative bg-graphite pt-40 pb-28 md:pt-52 md:pb-40" data-section={p.name}>
        <SectionFrame tl={`TEAM · ${String(idx + 1).padStart(2, '0')}/${String(TEAM.length).padStart(2, '0')}`} tr={p.focus.toUpperCase()} />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Link href="/team" className="label u-line text-stone">
            ← All people
          </Link>
          <div className="mt-10 grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-5" y={40}>
              <Duotone src={p.image} alt={p.name} className="aspect-[4/5] w-full" parallax={40} sizes="(max-width:768px) 100vw, 40vw" priority />
            </Reveal>
            <div className="md:col-span-7 md:pl-6">
              <Eyebrow>{p.role}</Eyebrow>
              <SplitText as="h1" text={p.name} className="display mt-6 text-[clamp(2.75rem,7vw,6rem)]" immediate />
              <Reveal delay={0.5} className="mt-8 space-y-5 text-base leading-relaxed text-warm/85 md:text-lg">
                {p.bio.map((b) => (
                  <p key={b}>{b}</p>
                ))}
              </Reveal>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="label text-stone">Focus</div>
                  <DrawLine className="mt-3" delay={0.6} />
                  <div className="mt-3 text-sm text-warm/85">{p.focus}</div>
                </div>
                <div>
                  <div className="label text-stone">Credentials</div>
                  <DrawLine className="mt-3" delay={0.7} />
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.credentials.map((c) => (
                      <li key={c} className="label border border-hairline px-2.5 py-1 text-stone">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Reveal delay={0.8} className="mt-12">
                <Button href={`/contact?subject=${encodeURIComponent(p.name)}`} variant="primary">
                  Contact {p.name.split(' ')[0]}
                </Button>
              </Reveal>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 border-t border-hairline pt-6">
            <Link href={`/team/${prev.slug}`} className="group" data-cursor="Prev">
              <div className="label text-stone">← Previous</div>
              <div className="mt-2 font-display text-lg font-light text-warm/80 group-hover:text-warm">{prev.name}</div>
            </Link>
            <Link href={`/team/${next.slug}`} className="group text-right" data-cursor="Next">
              <div className="label text-stone">Next →</div>
              <div className="mt-2 font-display text-lg font-light text-warm/80 group-hover:text-warm">{next.name}</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
