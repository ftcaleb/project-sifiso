import Image from 'next/image';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

const CODES = [
  { name: 'home', label: 'Overview', path: '/', file: '/qr/home.svg' },
  { name: 'contact', label: 'Contact', path: '/contact', file: '/qr/contact.svg' },
];

/** Must match the URL baked into public/qr/* by scripts/generate-qr.mjs. */
const BASE = 'https://sifiso-holding.vercel.app';

/** Print-ready QR codes for collateral. Bone tiles with charcoal modules so every scanner reads them. */
export function ScanCodes() {
  return (
    <section className="relative border-t border-hairline bg-graphite py-28 md:py-36" data-section="Scan">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <Eyebrow index="04">Scan</Eyebrow>
          <h2 className="display-md mt-6 text-3xl md:text-4xl">Take the register with you.</h2>
          <p className="mt-6 text-sm leading-relaxed text-stone">
            Two codes for reports, tender documents and site boards. One opens the overview, the other lands on this page.
            Download the SVG for print at any size.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-8">
          {CODES.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1} className="border border-hairline p-5">
              <div className="label flex items-center justify-between text-stone">
                <span>{c.label}</span>
                <span className="tnum">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="mt-5 bg-bone p-4">
                <Image src={c.file} alt={`QR code linking to ${BASE}${c.path}`} width={512} height={512} className="h-auto w-full" unoptimized />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="tnum truncate text-xs text-stone">
                  {BASE.replace(/^https?:\/\//, '')}
                  {c.path}
                </span>
                <div className="label flex shrink-0 gap-4 text-warm/80">
                  <a href={c.file} download={`sifiso-${c.name}.svg`} className="u-line">
                    SVG
                  </a>
                  <a href={`/qr/${c.name}.png`} download={`sifiso-${c.name}.png`} className="u-line">
                    PNG
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
