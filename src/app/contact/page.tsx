import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OFFICES } from '@/lib/data';
import { IMG } from '@/lib/images';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { OfficeMap } from '@/components/contact/OfficeMap';
import { QRGenerator } from '@/components/contact/QRGenerator';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DrawLine, Reveal } from '@/components/ui/Reveal';
import { Duotone } from '@/components/ui/Duotone';

export const metadata: Metadata = { title: 'Contact', description: 'Offices in Johannesburg, Cape Town and Durban.' };

export default function ContactPage() {
  return (
    <>
      <PageHero index="08" eyebrow="Contact" title="Tell us what you are custodian of." lede="Three offices, one register. A practice lead answers every enquiry within one working day." ref_="CONTACT · 03 OFFICES" />

      <section className="relative bg-graphite pb-28 md:pb-40" data-section="Enquiry">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-10">
          <div className="md:col-span-7">
            <Eyebrow index="01">Enquiry</Eyebrow>
            <Reveal delay={0.2} className="mt-8">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Eyebrow index="02">Offices</Eyebrow>
            <ul className="mt-8">
              {OFFICES.map((o, i) => (
                <li key={o.city}>
                  <DrawLine delay={i * 0.08} />
                  <Reveal delay={0.1 + i * 0.08} y={12} className="grid gap-1 py-5">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-2xl font-light">{o.city}</span>
                      <span className="label text-stone">{o.role}</span>
                    </div>
                    <div className="text-sm text-stone">{o.address}</div>
                    <div className="tnum mt-1 flex justify-between text-xs text-stone">
                      <span>{o.phone}</span>
                      <span>
                        {o.lat.toFixed(4)}° S · {o.lng.toFixed(4)}° E
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
              <DrawLine delay={0.4} />
            </ul>
            <Reveal delay={0.5} y={30} className="mt-10">
              <Duotone src={IMG.office} alt="Sifiso Holdings office interior" className="aspect-[16/10] w-full" parallax={30} sizes="(max-width:768px) 100vw, 40vw" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative border-t border-hairline bg-graphite py-20 md:py-40" data-section="Map">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow index="03">Where we are</Eyebrow>
              <h2 className="display-md mt-6 text-3xl md:text-4xl">Plotted, not pinned.</h2>
              <p className="mt-6 text-sm leading-relaxed text-stone">
                Our offices sit on the same graticule as our clients&apos; assets. Johannesburg is head office; Cape Town and
                Durban serve the Western Cape and KwaZulu-Natal practices.
              </p>
            </div>
            <div className="md:col-span-8">
              <OfficeMap />
            </div>
          </div>
        </div>
      </section>

      <QRGenerator />
    </>
  );
}
