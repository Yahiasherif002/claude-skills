# ask-terminal

A Claude Code skill that scaffolds an **"Ask Me" AI chat terminal** — the kind you'd
embed on a portfolio so visitors can "chat with your AI."

![what it builds](https://img.shields.io/badge/builds-AI%20chat%20terminal-007acc)

## Features

- 🖥️ **Terminal UI** — traffic lights, `visitor@site:~$` prompts, ✶ assistant replies
- ⌨️ **Streaming** replies, token-by-token
- 📝 **Rich markdown** (bold, lists, code, links) via a zero-dependency renderer
- ✨ **Claude-style thinking** — braille spinner + cycling gerunds (Germinating… Pondering…) in gradient color, with elapsed seconds
- 🖱️ **Right-click to paste**
- 🛟 **Local fallback** answers when the backend is down
- 🔒 **Hardened backend** — prompt-injection pre-filter, off-topic refusal, ~400-token cap, per-IP + global rate limiting
- ☁️ **Deploy anywhere** — one self-contained serverless function (Vercel-ready) + an optional local Express route

## Files

```
ask-terminal/
├── SKILL.md                          # instructions Claude follows
└── references/
    ├── AskTerminal.tsx               # the React component
    ├── api-chat.ts                   # serverless function + shared handleChat
    ├── express-route.snippet.ts      # local dev route
    └── .env.example                  # required env vars
```

## Usage

Ask Claude Code: *"Use the ask-terminal skill to add an AI chat terminal to my site."*
Then customize the persona facts in `api/chat.ts` and set the `LLM_*` env vars.

See [`SKILL.md`](./SKILL.md) for full build/deploy/verify instructions.

> Built from the Ask-Me terminal on [numueg.app](https://numueg.app) (Yahia Sherif's portfolio).
