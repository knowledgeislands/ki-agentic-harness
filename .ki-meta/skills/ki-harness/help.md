# ki-harness

Audit, conform, and scaffold Knowledge Islands agentic harnesses — repos that bundle skills, agents, MCP servers, evals, and hooks together for versioned, co-installed deployment.

**Invoke:** `ki-harness audit [path] | conform [path] | help | init <name> | refresh`

**Modes:**

- `AUDIT  ` — check a harness against the standard
- `CONFORM` — bring a harness into line
- `HELP   ` — explain this skill and stop; the default when no mode is given (then routes, if interactive)
- `INIT   ` — scaffold a new harness
- `REFRESH` — re-anchor the standard

**See also:** Use when creating a new harness, checking an existing harness's five-part layout (`skills/`, `agents/`, `mcp/`, `evals/`, `hooks/`), verifying its CLAUDE.md covers required orientation sections, checking its package.json script families, or auditing its `.ki-config.toml` harness table.
