---
code: FND
---

# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

### Add a safe repository CLEAN operation

Add a source-owned CLEAN operation that removes only manifest-proven `.ki-meta/` output and unchanged marker-owned runtime skill copies. It must preserve repository configuration, canonical skill sources, explicit development links, agents, tampered or unmarked content, and every path it cannot prove is generated. Support dry-run, repeat safety, fail-closed handling of symlinks and concurrent mutation, and CLEAN followed by EDUCATE recovery.

**Plan:** [FND-003](plans/FND-003-add-a-safe-repository-clean-operation.md)

### Define a canonical cross-runtime `ki-self` footprint

Define one repository-owned, committed source for `ki-self`, then project that same content into every supported runtime's skill-discovery directory. The source must be runtime-neutral and remain independent of generated runtime payloads, so `.agents/skills/ki-self` and `.claude/skills/ki-self` never diverge or make a repository's local governance depend on a harness checkout. Settle source location, projection ownership, link safety, EDUCATE and CLEAN behaviour, and migration of existing repository-local `ki-self` directories without overwriting authored content.

**Plan:** [FND-008](plans/FND-008-define-a-canonical-cross-runtime-ki-self-footprint.md)

### Implement scoped lifecycle operations

Implement the lifecycle boundary in `ODR-KI-HARNESS-001`: repository CLEAN removes only proven generated duplication and leaves the declaration ready for EDUCATE; repository and user DOCTOR are read-only; and repository and user UNINSTALL remove KI-owned traces only at their explicit scope. Provide zero-install repository launchers that run from temporary source without changing user state. This boundary must land before the doctor and `kisle` command surfaces it defines.

**Plan:** [FND-016](plans/FND-016-implement-scoped-lifecycle-operations.md)

### Add scoped read-only bootstrap doctor operations

Add source-owned DOCTOR operations for explicit repository and user scopes. Repository DOCTOR inspects configuration, supported runtimes, runtime payload ownership, `.ki-meta/` manifest state, and recovery routes; user DOCTOR inspects only KI-owned user-level installation state. Both distinguish healthy, recoverable generated drift, preserved user-owned state, and unsafe or incomplete state; report the exact next action such as EDUCATE, CLEAN, UNINSTALL, or manual reconciliation without writing. Keep them runnable without a working vendored runner, dry-run equivalent by design, and suitable for humans and automation.

**Plan:** [FND-017](plans/FND-017-add-scoped-read-only-bootstrap-doctor-operations.md)

### Establish the installable `kisle` command-line interface

Design `kisle`, the stable end-user and automation entrypoint for Knowledge Islands operations, then hand its implementation to a zero-dependency `tools-kisle` repository and its release to `homebrew-tap`, following the established `mgit` delivery shape. Its initial surface covers `user install`, repository `bootstrap`, `educate`, `audit`, `conform`, and `clean`, plus HELP; it must expose the lifecycle contract without alternate meanings or harness-maintainer utilities. `clean` is repository-only, while `doctor` and `uninstall` require explicit `repo` or `user` scope when they arrive. Settle shell completion, versioning, runtime independence, error/reporting contract, and its relationship to installed skills, public launchers, and repository-local vendored commands before implementation. Do not claim the bare `ki` command: it is already published as Kotlin's Interactive Shell through Homebrew.

**Plan:** [FND-018](plans/FND-018-establish-installable-kisle-command-line-interface.md)

### Review structural consistency across shipped skills

Audit every shipped skill against the established exemplar implementations for structural consistency: checker decomposition, shared-module boundaries, script and test layout, mode wiring, safe-write patterns, generated payload treatment, and documentation-to-code ownership. Identify discrepancies in implementation shape and unnecessary divergence without demanding line-by-line uniformity or erasing legitimate concern-specific differences. Categorise the findings, settle the intended common patterns, and create focused follow-up work for each material inconsistency.

**Plan:** [FND-019](plans/FND-019-review-shipped-skill-structural-consistency.md)

### Add safe multiprogress aggregate execution

Replace aggregate AUDIT and CONFORM's process-per-checker transport with direct, in-process calls to local vendored checker entry points. Reuse the shared checker's structured status events so the default single bar advances continuously without a child-progress protocol, temporary capture files, stdout reparsing, or a Bun launch for each checker. Add an opt-in multiprogress display: one stable, labelled row per selected checker, such as `AUDIT [ki-skills]`. Preserve direct checker JSONL, deterministic aggregate reporting, exit semantics, `--progress`, FND-010 terminal behaviour, and sequential AUDIT/CONFORM execution. Concurrency is explicitly out of scope until a separate independence and cancellation contract exists.

**Plan:** [FND-015](plans/FND-015-add-safe-multiprogress-aggregate-execution.md)

### Complete harness-local skill dependency linking

For a source-bearing `ki-harness`, ensure every declared dependency that resolves to a canonical skill or shared module in that same harness checkout is projected through a contained relative symlink rather than an unnecessary local copy. Cover both runtime discovery projections and a skill's source-tree `scripts/vendored/` dependencies, with one clear harness-owned activation rule and bootstrap-owned safe publication and synchronisation mechanics. Make the boundary with generated `.ki-meta/` checker and educator snapshots explicit: retain their portable manifest-owned copies unless a harness-only linking exception can be proven safe for standalone operation, CLEAN, integrity checks, and release packaging. Audit and test the complete contract, including stale regular files, invalid links, consumer copy dereferencing, and a source edit propagating through every intended harness-local reference.

**Plan:** [FND-013](plans/FND-013-complete-harness-local-skill-dependency-linking.md)

### Unify repository-local KI state under `.ki/`

Replace the split top-level `.ki-self/` and `.ki-meta/` footprint with one clearly owned `.ki/` root: `.ki/self/skill/` is the committed, authored source projected as the runtime `ki-self` skill, and `.ki/meta/` is generated, manifest-owned bootstrap state. Preserve the existing runtime skill name and portable consumer contract while making the authored/generated distinction visible inside the established KI repository namespace. Provide a safe current-state migration for source, runtime links, generated bootstrap output, CLEAN, recovery, documentation, and repository Git state; remove the old footprint and its dead paths once each is proven migrated, never retain dual-path compatibility or delete unproven content.

**Plan:** [FND-014](plans/FND-014-unify-repository-local-ki-state.md)

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Review `ki-bootstrap` for further simplification

After the current boundary refactor settles, review the complete `ki-bootstrap` implementation for residual complexity across user installation, repository bootstrap, shared transport, generation, publication, rubric contexts, and tests. Start with local process launches between bootstrap-owned publisher, synchroniser, HELP, and scaffold modules; replace them only after each has an import-safe entry point and preserves its guarded transaction. Keep external commands and user-install failure isolation where those are real boundaries.

### Codify Git workflow and commit conventions _(candidate)_

Choose an owner for repository Git discipline, including Conventional Commit messages, the allowed type and scope vocabulary, safe lock and cleanup behaviour, and consistency with repository-local instructions. Decide whether that owner should be a dedicated `ki-git` skill, including ownership of the shipped stale Git-lock guard rather than leaving it as an ungoverned hook. Add mechanical enforcement only after the standard is settled.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Harden user harness installation and runtime skill publication

After the first installer establishes the user-level contract, make runtime skill publication fail-safe, runtime-selected, and independently testable. Assess whether the installer’s local hook-installer subprocess can become an import-safe direct call without weakening user-space failure isolation. Preserve unrelated user files and refuse unsafe parents.

### Replace local tokenomics engine subprocesses _(candidate)_

Extract a pure evidence and findings API from tokenomics’ local audit and conform engines so its checker can invoke them without launching Bun for adjacent source modules. Preserve the engine’s direct CLI behaviour, JSONL/reporting contracts, and external Git boundary; do not couple this migration to aggregate rendering.

### Document per-skill `.ki-config.toml` ownership _(candidate)_

Document the existing validate-down convention: each skill owns and validates its own table, while shared configuration stays with its owner. Use `ki-authoring.printWidth` as the worked example; do not design a central editor schema without a concrete cross-skill use case.

### Inventory non-critical writers for bounded follow-up _(candidate)_

After the rollout-critical filesystem work closes, inventory remaining report generators and direct conformers by mutation class. Prioritise external, user-space, or destructive writers; leave ordinary local report writers alone unless the inventory identifies a concrete risk. Opaque subprocess writers retain honest exclusions unless a separate isolation design is approved.

### Review the Cloudflare agent-setup prompt for the Cloudflare skill _(candidate)_

Review Cloudflare's [agent-setup prompt](https://developers.cloudflare.com/agent-setup/prompt.md) as a tracked source for the Cloudflare skill. Adopt only the parts that improve current, safe Cloudflare work in this harness; retain Knowledge Islands' ownership, conventions, and judgment rather than following the prompt wholesale.

### Define cross-repository skill vendor provenance _(candidate)_

Define how one KI harness can declare and receive a shared module from another harness without relying on a nearby checkout or an ambient filesystem path. Assess an explicit `repository-id:skill:module` dependency identity, such as `ki-agentic-harness:ki-skills:reporter`, alongside repository identifiers, version or revision pinning, integrity, acquisition, missing-provider and conflict handling, and release packaging. Keep the rule that only a provider in the same physical harness checkout may be symlinked; an external provider must arrive through an explicit portable vendor or installation contract. Do not change the current local `skill:module` parser until that contract is designed and adopted.
