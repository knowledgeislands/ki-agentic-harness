# Common acquisition standard

## Scope

Acquisition faithfully preserves an authorised source scope as a transient capture package: a quick dumping point, not lasting provenance. Curation, evaluation, dispatch and source retirement are separate operations. The receiving repository supplies its capture entry point, paths and publication authority. This skill accepts no configuration keys and defines no storage layout or source adapter.

The capture package is the only record of what was acquired until curation empties it. Keep no ledger, checkpoint, journal, intake receipt or per-capture ticket beside it; Git history holds earlier bytes. A provider skill may add a source-side marker, such as Granola's Acquired folder, under its own separately authorised contract.

## Scope and coverage

Establish what was supplied, the authorised source and date window and the required outputs before reading or writing beyond them. Record the source, stable source identities and dates where evidenced; keep source chronology apart from capture time, and leave unknown dates and identifiers unknown.

State coverage honestly: supplied text, URL reference, bounded digest, partial source or complete export. A digest is not a raw export, and a provider route that requires a complete transcript or attachment inventory keeps that requirement. Preserve uncertainty and the owner's explicit corrections; do not screen for relevance. A URL alone is a reference unless visiting it is authorised.

## Identity and routing

Find any existing capture of the same source identity before writing. An unchanged verified retry is a no-op; changed scope is a linked new segment or a deliberate refresh in place, with Git keeping the earlier bytes. An empty search alone does not prove absence. Never overwrite source bytes to make an incomplete capture look complete.

Route from owner and source evidence and the relevant territory context. An unknown or conflicting route stays visible for review; do not invent a territory to close a capture. A capture that belongs in two places may be kept in both or in one; consolidation happens at dispatch.

## Preservation and originals

Preserve the material the source route promises, with provenance and explicit omissions, keeping source statements, digest and interpretation distinguishable. Keep a capture lean: a short note goes in the capture's README rather than a separate verbatim text file, such as Acquire's `original.txt`, where the README note will do, as Kris decided in Acquire on 30 October 2026. Preserve required originals as exact bytes with filename, size and checksum. A preview, resized rendition or offered download does not establish receipt of an original. Optional originals awaiting consent may follow later; essential originals remain an explicit incomplete obligation.

## Verification and reporting

Read the destination back and compare the preserved text or byte hashes. Distinguish offered, received, locally committed and remotely verified results, and claim only what was verified. A source-side marker does not prove preservation. Report the preserved scope, destination, coverage and anything missing or blocked; keep process improvements from delaying a useful capture.

## Staging and curation

A port is a capture point and may also be a knowledge-graph staging area, where captured meaning is curated into knowledge cards that define each concept once and link to related cards. Acquire is such a port and, for now, a holding area: nothing migrates out of it, neither captures nor cards, as Kris decided in Acquire on 31 October 2026 (ACQ020-MODEL, ACQ020-KNOWLEDGE, GOAL-HOLDING-AREA). The port's own entry points must still work without its staged cards, and a card never stands in for an unprocessed capture.

Curation is incremental (ACQ020-RETIRE). Delete each curated item from its capture in the same commit that curates it into the graph. Delete an item judged not worth keeping in its own commit, saying it was considered and dropped. Delete a capture once it is empty. Git history keeps every deleted byte. This deletion inside the port is curation, not source retirement: it leaves the provider untouched and needs no further grant.

A card carries its origin in plain words, such as a discussion with Kris and when, or a named document, and never links to a capture, because the capture is transient (CARDS-NO-SOURCE-LINKS, ACQ020-PROVENANCE). A future idea curated from a capture goes into the graph as a future concept, kept distinct from what is being done now, and not onto a roadmap; only an idea being enacted now becomes work (ACQ020-FUTURE, IDEAS-IN-GRAPH).

A port may hold older captures for review, worked back one day at a time, newest first, without bulk moves to classify them. Acquire holds captures older than 31 October 2026 in `captures/_review/` and works them back that way, with dispatch on hold (ACQ020-HISTORY).

## Dispatch and authority

Dispatch moves each package from the capture area into the receiving island's `+/_ACQUIRED/`, as its own folder holding a single capture or a chosen roll-up. The Git move is the record; keep no dispatch ledger or return route, and handle misdeliveries case by case. A port declared a holding area dispatches nothing while the declaration stands; Acquire's dispatch is on hold for now.

Capture authority does not grant provider mutation, receiver reconciliation, source deletion or history compaction; each needs its own grant. Do not reset or rewrite history to hide a verification failure.

## Receiver-local triage

After acquisition, the receiving repository evaluates each complete AI session under its own authority. Record the disposition and the evidence for it in the capture package's existing README or capture document, in a labelled receiver-triage section, clearly separate from preserved source material. This updates receiver-authored metadata only: preserve the acquired source text, provenance, filenames and required original bytes. Delivery preserves the whole package as received; subsequent local annotations remain distinguishable in the package and in Git history. The capture stays the only acquisition record: do not add a triage ledger, receipt or per-session work record. A partial session retains its coverage gap and may be parked; it cannot be marked fully triaged or as containing no residual knowledge.

Use one or more of these dispositions, naming the part of the session each covers and any unreviewed remainder:

- **Harvested:** useful knowledge has been reviewed into its durable owner; link the resulting knowledge and state what was taken from this session.
- **Retained as source evidence:** keep the session as evidence, stating what it supports and why it still needs retaining.
- **Routed onward:** identify the receiving owner and destination, with the route still pending until delivery is verified. Routing supplies no adoption or publication authority in that destination.
- **No residual knowledge:** the complete acquired scope has been reviewed and nothing further needs harvesting; state the reviewed scope and the reason. This disposition grants no source deletion or retirement.

The receiver should be able to read the disposition, destination links and remaining gaps without rereading the source. Recheck evidence before claiming a disposition complete. For Knowledge Bases, [packet intake handling](../../../repo-structure/ki-repo-kb/references/standards-acquired-triage.md) remains owned by `ki-repo-kb`. Filing, turning a packet into work under the receiver's selected work adapter, or parking it remains the receiver's intake handling; none alone proves its knowledge has been harvested. An incomplete harvest or pending route stays visibly open. Re-triage updates the same package, with Git retaining its earlier disposition. The receiver writes nothing back to the acquisition port.
