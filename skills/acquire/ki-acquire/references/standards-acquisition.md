# Common acquisition standard

## Scope

Acquisition faithfully preserves an authorised source scope as a transient capture package: a quick dumping point, not lasting provenance. Curation, evaluation, dispatch and source retirement are separate operations. The receiving repository supplies its capture entry point, paths and publication authority. This skill accepts no configuration keys and defines no storage layout or source adapter.

The capture package is the only record of what was acquired until curation empties it. Keep no ledger, checkpoint, journal, intake receipt or per-capture ticket beside it; Git history holds earlier bytes. A provider skill may add a source-side marker, such as Granola's Acquired folder, under its own separately authorised contract.

## Scope and coverage

Establish what was supplied, the authorised source and date window and the required outputs before reading or writing beyond them. Record the source, stable source identities and dates where evidenced; keep source chronology apart from capture time, and leave unknown dates and identifiers unknown.

State coverage honestly: supplied text, URL reference, bounded digest, partial source or complete export. A digest is not a raw export, and a provider route that requires a complete transcript or attachment inventory keeps that requirement. Preserve uncertainty and the owner's explicit corrections; do not screen for relevance. A URL alone is a reference unless visiting it is authorised.

## Identity and routing

Find any existing capture of the same source identity before writing. An unchanged verified retry is a no-op; changed scope is a linked new segment or a deliberate refresh in place, with Git keeping the earlier bytes. An empty search alone does not prove absence. Never overwrite source bytes to make an incomplete capture look complete.

Route from owner and source evidence and the relevant territory context. An unknown or conflicting route stays visible, held for owner routing; do not invent a territory to close a capture. A capture that belongs in two places may be kept in both or in one; consolidation happens at dispatch.

## Preservation and originals

Preserve the material the source route promises, with provenance and explicit omissions, keeping source statements, digest and interpretation distinguishable. Keep a capture lean: a short note goes in the capture's README rather than a separate verbatim text file, such as Acquire's `original.txt`, where the README note will do, as Kris decided in Acquire on 31 October 2026 (CAPTURE-LEAN). Preserve required originals as exact bytes under their original filename. Where the capture is committed to Git, Git's object hashes are the checksum and no separate checksum file is kept; Acquire's CAPTURE.md says: "There is no `original.txt` and no `SHA256SUMS`, because Git fingerprints every committed file." An original held outside Git keeps a recorded locator and hash. A preview, resized rendition or offered download does not establish receipt of an original. Optional originals awaiting consent may follow later; essential originals remain an explicit incomplete obligation.

## Verification and reporting

Read the destination back and compare the preserved text or byte hashes. Distinguish offered, received, locally committed and remotely verified results, and claim only what was verified. A source-side marker does not prove preservation. Report the preserved scope, destination, coverage and anything missing or blocked; keep process improvements from delaying a useful capture.

## Staging and curation

A port is a capture point and may also be a knowledge-capture staging area, where captured meaning is curated into knowledge cards before it is reconciled into the canonical knowledge graphs of the repositories that own it. The staging area is neither a canonical graph nor the Knowledge Islands inbound and outbound staging mechanism. Cards define each concept once within a territory and link to related cards rather than repeat definitions; the same card may also sit in another territory where it applies (CROSS-TERRITORY-COPIES, 31 October 2026). Acquire is such a port and, for now, a holding area, as Kris decided in Acquire on 31 October 2026 (ACQ020-MODEL, ACQ020-KNOWLEDGE, GOAL-HOLDING-AREA).

Acquire has four top-level folders: `captured/` holds faithful captures, `context/` is the routing graph that capturing and curating both start from, `curated/` is the staging area, and `actions/` holds what needs to happen; a fifth, `_held/`, holds material awaiting incorporation. `context/<territory>/` is a small graph of Semantic Markdown cards for each territory, joined by typed links such as `ki:routes-to`, `ki:stages-in` and `ki:signposts`; context cards may link into `captured/` and `curated/`, but nothing under `captured/` links into `context/`, a one-way rule Acquire's own check enforces (ACQUIRE-STRUCTURE-ALIGN, 1 November 2026).

Acquire's staging area is `curated/<territory>/<island>/`, one island being one repository. Under each island the layout follows that island's own shape: for a principal, its own zone and folder names, such as `Pillars/`, `Resources/`, `Streams/` and `Calendar/`, so a staged file's path says where it would land. Every territory principal has a scaffolded skeleton of its zones, each with a README saying what lands there, and other islands get folders only when needed (RESTRUCTURE, ISLAND-SHAPE-AND-MEETINGS, SCAFFOLD, 1 November 2026). Its cards form a maturing knowledge graph, the realisation of semantic Markdown, much like Zettelkasten index cards. Cards are tended and matured there with no rush to move them. They migrate into the islands later, once they conform to the standards being built, or earlier when a card is plainly an addition to existing knowledge and its home is decided. The backlog is played in reverse date order, which shows where one card supersedes another (HOLDING-SCOPE-CARDS, 1 November 2026). The port's own entry points must still work without its staged content, and no curated file ever stands in for an uncurated capture.

Human judgement anchors curation, which is incremental (ACQ020-RETIRE). Delete each curated item from its capture in the same commit that curates it into the graph. Delete an item judged not worth keeping in its own commit, saying it was considered and dropped. Delete a capture once it is empty. Git history keeps every deleted byte. This deletion inside the port is curation, not source retirement: it leaves the provider untouched and needs no further grant.

A card never links to a capture, because the capture is transient (CARDS-NO-SOURCE-LINKS). A card has no origin section in its body. Where its origin would help someone check it later, such as a named document or titled conversation the body does not already cite, its front matter gives it in one plain line as `origin:`, such as "Discussed with Kris in conversation on 31 October 2026"; otherwise it has none (ACQ020-PROVENANCE, CARDS-ORIGIN, ORIGIN-FRONTMATTER, 31 October 2026).

A meeting is a source, not a node in the graph. Kris set this in Acquire on 1 November 2026: "in reality meetings are not that useful to keep. They're more things that help with the provenance of certain information, but they're not part of the knowledge graph" (MEETINGS-PROVENANCE), refined the same night: "if you bring in a meeting and there's some decisions made or some concepts, then there's no reason why they can't be pointers into the durable knowledge. The thing that's changed or stays in calendars is who attended, what the actions were" (ISLAND-SHAPE-AND-MEETINGS). A meeting's decisions and concepts are curated into cards, its record of who attended and what the actions were is staged under the island's `Calendar/`, and its work under `Streams/`. The meeting may be named as a card's `origin:` where that adds value, and its capture then retires like any other. A future idea curated from a capture goes into the graph as a future concept, kept distinct from what is being done now, and not onto a roadmap; only an idea being enacted now becomes work (ACQ020-FUTURE, IDEAS-IN-GRAPH).

A port may hold material awaiting incorporation, worked back one day at a time, newest first, without bulk moves to classify it. Acquire holds captures whose territory is not yet settled, and for now every capture older than 31 October 2026, in the top-level `_held/`, and works them back that way, with dispatch on hold (ACQ020-HISTORY); the `sources-inbox` store mirrors it. Acquire renamed the folder from `_review` on 1 November 2026, because holding means material awaiting incorporation while review now means comments, findings and proposed changes, and on 2 November moved it out of `captured/` to the top level (ACQUIRE-HELD-RENAME).

## Dispatch and authority

Dispatch moves each package from the capture area into the receiving island's `+/_ACQUIRED/`, as its own folder holding a single capture or a chosen roll-up. Delivery is acceptance: the receiver's commit, with the port's removal commit, is the only record. Keep no dispatch ledger or return route, and handle misdeliveries case by case. A port declared a holding area dispatches nothing while the declaration stands; Acquire's dispatch is on hold for now.

Capture authority does not grant provider mutation, receiver reconciliation, source deletion or history compaction; each needs its own grant. Do not reset or rewrite history to hide a verification failure.

## Receiver-local triage

After acquisition, the receiving repository evaluates each complete AI session under its own authority. Record the disposition and the evidence for it in the capture package's existing README or capture document, in a labelled receiver-triage section, clearly separate from preserved source material. This updates receiver-authored metadata only: preserve the acquired source text, provenance, filenames and required original bytes. Delivery preserves the whole package as received; subsequent local annotations remain distinguishable in the package and in Git history. The capture stays the only acquisition record: do not add a triage ledger, receipt or per-session work record. A partial session retains its coverage gap and may be parked; it cannot be marked fully triaged or as containing no residual knowledge.

Use one or more of these dispositions, naming the part of the session each covers and any unreviewed remainder:

- **Harvested:** useful knowledge has been reviewed into its durable owner; link the resulting knowledge and state what was taken from this session.
- **Retained as source evidence:** keep the session as evidence, stating what it supports and why it still needs retaining.
- **Routed onward:** identify the receiving owner and destination, with the route still pending until delivery is verified. Routing supplies no adoption or publication authority in that destination.
- **No residual knowledge:** the complete acquired scope has been reviewed and nothing further needs harvesting; state the reviewed scope and the reason. This disposition grants no source deletion or retirement.

The receiver should be able to read the disposition, destination links and remaining gaps without rereading the source. Recheck evidence before claiming a disposition complete. For Knowledge Bases, [packet intake handling](../../../repo-structure/ki-repo-kb/references/standards-acquired-triage.md) remains owned by `ki-repo-kb`. Filing, turning a packet into work under the receiver's selected work adapter, or parking it remains the receiver's intake handling; none alone proves its knowledge has been harvested. An incomplete harvest or pending route stays visibly open. Re-triage updates the same package, with Git retaining its earlier disposition. The receiver writes nothing back to the acquisition port.
