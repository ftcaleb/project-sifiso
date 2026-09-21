/**
 * POST JSON and read a JSON reply, with a readable error when the endpoint
 * returns something else.
 *
 * Under `next dev` the Cloudflare Pages Functions in /functions do not run, so
 * /api/* falls through to Next's 404 HTML page. Parsing that as JSON is what
 * produces `Unexpected token '<', "<!DOCTYPE "...`. Use `npm run preview` to
 * exercise the forms locally.
 */
export async function postJson<T extends { ok?: boolean; error?: string }>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We could not reach the server. Please check your connection and try again.');
  }

  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) {
    if (res.status === 404 && process.env.NODE_ENV !== 'production') {
      console.warn(
        `[postJson] ${url} returned HTML, not JSON. Cloudflare Pages Functions do not run under "next dev" — use "npm run preview" instead.`,
      );
    }
    throw new Error('We could not reach the server. Please try again, or email us directly.');
  }

  const data = (await res.json()) as T;
  if (!res.ok || data.ok === false) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}
