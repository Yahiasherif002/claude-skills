import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  /** Comment-style kicker; "about" renders as `// about`. */
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section heading that types a `// label` kicker and draws an animated underline
 * the first time it scrolls into view. Uses --primary and a `.caret` blink
 * (see caret.css). Self-triggering — does not rely on parent variant propagation.
 */
export default function SectionHeading({ label, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [inView, setInView] = useState(false);
  const started = useRef(false);
  const full = `// ${label}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          setInView(true);
          let i = 0;
          const tick = () => {
            setTyped(full.slice(0, i));
            if (i <= full.length) { i++; setTimeout(tick, 35); }
          };
          tick();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [full]);

  return (
    <div ref={ref} className={`mb-8 ${className}`}>
      <div className="text-xs md:text-sm font-mono mb-2 min-h-[1.25rem] flex items-center" style={{ color: "var(--muted-foreground, #6a9955)" }}>
        <span>{typed}</span>
        {typed.length < full.length && started.current && <span className="caret h-[1em] ml-0.5">&nbsp;</span>}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 flex-wrap">{children}</h2>
      <motion.div
        className="h-0.5 mt-3"
        style={{ background: "linear-gradient(to right, var(--primary, #007acc), transparent)" }}
        initial={{ width: 0 }}
        animate={inView ? { width: "9rem" } : { width: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}
