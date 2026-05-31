# arcadia-skills roadmap

Where this skill collection is going. The [README](README.md) covers what exists today and how to install it; this file is the forward view — what's next and
why. Items are grouped **Next / Soon / Later** by confidence, not by date; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's
built.

## Cross-cutting principles

These hold for every skill in the repo, current and future:

- **Every skill carries a refresh path — and a cadence.** A skill that tracks a moving target (an external spec, a community best-practice, a base's live
  structure) ships a REFRESH mode and a dated `references/sources.md`, and states how often it should run; a skill that hard-codes no volatile external fact may
  instead resolve it at runtime. Enforced as review criteria — `knowledgeislands-skills` rubric **LONG-1** (a refresh path exists) and **LONG-2** (it has a
  cadence, ideally a scheduled run) — and mirrored into the `knowledgeislands-mcp` audit checklist. The point is durability: a skill installed into a shared or
  cloud catalogue is long-lived and far from its author, and must not rot silently.
- **No silent collisions.** Where two skills could fire on the same request, each description names the other as the off-ramp (rubric **COLL-1/COLL-2**; the
  linter's cross-skill pass flags shared triggers). New skills are audited against the existing set before they ship.
- **Standard vs base-coupled extension.** Knowledge Islands skills stay base-agnostic and resolve bindings at runtime; anything base-specific lives in a
  `<base>-kb`-style extension that delegates shared modes back by name.

## Next

- **Bind `knowledgeislands-kb` to `arcadia-principal`.** `arcadia-principal` is the first real Knowledge Islands base this skill will track (it already exposes
  its own `kb-fs` MCP server). The skill stays a _standard_ skill — `arcadia-principal` supplies its store bindings and scope through its own `CLAUDE.md` and
  memory index, and any conventions unique to it go in a base-coupled extension, not into this skill. kb's Mode REFRESH then samples `arcadia-principal` as a
  live source to keep the structure model honest.
- **Establish a REFRESH cadence.** The REFRESH modes exist; they need a rhythm so they actually run — a capability nobody invokes rots as surely as none
  (codified as `knowledgeislands-skills` rubric **LONG-2**). Give each skill a stated cadence and, where the host supports it, a scheduled run — in Claude Code
  a `/schedule` routine that invokes the skill's REFRESH mode — rather than relying on someone remembering. Each run bumps the `last reviewed` dates and records
  the diff in the skill's `sources.md` changelog.

## Soon

- **Keep the audits self-applied.** `knowledgeislands-skills` audits itself and its siblings; `knowledgeislands-mcp` audits the workspace `mcp-*` repos. Run
  them after any structural change so the set never drifts from its own standard.
- **Finish the repo-config rollout.** The [`knowledgeislands-repo-config`](knowledgeislands-repo-config/SKILL.md) skill is built and the standard is applied
  across all 10 repos (local files, core GitHub settings, and deeper security — Dependabot, secret scanning, branch protection). Open follow-ups: add the
  missing `.editorconfig` to `mcp-kb-notion-mirror` and `mcp-voicenotes-edit` (a PR each, since `main` is protected); bring **private-repo** branch protection
  in via **rulesets** (the classic API is plan-limited, so the standard currently exempts them); and move the description-matches-purpose /
  synced-with-`package.json` check from a judgment item toward something mechanical.

## Later

- **Distribution as a plugin.** _(candidate)_ The intended end state is a Cowork plugin / marketplace wrapper built from this repository, so installing or
  updating the whole set is one action across every machine and base — replacing the manual symlink step.
- **Grow the set deliberately.** _(candidate)_ New skills (process, scoped, or further Knowledge Islands skills) are added as recurring needs emerge, each
  scaffolded through `knowledgeislands-skills` Mode AUTHOR and audited against the existing set before shipping.
