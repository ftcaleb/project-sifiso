'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { EASE_CUBIC } from '@/lib/utils';

const SECTORS = ['Municipal', 'Provincial / National', 'Bank / DFI', 'Property fund', 'Utility / SOE', 'Mining / Energy', 'Other'];

/**
 * Palantir-style inputs: transparent, bottom-border only. Focus brightens the
 * rule to warm; Blueprint is reserved for the submit button in this viewport.
 * Submission is simulated (no backend is wired) — see README.
 */
export function ContactForm() {
  const params = useSearchParams();
  const subject = params.get('subject') ?? '';
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState('sending');
    setTimeout(() => setState('sent'), 900);
  };

  const field = 'peer w-full border-0 border-b border-hairline bg-transparent px-0 py-3 text-base text-warm outline-none transition-colors duration-240 focus:border-warm placeholder:text-stone/50';
  const label = 'label mb-1 block text-stone';

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {state === 'sent' ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, ease: EASE_CUBIC }} className="border border-hairline p-8">
            <div className="label flex items-center gap-2 text-stone">
              <span className="h-1.5 w-1.5 rounded-full bg-warm" />
              Received
            </div>
            <p className="display-md mt-4 text-2xl">Thank you. A practice lead will respond within one working day.</p>
            <p className="mt-4 text-sm text-stone">Reference SH-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 9000) + 1000)}</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>
                Name
              </label>
              <input id="name" name="name" required className={field} placeholder="Full name" />
            </div>
            <div>
              <label htmlFor="org" className={label}>
                Organisation
              </label>
              <input id="org" name="org" required className={field} placeholder="Institution or company" />
            </div>
            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input id="email" name="email" type="email" required className={field} placeholder="name@organisation.gov.za" />
            </div>
            <div>
              <label htmlFor="sector" className={label}>
                Sector
              </label>
              <select id="sector" name="sector" className={`${field} appearance-none`} defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                {SECTORS.map((s) => (
                  <option key={s} value={s} className="bg-graphite">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="subject" className={label}>
                Subject
              </label>
              <input id="subject" name="subject" defaultValue={subject === 'meridian' ? 'MERIDIAN™ demonstration' : subject} className={field} placeholder="What do you need to be defensible?" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className={label}>
                Message
              </label>
              <textarea id="message" name="message" rows={4} required className={`${field} resize-none`} placeholder="Registers, rolls, frameworks, data — tell us where it stands." />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between gap-6">
              <span className="label text-stone/70">POPIA · we only use this to reply</span>
              <Button type="submit" variant="primary" magnetic={false}>
                {state === 'sending' ? 'Sending' : 'Send'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
