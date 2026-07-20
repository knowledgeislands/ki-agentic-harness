# ki-agents

Audit, review, and write Claude Code subagent definitions against current best practice.

**Invoke:** `ki-agents audit <agent-or-dir> | conform <agent> | help | educate <description> | refresh`

**Modes:**

- `AUDIT` — review an existing agent
- `CONFORM` — bring an existing agent into line
- `EDUCATE` — write a new agent
- `HELP` — explain this skill and stop; the default when no mode is given (then routes, if interactive)
- `REFRESH` — re-anchor best practice

**See also:** Judges a subagent definition (frontmatter + system prompt) — for authoring a SKILL.md use the `ki-skills` skill instead; for harness-level layout (five-part bundle, `.ki-config.toml` compliance) use `ki-harness`.
