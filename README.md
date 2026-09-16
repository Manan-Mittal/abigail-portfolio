# Abigail Alvarez — portfolio

**Live:** https://manan-mittal.github.io/abigail-portfolio/

A portfolio site for an urban planner, built as a subway ride. A pixel-art
NYC elevated line scrolls past in the background; each car on the train is
one role, painted with a real MTA route bullet.

## The idea

Abigail plans transit and public space, so the site is a transit map.

- **Each car is a role.** Scroll and the train slides so the car you're
  reading about is the one in frame.
- **The route bullets mean something.** The **E** terminates at World Trade
  Center, where she works. The **7** is the elevated line. The **L** runs
  under 14th Street, where she led an accessibility walking tour.
- **The strip map on the right** is the navigation *and* the progress
  indicator, the same way the one above the doors is.
- **The sky moves from morning to golden hour** as you scroll, and the
  windows light up in the second half of the ride.

## Running it

```bash
npm install --legacy-peer-deps && npm run dev
```

Then open http://localhost:3000.

> `--legacy-peer-deps` is not needed for the current dependency set, but is
> kept in the docs because npm resolves this tree strictly on some versions.

Other scripts: `npm run build`, `npm run lint`.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The site is a
static export (`output: "export"`), so there is no server to run.

Two details that Pages needs and that are easy to get wrong:

- **`basePath`.** A project site is served from `/<repo>`, not `/`, so assets
  need that prefix or every stylesheet 404s. The workflow passes it as
  `NEXT_PUBLIC_BASE_PATH`; it is not hardcoded, so `npm run dev` still runs at
  the root, and moving to a custom domain is just dropping the env var.
- **`public/.nojekyll`.** Pages runs Jekyll by default, and Jekyll ignores
  directories beginning with an underscore — which would silently discard
  Next's entire `_next` asset tree.

Fonts are self-hosted by `next/font`, so the deployed page makes no
third-party requests at runtime.

## Editing the content

Everything readable on the page lives in one file:

**[`src/data/portfolio.ts`](src/data/portfolio.ts)**

Add or remove an entry in `experiences` and the train grows or shrinks a car
to match — the scene, the strip map and the section anchors all follow. Change
a `route` and that car repaints in the correct MTA colour automatically.

## How it's built

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4, design tokens in `globals.css` |
| Type | [Geist](https://vercel.com/font) — Vercel's open-source family |
| Scene | Hand-drawn pixel art on a 2D canvas, no art assets or WebGL |

### The pixel scene

`src/components/pixel/` renders at a low internal resolution — the viewport
divided by an integer scale, so the canvas always matches the page's aspect
exactly — and is upscaled with `image-rendering: pixelated`. Drawing at the
real pixel grid is what keeps the art crisp; scaling art down never is.

Static parallax layers (sky, skyline, brownstones, street) are drawn once
into offscreen tiles and blitted, so a steady-state frame costs a handful of
`drawImage` calls rather than thousands of rectangles. Layers are rebuilt only
when their bucket changes — the sky when the light shifts, the buildings when
the windows come on.

### Things that were deliberate

**The copy is real HTML.** The canvas is a fixed background; every word is
server-rendered and statically prerendered. The site is keyboard navigable,
screen-readable, Ctrl-F-able and indexable. A portfolio a recruiter's search
can't see is a failed portfolio, however good the art is.

**State is event-driven, animation is rAF-driven.** `requestAnimationFrame`
does not fire in a hidden tab, so anything that depends on it for correctness
silently freezes and shows a stale state when the reader returns. The current
stop is measured from scroll and resize events; rAF only animates.

**The current section is "which one contains the viewport midpoint."** Not
"nearest centre", which produces near-ties between adjacent full-height
sections, and not an `IntersectionObserver`, whose callback only carries the
entries whose intersection *changed* — so picking a winner from that partial
list is wrong whenever the winner isn't moving.

**Dark mode is a night ride.** The scene is always lit, so rather than fight
white text on a bright sky, dark mode tints the whole scene down and the copy
sits on a scrim that guarantees contrast either way.

**Reduced motion is respected.** `prefers-reduced-motion` stops the train's
bob and the marquee, and the scene still renders.

## Credit

Route bullet colours follow the MTA Standards Manual. Bullets are © MTA and
used affectionately.
