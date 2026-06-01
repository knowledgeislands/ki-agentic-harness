# arcadia-skills roadmap

Where this skill collection is going. The [README](README.md) covers what exists today and how to install it; this file is the forward view — what's next and
why. Items are grouped **Next / Soon / Later** by confidence, not by date; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's
built.

The standing principles every skill upholds — a refresh path and cadence, no silent collisions, standard vs base-coupled extension, and one governance-mode
model — are present-tense invariants, not roadmap items, so they live in the [README](README.md) under _Principles across the set_. Several entries below exist
to serve them (the monthly refresh routine, the eval harness).

## Soon

- **Keep the eval suite honest as skills change.** The harness is built and the **PROC-1/2** matrix has been run across **Haiku / Sonnet / Opus** at `--runs 3`
  (curated in [evals/results/MATRIX.md](evals/results/MATRIX.md)): every house-arbitrary scenario shows a large, model-independent skill effect (baseline 0/3 →
  treatment 3/3). It is advisory (a WARN, not a gate). Two follow-ups remain. (a) **Tighten the two low-signal scenarios** — `skills-description` overlaps
  generic knowledge a baseline already has, and the `bun test` trap is partly general; replace them with more house-arbitrary probes when the suite is next
  touched. (b) **Decide the `footnote-marker-series` skill-design question** the matrix surfaced: the marker series is reference-gated and so unreachable to a
  headless one-shot agent (scores ~0/5 even with `--add-dir`) — either promote the series into `knowledgeislands-authoring`'s `SKILL.md` body, or accept it as a
  known progressive-disclosure limit. Re-run with `bun run eval --runs 3` (Sonnet is the routine arm; Opus costs ~3.5× for periodic confirmation).

- **Keep the audits self-applied.** `knowledgeislands-skills` audits itself and its siblings; `knowledgeislands-mcp` audits the workspace `mcp-*` repos. Run
  them after any structural change so the set never drifts from its own standard.
- **Repo standard — remaining hardening.** The [`knowledgeislands-repo`](knowledgeislands-repo/SKILL.md) standard is applied across all 10 repos and they pass
  `repo:audit` (0 fail); every `.ki-config.toml` carries the `[knowledgeislands-repo]` table and `main` is open everywhere. Two follow-ups remain: move the
  description-matches-purpose / synced-with-`package.json` check from a judgment item toward something mechanical (the auditor fetching `package.json` and
  comparing); and, if the org ever wants a protected `main` on a **private** repo, bring it in via **rulesets**, since the classic protection API is
  plan-limited on private repos.
- **Extend `knowledgeislands-kb`'s checker to note-frontmatter conformance.** The bundled `audit-kb.ts` now covers the base-agnostic mechanical layer (zone
  layout, same-name index notes, root memory index, and validate-down of the `[knowledgeislands-kb]` table), completing the governance-skill shape. Per-note
  frontmatter checks are deferred: required frontmatter is partly base-specific, so it stays a judgment item (or a base-coupled extension's job) until a
  base-agnostic core is clear.

## Later

- **Distribution as a plugin.** _(candidate)_ The intended end state is a Cowork plugin / marketplace wrapper built from this repository, so installing or
  updating the whole set is one action across every machine and base — replacing the manual symlink step.
- **Grow the set deliberately.** _(candidate)_ New skills (process, scoped, or further Knowledge Islands skills) are added as recurring needs emerge, each
  scaffolded through `knowledgeislands-skills` Mode INIT and audited against the existing set before shipping.
- **`.ki-config.toml` as a per-repo override layer.** _(candidate)_ `knowledgeislands-repo` introduced a shared, skill-sectioned `.ki-config.toml` (its
  `[knowledgeislands-repo]` table holds `visibility` + a `[…checks]` sub-table of per-repo check overrides). `knowledgeislands-kb` is now the **first consumer
  beyond `-repo`**: its `[knowledgeislands-kb.zones]` zone-alias lets a base mid-rename declare a local folder name (`Pillars = "Matters"`) as a reviewable
  override rather than a model fork. The same file could let **any** KI skill take per-repo overrides under its own `[<skill>]` table — tuning a rubric
  criterion, opting a check up or down, or extending a default (e.g. extra topics) for one repo — making it the single place a repo declares how the house
  standards apply to it. Needs a convention for what's overridable vs fixed, and each consuming skill emitting its default keys (the repo `--init` pattern) so
  the options are authored, not implicit.
