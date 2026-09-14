import type { Config } from 'tailwindcss';

/**
 * Sifiso Holdings design tokens.
 * ONE accent (blueprint). Everything else is graphite / bone / charcoal / grey.
 * blueprint is a signal, never a surface: borders, underlines, CTA fill, key data-lines.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#0B0C0E',
        bone: '#F4F2ED',
        charcoal: '#14161A',
        warm: '#EDEBE4',
        stone: '#8A8D93',
        hairline: '#2A2D33',
        blueprint: '#1D4E89',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        // Observed at Palantir / Bentley — reveals only, never springs.
        expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
        cubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        std: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        140: '140ms',
        240: '240ms',
        380: '380ms',
        600: '600ms',
        900: '900ms',
      },
      keyframes: {
        'shimmer-slide': { to: { transform: 'translate(calc(100cqw - 100%), 0)' } },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        scan: { from: { transform: 'translateY(-100%)' }, to: { transform: 'translateY(100vh)' } },
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
      },
      animation: {
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        marquee: 'marquee 40s linear infinite',
        scan: 'scan 9s linear infinite',
        blink: 'blink 1.6s steps(2, start) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
