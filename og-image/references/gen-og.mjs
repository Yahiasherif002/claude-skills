// Generate public/og-image.png (1200x630) — the social share card.
// Run: node scripts/gen-og.mjs   (requires: npm i -D sharp)
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

// ---- EDIT ME ----------------------------------------------------------------
const CONFIG = {
  out: "../public/og-image.png",          // output path (relative to this file)
  kicker: "// software engineer",          // small green code-comment line
  name: "Your Name",                       // big gradient headline
  role: "Your Role / Title",               // bold mono line
  subline: "Tagline · Tech · One · Two · Three",
  footerLeft: "github.com/you",
  footerRight: "·  yourdomain.com",
  tab: "hero.tsx",                         // fake editor tab label
  accent: "#007acc",                       // left bar + brand color
};
// -----------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(__dirname, CONFIG.out);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1e1e"/><stop offset="100%" stop-color="#16161a"/>
    </linearGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#9fd2ff"/><stop offset="100%" stop-color="#4ea1ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g stroke="#2a2a30" stroke-width="1">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="630"/>`).join("")}
    ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1200" y2="${i * 50}"/>`).join("")}
  </g>
  <rect x="0" y="0" width="10" height="630" fill="${CONFIG.accent}"/>
  <g>
    <circle cx="90" cy="90" r="9" fill="#ff5f56"/><circle cx="120" cy="90" r="9" fill="#ffbd2e"/><circle cx="150" cy="90" r="9" fill="#27c93f"/>
    <text x="185" y="96" font-family="Consolas, monospace" font-size="22" fill="#9aa0a6">${CONFIG.tab}</text>
  </g>
  <text x="90" y="210" font-family="Consolas, monospace" font-size="30" fill="#6a9955">${CONFIG.kicker}</text>
  <text x="86" y="320" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="104" fill="url(#name)">${CONFIG.name}</text>
  <text x="90" y="392" font-family="Consolas, monospace" font-weight="700" font-size="46" fill="#e6e6e6">${CONFIG.role}</text>
  <text x="90" y="452" font-family="Consolas, monospace" font-size="28" fill="#9cdcfe">${CONFIG.subline}</text>
  <g font-family="Consolas, monospace" font-size="24" fill="#8b949e">
    <text x="90" y="560">${CONFIG.footerLeft}</text><text x="640" y="560">${CONFIG.footerRight}</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("✓ wrote", out);
