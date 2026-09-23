# Sifiso Holdings — website

"The Operating System for Africa's Built Environment."
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP ScrollTrigger · Lenis · react-three-fiber · Spline · Nodemailer, on Vercel.

**Live: https://sifiso-holding.vercel.app**

This repo is connected to the Vercel project: pushing to `main` deploys to production, and any other branch gets a preview URL. `npx vercel deploy --prod` still works for deploying without committing.

Phase 0 research lives in [`research/investigation.md`](research/investigation.md). Read it before touching the design system: it documents what was observed on bentley.com, palantir.com, arup.com, sbp.de, esri.com, nvidia.com/omniverse, 21st.dev and spline.design, and how each finding was cross-checked against the brief.

## Run

```bash
npm install
npm run dev -- -p 3010   # http://localhost:3010
npm run build && npm start
npm run typecheck
```

The form endpoints need SMTP credentials: copy `.env.example` to `.env.local` and fill them in. They run under `next dev` as well as in production.

## Routes

| Route | Content |
|---|---|
| `/` | Cinematic 3D hero, four service pillars (glass cards), client-type marquee, closing CTA |
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

Deployed to **Vercel**. Every page is prerendered at build time; `/api/contact` and `/api/document` run as Node serverless functions, because Nodemailer opens an SMTP socket.

`vercel.json` pins `framework: nextjs`. Without it Vercel serves the project as a bare static site: every page 404s while files in `public/` still resolve.

## Contact form email

`ContactForm.tsx` posts to `/api/contact` and `DocumentDownload.tsx` to `/api/document`. Both send through **Nodemailer over SMTP**; templates live in `src/lib/mail.ts`.

Each route sends the internal notification **first** and treats the visitor's copy as best-effort, so a failed auto-reply can never cost you the lead.

Protection: hidden honeypot field (bots get a fake success), server-side validation, and a rate limit of 5 submissions per IP per 10 minutes.

Environment variables, set in the Vercel project (and in `.env.local` locally):

| Variable | Notes |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` | `smtp.gmail.com` / `465`. |
| `SMTP_USER` / `SMTP_PASS` | Gmail address and an **App Password** (2FA must be on). |
| `MAIL_FROM` | Display name and address that mail is sent from. |
| `MAIL_TO` | Where enquiries land. |
| `MAIL_REPLY_TO` | Reply-to on the auto-reply. |

## QR codes

The contact page has a browser-side generator (`QRGenerator.tsx`, using the `qrcode` package): pick a site page or paste any link, preview updates instantly, download PNG (1024px) or SVG. It encodes the domain the site is served from, so it follows a custom domain automatically. `npm run qr` also writes static codes for the home and contact pages to `public/qr/` for print.

## Capability statements

Each service pillar offers a one-page PDF from `public/documents/`. The download is not gated: clicking starts it immediately, then a panel offers to email that statement. `src/app/api/document/route.ts` emails the visitor the statement they asked for with a download link, and notifies `MAIL_TO` who took what. Link URLs are built from the request origin, so they follow the site onto a custom domain.

### Why SMTP rather than an email API

Domain-based providers such as Resend refuse every recipient except the account owner until a sending domain is verified in DNS. That makes it impossible to send a prospect their documents before the client's domain exists. Gmail SMTP delivers to any recipient with just an app password.

At launch, move to a mailbox on the client’s own domain by changing `SMTP_*` and `MAIL_FROM`. No code change.

## Not wired

- Stats, track record, team and insights are placeholder content in `src/lib/data.ts`.

## Implementation notes

- **Kinetic type observer.** `SplitText` puts the `whileInView` observer on the unclipped heading and propagates variants to the words. Observing each word directly is unreliable: IntersectionObserver clips by `overflow: hidden` ancestors, and a word translated 110% out of its wrapper has zero intersection area, so it never animates.
- **Shimmer button.** `container-type: size` lives on the spark layer (absolutely positioned, so it has a definite size), not on the button; on the button it collapses the button's width.
- **Corner earmarks.** `SectionFrame` hides its labels below the tablet breakpoint. On a phone there is no margin for them and they printed through the section heading. The corner ticks stay at every width.
- **Spline package.** `@splinetool/react-spline` 3.x/4.x publish ESM-only export maps that Next 14's server resolver rejects; 2.2.6 (CJS + ESM) is pinned.
- **Pre-rendered social card.** The social card and Apple icon are static PNGs in `src/app/` rather than generated per request, and `images.unoptimized` is on because the Unsplash URLs are already sized.
- **Verification.** Every route was built and screenshotted at 1440×900 and 400×860 with Playwright over Edge, including scrolled sections; and both mail routes were verified against the live deployment by sending to a recipient other than the sending account.
