# seo-kit

A Claude Code skill that adds the **high-impact SEO essentials** to a website in one pass.

## What it adds

- 🏷️ **`<head>` meta** — description, keywords, robots, author, theme-color, canonical
- 🔗 **Open Graph + Twitter cards** — rich link previews on LinkedIn / X / Slack / Discord / iMessage
- 🧠 **JSON-LD structured data** — `Person` + `WebSite` for Google rich results / entity
- 🗺️ **`sitemap.xml` + `robots.txt`** — plus a generator script for SPAs with many routes

## Files

```
seo-kit/
├── SKILL.md                          # instructions Claude follows
└── references/
    ├── head.html                     # meta + OG/Twitter + JSON-LD (placeholders)
    ├── robots.txt                    # robots template
    ├── sitemap.xml                   # static sitemap template
    └── generate-sitemap.mjs          # node script: domain + routes -> sitemap.xml
```

## Usage

Ask Claude Code: *"Use the seo-kit skill to add SEO to my site."*
Fill the `{{DOMAIN}}` / `{{NAME}}` / `{{OG_IMAGE}}` placeholders, then verify with
[Rich Results Test](https://search.google.com/test/rich-results) and
[opengraph.xyz](https://www.opengraph.xyz).

> ⚠️ OG/Twitter images and `og:url` must be **absolute** URLs (`https://domain/...`) or
> link previews render blank — set them once the real domain is known.

See [`SKILL.md`](./SKILL.md) for the full guide.
