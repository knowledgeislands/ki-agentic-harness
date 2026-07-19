---
code: FND
---

# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

### Show progress during checker execution

Make long-running individual and aggregate AUDIT / CONFORM runs visibly advance instead of remaining silent until their complete JSONL stream is rendered. Preserve canonical JSONL on stdout for machine consumers; carry concise, runtime-neutral progress on a separate channel, default it sensibly for interactive use, and provide a quiet mode for automation. Aggregate runs must identify the active skill and completed/remaining work, while individual runs should expose meaningful rubric execution progress without reporting suppressed findings early or changing what is checked.

### Simplify the `ki-bootstrap` private implementation

Analyse and refactor the private `ki-bootstrap` implementation now that user installation and repository bootstrap have separate internal roots. Make ownership, orchestration, resolution, generation, publication, and transaction boundaries comprehensible; remove only proven duplication or dead code; and retain one durable repository-local bootstrap engine and source catalogue so normal whole-set and per-skill EDUCATE execution is mechanical and offline. Keep `/harness/bootstrap` as the explicit acquisition route, never an implicit fallback, and preserve the existing publication safety guarantees.

### Add a safe repository clean operation

Add a source-owned `ki-bootstrap` CLEAN operation that removes repository-generated harness state without needing a working vendored runner. Remove `.ki-meta/` and runtime skill copies only when their generated marker proves harness ownership. Preserve `.ki-config.toml`, authored or explicitly linked skills, repository agents, canonical `scripts/vendored/` source dependencies, and any unmarked `ki-*` path; never infer ownership from a name prefix alone. Make the operation safe to repeat, dry-runnable, and suitable for returning a repository to the state immediately before EDUCATE publication.

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
