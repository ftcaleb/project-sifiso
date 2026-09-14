import type { Metadata } from 'next';
import { MeridianHero } from '@/components/meridian/MeridianHero';
import { FeatureToggles } from '@/components/meridian/FeatureToggles';
import { SpatialOverlay } from '@/components/meridian/SpatialOverlay';
import { Architecture } from '@/components/meridian/Architecture';
import { LiveLog } from '@/components/meridian/LiveLog';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export const metadata: Metadata = {
  title: 'MERIDIAN™ — Spatial & Asset Intelligence Platform',
  description: 'One platform. Every asset. Every hectare. Every valuation. MERIDIAN™ by Sifiso Holdings.',
};

export default function MeridianPage() {
  return (
    <>
      <MeridianHero />
      <FeatureToggles />
      <SpatialOverlay />
      <Architecture />
      <LiveLog />
      <div id="demo" className="scroll-mt-10">
        <ClosingCTA
          title="See MERIDIAN™ on your own data."
          text="We run demonstrations on a sample of your register or roll, not on ours. Allow 45 minutes."
          cta="Request a demonstration"
          href="/contact?subject=meridian"
        />
      </div>
    </>
  );
}
