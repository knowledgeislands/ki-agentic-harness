# ChatGPT acquisition standard

## Scope

This standard defines faithful, incremental acquisition of readable ChatGPT project conversations into Knowledge Islands repositories. It separates stable source identity from human-readable project names, source discovery from content reads, acquisition from receiver-local triage, and verified acquisition from any later source retirement.

The provider-neutral lifecycle belongs to Arcadia. `tools-ki` owns executable acquisition and receiver writes. The `ki-housekeeping-chatgpt` skill and its MCP own opaque installed-store evidence; that evidence can support identity and change detection but cannot satisfy readable conversation fidelity.

## Contents

- [Current executable boundary](#current-executable-boundary)
- [Source pairing](#source-pairing)
- [Project identity and naming](#project-identity-and-naming)
- [Receiver routing](#receiver-routing)
- [Incremental acquisition](#incremental-acquisition)
- [Conversation fidelity](#conversation-fidelity)
- [Staging and triage](#staging-and-triage)
- [Source retirement](#source-retirement)

## Current executable boundary

The published adapter metadata must describe only behaviour the installed executor can perform. The current bridge imports a user-prepared readable capture through `ki acquire import --adapter chatgpt --capture <path> --output <path>` and emits a checksummed KEP. It does not claim provider project enumeration, incremental provider reads, receiver staging, reconciliation, reset, or source retirement.

The skill may specify those missing outcomes so implementation has a stable target, but its machine-readable capability list must expand only after executable tests prove each action and source property. This keeps `ki acquire list` operationally truthful.

## Source pairing

Incremental acquisition needs two independently evidenced layers:

1. A content-minimised source inventory supplies stable project and conversation identities, timestamps, byte counts, and hashes without decoding private storage.
2. An authorised readable source supplies complete conversation messages, associated project evidence, write-ups, and assets without reverse-engineering an undocumented private format.

The opaque installed-store adapter satisfies only the first layer. A user-prepared capture can satisfy a bounded readable import but is not an incremental provider interface. Browser scraping and undocumented private API calls are not acceptable substitutes because they provide no stable, auditable acquisition contract.

If either layer is unavailable, acquisition reports the exact gap and stops before claiming project coverage or readable fidelity. It must not treat opaque bytes, an interface title, a partial export, or an inaccessible conversation as acquired content.

### Account-export bootstrap

The official ChatGPT account export is an authorised bootstrap source for an initial bounded readable snapshot. Treat the downloaded archive as sensitive external source material: keep it outside Git, verify its archive and source hashes, and inspect its observed schema before converting selected evidence into the canonical prepared-capture form.

An account export is not the incremental provider interface. Until an observed export proves otherwise, do not infer complete project membership, write-ups, assets, stable project identities, or omission-free conversation coverage merely because the archive contains chat history. Export conversion remains separate from expanding the adapter's declared executable capabilities, and repeat acquisition still requires a supported identity and change-detection contract.

## Project identity and naming

An immutable provider project ID is the canonical routing selector. The current project name, its parsed prefix, and prior names are review evidence and aliases; a rename never creates a new acquisition identity or silently changes the receiver.

Human-readable project names use `<Domain>: <Topic>`. The domain prefix communicates routing intent and keeps the ChatGPT project list legible, but it is not authority by itself. A project whose name is missing a prefix, uses an unknown prefix, or conflicts with its bound receiver remains explicitly unmapped until a human resolves it.

Interface actions such as `New project` are not source projects and must not enter the inventory. The acquisition checkpoint retains project ID, current name, prior names, observed prefix, and binding revision so later renames are visible without losing continuity.

## Receiver routing

Receiver configuration binds each immutable project ID to exactly one repository identity by default. Estate-specific prefixes and repository names are configuration data rather than universal defaults in this skill.

Every inventory run reports:

- mapped project IDs with current and prior names;
- unknown or malformed prefixes;
- project IDs without a receiver;
- receiver bindings whose displayed prefix disagrees with their reviewed intent;
- duplicate project IDs or deliberate multi-repository acquisition.

No lexical prefix rule, first match, previous write location, or repository priority may silently resolve an unmapped or conflicting project. Intentional duplication requires explicit policy and independent evidence in every receiver.

## Incremental acquisition

The source checkpoint separates identity evidence from readable content evidence. Identity evidence records the complete observed project and conversation set, source response hashes, and the observation interval. Content evidence records each conversation ID, project ID, readable projection hash, acquired version, assets, receiver path, document checksum, and acquisition time.

Each run must enumerate the complete selected project scope, compare stable conversation identities with the previous checkpoint, and read every new or changed conversation. A source modified timestamp or opaque-record hash can nominate a conversation for revalidation but cannot prove readable content unchanged unless the readable source contract establishes that relationship.

An unchanged repeat produces no payload change. A changed conversation creates a new verified version without losing the prior acquired form. A conversation missing from the latest source inventory remains an explicit missing-source outcome; acquisition never interprets absence as permission to delete a retained receiver copy.

The implementation must expose retry, failure, inaccessible, changed-during-read, and incomplete-project outcomes separately. A checkpoint advances only after every selected identity is either verified or carries an explicit unresolved disposition.

## Conversation fidelity

The acquisition unit is one complete conversation within its project, not a model-selected excerpt. The acquired form preserves everything the authorised readable source faithfully returns:

- workspace or account provenance in privacy-minimised stable form;
- immutable project and conversation identities;
- current project name and retained aliases;
- title and source timestamps when supplied;
- ordered roles and message content;
- write-ups, canvases, citations, and linked assets when supplied;
- source, content, asset, and document hashes;
- acquisition checkpoint and version evidence;
- explicit omissions for every unsupported field or asset class.

The renderer may create readable Markdown and separate asset files, but it must retain enough source ordering and role evidence to reconstruct the returned conversation faithfully. It must not fabricate timestamps, infer missing messages, flatten attachments into invented prose, or present opaque application records as decoded conversations.

## Staging and triage

Complete acquired conversations land beneath the selected receiver's working acquisition area before knowledge triage. Receiver-local triage may then extract durable knowledge, retain the complete source, route bounded consequences to another repository, or record that no residual knowledge remains.

Routing and triage are distinct: a prefix and project binding choose the receiver best served by the complete conversation; they do not decide which fragments are valuable. Acquisition therefore remains reproducible without perfect up-front interpretation.

## Source retirement

Acquisition is read-only. Archiving or deleting a ChatGPT conversation is a separately invoked release operation requiring a current exact manifest, recoverable receiver evidence at a named Git revision, source identity and content that still match the manifest, resolved omissions, and immediate human approval.

When no provider-supported identity-specific mutation surface exists, the system may generate a manual-release manifest and stop. Browser automation is not a retirement mechanism. Acquisition success, a clean checkpoint, or an old approval never authorises deletion.
