import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Email over SMTP with Nodemailer, running on Vercel's Node runtime.
 *
 * Chosen over an HTTP email API because SMTP delivers to any recipient with no
 * verified sending domain. Domain-based providers refuse every address except
 * the account owner until DNS is set up, which made it impossible to send a
 * prospect their documents before the client's domain exists.
 */

export type Enquiry = {
  name: string;
  org: string;
  email: string;
  sector: string;
  subject: string;
  message: string;
};

type Mail = { to: string; replyTo?: string; subject: string; html: string; text: string };

function env(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing environment variable ${name}`);
  return v;
}

let cached: Transporter | null = null;

function transport() {
  if (cached) return cached;
  const port = Number(env('SMTP_PORT', '465'));
  cached = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port,
    secure: port === 465,
    auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
  });
  return cached;
}

export async function sendEmail(m: Mail) {
  const from = process.env.MAIL_FROM ?? env('SMTP_USER');
  const info = await transport().sendMail({ from, ...m });
  if (info.rejected?.length) throw new Error(`SMTP rejected: ${info.rejected.join(', ')}`);
  return info;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

/* Plain, monochrome HTML in the site's voice. No images, one hairline. */
function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#0B0C0E;color:#EDEBE4;font-family:Inter,Helvetica,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
<div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A8D93">Sifiso Holdings</div>
<h1 style="font-weight:300;font-size:26px;letter-spacing:-.02em;margin:18px 0 24px">${title}</h1>
<div style="border-top:1px solid #2A2D33;padding-top:20px;font-size:15px;line-height:1.6">${body}</div>
<div style="margin-top:36px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A8D93">The Operating System for Africa’s Built Environment</div>
</div></body></html>`;
}

function row(k: string, v: string) {
  return `<tr><td style="padding:8px 12px 8px 0;color:#8A8D93;font-size:11px;letter-spacing:.12em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 0;border-bottom:1px solid #2A2D33">${v}</td></tr>`;
}

export function internalMail(e: Enquiry, ref: string) {
  const table = `<table style="border-collapse:collapse;width:100%">${[
    row('Reference', ref),
    row('Name', esc(e.name)),
    row('Organisation', esc(e.org)),
    row('Email', `<a href="mailto:${esc(e.email)}" style="color:#EDEBE4">${esc(e.email)}</a>`),
    row('Sector', esc(e.sector || '—')),
    row('Subject', esc(e.subject || '—')),
  ].join('')}</table>
<p style="margin-top:20px;white-space:pre-wrap">${esc(e.message)}</p>`;
  return {
    subject: `[Enquiry ${ref}] ${e.subject || e.org} — ${e.name}`,
    html: shell('New enquiry', table),
    text: `Reference: ${ref}\nName: ${e.name}\nOrganisation: ${e.org}\nEmail: ${e.email}\nSector: ${e.sector}\nSubject: ${e.subject}\n\n${e.message}`,
  };
}

export function autoReplyMail(e: Enquiry, ref: string) {
  const first = e.name.trim().split(' ')[0] || 'there';
  const body = `<p>Hello ${esc(first)},</p>
<p>Thank you for contacting Sifiso Holdings. Your enquiry has been logged under reference <strong>${ref}</strong> and a practice lead will respond within one working day.</p>
<p>For the record, this is what we received:</p>
<p style="color:#8A8D93;white-space:pre-wrap;border-left:1px solid #2A2D33;padding-left:14px">${esc(e.message)}</p>
<p>If this was not you, you can ignore this message.</p>
<p>— Sifiso Holdings</p>`;
  return {
    subject: `We have your enquiry — ${ref}`,
    html: shell('Received.', body),
    text: `Hello ${first},\n\nThank you for contacting Sifiso Holdings. Your enquiry has been logged under reference ${ref} and a practice lead will respond within one working day.\n\nWhat we received:\n${e.message}\n\n— Sifiso Holdings`,
  };
}

export type DocLink = { index: string; title: string; blurb: string; url: string };

/**
 * Sent to whoever downloads a capability statement: the one they asked for,
 * with a download link. A link rather than an attachment, so the email stays
 * light and always points at the current file on the site.
 */
export function documentMail(name: string, doc: DocLink) {
  const first = name.trim().split(" ")[0] || "there";

  const body = `<p>Hello ${esc(first)},</p>
<p>Here is the capability statement you asked for.</p>
<table style="border-collapse:collapse;width:100%;margin-top:8px"><tr><td style="padding:14px 0;border-top:1px solid #2A2D33;border-bottom:1px solid #2A2D33">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8A8D93">${doc.index}</div>
<div style="font-size:19px;margin-top:6px">${esc(doc.title)}</div>
<div style="font-size:14px;line-height:1.55;color:#8A8D93;margin-top:8px">${esc(doc.blurb)}</div>
<div style="margin-top:14px"><a href="${doc.url}" style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#EDEBE4;border-bottom:1px solid #1D4E89;padding-bottom:2px;text-decoration:none">Download PDF</a></div>
</td></tr></table>
<p style="margin-top:22px">If this is close to something you are working on, reply to this email and we will set up a conversation with the practice lead.</p>
<p>— Sifiso Holdings</p>`;

  const text = `Hello ${first},

Here is the capability statement you asked for.

${doc.index} ${doc.title}
${doc.blurb}
${doc.url}

If this is close to something you are working on, reply to this email and we will set up a conversation with the practice lead.

— Sifiso Holdings`;

  return { subject: `${doc.title} — Sifiso Holdings`, html: shell("Your capability statement.", body), text };
}

/** Internal notification that someone took a document. */
export function documentLeadMail(name: string, email: string, org: string, title: string) {
  const body = `<table style="border-collapse:collapse;width:100%">${[
    row('Document', esc(title)),
    row('Name', esc(name)),
    row('Organisation', esc(org || '—')),
    row('Email', `<a href="mailto:${esc(email)}" style="color:#EDEBE4">${esc(email)}</a>`),
  ].join('')}</table>`;
  return {
    subject: `[Document] ${title} — ${name}`,
    html: shell('Capability statement downloaded', body),
    text: `Document: ${title}\nName: ${name}\nOrganisation: ${org}\nEmail: ${email}`,
  };
}

export function makeRef() {
  const y = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SH-${y}-${n}`;
}
