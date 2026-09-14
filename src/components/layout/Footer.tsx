import Link from 'next/link';
import { NAV, OFFICES } from '@/lib/data';

export function Footer() {
  return (
    <footer className="relative border-t border-hairline bg-graphite text-warm" data-section="Footer">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-medium tracking-tight">SIFISO</span>
              <span className="label text-stone">Holdings</span>
            </div>
            <p className="display-md mt-6 max-w-sm text-2xl text-warm/90">The Operating System for Africa’s Built Environment.</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">
              Infrastructure asset management, spatial planning &amp; GIS, and valuations — delivered through MERIDIAN™.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="label mb-5 text-stone">Navigate</div>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="u-line text-sm text-warm/85 hover:text-warm">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/team" className="u-line text-sm text-warm/85 hover:text-warm">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="label mb-5 text-stone">Offices</div>
            <ul className="space-y-4">
              {OFFICES.map((o) => (
                <li key={o.city} className="text-sm">
                  <div className="text-warm/90">{o.city}</div>
                  <div className="tnum text-xs text-stone">
                    {o.lat.toFixed(4)}° S · {o.lng.toFixed(4)}° E
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="label mb-5 text-stone">Platform</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/meridian" className="u-line text-warm/85 hover:text-warm">
                  MERIDIAN™
                </Link>
              </li>
              <li>
                <Link href="/meridian#modules" className="u-line text-warm/85 hover:text-warm">
                  Modules
                </Link>
              </li>
              <li>
                <Link href="/meridian#demo" className="u-line text-warm/85 hover:text-warm">
                  Request a demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="label mt-20 flex flex-col gap-3 border-t border-hairline pt-6 text-stone md:flex-row md:items-center md:justify-between">
          <span>© 2026 Sifiso Holdings (Pty) Ltd. All rights reserved.</span>
          <span className="flex gap-6">
            <span>MERIDIAN™ v4.2</span>
            <span>POPIA compliant</span>
            <span>ISO 27001</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
