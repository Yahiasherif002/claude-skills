---
name: og-image
description: Generate a branded 1200x630 Open Graph / social share image (PNG) from an SVG template using sharp — no design tool needed. Produces the card that shows when a link is shared on LinkedIn, X/Twitter, Slack, Discord, iMessage. Use when a site has a blank/missing/ugly link preview, needs a proper og:image, or the user wants a generated social card matching their brand. Pairs with the seo-kit skill (which wires the og:image/twitter:image meta tags).
---

# OG Image Generator

Generates a proper **1200×630 PNG** social-share card from an SVG template, rasterized with
[`sharp`](https://sharp.pixelplumbing.com/). No Figma/Photoshop needed, fully reproducible,
and regenerable whenever the text changes.

## Why

Social crawlers need a **real raster image at an absolute URL** for rich previews. A relative
path or a square favicon gives blank/tiny previews. This builds a real branded 1200×630 card.

## What it produces

- **`scripts/gen-og.mjs`** — edits the config at the top (name, role, subline, footer), runs
  `node scripts/gen-og.mjs`, and writes `public/og-image.png` (1200×630).
- A dark "IDE/terminal" themed card by default (window dots, gradient name, mono subtext) —
  restyle the SVG freely.

## How to use it

1. Copy `references/gen-og.mjs` into the project's `scripts/`.
2. `npm i -D sharp`.
3. Edit the `CONFIG` constants at the top (name, role, subline, footer text, colors).
4. Run `node scripts/gen-og.mjs` → writes `public/og-image.png`. Add an npm script
   `"gen:og": "node scripts/gen-og.mjs"` for convenience.
5. Wire the meta tags (or use the **seo-kit** skill) with an **absolute** URL:
   ```html
   <meta property="og:image" content="https://DOMAIN/og-image.png" />
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:image" content="https://DOMAIN/og-image.png" />
   ```

## Notes

- **Fonts:** SVG text renders with fonts installed on the build machine. The template uses
  `Consolas, monospace` and `Segoe UI, Arial, sans-serif` (safe on Windows/most CI). For a
  custom font, install it on the build env or embed it as base64 in the SVG.
- **Absolute URL is mandatory** for OG/Twitter images, and LinkedIn caches hard — re-scrape via
  the [Post Inspector](https://www.linkedin.com/post-inspector/) after deploying.
- Verify the card at https://www.opengraph.xyz.
