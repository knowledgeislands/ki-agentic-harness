<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — the deprecated Paperclip coordination alias

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-agent-coordination-paperclip --write`.

Line-by-line criteria for auditing ki-agent-coordination-paperclip. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [ALIAS — Deprecated alias](#alias--deprecated-alias)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## ALIAS — Deprecated alias

→ [standard](../../ki-delegation-paperclip/references/standards-agent-coordination-paperclip.md)

The old declaration resolves for the tolerance window and names the new one.

- **ALIAS-1 [M] — the deprecated declaration names its replacement** — A `[skills.ki-agent-coordination-paperclip]` declaration is a deprecated alias of `ki-delegation-paperclip`, kept for the rename's tolerance window. It warns until the repository declares `[skills.ki-delegation-paperclip]` in its place; the Paperclip checks run only under the new declaration. (../../ki-delegation-paperclip/references/standards-agent-coordination-paperclip.md#organisation-identity)
  - _Remediation:_ diagnostic — Replace `[skills.ki-agent-coordination-paperclip]` with `[skills.ki-delegation-paperclip]` in `.ki.toml`, keeping `organisation_code`, then rerun the audit.
