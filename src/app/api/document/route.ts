import { NextResponse } from 'next/server';
import { SERVICES } from '@/lib/data';
import { documentLeadMail, documentsMail, sendEmail, type DocLink } from '@/lib/mail';
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

  // Honeypot: real users never fill this hidden field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true, emailed: true });

  if (rateLimited(clientIp(req), 8)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const org = clean(body.org, 160);
  const serviceId = clean(body.serviceId, 60);

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please give a name and a valid email address.' }, { status: 422 });
  }

  const requested = SERVICES.find((s) => s.id === serviceId);
  if (!requested) return NextResponse.json({ ok: false, error: 'Unknown document.' }, { status: 404 });

  const to = process.env.MAIL_TO ?? process.env.SMTP_USER;
  if (!to) return NextResponse.json({ ok: false, error: 'Document delivery is not configured yet.' }, { status: 500 });
  const replyTo = process.env.MAIL_REPLY_TO ?? to;

  // Build download links from the request origin, so they follow the site onto
  // a custom domain without a config change.
  const origin = process.env.SITE_URL?.replace(/\/$/, '') ?? new URL(req.url).origin;
  const docs: DocLink[] = SERVICES.map((s) => ({
    index: s.index,
    title: s.title,
    blurb: s.doc.blurb,
    url: `${origin}/documents/${s.doc.file}`,
    requested: s.id === requested.id,
  }));

  // The lead notification goes first: it is the part of this request with real
  // business value, and it must not be lost because the visitor's copy failed.
  try {
    await sendEmail({ to, replyTo: email, ...documentLeadMail(name, email, org, requested.title) });
  } catch (err) {
    console.error('[document] lead notification failed', err);
    return NextResponse.json(
      { ok: false, error: 'We could not record your request. Please email us directly.' },
      { status: 502 },
    );
  }

  let emailed = true;
  try {
    await sendEmail({ to: email, replyTo, ...documentsMail(name, docs) });
  } catch (err) {
    emailed = false;
    console.warn('[document] visitor copy failed', err);
  }

  return NextResponse.json({ ok: true, emailed });
}
