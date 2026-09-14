import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sifiso Holdings — The Operating System for Africa’s Built Environment';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0B0C0E',
          color: '#EDEBE4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          fontFamily: 'sans-serif',
          backgroundImage: 'linear-gradient(to right, rgba(138,141,147,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(138,141,147,0.10) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: 4, color: '#8A8D93' }}>
          <span>SIFISO HOLDINGS</span>
          <span>MERIDIAN™ · SPATIAL & ASSET INTELLIGENCE</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -2, lineHeight: 1.0, maxWidth: 1000 }}>The Operating System for Africa’s Built Environment.</div>
          <div style={{ marginTop: 28, width: 220, height: 3, background: '#1D4E89' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: 4, color: '#8A8D93' }}>
          <span>INFRASTRUCTURE · SPATIAL · VALUATION</span>
          <span>26.2041° S · 28.0473° E</span>
        </div>
      </div>
    ),
    size,
  );
}
