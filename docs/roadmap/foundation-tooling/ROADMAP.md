# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Finish repository-local generated-write hardening

Bootstrap publication, Plan Mode hooks, the stale Git-lock guard, project-roadmap publication, scaffold-only `.ki-config.toml` and `.gitignore`, and hook-settings JSON are hardened and tested. Finish the normal per-repository path by hardening project skill and supported Claude agent links. Global user-home skill publication and hook delivery are explicit one-time operations with their own roadmap items; report writers and direct conformers remain long-tail work.

### Roll out the uniform mode model across the `mcp-*` repositories

Build a read-only baseline for the six sibling MCP repositories, select one clean representative pilot, and prove the four-mode bootstrap recipe there before applying it repository by repository. Each repository gets a clean preflight, a local governed plan, focused tests, its surface-specific audit, and the aggregate audit. An unresolved writer blocks only the operation that needs it, not the baseline or unrelated rollout work.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Enforce CHK-009 citation completeness with runtime collection

Run each checker through its structured JSON surface, collect emitted finding codes, and reconcile them with the owning rubric, including declared judgment-only exemptions. Start as a reporting check, clean the known undocumented codes, then promote it to a gate. Use the same collection pass to enforce CHK-012's non-restating message rule.

### Enforce generated-code exclusions in `ki-engineering`

The exclusion policy is already decided and applied in examples. Add only the missing mechanical enforcement: when generated or vendored trees exist, AUDIT must require the matching Biome, knip, and Markdown exclusions.

### Codify the generated-write safety contract

Define the compact mutation-class, authorized-root, transaction, publication, rollback, and exclusion contract for governed writers. Start by documenting the already-hardened bootstrap, scaffold, and project-link surfaces; do not reopen their implementation.

### Harden global runtime skill publication

Make user-home runtime skill installation fail-safe, runtime-selected, and independently testable. Preserve unrelated links and refuse unsafe parents; keep it separate from repository bootstrap and from Claude Code hook delivery.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Define the `.ki-config.toml` override contract _(candidate)_

Decide whether the existing per-skill validate-down convention is sufficient or whether a composed editor-facing schema is worth its maintenance cost. As one coherent design, document each skill's supported overrides, use `ki-authoring.printWidth` as the worked example, and settle the compact comment convention without creating a judgmental auto-rewriter.

### Overhaul checker output around pure JSON and one formatter _(candidate)_

Assess a deliberate migration in which checkers emit the canonical JSON wrapper and a bootstrap-vendored formatter owns presentation, filtering, and grouping. Preserve standalone skill operation and avoid a piecemeal mixed model.

### Codify Git workflow and commit conventions _(candidate)_

Choose an owner for repository Git discipline, including Conventional Commit messages, the allowed type and scope vocabulary, safe lock and cleanup behaviour, and consistency with repository-local instructions. Add mechanical enforcement only after the standard is settled.

### Rename `ki-engineering` to `ki-engineering-ts` _(candidate)_

The skill governs the TypeScript and Bun toolchain rather than language-neutral engineering. Scope the mechanical rename across declarations, vendored paths, package aliases, composition edges, and citations before starting it.

### Harden non-critical report writers and direct conformers _(candidate)_

After the rollout-critical filesystem work closes, inventory the remaining report generators and direct conformers by mutation class and migrate them in bounded batches. Opaque subprocess writers must retain honest exclusions unless a separate isolation design is approved.
