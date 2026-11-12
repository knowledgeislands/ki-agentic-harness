# Knowledge-graph standard

A knowledge graph is cards about things, joined by typed links, kept in a repository. It serves any use: a skill's body of knowledge, an island's settled knowledge, or material being curated from captures. Curation is one use, and the relationships geared to it are some of the graph's, not its limit (KG-GENERAL, Kris, 12 November 2026). This standard sets what every graph shares: its root definition, its cards and links, its subgraphs and how graphs layer; it then sets the curation method for the graphs that are built from captures.

The standard holds the method, and a graph keeps the things that are, under SKILLS-OVER-GRAPH (Kris, 7 November 2026). The concepts the standard relies on, such as Semantic Markdown, layered graphs and progressive disclosure, are cards in the skill's own graph, which [its root definition](_graph.md) opens; the standard follows those cards rather than restating them (KG-SELF).

## Contents

1. [The graph](#the-graph)
2. [The root definition](#the-root-definition)
3. [Cards](#cards)
4. [Links](#links)
5. [Subgraphs](#subgraphs)
6. [Layered graphs and shadow nodes](#layered-graphs-and-shadow-nodes)
7. [Curation](#curation)
8. [Boundary](#boundary)

## The graph

Each knowledge graph sits in one root folder, which holds its root definition and its cards.

- **Flat by default.** A graph needs no folders: its cards may sit as one flat list in the root folder, like rows in a table. Folders are an option for a large graph, never a requirement, and how a graph is seen is the visualisation's job, not its folders' (KG-FLAT).
- **Identity by id.** A card's identity is its id, never its folder, so moving a graph, or a card between folders, breaks no link. An id is short and readable: lowercase letters, digits and hyphens, never a UUID. Within a graph, every id is unique.
- **A card's file is its id.** The file is `<id>.md`, so file, link and id are one name; the card type stays in the front matter, not in the name (FILE-NAME). Where a graph has subgraphs, the id carries the subgraph before a dot, as `industry.session`, `anthropic.session` and `spec.mcp`.
- **Other files.** A root folder may also hold files that are not cards, such as a skill's standards and sources beside its graph. A file is a card only when its front matter carries an `id` equal to its file name; the root definition says what else sits beside the cards.

[Back to contents](#contents)

## The root definition

A graph defines itself at its root (KG-ROOT). The root definition is the card `_graph.md` in the root folder, of card type `graph` (ROOT-FORM). It is the one card whose file is not named from its id: its file is always `_graph.md`, and its `id` names the graph.

Its front matter carries `id`, `title`, `type: graph` and `status`, with any further properties the graph itself declares for every card. Its body opens with what the graph is for, then has these sections, in this order:

| Section | What it declares |
| --- | --- |
| **Card types** | Every card type the graph supports, what a card of that type is about, and the properties it requires beyond the shared ones. A type not declared here is not used. |
| **Link vocabulary** | The vocabularies its link predicates are drawn from, each prefix with its namespace, and the predicates in use. SKOS, the W3C standard for vocabularies, is the default; another established vocabulary, such as Dublin Core terms, may be declared where SKOS has no term; the `ki:` prefix is only for what no declared vocabulary has (LINK-VOCAB). |
| **Properties** | Every front-matter property cards carry, what it means, its values and which card types require it. |
| **Constraints** | The rules a card must meet beyond this standard, such as an order of reading or a word kept off every card. |
| **Subgraphs** | Each subgraph, its id prefix and its subject; a graph with no subgraphs says so. |
| **Extent and limitations** | What the graph covers and does not, what sits in the root folder beside the cards, and the cards still pending, each named by the id it will take. |

A section may say "None" but is never left out. The root definition holds declarations, not knowledge: a concept the graph is about is a card of its own, and the root definition links to the cards a reader should start from.

[Back to contents](#contents)

## Cards

A card is one Semantic Markdown file: one coherent, addressable knowledge resource about one thing.

- **Front matter.** Every card carries `id`, `title`, `type` and `status`, and the further properties its graph's root definition requires of its type. `type` is a card type the root definition declares.
- **Status.** `status` is `proposal`, `future-concept` or `agreed`, so an idea is never mistaken for adopted practice.
- **One definition per concept.** Within a graph, each concept has one authoritative card; other cards give short context and link to it. The same card may also sit in another graph where it applies, and different islands may keep distinct interpretations.
- **No card for every noun.** Links are enriched a little at a time; a relationship is written only where it means something, and plain links can be annotated later.
- **The thing, not the card.** A card describes the thing it is named after, and its type is the thing's type, not "document".
- **Purpose first.** Where a graph's root definition asks for it, a card says first what the thing achieves, then what it is and how it is built.
- **Origin.** A card has no origin section in its body. Where its origin would help someone check it later, its front matter gives it in one plain `origin:` line; otherwise it has none.
- **No links into captures.** A card never links to a capture, because the capture is transient; what the card needs in order to be checked travels in the card.
- **Meetings are sources.** A meeting's decisions and concepts become cards; the meeting itself is not a card and may be named as an `origin:`.
- **Future ideas.** An idea for later becomes a card with `status: future-concept`, not roadmap work; only an idea being acted on now becomes work.
- **Sensitivity.** A card may carry `sensitive: true` with `sensitivity: <reason>`, weighed whenever the card would be used outside its own island; most cards carry neither.
- **Method stays out.** A card says what a thing is. How to curate, tend or dispatch is this skill's, and a card that holds such method links to the skill instead.

[Back to contents](#contents)

## Links

- **Typed links.** A front-matter `links` map pairs a reference label with a predicate where an explicit semantic assertion is meant. Each predicate is drawn from a vocabulary the root definition declares: SKOS by default, as `skos:related`, `skos:broader`, `skos:exactMatch` or `skos:closeMatch`, and `ki:` only for a relationship no declared vocabulary has.
- **Navigational links.** A link without an entry stays navigational and is never given an invented predicate.
- **Definitions at the bottom.** Link definitions sit at the bottom of the card and hold only destinations; the descriptive link text stays in the prose. Within a graph, a link's destination is the target card's file, `<id>.md`, and its label is best the target's id.
- **No links into part of a card.** A link that would need part of a card, such as an anchor to one of its sections, shows the card should be split, so each part that is linked to is a card of its own. Links into parts of cards are brittle and are not made (KG-GRAIN).
- **Relationships are knowledge.** A relationship's type, direction and provenance stay accessible wherever it is written.

[Back to contents](#contents)

## Subgraphs

A subgraph is a part of a graph with its own subject, declared in the root definition, and its cards' ids carry its prefix (KG-SUBGRAPHS).

- **Usage beside the standard term.** Where outside parties use their own words for something a graph defines, the graph's own terms form one subgraph and each party has a subgraph of its own. In a vocabulary of agentic terms, the industry's terms are one subgraph and each vendor, such as Anthropic or OpenAI, another; OpenAI's thread and Anthropic's session are cards in their vendors' subgraphs, each pointing to the industry's session.
- **Synonyms and senses are links.** A party's word that means the same as a term links to it, as with `skos:exactMatch` or `skos:closeMatch`; a word that is narrower than the term says so with `skos:broadMatch`, one that is broader with `skos:narrowMatch`, and one only related with `skos:relatedMatch`, each predicate reading from the card that holds it to its target; a name used in more than one sense links once for each sense. Synonyms and senses are not lists in a card's prose.
- **Comparison through subgraphs.** How a party differs from the standard term, or from another party, is said by the links between the subgraphs, so a comparison is read from the graph rather than restated on each card.
- **Balance.** How fine each node is stays a matter of balance: a card for each word and sense that is linked to, and no more.

[Back to contents](#contents)

## Layered graphs and shadow nodes

Each repository keeps its own knowledge graph, and graphs join in layers rather than by copying. The canonical graph sits above; a graph still forming sits below, holding what is still being captured and curated and pointing up for what is settled. Each island keeps authority over its own cards.

- **Attachment point.** A graph declares the cards it is fully confident will not move, which other graphs may pin to. Declaring one promises a stable id, with a deprecation pointer rather than removal if it ever has to change.
- **Shadow node.** A lower graph brings an attachment point in as a shadow node: a read-only pointer that records the card it shadows, where that card lives, and when it was last checked. The lower graph hangs its own cards off the shadow, and nobody edits the shadow's subject through it.
- **Promotion.** When a lower graph's card settles, it is promoted to the graph above, by dispatch, and its place below becomes a shadow node.

Shadow nodes have a life cycle:

1. **Lift.** When a card is promoted, its shadow stays behind, so links into the lower graph still resolve.
2. **Prune.** After a few rounds of use, shadows in areas no longer tended are pruned. Nothing is lost, because the real card lives above.
3. **Touch point.** Each area keeps one shadow node at its peripheral point, where the lower layer touches the layer above, and that shadow is never pruned while the area exists.
4. **Look up before you grow.** Before growing a new card, check the layer above for a suitable one; if there is one, bring it down as a shadow and grow off it rather than build a duplicate.
5. **Regrow.** A pruned shadow can always be grown back.

[Back to contents](#contents)

## Curation

Curation is the use of a graph that turns deposited and captured material into cards: the funnel from Deposit to dispatch, curating one item at a time, the staging graph, tending and dispatch to the island that owns the knowledge. A graph built another way, such as a skill's body of knowledge settled by decision, uses the rest of this standard without this section, though tending applies to every graph.

### The funnel

The knowledge capture funnel takes in what it is given without losing the detail that matters. It starts at Deposit: material is sorted first by D12, and only what D12 deposits enters the funnel; what is delegated or deleted there leaves without entering it. The funnel then has three stages, each with its owner:

| Stage | What happens | Owner |
| --- | --- | --- |
| Capture | Material comes in faithfully, with its source, date, scope and originals, without deciding what it means | The `ki-acquire` skill and its provider skills |
| Curate | Durable knowledge is drawn out of each capture, one item at a time, into cards in a staging graph, and tended there | This standard |
| Dispatch | Settled cards move to the island that owns them | This standard, with the receiving island's own triage |

Each capture is filed under one primary territory, but its knowledge may go to several territories as it is curated, wherever the context fits.

**Pace.** Each day the newest material is curated first, so the funnel keeps up with what arrives. With spare capacity, curation takes one more day back from the newest day not yet done, one day at a time, with a report after each, so the cost is seen before it carries on. Capture is never held back while curation waits. Material held awaiting incorporation is worked back the same way, newest first, without bulk moves to classify it.

### Transactional curation

Curation is judgement-led and incremental: knowledge is curated in small, verifiable increments, never by waiting for a whole capture. A part of a capture is a paragraph or a list item.

1. **Take one bounded item** from one capture, and look for an existing authoritative card, in the layer above first and then in this graph.
2. **Distil, qualify, relate and integrate** it, keeping decisions, hypotheses and open questions distinct.
3. **Verify** its meaning, internal links, predicates and any `origin:` line.
4. **Commit together** the card change and the item's strike-through in its capture: the whole part struck, its original text kept inside the strike, followed on the next line by a note naming every destination.
5. **Drop deliberately.** A part not worth keeping, or too detailed, is struck in its own "considered and dropped" commit, with a note giving the reason.
6. **Delete the capture** only once every part in it is struck. A part several areas need stays unstruck, its note naming what is done and what is pending, until the last area is done. A capture holding a part marked capture-only is never deleted.

Curation keeps what is durable and leaves the rest in the capture: the positions, proposals and commitments, and which organisation holds each, rather than who attended, for how long, people's titles or the tactics of the moment. Responsibilities are recorded against organisations, not people. The commit pairing a card change with its strike-through is the audit trail while the work stays in the staging repository; Git history does not travel with knowledge across repositories.

### The staging graph

Curated knowledge is staged before it is settled. In the staging graph, cards, ids and structure may change as the graph is shaped: cards may be renamed, merged or split. A card moves to its receiving island only once its structure has settled, and from then on its id stays stable.

The staging graph mirrors each receiving island, so a staged card's place says where it would land. The folders and zones that achieve this, and how the staging knowledge base declares them, are the knowledge base's structure, which the `ki-repo-kb` skill governs; this standard does not define them.

Routing cards that say where material belongs may link into captures and staged cards, but nothing in a capture links into the routing cards: the links run one way only.

### Tending

Tending checks over time that a graph stays coherent, meaningfully connected, free of duplicates, qualified where it should be, and reachable through progressive disclosure: a reader or agent meets a coherent summary before deeper detail. Tending merges duplicate definitions, splits cards that hold more than one thing or are linked to in part, renames while ids can still change, finds cards no link reaches, and prunes untended shadow nodes under the life cycle above. Measures of a graph's reach, duplication and comprehension are future work for the tools that would compute them, not part of this standard.

### Dispatch

Dispatch is a Git move of each package, a single capture's cards or a chosen roll-up, from the staging graph into the receiving island's `+/_ACQUIRED/`, as its own folder. Delivery is acceptance: the receiver's commit and the staging repository's removal commit are the only record, with no dispatch ledger or return route, and a misdelivery is handled case by case. The receiving island then triages what it received under its own authority. Each dispatched card leaves a shadow node in the staging graph. A graph declared a holding area dispatches nothing while the declaration stands.

Evidential material kept word for word travels as it is and is never edited. Curation authority does not grant dispatch, receiver reconciliation, source deletion or history compaction; each needs its own grant, and history is never rewritten to hide a failure.

[Back to contents](#contents)

## Boundary

| Matter | Owner |
| --- | --- |
| Sorting before Deposit, and the Deposit routes | The `ki-dodecakrisis` skill |
| Faithful capture, coverage, originals, provider rules and the capture package | The `ki-acquire` skill and its provider skills |
| Folders, zones and zone aliases of any knowledge base, the staging base's included | The `ki-repo-kb` skill |
| How a skill holds a graph, and the knowledge kind of skill | The `ki-skills` skill |
| Prose style of a card | The `ki-authoring` skill |
| A receiving island's disposition of what it was sent | The `ki-next` skill |
| Rules for evidential material | The future legal evidential skill |
| Running imports and repository-local checks | The repository that runs them |
