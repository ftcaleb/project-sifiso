import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { SectionFrame } from '@/components/ui/SectionFrame';

/** Light section. The single filled Blueprint CTA on the page lives here. */
export function ClosingCTA({
  title = 'Put your assets on the map.',
  text = 'A conversation with our practice leads is the fastest way to find out what your register, roll or framework is missing.',
  cta = 'Start a conversation',
  href = '/contact',
}: {
  title?: string;
  text?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section id="contact" className="light relative overflow-hidden py-32 md:py-48" data-section="Contact">
      <div className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(50%_70%_at_50%_100%,#000,transparent)]" />
      <SectionFrame tl="SEC 05" tr="CONTACT" bl="JHB · CPT · DBN" br="RESPONSE < 24H" className="[&_span]:text-charcoal/50 [&_span.border-hairline]:border-charcoal/20" />
      <div className="relative mx-auto max-w-7xl px-6 text-center md:px-10">
        <Eyebrow className="justify-center text-charcoal/60" lineClassName="bg-charcoal/40">
          Next step
        </Eyebrow>
        <SplitText as="h2" text={title} className="display mx-auto mt-8 max-w-4xl text-[clamp(2.75rem,7.5vw,6.5rem)] text-charcoal" />
        <Reveal delay={0.4} className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-charcoal/70 md:text-lg">
          {text}
        </Reveal>
        <Reveal delay={0.55} className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Button href={href} variant="solid">
            {cta}
          </Button>
          <Button href="/meridian" variant="ghost" className="text-charcoal">
            See MERIDIAN™
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
