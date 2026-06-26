---
name: command-palette
description: Add a VS Code / Raycast-style ⌘K command palette to a React app — fuzzy-searchable navigation, actions, and links in a modal. Opens with Cmd/Ctrl+K or "/", supports jump-to-section (smooth scroll), open-external-link, and run-action items, grouped with headings. Built on cmdk. Use when the user wants a command palette, quick-nav / quick-actions, a "⌘K" launcher, or a power-user keyboard menu.
---

# Command Palette (⌘K)

A keyboard-driven command palette: press **⌘K / Ctrl+K** (or `/`) to open a fuzzy-searchable
modal of navigation targets, actions, and links. Built on [`cmdk`](https://cmdk.paco.me/).

## What it produces

- **`CommandPalette.tsx`** — self-contained (only needs `cmdk`):
  - Opens on **⌘K / Ctrl+K**, or `/` when not typing in a field
  - Also opens via a custom `window` event so any button can trigger it
  - Grouped items: **Navigate** (smooth-scroll to a section id), **Links** (open URL / mailto), **Actions** (run any callback)
  - Fuzzy search, arrow-key nav, Esc to close — all from cmdk
- Fully **config-driven** — pass `sections`, `links`, and `actions` arrays; no app-specific code.

## How to use it

1. Copy `references/CommandPalette.tsx` into the project's components folder.
2. Install the dep: `npm i cmdk`.
3. Render `<CommandPalette sections={...} links={...} actions={...} />` once near the app root.
4. (Optional) Add a visible hint/button that opens it:
   ```ts
   window.dispatchEvent(new Event("open-command-palette"))
   ```
5. Style: the reference uses a few utility classes + CSS variables (`--background`, `--border`,
   `--primary`, `--muted`). Map them to your design tokens or replace with literal colors.

## Notes

- The `/` shortcut is ignored while focused in an input/textarea/contenteditable, so it doesn't
  hijack typing.
- `sections` use `document.getElementById(id).scrollIntoView()` — give your page sections matching ids.
- For client-side routing, pass an `onNavigate(path)` action instead of a section id.
