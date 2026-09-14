import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SplitText } from '@/components/ui/SplitText';
import { PathDraw } from '@/components/ui/PathDraw';

const LAYERS = [
  { index: '01', title: 'Ingest', text: 'ERP, GIS, survey, drone and financial feeds reconciled into one versioned asset truth.', items: ['SAP · Oracle · Sage', 'Esri · QGIS · OGC APIs', 'Drone & satellite imagery', 'CSV, XLSX, PDF extraction'] },
  { index: '02', title: 'Model', text: 'Deterioration, demand, mass-appraisal and lifecycle models run continuously against the register.', items: ['Condition → RUL curves', 'Renewal demand forecasting', 'Spatial mass appraisal', 'Scenario & budget simulation'] },
  { index: '03', title: 'Govern', text: 'Rules, approvals and audit trails that make every number defensible before it is published.', items: ['GRAP · mSCOA · MPRA rules', 'Four-eyes approvals', 'Immutable audit log', 'Regulatory report packs'] },
];

export function Architecture() {
  return (
    <section className="relative border-t border-hairline bg-graphite py-28 md:py-40" data-section="Architecture">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow index="04">Architecture</Eyebrow>
        <SplitText as="h2" text="Ingest. Model. Govern." className="display mt-6 text-[clamp(2.5rem,6vw,5.5rem)]" />

        <PathDraw className="mt-10 hidden md:block" start="top 90%" end="bottom 60%" scrub={0.6}>
          <svg viewBox="0 0 1200 40" className="h-10 w-full" preserveAspectRatio="none" aria-hidden>
            <path d="M0 20 H1200" fill="none" stroke="#2A2D33" strokeWidth="1" />
            <path d="M200 20 H1000" fill="none" stroke="#1D4E89" strokeWidth="1.5" />
            <circle cx="200" cy="20" r="4" fill="none" stroke="#EDEBE4" strokeWidth="1" />
            <circle cx="600" cy="20" r="4" fill="none" stroke="#EDEBE4" strokeWidth="1" />
            <circle cx="1000" cy="20" r="4" fill="none" stroke="#EDEBE4" strokeWidth="1" />
          </svg>
        </PathDraw>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {LAYERS.map((l, i) => (
            <GlassCard key={l.index} delay={i * 0.1} className="h-full">
              <div className="p-7 md:p-8">
                <div className="label flex items-center justify-between text-stone">
                  <span>{l.index}</span>
                  <span>LAYER</span>
                </div>
                <h3 className="display-md mt-8 text-3xl">{l.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-stone">{l.text}</p>
                <ul className="mt-8 text-sm">
                  {l.items.map((it) => (
                    <li key={it} className="border-t border-hairline py-2.5 text-warm/80">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
