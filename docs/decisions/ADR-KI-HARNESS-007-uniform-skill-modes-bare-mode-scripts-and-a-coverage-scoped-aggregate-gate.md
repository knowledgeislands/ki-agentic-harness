---
id: ADR-KI-HARNESS-007
title: 'Uniform skill modes, bare mode scripts, and a coverage-scoped aggregate gate'
date: 2026-07-12
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-007: Uniform skill modes, bare mode scripts, and a coverage-scoped aggregate gate

## Context

[ADR-KI-HARNESS-006](ADR-KI-HARNESS-006-user-installation-repository-bootstrap-and-self-sufficiency.md) establishes separate user installation and repository activation. The legacy bootstrap implementation copied each skill's mechanical unit into `.ki` and fanned out over aggregate runners, but that executor cannot remain the public operation surface. The fleet had also drifted:

- Mode-script filenames redundantly repeated the skill name (`lint-agents.ts`, `audit-drs.ts`, `conform-cowork.ts`), and the `ki-vendors:` frontmatter took an ad-hoc `{ audit: …, conform: … }` map that let each skill diverge.
- The `package.json` key a checker mapped to was unenforced convention that had drifted (`ki:agents:lint` vs `ki:repo:audit`), and a whole toolchain namespace (`ki:lint:*`, `ki:deps:*`, `ki:knip`, the non-namespaced `ki:lint:md`) sat outside any per-skill mapping — the twin CANON family that [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-bun-biome-and-knip-standard-toolchain.md) required byte-for-byte.
- Only about half the fleet shipped a `conform`, and `ki:audit` (the aggregate) was never a clean gate — the harness vendored **every** skill (`--all`), so the aggregate ran `ki-mcp` / `ki-website` / `ki-tools` audits against a repo that is none of those, producing a wall of non-applicable FAILs. The real gate was a hand-curated `ki:verify`.

## Decision

Every **governance** skill exposes exactly the four universal modes through one uniform native-operation registration — no per-skill override.

- **One native operation registration.** Every governance skill registers compatible operation metadata and in-process implementations for its mechanical modes. `ki` hosts the public `audit` and `conform` operations; REFRESH remains collection-authoring work, and HELP remains skill documentation rather than a generated repository runner.
- **Native in-process resolution.** `ki` resolves the selected repository's declared skills and explicit dependencies from verified installed compatible harnesses, orders their registered operations, and reports results through one shared model. It neither spawns a child process nor imports a vendored `govern.ts`; the `lint` verb is retired.
- **No generated aggregate aliases.** The generated `.ki/bin` runners, repository manifest, and package-script aliases to them are retired. A package script can invoke a native `ki repo` command as a local convenience, but it is not part of the governance contract.
- **The toolchain collapses into audit/conform.** `ki-engineering`'s audit runs the whole read-only toolchain itself (Biome check + `tsc` + knip + syncpack); its conform runs the whole write toolchain (Biome/format write, syncpack format, knip `--fix`, dependency refresh). `ki-authoring` owns the Markdown gate (prettier `--check`/`--write` + markdownlint). The per-tool `ki:lint:*` / `ki:deps:*` / `ki:knip` families, the composed `ki:verify`, and the per-skill `ki:<x>:lint` are **retired** — the tools live inside the two skills' modes. Vitest is the recommended runner but not mandated: its key-shape + 100%-coverage checks apply only when a `vitest.config.*` is present, so a repo whose self-tests are standalone `*.test.ts` scripts (run via the bare `test` idiom) conforms.
- **Native repository audit is coverage-scoped and is the gate.** A repository declares only the skills its `.ki-config.toml` covers. Each selected skill's explicit dependencies must be declared too; `ki` validates rather than silently expanding them. CI establishes the verified compatible harnesses and runs native repository audit alongside the repository's tests.

## Consequences

- The per-skill surface is uniform and mechanically checkable end to end: each governance skill supplies registered native operations with compatible metadata, and the compatible harness validates their shape. Adding a governance skill means supplying those operations; native ordering follows the declared dependency graph.
- `package.json` is outside the operation contract. Repository coverage is declared in `.ki-config.toml`, and runtime discovery links are activation state rather than an executor or a source of coverage.
- An audit must NA-skip when pointed at a repo it doesn't govern. `ki-engineering` (no `package.json`), `ki-website-cloudflare` (no `wrangler`), `ki-feature-definitions` (no `docs/features`), and `ki-repo-roadmap` (Knowledge Base `repo_type`) do; the remaining artifact audits (`ki-mcp`, `ki-website`, `ki-tools`, `ki-kb`, `ki-plugins`, `ki-homebrew-tap`) still FAIL on a mismatch. Coverage-scoping hides that on repos that don't declare them, but making every audit NA-skip on its own applicability signal — so `ki:audit` is a genuine universal gate, not merely a coverage-filtered one — is tracked on the ROADMAP.
- This amends [ADR-KI-HARNESS-TOOLCHAIN-001](ADR-KI-HARNESS-TOOLCHAIN-001-bun-biome-and-knip-standard-toolchain.md): the required-toolchain contract stands, but its interface is the registered `ki-engineering` audit/conform operations, not the retired `ki:lint:*` / `ki:deps:*` key families. The current vendored trees are legacy migration state, not a lasting lint or execution boundary.
