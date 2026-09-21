# Sifiso Holdings — website

"The Operating System for Africa's Built Environment."
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP ScrollTrigger · Lenis · react-three-fiber · Spline.

Phase 0 research lives in [`research/investigation.md`](research/investigation.md). Read it before touching the design system: it documents what was observed on bentley.com, palantir.com, arup.com, sbp.de, esri.com, nvidia.com/omniverse, 21st.dev and spline.design, and how each finding was cross-checked against the brief.

## Run

```bash
npm install
npm run dev -- -p 3105   # Next dev server (port 3000 is often taken)
npm run preview          # static build + Cloudflare Pages runtime, incl. /api/contact
npm run deploy           # build and publish to Cloudflare Pages
npm run typecheck
```

`npm run dev` does not run the enquiry form: that lives in a Cloudflare Pages Function, so use `npm run preview` (http://localhost:8788) to exercise it locally. Local Function secrets go in `.dev.vars`, which is git-ignored.

## Routes

| Route | Content |
|---|---|
| `/` | Cinematic 3D hero, four service pillars (glass cards), live stat ticker, MERIDIAN™ teaser, client-type marquee, closing CTA |
| `/about` | Story, values, timeline (scroll-drawn line), leadership |
| `/services` | Four anchored pillars (`#asset-management`, `#spatial-planning`, `#valuations`, `#data-analytics`) with scroll-drawn infrastructure lines between them |
| `/meridian` | Product page: scroll-ticking readouts, module toggles with simulated dashboards, spatial overlay that draws itself, architecture, live event stream, demo CTA |
| `/sectors` | Sector cards and track record table |
| `/insights`, `/insights/[slug]` | Publications list and article template |
| `/team`, `/team/[slug]` | Team grid and repeatable bio template |
| `/contact` | Enquiry form (`/api/contact`), offices, plotted office map, self-service QR generator |

## Design system (enforced in `tailwind.config.ts` and `globals.css`)

One accent. `blueprint #1D4E89` is a **signal, never a surface**: CTA border/fill, active-route marker in the HUD index, one key data-line per viewport, hover glow on card borders. It never fills a background and never does two jobs in one viewport — the hero's Blueprint element is the CTA, so the 3D model is monochrome; the module toggles' Blueprint element is the data-line in the preview, so the active tab is marked in warm white.

Everything else is `graphite #0B0C0E`, `bone #F4F2ED`, `charcoal #14161A`, `warm #EDEBE4`, `stone #8A8D93`, `hairline #2A2D33`.

Type: Space Grotesk 300/400/500 for display and for all uppercase labels/readouts (with tabular figures), Inter 400/500 for body.

Motion rules (from the investigation): reveals use expo-out `cubic-bezier(0.19,1,0.22,1)` or cubic-out; springs are used **only** for cursor-following (magnetic buttons, card spotlight, 3D parallax). Everything respects `prefers-reduced-motion`.

## The 3D hero

`src/components/hero/SplineHero.tsx` mounts a Spline scene when `NEXT_PUBLIC_SPLINE_SCENE` is set (copy `.env.example` to `.env.local`). If the scene contains an object named `Rig`, the cursor steers it in addition to whatever Look At / Follow events are authored in Spline.

With no scene URL, `Hero3D.tsx` renders a procedural spatial grid / city model in react-three-fiber with the same cursor-parallax behaviour. It pauses rendering when scrolled out of view.

## Imagery

No local assets. All photos are Unsplash (free commercial use) referenced in `src/lib/images.ts`; every ID was verified live. Photos always render through the `Duotone` component (desaturated + graphite multiply) so no photograph can introduce a second accent.

## Hosting

The site is a **static export** (`output: 'export'`) served from Cloudflare Pages, plus one Pages Function for the enquiry form. Nothing needs a Node server, so hosting is on Cloudflare's free tier.

- `out/` — the built site, published with `wrangler pages deploy`.
- `functions/` — the only server-side code. Cloudflare routes by file path: `contact.ts` handles the enquiry form, `document.ts` emails the capability statements.


> **Testing the forms locally.** `next dev` does not run the Cloudflare Pages Functions in `/functions`, so `POST /api/*` falls through to Next's 404 HTML page. Use `npm run preview` (http://localhost:8788) for anything that submits a form. The client helper in `src/lib/post-json.ts` detects the HTML response and shows a readable message instead of a JSON parse error.

## Contact form email

`ContactForm.tsx` posts to `/api/contact`, handled by the Pages Function, which sends two emails through **Resend's HTTP API** (not SMTP — Cloudflare Workers cannot open SMTP sockets): an internal notification to `MAIL_TO` with reply-to set to the enquirer, and an auto-reply to the enquirer. Templates live in `src/lib/mail.ts`. If the auto-reply fails the enquiry still succeeds, since the notification is what matters.

Protection: hidden honeypot field (bots get a fake success), server-side validation, and a rate limit of 5 submissions per IP per 10 minutes.

Environment variables, set in the Cloudflare Pages project (and in `.dev.vars` locally):

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | Secret. From resend.com. |
| `MAIL_FROM` | Must be `onboarding@resend.dev` until a domain is verified in Resend. |
| `MAIL_TO` | Where enquiries land. |
| `MAIL_REPLY_TO` | Reply-to on the auto-reply. |

Before launch, verify the client's domain in Resend and change `MAIL_FROM` to an address on it. Until then Resend only delivers to the account owner's own address.

## QR codes

The contact page has a browser-side generator (`QRGenerator.tsx`, using the `qrcode` package): pick a site page or paste any link, preview updates instantly, download PNG (1024px) or SVG. It encodes the domain the site is served from, so it follows a custom domain automatically. `npm run qr` also writes static codes for the home and contact pages to `public/qr/` for print.

## Capability statements

Each service pillar offers a one-page PDF from `public/documents/`. The download is not gated: clicking starts it immediately, then a panel offers to email all four. `functions/api/document.ts` sends the visitor one email covering every pillar with a download link each, and notifies `MAIL_TO` who took what. Link URLs are built from the request origin, so they follow the site onto a custom domain.

## Not wired

- Stats, track record, team and insights are placeholder content in `src/lib/data.ts`.

## Implementation notes

- **Kinetic type observer.** `SplitText` puts the `whileInView` observer on the unclipped heading and propagates variants to the words. Observing each word directly is unreliable: IntersectionObserver clips by `overflow: hidden` ancestors, and a word translated 110% out of its wrapper has zero intersection area, so it never animates.
- **Shimmer button.** `container-type: size` lives on the spark layer (absolutely positioned, so it has a definite size), not on the button; on the button it collapses the button's width.
- **Corner earmarks.** `SectionFrame` insets its labels below the fixed HUD band so section metadata never collides with the wordmark or nav.
- **Spline package.** `@splinetool/react-spline` 3.x/4.x publish ESM-only export maps that Next 14's server resolver rejects; 2.2.6 (CJS + ESM) is pinned.
- **Static export constraints.** Next's image optimiser and runtime `ImageResponse` do not exist on a static host, so `images.unoptimized` is on and the social card and Apple icon are pre-rendered PNGs in `src/app/` rather than generated per request.
- **Why not OpenNext/Workers.** `@opennextjs/cloudflare` needs Next ≥ 15.5, and that upgrade chain (React 19 → `@react-three/fiber` 9) breaks peer resolution on this tree. Static export avoids the upgrade entirely and every page here is prerendered anyway.
- **Verification.** Every route was built and screenshotted at 1440×900 and 400×860 with Playwright over Edge, including scrolled sections; the Cloudflare build was then re-verified end to end through `wrangler pages dev`.
