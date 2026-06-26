#!/usr/bin/env node
/**
 * Generate a sitemap.xml for a static site / SPA.
 *
 * Usage:
 *   node generate-sitemap.mjs <domain> <route...> > public/sitemap.xml
 *
 * Example:
 *   node generate-sitemap.mjs https://example.com / /about /projects/foo > public/sitemap.xml
 *
 * The home route ("/") gets priority 1.0; everything else 0.7. `lastmod` is today.
 */

const [, , domainArg, ...routes] = process.argv;

if (!domainArg || routes.length === 0) {
  console.error("Usage: node generate-sitemap.mjs <domain> <route...>");
  process.exit(1);
}

const domain = domainArg.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const urls = routes
  .map((r) => {
    const path = r.startsWith("/") ? r : `/${r}`;
    const loc = path === "/" ? `${domain}/` : `${domain}${path}`;
    const priority = path === "/" ? "1.0" : "0.7";
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

process.stdout.write(
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
);
