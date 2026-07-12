# ki-tokenomics

Audit, codify, and optimise the tokenomics of a Claude Code environment — the standing context surface paid on every turn, composed across the user-wide (`~/.claude`) and project-local layers and any Knowledge Islands base, plus the runtime levers (caching, model tier, compaction, sub-agent fan-out, verbosity).

**Invoke:** `ki-tokenomics audit | conform | help | init | refresh`

**Modes:**

- `AUDIT  `
- `CONFORM`
- `HELP   ` — explain this skill and stop; the default when no mode is given (then routes, if interactive)
- `INIT   `
- `REFRESH`

**See also:** For the volatile numbers (model ids, prices, cache TTLs, window sizes) use `claude-api`; for a base's structure/content use `ki-kb`; for one skill's quality use `ki-skills`; for an MCP server's code use `ki-mcp`.
