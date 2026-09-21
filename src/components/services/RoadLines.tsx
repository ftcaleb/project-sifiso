import { PathDraw } from '@/components/ui/PathDraw';

/**
 * Infrastructure lines that draw themselves in on scroll. Roads and network
 * in stone/warm; exactly one Blueprint path (the trunk main) per divider.
 */
export function RoadLines({ variant = 0 }: { variant?: 0 | 1 | 2 }) {
  const trunk = [
    'M-20 150 C 200 150, 300 60, 520 70 S 900 150, 1100 110 S 1380 40, 1470 60',
    'M-20 60 C 180 70, 260 160, 480 150 S 820 70, 1040 90 S 1360 170, 1470 150',
    'M-20 110 C 240 110, 320 40, 600 44 S 980 180, 1200 150 S 1400 90, 1470 100',
  ][variant];
  return (
    <PathDraw className="relative -my-6 w-full overflow-hidden" start="top 90%" end="bottom 30%" scrub={0.8} stagger={0.12}>
      <svg viewBox="0 0 1440 220" className="h-24 w-full sm:h-40 md:h-56" preserveAspectRatio="none" aria-hidden>
        <g fill="none" strokeLinecap="round">
          <path d="M-20 180 C 240 180, 360 120, 640 130 S 1040 200, 1470 170" stroke="#2A2D33" strokeWidth="1.2" />
          <path d="M-20 40 C 220 30, 420 90, 700 80 S 1160 20, 1470 50" stroke="#2A2D33" strokeWidth="1.2" />
          <path d="M120 -10 C 140 80, 100 140, 160 230" stroke="#8A8D93" strokeWidth="0.8" strokeOpacity="0.6" />
          <path d="M760 -10 C 740 60, 800 120, 770 230" stroke="#8A8D93" strokeWidth="0.8" strokeOpacity="0.6" />
          <path d="M1240 -10 C 1260 90, 1200 150, 1250 230" stroke="#8A8D93" strokeWidth="0.8" strokeOpacity="0.6" />
          <path d="M300 130 L 420 90 L 560 128 L 690 82 L 860 120 L 1010 70 L 1160 122" stroke="#EDEBE4" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx="420" cy="90" r="3" stroke="#EDEBE4" strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="690" cy="82" r="3" stroke="#EDEBE4" strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="1010" cy="70" r="3" stroke="#EDEBE4" strokeOpacity="0.6" strokeWidth="1" />
          <path d={trunk} stroke="#1D4E89" strokeWidth="1.8" />
        </g>
      </svg>
    </PathDraw>
  );
}
