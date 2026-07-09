# Bootstrap — `BOOT`

The behaviour of the bootstrap chain: how the harness brings a target repo under governance so it governs itself. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Self-sufficiency

### BOOT-001 — Self-governing after INIT

After the INIT chain runs against a target repo, that repo MUST govern itself with `bun run ki:audit` and **zero** Knowledge Islands skills installed, per [ADR-KI-HARNESS-007](../decisions/ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md).

_Verify:_ bootstrap a bare fixture (`package.json` + `.ki-config.toml`, no `.claude/skills/`) with `skills/ki-bootstrap/scripts/bootstrap.ts <fixture>`, then run `bun run ki:audit` in it — the vendored checkers execute and report.

### BOOT-002 — Vendored copies, not symlinks

INIT MUST vendor each resolved skill's checker (and any `conform-*.ts`) into the target's `scripts/ki/<skill>/` as file **copies**, never symlinks, so they run with no harness beside the repo (SCRIPT-7 / [ADR-KI-HARNESS-007](../decisions/ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md)).

_Verify:_ after bootstrap, `scripts/ki/ki-repo/audit-repo.ts` in the target is a regular file whose contents equal the harness source, and `git check-ignore` does not ignore it.

### BOOT-003 — Implied-skill closure

The resolved skill set MUST be the transitive `implies:` closure of the baseline (`ki-repo`, `ki-authoring`) plus every `[ki-<skill>]` table declared in the target's `.ki-config.toml` (plus any explicit `--seed`), per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ seeding `ki-website` resolves a set that also contains `ki-website-cloudflare` (its `implies:`) and the baseline; observed in the `bootstrap.ts` dry-run output.

### BOOT-004 — Repo-wide aggregates

INIT MUST install (or refresh) the repo-wide `ki:audit`, `ki:conform`, and `ki:init` package.json scripts, each fanning out over the installed `ki:<skill>:<verb>` keys via a vendored `scripts/ki/aggregate.ts`, so the aggregates stay correct as skills are added.

_Verify:_ a bootstrapped `package.json` has `"ki:audit": "bun scripts/ki/aggregate.ts audit"`, and running it invokes every `ki:<skill>:audit` key in sequence.

## The chain

### BOOT-005 — Per-skill INIT delegators

Every governance skill MUST own a `scripts/bootstrap.ts` that delegates to the `ki-bootstrap` chain engine with itself as an explicit `--seed`, delegating by subprocess (composition), not by cross-skill import, per [ADR-KI-HARNESS-SKILLS-004](../decisions/ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md).

_Verify:_ each `skills/*/scripts/bootstrap.ts` execs `../../ki-bootstrap/scripts/bootstrap.ts` and passes `--seed <its own name>`.

### BOOT-006 — Aggressiveness flags

The chain MUST expose three strengths as flags over one engine, not a separate orchestrator: `--new` (default, INIT only), `--legacy` (INIT then a full `ki:conform`), and `--tracking` (INIT then `ki:audit`).

_Verify:_ `bootstrap.ts` `parseMode` maps `--legacy` to a post-conform pass and `--tracking` to a post-audit pass, with `--new` the default.

## Gaps

- Remote-run transport (`bun run <raw-github-url>`) is documented but not yet exercised by an automated test; the engine currently sources skills from the local working tree.
- No requirement yet covers the `--all` mode used by the harness itself (link/vendor every skill rather than a coverage subset).
