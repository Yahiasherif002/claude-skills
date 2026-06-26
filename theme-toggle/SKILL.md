---
name: theme-toggle
description: Add a proper, persisted light/dark theme to a React + Tailwind/CSS-variables site — a ThemeProvider that toggles a `.dark` class on <html>, remembers the choice in localStorage, and a complete CSS token palette for both modes. Includes the trick for keeping intentionally-dark panels (terminals, code blocks) dark in BOTH themes. Use when the user wants a dark/light mode switch, theming that actually works (not half-broken), or to convert a dark-only site to switchable.
---

# Theme Toggle (light / dark)

Switchable light/dark done right: CSS-variable token palettes for both modes, a `.dark` class on
`<html>`, persistence, and a `useTheme()` hook + toggle. Components that use the tokens
(`bg-background`, `text-foreground`, `border-border`, …) adapt automatically.

## What it produces

- **`ThemeProvider.tsx`** — context provider that toggles `.dark` on `documentElement`,
  persists to `localStorage`, exposes `useTheme() → { theme, toggleTheme }`. Defaults to dark
  (configurable), `switchable` flag.
- **`tokens.css`** — `:root` = light palette, `.dark` = dark palette, for the standard shadcn-style
  token set (background/foreground/card/primary/secondary/muted/accent/border + syntax colors).

## How to use it

1. Copy `references/ThemeProvider.tsx` and import its CSS tokens (`references/tokens.css`).
2. Wrap the app: `<ThemeProvider defaultTheme="dark" switchable>…</ThemeProvider>`.
3. Add a toggle button anywhere:
   ```tsx
   const { theme, toggleTheme } = useTheme();
   <button onClick={toggleTheme}>{theme === "dark" ? "☀︎" : "☾"}</button>
   ```
4. Make sure components use **token classes** (`bg-background`, `text-foreground`,
   `text-muted-foreground`, `border-border`, etc.) rather than hardcoded colors — those are what
   flip between modes.

## The "keep terminals dark" trick

Terminals / code panels should stay dark **even in light mode** (a terminal is dark). Since the
tokens are defined on the `.dark` selector, just add `className="dark"` to that panel's wrapper —
its descendants inherit the dark token values regardless of the page theme:

```tsx
<div className="dark bg-black text-foreground">…terminal stays dark & readable in both modes…</div>
```

## Gotchas

- Define tokens on **`:root` (light)** and **`.dark`** — not the reverse. Apply `.dark` to
  `<html>` so it cascades everywhere (incl. portals/dialogs).
- Hardcoded hex colors (`#1e1e1e`, `text-[#d4d4d4]`) won't theme — convert them to tokens, or
  leave a page intentionally dark by scoping it with `.dark`.
- Raise `--muted-foreground` lightness for light mode (low-contrast gray is the usual readability
  complaint).
- Tailwind v4: tokens map via `@theme`; v3: via `tailwind.config` `theme.extend.colors`.
