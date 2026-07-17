# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Complete cited JSON checker-contract conformance and enforce CHK-009/CHK-012

Bring the remaining checker JSON-contract exceptions into the already-decided single aggregate-renderer model, then run each checker through its structured surface, collect emitted finding codes, and reconcile them with the owning rubric, including declared judgment-only exemptions. Start as a reporting check, clean the known undocumented codes and the known `ki-housekeeping`, `ki-binding`, `ki-decision-records`, and `ki-feature-definitions` contract exceptions, then promote it to a gate. Use the same collection pass to enforce CHK-012's non-restating message rule.

### Enforce generated-code exclusions in `ki-engineering`

The exclusion policy is already decided and applied in examples. Add only the missing mechanical enforcement: when generated or vendored trees exist, AUDIT must require the matching Biome, knip, and Markdown exclusions.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

### Harden global runtime skill publication

Make user-home runtime skill installation fail-safe, runtime-selected, and independently testable. Preserve unrelated links and refuse unsafe parents; keep it separate from repository bootstrap and from Claude Code hook delivery.

## Waiting for

Worth doing, but presently blocked on an external dependency or decision. Revisit when its named condition changes rather than treating it as dormant local work.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

## Future

Speculative or not yet scoped — items marked _(candidate)_ need a scoping pass (or a decision to drop them) before they're actionable.

### Document per-skill `.ki-config.toml` ownership _(candidate)_

Document the existing validate-down convention: each skill owns and validates its own table, while shared configuration stays with its owner. Use `ki-authoring.printWidth` as the worked example; do not design a central editor schema without a concrete cross-skill use case.

### Codify Git workflow and commit conventions _(candidate)_

Choose an owner for repository Git discipline, including Conventional Commit messages, the allowed type and scope vocabulary, safe lock and cleanup behaviour, and consistency with repository-local instructions. Decide whether that owner should be a dedicated `ki-git` skill, including ownership of the shipped stale Git-lock guard rather than leaving it as an ungoverned hook. Add mechanical enforcement only after the standard is settled.

### Inventory non-critical writers for bounded follow-up _(candidate)_

After the rollout-critical filesystem work closes, inventory remaining report generators and direct conformers by mutation class. Prioritise external, user-space, or destructive writers; leave ordinary local report writers alone unless the inventory identifies a concrete risk. Opaque subprocess writers retain honest exclusions unless a separate isolation design is approved.
