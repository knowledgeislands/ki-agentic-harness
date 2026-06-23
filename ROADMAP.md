# arcadia-agentic-harness roadmap

Where this agentic harness is going. The [README](README.md) and the [docs/](docs/) it indexes cover what exists today and how to install
it; this file is the forward view. Items are grouped by confidence; speculative ones are marked _(candidate)_ until committed.

This roadmap is itself subject to the house discipline it describes: when a skill's REFRESH run or an audit surfaces a structural gap, it
lands here before it's built — and an item is **removed once done**, not ticked off, so the file always shows only open work.

**Continuous practices are not roadmap items.** Keeping the skills audited (`skills:lint`, `repo:audit`, `kb:audit`, the
`knowledgeislands-mcp` audit over the `mcp-*` repos), re-running the advisory [eval suite](evals/README.md) as skills change, and the
scheduled `knowledgeislands-skills-refresh` sweep (which honours each skill's declared `**Refresh:**` cadence) are ongoing disciplines tied
to the invariants in [docs/design.md](docs/design.md) (_Principles across the set_) — they run continuously, so they live there, not here.

## Later

- **Adopt `knowledgeislands-tokenomics` across environments.** All three environments opted in (harness, `arcadia-principal`,
  `arcadia-website`); each AUDIT runs 0 FAIL. Remaining open work: (a) decide on MCP server scoping — 15 of the 19 user-scoped servers are
  project-specific KB FS instances (`hnr-*`, `kit-hnr-*`, `kit-legal-*`, `kit-pkb-*`, `kit-principal-*`, `mcp-kb-*`, `mcp-m365-*`,
  `vallearmonia-*`) that could move to project-local `.mcp.json` files, leaving only the 4 genuinely cross-context servers
  (`kit-mcp-git-audit`, `kit-mcp-gmail`, `kit-mcp-claude-housekeeping`, `kit-mcp-voicenotes-edit`) plus the arcadia KB FS pair globally.

- **Conform the website repos to the new standards.** The `knowledgeislands-11ty-websites` and `knowledgeislands-cloudflare-hosting` skills
  now exist (extracted from `kit-midnight.ninja` + `vallearmonia-website`, the `dist/` folder the seam between them), but their target repos
  are not yet brought into line. Open work, by repo: add the `[knowledgeislands-11ty-websites]` / `[knowledgeislands-cloudflare-hosting]`
  opt-in tables to each site's `.ki-config.toml`; **CONFORM `arcadia-website`** (very old — a skeletal `src/` with no `tokens.css`,
  `_includes/{layouts,partials}/`, or `seo-meta` partial) up to the build standard; add `kit-midnight.ninja`'s **missing
  `site/wrangler.jsonc`** so `site:deploy` works. Dogfooding the skills against their own corpus. (Adding the opt-in tables is the one new
  `.ki-config.toml` consumer pair beyond those listed below.)

- **Dependabot — two open follow-ups.** _(candidate)_ The Layer-3 baseline is in place (alerts + security updates + `allow_update_branch`,
  all governed). Two threads remain. (a) **Bun ecosystem rollout.** Our repos are Bun projects (`bun.lock`), but their `dependabot.yml`
  declares `package-ecosystem: npm`, which never updates the lockfile; Dependabot now supports a dedicated `bun` ecosystem (Bun ≥ 1.1.39,
  version updates only — security updates stay repo-level). A both-ecosystems config is under test on **mcp-kb-fs only**; once its PRs are
  observed (watch for npm/bun duplicate version PRs), decide npm-vs-bun-vs-both and roll the chosen `dependabot.yml` to the other six mcp
  repos. (b) **Safe auto-merge.** Every mcp repo ships a `dependabot-auto-merge.yml` that is currently **inert** — `allow_auto_merge` is off
  and `main` is unprotected, so `gh pr merge --auto` has no required check to gate on. Making it safe means protecting `main` with the
  required `build` check (the `branch-protection` override, deliberately OFF today so `main` stays open) **and** enabling `allow_auto_merge`
  — a real shift in the push workflow (maintainers via PRs too). Deferred pending that posture decision; the alternative is to drop the
  inert workflow or rework it into a CI-gated merge that needs no branch protection.
