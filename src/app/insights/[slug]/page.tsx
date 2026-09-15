import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSIGHTS } from '@/lib/data';
import { Duotone } from '@/components/ui/Duotone';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { SectionFrame } from '@/components/ui/SectionFrame';
import { ClosingCTA } from '@/components/home/ClosingCTA';

const BODY: Record<string, string[]> = {
  'audit-defensible-registers': [
    'An asset register fails an audit for one of six reasons: a component that cannot be found, a value that cannot be traced, a condition that was never assessed, a useful life that was copied rather than modelled, a classification that does not map to the chart of accounts, or a change that has no author.',
    'Each failure is a data-model problem before it is a fieldwork problem. If the register cannot represent a coordinate, a source document and an approver on every line, no amount of surveying will make it defensible.',
    'MERIDIAN™ was designed from these six failure modes outward. Every component carries a location, a provenance chain and an immutable change log. The audit question "where did this number come from" has a machine-readable answer.',
  ],
  'mass-appraisal-spatial': [
    'Comparable-sales heuristics assume that similar properties are near each other. Spatial indexing makes that assumption explicit and testable, and in every ratio study we have run since 2019 the spatially indexed model has produced a lower coefficient of dispersion.',
    'The practical implication for a municipal valuer is fewer objections and a roll that survives the Valuation Appeal Board.',
  ],
  'sdf-as-database': [
    'A spatial development framework published as a PDF is a statement of intent. A framework published as a queryable layer is an instrument of control: a development application can be tested against it automatically, and a deviation can be measured.',
    'The Spatial Planning and Land Use Management Act does not prohibit this. It simply has not been asked for. We think it should be.',
  ],
  'mscoa-lifecycle': [
    'The mSCOA chart of accounts classifies money. A lifecycle plan classifies need. When the two are reconciled monthly rather than annually, the renewal backlog stops being a surprise in the budget cycle.',
    'MERIDIAN™ maps every register component to its mSCOA segments and recomputes renewal demand against the approved capital budget on every ingest.',
  ],
  'iso-55000-municipal': [
    'ISO 55000 certification is expensive and, for most municipalities, unnecessary. The standard is useful as a structure: a policy, a strategy, a plan, and a feedback loop between them.',
    'Our staged model adopts the structure in three cycles and defers certification until the loop has run at least twice.',
  ],
  'lender-valuations-climate': [
    'Flood, wildfire and drought exposure can now be computed for a residential portfolio in an afternoon. A valuation that ignores them is a pricing error, and increasingly a disclosure one.',
    'We overlay climate hazard layers on every lender portfolio valuation as standard, and report exposure by loan-to-value band.',
  ],
};

export function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const { slug } = params;
  const a = INSIGHTS.find((x) => x.slug === slug);
  return { title: a?.title ?? 'Insight', description: a?.excerpt };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const a = INSIGHTS.find((x) => x.slug === slug);
  if (!a) notFound();
  const body = BODY[a.slug] ?? [a.excerpt];
  const others = INSIGHTS.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <article className="relative bg-graphite pt-40 pb-28 md:pt-52 md:pb-40" data-section={a.category}>
        <SectionFrame tl="INSIGHT" tr={a.category.toUpperCase()} />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Link href="/insights" className="label u-line text-stone">
            ← All insights
          </Link>
          <Eyebrow className="mt-10">{a.category}</Eyebrow>
          <SplitText as="h1" text={a.title} className="display mt-8 max-w-5xl text-[clamp(2.25rem,6vw,5.25rem)]" immediate />
          <Reveal delay={0.5} className="label mt-8 flex gap-6 text-stone">
            <span className="tnum">{new Date(a.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: '2-digit' })}</span>
            <span>{a.read} read</span>
          </Reveal>
          <Reveal delay={0.6} y={40} className="mt-14">
            <Duotone src={a.image} alt="" className="aspect-[21/9] w-full" parallax={50} sizes="100vw" />
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-3">
              <Reveal className="text-sm leading-relaxed text-stone">{a.excerpt}</Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-5">
              {body.map((p, i) => (
                <Reveal key={i} delay={i * 0.05} className="mb-7 text-lg leading-relaxed text-warm/90">
                  {p}
                </Reveal>
              ))}
              <DrawLine blueprint className="mt-12" />
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-hairline bg-graphite py-24" data-section="More insights">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Eyebrow>More from the practice</Eyebrow>
          <ul className="mt-8">
            {others.map((o, i) => (
              <li key={o.slug}>
                <DrawLine delay={i * 0.05} />
                <Link href={`/insights/${o.slug}`} className="group flex items-baseline justify-between gap-6 py-5" data-cursor="Read">
                  <span className="font-display text-xl font-light text-warm/85 transition-colors duration-240 group-hover:text-warm md:text-2xl">{o.title}</span>
                  <span className="label shrink-0 text-stone">{o.category}</span>
                </Link>
              </li>
            ))}
            <DrawLine delay={0.2} />
          </ul>
        </div>
      </section>

      <ClosingCTA title="Talk to the author." cta="Get in touch" />
    </>
  );
}
