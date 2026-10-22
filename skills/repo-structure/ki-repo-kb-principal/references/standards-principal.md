# Principal Knowledge Base standard

This overlay provides a visible governance system for a Knowledge Base designated as its territory's principal island, holding the Capital role. It composes the normal Knowledge Islands zone model and Decision Records, and reviews the territorial declaration. Adoption of the overlay or a passing audit does not appoint a principal or grant jurisdiction.

## Required principal surface

- `Admin/MEMORY.md` is the root memory anchor.
- `Admin/Governance/Charter.md` states the base's scope, stewardship, territory, Capital, and authority boundary.
- `Admin/Governance/Known Lands.md` distinguishes the territory's governed internal inventory from external lands known to this island.
- `Admin/Governance/Conventions/Conventions.md` points to the local authoring and classification conventions.
- `Admin/Operations/Processes/Enactment Process.md` defines the route from Stream proposal to canonical content.

The repository's always-loaded orientation anchors the Enactment gate: substantive changes to `Admin/`, `Pillars/`, and `Resources/` proceed through an approved Stream proposal. Calendar entries and inbound triage remain lightweight exceptions.

## Acquired-packet scaffold

While `ki-repo-kb-principal` is declared, the principal must carry the byte-exact `+/_ACQUIRED/README.md` from this skill's `assets/templates/acquired/README.md`. This overlay owns that scaffold; it is not required for ordinary knowledge bases. The literal path is independent of any base zone alias. Dropping the declaration ends this overlay's requirement without authorising removal of the README or packets.

AUDIT fails when the README is missing, differs from the template, or has an unsafe path. CONFORM proposes only that README: it creates a missing scaffold or restores a drifted regular file. Every existing ancestor must be a real directory and the leaf must be a regular file; symlinks, dangling symlinks and other file types fail without a repair proposal. Publication and concurrent-change protection belong to the host. Neither mode reads or changes packet contents, invents a dispatch record, or grants dispatch authority.

Acquire alone delivers packets: each delivery is a folder holding one whole capture package or a roll-up of whole packages, preserving original names and bytes without a manifest, dispatch ID or ledger. Delivery is acceptance. The receiver triages their local packets under `ki-repo-kb`; the scaffold does not authorise canonical adoption or change selection. There is no return route or return marker, and the receiver writes nothing into the port.

Publishing this overlay does not conform its receivers. The [rollout evidence](sources.md#acquired-scaffold-rollout) distinguishes accepted reusable delivery from receiver-owned applications; audit each declared principal under its own authority before claiming it conformed. The scaffold is not a dispatch precondition.

## Territorial declaration

Each territory has exactly one principal island holding its Capital role. The Charter identifies that territory and the Capital's canonical repository identity. Known Lands identifies internal members by canonical repository identity, such as `owner/repo`, and states their governed relationship. The two declarations must agree; discrepancies remain visible for the territorial owner to resolve.

Territory membership establishes shared governance without removing repository-specific audiences, access controls, canonical acceptance, or release boundaries. A repository's structure or subject expertise does not appoint it as a Capital. Local registry entries resolve checkouts and source-store locations; Territory-derived repository selection identifies a governed set and company bindings describe coordination. None independently establishes territorial membership or exchange permission.

## Known Lands relationships

The Capital's internal inventory is authoritative for its territory. External signposting describes this island's relationship to another authority, citing that authority without claiming jurisdiction over it. Keep the two relationships distinguishable through sections or explicit relationship labels; Markdown tables with canonical repository identities are sufficient. Checkout and source-store locations remain in the local registry rather than the portable inventory. Local unavailability does not remove an island from the governed inventory.

Any island may maintain a narrower Known Lands chart for topics, queries, captures, or work. Principal status is not required for signposting. A receiver may privately declare consumption or adoption of public knowledge without the publishing territory maintaining a reciprocal consumer list. The receiver chooses canonical adoption and updates; contribution back to the publisher follows its separate intake and acceptance rules. Restricted exchange requires the participating owners' explicit rules; shared territory, person, company, checkout, or repository selection alone does not grant permission.

## Boundary

The contract does not prescribe an island's name, language, integrations, pillar taxonomy, external-source classification, metadata keys, or a machine-readable territorial schema. Actual identities, membership, and authority remain locally governed content. A bootstrap preserves existing material and records a proposal to migrate it; it never silently relocates content into a canonical zone.
