---
code: FND
---

# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

**Plan:** [FND-001](plans/FND-001-remove-legacy-preferred-model-migration-bridge.md)

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Protect generated rubric publications from drift

Complete the rubric-publication contract across the ten governance skills that have structured item catalogues and tracked `references/rubric.md` but no exact-parity test: `ki-housekeeping`, `ki-binding`, `ki-engineering`, `ki-authoring`, `ki-tokenomics`, `ki-binding-chezmoi`, `ki-repo`, `ki-repo-roadmap`, `ki-kb-streams`, and `ki-kb`. Add focused read-only tests that render each in-memory catalogue and exact-compare its publication, then reconcile any missing generated-source notice, classification, citation, or judgment-prompt presentation with `ki-skills`' rubric-authoring contract. Preserve legitimate local renderer choices; do not extract a shared renderer merely for visual uniformity.

### Review `ki-bootstrap` for further simplification

After the current boundary refactor settles, review the complete `ki-bootstrap` implementation for residual complexity across user installation, repository bootstrap, shared transport, generation, publication, rubric contexts, and tests. Start with local process launches between bootstrap-owned publisher, synchroniser, HELP, and scaffold modules; replace them only after each has an import-safe entry point and preserves its guarded transaction. Keep external commands and user-install failure isolation where those are real boundaries.

### Codify Git workflow and commit conventions _(candidate)_

Choose an owner for repository Git discipline, including Conventional Commit messages, the allowed type and scope vocabulary, safe lock and cleanup behaviour, and consistency with repository-local instructions. Decide whether that owner should be a dedicated `ki-git` skill, including ownership of the shipped stale Git-lock guard rather than leaving it as an ungoverned hook. Add mechanical enforcement only after the standard is settled.

### Build and deepen the Knowledge Islands command-line interface (CLI)

Turn the accepted `ki` command contract into a released, zero-dependency end-user CLI in `tools-ki`, with `homebrew-tap` delivery. First incorporate the remaining command-surface ideas into the contract and settle any changes with the owning harness lifecycle semantics; then implement, test, package, and document the installed command without duplicating repository-local or harness-maintainer entrypoints.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Codify context-aware delegation policy _(candidate)_

Extend `ki-delegate`'s judgment guidance with an explicit dispatch decision: whether delegated work needs the originating conversation context, whether it needs frontier-level reasoning, and therefore whether to retain it in the main thread, dispatch it with a context fork, or dispatch a fresh lower-cost worker. Require the delegation brief to carry every durable constraint and decision needed by a fresh worker; context forks are a hygiene tool, not a substitute for an adequate brief. Map this policy to the runtime-specific delegation controls only after confirming their portable semantics.

### Harden user harness installation and runtime skill publication

After the first installer establishes the user-level contract, make runtime skill publication fail-safe, runtime-selected, and independently testable. Assess whether the installer’s local hook-installer subprocess can become an import-safe direct call without weakening user-space failure isolation. Preserve unrelated user files and refuse unsafe parents.

### Replace local tokenomics engine subprocesses _(candidate)_

Extract a pure evidence and findings API from tokenomics’ local audit and conform engines so its checker can invoke them without launching Bun for adjacent source modules. Preserve the engine’s direct CLI behaviour, JSONL/reporting contracts, and external Git boundary; do not couple this migration to aggregate rendering.

### Document per-skill `.ki-config.toml` ownership _(candidate)_

Document the existing validate-down convention: each skill owns and validates its own table, while shared configuration stays with its owner. Use `ki-authoring.printWidth` as the worked example; do not design a central editor schema without a concrete cross-skill use case.

### Inventory non-critical writers for bounded follow-up _(candidate)_

After the rollout-critical filesystem work closes, inventory remaining report generators and direct conformers by mutation class. Prioritise external, user-space, or destructive writers; leave ordinary local report writers alone unless the inventory identifies a concrete risk. The initial FND-019 review identifies `ki-binding`'s Cowork settings writer, `ki-housekeeping`'s state writers, and `ki-agents`' recursive agent-surface writer as the first candidates for dry-run, idempotence, symlink, and atomic-publication evidence. Opaque subprocess writers retain honest exclusions unless a separate isolation design is approved.

### Review the Cloudflare agent-setup prompt for the Cloudflare skill _(candidate)_

Review Cloudflare's [agent-setup prompt](https://developers.cloudflare.com/agent-setup/prompt.md) as a tracked source for the Cloudflare skill. Adopt only the parts that improve current, safe Cloudflare work in this harness; retain Knowledge Islands' ownership, conventions, and judgment rather than following the prompt wholesale.

### Define cross-repository skill vendor provenance _(candidate)_

Define how one KI harness can declare and receive a shared module from another harness without relying on a nearby checkout or an ambient filesystem path. Assess an explicit `repository-id:skill:module` dependency identity, such as `ki-agentic-harness:ki-skills:reporter`, alongside repository identifiers, version or revision pinning, integrity, acquisition, missing-provider and conflict handling, and release packaging. Keep the rule that only a provider in the same physical harness checkout may be symlinked; an external provider must arrive through an explicit portable vendor or installation contract. Do not change the current local `skill:module` parser until that contract is designed and adopted.
