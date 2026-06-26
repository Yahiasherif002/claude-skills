import { useEffect, useState, type ReactNode } from "react";
import { Command } from "cmdk";

/**
 * VS Code / Raycast-style ⌘K command palette. Self-contained — only depends on
 * `cmdk`. Open with ⌘K / Ctrl+K, "/" (when not typing), or by dispatching a
 * `window` "open-command-palette" event.
 *
 * Style hooks use CSS variables (--background, --border, --primary, --muted,
 * --foreground, --accent); map them to your tokens or swap for literal colors.
 */

export interface PaletteSection { id: string; label: string; icon?: ReactNode }
export interface PaletteLink { label: string; href: string; icon?: ReactNode }
export interface PaletteAction { label: string; run: () => void; icon?: ReactNode }

interface Props {
  sections?: PaletteSection[];
  links?: PaletteLink[];
  actions?: PaletteAction[];
}

function isTyping() {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

export default function CommandPalette({ sections = [], links = [], actions = [] }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTyping())) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const openEvt = () => setOpen(true);
    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", openEvt);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", openEvt);
    };
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 80); // let the dialog close first
  };

  const goToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={() => setOpen(false)}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border shadow-2xl overflow-hidden"
        style={{ background: "var(--background, #1e1e1e)", borderColor: "var(--border, #3e3e42)", color: "var(--foreground, #d4d4d4)" }}
        label="Command Menu"
      >
        <Command.Input
          autoFocus
          placeholder="Type a command or search…"
          className="w-full px-4 py-3 bg-transparent outline-none text-sm border-b"
          style={{ borderColor: "var(--border, #3e3e42)" }}
        />
        <Command.List className="max-h-[320px] overflow-y-auto p-2 text-sm">
          <Command.Empty className="py-6 text-center opacity-60">No results.</Command.Empty>

          {sections.length > 0 && (
            <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:opacity-60">
              {sections.map((s) => (
                <Item key={s.id} onSelect={() => run(() => goToSection(s.id))}>
                  {s.icon} {s.label}
                </Item>
              ))}
            </Command.Group>
          )}

          {actions.length > 0 && (
            <Command.Group heading="Actions">
              {actions.map((a) => (
                <Item key={a.label} onSelect={() => run(a.run)}>
                  {a.icon} {a.label}
                </Item>
              ))}
            </Command.Group>
          )}

          {links.length > 0 && (
            <Command.Group heading="Links">
              {links.map((l) => (
                <Item key={l.label} onSelect={() => run(() => window.open(l.href, "_blank"))}>
                  {l.icon} {l.label}
                </Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}

function Item({ children, onSelect }: { children: ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer data-[selected=true]:bg-[var(--accent,#2a2d2e)]"
    >
      {children}
    </Command.Item>
  );
}
