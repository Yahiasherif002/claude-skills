---
name: deploy-doctor
description: Diagnose and fix common web-app deployment failures — especially full-stack JS apps (Vite SPA + Express/Node + serverless). Covers "the site shows raw JavaScript source", FUNCTION_INVOCATION_FAILED on Vercel, Render/Railway port-binding failures, env vars that don't take effect, missing build dependencies, blank social link previews, and SPA routing 404s. Use when a deploy "succeeds" but the site is broken, an API/function 500s in prod but works locally, or the user asks why their deployed app misbehaves.
---

# Deploy Doctor

A diagnostic playbook for the deployment failures that look mysterious but have well-known causes.
Match the **symptom**, apply the **fix**.

## 🔴 Site serves raw JavaScript / shows the bundled server source
**Cause:** an Express/Node app with `server.listen()` was deployed to a **serverless/static** host
(Vercel/Netlify). They don't run a persistent server — they served your built `dist/index.js` as a
static file.
**Fix — pick one:**
- **Node host (simplest):** deploy to Render/Railway/Fly/DO App Platform. Build `npm run build`,
  start `npm start`. The Express server serves the SPA + API in one process.
- **Stay serverless:** serve the SPA statically (`outputDirectory: dist/public`) and move API
  routes into serverless functions (`/api/*`). Don't ship the long-running server.

## 🔴 `FUNCTION_INVOCATION_FAILED` (Vercel) / function 500s on *every* request (even GET)
**Cause:** the function **crashes on load** — most often an **extensionless relative import**
(`import x from "./util"`) under Vercel's per-file ESM compilation → `ERR_MODULE_NOT_FOUND`.
**Fix:** make the function **self-contained (zero imports)**, or use explicit `.js` extensions on
relative imports. Also wrap the handler in `try/catch` so real errors return JSON instead of a
platform crash. Test: `GET` should return your `405`, not a platform 500.

## 🔴 Render/Railway: "deploy live" but unreachable / "no open ports"
**Cause:** the app doesn't bind the platform's `$PORT`, or hunts for a "free" port.
**Fix:** in production bind **exactly** `process.env.PORT` on host `0.0.0.0`:
```ts
const port = Number(process.env.PORT) || 3000;
server.listen(port, "0.0.0.0");
```
Don't run a "find an available port" loop in prod.

## 🔴 Build fails: "vite: not found" / "esbuild not found"
**Cause:** the host sets `NODE_ENV=production`, so `npm/pnpm install` skips **devDependencies**
(where vite/esbuild/tsx live).
**Fix:** force dev deps for the build: `pnpm install --prod=false` (or `npm ci --include=dev`).

## 🔴 Env vars / API keys "set" but the app acts like they're missing
**Causes & fixes:**
- Env vars only apply at **build/start of a NEW deploy** — after adding them, **redeploy**.
- Your **`.env` is gitignored and NOT deployed** — set the vars in the host's dashboard, not just locally.
- **Client vs server:** only `VITE_`/`NEXT_PUBLIC_`-prefixed vars reach the browser; secrets must
  stay server-side (functions / server env).
- **Name mismatch** — confirm the exact key names.

## 🔴 Blank/ugly social link previews (LinkedIn/Twitter/Slack)
**Cause:** `og:image` / `og:url` are **relative paths**; crawlers need absolute URLs.
**Fix:** use `https://domain/og-image.png` (absolute), a 1200×630 image, `summary_large_image`.
LinkedIn caches — re-scrape via the Post Inspector. (See the `seo-kit` / `og-image` skills.)

## 🔴 SPA routes 404 on refresh / direct link (e.g. /projects/foo)
**Cause:** no SPA fallback — the host looks for a real file at that path.
**Fix:** rewrite all non-asset, non-API paths to `/index.html`. Vercel:
```json
{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
```
(Static assets are served by the filesystem first; the `(?!api/)` keeps serverless functions working.)

## 🔴 Stray horizontal scrollbar / layout drifts below the fold
- `overflow-y: auto` silently promotes the **other axis to `auto`** too → add `overflow-x: hidden`.
- A fixed full-height shell should be `h-screen` + `overflow-hidden`, not `min-h-screen`
  (which can grow past the viewport and leave gaps).

## General checklist
1. Does it build locally? `npm run build && npm start`.
2. Right host for the architecture? (persistent server → Node host; static+functions → serverless)
3. Env vars set **in the host**, and **redeployed** after?
4. Functions: self-contained, wrapped in try/catch, bind `$PORT` (servers)?
5. SPA fallback + absolute OG URLs configured?
