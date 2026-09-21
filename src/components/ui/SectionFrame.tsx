import { cn } from '@/lib/utils';

type Props = {
  tl?: string;
  tr?: string;
  bl?: string;
  br?: string;
  className?: string;
};

/**
 * Palantir-style corner "earmarks": uppercase metadata pinned to the corners of
 * a section. Structure, not decoration.
 *
 * The labels are hidden below the tablet breakpoint. On a phone there is no
 * margin for them to live in, so they landed on top of the section's own
 * eyebrow and heading. The corner ticks stay at every width — they carry the
 * framing without competing for the same space as the content.
 */
export function SectionFrame({ tl, tr, bl, br, className }: Props) {
  const c = 'label pointer-events-none absolute hidden text-stone/70 md:block';
  const tick = 'pointer-events-none absolute h-3 w-3 border-hairline';
  return (
    // pointer-events-none on the wrapper too: this is decorative, and an
    // inset-0 layer without it swallows taps across the whole section.
    <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      {tl && <span className={cn(c, 'left-6 top-[5.5rem] md:left-10 md:top-24')}>{tl}</span>}
      {tr && <span className={cn(c, 'right-6 top-[5.5rem] md:right-10 md:top-24')}>{tr}</span>}
      {bl && <span className={cn(c, 'bottom-[5.5rem] left-6 md:bottom-24 md:left-10')}>{bl}</span>}
      {br && <span className={cn(c, 'bottom-[5.5rem] right-6 md:bottom-24 md:right-10')}>{br}</span>}
      <span className={cn(tick, 'left-4 top-20 border-l border-t md:left-6 md:top-[5.25rem]')} />
      <span className={cn(tick, 'right-4 top-20 border-r border-t md:right-6 md:top-[5.25rem]')} />
      <span className={cn(tick, 'bottom-20 left-4 border-b border-l md:bottom-[5.25rem] md:left-6')} />
      <span className={cn(tick, 'bottom-20 right-4 border-b border-r md:bottom-[5.25rem] md:right-6')} />
    </div>
  );
}
