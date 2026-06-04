# arcadia-skills roadmap

Where this skill collection is going. The [README](README.md) covers what exists today and how to install it; this file is the forward view. Items are grouped
by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it lands here before it's
built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`skills:lint`, `repo:audit`, `kb:audit`, the `knowledgeislands-mcp` audit over the
`mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the monthly `knowledgeislands-skills-refresh` are ongoing
disciplines tied to the invariants in the README's _Principles across the set_ — they run continuously, so they live there, not here.

## Later

- **`.ki-config.toml` as a per-repo override layer.** _(candidate)_ The shared, skill-sectioned `.ki-config.toml` (contract owned by `knowledgeislands-repo`)
  now has **two consumers beyond `-repo`'s own `visibility` + `[…checks]`**: `knowledgeislands-kb` reads both a `[knowledgeislands-kb.zones]` alias (a base
  mid-rename declares a local folder name) and a `required_frontmatter` array (the base declares the frontmatter keys its notes must carry, which the checker
  then enforces mechanically). That establishes the pattern — a skill takes per-repo/per-base declarations under its own `[<skill>]` table, validating down and
  ignoring across. The remaining work is to **generalise it**: a stated convention for what's overridable vs fixed, and each consuming skill emitting its
  default keys (the `--init` pattern `-repo`, `-kb`, and `-streams` all follow) so the options are authored, not implicit. **The third consumer has now
  arrived:** `knowledgeislands-streams` reads its own `[knowledgeislands-streams]` table (`process_note`, `note_type_scheme`) and the
  `[knowledgeislands-kb.zones]` alias — so the pattern has three consumers (repo, kb, streams) and the generalisation is now warranted rather than speculative.
  Next step: write the shared contract up (overridable-vs-fixed, the `--init` self-documentation rule) in the `knowledgeislands-repo` `.ki-config.toml`
  reference.

- **Dependabot — two open follow-ups.** _(candidate)_ The Layer-3 baseline is in place (alerts + security updates + `allow_update_branch`, all governed). Two
  threads remain. (a) **Bun ecosystem rollout.** Our repos are Bun projects (`bun.lock`), but their `dependabot.yml` declares `package-ecosystem: npm`, which
  never updates the lockfile; Dependabot now supports a dedicated `bun` ecosystem (Bun ≥ 1.1.39, version updates only — security updates stay repo-level). A
  both-ecosystems config is under test on **mcp-kb-fs only**; once its PRs are observed (watch for npm/bun duplicate version PRs), decide npm-vs-bun-vs-both and
  roll the chosen `dependabot.yml` to the other six mcp repos. (b) **Safe auto-merge.** Every mcp repo ships a `dependabot-auto-merge.yml` that is currently
  **inert** — `allow_auto_merge` is off and `main` is unprotected, so `gh pr merge --auto` has no required check to gate on. Making it safe means protecting
  `main` with the required `build` check (the `branch-protection` override, deliberately OFF today so `main` stays open) **and** enabling `allow_auto_merge` — a
  real shift in the push workflow (maintainers via PRs too). Deferred pending that posture decision; the alternative is to drop the inert workflow or rework it
  into a CI-gated merge that needs no branch protection.
