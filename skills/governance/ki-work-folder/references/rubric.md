<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — the deprecated work-folder alias

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-work-folder --write`.

Line-by-line criteria for auditing ki-work-folder. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [ALIAS — Deprecated alias](#alias--deprecated-alias)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## ALIAS — Deprecated alias

→ [standard](../../ki-work-package/references/standards-work-package.md)

The old declaration resolves for the tolerance window and names the new one.

- **ALIAS-1 [M] — the deprecated declaration names its replacement** — A `[skills.ki-work-folder]` declaration is a deprecated alias for `ki-work-package`, kept for the rename's tolerance window. It warns until the repository declares `[skills.ki-work-package]` in its place; the work-package checks run only under the new declaration. (../../ki-work-package/references/standards-work-package.md#activation-and-ownership)
  - _Remediation:_ diagnostic — Replace `[skills.ki-work-folder]` with `[skills.ki-work-package]` in `.ki.toml`, then rerun the audit.
