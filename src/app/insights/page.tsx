import type { Metadata } from 'next';
import Link from 'next/link';
import { INSIGHTS } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { Duotone } from '@/components/ui/Duotone';
import { Reveal } from '@/components/ui/Reveal';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export const metadata: Metadata = { title: 'Insights & Publications', description: 'Thought leadership on asset management, spatial planning, valuation and data.' };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function InsightsPage() {
  const [featured, ...rest] = INSIGHTS;
  return (
    <>
      <PageHero index="06" eyebrow="Insights & publications" title="What we have learned, in writing." lede="Working notes from the practice: audit findings, valuation ratio studies, planning law and the data engineering beneath all of it." ref_="INSIGHTS · 06 ARTICLES" />

      <section className="relative bg-graphite pb-28 md:pb-40" data-section="Featured">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal y={40}>
            <Link href={`/insights/${featured.slug}`} className="group grid gap-8 border border-hairline p-4 transition-colors duration-380 hover:border-stone/60 md:grid-cols-12 md:p-5" data-cursor="Read">
              <div className="md:col-span-7">
                <Duotone src={featured.image} alt="" className="aspect-[16/9] w-full" parallax={30} sizes="(max-width:768px) 100vw, 60vw" />
              </div>
              <div className="flex flex-col justify-between md:col-span-5 md:py-4">
                <div>
                  <div className="label flex items-center gap-3 text-stone">
                    <span>Featured</span>
                    <span className="h-px w-5 bg-hairline" />
                    <span>{featured.category}</span>
                  </div>
                  <h2 className="display-md mt-6 text-3xl md:text-4xl">{featured.title}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-stone">{featured.excerpt}</p>
                </div>
                <div className="label mt-8 flex items-center justify-between text-stone">
                  <span className="tnum">{fmtDate(featured.date)}</span>
                  <span>{featured.read} read</span>
                </div>
              </div>
            </Link>
          </Reveal>

          <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((a, i) => (
              <li key={a.slug} className="h-full">
                <GlassCard delay={0.05 + i * 0.06} className="h-full">
                  <Link href={`/insights/${a.slug}`} className="flex h-full flex-col p-4" data-cursor="Read">
                    <Duotone src={a.image} alt="" className="aspect-[16/10] w-full" parallax={20} sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="flex flex-1 flex-col px-2 pt-6 pb-3">
                      <div className="label text-stone">{a.category}</div>
                      <h3 className="display-md mt-4 text-xl md:text-2xl">{a.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone">{a.excerpt}</p>
                      <div className="label mt-auto flex items-center justify-between pt-8 text-stone">
                        <span className="tnum">{fmtDate(a.date)}</span>
                        <span>{a.read}</span>
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCTA title="Get the next one first." text="We publish roughly monthly. No newsletters, no noise: a note when there is something worth reading." cta="Subscribe by email" href="/contact?subject=insights" />
    </>
  );
}
