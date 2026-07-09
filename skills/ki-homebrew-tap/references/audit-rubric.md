# Audit Rubric

Line-by-line pass/fail items for auditing a Knowledge Islands Homebrew tap against the [Homebrew tap standard](homebrew-tap-standard.md). Run [`../scripts/audit-homebrew-tap.ts`](../scripts/audit-homebrew-tap.ts) for the mechanical items (marked **[M]**), then judge the rest by reading (**[J]**).

Every **[M]** item maps to a check in the checker (SHAPE-9); the checker IDs below are the ones it emits. **[J]** items need a model — is the `test do` meaningful, does the formula install what it claims. Severity uses the shared ladder from `ki-engineering`'s [enforcement-framework.md](../../ki-engineering/references/enforcement-framework.md) §2: **FAIL** (not a tap), **WARN** (formula/shape divergence), **INFO/SKIP** (capability + config notes).

Because this skill **wraps Homebrew's external standard**, the deepest formula checks are delegated: when `brew` is on PATH the checker runs `brew audit --strict` + `brew style` and surfaces their findings (`TAP-BREW`). The rubric's own items are the tap-**shape** checks `brew` cannot make.

## Contents

- [Tap structure](#tap-structure)
- [Formula shape](#formula-shape)
- [Sourcing](#sourcing)
- [Discoverability](#discoverability)
- [Homebrew's own audit (delegated)](#homebrews-own-audit-delegated)
- [Config](#config)

## Tap structure

- [ ] [M] FAIL — `TAP-FORMULA-DIR`: `Formula/` exists and carries ≥ 1 `*.rb`. No `Formula/`, or an empty one → not a tap.
- [ ] [J] WARN — the repo is named `homebrew-<x>` (external Homebrew constraint; the skill governs shape, not name — flag only if a rename would break `brew tap`).

## Formula shape

_Per `Formula/*.rb`._

- [ ] [M] WARN — `TAP-CLASS`: contains `class <Camel> < Formula`.
- [ ] [M] WARN — `TAP-FIELDS`: has each of `desc`, `homepage`, `url`, `sha256`, `license`, a `def install`, and a `test do` block (one warn per missing field).
- [ ] [M] WARN — `TAP-DESC-STYLE`: `desc` value is ≤ 80 chars and does not start with "A "/"An "/"The " (Homebrew `brew style` rule, mirrored so it fires without `brew`).
- [ ] [J] WARN — the `test do` block exercises the **installed** binary (asserts on real `--version`/`--help` output), not a placeholder `assert true` / `system "true"`.
- [ ] [J] WARN — `def install` installs the artifact the tool actually ships (`bin.install "bin/<tool>"` matches the `tools-*` repo's `bin/`), not a guessed path.

## Sourcing

- [ ] [M] WARN — `TAP-URL-VERSIONED`: `url` is a tagged-release tarball (`/archive/refs/tags/` or `/releases/download/`), not a bare branch or HEAD.
- [ ] [J] WARN — the `sha256` matches the tarball at `url` (recompute if in doubt: `curl -sL <url> | shasum -a 256`) and the tag version matches `#{version}` used in `test do`.

## Discoverability

- [ ] [M] WARN — `TAP-README`: each formula name appears in `README.md` (the `## Formulae` table).
- [ ] [J] WARN — the README table's description and source-repo link for each formula are present and correct (the row is not a stale placeholder).

## Homebrew's own audit (delegated)

- [ ] [M] capability — `TAP-BREW`: when `brew` is on PATH, `brew style <formula>` and `brew audit --strict <formula>` run per formula; failures surface as WARN, a clean pass as INFO. When `brew` is absent, SKIP (the tap's `brew test-bot` CI is the backstop). A `brew` invocation error is caught and downgraded to SKIP, never a crash.
- [ ] [J] WARN — if `TAP-BREW` SKIPped (no local `brew`), confirm the tap carries a `.github/workflows/` `brew test-bot` job so the deep formula checks run somewhere.

## Config

- [ ] [M] WARN — `CONFIG`: `[ki-homebrew-tap]` table present in `.ki-config.toml`; keyless, validate-down (unknown keys WARNed). `[ki-repo]` should also be present (checked by `ki-repo`, not here).
