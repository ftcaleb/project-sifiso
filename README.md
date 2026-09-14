# Sifiso Holdings — website

"The Operating System for Africa's Built Environment."
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP ScrollTrigger · Lenis · react-three-fiber · Spline.

Phase 0 research lives in [`research/investigation.md`](research/investigation.md). Read it before touching the design system: it documents what was observed on bentley.com, palantir.com, arup.com, sbp.de, esri.com, nvidia.com/omniverse, 21st.dev and spline.design, and how each finding was cross-checked against the brief.

## Run

```bash
npm install
npm run dev -- -p 3105   # http://localhost:3105 (port 3000 is often taken)
npm run build && npm start
npm run typecheck
```

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
| `/contact` | Form (Nodemailer via `/api/contact`), offices, plotted office map |

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

## Contact form email

`ContactForm.tsx` posts to `src/app/api/contact/route.ts`, which sends two emails with Nodemailer over SMTP: an internal notification to `MAIL_TO` (reply-to set to the enquirer) and an auto-reply to the enquirer (reply-to `MAIL_REPLY_TO`). Templates live in `src/lib/mail.ts`. Protection: hidden honeypot field (bots get a fake success), server-side validation, and an in-memory rate limit of 5 submissions per IP per 10 minutes (per server instance; use an edge rate limiter on serverless hosts if abuse appears).

Set these in `.env.local` (see `.env.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`, `MAIL_REPLY_TO`, `SITE_URL`. Gmail needs an App Password with 2FA enabled. On Vercel, add the same variables in Project Settings → Environment Variables.

## Not wired

- Stats, track record, team and insights are placeholder content in `src/lib/data.ts`.

## Implementation notes

- **Kinetic type observer.** `SplitText` puts the `whileInView` observer on the unclipped heading and propagates variants to the words. Observing each word directly is unreliable: IntersectionObserver clips by `overflow: hidden` ancestors, and a word translated 110% out of its wrapper has zero intersection area, so it never animates.
- **Shimmer button.** `container-type: size` lives on the spark layer (absolutely positioned, so it has a definite size), not on the button; on the button it collapses the button's width.
- **Corner earmarks.** `SectionFrame` insets its labels below the fixed HUD band so section metadata never collides with the wordmark or nav.
- **Spline package.** `@splinetool/react-spline` 3.x/4.x publish ESM-only export maps that Next 14's server resolver rejects; 2.2.6 (CJS + ESM) is pinned.
- **Verification.** Every route was built (`next build`, 26 static pages) and screenshotted at 1440×900 and 400×860 with Playwright over Edge, including scrolled sections, before hand-off.
