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
  cloud catalogue is long-lived and far from its author, and must not rot silently. A monthly `knowledgeislands-skills-refresh` routine realises this: it runs
  all five skills' REFRESH against their tracked sources and opens a PR for review rather than committing.
- **No silent collisions.** Where two skills could fire on the same request, each description names the other as the off-ramp (rubric **COLL-1/COLL-2**; the
  linter's cross-skill pass flags shared triggers). New skills are audited against the existing set before they ship.
- **Standard vs base-coupled extension.** Knowledge Islands skills stay base-agnostic and resolve bindings at runtime; anything base-specific lives in a
  `<base>-kb`-style extension that delegates shared modes back by name.
- **One governance-mode model.** Every skill exposes the universal modes **AUDIT / CONFORM / REFRESH** (check against the standard / bring an artifact into line
  / re-anchor the standard to its sources), plus skill-specific modes — **INIT** to scaffold a new artifact, and operational modes such as
  `knowledgeislands-kb`'s note-ops. Codified as `knowledgeislands-skills` rubric **SHAPE-5**, so a new skill inherits the shape.

## Next

- **Bind `knowledgeislands-kb` to `arcadia-principal`.** `arcadia-principal` is the first real Knowledge Islands base this skill will track (it already exposes
  its own `kb-fs` MCP server). The skill stays a _standard_ skill — `arcadia-principal` supplies its store bindings and scope through its own `CLAUDE.md` and
  memory index, and any conventions unique to it go in a base-coupled extension, not into this skill. kb's Mode REFRESH then samples `arcadia-principal` as a
  live source to keep the structure model honest.

## Soon

- **Keep the audits self-applied.** `knowledgeislands-skills` audits itself and its siblings; `knowledgeislands-mcp` audits the workspace `mcp-*` repos. Run
  them after any structural change so the set never drifts from its own standard.
- **Repo standard — remaining hardening.** The [`knowledgeislands-repo`](knowledgeislands-repo/SKILL.md) standard is applied across all 10 repos and they pass
  `repo:audit` (0 fail); every `.ki-config.toml` carries the `[knowledgeislands-repo]` table and `main` is open everywhere. Two follow-ups remain: move the
  description-matches-purpose / synced-with-`package.json` check from a judgment item toward something mechanical (the auditor fetching `package.json` and
  comparing); and, if the org ever wants a protected `main` on a **private** repo, bring it in via **rulesets**, since the classic protection API is
  plan-limited on private repos.
- **Give `knowledgeislands-kb` a mechanical checker.** kb is a governance skill (AUDIT / CONFORM / REFRESH) but its AUDIT is judgment-only; a bundled checker
  for zone-model / note-frontmatter conformance would bring it to parity with the other four and complete the governance-skill shape.
- **Build the skills out evaluation-first.** Rubric **PROC-1/2** — at least three evaluation scenarios against a no-skill baseline, and a pass across the models
  each skill runs on (Haiku / Sonnet / Opus) — isn't satisfied: the set was authored rubric-first, not eval-first. Stand up a small eval harness (representative
  prompts per skill, scored with and without the skill loaded) so new and changed skills are validated by behaviour, not just linted. Advisory (a WARN, not a
  gate), but it is the last open item from the skills audit.

## Later

- **Distribution as a plugin.** _(candidate)_ The intended end state is a Cowork plugin / marketplace wrapper built from this repository, so installing or
  updating the whole set is one action across every machine and base — replacing the manual symlink step.
- **Grow the set deliberately.** _(candidate)_ New skills (process, scoped, or further Knowledge Islands skills) are added as recurring needs emerge, each
  scaffolded through `knowledgeislands-skills` Mode INIT and audited against the existing set before shipping.
- **`.ki-config.toml` as a per-repo override layer.** _(candidate)_ `knowledgeislands-repo` introduced a shared, skill-sectioned `.ki-config.toml` (its
  `[knowledgeislands-repo]` table holds `visibility` + a `[…checks]` sub-table of per-repo check overrides). The same file could let **any** KI skill take
  per-repo overrides under its own `[<skill>]` table — tuning a rubric criterion, opting a check up or down, or extending a default (e.g. extra topics) for one
  repo — making it the single place a repo declares how the house standards apply to it. Needs a convention for what's overridable vs fixed, and each consuming
  skill emitting its default keys (the repo `--init` pattern) so the options are authored, not implicit.
