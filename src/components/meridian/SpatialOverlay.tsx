import { PathDraw } from '@/components/ui/PathDraw';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SplitText } from '@/components/ui/SplitText';
import { Reveal } from '@/components/ui/Reveal';

/** Full-width parcel/road map that draws itself as the user scrolls. One Blueprint line: the growth boundary. */
export function SpatialOverlay() {
  const parcels: string[] = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 14; c++) {
      const x = 40 + c * 96 + (r % 2) * 18;
      const y = 40 + r * 84;
      const w = 70 + ((r * c) % 5) * 5;
      const h = 56 + ((r + c) % 4) * 6;
      parcels.push(`M${x} ${y} h${w} v${h} h-${w} z`);
    }
  }
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-graphite py-20 md:py-40" data-section="Spatial layer">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow index="03">Spatial layer</Eyebrow>
            <SplitText as="h2" text="Every layer. One coordinate system." className="display mt-6 text-[clamp(2.1rem,6vw,5.5rem)]" />
          </div>
          <Reveal className="md:col-span-5 md:pb-2" delay={0.3}>
            <p className="text-base leading-relaxed text-stone">
              Cadastre, zoning, servitudes, networks and the register itself share one projection and one version history.
              A parcel query is a register query is a valuation query.
            </p>
          </Reveal>
        </div>
      </div>

      <PathDraw className="relative mt-16 w-full" start="top 85%" end="bottom 55%" scrub={0.7} stagger={0.004}>
        <svg viewBox="0 0 1440 560" className="h-auto w-full" aria-hidden>
          <g fill="none" stroke="#2A2D33" strokeWidth="1">
            {parcels.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g fill="none" stroke="#8A8D93" strokeWidth="1.2" strokeOpacity="0.8">
            <path d="M0 300 C 300 290, 500 340, 720 320 S 1160 260, 1440 290" />
            <path d="M420 0 C 440 200, 400 360, 460 560" />
            <path d="M980 0 C 960 180, 1020 380, 990 560" />
          </g>
          <g fill="none" stroke="#EDEBE4" strokeOpacity="0.5" strokeWidth="1">
            <path d="M160 470 L 330 420 L 520 452 L 700 400 L 880 436 L 1060 384 L 1260 430" />
            <circle cx="330" cy="420" r="4" />
            <circle cx="700" cy="400" r="4" />
            <circle cx="1060" cy="384" r="4" />
          </g>
          <path d="M60 520 C 260 380, 420 480, 600 360 S 980 160, 1180 200 S 1380 120, 1420 40" fill="none" stroke="#1D4E89" strokeWidth="2.2" strokeDasharray="8 5" />
        </svg>
        <div className="label pointer-events-none absolute left-6 top-4 text-stone md:left-10">
          LAYERS · CADASTRE · ROADS · NETWORK · GROWTH BOUNDARY
        </div>
        <div className="label pointer-events-none absolute bottom-4 right-6 text-stone md:right-10">
          EPSG:2054 · LO29 · HARTEBEESTHOEK94
        </div>
      </PathDraw>
    </section>
  );
}
