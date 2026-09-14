import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Reticle mark on graphite; the single Blueprint dot is the only colour. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, background: '#0B0C0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="140" height="140" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="9" fill="none" stroke="#EDEBE4" strokeWidth="1.25" />
          <path d="M16 3v6M16 23v6M3 16h6M23 16h6" stroke="#EDEBE4" strokeWidth="1.25" />
          <circle cx="16" cy="16" r="2" fill="#1D4E89" />
        </svg>
      </div>
    ),
    size,
  );
}
