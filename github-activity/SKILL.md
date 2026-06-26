---
name: github-activity
description: Add a live, self-built GitHub stats section to a site — headline stat cards (repos, total stars, followers, following), a "most used languages" bar computed by repo count with real GitHub language colors, and a top-repositories list. Pulls real data from GitHub's public REST API (no token), with loading skeletons, a session cache, and a graceful fallback if rate-limited. Use when the user wants to show GitHub stats/activity and is tired of the flaky third-party badge/image services (github-readme-stats, streak-stats) that rate-limit and look washed-out.
---

# GitHub Activity (self-built, reliable)

A custom GitHub section that fetches **real data from the public GitHub REST API** and renders
it as themed, animated cards — instead of embedding the third-party `github-readme-stats` /
`streak-stats` images that constantly rate-limit ("Something went wrong! Could not fetch…") and
don't match your theme.

## What it produces

- **`GitHubActivity.tsx`** (`<GitHubActivity username="..." />`):
  - **Headline stats** (count-up animated): public repos, **total stars** (summed across non-fork
    repos), followers, following
  - **Most used languages** — a segmented bar + legend with **official GitHub language colors**,
    computed by **repo count** (not byte count, so it won't over-report HTML/CSS the way
    github-readme-stats does)
  - **Top repositories** — most-starred non-fork repos with language dot, ⭐ stars, forks
  - **Loading skeletons**, a **sessionStorage cache** (one fetch per visit), and an error
    fallback link if GitHub's unauthenticated limit (60 req/hr/IP) is hit

## How to use it

1. Copy `references/GitHubActivity.tsx` into the components folder.
2. Render `<GitHubActivity username="your-github-username" />`.
3. Deps: `framer-motion` (reveal) and `lucide-react` (icons). Remove them by deleting the
   `motion.*` wrappers and swapping icons for emoji/SVG if you want zero deps.
4. Styling uses CSS-variable tokens (`--border`, `--card`, `--primary`, `--muted-foreground`,
   `--foreground`) so it adapts to light/dark. Map them to your theme.

## Notes / honesty

- It uses **unauthenticated** GitHub API calls — fine for a portfolio (cached per session). For
  heavy traffic or to add the **contributions/streak heatmap** (which needs the GraphQL API),
  proxy a GitHub token through a tiny serverless function so the token stays server-side.
- Numbers are **real** — stars/followers reflect the actual account, so it's honest, not inflated.
- The language breakdown is by repo count, which is more representative of what someone *builds in*
  than github-readme-stats' byte-count (which inflates generated HTML/CSS).
