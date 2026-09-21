import { OFFICES } from '@/lib/data';
import { PathDraw } from '@/components/ui/PathDraw';

const W = 600;
const H = 520;
const LNG = [16, 33];
const LAT = [-22, -35];

const px = (lng: number) => ((lng - LNG[0]) / (LNG[1] - LNG[0])) * W;
const py = (lat: number) => ((LAT[0] - lat) / (LAT[0] - LAT[1])) * H;
/** Marker position as a percentage, so HTML labels can sit on the scaled SVG. */
const pctX = (lng: number) => (px(lng) / W) * 100;
const pctY = (lat: number) => (py(lat) / H) * 100;

/**
 * Plotted graticule of South Africa with the three offices positioned by
 * coordinate. Grid and markers draw in on scroll; the route between offices
 * is the one Blueprint line.
 *
 * City labels are HTML positioned over the SVG rather than <text> inside it.
 * SVG text scales with the viewBox, so on a 320px phone an 11px label rendered
 * at roughly 5px — unreadable. As HTML it keeps a real font size at any width.
 */
export function OfficeMap() {
  const lngs = Array.from({ length: (LNG[1] - LNG[0]) / 2 + 1 }, (_, i) => LNG[0] + i * 2);
  const lats = Array.from({ length: (LAT[0] - LAT[1]) / 2 + 1 }, (_, i) => LAT[0] - i * 2);
  const route = OFFICES.map((o) => `${px(o.lng)} ${py(o.lat)}`).join(' L ');

  return (
    <div className="relative">
      <PathDraw className="relative border border-hairline bg-charcoal/40" start="top 85%" end="bottom 50%" scrub={0.6} stagger={0.03}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Map showing offices in Johannesburg, Cape Town and Durban">
          <g stroke="#2A2D33" strokeWidth="1" fill="none">
            {lngs.map((l) => (
              <line key={`lng${l}`} x1={px(l)} x2={px(l)} y1={0} y2={H} />
            ))}
            {lats.map((l) => (
              <line key={`lat${l}`} x1={0} x2={W} y1={py(l)} y2={py(l)} />
            ))}
          </g>
          {/* coastline hint — abstracted */}
          <path
            d={`M ${px(16.5)} ${py(-28.5)} C ${px(17)} ${py(-31)}, ${px(18)} ${py(-33.5)}, ${px(20)} ${py(-34.8)} S ${px(25)} ${py(-34.2)}, ${px(27)} ${py(-33.6)} S ${px(30.5)} ${py(-31)}, ${px(32.6)} ${py(-28.4)}`}
            fill="none"
            stroke="#8A8D93"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />
          <path d={`M ${route}`} fill="none" stroke="#1D4E89" strokeWidth="1.6" strokeDasharray="6 4" />
          {OFFICES.map((o) => (
            <g key={o.city}>
              <circle cx={px(o.lng)} cy={py(o.lat)} r="10" fill="none" stroke="#EDEBE4" strokeOpacity="0.5" strokeWidth="1" />
              <circle cx={px(o.lng)} cy={py(o.lat)} r="2.5" fill="none" stroke="#EDEBE4" strokeWidth="2" />
            </g>
          ))}
        </svg>
      </PathDraw>

      {/* Labels in HTML so they stay legible when the map scales down */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {OFFICES.map((o) => {
          // Anchor to whichever side keeps the label inside the frame. Anything
          // past the halfway mark reads right-to-left, otherwise long city
          // names run off the edge on a phone.
          const flip = pctX(o.lng) > 52;
          return (
            <div
              key={o.city}
              className={`absolute -translate-y-1/2 ${flip ? 'text-right' : 'text-left'}`}
              style={{
                left: flip ? undefined : `${pctX(o.lng)}%`,
                right: flip ? `${100 - pctX(o.lng)}%` : undefined,
                top: `${pctY(o.lat)}%`,
                marginLeft: flip ? undefined : '2.2%',
                marginRight: flip ? '2.2%' : undefined,
              }}
            >
              <div className="label whitespace-nowrap leading-tight text-warm">{o.city}</div>
              <div className="tnum whitespace-nowrap text-xs leading-tight text-stone">
                {o.lat.toFixed(2)} · {o.lng.toFixed(2)}
              </div>
            </div>
          );
        })}

        <div className="label absolute right-3 top-3 text-stone/70">
          <span className="hidden sm:inline">Graticule 2° · </span>WGS84
        </div>
      </div>
    </div>
  );
}
