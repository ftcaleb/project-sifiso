import { Button } from '@/components/ui/Button';
import { SplitText } from '@/components/ui/SplitText';
import { SectionFrame } from '@/components/ui/SectionFrame';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center bg-graphite" data-section="Not found">
      <div className="blueprint-grid absolute inset-0 opacity-60" />
      <SectionFrame tl="ERR 404" tr="OFF REGISTER" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="readout text-[clamp(5rem,20vw,16rem)] text-warm/90">404</div>
        <SplitText as="h1" text="This coordinate is not on the register." className="display-md mt-2 text-2xl md:text-4xl" immediate />
        <div className="mt-10">
          <Button href="/" variant="primary">
            Return to overview
          </Button>
        </div>
      </div>
    </section>
  );
}
