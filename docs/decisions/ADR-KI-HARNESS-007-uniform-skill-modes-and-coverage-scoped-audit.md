# ADR-KI-HARNESS-007: Uniform skill modes, bare mode scripts, and a coverage-scoped aggregate gate

**Date:** 2026-07-12

## Context

[ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-bootstrapping-and-self-sufficiency.md) established that bootstrap vendors each skill's mechanical unit into `.ki-meta/` and fans out over the four `ki-{audit,conform,educate,help}` bins. It left the per-skill surface under-specified, and the fleet drifted:

- Mode-script filenames redundantly repeated the skill name (`lint-agents.ts`, `audit-drs.ts`, `conform-cowork.ts`), and the `ki-vendors:` frontmatter took an ad-hoc `{ audit: …, conform: … }` map that let each skill diverge.
- The `package.json` key a checker mapped to was unenforced convention that had drifted (`ki:agents:lint` vs `ki:repo:audit`), and a whole toolchain namespace (`ki:lint:*`, `ki:deps:*`, `ki:knip`, the non-namespaced `ki:lint:md`) sat outside any per-skill mapping — the twin CANON family that [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-standard-toolchain.md) required byte-for-byte.
- Only about half the fleet shipped a `conform`, and `ki:audit` (the aggregate) was never a clean gate — the harness vendored **every** skill (`--all`), so the aggregate ran `ki-mcp` / `ki-website` / `ki-tools` audits against a repo that is none of those, producing a wall of non-applicable FAILs. The real gate was a hand-curated `ki:verify`.

## Decision

Every **governance** skill exposes exactly the four universal modes that map to ADR-006's four bins, through one uniform governed entrypoint — no per-skill override.

- **One governed entrypoint.** Every governance skill provides `scripts/govern.ts`, with programmatic `plan` and `check` exports and the `audit`/`conform` command surface; `scripts/educate.ts` remains the bootstrap seed delegator. `refresh` is never vendored (it edits the skill's own canonical files and only runs in the harness), and HELP remains a rendered `SKILL.md` snapshot.
- **Direct in-process aggregate.** The aggregate imports each vendored `scripts/govern.ts` and invokes its plan/check exports. It does not spawn a child process for AUDIT or CONFORM. The `lint` verb is retired.
- **Derived, enforced `package.json` keys.** Each coverage-scoped package key selects the vendored aggregate with `--skill`; `educate`/`help` run via the same aggregate. `ki-skills`' SHAPE-15 enforces the governed-entrypoint shape; `ki-engineering`'s audit enforces the derived keys and flags retired ones.
- **The toolchain collapses into audit/conform.** `ki-engineering`'s audit runs the whole read-only toolchain itself (Biome check + `tsc` + knip + syncpack); its conform runs the whole write toolchain (Biome/format write, syncpack format, knip `--fix`, dependency refresh). `ki-authoring` owns the Markdown gate (prettier `--check`/`--write` + markdownlint). The per-tool `ki:lint:*` / `ki:deps:*` / `ki:knip` families, the composed `ki:verify`, and the per-skill `ki:<x>:lint` are **retired** — the tools live inside the two skills' modes. Vitest is the recommended runner but not mandated: its key-shape + 100%-coverage checks apply only when a `vitest.config.*` is present, so a repo whose self-tests are standalone `*.test.ts` scripts (run via the bare `test` idiom) conforms.
- **The aggregate `ki:audit` is coverage-scoped and IS the gate.** A repo vendors — and therefore self-audits — only the skills its `.ki-config.toml` explicitly declares. Each selected skill's `ki-depends-on:` requirements must be declared too; they are validated rather than expanded. This holds for the harness too: it **links** every skill (`--all`) for in-session authoring, but **vendors** only its declared coverage. `ki:verify` is retired; CI runs `bun run ki:audit && bun run test`.

## Consequences

- The per-skill surface is uniform and mechanically checkable end to end: one `govern.ts`, one educator, and derived package keys, all cross-checked by SHAPE-15 and the engineering key audit. Adding a governance skill means providing `govern.ts` and `educate.ts`; the bins follow by derivation.
- `package.json` is focused on the **vendored** set, not the symlinked one. The harness's keys track its 12-skill coverage, not the 24 skills it links for authoring.
- An audit must NA-skip when pointed at a repo it doesn't govern. `ki-engineering` (no `package.json`), `ki-website-cloudflare` (no `wrangler`), `ki-feature-definitions` (no `docs/features`), and `ki-repo-roadmap` (Knowledge Base `repo_type`) do; the remaining artifact audits (`ki-mcp`, `ki-website`, `ki-tools`, `ki-kb`, `ki-plugins`, `ki-homebrew-tap`) still FAIL on a mismatch. Coverage-scoping hides that on repos that don't declare them, but making every audit NA-skip on its own applicability signal — so `ki:audit` is a genuine universal gate, not merely a coverage-filtered one — is tracked on the ROADMAP.
- This amends [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-standard-toolchain.md): the required-toolchain contract stands, but its interface is `ki-engineering`'s audit/conform, not the retired `ki:lint:*` / `ki:deps:*` key families. Generated/vendored trees stay excluded from the linters ([ADR-KI-HARNESS-TOOLCHAIN-005](ADR-KI-HARNESS-TOOLCHAIN-005-generated-code-excluded-from-lint-and-knip.md)); this migration extends that exclusion to markdownlint (`.ki-meta/**`, `.claude/**`).
