<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Faithful ChatGPT conversation capture

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-acquire-chatgpt --write`.

Line-by-line criteria for auditing ki-acquire-chatgpt. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [SOURCE — ChatGPT source and coverage](#source--chatgpt-source-and-coverage)
- [ROUTING — ChatGPT routing](#routing--chatgpt-routing)
- [FIDELITY — ChatGPT capture fidelity](#fidelity--chatgpt-capture-fidelity)
- [RETIRE — ChatGPT source retirement](#retire--chatgpt-source-retirement)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## SOURCE — ChatGPT source and coverage

→ [standard](standards-chatgpt-acquisition.md)

Readable source only, honest coverage, and the end point in the digest front matter.

- **SOURCE-1 [J] — readable source is authorised and explicit** — Captures use readable conversation text or an official export and never treat opaque local records, browser scraping, or undocumented private APIs as content. (standards-chatgpt-acquisition.md#readable-source)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the evidence show a readable, authorised source and stop where none was available?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **SOURCE-2 [J] — the end point lives in the digest front matter** — Each capture records its inclusive last substantive message, scope, sequence, and previous capture in its README front matter, with no separate mark file. (standards-chatgpt-acquisition.md#coverage-and-end-point)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the front matter state an evidenced end point, and did retries no-op, finish in place, or start a linked segment accordingly?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## ROUTING — ChatGPT routing

→ [standard](standards-chatgpt-acquisition.md)

Routes from project and conversation evidence, with unknown routes left visible.

- **ROUTING-1 [J] — unknown and conflicting routes stay visible** — Project names and conversation evidence inform the route; unknown or conflicting routes remain open for review rather than defaulting. (standards-chatgpt-acquisition.md#routing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was the route evidenced, with any unknown or conflicting route left visible for review?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## FIDELITY — ChatGPT capture fidelity

→ [standard](standards-chatgpt-acquisition.md)

Faithful digests with honest dates, exact attachments, and explicit omissions.

- **FIDELITY-1 [J] — the digest is faithful** — Reasoning, decisions, corrections, and uncertainty are preserved, dates are evidenced or unknown, and required attachments are exact originals or listed omissions. (standards-chatgpt-acquisition.md#fidelity)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the capture keep source statements and interpretation distinct without fabricating dates, messages, or URLs, and preserve or list every attachment?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RETIRE — ChatGPT source retirement

→ [standard](standards-chatgpt-acquisition.md)

Separate release authority and current evidence.

- **RETIRE-1 [J] — retirement is separately authorised** — Acquisition remains read-only; archiving or deleting a conversation needs a separate current decision, a verified capture at a named Git revision, and immediate human approval. (standards-chatgpt-acquisition.md#source-retirement)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does proposed retirement refuse stale or incomplete evidence and stop for explicit human approval?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
