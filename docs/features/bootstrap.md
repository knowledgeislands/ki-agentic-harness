# Bootstrap — `BOOT`

The behaviour of the bootstrap chain: how the harness brings a target repo under governance so it governs itself. Part of the Feature Definitions corpus; see [index.md](index.md).

> **Status:** as-built baseline, behaviour-level.

## Self-sufficiency

### BOOT-001 — Self-governing after EDUCATE

After the EDUCATE chain runs against a target repo, that repo MUST govern itself with `./.ki/bin/ki-audit` and **zero** Knowledge Islands skills installed — and with **no `package.json` of its own** — per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md).

_Verify:_ bootstrap a bare fixture (`.ki-config.toml` only, no `package.json`, no `.claude/skills/`) with `skills/keystone/ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts <fixture>`, then run `./.ki/bin/ki-audit` in it — the vendored checkers execute and report.

### BOOT-002 — Vendored copies, not symlinks

EDUCATE MUST vendor each resolved skill's checker (and any `conform-*.ts`) into the target's `.ki/bootstrap/checkers/<skill>/` as file **copies**, never symlinks, so they run with no harness beside the repo (SCRIPT-7 / [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md)).

_Verify:_ after bootstrap, `.ki/bootstrap/checkers/ki-repo/scripts/govern.ts` in the target is a regular file whose contents equal the harness source, and `git check-ignore` does not ignore it.

### BOOT-003 — Explicit declared skill coverage

The resolved skill set MUST contain exactly the governance skills declared by `[ki-<skill>]` tables in the target's `.ki-config.toml`, plus any explicit `--seed` required to bootstrap a fresh target, per [ADR-KI-HARNESS-SKILLS-006](../decisions/ADR-KI-HARNESS-SKILLS-006-six-cluster-skill-taxonomy-and-the-implication-graph.md).

Every selected skill's `ki-depends-on:` entries MUST be declared explicitly in that same configuration; bootstrap fails before mutation when one is absent.

_Verify:_ a target declaring `ki-website` also explicitly declares `ki-website-cloudflare`; a missing table fails before `repo-bootstrap.ts` writes.

### BOOT-004 — Repo-wide aggregates

EDUCATE MUST vendor a `.ki/bin/aggregate.ts` runner that discovers the vendored checkers on the filesystem (no `package.json` read) and fans out over them for a given verb, so the aggregate stays correct as skills are vendored in or out. It validates every canonical JSONL finding, then defaults its human output to FAIL/WARN/POLISH; `--reporter-levels=<levels>` changes only that presentation. The `package.json` convenience keys are explicitly OUT of `ki-bootstrap`'s scope — `ki-engineering` wires them later as sugar over this runner.

_Verify:_ a bootstrapped repo has `.ki/bin/aggregate.ts`; running `bun .ki/bin/aggregate.ts audit` invokes every vendored `ki:<skill>:audit` in sequence.

### BOOT-005 — package.json-free entry point

EDUCATE MUST write four executable wrappers `.ki/bin/{ki-audit,ki-conform,ki-educate,ki-help}` (each mode `0755`) over the vendored aggregate, so a repo with no `package.json` (dotfiles, KB, tap) governs itself through `./.ki/bin/ki-audit`, `./.ki/bin/ki-conform`, `./.ki/bin/ki-educate`, and `./.ki/bin/ki-help <skill>` alone, per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md). `ki-help` is pure bash over the vendored `help.md` snapshots, so it runs with no `bun`.

_Verify:_ after bootstrap, all four of `.ki/bin/{ki-audit,ki-conform,ki-educate,ki-help}` exist and are executable (mode `0755`), and `./.ki/bin/ki-help <skill>` prints its snapshot with `bun` off `PATH`.

## The chain

### BOOT-006 — Per-skill EDUCATE delegators

Every governance skill MUST own a `scripts/educate.ts` that delegates to the `ki-bootstrap` chain engine with itself as an explicit `--seed`, delegating by subprocess (composition), not by cross-skill import, per [ADR-KI-HARNESS-SKILLS-004](../decisions/ADR-KI-HARNESS-SKILLS-004-skills-must-be-valid-standalone.md).

_Verify:_ each `skills/*/scripts/educate.ts` execs `../../ki-bootstrap/scripts/internal/repo-bootstrap/repo-bootstrap.ts` and passes `--seed <its own name>`.

Re-running the idempotent bootstrap chain is the single update path — there are no aggressiveness flags; a re-run brings the target up to date.

### BOOT-007 — Vendored-set alignment check

The harness MUST be able to verify a target's `.ki/bootstrap/checkers/` matches the expected declared skill set (restricted to skills carrying a checker). It validates `ki-depends-on:` declarations against source SKILL.md frontmatter harness-side, because that graph is not part of a target's standalone payload. Missing dependencies are a FAIL before bootstrap mutation; checker-set drift is a WARN, reconciled by re-bootstrap. See [BOOT-9](../../skills/keystone/ki-bootstrap/references/rubric.md).

_Verify:_ `bun skills/keystone/ki-bootstrap/scripts/govern.ts audit <target>` reports PASS when `.ki/bootstrap/checkers/` equals the expected set, and WARNs (listing both directions) when a checker is stray-vendored or missing.

### BOOT-008 — Remote EDUCATE transport

The EDUCATE chain MUST be runnable on a machine carrying nothing but `bun` — via the POSIX-`sh` `repo-bootstrap.sh` entry point that fetches the repo tarball from `codeload.github.com` and execs the engine, and via a vendored `.ki/bin/ki-educate` wrapper that re-runs the same remote script — per [ADR-KI-HARNESS-006](../decisions/ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md).

_Verify:_ `skills/keystone/ki-bootstrap/scripts/repo-bootstrap.sh` line 1 is `#!/bin/sh` and its `codeload.github.com` fetch pipes into `lib/repo-bootstrap.ts`; a governed repo's `.ki/bin/ki-educate` re-invokes that script (never `bun run <raw-url>`, which Bun cannot execute over HTTP).

### BOOT-009 — Runtime publication follows the target type

Repository bootstrap MUST publish only declared runtime skill coverage. Ordinary repositories receive generated regular-file copies; a harness receives links from runtime skill locations to its own canonical source skills. A harness also links frontmatter-declared local `scripts/vendored/` payloads to their canonical providers. Vendored `.ki/` payloads always remain regular files.

_Verify:_ run `scripts/internal/repo-bootstrap/publish-project-skills.ts` against a declared ordinary-repository fixture and confirm each published runtime skill is a regular file. Run it against a harness fixture and confirm each declared runtime skill is a source link.

### BOOT-010 — CLEAN removes only proven generated state

The source-owned CLEAN entrypoint MUST remove `.ki/` only when its complete regular-file tree matches the hashed generation manifest, and remove only unchanged marker-owned regular runtime skill copies. It MUST preserve configuration, authored source, runtime links, agents, altered or unmarked payloads, and every unsafe or concurrent-mutated path.

_Verify:_ bootstrap a fixture, preview `scripts/clean.ts --dry-run`, run CLEAN, confirm generated metadata and ordinary runtime copies disappear, then re-run EDUCATE. Fixtures with altered payloads, explicit links, unfamiliar metadata, or an injected concurrent mutation remain preserved.
