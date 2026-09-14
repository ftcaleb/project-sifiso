import type { Metadata } from 'next';
import Link from 'next/link';
import { TEAM } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { Duotone } from '@/components/ui/Duotone';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export const metadata: Metadata = { title: 'Team', description: 'The engineers, planners, valuers and data people of Sifiso Holdings.' };

export default function TeamPage() {
  return (
    <>
      <PageHero index="07" eyebrow="Team" title="Engineers, planners, valuers, data people." lede="Everyone here has signed something an auditor later read. That is the hiring bar." ref_={`TEAM · ${TEAM.length} PEOPLE`} />
      <section className="relative bg-graphite pb-28 md:pb-40" data-section="People">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((p, i) => (
              <li key={p.slug}>
                <GlassCard delay={(i % 3) * 0.08} className="h-full">
                  <Link href={`/team/${p.slug}`} className="block p-4" data-cursor="Profile">
                    <Duotone src={p.image} alt={p.name} className="aspect-[4/5] w-full" parallax={20} sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="px-2 pt-6 pb-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="font-display text-xl font-light">{p.name}</div>
                        <span className="label tnum text-stone/60">{String(i + 1).padStart(2, '0')}</span>
                      </div>
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
      <ClosingCTA title="Join the register." text="We are always looking for people who can defend a number." cta="Send us your CV" href="/contact?subject=careers" />
    </>
  );
}
