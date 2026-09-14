import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { HUD } from '@/components/layout/HUD';
import { Footer } from '@/components/layout/Footer';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'https://sifiso-holding.vercel.app'),
  title: {
    default: 'Sifiso Holdings — The Operating System for Africa’s Built Environment',
    template: '%s — Sifiso Holdings',
  },
  description:
    'Infrastructure asset management, spatial planning & GIS, and property valuation, delivered through MERIDIAN™ — Sifiso Holdings’ spatial and asset intelligence platform.',
  openGraph: {
    title: 'Sifiso Holdings',
    description: 'The Operating System for Africa’s Built Environment.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0C0E',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-graphite text-warm">
        <SmoothScroll>
          <HUD />
          <main id="top">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
