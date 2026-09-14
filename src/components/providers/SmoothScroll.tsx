'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setLenis, getLenis } from '@/lib/lenis-store';

/**
 * Lenis inertia scrolling synced to GSAP's ticker so ScrollTrigger and Lenis
 * share one clock (per the Lenis README + GSAP docs).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.09,
      smoothWheel: !reduce,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Route change: reset scroll, honour hash anchors, refresh triggers.
  useEffect(() => {
    const lenis = getLenis();
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => lenis?.scrollTo(el as HTMLElement, { offset: -40, duration: 1.4 }), 120);
      }
    } else {
      lenis?.scrollTo(0, { immediate: true });
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}
