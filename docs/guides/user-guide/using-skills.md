# Use skills

How a skill fires once it is available: by trigger or by slash command.

## By trigger or by slash command

Once a skill is available, there is nothing to import or configure — the agent loads it on demand. There are two ways it fires:

- **By trigger (judgemental)** — describe the task in plain language. The agent matches your request against each skill's `description` (the part that says _when_ to use it) and loads the skill itself. “Audit the M365 MCP against our standard” or “save this to my notes” will pull in the right skill without you naming it.
- **By slash command (explicit)** — type `/<skill-name>` to invoke it directly, optionally followed by arguments: `/ki-mcp audit ~/kis/knowledgeislands/mcp-gsuite`. Use this when you want to be certain which skill runs, or to pass a specific mode.

A skill that takes modes or arguments advertises them in its `argument-hint` frontmatter, shown as you type the slash command. For example, `ki-mcp` lists `audit <repo> | conform <repo> | init <repo> | refresh` — the words before each `<...>` are the modes, and the rest is what to pass. The arguments are a hint, not a parser: anything you type after the name reaches the skill as free text, so a plain-language phrasing of the same request works equally well.

This is why per-skill usage is **not** repeated in each `SKILL.md` body: the `description` documents when a skill fires and the `argument-hint` documents its modes, both machine-read at selection time. How to invoke _any_ skill — the slash-versus-trigger mechanics above — is a property of the agent runtime and lives here once.
