'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { postJson } from '@/lib/post-json';
import { EASE_CUBIC } from '@/lib/utils';

const SECTORS = ['Municipal', 'Provincial / National', 'Bank / DFI', 'Property fund', 'Utility / SOE', 'Mining / Energy', 'Other'];

/**
 * Palantir-style inputs: transparent, bottom-border only. Focus brightens the
 * rule to warm; Blueprint is reserved for the submit button in this viewport.
 * Posts to /api/contact (Nodemailer over SMTP) with a honeypot field.
 */
export function ContactForm() {
  const params = useSearchParams();
  const subject = params.get('subject') ?? '';
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setState('sending');
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const data = await postJson<{ ok: boolean; ref?: string }>('/api/contact', payload);
      setRef(data.ref ?? '');
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send your message.');
      setState('idle');
    }
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
            <p className="mt-4 text-sm text-stone">
              Reference {ref}. A copy has been sent to your email address.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-8 sm:grid-cols-2" noValidate>
            {/* Honeypot — hidden from humans, filled by bots */}
            <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div>
              <label htmlFor="name" className={label}>
                Name
              </label>
              <input id="name" name="name" required className={field} placeholder="Full name" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="org" className={label}>
                Organisation
              </label>
              <input id="org" name="org" required className={field} placeholder="Institution or company" autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input id="email" name="email" type="email" required className={field} placeholder="name@organisation.gov.za" autoComplete="email" />
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
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-6">
              <span className="label text-stone/70">{error ? <span className="text-warm">{error}</span> : 'POPIA · we only use this to reply'}</span>
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
