# Bootstrap — `BOOT`

The behaviour of the bootstrap chain: how the harness brings a target repo under governance so it governs itself. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Self-sufficiency

### BOOT-001 — Self-governing after EDUCATE

After the EDUCATE chain runs against a target repo, that repo MUST govern itself with `./.ki-meta/bin/ki-audit` and **zero** Knowledge Islands skills installed — and with **no `package.json` of its own** — per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md).

_Verify:_ bootstrap a bare fixture (`.ki-config.toml` only, no `package.json`, no `.claude/skills/`) with `skills/keystone/ki-bootstrap/scripts/lib/repo-bootstrap.ts <fixture>`, then run `./.ki-meta/bin/ki-audit` in it — the vendored checkers execute and report.

### BOOT-002 — Vendored copies, not symlinks

EDUCATE MUST vendor each resolved skill's checker (and any `conform-*.ts`) into the target's `.ki-meta/checkers/<skill>/` as file **copies**, never symlinks, so they run with no harness beside the repo (SCRIPT-7 / [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md)).

_Verify:_ after bootstrap, `.ki-meta/checkers/ki-repo/scripts/audit.ts` in the target is a regular file whose contents equal the harness source, and `git check-ignore` does not ignore it.

### BOOT-003 — Implied-skill closure

The resolved skill set MUST be the transitive `implies:` closure of the baseline (`ki-repo`, `ki-authoring`) plus every `[ki-<skill>]` table declared in the target's `.ki-config.toml` (plus any explicit `--seed`), per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-skill-taxonomy-and-implication-graph.md).

_Verify:_ seeding `ki-website` resolves a set that also contains `ki-website-cloudflare` (its `implies:`) and the baseline; observed in the `repo-bootstrap.ts` dry-run output.

### BOOT-004 — Repo-wide aggregates

EDUCATE MUST vendor a `.ki-meta/bin/aggregate.ts` runner that discovers the vendored checkers on the filesystem (no `package.json` read) and fans out over them for a given verb, so the aggregate stays correct as skills are vendored in or out. It validates every canonical JSONL finding, then defaults its human output to FAIL/WARN/POLISH; `--reporter-levels=<levels>` changes only that presentation. The `package.json` convenience keys are explicitly OUT of `ki-bootstrap`'s scope — `ki-engineering` wires them later as sugar over this runner.

_Verify:_ a bootstrapped repo has `.ki-meta/bin/aggregate.ts`; running `bun .ki-meta/bin/aggregate.ts audit` invokes every vendored `ki:<skill>:audit` in sequence.

### BOOT-005 — package.json-free entry point

EDUCATE MUST write four executable wrappers `.ki-meta/bin/{ki-audit,ki-conform,ki-educate,ki-help}` (each mode `0755`) over the vendored aggregate, so a repo with no `package.json` (dotfiles, KB, tap) governs itself through `./.ki-meta/bin/ki-audit`, `./.ki-meta/bin/ki-conform`, `./.ki-meta/bin/ki-educate`, and `./.ki-meta/bin/ki-help <skill>` alone, per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md). `ki-help` is pure bash over the vendored `help.md` snapshots, so it runs with no `bun`.

_Verify:_ after bootstrap, all four of `.ki-meta/bin/{ki-audit,ki-conform,ki-educate,ki-help}` exist and are executable (mode `0755`), and `./.ki-meta/bin/ki-help <skill>` prints its snapshot with `bun` off `PATH`.

## The chain

### BOOT-006 — Per-skill EDUCATE delegators

Every governance skill MUST own a `scripts/educate.ts` that delegates to the `ki-bootstrap` chain engine with itself as an explicit `--seed`, delegating by subprocess (composition), not by cross-skill import, per [ADR-KI-HARNESS-SKILLS-004](../decisions/ADR-KI-HARNESS-SKILLS-004-skills-valid-standalone.md).

_Verify:_ each `skills/*/scripts/educate.ts` execs `../../ki-bootstrap/scripts/lib/repo-bootstrap.ts` and passes `--seed <its own name>`.

Re-running the idempotent bootstrap chain is the single update path — there are no aggressiveness flags; a re-run brings the target up to date.

### BOOT-007 — Vendored-set alignment check

The harness MUST be able to verify a target's `.ki-meta/checkers/` matches the expected resolved set (baseline ∪ declared `[ki-*]` tables ∪ the transitive `implies:` closure, restricted to skills carrying a checker) — since the `implies:` graph lives only in source SKILL.md frontmatter, this check runs harness-side, not from the target's own standalone `.ki-meta/bin/ki-audit`. Drift is a WARN, never a FAIL — a re-bootstrap always reconciles it. See [BOOT-9](../../skills/keystone/ki-bootstrap/references/rubric.md).

_Verify:_ `bun skills/keystone/ki-bootstrap/scripts/audit.ts <target>` reports PASS when `.ki-meta/checkers/` equals the expected set, and WARNs (listing both directions) when a checker is stray-vendored or missing.

### BOOT-008 — Remote EDUCATE transport

The EDUCATE chain MUST be runnable on a machine carrying nothing but `bun` — via the POSIX-`sh` `repo-bootstrap.sh` entry point that fetches the repo tarball from `codeload.github.com` and execs the engine, and via a vendored `.ki-meta/bin/ki-educate` wrapper that re-runs the same remote script — per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md).

_Verify:_ `skills/keystone/ki-bootstrap/scripts/repo-bootstrap.sh` line 1 is `#!/bin/sh` and its `codeload.github.com` fetch pipes into `lib/repo-bootstrap.ts`; a governed repo's `.ki-meta/bin/ki-educate` re-invokes that script (never `bun run <raw-url>`, which Bun cannot execute over HTTP).

### BOOT-009 — Normal runtime publication uses copies

Repository bootstrap MUST publish only the declared runtime skill coverage as generated regular-file copies; it MUST NOT create runtime symlinks. Deliberate local-development links are a separate `ki-repo` capability and are never required for normal user installation or repository governance.

_Verify:_ run `scripts/lib/publish-project-skills.ts` against a declared fixture and confirm each published runtime skill is a regular file. Run `ki-repo/scripts/link-repository-commands.ts <fixture> --development` separately and confirm only that explicit command creates a symlink.
