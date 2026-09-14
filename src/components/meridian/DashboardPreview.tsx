'use client';

import { motion } from 'framer-motion';
import { EASE_EXPO, pad } from '@/lib/utils';

export type PreviewVariant = 'register' | 'spatial' | 'valuation' | 'compliance';

const REGISTER_ROWS = [
  ['WTR-0418-P', 'Pipeline · uPVC 160', 'Ward 12', '2.4 km', 'C3', 'R 4.21m'],
  ['RDS-1183-S', 'Surfaced road · Class 4', 'Ward 07', '1.1 km', 'C2', 'R 9.87m'],
  ['ELC-0092-T', 'Transformer · 500 kVA', 'Ward 03', '1 unit', 'C4', 'R 0.86m'],
  ['BLD-0310-F', 'Community hall', 'Ward 19', '860 m²', 'C2', 'R 12.4m'],
  ['SWR-0221-M', 'Sewer main · 300 mm', 'Ward 12', '3.7 km', 'C3', 'R 7.02m'],
  ['STM-0117-C', 'Stormwater culvert', 'Ward 05', '48 m', 'C5', 'R 1.13m'],
];

const SPARK = 'M0 54 L18 50 L36 52 L54 44 L72 46 L90 38 L108 40 L126 30 L144 33 L162 24 L180 26 L198 18 L216 20 L234 12 L252 14 L270 8';

function Frame({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="relative border border-hairline bg-graphite/80 text-warm">
      <div className="label flex items-center justify-between border-b border-hairline px-4 py-3 text-stone">
        <span className="flex items-center gap-3">
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 border border-hairline" />
            <span className="h-1.5 w-1.5 border border-hairline" />
            <span className="h-1.5 w-1.5 border border-hairline" />
          </span>
          {title}
        </span>
        <span>{meta}</span>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}

const rowAnim = (i: number) => ({
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: EASE_EXPO, delay: 0.1 + i * 0.05 },
});

export function DashboardPreview({ variant = 'register' }: { variant?: PreviewVariant }) {
  if (variant === 'register') {
    return (
      <Frame title="Asset register · Infrastructure" meta="186,204 components">
        <div className="grid gap-5 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="label grid grid-cols-[1.4fr_2fr_1fr_1fr_0.6fr_1fr] gap-2 border-b border-hairline pb-2 text-[0.6rem] text-stone">
              <span>ID</span>
              <span>Component</span>
              <span>Zone</span>
              <span>Extent</span>
              <span>Cond.</span>
              <span className="text-right">CRC</span>
            </div>
            {REGISTER_ROWS.map((r, i) => (
              <motion.div
                key={r[0]}
                {...rowAnim(i)}
                className="tnum grid grid-cols-[1.4fr_2fr_1fr_1fr_0.6fr_1fr] gap-2 border-b border-hairline/60 py-2 text-[0.68rem] text-warm/85"
              >
                <span className="whitespace-nowrap text-stone">{r[0]}</span>
                <span className="truncate">{r[1]}</span>
                <span className="whitespace-nowrap">{r[2]}</span>
                <span className="whitespace-nowrap">{r[3]}</span>
                <span>{r[4]}</span>
                <span className="whitespace-nowrap text-right">{r[5]}</span>
              </motion.div>
            ))}
          </div>
          <div className="md:col-span-2">
            <div className="label text-stone">Renewal demand · 20 yr</div>
            <svg viewBox="0 0 270 60" className="mt-3 h-24 w-full" preserveAspectRatio="none">
              <g stroke="#2A2D33" strokeWidth="1">
                {[0, 15, 30, 45, 60].map((y) => (
                  <line key={y} x1="0" x2="270" y1={y} y2={y} />
                ))}
              </g>
              <motion.path
                d={SPARK}
                fill="none"
                stroke="#1D4E89"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: EASE_EXPO, delay: 0.3 }}
              />
              <motion.circle cx="270" cy="8" r="2.5" fill="#1D4E89" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} />
            </svg>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['CRC', 'R 38.2bn'],
                ['DRC', 'R 21.7bn'],
                ['Backlog', 'R 3.9bn'],
                ['RUL avg', '23.4 yr'],
              ].map(([k, v], i) => (
                <motion.div key={k} {...rowAnim(i + 6)} className="border-t border-hairline pt-2">
                  <div className="label text-[0.6rem] text-stone">{k}</div>
                  <div className="readout mt-1 text-lg">{v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    );
  }

  if (variant === 'spatial') {
    const parcels = Array.from({ length: 48 }, (_, i) => {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const w = 30 + ((i * 7) % 11);
      const h = 22 + ((i * 5) % 9);
      return { x: 6 + col * 34, y: 6 + row * 30, w, h, i };
    });
    return (
      <Frame title="Spatial layer · Land use scheme" meta="Scale 1:5 000">
        <div className="grid gap-5 md:grid-cols-5">
          <div className="md:col-span-3">
            <svg viewBox="0 0 280 190" className="h-64 w-full border border-hairline/60 bg-charcoal/40">
              <defs>
                <pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M10 0H0V10" fill="none" stroke="#2A2D33" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="280" height="190" fill="url(#g)" />
              {parcels.map((p) => (
                <motion.rect
                  key={p.i}
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  fill="rgba(237,235,228,0.05)"
                  stroke="#8A8D93"
                  strokeWidth="0.6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 + p.i * 0.015 }}
                />
              ))}
              {/* roads */}
              <g stroke="#EDEBE4" strokeOpacity="0.35" strokeWidth="1" fill="none">
                <path d="M0 96 H280" />
                <path d="M140 0 V190" />
                <path d="M0 40 Q80 60 140 40 T280 30" />
              </g>
              {/* the one Blueprint element: SDF growth boundary */}
              <motion.path
                d="M30 170 C 60 120, 120 130, 150 90 S 230 40, 262 22"
                fill="none"
                stroke="#1D4E89"
                strokeWidth="1.8"
                strokeDasharray="4 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: EASE_EXPO, delay: 0.5 }}
              />
              <text x="8" y="182" className="label" fill="#8A8D93" fontSize="6">
                LUS · ZONING · CADASTRE · GROWTH BOUNDARY
              </text>
            </svg>
          </div>
          <div className="md:col-span-2 space-y-2">
            {[
              ['Residential 1', '2,310 erven'],
              ['Business 2', '412 erven'],
              ['Industrial', '188 erven'],
              ['Public open space', '96 erven'],
              ['Agricultural', '1,204 erven'],
              ['Undetermined', '54 erven'],
            ].map(([k, v], i) => (
              <motion.div key={k} {...rowAnim(i)} className="flex items-center justify-between border-b border-hairline/60 py-2 text-xs">
                <span className="text-warm/85">{k}</span>
                <span className="tnum text-stone">{v}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Frame>
    );
  }

  if (variant === 'valuation') {
    const bars = [18, 26, 38, 52, 66, 78, 70, 58, 44, 30, 20, 12, 8, 5];
    return (
      <Frame title="Valuation roll · General valuation 2026" meta="1,204,318 parcels">
        <div className="grid gap-5 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="label text-stone">Market value distribution · R&apos;000</div>
            <div className="mt-4 flex h-44 items-end gap-1.5 border-b border-hairline">
              {bars.map((b, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-warm/15"
                  initial={{ height: 0 }}
                  animate={{ height: `${b}%` }}
                  transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.1 + i * 0.04 }}
                />
              ))}
            </div>
            <div className="label mt-2 flex justify-between text-[0.6rem] text-stone">
              <span>0</span>
              <span>500</span>
              <span>1,000</span>
              <span>2,500</span>
              <span>5,000+</span>
            </div>
          </div>
          <div className="md:col-span-2">
            {[
              ['Median ratio', '0.97'],
              ['COD', '9.8'],
              ['PRD', '1.02'],
              ['Objections', '0.31%'],
            ].map(([k, v], i) => (
              <motion.div key={k} {...rowAnim(i)} className="flex items-baseline justify-between border-b border-hairline/60 py-3">
                <span className="label text-stone">{k}</span>
                <span className="readout text-2xl">{v}</span>
              </motion.div>
            ))}
            <motion.div {...rowAnim(5)} className="mt-4 border-t border-blueprint pt-3">
              <div className="label text-stone">Total roll value</div>
              <div className="readout mt-1 text-3xl">R 96.4bn</div>
            </motion.div>
          </div>
        </div>
      </Frame>
    );
  }

  // compliance
  const checks = [
    ['GRAP 17 · Componentisation', 'PASS'],
    ['GRAP 103 · Heritage assets', 'PASS'],
    ['mSCOA · Segment mapping', 'PASS'],
    ['ISO 55001 · Clause 7.5', 'REVIEW'],
    ['MPRA · Roll certification', 'PASS'],
    ['GIAMA · U-AMP submission', 'PASS'],
  ];
  const score = 98.6;
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <Frame title="Compliance engine · Audit readiness" meta="FY 2026/27">
      <div className="grid gap-5 md:grid-cols-5">
        <div className="flex items-center justify-center md:col-span-2">
          <svg viewBox="0 0 140 140" className="h-44 w-44">
            <circle cx="70" cy="70" r={r} fill="none" stroke="#2A2D33" strokeWidth="2" />
            <motion.circle
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke="#1D4E89"
              strokeWidth="2.5"
              strokeLinecap="butt"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: c * (1 - score / 100) }}
              transition={{ duration: 1.8, ease: EASE_EXPO, delay: 0.2 }}
              transform="rotate(-90 70 70)"
            />
            <text x="70" y="66" textAnchor="middle" fill="#EDEBE4" fontSize="22" fontWeight="300" className="font-display tnum">
              {score}%
            </text>
            <text x="70" y="84" textAnchor="middle" fill="#8A8D93" fontSize="6" letterSpacing="1.5">
              AUDIT CLEARANCE
            </text>
          </svg>
        </div>
        <div className="md:col-span-3">
          {checks.map(([k, v], i) => (
            <motion.div key={k} {...rowAnim(i)} className="flex items-center justify-between border-b border-hairline/60 py-2.5 text-xs">
              <span className="flex items-center gap-3 text-warm/85">
                <span className="tnum text-stone">{pad(i + 1)}</span>
                {k}
              </span>
              <span className={`label ${v === 'PASS' ? 'text-warm/70' : 'text-stone'}`}>{v}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
