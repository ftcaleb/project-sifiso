import { NextResponse } from 'next/server';
import { autoReplyMail, internalMail, makeRef, sendEmail, type Enquiry } from '@/lib/mail';
import { clean, clientIp, EMAIL_RE, rateLimited } from '@/lib/rate-limit';

// Node runtime: Nodemailer opens an SMTP socket, which the edge runtime cannot.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true, ref: makeRef() });

  if (rateLimited(clientIp(req), 5)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const e: Enquiry = {
    name: clean(body.name, 120),
    org: clean(body.org, 160),
    email: clean(body.email, 200),
    sector: clean(body.sector, 80),
    subject: clean(body.subject, 200),
    message: clean(body.message, 5000),
  };

  if (!e.name || !e.org || !e.message || !EMAIL_RE.test(e.email)) {
    return NextResponse.json(
      { ok: false, error: 'Please complete name, organisation, a valid email and a message.' },
      { status: 422 },
    );
  }

  const to = process.env.MAIL_TO ?? process.env.SMTP_USER;
  if (!to) return NextResponse.json({ ok: false, error: 'Enquiries are not configured yet.' }, { status: 500 });
  const replyTo = process.env.MAIL_REPLY_TO ?? to;
  const ref = makeRef();

  // The notification is the part that matters; send it first so a failed
  // auto-reply can never cost us the enquiry.
  try {
    await sendEmail({ to, replyTo: e.email, ...internalMail(e, ref) });
  } catch (err) {
    console.error('[contact] notification failed', err);
    return NextResponse.json(
      { ok: false, error: 'We could not send your message. Please email us directly.' },
      { status: 502 },
    );
  }

  try {
    await sendEmail({ to: e.email, replyTo, ...autoReplyMail(e, ref) });
  } catch (err) {
    console.warn('[contact] auto-reply failed', err);
  }

  return NextResponse.json({ ok: true, ref });
}
