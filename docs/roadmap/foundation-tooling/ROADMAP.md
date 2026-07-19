---
code: FND
---

# Foundation tooling roadmap

## Blocking

Actively broken, or blocking the `Next` horizon: takes priority over everything else and must clear before `Next` work proceeds. Empty means nothing is on fire.

### Normalise skill packaging after the checker rollout

After the structured checker rollout is stable, apply the accumulated mechanical packaging cleanups in one current-state migration with no compatibility aliases or dual paths:

- Reclassify `ki-skills` from `skills/general-governance/` to `skills/keystone/`: it is the self-governing root that defines and verifies the shared rubric, checker, and reporter contract rather than an optional cross-cutting instrument. Sweep source paths, tests, package commands, documentation, diagrams, and generated skill-map references without changing the rule that only `ki-bootstrap` is installed globally.
- Move unpublished skill-private modules—currently e.g. in `ki-bootstrap` and `ki-repo`, from `scripts/lib` to `scripts/internal/`, then update their imports and focused tests.
- Move any vendored modules from `scripts/lib/` to `scripts/shared/` for modules explicitly published for cross-skill vendoring.
- Flag any remaining modules in `scripts/lib` as a packaging error for discussion.
- Rename **all of** the Knowledge Islands-specific skill frontmatter keys: e.g. `depends-on` → `ki-depends-on`, `vendors` → `ki-vendors`, and `checker-dependencies` → `ki-checker-dependencies` across canonical skills, validators, dependency resolution, bootstrap publication, generated footprints, documentation, fixtures, and installed copies.

Re-bootstrap and conform every governed repository after the source migration. Add further simple packaging findings to this item during rollout review; scope any broader contract redesign separately.

## Next

Scoped and ready to start — the immediate queue, picked up before anything in **Soon** or **Future**.

### Remove the legacy `preferred_model` migration bridge in `ki-tokenomics`

The checker deliberately recognises `preferred_model` only to issue a migration failure. Remove that parsing and its alias mapping when a fleet-wide search confirms that no sibling `.ki-config.toml` still uses the legacy key.

## Soon

Understood and roughly scoped but not yet started — worth doing once the **Next** queue clears, ahead of anything still speculative.

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
