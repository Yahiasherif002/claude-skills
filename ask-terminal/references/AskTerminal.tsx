import { useEffect, useRef, useState, type ReactNode } from "react";
import { CornerDownLeft } from "lucide-react";

/**
 * Ask-Me AI terminal.
 *
 * A dark, terminal-styled chat widget that posts to POST /api/chat and streams
 * the reply token-by-token with rich markdown + a Claude-style thinking
 * indicator. Falls back to local canned answers if the backend is unreachable.
 *
 * CUSTOMIZE: SUGGESTIONS and localAnswer() below. The persona/facts the AI uses
 * live server-side in api/chat.ts.
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's your experience?",
  "What are your best projects?",
  "What's your tech stack?",
  "How can I reach you?",
];

/** Offline fallback used when /api/chat is unreachable. Edit keywords to taste. */
function localAnswer(qRaw: string): string {
  const q = qRaw.toLowerCase();
  const has = (...k: string[]) => k.some((w) => q.includes(w));
  if (has("hi", "hey", "hello")) return "Hey! Ask me about my experience, projects, or how to reach me.";
  if (has("experience", "work", "job")) return "I'll happily walk you through my experience — try asking about a specific project or role.";
  if (has("project", "built")) return "Ask me about any of my projects and I'll give you the details.";
  if (has("stack", "tech", "skill")) return "Ask about my tech stack and I'll list what I work with.";
  if (has("contact", "reach", "email", "hire")) return "The best way to reach me is by email — see the contact section.";
  return "I don't have that handy right now — feel free to reach out via the contact section.";
}

// --- Claude-style "working" indicator ---
const GERUNDS = [
  "Germinating", "Pondering", "Percolating", "Noodling", "Synthesizing",
  "Cooking", "Brewing", "Conjuring", "Ruminating", "Computing",
  "Crafting", "Marinating", "Vibing", "Mulling", "Incubating",
  "Cerebrating", "Simmering", "Musing", "Deliberating", "Manifesting",
];
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function ThinkingIndicator() {
  const [frame, setFrame] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const spin = setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 80);
    const word = setInterval(() => setWordIdx((i) => (i + 1) % GERUNDS.length), 1700);
    const clock = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { clearInterval(spin); clearInterval(word); clearInterval(clock); };
  }, []);
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary select-none shrink-0">ai ➜</span>
      <span className="text-primary text-base leading-none w-4 inline-block">{SPINNER[frame]}</span>
      <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-semibold">
        {GERUNDS[wordIdx]}…
      </span>
      {seconds > 0 && <span className="text-muted-foreground/60 text-xs">({seconds}s)</span>}
    </div>
  );
}

// --- Tiny, dependency-free markdown renderer (bold/italic/code/links/lists) ---
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) nodes.push(<strong key={key++} className="text-foreground font-semibold">{m[2]}</strong>);
    else if (m[3] !== undefined) nodes.push(<code key={key++} className="text-cyan-300 bg-white/10 px-1 py-0.5 rounded text-[0.85em]">{m[3]}</code>);
    else if (m[4] !== undefined) nodes.push(<a key={key++} href={m[5]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{m[4]}</a>);
    else if (m[6] !== undefined) nodes.push(<em key={key++}>{m[6]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function MiniMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{renderInline(it)}</li>);
    blocks.push(
      list.ordered
        ? <ol key={blocks.length} className="list-decimal ml-5 my-1 space-y-0.5">{items}</ol>
        : <ul key={blocks.length} className="list-disc ml-5 my-1 space-y-0.5">{items}</ul>
    );
    list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const ul = line.match(/^\s*[-*]\s+(.*)/);
    const ol = line.match(/^\s*\d+\.\s+(.*)/);
    if (ul) { if (!list || list.ordered) { flush(); list = { ordered: false, items: [] }; } list.items.push(ul[1]); }
    else if (ol) { if (!list || !list.ordered) { flush(); list = { ordered: true, items: [] }; } list.items.push(ol[1]); }
    else { flush(); if (line.trim()) blocks.push(<p key={blocks.length} className="my-1">{renderInline(line)}</p>); }
  }
  flush();
  return <div className="text-sm leading-relaxed">{blocks}</div>;
}

export default function AskTerminal() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi — ask me anything about my experience, projects, or stack." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => { if (streamTimer.current) clearInterval(streamTimer.current); }, []);

  const streamReply = (fullText: string) => {
    const tokens = fullText.split(/(\s+)/);
    let i = 0;
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    streamTimer.current = setInterval(() => {
      i++;
      const partial = tokens.slice(0, i).join("");
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: partial };
        return copy;
      });
      if (i >= tokens.length) {
        if (streamTimer.current) clearInterval(streamTimer.current);
        setStreaming(false);
        setBusy(false);
      }
    }, 26);
  };

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const history = [
      ...messages.filter((m, idx) => !(m.role === "assistant" && idx === 0)),
      { role: "user" as const, content: question },
    ];
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (res.status === 429) streamReply(data.error || "Too many requests — please slow down a moment.");
      else if (!res.ok || !data.reply) streamReply(localAnswer(question));
      else streamReply(data.reply);
    } catch {
      streamReply(localAnswer(question));
    }
  };

  return (
    <div className="dark bg-black/90 border border-border rounded-md overflow-hidden w-full text-foreground">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-muted-foreground">ask-me — zsh</span>
      </div>

      {/* Conversation */}
      <div ref={bodyRef} className="p-4 font-mono text-sm h-80 overflow-y-auto space-y-3">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex items-start gap-2">
              <span className="text-green-500 select-none shrink-0">visitor@site:~$</span>
              <span className="text-foreground break-words">{m.content}</span>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary select-none shrink-0">ai ➜</span>
              <div className="min-w-0 flex-1 text-foreground/90 break-words">
                <MiniMarkdown text={m.content} />
                {streaming && i === messages.length - 1 && (
                  <span className="caret inline-block h-3.5 ml-0.5 align-middle">&nbsp;</span>
                )}
              </div>
            </div>
          )
        )}
        {busy && !streaming && <ThinkingIndicator />}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={busy}
            className="text-xs px-2 py-1 border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2 px-4 py-3 border-t border-border"
      >
        <span className="text-green-500 font-mono text-sm select-none">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onContextMenu={(e) => {
            // Right-click pastes clipboard at the cursor. If unsupported, let the
            // native menu show. NOTE: capture e.currentTarget BEFORE awaiting —
            // React nulls it after the handler returns.
            if (!navigator.clipboard?.readText) return;
            e.preventDefault();
            const el = e.currentTarget;
            el.focus();
            navigator.clipboard
              .readText()
              .then((clip) => {
                if (!clip) return;
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? el.value.length;
                setInput(el.value.slice(0, start) + clip + el.value.slice(end));
              })
              .catch(() => { /* clipboard permission denied — ignore */ });
          }}
          placeholder="Ask me anything…  (right-click to paste)"
          aria-label="Ask a question"
          className="flex-1 bg-transparent font-mono text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
        />
        <button type="submit" disabled={busy || !input.trim()} className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-40" aria-label="Send">
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
