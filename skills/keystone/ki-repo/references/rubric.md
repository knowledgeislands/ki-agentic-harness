<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — Knowledge Islands repositories

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `scripts/rubric/publish.ts`.

## Contents

- [FILES — Repository files](#files--repository-files)
- [GH — Core GitHub settings](#gh--core-github-settings)
- [PKG — Package metadata](#pkg--package-metadata)
- [MERGE — Merge policy](#merge--merge-policy)
- [TOGGLE — Repository features](#toggle--repository-features)
- [VIS — Visibility](#vis--visibility)
- [TOPICS — Topics](#topics--topics)
- [BP — Branch protection](#bp--branch-protection)
- [DEP — Dependency security](#dep--dependency-security)
- [SEC — Secret protection](#sec--secret-protection)
- [ACT — Actions policy](#act--actions-policy)
- [CHECKS — Check overrides](#checks--check-overrides)
- [COV — Governance coverage](#cov--governance-coverage)
- [STRUCT — Repository structure](#struct--repository-structure)
- [VENDOR — Vendor integrity](#vendor--vendor-integrity)
- [CAPABILITY — Capability publication](#capability--capability-publication)
- [ACCESS — Repository access](#access--repository-access)
- [RUNTIMES — Runtime support](#runtimes--runtime-support)
- [DESCFIT — Description fitness](#descfit--description-fitness)
- [OVR — Override rationale](#ovr--override-rationale)
- [SYNC — Standard synchronisation](#sync--standard-synchronisation)
- [WORK — Working areas](#work--working-areas)

## FILES — Repository files

→ [standard](standards.md)

Required local files and repository document quality.

- **FILES-1 [M] — Required repository files** — README, license, gitignore, editor configuration, Claude orientation, and the exact ki-repo config marker are present. (standards.md)
- **FILES-2 [M] — Derived metadata is ignored** — Derived .ki audit and conform artifacts are ignored rather than committed. (standards.md)
- **FILES-3 [M] — Authoring baseline and self-check** — A governed repository declares ki-authoring and carries a repository-local self-check runner. (standards.md)
- **FILES-J1 [J] — Repository document content** — README and license content is accurate and current. (standards.md)
  - _Review prompt:_ Read the README and license and assess whether they accurately describe and license this repository.

## GH — Core GitHub settings

→ [standard](standards.md)

Default branch, licensing, and repository description.

- **GH-1 [M] — Default branch** — The default branch is main. (standards.md)
- **GH-2 [M] — Declared license alignment** — The declared license agrees with GitHub and package.json. (standards.md)
- **GH-3 [M] — Description presence and synchronisation** — The GitHub description is non-empty and matches package.json when that source exists. (standards.md)

## PKG — Package metadata

→ [standard](standards.md)

Package identity and repository metadata.

- **PKG-1 [M] — Package identity metadata** — package.json carries coherent identity and repository metadata when present. (standards.md)

## MERGE — Merge policy

→ [standard](standards.md)

GitHub merge and branch-cleanup behaviour.

- **MERGE-1 [M] — Merge policy** — The repository permits squash merges only and deletes merged head branches. (standards.md)

## TOGGLE — Repository features

→ [standard](standards.md)

Issues, Wiki, and Projects settings.

- **TOGGLE-1 [M] — Repository feature toggles** — Issues are enabled and Wiki and Projects are disabled unless explicitly overridden. (standards.md)

## VIS — Visibility

→ [standard](standards.md)

Declared and live repository visibility.

- **VIS-1 [M] — Declared visibility** — Live GitHub visibility matches the valid visibility declared in .ki-config.toml. (standards.md)

## TOPICS — Topics

→ [standard](standards.md)

Public repository topic conventions.

- **TOPICS-1 [M] — Public repository topics** — A public repository carries the standard topic set unless explicitly overridden. (standards.md)

## BP — Branch protection

→ [standard](standards.md)

Optional main-branch protection.

- **BP-1 [M] — Branch protection** — Main has the configured branch-protection posture, including required PR, build check, and linear history when enabled. (standards.md)

## DEP — Dependency security

→ [standard](standards.md)

Dependabot and branch freshness.

- **DEP-1 [M] — Dependabot and branch freshness** — Dependabot alerts and updates are enabled and pull-request branches may be updated. (standards.md)

## SEC — Secret protection

→ [standard](standards.md)

Secret scanning and push protection.

- **SEC-1 [M] — Secret scanning protection** — Public repositories enable secret scanning and push protection unless explicitly overridden. (standards.md)

## ACT — Actions policy

→ [standard](standards.md)

GitHub Actions permissions.

- **ACT-1 [M] — Actions policy** — GitHub Actions allowed_actions is all; tighter deliberate policies are reported as warnings. (standards.md)

## CHECKS — Check overrides

→ [standard](standards.md)

Per-repository override schema.

- **CHECKS-1 [M] — Override keys** — Every ki-repo checks override names a supported overridable concern. (standards.md)

## COV — Governance coverage

→ [standard](standards.md)

Detected and declared governance coverage.

- **COV-1 [M] — Governance coverage cascade** — Detected governance applicability and declared opt-in tables agree, subject to explicit coverage overrides. (standards.md)

## STRUCT — Repository structure

→ [standard](standards.md)

Structural governance identity.

- **STRUCT-1 [M] — Single repository structure** — A repository declares at most one repo-structure governance table. (standards.md)
- **STRUCT-2 [M] — Repository structure presence** — A repository normally declares one repo-structure table unless explicitly exempted. (standards.md)

## VENDOR — Vendor integrity

→ [standard](standards.md)

Generated payload manifest integrity.

- **VENDOR-1 [M] — Vendored payload integrity** — Manifest-listed .ki payloads exist and match their recorded hashes. (standards.md)

## CAPABILITY — Capability publication

→ [standard](standards.md)

Complete local governance capabilities.

- **CAPABILITY-COMPLETE [M] — Governance capability completeness** — Every declared governance root has manifest-proven EDUCATE, AUDIT, and CONFORM payloads: regular files for consumers or contained canonical links for a source harness. (standards.md)

## ACCESS — Repository access

→ [standard](standards.md)

GitHub reachability and archive state.

- **ACCESS-1 [M] — GitHub access and archive state** — GitHub reachability is reported without manufacturing drift when offline, and archived repositories are skipped. (standards.md)

## RUNTIMES — Runtime support

→ [standard](standards.md)

Declared agent-runtime support and orientation.

- **RUNTIMES-1 [M] — Supported runtime declaration** — ki-repo declares a non-empty, duplicate-free list containing only supported runtimes. (standards.md)
- **RUNTIMES-J1 [J] — Runtime orientation split** — Multi-runtime repositories use a shared AGENTS.md orientation with a thin Claude import unless a justified exception applies. (standards.md)
  - _Review prompt:_ Review whether orientation is shared cleanly across the declared runtimes without duplicated or Claude-only instructions.

## DESCFIT — Description fitness

→ [standard](standards.md)

Human assessment of repository purpose.

- **DESCFIT-1 [J] — Description fit** — The repository description accurately and concisely describes its purpose. (standards.md)
  - _Review prompt:_ Read the repository and judge whether its one-sentence description fits its actual purpose.

## OVR — Override rationale

→ [standard](standards.md)

Human assessment of exceptions.

- **OVR-J1 [J] — Override rationale** — Every checks override represents a warranted repository-specific decision. (standards.md)
  - _Review prompt:_ Review each configured override and confirm that it records a real exception rather than hiding drift.

## SYNC — Standard synchronisation

→ [standard](standards.md)

Alignment across the knowledge chain.

- **SYNC-1 [J] — Standard synchronisation** — The standard, structured rubric, and executable behaviour remain aligned. (standards.md)
  - _Review prompt:_ Compare the standard, generated rubric, and checker behaviour for semantic drift.

## WORK — Working areas

→ [standard](standards.md)

Judgment-led review of optional inbound and outbound working material.

- **WORK-J1 [J] — working-area direction and lifecycle** — Optional +/ and -/ working areas distinguish inbound from outbound material, and any _HANDOFFS contents have a clear adoption, follow-up, or closure route. (standards.md)
  - _Review prompt:_ Where +/ or -/ exists, review that it is working material rather than a shadow canonical store, and that each handoff has an identifiable receiving owner and next route.
