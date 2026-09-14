'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && !(gsap as unknown as { _st?: boolean })._st) {
  gsap.registerPlugin(ScrollTrigger);
  (gsap as unknown as { _st?: boolean })._st = true;
}

export { gsap, ScrollTrigger };
