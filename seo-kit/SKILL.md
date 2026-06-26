---
name: seo-kit
description: Make a website discoverable and shareable — adds the SEO essentials in one pass. Drops in <head> meta (description, keywords, robots, theme-color, canonical), Open Graph + Twitter card tags for rich link previews, JSON-LD structured data (Person and/or WebSite) for Google rich results, and generates sitemap.xml + robots.txt. Use when the user wants to improve SEO, fix missing/blank social link previews (LinkedIn/Twitter/Slack), add structured data, or prepare a site for indexing before/after deploy. Works for static sites and SPAs (Vite/Next/CRA).
---

# SEO Kit

Adds the high-impact SEO pieces to a site in one pass. Most of these are cheap to
add and disproportionately valuable: rich link previews, Google entity data, and
proper crawl/index directives.

## What it adds

1. **`<head>` meta** — `description`, `keywords`, `robots`/`googlebot`, `author`,
   `theme-color`, and `canonical`.
2. **Open Graph + Twitter Card** — title/description/image so links unfurl nicely on
   LinkedIn, Twitter/X, Slack, iMessage, Discord.
3. **JSON-LD structured data** — `Person` (for a portfolio/personal site) and/or
   `WebSite`, so Google can build a proper entity.
4. **`sitemap.xml`** + **`robots.txt`** — for crawling/indexing (plus a small
   generator script for SPAs with many routes).

## How to apply it

1. **Copy `references/head.html`** content into the site's `<head>`
   (e.g. `index.html` for Vite/CRA, or `app/layout` `<head>` / `next/head` / the
   Metadata API for Next.js — adapt the tags to the framework's conventions).

2. **Fill the placeholders** (only required edit):
   - `{{DOMAIN}}` → the canonical origin, e.g. `https://example.com` (no trailing slash)
   - `{{TITLE}}` → page/site title (≤ ~60 chars)
   - `{{DESCRIPTION}}` → 1–2 sentence summary (≤ ~155 chars)
   - `{{KEYWORDS}}` → comma-separated, optional
   - `{{OG_IMAGE}}` → an **absolute** URL to a 1200×630 image (see note below)
   - `{{NAME}}`, `{{JOB_TITLE}}`, `{{SAME_AS}}` (social profile URLs) for the JSON-LD

3. **Add `references/robots.txt`** at the web root (`public/robots.txt` for Vite/Next),
   replacing `{{DOMAIN}}`.

4. **Add a sitemap**: either drop in `references/sitemap.xml` (small static sites) or
   run `references/generate-sitemap.mjs` for SPAs — pass your domain and routes and it
   writes `public/sitemap.xml`. Example:
   ```bash
   node generate-sitemap.mjs https://example.com / /about /projects/foo > public/sitemap.xml
   ```

5. **Verify** (see below).

## Critical notes (tell the user)

- **OG/Twitter images and `og:url` MUST be absolute URLs** (`https://domain/...`),
  not relative paths — crawlers won't resolve relative ones, so previews render blank.
  Set these only once the real domain is known.
- **One canonical origin.** Pick `https://domain.com` (or the `www.` variant) and use it
  consistently in `canonical`, `og:url`, sitemap, and robots to avoid duplicate-content splits.
- **OG image spec:** 1200×630 px, < 5 MB, PNG/JPG. A square avatar works for
  `twitter:card=summary`; use `summary_large_image` only with a true 1200×630 image.
- **SPA caveat:** crawlers run JS now, but per-route meta needs SSR/prerender for best
  results. The static `<head>` tags here cover the home page; for per-route OG on a pure
  SPA, consider prerendering or a meta-injection step.

## Verifying

- **Rich results / JSON-LD:** https://search.google.com/test/rich-results
- **Link preview:** https://www.opengraph.xyz (or paste the URL in Slack/LinkedIn)
- **Sitemap/robots:** load `/{robots.txt,sitemap.xml}` → 200; submit the sitemap in
  Google Search Console.
- Confirm `<title>`, `meta[name=description]`, and `link[rel=canonical]` are present in
  the served HTML (View Source, not just devtools).
