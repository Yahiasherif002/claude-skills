---
name: scroll-reveal-kit
description: Add tasteful, RELIABLE scroll-triggered animations to a React site — a SectionHeading that types a "// label" kicker + draws an animated underline when it scrolls into view, a count-up number component for stats, and the correct framer-motion reveal patterns. Includes the fixes for the common framer-motion gotcha where parent→child variant propagation through whileInView silently leaves content stuck invisible. Use when the user wants scroll reveals, animated section headers, animated stat counters, or is fighting "my section is blank / animation didn't fire" bugs.
---

# Scroll Reveal Kit

Polished scroll animations that **don't break** — plus the hard-won fixes for framer-motion's
reveal footguns.

## What it produces

- **`SectionHeading.tsx`** — a heading that, the first time it scrolls into view, **types a
  `// label` kicker** and **draws an animated underline**. Pass `label` + heading children.
- **`CountUp.tsx`** — animates a number 0→N when it enters the viewport (suffix/prefix/decimals).
- **Reveal patterns** (below) — copy-paste motion snippets that are robust.

## ⚠️ The framer-motion gotcha (and the fix)

The most common "my whole section is invisible" bug comes from **parent→child variant
propagation through `whileInView`**:

```tsx
// ❌ FRAGILE — children can get stuck at opacity:0 if propagation doesn't fire
<motion.div initial="hidden" whileInView="show" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.1 }}}}>
  {items.map(i => <motion.div variants={fadeUp} key={i}>…</motion.div>)}
</motion.div>
```

Use one of these instead:

```tsx
// ✅ ROBUST A — each child triggers its own whileInView (no propagation dependency)
{items.map((it, i) => (
  <motion.div key={i}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: i * 0.08 }}>
    {…}
  </motion.div>
))}

// ✅ ROBUST B — for above-the-fold groups, use animate (mount) not whileInView
<motion.div initial="hidden" animate="show" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.1 }}}}>
  {items.map(i => <motion.div variants={fadeUp} key={i}>…</motion.div>)}
</motion.div>
```

**Rule of thumb:** never let visibility depend on a stagger that might not fire. If content must
be visible, prefer per-item `whileInView` or mount `animate`.

> Scroll containers: framer's `whileInView` observes the **viewport** by default. If your page
> scrolls inside an inner `overflow-y-auto` element, pass `viewport={{ root: scrollRef }}`.

## How to use it

1. Copy `references/SectionHeading.tsx` and `references/CountUp.tsx` into components.
2. `<SectionHeading label="projects">My Projects</SectionHeading>` and `<CountUp end={500} suffix="+" />`.
3. Deps: `framer-motion`. Styling uses `--primary` / `--muted-foreground` tokens + a `.caret`
   blink (include the small CSS in `references/caret.css`).
