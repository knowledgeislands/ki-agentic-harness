<!-- GENERATED FILE: edit scripts/rubric/items/, not this publication. -->

# Generated rubric — Knowledge Islands knowledge bases

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical; this file is generated from that catalogue.

## Contents

- [ZONE — zone layout](#zone--zone-layout)
- [CONFIG — KB configuration](#config--kb-configuration)
- [ADMIN — Admin zone](#admin--admin-zone)
- [ROUTE — routing and placement](#route--routing-and-placement)
- [NOTE — note conventions](#note--note-conventions)
- [MEM — memory cascade](#mem--memory-cascade)
- [LINK — base linking](#link--base-linking)

## ZONE — zone layout

→ [standard](standards.md)

Required zones, indexes, staging, and output placement.

- **ZONE-1 [M] — required zone layout** — Calendar/, Pillars/, Resources/, Streams/, and Admin/ are present, resolving each through a declared zone alias. (standards.md)
- **ZONE-2 [M] — same-name zone indexes** — Each present zone has its same-name index note. (standards.md)
- **ZONE-3 [M] — root memory index** — The resolved Admin zone carries MEMORY.md. (standards.md)
- **ZONE-4 [M] — staging areas are not zones** — +/ and -/ are reported as staging only and are exempt from the zone-index rule. (standards.md)
- **ZONE-5 [M] — produced outputs use outbound staging** — Notes with type session-digest or handoff reside under the resolved -/ staging area. (standards.md)

## CONFIG — KB configuration

→ [standard](standards.md)

The keyless marker and validate-down [ki-kb] configuration surface.

- **CONFIG-1 [M] — known scalar configuration keys** — Only required_frontmatter, preflight, and zones are recognised beneath [ki-kb]. (standards.md)
- **CONFIG-2 [M] — non-redundant zone aliases** — A zone alias does not restate its canonical folder name. (standards.md)
- **CONFIG-3 [M] — canonical zone alias keys** — Every [ki-kb.zones] key names a canonical zone or staging area. (standards.md)
- **CONFIG-4 [M] — KB configuration boundary** — The checker reads only the ki-kb table and can append its absent opt-in marker safely. (standards.md)
- **CONFIG-5 [M] — declared preflight paths** — Literal preflight paths resolve under the base; globs remain runtime-resolved. (standards.md)

## ADMIN — Admin zone

→ [standard](standards.md)

Optional Admin subdivisions and governance baseline.

- **ADMIN-1 [M] — optional Admin subdivisions** — When Governance/ or Operations/ is active, it has its same-name index; absent subdivisions warn only. (standards.md)
- **ADMIN-2 [M] — governance charter** — An active Admin/Governance/ directory carries Charter.md. (standards.md)
- **ADMIN-3 [M] — governance conformance record** — An active Admin/Governance/ directory carries Conformance.md. (standards.md)

## ROUTE — routing and placement

→ [standard](standards.md)

Judgment review of the knowledge-base routing test.

- **ROUTE-1 [J] — notes follow the routing test** — Notes are placed in the zone selected by their time-bound, active-work, settled-knowledge, or external-reference role.
  - _Review prompt:_ Does each sampled note sit in the zone selected by the routing test? (standards.md)

## NOTE — note conventions

→ [standard](standards.md)

Frontmatter mechanics and note-authoring judgment.

- **NOTE-1 [M + J] — declared required frontmatter** — When required_frontmatter is declared, each note with frontmatter carries those keys; otherwise key requirements remain a judgment call.
  - _Review prompt:_ When no required_frontmatter list is declared, are the required keys appropriate to this base and its host guidance? (standards.md)
- **NOTE-1a [M] — well-formed frontmatter fences** — Every opening frontmatter fence closes. (standards.md)
- **NOTE-1b [M] — snake_case frontmatter keys** — Top-level frontmatter keys use snake_case. (standards.md)
- **NOTE-2 [J] — note naming convention** — Calendar notes are dated and other note names follow the base convention.
  - _Review prompt:_ Do note names follow the base-specific naming convention? (standards.md)
- **NOTE-3 [J] — source and analysis distinction** — Facts are cited to a source path or reference, and analysis is labelled where the base distinguishes it.
  - _Review prompt:_ Are facts sourced and analysis labelled according to the base convention? (standards.md)

## MEM — memory cascade

→ [standard](standards.md)

Memory-index accuracy and its always-loaded anchor.

- **MEM-1 [J] — active-Pillar memory accuracy** — Admin/MEMORY.md lists the Pillars actually active in the base.
  - _Review prompt:_ Does the memory index accurately list active Pillars? (standards.md)
- **MEM-2 [M] — always-loaded memory cascade anchor** — Root CLAUDE.md or AGENTS.md anchors the memory cascade before substantive work. (standards.md)

## LINK — base linking

→ [standard](standards.md)

Judgment review of Obsidian wikilink content.

- **LINK-1 [J] — Obsidian note linking** — Base note content uses shortest-unique Obsidian wikilinks, with aliased full paths for contents lists.
  - _Review prompt:_ Do sampled base notes use the prescribed Obsidian wikilink convention? (standards.md)
