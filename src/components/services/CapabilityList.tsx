'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Capability } from '@/lib/data';
import { cn, EASE_CUBIC, EASE_EXPO } from '@/lib/utils';

/**
 * Capability lines that expand on hover, on keyboard focus and on tap.
 * One row open at a time; leaving the list closes it.
 *
 * Accent discipline: the single Blueprint element is the rule above the open
 * row. The index and the plus/minus marker brighten to warm rather than taking
 * a second accent, so only one job is being signalled in the viewport.
 */
export function CapabilityList({ items }: { items: Capability[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const reduce = useReducedMotion();

  // On a touch screen a tap fires a synthetic mouseenter *and* a click, so the
  // hover handler opened the row and the click immediately closed it again.
  // Bind the hover handlers only where hovering is real.
  useEffect(() => setCanHover(window.matchMedia('(hover: hover)').matches), []);

  return (
    <ul className="mt-12" onMouseLeave={canHover ? () => setOpen(null) : undefined}>
      {items.map((c, i) => {
        const isOpen = open === i;
        return (
          <li key={c.title}>
            <motion.div
              className={cn(
                'h-px w-full origin-left transition-colors duration-380 ease-cubic',
                isOpen ? 'bg-blueprint' : 'bg-hairline',
              )}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.1 + i * 0.06 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.15 + i * 0.06 }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onMouseEnter={canHover ? () => setOpen(i) : undefined}
                onFocus={canHover ? () => setOpen(i) : undefined}
                onClick={() => setOpen((prev) => (prev === i ? null : i))}
                className="flex w-full items-baseline gap-5 py-3.5 text-left outline-none"
              >
                <span
                  className={cn(
                    'label w-6 shrink-0 transition-colors duration-240 ease-cubic',
                    isOpen ? 'text-warm' : 'text-stone',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  className={cn(
                    'flex-1 text-sm transition-colors duration-240 ease-cubic md:text-[0.95rem]',
                    isOpen ? 'text-warm' : 'text-warm/85',
                  )}
                >
                  {c.title}
                </span>

                {/* plus that becomes a minus */}
                <span aria-hidden className="relative mt-1.5 block h-2.5 w-2.5 shrink-0">
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-px w-full -translate-y-1/2 transition-colors duration-240 ease-cubic',
                      isOpen ? 'bg-warm' : 'bg-stone',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transition-transform duration-380 ease-expo',
                      isOpen ? 'scale-y-0 bg-warm' : 'scale-y-100 bg-stone',
                    )}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.38, ease: EASE_CUBIC }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-xl pb-5 pl-11 pr-6 text-sm leading-relaxed text-stone">{c.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </li>
        );
      })}

      <motion.div
        className="h-px w-full origin-left bg-hairline"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.5 }}
      />
    </ul>
  );
}
