<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Exchange dynamics analysis and rendering

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-exchange-dynamics --write`.

Line-by-line criteria for auditing ki-exchange-dynamics. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CONFIG — Exchange dynamics configuration](#config--exchange-dynamics-configuration)
- [ANALYSIS — Analyses and their contract](#analysis--analyses-and-their-contract)
- [SAFE — Safeguards and privacy](#safe--safeguards-and-privacy)
- [RENDER — Renderings](#render--renderings)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CONFIG — Exchange dynamics configuration

→ [standard](standards-exchange-dynamics.md)

The method finds analyses by their file name and accepts no configuration keys of its own.

- **CONFIG-1 [M] — the exchange dynamics method has no configuration properties** — Unexpected keys in the skill table are visible rather than silently accepted as settings the method does not read. (standards-exchange-dynamics.md#the-analysis-contract)
  - _Remediation:_ diagnostic — Remove unsupported keys; an analysis carries its own rendering requests.

## ANALYSIS — Analyses and their contract

→ [standard](standards-exchange-dynamics.md)

Committed analyses are checked against the contract mechanically; the quality of the reading is judged on the analysis and its source.

- **ANALYSIS-1 [M] — every committed analysis passes the contract** — Each `analysis.json` that claims to be an exchange dynamics analysis conforms to the schema, and its speakers, phases, bands, citations and quotations cross-reference cleanly. (standards-exchange-dynamics.md#the-analysis-contract)
  - _Remediation:_ diagnostic — Run `bun scripts/validate-analysis.ts <analysis.json>` from the skill and repair the analysis, never its renderings, until it passes.
- **ANALYSIS-2 [J] — events are chosen for what they change** — Selected events are the contributions that move the exchange, a new position, a challenge, a concession or a turn, in a number that fits the exchange, not an even sample. (standards-exchange-dynamics.md#method)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each selected event change the exchange, and is any contribution that turned it left out?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ANALYSIS-3 [J] — the four layers stay apart** — Observation, interpretation, inference and uncertainty are kept distinct; every inference is marked as one and no motive is stated as fact. (standards-exchange-dynamics.md#the-four-layers)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is every possible motive marked as inference, and is what was said kept apart from what it is taken to mean?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ANALYSIS-4 [J] — sentiment and tension are read independently** — Each score has a basis that justifies it on its own axis, and the two axes are allowed to move apart where the material does. (standards-exchange-dynamics.md#method)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every sentiment and tension score carry a basis that justifies it, without one axis being derived from the other?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **ANALYSIS-5 [J] — phases and conclusions come from the material** — Phase boundaries follow real shifts in the dynamics, and every takeaway, participant reading and overall conclusion traces to the events it cites. (standards-exchange-dynamics.md#method, standards-exchange-dynamics.md#safeguards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Do the phase boundaries match shifts in the material, and does each cited event actually support the conclusion that cites it?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## SAFE — Safeguards and privacy

→ [standard](standards-exchange-dynamics.md)

The ten mandatory principles, the sensitive tier and the privacy rules are judged on the analysis, its source and where both are kept.

- **SAFE-1 [J] — participants are described by behaviour in this exchange** — Participant readings describe communication style within the exchange, separate experience from observable behaviour and make no claim about personality. (standards-exchange-dynamics.md#method, standards-exchange-dynamics.md#safeguards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every participant reading stay with behaviour in this exchange, with evidence and an alternative where one is plausible?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **SAFE-2 [J] — no narrative is forced and gaps are named** — The analysis neither forces escalation nor resolution, keeps alternative interpretations the evidence supports, and names an incomplete transcript or missing context. (standards-exchange-dynamics.md#safeguards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Are the stated completeness and missing context honest, and are supported alternative readings kept rather than resolved away?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **SAFE-3 [J] — sensitive exchanges take the stronger tier** — A legal, employment or otherwise sensitive exchange is marked so and meets the stronger tier: cited messages for every event, alternatives for every participant, no inference in a shared rendering, and no sharing without the owner’s word. (standards-exchange-dynamics.md#safeguards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is the sensitivity marked correctly, and where it is sensitive or legal, does the analysis meet every requirement of the stronger tier?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **SAFE-4 [J] — the analysis keeps its source’s privacy** — The analysis is kept where its source is kept; a rendering for anyone outside the exchange names no real person without consent; published examples are wholly invented. (standards-exchange-dynamics.md#privacy)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is the analysis stored in its source’s privacy tier, and does every shared rendering or example use invented names or role labels unless consent is recorded?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RENDER — Renderings

→ [standard](standards-exchange-dynamics-rendering.md)

Renderings are judged against the analysis they claim to draw and the rendering standard.

- **RENDER-1 [J] — a rendering draws its analysis and adds nothing** — Every quotation, score, phase and conclusion shown comes from the analysis; a change of reading is made in the analysis and rendered afresh. (standards-exchange-dynamics.md#workflow, standards-exchange-dynamics-rendering.md)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the rendering show anything the analysis does not hold, or differ from it anywhere?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **RENDER-2 [J] — colour encodes tension only, always with a label** — One green, yellow, amber and red scale runs through chronology, graph and phases, never says who was right, is paired with text and holds its contrast in light and dark. (standards-exchange-dynamics-rendering.md#colour)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is colour used only for tension on the standard scale, paired with a text label and legible in both themes?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **RENDER-3 [J] — participants are shown honestly and the rendering can be reproduced** — Avatars appear only where supplied and appropriate, with initials otherwise and no invented likeness, and a design-decisions record names the analysis, renderer, variant and instructions. (standards-exchange-dynamics-rendering.md#reference-layout, standards-exchange-dynamics-rendering.md#design-decisions)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Are participants shown without invented likenesses, and could another model reproduce the rendering from its design-decisions record?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic
