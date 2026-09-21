'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { AnimatePresence, motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { cn, EASE_CUBIC } from '@/lib/utils';

const PAGES = [
  { key: 'home', label: 'Overview', path: '/' },
  { key: 'services', label: 'Services', path: '/services' },
  { key: 'meridian', label: 'MERIDIAN™', path: '/meridian' },
  { key: 'sectors', label: 'Sectors', path: '/sectors' },
  { key: 'insights', label: 'Insights', path: '/insights' },
  { key: 'team', label: 'Team', path: '/team' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'custom', label: 'Any link', path: '' },
];

const OPTS = { errorCorrectionLevel: 'M' as const, margin: 2, color: { dark: '#14161AFF', light: '#FFFFFFFF' } };

function normalise(raw: string) {
  const v = raw.trim();
  if (!v) return '';
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function slug(s: string) {
  return s.toLowerCase().replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'link';
}

/**
 * Self-service QR generator for non-technical users: pick a page (or paste a
 * link), the code renders instantly, download as PNG or SVG. Everything runs
 * in the browser; the encoded URL uses the domain the site is served from,
 * so it follows the site when it moves to a custom domain.
 */
export function QRGenerator() {
  const [origin, setOrigin] = useState('https://sifiso-holdings-enh.pages.dev');
  const [key, setKey] = useState('home');
  const [custom, setCustom] = useState('');
  const [png, setPng] = useState('');
  const [svg, setSvg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  const page = PAGES.find((p) => p.key === key)!;
  const url = useMemo(() => (key === 'custom' ? normalise(custom) : `${origin}${page.path}`), [key, custom, origin, page.path]);
  const valid = url.length > 0;

  useEffect(() => {
    if (!valid) {
      setPng('');
      setSvg('');
      return;
    }
    let cancelled = false;
    Promise.all([QRCode.toDataURL(url, { ...OPTS, width: 1024 }), QRCode.toString(url, { ...OPTS, type: 'svg' })]).then(([p, s]) => {
      if (cancelled) return;
      setPng(p);
      setSvg(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`);
    });
    return () => {
      cancelled = true;
    };
  }, [url, valid]);

  const filename = `sifiso-qr-${key === 'custom' ? slug(url) : key}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const chip = 'label flex min-h-11 items-center border px-3.5 py-2 transition-colors duration-240';
  const dl = 'label inline-flex min-h-11 items-center gap-3 border border-hairline px-5 py-3 text-warm transition-colors duration-240 hover:border-stone';

  return (
    <section className="relative border-t border-hairline bg-graphite py-20 md:py-36" data-section="QR generator">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Eyebrow index="04">QR code</Eyebrow>
          <h2 className="display-md mt-6 text-3xl md:text-4xl">Make a code for any page.</h2>
          <p className="mt-6 text-sm leading-relaxed text-stone">
            Choose where the code should take people, then download it for reports, tender documents, business cards or
            site boards. PNG for documents and slides; SVG for print at any size.
          </p>

          <div className="mt-10">
            <div className="label mb-3 text-stone">1 · Destination</div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Destination page">
              {PAGES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  role="radio"
                  aria-checked={key === p.key}
                  onClick={() => setKey(p.key)}
                  className={cn(chip, key === p.key ? 'border-warm text-warm' : 'border-hairline text-stone hover:border-stone hover:text-warm/85')}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {key === 'custom' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: EASE_CUBIC }}
                  className="overflow-hidden"
                >
                  <label htmlFor="qr-url" className="label mt-6 mb-1 block text-stone">
                    Paste a link
                  </label>
                  <input
                    id="qr-url"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="www.example.co.za/tender-2026"
                    inputMode="url"
                    autoComplete="off"
                    className="w-full border-0 border-b border-hairline bg-transparent px-0 py-3 text-base text-warm outline-none transition-colors duration-240 focus:border-warm placeholder:text-stone/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10">
            <div className="label mb-3 text-stone">2 · Download</div>
            <div className="flex flex-wrap gap-3">
              <a href={png || undefined} download={`${filename}.png`} aria-disabled={!png} className={cn(dl, !png && 'pointer-events-none opacity-40')}>
                PNG
                <span className="h-px w-4 bg-current" />
              </a>
              <a href={svg || undefined} download={`${filename}.svg`} aria-disabled={!svg} className={cn(dl, !svg && 'pointer-events-none opacity-40')}>
                SVG
                <span className="h-px w-4 bg-current" />
              </a>
              <button type="button" onClick={copy} disabled={!valid} className={cn(dl, 'disabled:pointer-events-none disabled:opacity-40')}>
                {copied ? 'Link copied' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>

        <Reveal className="md:col-span-7" delay={0.15}>
          <div className="border border-hairline p-5 md:p-6">
            <div className="label flex items-center justify-between text-stone">
              <span>Preview</span>
              <span>{key === 'custom' ? 'Any link' : page.label}</span>
            </div>
            <div className="mx-auto mt-5 aspect-square w-full max-w-[26rem] bg-white p-5">
              <AnimatePresence mode="wait">
                {png ? (
                  <motion.img
                    key={url}
                    src={png}
                    alt={`QR code for ${url}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24, ease: EASE_CUBIC }}
                    className="h-full w-full"
                  />
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full items-center justify-center">
                    <span className="label text-center text-charcoal/50">Paste a link to generate a code</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-hairline pt-4">
              <span className="label text-stone">Scans to</span>
              <span className="tnum truncate text-right text-xs text-warm/85">{valid ? url : '—'}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
