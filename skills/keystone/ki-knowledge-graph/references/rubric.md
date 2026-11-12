<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Knowledge-graph curation, tending and dispatch

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-knowledge-graph --write`.

Line-by-line criteria for auditing ki-knowledge-graph. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [CONFIG — Knowledge-graph configuration](#config--knowledge-graph-configuration)
- [CARD — Semantic Markdown cards](#card--semantic-markdown-cards)
- [CURATE — Transactional curation](#curate--transactional-curation)
- [GRAPH — Staging graph, layers and tending](#graph--staging-graph-layers-and-tending)
- [DISPATCH — Dispatch and authority](#dispatch--dispatch-and-authority)
- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)

## CONFIG — Knowledge-graph configuration

→ [standard](standards-knowledge-graph.md)

The method takes its layout from the knowledge base that declares it and accepts no configuration keys of its own.

- **CONFIG-1 [M] — the knowledge-graph method has no configuration properties** — Unexpected keys in the skill table are visible rather than silently accepted as staging-layout settings, which belong to the knowledge base’s own structure. (standards-knowledge-graph.md#the-staging-graph)
  - _Remediation:_ diagnostic — Remove unsupported keys; declare the staging layout in the knowledge base’s own structure.

## CARD — Semantic Markdown cards

→ [standard](standards-knowledge-graph.md)

Cards are judged on supplied card evidence; each says what one thing is, in the house card format.

- **CARD-1 [J] — front matter identifies the card and its status** — Every card carries id, title, type, status, territory and island, with status one of proposal, future-concept or agreed. (standards-knowledge-graph.md#cards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every card in the supplied evidence carry id, title, type, status, territory and island, with a status from the closed list?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **CARD-2 [J] — links are typed only where an assertion is meant** — A front-matter links entry pairs a reference with a real predicate; unannotated links stay navigational, and link definitions hold only destinations at the bottom of the card. (standards-knowledge-graph.md#cards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every predicate express an intended assertion from an established vocabulary or the ki: prefix, with no invented predicate on a navigational link?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **CARD-3 [J] — one authoritative definition per concept within a territory** — Other cards give short context and link to the defining card rather than repeat it, and no card is made for every noun. (standards-knowledge-graph.md#cards, standards-knowledge-graph.md#tending)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is each concept defined once within its territory, with other cards linking to that definition, and does every card earn its place?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **CARD-4 [J] — cards stand alone and keep method out** — No card links to a capture or has a body origin section; any origin is one plain front-matter line; meetings are sources, future ideas are future concepts, and method links to the skill rather than being restated. (standards-knowledge-graph.md#cards)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every card avoid capture links and body origin sections, treat meetings as sources and future ideas as future concepts, and leave curation, tending and dispatch method to the skill?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## CURATE — Transactional curation

→ [standard](standards-knowledge-graph.md)

Curation is judged on the captures and the commits that worked them; a mechanical pass does not prove faithful curation.

- **CURATE-1 [J] — each curation commit pairs the card change with its strike-through** — One bounded item per commit: the card change and the whole part struck in its capture, original text kept inside the strike and a note naming every destination; a dropped part has its own considered-and-dropped commit with a reason. (standards-knowledge-graph.md#transactional-curation)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does each curation commit carry one item’s card change together with its strike-through and destination note, and each dropped part its own commit and reason?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **CURATE-2 [J] — every destination named in a strike note exists** — A struck part names its destinations, each of which resolves to a card; a part several areas need stays unstruck with its done and pending areas named. (standards-knowledge-graph.md#transactional-curation)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every strike note name destinations that exist, and does every partly curated part stay unstruck with what is done and pending?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **CURATE-3 [J] — captures are deleted only when wholly struck** — No capture is deleted while it holds an unstruck part, and a capture holding a part marked capture-only is never deleted. (standards-knowledge-graph.md#transactional-curation)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was every deleted capture wholly struck, with no capture deleted that held a capture-only part?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **CURATE-4 [J] — curation keeps what is durable at the agreed pace** — Positions, proposals and commitments are kept with the organisation holding each, the moment’s detail stays in the capture, and curation takes today first, then one day back at a time with a report after each. (standards-knowledge-graph.md#the-funnel, standards-knowledge-graph.md#transactional-curation)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Did curation keep durable positions and commitments against organisations, leave ephemeral detail in the capture, and follow the today-first, one-day-back pace with reports?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## GRAPH — Staging graph, layers and tending

→ [standard](standards-knowledge-graph.md)

The staging graph and its layers are judged on supplied evidence; folder and zone structure is the knowledge base’s own.

- **GRAPH-1 [J] — routing links run one way** — Routing cards may link into captures and staged cards, but nothing in a capture links into the routing cards. (standards-knowledge-graph.md#the-staging-graph)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does any capture link into a routing card?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **GRAPH-2 [J] — shadow nodes are read-only pointers that record their check** — Each shadow node records the card it shadows, where that card lives and when it was last checked, and carries no knowledge of its own. (standards-knowledge-graph.md#layered-graphs-and-shadow-nodes)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does every shadow node name its subject, where it lives and its last check, and hold no content that should be edited through it?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **GRAPH-3 [J] — the layer above is consulted before a card is grown** — A new card is grown only after checking the layer above; a suitable card there is brought down as a shadow and grown off, never duplicated. (standards-knowledge-graph.md#layered-graphs-and-shadow-nodes)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ For each new card, was the layer above checked first, and does no new card duplicate an attachment point or settled card above?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **GRAPH-4 [J] — pruning keeps each area’s touch point** — Shadow nodes are pruned only in untended areas after a few rounds of use, and every live area keeps its one shadow at its touch point. (standards-knowledge-graph.md#layered-graphs-and-shadow-nodes, standards-knowledge-graph.md#tending)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Were pruned shadows in untended areas only, and does every live area keep one shadow node where it touches the layer above?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## DISPATCH — Dispatch and authority

→ [standard](standards-knowledge-graph.md)

Dispatch is judged on the moves and the approvals they cite.

- **DISPATCH-1 [J] — dispatch is an approved Git move that leaves a shadow** — Each package moves by Git into the receiving island’s +/_ACQUIRED/ as its own folder, under an approval naming it, with no ledger, and each dispatched card leaves a shadow node behind. (standards-knowledge-graph.md#dispatch, standards-knowledge-graph.md#layered-graphs-and-shadow-nodes)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was every dispatch a Git move into the receiver’s +/_ACQUIRED/ under an approval naming the package, with no ledger, leaving a shadow node for each card?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **DISPATCH-2 [J] — holding areas dispatch nothing and authority stays separate** — No package leaves a graph declared a holding area, and receiver reconciliation, source deletion and history compaction each had their own grant. (standards-knowledge-graph.md#dispatch)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Did nothing leave a declared holding area, and did every reconciliation, deletion or history change rest on its own grant?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.

## RUBRIC — Generated rubric publication

→ [standard](../../ki-skills/references/standard-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication)
  - _Remediation:_ automatic
