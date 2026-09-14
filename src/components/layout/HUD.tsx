'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { NAV, QUADRANTS } from '@/lib/data';
import { getLenis } from '@/lib/lenis-store';
import { cn, EASE_EXPO, pad } from '@/lib/utils';

/**
 * Heads-up display navigation. Four fixed corners carry metadata; the centre
 * of the screen is left to the content. INDEX opens a full-screen quadrant map
 * (Palantir HUD concept, restyled). Blueprint appears in the HUD only as the
 * active-route marker inside the overlay.
 */
export function HUD() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState('Overview');
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(Math.round(v * 100)));

  // Track the section currently under the viewport centre.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.getAttribute('data-section') ?? '');
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Close on route change; lock scroll while open; ESC closes.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split('#')[0];
    return base !== '/' && pathname.startsWith(base);
  };

  return (
    <>
      {/* Persistent corners */}
      <div className="pointer-events-none fixed inset-0 z-[60] mix-blend-difference text-warm">
        {/* TL — wordmark */}
        <Link href="/" className="pointer-events-auto absolute left-6 top-6 flex items-baseline gap-2 md:left-10 md:top-8" aria-label="Sifiso Holdings home">
          <span className="font-display text-lg font-medium tracking-tight">SIFISO</span>
          <span className="label opacity-70">Holdings</span>
        </Link>

        {/* TR — primary nav + index */}
        <div className="pointer-events-auto absolute right-6 top-6 flex items-center gap-7 md:right-10 md:top-8">
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={cn('label u-line opacity-80 hover:opacity-100', isActive(n.href) && 'opacity-100')}>
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="label flex items-center gap-3"
            aria-expanded={open}
            aria-controls="hud-index"
          >
            <span>{open ? 'Close' : 'Index'}</span>
            <span className="relative block h-3 w-4">
              <span className={cn('absolute left-0 top-0 h-px w-full bg-current transition-transform duration-380 ease-expo', open && 'translate-y-[5.5px] rotate-45')} />
              <span className={cn('absolute left-0 top-[5.5px] h-px w-full bg-current transition-opacity duration-240', open && 'opacity-0')} />
              <span className={cn('absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-380 ease-expo', open && '-translate-y-[5.5px] -rotate-45')} />
            </span>
          </button>
        </div>

        {/* BL — section readout */}
        <div className="pointer-events-auto absolute bottom-6 left-6 hidden items-end gap-4 md:flex md:bottom-8 md:left-10">
          <div className="relative h-14 w-px bg-warm/25">
            <span className="absolute left-0 top-0 w-px bg-warm transition-[height] duration-240 ease-std" style={{ height: `${progress}%` }} />
          </div>
          <div className="label leading-[1.6]">
            <div className="opacity-60">Section</div>
            <div className="max-w-[16rem] truncate">{section}</div>
          </div>
        </div>

        {/* BR — status */}
        <div className="pointer-events-auto absolute bottom-6 right-6 flex items-center gap-4 md:bottom-8 md:right-10">
          <span className="label opacity-70">
            SCR {pad(progress, 3)}
          </span>
          <span className="label flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-current" />
            SYS ONLINE
          </span>
        </div>
      </div>

      {/* Quadrant index overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="hud-index"
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            className="fixed inset-0 z-[55] bg-graphite text-warm"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
          >
            <div className="blueprint-grid absolute inset-0 opacity-50" />
            {/* crosshair dividers */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <div className="absolute left-1/2 top-0 h-full w-px bg-hairline" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-hairline" />
              <div className="label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-graphite px-3 py-1 text-stone">
                26.2041° S · 28.0473° E
              </div>
            </div>

            <div className="relative grid h-full grid-cols-1 overflow-y-auto pt-24 pb-24 lg:grid-cols-2 lg:grid-rows-2 lg:overflow-hidden lg:pt-0 lg:pb-0" data-lenis-prevent>
              {QUADRANTS.map((q, qi) => (
                <div key={q.index} className="flex flex-col justify-end px-6 py-8 md:px-10 lg:px-16 lg:py-16">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.25 + qi * 0.06 }}
                    className="label mb-6 flex items-center gap-3 text-stone"
                  >
                    <span className="tnum">{q.index}</span>
                    <span className="h-px w-6 bg-hairline" />
                    <span>{q.title}</span>
                  </motion.div>
                  <ul className="space-y-1">
                    {q.links.map((l, li) => {
                      const active = isActive(l.href) && (l.href.includes('#') ? false : true);
                      return (
                        <li key={l.href} className="overflow-hidden">
                          <motion.div
                            initial={{ y: '110%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.3 + qi * 0.06 + li * 0.05 }}
                          >
                            <Link
                              href={l.href}
                              className={cn(
                                'group flex items-center gap-4 py-1 font-display text-2xl font-light tracking-tight transition-colors duration-240 md:text-3xl lg:text-[2.1rem]',
                                active ? 'text-warm' : 'text-warm/70 hover:text-warm',
                              )}
                            >
                              <span
                                className={cn(
                                  'block h-2 w-2 shrink-0 transition-colors duration-240',
                                  active ? 'bg-blueprint' : 'bg-transparent border border-hairline group-hover:border-stone',
                                )}
                              />
                              <span className="relative">
                                {l.label}
                                {active && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-blueprint" />}
                              </span>
                            </Link>
                          </motion.div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
