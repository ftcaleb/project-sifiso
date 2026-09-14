# Phase 0 — Investigation: Sifiso Holdings / MERIDIAN™

**Date:** 2026-09-15
**Method:** Each site was fetched live (rendered-page extraction plus raw HTML/CSS download and grep for hex values, `font-family`, `@font-face`, `cubic-bezier`, and `transition` values). Where a site's marketing page blocked or hid content (Arup returned 403 to the page-fetcher; Palantir's Next.js shell exposed almost nothing to the extractor), the production stylesheet was downloaded directly and analysed, and independent design-system teardowns were used as a cross-check. Component patterns for 21st.dev were pulled from the source registries of the libraries 21st hosts (Magic UI, Aceternity UI) because 21st's category pages are listings only.

Colour counts below are **counts of distinct chromatic hues on the primary marketing surface**, not counts of every hex in the CSS (every large site ships a data-viz or product-line palette that never appears on the homepage).

---

## 1. bentley.com

**Fetched:** `https://www.bentley.com/` (415 KB HTML) and `/dist/css/styles.css` (737 KB).

### Colour
| Role | Value | Where used |
|---|---|---|
| Near-black surfaces | `#1b1c1e` (gray-950), `#25262a` (gray-900), `#36393f` (gray-800), `#474c53` | Dark hero overlay, footer, dark bento cards |
| Light surfaces | `#fbfcfd` (gray-5), `#f7f8f9`, `#edeeef`, `#f0f0f0` | Page background, card fills |
| Text neutrals | `#ced1d5` (gray-50), `#b8bdc1` (gray-100) | Secondary text on dark |
| **Accent (1)** | `--aurora-*` scale, resolved to the blue ramp `#0570dd` (blue-500), `#045db8` (600), `#034a93` (700) | `--color-bg-accent-base`, `--color-border-accent-base`, `--color-text-accent-base` — primary button, accent border, accent text/links only |
| Withheld | Pinks/peach tints (`#f3d7c8`, `#f9d4db` …) exist in CSS as product-line tints | **Never on the homepage**; they belong to product family pages |

**Accent count on homepage: 1** (the "aurora" blue). It appears on the primary CTA and on link/active states. It does not fill sections. Everything else is a 12-step grey ramp.

### Typography
- `--font-family-sans: "Inter Web"` (Inter Variable, self-hosted `InterVariable.woff2`).
- `--font-family-mono: "JetBrains Mono"` (Regular/Medium/SemiBold) — used for labels, eyebrow text and numeric/data readouts.
- Scale: h1 **56px** desktop / 36px mobile (`--type-h1-lg-font-size`), h2 56px, h3 44px / 28px mobile. Weight 400–500 on display, not 700.
- Headline: "Behind the world's infrastructure."

### Hero pattern
- `video-hero` → `video-hero__frame` → `video-hero__media`: **full-bleed looping video** of infrastructure (highway interchange), dark gradient overlay, centered oversized headline, one primary CTA ("Explore products"), a supporting line, then a logo strip (Burns, Pennoni, Port Authority, DPR, Stantec).

### Navigation
- Top-level: **Products · Industry solutions · Support · Company · Sign in** (+ cart).
- Mega-menu with 54 `secondary-menu-label` entries and 28 `mega-menu-icon-card`s; each entry = title + one-line description + chevron/arrow swap on hover.
- Focus ring uses `--color-focus-ring`; arrows animate via `--accent:hover`.

### Motion observed
- Panel expand: `transition: max-block-size .36s cubic-bezier(.22,1,.36,1)` (expo-ish out).
- Fade/lift reveals: `transition: opacity .48s ease-out, transform .48s ease-out`.
- Micro: `color .15s`/`.2s ease-out`, `opacity .2s`.
- Standard material easing `cubic-bezier(.4,0,.2,1)` for menus.
- No springs, no bounce anywhere.

### Technique to adapt for Sifiso
Bentley pairs a humanist sans with a **monospace for every data label and eyebrow**. The mono is what makes the page read as "engineering software" rather than "corporate". Sifiso should give its HUD labels, tickers and coordinates a tabular, technical voice (see cross-check §9 — Space Grotesk with `tnum` rather than adding a third family).

---

## 2. palantir.com

**Fetched:** `https://www.palantir.com/` (466 KB HTML), three `/_next/static/css/*.css` bundles (66 KB), plus Fictive Kin case study (`fictivekin.com/work/palantir`) and the Fudge design teardown (`design.withfudge.com/share/palantir.com-design`).

### Colour
| Token | Value | Where used |
|---|---|---|
| ink-deep | `#0D0E10` | Hero and 404 surfaces |
| ink | `#1E1F2B` | Dark sections, primary text on white, filled button |
| ink-muted | `#1E2124` (`--body-color`) | Layered dark elements |
| surface | `#EFEFEF` | All text on dark |
| light panels | `#F4F7F6`, `#F3F3F3`, `#F9F9F9` | White functional panels |
| border | `#636363` / `#767676` | 1px hairlines, input underlines, outlined buttons |
| body-light | `#494a4b` / `#2f3234` | Secondary text |
| **Accent (1 per page)** | `body.lightBlueTheme → #4e8af7`, `body.darkMintTheme → #2b5945`/`#a6f2cc`, `body.darkSalmonTheme → #f2c4bf`, `body.lightGoldTheme → #8c7847` | `--accent-color` plus `--accent05-color`/`--accent10-color` (5%/10% tints) |
| Withheld | Blueprint data-viz palette (`#d1980b`, `#d13913`, `#29a634`, `#147eb3`, `#634dbf` …) ships in the CSS | Never on marketing surfaces; only inside product screenshots |

**Key finding:** Palantir's live site does not have one global accent — it has **exactly one accent per page theme**, exposed as a single `--accent-color` variable, and that accent is only ever used at full strength for hairlines/active states and at 5–10% opacity for surface tints. Two accents never coexist in a viewport. This is the strongest external confirmation of the brief's "never shares a section with any other colour" rule.

### HUD / quadrant navigation
- The **quadrant HUD** is the Fictive Kin concept for the Palantir redesign: "a Heads-Up-Display is the transparent layer of information presented on top of a viewport that doesn't require users to look away … reimagining site architecture using quadrants of the screen rather than a typical nav." Reported results: +123% time-on-page, +1000% qualified leads.
- On the **current** production site the HUD survives as: a fixed header (`position:fixed; top:0; width:100%`), 40px padding, wordmark left / utilities right; a fixed **right-edge overlay layer** (`position:fixed; right:0; top:0; z-index:900`, `transition: background-color .25s ease-in-out`) that slides panels in from the right; uppercase 10px tracked "earmark" labels (`--details-earmark-family`, `--details-captions-size: 0.5555rem`) pinned to corners of sections. Corners carry metadata; the centre carries the message.

### Typography — hierarchy through type alone
- Families: **Alliance No.2** (display, labels) and **Alliance No.1** (body), self-hosted, weight 400 only on marketing pages (Bold exists but is not used for display).
- Scale (from CSS vars): `--headline-200-size: 4rem`, `--headline-100-size: 2.78rem/2.22rem/1.89rem` (responsive), `--body-400-size: 1.89rem`, `--body-200-size: 1rem`, `--body-100-size: 0.889rem`, `--details-captions-size: 0.556rem`.
- Fudge teardown: hero-display **5rem / line-height 0.975 / tracking −0.0425em**; label **0.625rem / tracking 0.05em / uppercase**.
- Zero radius on buttons and inputs; 1px borders; inputs are bottom-border-only.
- Hierarchy is built from: size ratio (80px vs 10px), tracking (tight negative on display, loose positive on labels), case (uppercase micro-labels), and surface inversion (near-black hero / white panel alternation). Weight is never used as the primary hierarchy tool.

### Motion observed (from CSS)
- Easing set: `cubic-bezier(.19,1,.22,1)` (expo-out) for reveals; `cubic-bezier(.215,.61,.355,1)` (cubic-out) for enters; `cubic-bezier(.55,.055,.675,.19)` (cubic-in) for exits; `cubic-bezier(.645,.045,.355,1)` (ease-in-out cubic) for hamburger morph; `.25s ease-in-out` for overlay fade.
- Durations are short: 75ms, 125ms, 150ms, 200ms, 250ms. Nothing decorative loops.
- Contact modal: dark scrim + panel sliding from the right. `prefers-reduced-motion` respected.

### Technique to adapt for Sifiso
Corner-pinned **earmark labels** (uppercase, 10px, +0.05em) on every section, plus a fixed HUD frame whose four corners hold: wordmark (TL), primary nav (TR), scroll/section index (BL), status/CTA (BR). Restyle in graphite/bone with Blueprint only on the active item.

---

## 3. arup.com

**Fetched:** `https://www.arup.com/` (157 KB HTML) and `/dist/main.css` (909 KB). Page-level fetcher was 403'd; analysis is from raw source.

### Colour
| Role | Value | Where used |
|---|---|---|
| Black | `#000000` (25) | Text, footer, buttons |
| White | `#ffffff` (17) | Background |
| Greys | `#f2f2f2` (68), `#e0e0e0` (109), `#757575` (152), `#c1c1c1` | Panels, hairlines, captions |
| **Brand red** | `#e61e28` (85) | Logo, link underlines, small icons; `.brand-theme__red` |
| Secondary blue | `#005aaa` (31) | Links in some insight cards |
| Withheld | `brand-theme__{bright-blue #1e9bd7, orange #e66e23, pink #c83c96, purple #7d4196, slate #50697d, green #4ba046, teal #32a4a0, sage #91967d}` | Only as **thematic tints on Insights cards**, one per card, never on the homepage hero |

**Accent count on homepage: 1 (red), used as a signature not a surface.** The extended palette is a **per-card theme system**, the same "one accent per container" discipline as Palantir.

### Typography
- Display: **Spectral** (serif, `font-family: spectral` ×230) — an editorial serif, not a tech sans.
- Body: **Arial** (×632).
- h1 is `home-page__hero-strapline`; large, light-weight serif over video.

### Hero pattern
- `<video playsinline loop muted preload>` — `video/homepage/sustainable-world-v4.mp4`, full-bleed, no overlay colour, single strapline.

### Navigation
- Standard header with services / markets / insights / careers; Swiper carousels for stories.

### Motion observed
- `transition-timing-function: cubic-bezier(0,0,0.4,1)` (×102) — a soft decel curve used for almost everything; `cubic-bezier(0.4,0,0.6,1)` (×48) for symmetric moves.
- `transform .3s ease-in-out` (×15), `.25s`, `opacity .3s`, hover `border-color .3s ease, border-radius .3s ease`.
- One `pulse 2s` loader. No scroll-driven choreography.

### How restraint reads as authority
Arup's page is black type on white with one red mark. Authority comes from (a) a serif display face that signals institution rather than start-up, (b) generous section padding, (c) photography and video carrying all the colour, (d) the accent behaving like a wax seal — tiny, consistent, never spread.

### Technique to adapt for Sifiso
**Let imagery carry every colour that is not Blueprint.** Duotone/desaturated photography with graphite overlays means the single accent never has to compete with a photo's own palette.

---

## 4. sbp.de (schlaich bergermann partner)

**Fetched:** `https://www.sbp.de/en/` (234 KB HTML, WordPress/Elementor + Smart Slider 3).

### Colour
- Background near-white; text charcoal (`#32373c` appears as the WP dark-grey preset).
- **Effective accent count on the marketing surface: 0.** The hex values in the HTML (`#f78da7`, `#cf2e2e`, `#9b51e0`, `#0693e3`, `#fcb900` …) are the **Gutenberg default block palette** shipped by WordPress and not used in the layout. `#f2690a`/`#ff6900` (orange, 8+3 occurrences) are slider UI presets.
- Colour comes entirely from project photography (bridges, stadiums, roofs) with photographer credits.

### Typography
- **MarkWebPro** self-hosted at weights **200, 300, 400, 500** — no bold on the site at all. Light-weight geometric sans at large sizes.
- Headlines: "Let's celebrate!", "We design outstanding projects", "Our expertise", "Our claim", "work • life • sbp". Uppercase nav.

### Hero pattern
- Full-width **9-slide photography carousel** with short rotating declaratives ("we are consultants", "we are engineers", "we are sbp"). No overlays; contrast is managed by picking the image.

### Navigation
- Company · Expertise · Projects · Products · Offices · Career; EN/DE/FR/CN switcher; multi-level dropdowns.

### Motion observed
- Auto-rotating slider; implicit hover states; no scroll animation.

### How restraint reads as authority
sbp uses **weight** as its only voice: 200–300 weight display type at very large size. It reads like a technical drawing title block. The absence of an accent means the eye goes to the structures themselves.

### Technique to adapt for Sifiso
Use **light-weight display at large size** (Space Grotesk 300/400 at 80–120px), never bold, so the type feels drafted rather than shouted. Reserve 500 for micro-labels only.

---

## 5. esri.com/arcgis

**Fetched:** `https://www.esri.com/en-us/arcgis/about-arcgis/overview` and `/products/arcgis-online/overview` (131 KB HTML; Calcite design system + Avenir Next via fonts.net).

### Colour
- Esri blue **`#0079c1`** (6 occurrences) — CTAs, links, active states; a blue→violet gradient behind the ArcGIS Online hero.
- White/`#f5f5f5` UI, `#151515` text.
- Data-viz colours (`#ff9d00`, `#1cc22a`, `#0888ff`, `#1f71ff` …) appear **only inside map imagery**; the UI chrome stays one-accent.

### Typography
- **Avenir Next** (licensed via fonts.net) with Calcite components; bold section h2s, medium body.

### Hero / live-data pattern
- Every feature block pairs copy with a **full-width live-looking map** (3D Zürich cityscape, Chicago hospital coverage analysis, Vienna aspern Seestadt 3D plan, Montana distribution dashboard, FedEx fleet map). Maps are the hero content; they demonstrate capability in context. `calcite-mode-dark` blocks used for dashboard mockups.

### Motion observed
- Carousels (Previous/Next), `calcite-animate` fade-ins, `split--swap` layout swaps. No scroll-driven data animation.

### Technique to adapt for Sifiso
**The product demo *is* the hero**: simulated dashboard panels (asset register, parcel map, valuation roll) rendered in monochrome with **only the key data-line in Blueprint**. Esri's maps are multi-colour because real GIS symbology is; Sifiso's simulated readouts must stay graphite/bone with one blue vector.

---

## 6. nvidia.com/omniverse

**Fetched:** `https://www.nvidia.com/en-us/omniverse/` (386 KB HTML) plus the NVIDIA design-system teardown (oh-my-design.kr) and NVIDIA brand guidelines search.

### Colour
| Role | Value | Where used |
|---|---|---|
| Black / near-black | `#000000`, `#1a1a1a` | Page and card backgrounds |
| White / light | `#ffffff`, `#f7f7f7` | Text on dark, light sections |
| Greys | `#636363`, `#5e5e5e` | Dividers, 1px borders |
| **Accent (1)** | **`#76b900`** (2 occurrences in the page HTML; `#74b71b` variant) | `2px solid #76b900` primary-button **border**, `1px solid #76b900` secondary border, link **underline** on light backgrounds, active indicators, green text emphasis |

**Confirmed rule:** "Always use `#76b900` as accent, never as a background fill — it's a signal colour for borders, underlines, and highlights." The primary button is **transparent with a green border**, not a green fill. Hover moves to a *different* colour (`#1eaedb`) precisely so the green never becomes a surface.

### Typography
- **NVIDIA Sans** variable (`NVIDIASansVF_NALA_W_Wght.woff2`), fallback Arial. Headings 700, body 400, nav 14px uppercase 700. Line-height 1.25 on headings. 2px radius on everything ("no pills, no rounded consumer aesthetics").
- Hero h1 is white on black; `nv-video-as-bg` — **video-as-background hero** with Omniverse digital-twin footage.

### Motion tokens (from teardown, matches the observed CSS)
- `motion-fast 140ms` hover colour; `motion-standard 240ms` dropdowns/tabs; `motion-slow 380ms` crossfades and hero transitions.
- Easing: standard `cubic-bezier(0.4,0,0.2,1)`, enter `cubic-bezier(0,0,0.2,1)`, exit `cubic-bezier(0.4,0,1,1)`.
- **Forbidden:** spring/overshoot curves ("reads as consumer-toy animation").
- Signature: **green-edge reveal** (content at 240ms, green underline arrives at 380ms); **metric counter** count-up at 380ms linear, first viewport entry only; `prefers-reduced-motion` collapses everything to 0ms.
- Depth by "material difference", not shadows; explicitly **no glassmorphism or blur**.

### Technique to adapt for Sifiso
The **accent arrives last**: reveal the block, then draw the Blueprint underline/border 140ms later. The eye reads the content first and the accent as a confirmation. Also adopt the transparent-with-accent-border primary CTA as the *default*, and a filled Blueprint CTA only once per page.

---

## 7. 21st.dev — animated hero, shimmer button, card categories

**Fetched:** `https://21st.dev/` (198 KB), `/community/components/hero` (284 hero components listed), `/community/components/card` (422 listed), `/community/components/button`, `/llms.txt`. Category pages are listings ("Scroll Morph Hero", "Cinematic landing Hero", "Parallax Scrolling", "Shine Border", "BeUI Tilt Card" …); the actual interaction code lives in the hosted libraries. The following were pulled from those libraries' shadcn registries (`magicui.design/r/*.json`, `ui.aceternity.com/registry/*.json`).

21st.dev's own skin: General Sans, `#09090b` dark, `#8a8f98` grey, indigo `#818cf8` accent — **not** adopted.

### Extracted interaction patterns (timing / easing / trigger)

| Pattern | Mechanism | Values |
|---|---|---|
| **Shimmer button** (Magic UI) | A `conic-gradient(from calc(270deg − spread/2), transparent 0, shimmerColor spread, transparent spread)` spark sits in a container-query box behind the label; `@keyframes shimmer-slide { to { transform: translate(calc(100cqw − 100%), 0) } }` moves it along the perimeter while `@keyframes spin-around` rotates it 0→90°(15–35%)→270°(65–85%)→360°; a backdrop inset by `--cut` (0.05em) masks it to a hairline | `--speed: 3s` linear infinite; button `transition-transform 300ms ease-in-out`; `active: translate-y-px`; inner highlight `shadow inset 0 −8px 10px #ffffff1f` → hover `#ffffff3f` |
| **Magic card / spotlight** (Magic UI) | `useMotionValue` for mouseX/Y; `useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 })`; `useMotionTemplate` radial-gradient at cursor over a gradient border layer | `gradientSize 200px`; opacity 0→1 on enter; springs only for *following*, not for reveal |
| **Card spotlight** (Aceternity) | `onMouseMove` → motion values; overlay `-inset-px opacity-0 transition duration-300 group-hover:opacity-100` with `maskImage: radial-gradient(radius px at x y, white, transparent 80%)` | `radius 350`, 300ms opacity |
| **Border beam** (Magic UI) | `offset-path: rect(0 auto auto 0 round Npx)` on a square gradient element; `mask-intersect` with `[mask-clip: padding-box, border-box]` so only the border ring shows | `duration 6s`, `ease: linear`, `repeat: Infinity`, `borderWidth 1px`, `size 50px` |
| **Text generate / split reveal** (Aceternity) | Split on words, each `opacity 0 → 1`, `filter blur(10px) → blur(0)` via `useAnimate` | `duration 0.5s`, `delay: stagger(0.2)` |
| **Number ticker** (Magic UI) | `useInView(ref, { once: true })` then `motionValue.set(target)`; `useSpring(motionValue, { damping: 60, stiffness: 100 })`; render with `Intl.NumberFormat`, `tabular-nums`, `tracking-wider` | Runs once, on first viewport entry |
| **Hero listings** (21st) | "Scroll Morph", "Parallax Scrolling", "Cinematic landing" — scroll-scrubbed transforms with pinned sections | Pattern: pin + scrub, not autoplay |

### Technique to adapt for Sifiso
Take the **mechanisms**, not the skins: shimmer = a single conic hairline sweep in Blueprint on a graphite button (`--spread` narrowed to ~60° so it reads as a scan-line, not disco); spotlight = a 200px radial **Blueprint at 12% opacity** on the hairline border only; ticker = spring `damping 60 / stiffness 100`, once. Springs are confined to cursor-following; all reveals use the expo-out / cubic-out curves observed at Palantir and Bentley.

---

## 8. spline.design

**Fetched:** `https://spline.design/` (181 KB HTML, Next.js, Brockmann + Spline Sans, `#e3e8ff`/`#5865f2` accents), `/examples`, `community.spline.design/tag/cursor` and `/tag/hero` (both require login to list scenes), `docs.spline.design`, `github.com/splinetool/react-spline`, and the "15 Best Spline Websites" round-up.

### What is achievable for a cursor-reactive 3D hero
- **Events available in the editor:** Mouse Hover, Mouse Down/Up, Mouse Press, Scroll, Key Press, Look At (object faces the cursor/camera/another object), Follow (object trails the cursor with configurable lag), state transitions with easing. These are authored in the Spline editor and baked into the `.splinecode` export.
- **Embedding:** `npm i @splinetool/react-spline @splinetool/runtime`; `<Spline scene="https://prod.spline.design/<id>/scene.splinecode" onLoad={(app)=>…} onSplineMouseHover onSplineMouseDown renderOnDemand />`; Next.js build: `import Spline from '@splinetool/react-spline/next'` (SSR placeholder image); programmatic control `app.findObjectByName('Grid').rotation.y += …`, `app.emitEvent('mouseHover','Cube')`; lazy-load via `React.lazy`/`next/dynamic`. Web component alternative: `@splinetool/viewer@1.9.82` `<spline-viewer>`.
- **Performance reality from shipped sites:** the round-up shows nearly all production heroes are **scroll-driven rather than cursor-driven**, with explicit notes on poly-count budgets, separate low-poly mobile scenes (Sentinel), Blender pre-optimisation (Avora AI), and "optimised for web" vs "HQ" exports (Phunk). Spline's docs have a dedicated "how to optimize your scene" page for "when a scene feels slow".
- **Example scenes on /examples:** 3D Text, Component UI, Cloner variations, Mini House (conditional logic), iPhone/Polaroid mockups, Room scenes — abstract/product-shaped, not city grids; a spatial-grid scene must be authored.

### Technique to adapt for Sifiso
A **city-block/spatial-grid scene with a Look-At camera rig and a Follow-lagged light**, exported at low poly with `renderOnDemand`, loaded lazily *after* the type reveal so the LCP is text. Because scene authoring happens in the Spline GUI (no scene asset exists in this repo), the build ships a Spline mount point driven by `NEXT_PUBLIC_SPLINE_SCENE` and a **procedural WebGL spatial grid** (react-three-fiber) as the default hero that implements the same cursor-parallax / look-at behaviour in code. See flag F-6.

---

## 9. Cross-check against the CONTEXT spec

### 9.1 Colour system — CONFIRMED, with one sharpening
| Spec rule | Evidence | Verdict |
|---|---|---|
| One accent only | Bentley (aurora blue), NVIDIA (`#76b900`), Arup homepage (red), Esri chrome (`#0079c1`) each run exactly one chromatic accent on the marketing surface | **Confirmed** |
| Accent never fills a background | NVIDIA's documented rule; Bentley's accent is CTA/border/text only; Palantir uses its accent at 5–10% opacity for any surface tint | **Confirmed** |
| Never two jobs in one viewport / never shares a section with another colour | Palantir's `body.*Theme` single `--accent-color` per page; Arup's `brand-theme__*` one per card | **Confirmed** — and both sites go further: the accent is *scoped per container*. **Sharpening:** add a 10% Blueprint tint token (`#1D4E89` at 0.10 alpha) for hover-glow only, mirroring Palantir's `--accent10-color`. Not a second colour; a rationed alpha of the one colour. |
| Graphite `#0B0C0E` / Bone `#F4F2ED` / Charcoal `#14161A` / Warm White `#EDEBE4` / Stone `#8A8D93` / Hairline `#2A2D33` | Palantir `#0D0E10`/`#EFEFEF`/`#636363`, Bentley `#1b1c1e`/`#fbfcfd`/`#36393f`, NVIDIA `#1a1a1a`/`#5e5e5e` occupy the same positions | **Confirmed**; the spec's warm bias (bone/warm-white vs. the benchmarks' neutral greys) is a legitimate differentiator — it reads as paper/blueprint stock rather than software UI. |
| Blueprint `#1D4E89` | Sits between Bentley `#034a93`/`#045db8` and Esri `#0079c1`; darker and less saturated than both | **Confirmed suitable**; on `#0B0C0E` it has a ~2.4:1 contrast ratio, so it must never carry small text on dark — use it for lines, borders, fills of buttons with Warm White text (~7.9:1 for `#EDEBE4` on `#1D4E89`), and glows. Text-on-dark in Blueprint is limited to ≥24px display use. |

### 9.2 Typography — CONFIRMED, one improvement flagged
- Every benchmark uses a **single sans or sans + serif pair at light-to-regular weight for display** (Bentley Inter 400–500; Palantir Alliance 400; sbp MarkWebPro 200–500; Arup Spectral). Space Grotesk 300/400/500 + Inter 400/500 matches this discipline. **Confirmed.**
- Observed display scale: 56–80px desktop (Bentley 56, Palantir 80), line-height ≈0.95–1.0, tracking −0.02 to −0.04em; labels 10px uppercase +0.05em. Adopt: display clamp 3.25rem→7.5rem, lh 0.95, tracking −0.03em; labels 0.625–0.6875rem, +0.08em.
- **Flag F-1 (improvement, not override):** Bentley pairs its sans with **JetBrains Mono for every data label and readout**, and it is the single most "engineering" cue on the page. The spec lists only Space Grotesk + Inter. Space Grotesk ships tabular figures (`font-feature-settings: "tnum"`), so tickers and HUD labels will use **Space Grotesk 500 with `tnum`, uppercase, +0.12em** to get the same monospaced-readout effect **without adding a third family**. If the client later wants a true mono, JetBrains Mono is the drop-in.

### 9.3 Component / motion patterns — CONFIRMED, two conflicts flagged
- **Flag F-2 (conflict, resolved in favour of the spec):** NVIDIA's system explicitly forbids **glassmorphism and blur**; Bentley and Palantir also use flat, planar surfaces. The spec requires glassmorphic service cards. Resolution: keep glass, but at the *engineering* end of the range — `backdrop-blur 12–16px`, fill `rgba(244,242,237,0.03–0.05)`, one 1px Hairline border, no inner gradients — so the card reads as etched glass over a drawing, not as an iOS widget. Glow on hover is the 10% Blueprint tint plus a `0 0 0 1px #1D4E89` ring, never a coloured drop-shadow blob.
- **Flag F-3 (conflict, resolved as a rule):** 21st.dev/Magic UI components lean on **springs** (stiffness 250 / damping 30). NVIDIA forbids overshoot; Palantir and Bentley use only cubic/expo-out curves. Rule adopted: **springs only for cursor-following** (magnetic buttons, spotlight, custom cursor, 3D parallax); **all reveals and scroll choreography use expo-out `cubic-bezier(0.19,1,0.22,1)` or cubic-out `cubic-bezier(0.215,0.61,0.355,1)`** with durations in the 140 / 240 / 380 / 600 / 900ms bands.
- **Kinetic type:** Aceternity's word-split with blur-in is the closest shipped pattern (0.5s, stagger 0.2). For 80px display type, per-word stagger at 0.2s is too slow; adopt per-word clip-reveal (`translateY(110%) → 0`, 900ms expo-out) with per-word stagger 0.04s and no blur (blur on large text costs paint). **Confirmed with tuning.**
- **Stat ticker:** Magic UI number-ticker spring (damping 60 / stiffness 100, `once: true`) — matches NVIDIA's "metric counter, first viewport entry only". **Confirmed**; Sifiso adds a scroll-scrubbed variant on the MERIDIAN™ page as specified.
- **HUD nav:** the quadrant concept is a documented Palantir design principle (Fictive Kin) rather than a literal element on today's site; today's site retains fixed corners + right-edge overlay panel. Sifiso implements the *concept* literally (four fixed corners + full-screen quadrant index) — this is a faithful reinterpretation, not a copy. **Confirmed.**
- **Hero:** Bentley, Arup and NVIDIA all use **full-bleed muted video**; Esri uses live maps; none use a static stock photo. The spec's Spline/3D hero leapfrogs video. **Confirmed direction.**
- **SVG path draw:** no benchmark does scroll-driven `stroke-dashoffset` drawing. This is genuine differentiation and stays.

### 9.4 Imagery — CONFIRMED with a constraint
Arup and sbp let photography carry all colour. To protect the single-accent rule, **every photo is desaturated (~70%) with a graphite multiply overlay**, and no photo may contain a dominant blue that reads as a second accent next to Blueprint (e.g., avoid "blue-light server room" images *inside* the same viewport as a Blueprint CTA; use them only in sections with no Blueprint element).

### 9.5 Flags summary
| ID | Type | Finding | Action |
|---|---|---|---|
| F-1 | Improvement | Benchmarks use a mono for data labels; spec has two families | Space Grotesk `tnum` uppercase for labels/tickers; no third family |
| F-2 | Conflict | NVIDIA/Palantir/Bentley avoid glass & blur; spec requires glass cards | Keep spec; restrained "etched glass" parameters |
| F-3 | Conflict | 21st.dev springs vs. benchmark no-overshoot | Springs only for cursor-following; expo/cubic-out for reveals |
| F-4 | Sharpening | Palantir/Arup scope the accent per container | Add a 10% alpha Blueprint token for hover glow only |
| F-5 | Constraint | Blueprint on graphite is ~2.4:1 contrast | Blueprint never carries body text on dark; lines/borders/CTA-fill only |
| F-6 | Constraint | No Spline scene asset exists; scenes are authored in the Spline GUI; production Spline sites ship low-poly scroll-driven scenes | Ship `<SplineHero>` mount reading `NEXT_PUBLIC_SPLINE_SCENE`, with a procedural react-three-fiber spatial grid as the default cursor-reactive hero; both share the same parallax/look-at behaviour |
| F-7 | Confirmation | Video heroes everywhere, zero static stock heroes at the benchmark tier | 3D/data hero is the right leapfrog; stock photography only in body sections |

### 9.6 Sources
- bentley.com — homepage + `/dist/css/styles.css`
- palantir.com — homepage + `/_next/static/css/{0bb5a1be7a9ac24e,567b6efa152398f0,1ed43d94fcc44917}.css`; fictivekin.com/work/palantir; design.withfudge.com/share/palantir.com-design
- arup.com — homepage + `/dist/main.css`
- sbp.de/en — homepage (Elementor / Smart Slider 3 / MarkWebPro)
- esri.com — `/en-us/arcgis/about-arcgis/overview`, `/en-us/arcgis/products/arcgis-online/overview`
- nvidia.com — `/en-us/omniverse/`; oh-my-design.kr/design-systems/nvidia; NVIDIA Trademark & Logo Usage Guidelines
- 21st.dev — `/`, `/community/components/{hero,card,button}`, `/llms.txt`; magicui.design/r/{shimmer-button,magic-card,number-ticker,border-beam,animated-shiny-text}.json; ui.aceternity.com/registry/{card-spotlight,text-generate-effect}.json
- spline.design — `/`, `/examples`; community.spline.design/tag/{cursor,hero}; docs.spline.design; github.com/splinetool/react-spline; jackredley.design "15 Best Spline Websites"
- gsap.com/docs/v3/Plugins/ScrollTrigger; github.com/darkroomengineering/lenis (ScrollTrigger + Lenis integration: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`)
