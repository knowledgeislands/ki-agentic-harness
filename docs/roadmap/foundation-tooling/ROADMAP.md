---
code: FND
---

# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

### Make plan-to-roadmap linkage explicit

Make an active plan visible from the canonical item it executes, not only from the plan's `roadmap:` frontmatter and the generated global index. Define one derivable, local plan-reference form beneath a `Blocking` or `Next` item; have AUDIT detect an absent, stale, or ambiguous reference and CONFORM repair it without rewriting the item's authored prose. Ensure `ki-plan new`, `promote`, `execute`, and `done` include the canonical theme roadmap in their existing safe transactions so plan creation, lifecycle changes, and closure cannot leave the local inverse link stale.

**Plan:** [FND-004](plans/FND-004-make-plan-to-roadmap-linkage-explicit.md)

### Make CONFORM audit-gated per rubric item

Make mechanical CONFORM a per-rubric-item pipeline rather than a complete AUDIT pass followed by a complete CONFORM pass. Each item must audit immediately before a potential repair, skip repair when its audit already passes or is not applicable, and re-audit immediately afterward. An item may repair an `INFO` outcome only when it declares that explicitly; ordinary informational findings remain non-mutating. Report `FIXED` only when a repair caused a persistent change and the post-repair audit passes. Preserve judgment as unevaluated work and canonical JSONL as final outcomes only. Direct and aggregate progress must both count the actual mechanical rubric-item executions, never merely the number of governed skills.

**Plan:** [FND-005](plans/FND-005-make-conform-audit-gated-per-rubric-item.md)

### Define a canonical cross-runtime `ki-self` footprint

Define one repository-owned, committed source for `ki-self`, then project that same content into every supported runtime's skill-discovery directory. The source must be runtime-neutral and remain independent of generated runtime payloads, so `.agents/skills/ki-self` and `.claude/skills/ki-self` never diverge or make a repository's local governance depend on a harness checkout. Settle source location, projection ownership, link safety, EDUCATE and CLEAN behaviour, and migration of existing repository-local `ki-self` directories without overwriting authored content.

**Plan:** [FND-008](plans/FND-008-define-a-canonical-cross-runtime-ki-self-footprint.md)

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Add a read-only bootstrap doctor operation

Add a source-owned `ki-bootstrap` DOCTOR operation that inspects a target's configuration, supported runtimes, runtime payload ownership, `.ki-meta/` manifest state, and available recovery routes without writing. It should distinguish a healthy footprint, recoverable generated drift, preserved user-owned state, and an unsafe or incomplete target; report the exact next action such as EDUCATE, CLEAN, or manual reconciliation. Keep it runnable without a working vendored runner, dry-run equivalent by design, and suitable for both humans and automation.

### Review `ki-bootstrap` for further simplification

After the current boundary refactor settles, review the complete `ki-bootstrap` implementation for residual complexity across user installation, repository bootstrap, shared transport, generation, publication, rubric contexts, and tests. Remove unnecessary layers and genuine duplication without weakening safety invariants, merging distinct write transactions, or reopening the public lifecycle contract.

### Codify Git workflow and commit conventions _(candidate)_

Choose an owner for repository Git discipline, including Conventional Commit messages, the allowed type and scope vocabulary, safe lock and cleanup behaviour, and consistency with repository-local instructions. Decide whether that owner should be a dedicated `ki-git` skill, including ownership of the shipped stale Git-lock guard rather than leaving it as an ungoverned hook. Add mechanical enforcement only after the standard is settled.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Establish an installable Knowledge Islands command-line interface _(candidate)_

Design and ship one installable command-line interface that provides the stable human and automation entrypoints for Knowledge Islands operations, including bootstrap, audit, conform, educate, clean, and doctor. Do not claim the bare `ki` command: it is already published as Kotlin's Interactive Shell through Homebrew. Settle a collision-free executable name, distribution channels, shell completion, versioning, runtime independence, error/reporting contract, and its relationship to installed skills and repository-local vendored commands before implementation.

### Harden user harness installation and runtime skill publication

After the first installer establishes the user-level contract, make runtime skill publication fail-safe, runtime-selected, and independently testable. Preserve unrelated user files and refuse unsafe parents.

### Document per-skill `.ki-config.toml` ownership _(candidate)_

Document the existing validate-down convention: each skill owns and validates its own table, while shared configuration stays with its owner. Use `ki-authoring.printWidth` as the worked example; do not design a central editor schema without a concrete cross-skill use case.

### Inventory non-critical writers for bounded follow-up _(candidate)_

After the rollout-critical filesystem work closes, inventory remaining report generators and direct conformers by mutation class. Prioritise external, user-space, or destructive writers; leave ordinary local report writers alone unless the inventory identifies a concrete risk. Opaque subprocess writers retain honest exclusions unless a separate isolation design is approved.

### Review the Cloudflare agent-setup prompt for the Cloudflare skill _(candidate)_

Review Cloudflare's [agent-setup prompt](https://developers.cloudflare.com/agent-setup/prompt.md) as a tracked source for the Cloudflare skill. Adopt only the parts that improve current, safe Cloudflare work in this harness; retain Knowledge Islands' ownership, conventions, and judgment rather than following the prompt wholesale.
