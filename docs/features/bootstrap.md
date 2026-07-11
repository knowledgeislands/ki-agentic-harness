# Bootstrap — `BOOT`

The behaviour of the bootstrap chain: how the harness brings a target repo under governance so it governs itself. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Self-sufficiency

### BOOT-001 — Self-governing after INIT

After the INIT chain runs against a target repo, that repo MUST govern itself with `./.ki-meta/bin/ki-audit` and **zero** Knowledge Islands skills installed — and with **no `package.json` of its own** — per [ADR-KI-HARNESS-007](../decisions/ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md).

_Verify:_ bootstrap a bare fixture (`.ki-config.toml` only, no `package.json`, no `.claude/skills/`) with `skills/ki-bootstrap/scripts/bootstrap.ts <fixture>`, then run `./.ki-meta/bin/ki-audit` in it — the vendored checkers execute and report.

### BOOT-002 — Vendored copies, not symlinks

INIT MUST vendor each resolved skill's checker (and any `conform-*.ts`) into the target's `.ki-meta/skills/<skill>/` as file **copies**, never symlinks, so they run with no harness beside the repo (SCRIPT-7 / [ADR-KI-HARNESS-007](../decisions/ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md)).

_Verify:_ after bootstrap, `.ki-meta/skills/ki-repo/audit.ts` in the target is a regular file whose contents equal the harness source, and `git check-ignore` does not ignore it.

### BOOT-003 — Implied-skill closure

The resolved skill set MUST be the transitive `implies:` closure of the baseline (`ki-repo`, `ki-authoring`) plus every `[ki-<skill>]` table declared in the target's `.ki-config.toml` (plus any explicit `--seed`), per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ seeding `ki-website` resolves a set that also contains `ki-website-cloudflare` (its `implies:`) and the baseline; observed in the `bootstrap.ts` dry-run output.

### BOOT-004 — Repo-wide aggregates

INIT MUST vendor a `.ki-meta/bin/aggregate.ts` runner that discovers the vendored checkers on the filesystem (no `package.json` read) and fans out over them for a given verb, so the aggregate stays correct as skills are vendored in or out. The `package.json` convenience keys are explicitly OUT of `ki-bootstrap`'s scope — `ki-engineering` wires them later as sugar over this runner.

_Verify:_ a bootstrapped repo has `.ki-meta/bin/aggregate.ts`; running `bun .ki-meta/bin/aggregate.ts audit` invokes every vendored `ki:<skill>:audit` in sequence.

### BOOT-007 — package.json-free entry point

INIT MUST write four executable wrappers `.ki-meta/bin/{ki-audit,ki-conform,ki-init,ki-help}` (each mode `0755`) over the vendored aggregate, so a repo with no `package.json` (dotfiles, KB, tap) governs itself through `./.ki-meta/bin/ki-audit`, `./.ki-meta/bin/ki-conform`, `./.ki-meta/bin/ki-init`, and `./.ki-meta/bin/ki-help <skill>` alone, per [ADR-KI-HARNESS-007](../decisions/ADR-KI-HARNESS-007-bootstrapping-and-self-sufficiency.md). `ki-help` is pure bash over the vendored `help.md` snapshots, so it runs with no `bun`.

_Verify:_ after bootstrap, all four of `.ki-meta/bin/{ki-audit,ki-conform,ki-init,ki-help}` exist and are executable (mode `0755`), and `./.ki-meta/bin/ki-help <skill>` prints its snapshot with `bun` off `PATH`.

## The chain

### BOOT-005 — Per-skill INIT delegators

Every governance skill MUST own a `scripts/init.ts` that delegates to the `ki-bootstrap` chain engine with itself as an explicit `--seed`, delegating by subprocess (composition), not by cross-skill import, per [ADR-KI-HARNESS-SKILLS-004](../decisions/ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md).

_Verify:_ each `skills/*/scripts/init.ts` execs `../../ki-bootstrap/scripts/bootstrap.ts` and passes `--seed <its own name>`.

Re-running the idempotent bootstrap chain is the single update path — there are no aggressiveness flags; a re-run brings the target up to date.

### BOOT-008 — Vendored-set alignment check

The harness MUST be able to verify a target's `.ki-meta/skills/` matches the expected resolved set (baseline ∪ declared `[ki-*]` tables ∪ the transitive `implies:` closure, restricted to skills carrying a checker) — since the `implies:` graph lives only in source SKILL.md frontmatter, this check runs harness-side, not from the target's own standalone `.ki-meta/bin/ki-audit`. Drift is a WARN, never a FAIL — a re-bootstrap always reconciles it. See [BOOT-9](../../skills/ki-bootstrap/references/audit-rubric.md).

_Verify:_ `bun skills/ki-bootstrap/scripts/audit-vendored.ts <target>` reports PASS when `.ki-meta/skills/` equals the expected set, and WARNs (listing both directions) when a skill is stray-vendored or missing.

## Gaps

- Remote-run transport (the `curl | bash` one-liner over `bootstrap.sh`, and the vendored `ki-init` wrapper that pipes the same script) is documented but not yet exercised by an automated test. The original `bun run <raw-github-url>` form was falsified in the field (Bun cannot execute a module over HTTP) and replaced by the tarball-fetching shell entry point; the engine always sources skills from its own working tree.
- No requirement yet covers the `--all` mode used by the harness itself (link/vendor every skill rather than a coverage subset).
