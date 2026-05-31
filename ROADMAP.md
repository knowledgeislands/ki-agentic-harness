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
- **Codify a GitHub repo-configuration standard.** The workspace repos should be consistent in how they present and behave on GitHub, and that consistency
  should be _checkable_, not folklore. **First step: audit the current state across all `knowledgeislands/` repos** — scoped/consistent names, a description
  that's present and matches the repo's actual purpose (and is kept in sync with the in-repo README/`package.json`), merge hygiene (squash/merge policy,
  **auto-delete head branches after merge**, linear history), enabled/disabled features (Issues, Projects, Wiki, Discussions), default branch and branch
  protection, topics, visibility, and license. From that survey, **derive the canonical standard** (recording intentional per-repo exceptions), then bring the
  outliers into line. Mechanics are read/written via the `gh` CLI / GitHub API. _(candidate)_ Once the standard settles, codify it as its own skill in the same
  codify / audit / REFRESH shape as `knowledgeislands-mcp` — a repo-config auditor with a `sources.md` tracking the GitHub features and settings it depends on
  (those move, so it needs the same refresh discipline as everything else here).

## Later

- **Distribution as a plugin.** _(candidate)_ The intended end state is a Cowork plugin / marketplace wrapper built from this repository, so installing or
  updating the whole set is one action across every machine and base — replacing the manual symlink step.
- **Grow the set deliberately.** _(candidate)_ New skills (process, scoped, or further Knowledge Islands skills) are added as recurring needs emerge, each
  scaffolded through `knowledgeislands-skills` Mode AUTHOR and audited against the existing set before shipping.
