/**
 * Cloudflare Pages Function: POST /api/document
 *
 * Someone asked for a capability statement. The browser downloads the PDF
 * itself; this sends them an email covering all four pillars with a download
 * link on each, and notifies MAIL_TO that a document was taken.
 *
 * Download URLs are built from the request origin, so they follow the site
 * onto a custom domain without a config change.
 */
import { SERVICES } from '../../src/lib/data';
import { documentLeadMail, documentsMail, sendEmail, type DocLink } from '../../src/lib/mail';

type Env = {
  RESEND_API_KEY: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
  MAIL_REPLY_TO?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMIT = { max: 8, windowMs: 10 * 60 * 1000 };
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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const onRequestPost = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body.website, 200)) return json({ ok: true });

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (rateLimited(ip)) return json({ ok: false, error: 'Too many requests. Please try again later.' }, 429);

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const org = clean(body.org, 160);
  const serviceId = clean(body.serviceId, 60);

  if (!name || !EMAIL.test(email)) {
    return json({ ok: false, error: 'Please give a name and a valid email address.' }, 422);
  }

  const requested = SERVICES.find((s) => s.id === serviceId);
  if (!requested) return json({ ok: false, error: 'Unknown document.' }, 404);

  const to = env.MAIL_TO;
  if (!env.RESEND_API_KEY || !to) {
    return json({ ok: false, error: 'Document delivery is not configured yet.' }, 500);
  }
  const from = env.MAIL_FROM ?? 'Sifiso Holdings <onboarding@resend.dev>';
  const replyTo = env.MAIL_REPLY_TO ?? to;
  const origin = new URL(request.url).origin;

  const docs: DocLink[] = SERVICES.map((s) => ({
    index: s.index,
    title: s.title,
    blurb: s.doc.blurb,
    url: `${origin}/documents/${s.doc.file}`,
    requested: s.id === requested.id,
  }));

  try {
    await sendEmail(env.RESEND_API_KEY, { from, to: email, replyTo, ...documentsMail(name, docs) });
  } catch (err) {
    console.error('[document] delivery failed', err);
    return json({ ok: false, error: 'We could not email the documents. The download has still started.' }, 502);
  }

  try {
    await sendEmail(env.RESEND_API_KEY, {
      from,
      to,
      replyTo: email,
      ...documentLeadMail(name, email, org, requested.title),
    });
  } catch (err) {
    // The visitor already has their email; a failed internal notice must not fail the request.
    console.warn('[document] lead notification failed', err);
  }

  return json({ ok: true });
};
