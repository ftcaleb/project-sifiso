# Sifiso Holdings — website

"The Operating System for Africa's Built Environment."
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP ScrollTrigger · Lenis · react-three-fiber · Spline.

Phase 0 research lives in [`research/investigation.md`](research/investigation.md). Read it before touching the design system: it documents what was observed on bentley.com, palantir.com, arup.com, sbp.de, esri.com, nvidia.com/omniverse, 21st.dev and spline.design, and how each finding was cross-checked against the brief.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
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
| `/contact` | Form (simulated submit), offices, plotted office map |

## Design system (enforced in `tailwind.config.ts` and `globals.css`)

One accent. `blueprint #1D4E89` is a **signal, never a surface**: CTA border/fill, active-route marker in the HUD index, one key data-line per viewport, hover glow on card borders. It never fills a background and never does two jobs in one viewport — the hero's Blueprint element is the CTA, so the 3D model is monochrome; the module toggles' Blueprint element is the data-line in the preview, so the active tab is marked in warm white.

Everything else is `graphite #0B0C0E`, `bone #F4F2ED`, `charcoal #14161A`, `warm #EDEBE4`, `stone #8A8D93`, `hairline #2A2D33`.

Type: Space Grotesk 300/400/500 for display and for all uppercase labels/readouts (with tabular figures), Inter 400/500 for body.

Motion rules (from the investigation): reveals use expo-out `cubic-bezier(0.19,1,0.22,1)` or cubic-out; springs are used **only** for cursor-following (custom cursor, magnetic buttons, card spotlight, 3D parallax). Everything respects `prefers-reduced-motion`.

## The 3D hero

`src/components/hero/SplineHero.tsx` mounts a Spline scene when `NEXT_PUBLIC_SPLINE_SCENE` is set (copy `.env.example` to `.env.local`). If the scene contains an object named `Rig`, the cursor steers it in addition to whatever Look At / Follow events are authored in Spline.

With no scene URL, `Hero3D.tsx` renders a procedural spatial grid / city model in react-three-fiber with the same cursor-parallax behaviour. It pauses rendering when scrolled out of view.

## Imagery

No local assets. All photos are Unsplash (free commercial use) referenced in `src/lib/images.ts`; every ID was verified live. Photos always render through the `Duotone` component (desaturated + graphite multiply) so no photograph can introduce a second accent.

## Not wired

- The contact form simulates submission; connect `ContactForm.tsx` to your email/CRM endpoint.
- Stats, track record, team and insights are placeholder content in `src/lib/data.ts`.

## Implementation notes

- **Kinetic type observer.** `SplitText` puts the `whileInView` observer on the unclipped heading and propagates variants to the words. Observing each word directly is unreliable: IntersectionObserver clips by `overflow: hidden` ancestors, and a word translated 110% out of its wrapper has zero intersection area, so it never animates.
- **Shimmer button.** `container-type: size` lives on the spark layer (absolutely positioned, so it has a definite size), not on the button; on the button it collapses the button's width.
- **Corner earmarks.** `SectionFrame` insets its labels below the fixed HUD band so section metadata never collides with the wordmark or nav.
- **Spline package.** `@splinetool/react-spline` 3.x/4.x publish ESM-only export maps that Next 14's server resolver rejects; 2.2.6 (CJS + ESM) is pinned.
- **Verification.** Every route was built (`next build`, 26 static pages) and screenshotted at 1440×900 and 400×860 with Playwright over Edge, including scrolled sections, before hand-off.
