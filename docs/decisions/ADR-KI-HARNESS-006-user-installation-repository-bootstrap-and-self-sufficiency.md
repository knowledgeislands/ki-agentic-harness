---
id: ADR-KI-HARNESS-006
title: 'User installation, repository bootstrap, and self-sufficiency'
date: 2026-07-09
status: current
type: Architecture Decision Record
type_url: https://knowledgeislands.info/specifications/decision-records/adr
decision_type: architecture
---

# ADR-KI-HARNESS-006: User installation, repository bootstrap, and self-sufficiency

## Context

The earlier installation model used one remote bootstrap command for two unrelated jobs: preparing a user's agent environment and making one repository govern itself.

That conflation made global skills depend on a local checkout, presented a repository action as the first onboarding step, and left the durable Claude hook payload on a separate path.

A governed repository needs to run its mechanical checks without an LLM or a `package.json`, while its declared operations must come from verified user-installed compatible harnesses rather than a copied repository executor.

## Decision

Knowledge Islands has separate user-installation and repository-activation contracts, with strictly separate write scopes.

- **Install verified harnesses once for a user.** The host keeps its registry, harness data, configuration, cache, and mutable state in standard XDG locations. Harness installation creates neither repository state nor runtime activation links.
- **Activate a skill explicitly at a selected scope.** User-scope activation creates only managed discovery links in the selected user runtime. Repository-scope activation updates only the selected repository's declaration and creates its managed repository-runtime links. Activation does not make every installed skill global and never uses a harness checkout as a runtime dependency.
- **Run repository operations natively.** The host reads the selected repository's `.ki-config.toml`, requires all explicit dependencies to be declared, and resolves the resulting operations only from verified installed compatible harnesses. It does not write `package.json`, user-global payloads, hooks, or settings.
- **Keep links deliberate and safe.** Managed runtime links are subject to ownership markers, containment checks, idempotence, dry-run support, and refusal for altered or unfamiliar material. Normal operation does not copy full skills into a repository or a runtime discovery directory.
- **Migrate legacy repository state explicitly.** Existing `.ki` runners, manifests, copied checkers, and copied payloads are legacy implementation state. A fail-closed migration may inspect them, but native operations never execute them as a fallback and they are never removed without complete ownership proof.

The existing remote installer and repository bootstrap implementation remain legacy until migration completes. They do not describe the public contract and cannot provide an execution fallback. Re-running installation or activation is the idempotent update path for its own selected scope.

## Consequences

- The getting-started journey installs verified harnesses, then explicitly activates skills at the required user or repository scope. Direct automation and agent sessions use the same native operations.
- A repository remains declarative through `.ki-config.toml`; a clean clone needs the verified compatible harnesses before it can execute governance operations. It no longer carries a committed checker copy, aggregate runner, or execution manifest.
- User installation and repository activation remain independently testable and cannot expand into one another's scopes. Runtime discovery links remain managed state, while settings and unrelated user material remain outside the contract.
- Legacy scripts, copied payloads, and bootstrap artifacts migrate out through the explicit ownership-proven path. No compatibility runner or checkout-dependent linker remains in the public execution surface.

## References

- [ADR-KI-HARNESS-003](ADR-KI-HARNESS-003-mechanical-first-agent-judgment-progressively-enhances.md) — the mechanical-first stance that makes repository self-sufficiency possible.
- [ADR-KI-HARNESS-SKILLS-001](ADR-KI-HARNESS-SKILLS-001-audit-conform-educate-refresh-canonical-modes-help.md) — the governance modes that skills register for native execution.
