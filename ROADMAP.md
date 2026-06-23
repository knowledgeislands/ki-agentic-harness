# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install
it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it
lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`skills:lint`, `repo:audit`, `kb:audit`, the
`knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the
scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied
to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Audit WARNs to resolve

- **`knowledgeislands-tokenomics` — MCP server count and overlap.** 19 user-scoped servers exceed the three-to-five-always-loaded heuristic
  (MCP-2/MCP-3). Several KB-FS servers serve overlapping purposes (`arcadia-principal-mcp-kb-fs` + `hnr-principal-mcp-kb-fs`,
  `kit-hnr-mcp-kb-fs`, `vallearmonia-principal-mcp-kb-fs`, etc.) with no documented rationale for simultaneous loading. Resolves alongside
  the "Adopt `knowledgeislands-tokenomics` across environments" item below: the MCP scoping decision (move project-specific KB servers to
  `.mcp.json`) closes both. _(surfaced: ki-multi-skill-audit WARNs MCP-2, MCP-3)_

## Later

- **Adopt `knowledgeislands-tokenomics` across environments.** All three environments opted in (harness, `arcadia-principal`,
  `arcadia-website`); each AUDIT runs 0 FAIL. Remaining open work: (a) decide on MCP server scoping — 15 of the 19 user-scoped servers are
  project-specific KB FS instances (`hnr-*`, `kit-hnr-*`, `kit-legal-*`, `kit-pkb-*`, `kit-principal-*`, `mcp-kb-*`, `mcp-m365-*`,
  `vallearmonia-*`) that could move to project-local `.mcp.json` files, leaving only the 4 genuinely cross-context servers
  (`kit-mcp-git-audit`, `kit-mcp-gmail`, `kit-mcp-claude-housekeeping`, `kit-mcp-voicenotes-edit`) plus the arcadia KB FS pair globally.

- **Dependabot safe auto-merge.** _(candidate)_ The Layer-3 baseline is in place (alerts + security updates + `allow_update_branch`, all
  governed); all seven mcp repos now declare `bun` + `github-actions` ecosystems (bun-only, no npm — no duplicate PRs observed). The
  `dependabot-auto-merge.yml` in every mcp repo is currently **inert** — `allow_auto_merge` is off and `main` is unprotected, so
  `gh pr merge --auto` has no required check to gate on. Making it safe means protecting `main` with the required `build` check (the
  `branch-protection` override, deliberately OFF today so `main` stays open) **and** enabling `allow_auto_merge` — a real shift in the push
  workflow (maintainers via PRs too). Deferred pending that posture decision; the alternative is to drop the inert workflow or rework it
  into a CI-gated merge that needs no branch protection.
