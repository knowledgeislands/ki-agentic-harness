# Compatible harness standard

The normative reference for a Knowledge Islands source harness and the verified compatible payload installed from it.

The [generated rubric](rubric.md) is the checkable publication of this standard. The [sources](sources.md) record its provenance, and the [exemplars](exemplars.md) show representative source and installed shapes.

## Contents

- [Source and installed boundaries](#source-and-installed-boundaries)
- [Capability publication](#capability-publication)
- [Source-harness layout](#source-harness-layout)
- [Skill capability identity](#skill-capability-identity)
- [Root orientation](#root-orientation)
- [Root roadmap](#root-roadmap)
- [Harness declaration](#harness-declaration)
- [Commit gate](#commit-gate)
- [Ownership boundaries](#ownership-boundaries)

## Source and installed boundaries

A **source harness** is one versioned repository that co-locates four agentic shelves:

| Directory    | Source concern                                            |
| ------------ | --------------------------------------------------------- |
| `skills/`    | Agent Skills, optionally grouped by semantic category     |
| `subagents/` | Agent definitions and their source organisation           |
| `evals/`     | Behavioural evaluation scenarios and results              |
| `hooks/`     | Runtime hook payloads and installation material           |

These shelves are authored and reviewed together, but not every shelf is part of the current installed payload.

A **compatible installed harness** is a verified regular-file payload acquired and registered by the `ki` host. The current payload contains `skills/`, `subagents/`, and `hooks/`. Evals remain a source-harness concern until the host publishes that capability kind. MCP servers are separate repositories and are not a harness capability kind.

The installed payload, not a checkout, runtime projection, cache, or repository-local `.ki/` directory, is the operation source. A nearby checkout never becomes authoritative because a name matches or a symlink points to it.

A source-harness audit proves only physical source layout and source capability identity. It cannot establish a verified installed payload, selected local-development source, runtime activation link, declared-capability resolution, component conformance, or executed runtime capability. Those evidence states are host-owned and must be reported separately as observed or unavailable.

The source repository therefore defines capability semantics and carries their source files. The `ki` host owns acquisition evidence, installation layout, registry state, runtime activation links, repository activation, public CLI grammar, generic rubric execution, reporting, transactions, migration, and support diagnostics.

## Capability publication

The collection pass requires every skill to carry a valid `ki-applicability` classification and publishes that classification for each capability. Every process is invocation-only, governance capabilities cannot be invocation-only, and `ki-repo` is the sole detector owner. For the source harness declaring `prefix = "ki"`, the complete baseline is exactly `ki-repo` and `ki-authoring`; its non-empty `ki-detects` registry must resolve every target and agree bidirectionally with all skills classified as detected. Other provider prefixes do not own baseline skills and are not required to republish the KI baseline or detector registry. Missing or contradictory applicability metadata makes publication unsafe rather than silently omitting a capability.

A compatible harness publishes typed capabilities. The current recognised capability kind is `skill`; the other source shelves reserve their kinds until host support lands.

The installed Harness identity derives from its verified `<owner>/<repository>` installation path. Its source declaration supplies one stable capability prefix. A valid local estate contains at most one installed Harness for each prefix, so repository capabilities use their names directly without a second qualified identity.

An installed skill's physical source directory and `SKILL.md` frontmatter are authoritative. A file does not become executable merely because it appears beneath the payload root. A governed skill contributes only its rubric definition, evidence builders, and declared safe repairs to the generic host.

Runtime activation is a separate managed projection. Only the host creates or verifies activation links to a verified installed source. A source-harness script must not install a harness, activate user or repository capabilities, or link runtime discovery directly to its checkout.

A populated skills shelf publishes one generated capability catalogue between the `ki-repo-harness:capability-catalogue:start` and `ki-repo-harness:capability-catalogue:end` markers in `skills/README.md`. The private harness context parses canonical `SKILL.md` YAML frontmatter and derives exact governance/process counts, source-domain groups, full descriptions, runtime-neutral argument hints, required dependencies, and runtime bindings. Per-skill dependency lists publish formal `ki-depends-on` facts; the catalogue itself carries no diagram.

AUDIT compares the marker-bounded bytes with the deterministic rendering. Missing, renamed, removed, or changed skills therefore stale the publication mechanically. CONFORM may add a missing generated section or replace one exact marker-bounded section while preserving authored content around it. It refuses malformed skill frontmatter, unknown dependencies, duplicate capability names, unsafe files, and missing, duplicate, partial, or reversed markers rather than guessing at a repair. `ki-skills` remains the owner of individual skill quality and frontmatter semantics; this standard uses those source facts only to publish the Harness inventory.

That split has a verification consequence worth stating. Editing a `SKILL.md` description is authoring against `ki-skills`, and an author who audits with `ki-skills` alone gets a clean pass over a catalogue their edit has just staled, because no skill-scoped gate but this one reads `skills/README.md`. A frontmatter change is therefore complete only when `ki repo conform --skill ki-repo-harness` has regenerated the catalogue and, where the skill diagrams apply, their sources, or a whole-repository `ki repo audit` has confirmed CAP-2 and CAP-4 still pass.

### Generated skill diagrams

A harness that adopts `ki-diagrams` also publishes a set of living Archify diagrams, each derived deterministically from canonical `SKILL.md` frontmatter: the skill map and one diagram per functional area. Each labels a skill by its full name, `ki-` prefix included, and draws its shape as one of four node types: governance that is `baseline`, `detected` or `declaration-only`, and `invocation-only` processes. The sublabel and legend use plain words for the four: always on, automatic, opt-in and command.

A functional area gathers the skills that serve one function, read from what each skill does and from the declared edges between skills, wherever their folders are. A small table in the generator, not `SKILL.md` frontmatter, holds the areas, because they are a reading aid for these diagrams rather than a published fact about a skill. An area may split into titled capability groups. A skill may serve more than one area; its first area in table order is its home. A test keeps every skill in at least one area, every listed skill real, and no skill in two groups of one area.

`docs/diagrams/skill-map.architecture.json` answers what the collection holds, where it lives and what it is for, and is the index to the functional-area diagrams. Each source concern under `skills/` is one region, ordered from the foundations through the lifecycle to the specialised concerns, and within a region governance that always applies comes first and processes last. The functional areas are overlaid in place: where a concern's skills have different homes, it nests a region per home area and group, titled `<Area> · <Group>`, and each sublabel names every area the skill serves, by a short name, before its shape word. The map draws no edges, so every skill appears on it whatever its relationships.

`docs/diagrams/skill-area-<area>.architecture.json` answers, for one functional area, what its skills rely on outside it and what relies on them. The area's skills, every one of them, sit in one region titled by the area, its capability groups nested inside it; the outside skills they rely on are grouped by home area and group in regions below it, and the outside skills that rely on them in regions above it. A member whose home is another area keeps only its edges within this area, so a skill that serves several areas does not dominate each of them; its home diagram draws the rest. A solid edge is a `ki-depends-on` entry and a dashed edge a `ki-optional-depends-on` entry, and every edge points downward from the dependent to its prerequisite, including an edge between two of the area's own skills, because `ki-skills` guarantees the declared graph is acyclic. Within the region, skills that outside skills rely on sit nearest the tier above and skills that rely on outside skills nearest the tier below. Edges are routed by Archify; the layout keeps them inside its showcase gates, while a crossing remains a readability matter for review. A single all-skills dependency graph is not published, because Kris Brown chose on 2026-10-14 to "retire the big skill graph and keep the area map as the index."

Nothing in any drawing is hand-placed, so a renamed or moved skill is repaired by regeneration rather than by editing coordinates.

AUDIT compares each committed source with its deterministic rendering, ignoring only the traced repository revision, and CONFORM rewrites a missing or stale source in full. The committed SVGs beside them are not compared here: finalizing at showcase quality and re-exporting it is the `ki-diagrams` refresh procedure, and that skill's manifest names the regeneration step. A harness that has not adopted `ki-diagrams` has none of these diagrams and the criterion does not apply.

The root `README.md` does not have to repeat a numeric skill summary. When it uses the recognised complete claim — total Agent Skills followed by governance and process counts — AUDIT compares all three values with the same canonical frontmatter inventory. CONFORM replaces only those three numeric tokens when exactly one complete claim is present and stale, preserving its links and surrounding authored prose. An absent claim is not applicable; incomplete or multiple numeric claims, unreadable source evidence, and malformed canonical frontmatter remain diagnostic because a safe replacement cannot be inferred.

## Source-harness layout

Every source harness has all four directories at its physical repository root, each with a physical `README.md` explaining its purpose and status:

```text
skills/       README.md
subagents/    README.md
evals/        README.md
hooks/        README.md
```

An empty shelf is valid. Its README distinguishes intentional reserved structure from accidental absence. MCP server source does not belong in a harness shelf; each server remains in its independently governed `mcp-*` repository.

The source root also contains physical `CLAUDE.md`, `ROADMAP.md`, and `.ki.toml` files. Symlinked, dangling, directory-valued, device, or unreadable evidence is unsafe and does not satisfy a physical-file or physical-directory requirement.

The source harness may have a `package.json` for its own development and verification. `ki:harness:eval` is this standard's exact source-harness evaluation claim: it runs `bun evals/harness.ts` and is neither an installation, activation, nor governance entry point. Other package-script ownership and complete-set validation belong to `ki-engineering`.

## Skill capability identity

Every discovered skill root beneath `skills/` contains `SKILL.md`, and its directory name exactly matches the `name:` frontmatter.

A source harness may group skill roots under semantic directories. Discovery therefore walks physical descendants of `skills/`, stops at a directory containing `SKILL.md`, and rejects unsafe or unreadable evidence rather than following it.

No two discovered skill roots in one source harness share a frontmatter name. The `ki-skills` skill governs every other aspect of skill quality.

Every discovered skill name begins with the declared Harness prefix followed by `-`. A Harness declaring `prefix = "ki"` therefore publishes `ki-*` skills; one declaring `prefix = "hnr"` publishes `hnr-*` skills. The host refuses a second installed Harness claiming an existing prefix rather than asking repositories to qualify one of two competing providers.

## Root orientation

The source-harness `CLAUDE.md` is its runtime-bound orientation. It:

1. explains what the source harness is and names all four shelves;
2. gives the current status of every shelf;
3. routes working conventions to the skill or document that owns each concern;
4. lists the direct `ki` audit, conform, and rubric-publication commands plus the repository test and TypeScript gates; and
5. keeps counts, statuses, payload boundaries, and command names current.

It must not present removed package aliases, repository-vendored runners, or checkout-dependent linkers as the public contract.

## Root roadmap

A source harness carries `ROADMAP.md` as its open-work register. The `ki-work-roadmap` skill owns roadmap profiles, horizon vocabulary, generated projections, and content discipline; this standard checks only the root file's physical presence.

## Harness declaration

The source root carries `.ki.toml` with `[skills.ki-repo-harness]` declaring the Harness's stable lowercase alphanumeric capability prefix. It also declares `[skills.ki-repo]`, and a populated skills shelf declares `[skills.ki-skills]`.

```toml
[skills.ki-repo-harness]
prefix = "ki"
```

The prefix is provider-authored metadata in the existing Harness-governance table, not a value inferred from repository identity or capability names. Changing it changes the published capability namespace and requires an explicit provider decision.

`ki-repo` separately owns the Capital's optional `territory_prefix` and territory-selection handle. The main KI Harness keeps its capability prefix `ki`, aligned with the Knowledge Islands territory handle. Specialist Harnesses retain their own provider prefix: sharing the Knowledge Islands territory does not require a Techné Harness to rename its capabilities to `ki`. Territory selection resolves a Capital and its declared members, never capability-name prefixes.

If a physical readable `.ki.toml` exists without `[skills.ki-repo-harness]`, CONFORM may append exactly one keyless marker while preserving all existing bytes apart from normalising the trailing newline before the append:

```toml
[skills.ki-repo-harness]
```

CONFORM does not invent a prefix, create a missing configuration, or replace or follow a symlink, directory, dangling link, special file, or unreadable path. The session coalesces repeated marker requests into one host-published proposal, but a newly appended keyless marker remains a failing declaration until the owner supplies its prefix. The host owns dry-run, transaction validation, atomic publication, rollback, and post-write re-audit.

## Commit gate

A source harness's committed `.githooks/pre-commit` is the canonical hook `ki-repo` composes for the harness shape, published with its `commit-msg` as worked examples under [`assets/githooks/`](../assets/githooks/), one pair with a `package.json` and one without; copy them exactly, since `ki-repo` HOOK-4 compares each hook byte for byte. It runs only check-only staged lints, `lint-staged` and the Syncpack check with a package and staged `rumdl check` without, and never `ki repo audit`, `ki repo conform`, `ki repo repair`, `--fix` or `--write` (`GATE-1`); the focused harness audit runs in CI, where it refuses a commit that breaks the harness's own container contract, as Kris chose COMMIT-VS-CI a) on 26 October 2026: "I think we just need to keep them simple". The whole-project type check and `ki-skills` audit remain manual and CI gates. The focused harness audit also enforces `GATE-2`: when the `.ki.toml` in the index declares `ki-diagrams`, it reads the manifest, sources, viewers and receipts directly from index blobs and checks the shared receipt contract; in CI the index is the commit under test. A stale source or viewer, changed or missing receipt, missing required source or viewer, malformed manifest, unsafe file or unreadable snapshot fails closed. Findings name staged diagram paths so the host's staged-path verdict filter cannot discard a receipt failure. A matching index snapshot passes even when unstaged working files differ. The host's `--staged` option scopes verdict paths, not evaluation bytes; `GATE-2` therefore gathers index evidence explicitly rather than treating working files as the snapshot. `ki-diagrams` owns the shared receipt reader; `ki-repo-harness` materialises its declared shared modules and owns this audit integration. Without a committed hook `GATE-1` is not applicable; `ki-repo` owns whether the hook exists, is bound and refuses when a tool it needs is missing ([ADR-KI-HARNESS-SKILLS-017](../../../../docs/decisions/ADR-KI-HARNESS-SKILLS-017-commit-gate-existence-and-content-are-owned-separately.md)). `GATE-1` reports as a warning until the hooks rollout completes.

## Ownership boundaries

This standard governs the source container and compatible-payload boundary. Content and runtime semantics remain with their specific owners:

| Concern                                      | Owner            |
| -------------------------------------------- | ---------------- |
| Skill quality                                | `ki-skills`      |
| Agent definition quality                     | `ki-subagents`   |
| MCP server code                              | `ki-repo-mcp`         |
| Repository roadmap content                   | `ki-work-roadmap`     |
| Engineering toolchain and package scripts    | `ki-engineering` |
| Repository declaration and GitHub settings   | `ki-repo`        |
| Harness install, activation, and CLI runtime | `tools-ki`       |

Selecting `ki-repo-harness` also selects its declared prerequisites: `ki-skills`, `ki-subagents`, `ki-decision-records`, and `ki-work-roadmap`. Coverage selects `ki-repo-mcp`, `ki-engineering`, and `ki-repo` separately when their concerns apply. This standard adds only the container and publication delta defined here.
