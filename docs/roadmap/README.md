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

### [FND-015](foundation-tooling/plans/FND-015-add-safe-multiprogress-aggregate-execution.md)

- **Title:** Add safe in-process multiprogress aggregate execution
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/add-safe-multiprogress-aggregate-execution`
- **Status:** open
- **Blocks:** —

### [FND-016](foundation-tooling/plans/FND-016-implement-scoped-lifecycle-operations.md)

- **Title:** Implement scoped lifecycle operations
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/implement-scoped-lifecycle-operations`
- **Status:** open (needs FND-003)
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

### [FND-013](foundation-tooling/plans/FND-013-complete-harness-local-skill-dependency-linking.md)

- **Title:** Link source-harness bootstrap payloads
- **Theme:** `foundation-tooling`
- **Roadmap item:** `foundation-tooling/link-source-harness-bootstrap-payloads`
- **Status:** done

## Dependency graph

```text
FND-003 ──► FND-016
FND-016 ──► FND-017
FND-016 ──► FND-018
```
