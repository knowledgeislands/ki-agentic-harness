# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Make governance identifiers readable and navigable

After canonical reports land, review every requirement, rubric, and diagnostic identifier as a human-facing navigation system. Keep stable IDs where title-first presentation and links solve the readability problem; otherwise design a semantic, reorder-safe identifier scheme and a safe migration for definitions, citations, tests, and generated output. Do not rename codes merely for aesthetics or break durable references without a migration decision.

### Review harness self-installation of KI skills

Review the `ki-agentic-harness` repository as the active skill-authoring environment, separately from ordinary consumer repositories. Decide and verify that its own runtime skill directories use development symlinks to the canonical `skills/` sources by default, while consumer repositories continue to receive regenerated regular-file copies. Cover every supported runtime, safe replacement of stale copies or links, and the audit/conform signal when the harness is not in its expected development-linked state.

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
