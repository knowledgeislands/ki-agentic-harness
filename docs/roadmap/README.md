# Repository roadmap index

Canonical themes, active execution plans, and completed plan records.

## Themes

- [foundation-tooling](foundation-tooling/ROADMAP.md)
- [governance-consistency](governance-consistency/ROADMAP.md)
- [operations](operations/ROADMAP.md)
- [runtime-portability](runtime-portability/ROADMAP.md)

## Active plans

### [FND-003](foundation-tooling/plans/FND-003-add-a-safe-repository-clean-operation.md)

- **Title:** Add a safe repository clean operation
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/add-a-safe-repository-clean-operation`
- **Status:** acceptance
- **Blocks:** FND-016

### [FND-013](foundation-tooling/plans/FND-013-complete-harness-local-skill-dependency-linking.md)

- **Title:** Complete harness-local skill dependency linking
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/complete-harness-local-skill-dependency-linking`
- **Status:** ready
- **Blocks:** —

### [FND-014](foundation-tooling/plans/FND-014-unify-repository-local-ki-state.md)

- **Title:** Unify repository-local KI state under .ki
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/unify-repository-local-ki-state-under-ki`
- **Status:** open
- **Blocks:** FND-016

### [FND-015](foundation-tooling/plans/FND-015-add-safe-multiprogress-aggregate-execution.md)

- **Title:** Add safe multiprogress aggregate execution
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/add-safe-multiprogress-aggregate-execution`
- **Status:** open
- **Blocks:** —

### [FND-016](foundation-tooling/plans/FND-016-implement-scoped-lifecycle-operations.md)

- **Title:** Implement scoped lifecycle operations
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/implement-scoped-lifecycle-operations`
- **Status:** open (needs FND-003+FND-014)
- **Blocks:** FND-017, FND-018

### [FND-017](foundation-tooling/plans/FND-017-add-scoped-read-only-bootstrap-doctor-operations.md)

- **Title:** Add scoped read-only bootstrap doctor operations
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/add-scoped-read-only-bootstrap-doctor-operations`
- **Status:** open (needs FND-016)
- **Blocks:** —

### [FND-018](foundation-tooling/plans/FND-018-establish-installable-kisle-command-line-interface.md)

- **Title:** Establish the installable kisle command-line interface
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/establish-the-installable-kisle-command-line-interface`
- **Status:** open (needs FND-016)
- **Blocks:** —

### [FND-019](foundation-tooling/plans/FND-019-review-shipped-skill-structural-consistency.md)

- **Title:** Review structural consistency across shipped skills
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/review-structural-consistency-across-shipped-skills`
- **Status:** open
- **Blocks:** —

### [RTP-001](runtime-portability/plans/RTP-001-detect-vendor-specific-portable-contracts.md)

- **Title:** Detect vendor-specific assumptions in portable skill contracts
- **Theme:** `runtime-portability`
- **Roadmap item:** `runtime-portability/detect-vendor-specific-assumptions-in-portable-skill-contracts`
- **Status:** open
- **Blocks:** —

## Completed plans

### [FND-008](foundation-tooling/plans/FND-008-define-a-canonical-cross-runtime-ki-self-footprint.md)

- **Title:** Define a canonical cross-runtime ki-self footprint
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/define-a-canonical-cross-runtime-ki-self-footprint`
- **Status:** done

## Dependency graph

```text
FND-003 ──► FND-016
FND-014 ──► FND-016
FND-016 ──► FND-017
FND-016 ──► FND-018
```
