# ki-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install it; this file is the forward view. Open work is grouped by horizon — **Next**, **Soon**, **Future** — the house phasing owned by `ki-harness` and referenced by `ki-plans`; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb-base:audit`, the `ki-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the scheduled `ki-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Next

### Build the cross-surface binding skill

A per-project skill that fans the KI MCP servers, skills, and agents out from the single chezmoi `mcp-servers-json` source across the controllable surfaces — extending the pattern `ki-bootstrap` already uses for Claude Code skill links. On Cowork it toggles a KI plugin (Claude's plugin-marketplace format, which bundles servers + skills + agents) in `enabledPlugins`; on Claude Code and Desktop it writes the local config; claude.ai stays documented-convention (account/org minimal). The shape was ratified 2026-07-05 by plan 002 (design-only, now landed); the full design — per-surface targeting table, home decision, and build sequencing — is the design record [cross-surface-enablement.md](skills/ki-mcp/references/cross-surface-enablement.md). Sequence the build by controllability: Claude Code → Desktop → Cowork (gated on verifying Cowork honours an external edit on next launch). Plan: [cross-surface/007-binding-skill.md](docs/plans/cross-surface/007-binding-skill.md).

## Future

### Rename `mcp-kb-notion-mirror` to `mcp-ki-kb-notion-mirror`

Bring the repo's directory/package name in line with the `ki-` prefix convention. Mechanical rename across the repo (package.json `name`, README, CI badges, any cross-repo references such as `ki-agentic-harness/scripts/generate-clients.ts` and the `ki-mcp` standard doc's repo list) plus the GitHub repo rename itself.

### Add `mcp-gcal`

A new sibling MCP server for Google Calendar, scaffolded from `mcp-gmail`'s shape (shared Google OAuth patterns) rather than folding calendar tools into `mcp-gmail` itself — keeps one `<app>` tool prefix and one scope set per repo, consistent with the rest of the `mcp-*` workspace.

### The harness `docs/` is canonical authoring; the website vendors a copy

Skill and design documentation is authored here and stays canonical — it is an **input** to two downstream consumers: ki-arcadia-principal references it (via the `Agentic Tool Documentation` stream), and ki-website needs it for its pages. The harness stays **canonical for its own story** — the human-first overview ([docs/overview.md](docs/overview.md)) and the skill/design docs live here; the downstream repos reference rather than own them.

Because the website build must be **autonomous** — no reach into a sibling repo at build time — it cannot source the harness `docs/` live; it vendors a self-contained copy. Automate that as a **one-directional committed sync**: a script or CI step in ki-website copies the website-relevant subset of the harness `docs/` into its content tree and commits it, so the build is fully self-contained, the harness stays the single source, and every update lands as a reviewable diff in the website's history — no manual duplication. (A git submodule pinned to a harness ref is the alternative, if strict version-pinning is preferred over copy-commits.)

**Gate:** this pipeline is ki-website's roadmap work; the harness's only responsibility is to remain the canonical author. Nothing here for the harness to retire.
