# claude-skills

A personal collection of [Claude Code](https://claude.com/claude-code) **skills** —
reusable, self-contained capabilities Claude can invoke to scaffold things I build often.

## Skills

| Skill | What it does |
|---|---|
| [`ask-terminal`](./ask-terminal/) | An "Ask Me" AI chat terminal — terminal-styled React component with streaming markdown replies, a Claude-style thinking indicator, right-click paste, and a hardened serverless LLM backend. |
| [`llm-endpoint`](./llm-endpoint/) | The reusable *backend* on its own — a self-contained, prompt-injection-filtered, rate-limited serverless function proxying any OpenAI-compatible LLM. Safe to expose publicly. |
| [`command-palette`](./command-palette/) | A VS Code / Raycast-style ⌘K command palette (cmdk): fuzzy nav, actions, links. Config-driven, drops into any React app. |
| [`github-activity`](./github-activity/) | A live, self-built GitHub stats section (repos, stars, languages, top repos) from the public API — reliable + themed, replacing flaky third-party badge images. |
| [`scroll-reveal-kit`](./scroll-reveal-kit/) | Reliable scroll animations: a typed-label + animated-underline section heading, a count-up number, and the correct framer-motion reveal patterns (with the invisible-content gotcha fixed). |
| [`theme-toggle`](./theme-toggle/) | Proper persisted light/dark — a ThemeProvider + full CSS token palette for both modes, plus the trick for keeping terminals dark in both themes. |
| [`seo-kit`](./seo-kit/) | SEO essentials in one pass — `<head>` meta, Open Graph + Twitter cards, JSON-LD (Person / WebSite), and `sitemap.xml` + `robots.txt` (with a generator for SPAs). |
| [`og-image`](./og-image/) | Generate a branded 1200×630 social-share PNG from an SVG template with sharp — no design tool needed. Pairs with `seo-kit`. |
| [`deploy-doctor`](./deploy-doctor/) | A diagnostic playbook for deploy failures: raw-JS-served, `FUNCTION_INVOCATION_FAILED`, port binding, env vars not applying, blank link previews, SPA 404s, and more. |

## Using a skill

Point Claude Code at this repo (or copy a skill folder into your project's
`.claude/skills/`), then ask Claude to run it — e.g.:

> "Use the **ask-terminal** skill to add an AI chat terminal to my portfolio."

Each skill is a directory with a `SKILL.md` (instructions + frontmatter) and
`references/` (template files Claude adapts into your project).
