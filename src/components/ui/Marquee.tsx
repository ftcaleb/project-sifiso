import { cn } from '@/lib/utils';

export function Marquee({ items, className, speed = 40 }: { items: string[]; className?: string; speed?: number }) {
  const row = [...items, ...items];
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <div className="flex w-max animate-marquee will-change-transform" style={{ animationDuration: `${speed}s` }}>
        {row.map((item, i) => (
          <span key={i} className="label flex items-center gap-8 pr-8 text-stone">
            <span className="whitespace-nowrap font-display text-lg font-light normal-case tracking-tight text-warm/80">{item}</span>
            <span className="h-3 w-px bg-hairline" />
          </span>
        ))}
      </div>
    </div>
  );
}
