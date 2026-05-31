# arcadia-skills roadmap

Where this skill collection is going. The [README](README.md) covers what exists today and how to install it; this file is the forward view — what's next and
why. Items are grouped **Next / Soon / Later** by confidence, not by date; speculative items are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's
built.

The standing principles every skill upholds — a refresh path and cadence, no silent collisions, standard vs base-coupled extension, and one governance-mode
model — are present-tense invariants, not roadmap items, so they live in the [README](README.md) under _Principles across the set_. Several entries below exist
to serve them (the monthly refresh routine, the eval harness).

## Next

- **Scaffold and validate kb's `[knowledgeislands-kb]` config table.** Binding kb to its first bases gave it a `.ki-config.toml` table — a
  `[knowledgeislands-kb.zones]` zone-alias for a base mid-rename (the live case: `kit-legal` holding its Pillars zone under the legacy `Matters/`). The skill
  documents the keys but has no scaffolding or validation yet. Give it the repo `--init` pattern (emit its default keys) and the validate-down check (warn on an
  unrecognised key under its own table, never read another skill's), per the `.ki-config.toml` contract. This is the first cross-skill use of that override
  layer (see _Later_).

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
  `[knowledgeislands-repo]` table holds `visibility` + a `[…checks]` sub-table of per-repo check overrides). `knowledgeislands-kb` is now the **first consumer
  beyond `-repo`**: its `[knowledgeislands-kb.zones]` zone-alias lets a base mid-rename declare a local folder name (`Pillars = "Matters"`) as a reviewable
  override rather than a model fork. The same file could let **any** KI skill take per-repo overrides under its own `[<skill>]` table — tuning a rubric
  criterion, opting a check up or down, or extending a default (e.g. extra topics) for one repo — making it the single place a repo declares how the house
  standards apply to it. Needs a convention for what's overridable vs fixed, and each consuming skill emitting its default keys (the repo `--init` pattern) so
  the options are authored, not implicit — the near-term step is in _Next_.
