import { NextResponse } from 'next/server';
import { autoReplyMail, getTransport, internalMail, makeRef, type Enquiry } from '@/lib/mail';

export const runtime = 'nodejs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < LIMIT.windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT.max;
}

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true, ref: makeRef() });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });

  const e: Enquiry = {
    name: clean(body.name, 120),
    org: clean(body.org, 160),
    email: clean(body.email, 200),
    sector: clean(body.sector, 80),
    subject: clean(body.subject, 200),
    message: clean(body.message, 5000),
  };

  if (!e.name || !e.org || !e.message || !EMAIL.test(e.email)) {
    return NextResponse.json({ ok: false, error: 'Please complete name, organisation, a valid email and a message.' }, { status: 422 });
  }

  const ref = makeRef();
  try {
    const transport = getTransport();
    const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;
    const to = process.env.MAIL_TO ?? process.env.SMTP_USER;
    const replyTo = process.env.MAIL_REPLY_TO ?? to;

    const internal = internalMail(e, ref);
    await transport.sendMail({ from, to, replyTo: e.email, ...internal });

    const reply = autoReplyMail(e, ref);
    await transport.sendMail({ from, to: e.email, replyTo, ...reply });

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error('[contact] send failed', err);
    return NextResponse.json({ ok: false, error: 'We could not send your message. Please email us directly.' }, { status: 502 });
  }
}
