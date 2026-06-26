# claude-skills

A personal collection of [Claude Code](https://claude.com/claude-code) **skills** —
reusable, self-contained capabilities Claude can invoke to scaffold things I build often.

## Skills

| Skill | What it does |
|-------|--------------|
| [`ask-terminal`](./ask-terminal/) | Builds an "Ask Me" AI chat terminal — a VS Code / terminal-styled component with streaming markdown replies, a Claude-style thinking indicator, right-click paste, and a rate-limited, prompt-hardened serverless LLM backend (OpenRouter / any OpenAI-compatible API). |

## Using a skill

Point Claude Code at this repo (or copy a skill folder into your project's
`.claude/skills/`), then ask Claude to run it — e.g.:

> "Use the **ask-terminal** skill to add an AI chat terminal to my portfolio."

Each skill is a directory with a `SKILL.md` (instructions + frontmatter) and
`references/` (template files Claude adapts into your project).
