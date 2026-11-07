# Knowledge-graph standard

How deposited and captured material becomes a semantic knowledge graph: the funnel from Deposit to dispatch, the card format, curating one item at a time, the staging graph, layered graphs and their shadow nodes, tending, and dispatch to the island that owns the knowledge. This standard holds the method; the graph keeps the things that are, under SKILLS-OVER-GRAPH (Kris, 7 November 2026), and the concepts it relies on, such as Semantic Markdown, layered graphs and territories, stay cards in the graph.

## Contents

1. [The funnel](#the-funnel)
2. [Cards](#cards)
3. [Transactional curation](#transactional-curation)
4. [The staging graph](#the-staging-graph)
5. [Layered graphs and shadow nodes](#layered-graphs-and-shadow-nodes)
6. [Tending](#tending)
7. [Dispatch](#dispatch)
8. [Boundary](#boundary)

## The funnel

The knowledge capture funnel takes in what it is given without losing the detail that matters. It starts at Deposit: material is sorted first by D12, and only what D12 deposits enters the funnel; what is delegated or deleted there leaves without entering it. The funnel then has three stages, each with its owner:

| Stage | What happens | Owner |
| --- | --- | --- |
| Capture | Material comes in faithfully, with its source, date, scope and originals, without deciding what it means | The `ki-acquire` skill and its provider skills |
| Curate | Durable knowledge is drawn out of each capture, one item at a time, into cards in a staging graph, and tended there | This standard |
| Dispatch | Settled cards move to the island that owns them | This standard, with the receiving island's own triage |

Each capture is filed under one primary territory, but its knowledge may go to several territories as it is curated, wherever the context fits.

**Pace.** Each day the newest material is curated first, so the funnel keeps up with what arrives. With spare capacity, curation takes one more day back from the newest day not yet done, one day at a time, with a report after each, so the cost is seen before it carries on. Capture is never held back while curation waits. Material held awaiting incorporation is worked back the same way, newest first, without bulk moves to classify it.

## Cards

A card is one Semantic Markdown file: one coherent, addressable knowledge resource about one thing.

- **Front matter.** Every card carries `id`, `title`, `type` and `status`, and the territory and island it belongs to. `status` is `proposal`, `future-concept` or `agreed`, so an idea is never mistaken for adopted practice.
- **Typed links.** A front-matter `links` map pairs a reference identifier with an RDF predicate, drawn from an established vocabulary or the `ki:` prefix, where an explicit semantic assertion is meant. A link without an entry stays navigational and is never given an invented predicate. Link definitions sit at the bottom of the card and hold only destinations; the descriptive link text stays in the prose.
- **One definition per concept.** Within a territory, each concept has one authoritative card; other cards give short context and link to it. The same card may also sit in another territory where it applies, and different islands may keep distinct interpretations.
- **No card for every noun.** Links are enriched a little at a time; a relationship is written only where it means something, and plain links can be annotated later.
- **The thing, not the card.** A card describes the thing it is named after, and its type is the thing's type, not "document".
- **Origin.** A card has no origin section in its body. Where its origin would help someone check it later, its front matter gives it in one plain `origin:` line; otherwise it has none.
- **No links into captures.** A card never links to a capture, because the capture is transient; what the card needs in order to be checked travels in the card.
- **Meetings are sources.** A meeting's decisions and concepts become cards; the meeting itself is not a card and may be named as an `origin:`.
- **Future ideas.** An idea for later becomes a card with `status: future-concept`, not roadmap work; only an idea being acted on now becomes work.
- **Sensitivity.** A card may carry `sensitive: true` with `sensitivity: <reason>`, weighed whenever the card would be used outside its own island; most cards carry neither.
- **Method stays out.** A card says what a thing is. How to curate, tend or dispatch is this skill's, and a card that holds such method links to the skill instead.

## Transactional curation

Curation is judgement-led and incremental: knowledge is curated in small, verifiable increments, never by waiting for a whole capture. A part of a capture is a paragraph or a list item.

1. **Take one bounded item** from one capture, and look for an existing authoritative card, in the layer above first and then in this graph.
2. **Distil, qualify, relate and integrate** it, keeping decisions, hypotheses and open questions distinct.
3. **Verify** its meaning, internal links, predicates and any `origin:` line.
4. **Commit together** the card change and the item's strike-through in its capture: the whole part struck, its original text kept inside the strike, followed on the next line by a note naming every destination.
5. **Drop deliberately.** A part not worth keeping, or too detailed, is struck in its own "considered and dropped" commit, with a note giving the reason.
6. **Delete the capture** only once every part in it is struck. A part several areas need stays unstruck, its note naming what is done and what is pending, until the last area is done. A capture holding a part marked capture-only is never deleted.

Curation keeps what is durable and leaves the rest in the capture: the positions, proposals and commitments, and which organisation holds each, rather than who attended, for how long, people's titles or the tactics of the moment. Responsibilities are recorded against organisations, not people. The commit pairing a card change with its strike-through is the audit trail while the work stays in the staging repository; Git history does not travel with knowledge across repositories.

## The staging graph

Curated knowledge is staged before it is settled. In the staging graph, cards, ids and structure may change as the graph is shaped: cards may be renamed, merged or split. A card moves to its receiving island only once its structure has settled, and from then on its id stays stable.

The staging graph mirrors each receiving island, so a staged card's place says where it would land. The folders and zones that achieve this, and how the staging knowledge base declares them, are the knowledge base's structure, which the `ki-repo-kb` skill governs; this standard does not define them.

Routing cards that say where material belongs may link into captures and staged cards, but nothing in a capture links into the routing cards: the links run one way only.

## Layered graphs and shadow nodes

Each repository keeps its own knowledge graph, and graphs join in layers rather than by copying. The canonical graph sits above; a graph still forming sits below, holding what is still being captured and curated and pointing up for what is settled. Each island keeps authority over its own cards.

- **Attachment point.** A graph declares the cards it is fully confident will not move, which other graphs may pin to. Declaring one promises a stable id and path, with a deprecation pointer rather than removal if it ever has to change.
- **Shadow node.** A lower graph brings an attachment point in as a shadow node: a read-only pointer that records the card it shadows, where that card lives, and when it was last checked. The lower graph hangs its own cards off the shadow, and nobody edits the shadow's subject through it.
- **Promotion.** When a lower graph's card settles, it is promoted to the graph above, by dispatch, and its place below becomes a shadow node.

Shadow nodes have a life cycle:

1. **Lift.** When a card is promoted, its shadow stays behind, so links into the lower graph still resolve.
2. **Prune.** After a few rounds of use, shadows in areas no longer tended are pruned. Nothing is lost, because the real card lives above.
3. **Touch point.** Each area keeps one shadow node at its peripheral point, where the lower layer touches the layer above, and that shadow is never pruned while the area exists.
4. **Look up before you grow.** Before growing a new card, check the layer above for a suitable one; if there is one, bring it down as a shadow and grow off it rather than build a duplicate.
5. **Regrow.** A pruned shadow can always be grown back.

## Tending

Tending checks over time that the graph stays coherent, meaningfully connected, free of duplicates, qualified where it should be, and reachable through progressive disclosure: a reader or agent meets a coherent summary before deeper detail. Relationships between cards are knowledge in their own right; their type, direction and provenance stay accessible wherever they are written. Tending merges duplicate definitions, splits cards that hold more than one thing, renames while ids can still change, finds cards no link reaches, and prunes untended shadow nodes under the life cycle above. Measures of the graph's reach, duplication and comprehension are future work for the tools that would compute them, not part of this standard.

## Dispatch

Dispatch is a Git move of each package, a single capture's cards or a chosen roll-up, from the staging graph into the receiving island's `+/_ACQUIRED/`, as its own folder. Delivery is acceptance: the receiver's commit and the staging repository's removal commit are the only record, with no dispatch ledger or return route, and a misdelivery is handled case by case. The receiving island then triages what it received under its own authority. Each dispatched card leaves a shadow node in the staging graph. A graph declared a holding area dispatches nothing while the declaration stands.

Evidential material kept word for word travels as it is and is never edited. Curation authority does not grant dispatch, receiver reconciliation, source deletion or history compaction; each needs its own grant, and history is never rewritten to hide a failure.

## Boundary

| Matter | Owner |
| --- | --- |
| Sorting before Deposit, and the Deposit routes | The `ki-dodecakrisis` skill |
| Faithful capture, coverage, originals, provider rules and the capture package | The `ki-acquire` skill and its provider skills |
| Folders, zones and zone aliases of any knowledge base, the staging base's included | The `ki-repo-kb` skill |
| Prose style of a card | The `ki-authoring` skill |
| A receiving island's disposition of what it was sent | The `ki-next` skill |
| Rules for evidential material | The future legal evidential skill |
| Running imports and repository-local checks | The repository that runs them |
