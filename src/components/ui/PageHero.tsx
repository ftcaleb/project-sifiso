import { SplitText } from './SplitText';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';
import { SectionFrame } from './SectionFrame';

type Props = {
  eyebrow: string;
  index: string;
  title: string;
  lede?: string;
  ref_?: string;
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, index, title, lede, ref_, children }: Props) {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 md:pt-52 md:pb-28" data-section={eyebrow}>
      <div className="blueprint-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />
      <SectionFrame tl={`SEC ${index}`} tr={ref_ ?? 'SIFISO HOLDINGS'} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <SplitText as="h1" text={title} className="display mt-8 max-w-5xl text-[clamp(2.75rem,8vw,7rem)]" immediate />
        {lede && (
          <Reveal delay={0.5} className="mt-10 max-w-2xl text-lg leading-relaxed text-stone md:text-xl">
            {lede}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
