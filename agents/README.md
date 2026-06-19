# agents

Knowledge Islands **Claude Code subagents** live here, one per `.md` file, grouped into domain subdirectories. **Empty for now** — this is
the shelf, mirroring `hnr-agentic-harness/agents/`.

## Convention

Each agent is a single Markdown file — YAML frontmatter (only `name` + `description` required; optional
`model`/`tools`/`disallowedTools`/`permissionMode`/`color` and the wider subagents-spec set) followed by a system prompt — per
[Claude Code's subagents docs](https://code.claude.com/docs/en/sub-agents). Identity comes from the `name` field, which must be unique
across the whole tree, not the path.

Agent definitions conform to the **`knowledgeislands-agents`** standard (under [skills/](../skills/)) — the agents twin of
`knowledgeislands-skills`. Run its AUDIT before shipping an agent, the same way skills run `knowledgeislands-skills`.

## Adding an agent

1. Choose (or create) a domain subdirectory.
2. Add `<role>.md` with `name` + `description` frontmatter and a focused system prompt.
3. Audit it against `knowledgeislands-agents` and resolve the findings.
