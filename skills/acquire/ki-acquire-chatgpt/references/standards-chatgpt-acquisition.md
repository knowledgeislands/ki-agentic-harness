# ChatGPT acquisition standard

## Scope

This standard adds ChatGPT's coverage and capability rules to the `ki-acquire` common contract. A capture is the digest the receiving repository's capture route writes from an accessible conversation, or a full-thread snapshot when one is requested. The capture is the only record: keep no checkpoint, mark file, intake receipt or conversation index beside it.

## Contents

- [Readable source](#readable-source)
- [Coverage and end point](#coverage-and-end-point)
- [Routing](#routing)
- [Fidelity](#fidelity)
- [Source retirement](#source-retirement)

## Readable source

Capture only conversation text the runtime can actually read, or an official account export kept outside Git. Opaque local-store records, interface titles, browser scraping and undocumented private APIs are never conversation content. The `tools-ki` bridge, `ki acquire import --adapter chatgpt --capture <path> --output <path>`, imports one user-prepared readable capture; its adapter declaration advertises nothing more. An account export is a bounded snapshot, not proof of complete project membership.

## Coverage and end point

A first capture digests the thread through its last substantive message before the request. A later capture covers only new substantive knowledge strictly after the previous end point, as a dated linked segment; a request repetition or capture administration is not new knowledge. A full-thread snapshot is a new linked capture, never an overwrite of an earlier digest.

The digest's README front matter records the end point: the inclusive last substantive message, with its message ID, timestamp or an exact distinctive excerpt as available, together with the capture scope, sequence and previous capture. On retry, read that front matter: an unchanged complete capture is a no-op, a partial one is finished in place, and new material starts the next segment. A filename or date alone is not an end point; an ambiguous boundary stops for resolution.

## Routing

Route from the project name, conversation evidence and territory context. A project name establishes intent but is not authority on its own; an unknown or conflicting route stays visible for review rather than defaulting to any territory. Renaming a project never re-routes earlier captures.

## Fidelity

Preserve reasoning, decisions, actions, assumptions, uncertainties and the owner's corrections in proportion to the material, keeping source statements, assistant hypotheses and verified findings distinct. Record thread start, last message and capture dates separately and only to evidenced precision; unknown stays unknown. Quote only exact accessible words. Preserve required attachments as exact originals under the common contract, and list omitted ones. Never fabricate timestamps, messages or public URLs from internal identifiers.

## Source retirement

Acquisition is read-only. Archiving or deleting a ChatGPT conversation needs a separate, current manual-release decision with the capture verified at a named Git revision and immediate human approval; capture success never authorises deletion.
