/**
 * Small in-memory rate limit, per serverless instance. Enough to blunt casual
 * abuse of the public form endpoints; swap for a shared store if it ever
 * matters more than that.
 */
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, max: number, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
}

export function clientIp(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
