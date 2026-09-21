'use client';

import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Service } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { postJson } from '@/lib/post-json';
import { EASE_CUBIC } from '@/lib/utils';

type State = 'idle' | 'offered' | 'sending' | 'sent';

/**
 * Capability statement download. The PDF downloads immediately on click — no
 * gate — and a panel then offers to email the full set of four. The email is
 * sent by the /api/document Pages Function.
 */
export function DocumentDownload({ service }: { service: Service }) {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  const href = `/documents/${service.doc.file}`;
  const filename = `sifiso-${service.id}-capability-statement.pdf`;

  const onDownload = () => {
    if (state === 'idle') setState('offered');
    // focus the email field once the panel has opened
    setTimeout(() => emailRef.current?.focus(), 420);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setState('sending');
    const fd = new FormData(e.currentTarget);
    try {
      await postJson('/api/document', { ...Object.fromEntries(fd.entries()), serviceId: service.id });
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the email.');
      setState('offered');
    }
  };

  const field =
    'w-full border-0 border-b border-hairline bg-transparent px-0 py-2.5 text-sm text-warm outline-none transition-colors duration-240 focus:border-warm placeholder:text-stone/50';
  const label = 'label mb-1 block text-stone';

  return (
    <div className="mt-12 border border-hairline">
      <div className="flex flex-wrap items-center justify-between gap-5 p-5 md:p-6">
        <div className="min-w-0">
          <div className="label flex items-center gap-3 text-stone">
            <span>Capability statement</span>
            <span className="h-px w-5 bg-hairline" />
            <span>{service.doc.meta}</span>
          </div>
          <div className="mt-2 font-display text-lg font-light text-warm md:text-xl">{service.title}</div>
        </div>

        <a
          href={href}
          download={filename}
          onClick={onDownload}
          className="label inline-flex min-h-11 shrink-0 items-center gap-3 border border-hairline px-5 py-3 text-warm transition-colors duration-240 ease-cubic hover:border-stone"
        >
          Download
          <span aria-hidden className="relative block h-3 w-2.5">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
            <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-b border-r border-current" />
          </span>
        </a>
      </div>

      <AnimatePresence initial={false}>
        {state !== 'idle' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE_CUBIC }}
            className="overflow-hidden border-t border-hairline"
          >
            <div className="p-5 md:p-6">
              {state === 'sent' ? (
                <div>
                  <div className="label flex items-center gap-2 text-stone">
                    <span className="h-1.5 w-1.5 rounded-full bg-warm" />
                    Sent
                  </div>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-warm/85">
                    All four capability statements are on their way to your inbox, each with its own download link.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
                  <div className="sm:col-span-2">
                    <p className="text-sm leading-relaxed text-stone">
                      Your download has started. Want the other three as well? We will email all four, one per practice
                      area.
                    </p>
                  </div>

                  {/* Honeypot */}
                  <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                    <label htmlFor={`website-${service.id}`}>Website</label>
                    <input id={`website-${service.id}`} name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div>
                    <label htmlFor={`name-${service.id}`} className={label}>
                      Name
                    </label>
                    <input id={`name-${service.id}`} name="name" required className={field} placeholder="Full name" autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor={`email-${service.id}`} className={label}>
                      Email
                    </label>
                    <input
                      ref={emailRef}
                      id={`email-${service.id}`}
                      name="email"
                      type="email"
                      required
                      className={field}
                      placeholder="name@organisation.gov.za"
                      autoComplete="email"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`org-${service.id}`} className={label}>
                      Organisation <span className="normal-case tracking-normal text-stone/60">(optional)</span>
                    </label>
                    <input id={`org-${service.id}`} name="org" className={field} placeholder="Institution or company" autoComplete="organization" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-5 sm:col-span-2">
                    <span className="label text-stone/70">
                      {error ? <span className="text-warm">{error}</span> : 'POPIA · we only use this to send the documents'}
                    </span>
                    <Button type="submit" variant="primary" magnetic={false}>
                      {state === 'sending' ? 'Sending' : 'Email me all four'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
