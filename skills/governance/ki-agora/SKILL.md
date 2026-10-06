---
name: ki-agora
ki-kind: governance
ki-applicability: declaration-only
ki-depends-on: []
ki-shared-dependencies: [ki-skills:rubric]
contributes: [".ki.toml"]
description: >
  Govern owner-declared Agora membership and inclusion of other Agoras or repositories. Use to define or
  audit group declarations; the `ki` CLI owns local resolution and environment tooling owns client projections.
argument-hint: "audit <repo> | conform <repo> | educate <repo> | help | refresh"
---

# Knowledge Islands Agora membership

This governance skill defines the portable declaration of an **Agora**: a purposeful collection of independently governed repositories. Read [the Agora standard](references/standards-agora.md) before declaring one. [The generated rubric](references/rubric.md) publishes the mechanical criteria, and [the source list](references/sources.md) records the decision that grounds the contract.

## What this skill owns

1. **Agora owners** — a registered repository declares each stable, globally unique Agora identifier it owns, its readable title, its purpose, and canonical repository members. The identifier is the machine key; the title is shown to people. The owner is included automatically; ordinary members declare nothing.
2. **Inclusions** — an owner may include another named Agora or a canonical Git repository without making its repositories members. Group inclusion projects only that group's owner and direct members. A registered repository resolves through the local registry; an unregistered Git repository needs an explicit machine-local checkout association.
3. **Portable boundary** — declarations contain no local path, installed-harness location, editor database, app setting, user name, role, or machine-specific state. All projected roots are deduplicated and sorted by local registry key.
4. **Independent authority** — inclusion affects a working set only. It grants no cross-repository permission or trade route. The `ki` host resolves registry identities and rejects duplicate Agora IDs; `ki agora open --target` and client projection remain separate host and environment capabilities.

## Operating modes

The skill carries the universal **AUDIT · CONFORM · EDUCATE · REFRESH** modes. Invoked as `help` / `-h` / `?`, it emits generated HELP and stops. With no recognised mode, it emits the same HELP and, only in an interactive session, offers the mode choice and prompts for the target shown in `argument-hint`.

### Mode AUDIT

Run `ki repo audit --skill ki-agora --repo <repo>`. The structured catalogue validates the local canonical identity and each owner declaration. It does not search for peers or infer membership from an editor profile.

### Mode CONFORM

Run AUDIT first. `ki repo conform --skill ki-agora --repo <repo> --dry-run` may regenerate only this skill's readable rubric publication. It never creates an Agora, adds a member or inclusion, resolves a path, or writes target-application state. Correct authored declarations locally, then re-run AUDIT.

### Mode EDUCATE

Run `ki repo educate --skill ki-agora --repo <repo>` to render the concern and rubric. An owning repository declares each Agora beneath `[skills.ki-agora]` using the example in the standard. An ordinary member needs no `ki-agora` table. EDUCATE grants no local projection authority.

### Mode REFRESH

REFRESH writes only this skill's canonical files in `ki-agentic-harness`. When invoked from an installed copy, stop and redirect to the Harness. Reconcile the standard, structured catalogue, generated rubric, sources, and GDR-KI-HARNESS-006 when the portable contract changes; confirm before changing the authority boundary or target-policy vocabulary.

## Notes

- A local repository registry is the complete inventory of registered canonical KI repositories. It is not an Agora declaration and does not grant membership.
- A protected system-managed estate may later be derived from that registry. It is separate from named owner-declared Agoras, which are intentional subsets of that inventory.
- External source stores may appear in a local target alongside a Knowledge Base, but they are never Agora members merely because a client opens them.
