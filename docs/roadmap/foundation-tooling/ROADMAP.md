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

### Add scoped read-only bootstrap doctor operations

Add source-owned DOCTOR operations for explicit repository and user scopes. Repository DOCTOR inspects configuration, supported runtimes, runtime payload ownership, `.ki-meta/` manifest state, and recovery routes; user DOCTOR inspects only KI-owned user-level installation state. Both distinguish healthy, recoverable generated drift, preserved user-owned state, and unsafe or incomplete state; report the exact next action such as EDUCATE, CLEAN, UNINSTALL, or manual reconciliation without writing. Keep them runnable without a working vendored runner, dry-run equivalent by design, and suitable for humans and automation.

### Establish the installable `kisle` command-line interface

Design `kisle`, the stable end-user and automation entrypoint for Knowledge Islands operations, then hand its implementation to a zero-dependency `tools-kisle` repository and its release to `homebrew-tap`, following the established `mgit` delivery shape. Its initial surface covers `user install`, repository `bootstrap`, `educate`, `audit`, `conform`, and `clean`, plus HELP; it must expose the lifecycle contract without alternate meanings or harness-maintainer utilities. `clean` is repository-only, while `doctor` and `uninstall` require explicit `repo` or `user` scope when they arrive. Settle shell completion, versioning, runtime independence, error/reporting contract, and its relationship to installed skills, public launchers, and repository-local vendored commands before implementation. Do not claim the bare `ki` command: it is already published as Kotlin's Interactive Shell through Homebrew.

### Review structural consistency across shipped skills

Audit every shipped skill against the established exemplar implementations for structural consistency: checker decomposition, shared-module boundaries, script and test layout, mode wiring, safe-write patterns, generated payload treatment, and documentation-to-code ownership. Identify discrepancies in implementation shape and unnecessary divergence without demanding line-by-line uniformity or erasing legitimate concern-specific differences. Categorise the findings, settle the intended common patterns, and create focused follow-up work for each material inconsistency.

### Improve CONFORM progress feedback

Make direct and aggregate CONFORM progress useful in a terminal: detect the active TTY width when available, size the bar from that width with a safe fallback and a maximum of 100 columns, and append the completed percentage to the existing count. Preserve canonical JSONL and non-interactive output, never let presentation width alter item accounting, and cover narrow, wide, unavailable-TTY, and capped-width cases.

### Preserve committed completion records before plan removal

Refine the `ki-plan` closing lifecycle so a completed plan first gains a `## Done` outcome, moves to `status: done`, and is committed with its still-visible roadmap and index record. A later explicit closing transaction and separate commit then removes the plan, its canonical roadmap item and local reference, and its generated index/projection entries. Keep both transitions guarded, auditable, and recoverable; do not infer the removal from the status change alone.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Review `ki-bootstrap` for further simplification

After the current boundary refactor settles, review the complete `ki-bootstrap` implementation for residual complexity across user installation, repository bootstrap, shared transport, generation, publication, rubric contexts, and tests. Remove unnecessary layers and genuine duplication without weakening safety invariants, merging distinct write transactions, or reopening the public lifecycle contract.

### Codify Git workflow and commit conventions _(candidate)_

Choose an owner for repository Git discipline, including Conventional Commit messages, the allowed type and scope vocabulary, safe lock and cleanup behaviour, and consistency with repository-local instructions. Decide whether that owner should be a dedicated `ki-git` skill, including ownership of the shipped stale Git-lock guard rather than leaving it as an ungoverned hook. Add mechanical enforcement only after the standard is settled.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Harden user harness installation and runtime skill publication

After the first installer establishes the user-level contract, make runtime skill publication fail-safe, runtime-selected, and independently testable. Preserve unrelated user files and refuse unsafe parents.

### Document per-skill `.ki-config.toml` ownership _(candidate)_

Document the existing validate-down convention: each skill owns and validates its own table, while shared configuration stays with its owner. Use `ki-authoring.printWidth` as the worked example; do not design a central editor schema without a concrete cross-skill use case.

### Inventory non-critical writers for bounded follow-up _(candidate)_

After the rollout-critical filesystem work closes, inventory remaining report generators and direct conformers by mutation class. Prioritise external, user-space, or destructive writers; leave ordinary local report writers alone unless the inventory identifies a concrete risk. Opaque subprocess writers retain honest exclusions unless a separate isolation design is approved.

### Review the Cloudflare agent-setup prompt for the Cloudflare skill _(candidate)_

Review Cloudflare's [agent-setup prompt](https://developers.cloudflare.com/agent-setup/prompt.md) as a tracked source for the Cloudflare skill. Adopt only the parts that improve current, safe Cloudflare work in this harness; retain Knowledge Islands' ownership, conventions, and judgment rather than following the prompt wholesale.
