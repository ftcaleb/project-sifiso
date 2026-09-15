/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Runs on Cloudflare Workers, so email goes out over Resend's HTTPS API rather
 * than SMTP. Bindings come from the Pages project's environment variables:
 *   RESEND_API_KEY, MAIL_FROM, MAIL_TO, MAIL_REPLY_TO
 */
import { autoReplyMail, internalMail, makeRef, sendEmail, type Enquiry } from '../../src/lib/mail';

type Env = {
  RESEND_API_KEY: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
  MAIL_REPLY_TO?: string;
};

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

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (clean(body.website, 200)) return json({ ok: true, ref: makeRef() });

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (rateLimited(ip)) return json({ ok: false, error: 'Too many requests. Please try again later.' }, 429);

  const e: Enquiry = {
    name: clean(body.name, 120),
    org: clean(body.org, 160),
    email: clean(body.email, 200),
    sector: clean(body.sector, 80),
    subject: clean(body.subject, 200),
    message: clean(body.message, 5000),
  };

  if (!e.name || !e.org || !e.message || !EMAIL.test(e.email)) {
    return json({ ok: false, error: 'Please complete name, organisation, a valid email and a message.' }, 422);
  }

  const to = env.MAIL_TO;
  if (!env.RESEND_API_KEY || !to) {
    return json({ ok: false, error: 'Enquiries are not configured yet.' }, 500);
  }
  const from = env.MAIL_FROM ?? 'Sifiso Holdings <onboarding@resend.dev>';
  const replyTo = env.MAIL_REPLY_TO ?? to;
  const ref = makeRef();

  try {
    await sendEmail(env.RESEND_API_KEY, { from, to, replyTo: e.email, ...internalMail(e, ref) });
  } catch (err) {
    console.error('[contact] notification failed', err);
    return json({ ok: false, error: 'We could not send your message. Please email us directly.' }, 502);
  }

  try {
    await sendEmail(env.RESEND_API_KEY, { from, to: e.email, replyTo, ...autoReplyMail(e, ref) });
  } catch (err) {
    // The internal notification already succeeded; a failed auto-reply must not fail the enquiry.
    console.warn('[contact] auto-reply failed', err);
  }

  return json({ ok: true, ref });
};
