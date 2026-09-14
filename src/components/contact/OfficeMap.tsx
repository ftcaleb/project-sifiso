import { OFFICES } from '@/lib/data';
import { PathDraw } from '@/components/ui/PathDraw';

const W = 600;
const H = 520;
const LNG = [16, 33];
const LAT = [-22, -35];

const px = (lng: number) => ((lng - LNG[0]) / (LNG[1] - LNG[0])) * W;
const py = (lat: number) => ((LAT[0] - lat) / (LAT[0] - LAT[1])) * H;

/**
 * Plotted graticule of South Africa with the three offices positioned by
 * coordinate. Grid and markers draw in on scroll; the route between offices
 * is the one Blueprint line.
 */
export function OfficeMap() {
  const lngs = Array.from({ length: (LNG[1] - LNG[0]) / 2 + 1 }, (_, i) => LNG[0] + i * 2);
  const lats = Array.from({ length: (LAT[0] - LAT[1]) / 2 + 1 }, (_, i) => LAT[0] - i * 2);
  const route = OFFICES.map((o) => `${px(o.lng)} ${py(o.lat)}`).join(' L ');

  return (
    <PathDraw className="relative border border-hairline bg-charcoal/40" start="top 85%" end="bottom 50%" scrub={0.6} stagger={0.03}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-label="Map of office locations">
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
            <text
              x={o.lng > 30 ? px(o.lng) - 16 : px(o.lng) + 16}
              y={py(o.lat) + 4}
              textAnchor={o.lng > 30 ? 'end' : 'start'}
              fill="#EDEBE4"
              fontSize="11"
              letterSpacing="1.2"
              className="font-display"
            >
              {o.city.toUpperCase()}
            </text>
            <text
              x={o.lng > 30 ? px(o.lng) - 16 : px(o.lng) + 16}
              y={py(o.lat) + 18}
              textAnchor={o.lng > 30 ? 'end' : 'start'}
              fill="#8A8D93"
              fontSize="9"
              letterSpacing="1"
            >
              {o.lat.toFixed(2)} · {o.lng.toFixed(2)}
            </text>
          </g>
        ))}
        {lngs.filter((_, i) => i % 2 === 0).map((l) => (
          <text key={`t${l}`} x={px(l) + 3} y={H - 6} fill="#8A8D93" fontSize="8" letterSpacing="1">
            {l}°E
          </text>
        ))}
        {lats.filter((_, i) => i % 2 === 0).map((l) => (
          <text key={`u${l}`} x={4} y={py(l) - 3} fill="#8A8D93" fontSize="8" letterSpacing="1">
            {Math.abs(l)}°S
          </text>
        ))}
      </svg>
      <div className="label pointer-events-none absolute right-3 top-3 text-stone">GRATICULE 2° · WGS84</div>
    </PathDraw>
  );
}
