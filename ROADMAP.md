# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install
it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it
lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`ki:skills:lint`, `ki:repo:audit`, `ki:kb:audit`, the
`knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the
scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied
to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## `knowledgeislands-decision-records` checker can't validate the harness's own ADRs

The `ki:decision-records:audit` checker (`audit-drs.ts`) defaults to a KB-base layout — `Admin/Governance/Decisions/` with a `Decisions.md`
index — and the `package.json` script passes no path, so it cannot run against the harness's own `docs/decisions/` tree (whose index is
`README.md`). The script's own doc comment anticipates a "code" mode (`docs/decisions`), but the default and the `Decisions.md` index
assumption don't honour it — so the harness's ADRs go unaudited by their own governance skill (surfaced while adding
[ADR-KI-HARNESS-TOOLCHAIN-005](docs/decisions/ADR-KI-HARNESS-TOOLCHAIN-005.md), which had to be validated by hand).

**Gate:** teach `audit-drs.ts` the code-repo layout — detect/accept `docs/decisions/` with a `README.md` index when not in a KB — or wire
`ki:decision-records:audit` to pass the path; then `bun run ki:decision-records:audit` runs green here. Remove this item once it does.

## Distant future _(parked)_

Not on the near-term path; recorded so the thought isn't lost.

- **Virtual-branch workflow ([GitButler](https://gitbutler.com)).** GitButler was trialled on `arcadia-agentic-harness` and has since been
  removed (its refs + `.git/gitbutler` metadata dropped 2026-06-28); the repos are plain-git for now. Worth revisiting only if parallel
  multi-branch work across the harness + sibling repos becomes common enough to justify a virtual-branch tool — and only if it composes
  cleanly with the `ki:conform` / `ki:verify` gate and the per-repo `feat/*` → fast-forward-to-`main` flow we use today. A user-global
  `gitbutler.aimodelprovider` key may still linger in `~/.gitconfig` (harmless).
