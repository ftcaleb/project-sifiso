import { DashboardPreview } from '@/components/meridian/DashboardPreview';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';

export function MeridianTeaser() {
  return (
    <section id="platform" className="relative overflow-hidden border-y border-hairline bg-graphite py-20 md:py-40" data-section="MERIDIAN™">
      <div className="blueprint-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_80%_at_80%_50%,#000,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12 md:px-10 lg:gap-10">
        <div className="md:col-span-6">
          <Eyebrow index="03">Flagship platform</Eyebrow>
          <SplitText as="h2" text="MERIDIAN™" className="display mt-6 text-[clamp(2.25rem,6.4vw,6.4rem)]" />
          <SplitText
            as="p"
            text="One platform. Every asset. Every hectare."
            className="display-md mt-4 text-2xl text-warm/80 md:text-3xl"
            delay={0.2}
          />
          <Reveal delay={0.35} className="mt-8 max-w-md text-base leading-relaxed text-stone">
            The spatial and asset intelligence platform that runs beneath every engagement: registers, cadastre, valuation
            rolls and compliance in a single, versioned, queryable truth.
          </Reveal>
          <Reveal delay={0.45} className="mt-10">
            <Button href="/meridian" variant="ghost">
              Enter the platform
            </Button>
          </Reveal>
        </div>
        <Reveal className="md:col-span-6" delay={0.2} y={40}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(244,242,237,0.04),transparent)] md:-inset-6" />
            <DashboardPreview variant="register" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
