// Generates print-ready QR codes for the live site. Re-run after a domain change:
//   node scripts/generate-qr.mjs
import QRCode from 'qrcode';
import { mkdirSync } from 'node:fs';

const BASE = process.env.SITE_URL ?? 'https://sifiso-holding.vercel.app';
const targets = [
  { name: 'home', url: `${BASE}/` },
  { name: 'contact', url: `${BASE}/contact` },
];
const opts = { errorCorrectionLevel: 'M', margin: 2, color: { dark: '#14161AFF', light: '#F4F2EDFF' } };

mkdirSync('public/qr', { recursive: true });
for (const t of targets) {
  await QRCode.toFile(`public/qr/${t.name}.svg`, t.url, { ...opts, type: 'svg' });
  await QRCode.toFile(`public/qr/${t.name}.png`, t.url, { ...opts, width: 1024 });
  console.log(`${t.name}: ${t.url}`);
}
