# Cross-repository trade standard

This standard defines typed, directional trade routes between registered Knowledge Islands repositories. Routes are granted by the territory trade policy that the Capital owns; a member declares only that it participates. It grants no transport, peer-write, roadmap, priority, implementation, knowledge, or acceptance authority. The structured catalogue enforces the mechanical rules; the generated [rubric](rubric.md) publishes them.

## Contents

- [Participation](#participation)
- [Capital trade policy](#capital-trade-policy)
- [Storage and identity](#storage-and-identity)
- [Preparation and observation](#preparation-and-observation)
- [Submitted record format](#submitted-record-format)
- [Copy and write authority](#copy-and-write-authority)
- [Delivery and decision](#delivery-and-decision)
- [Observation policies](#observation-policies)
- [Release and pruning](#release-and-pruning)
- [Roadmap and process boundary](#roadmap-and-process-boundary)

## Participation

A repository participates by declaring its own bare table. The member table carries no routes:

```toml
[skills.ki-trades]
# Optional presentation-only map uplift; omitted means 0.
map_bonus = 1
```

The repository's canonical endpoint is `ki-repo.repository`, a required HTTPS GitHub URI, and its territory is `ki-repo.capital`, the canonical URL of the Capital whose policy grants its routes. Both are owned by `ki-repo`. Non-GitHub identities are currently unsupported: the registry, policy endpoints, record paths, and projection cannot represent them consistently, so configuration must refuse them rather than claim portable HTTPS support.

`map_bonus` is the only member key: an optional integer from `0` through `3`, defaulting to `0`. It is presentation metadata for the generated registered-estate map: it adds a small declared contribution to the repository's visible influence alongside route-derived degree and any renderer-derived organisation treatment. It does not change route activation, preparation, submission, receipt, decision, priority, or authority.

The per-repository `routes` and `subtypes` keys are retired. Their presence fails immediately; they are never parsed, migrated, or used as a fallback, and the route they once declared is proposed to the Capital instead. `territory` is permitted only where `capital` equals `repository`, because only a Capital hosts the policy. Any other key fails.

A member that declares ki-trades but is named in no channel of its resolved policy is warned: either the Capital has yet to grant it a route or the declaration is surplus. Conversely, `ki-repo` fails a member that a resolved policy names but that does not declare ki-trades.

## Capital trade policy

The Capital's own `[skills.ki-trades]` carries the territory trade policy under `territory`. It defines the knowledge subtype vocabulary, the channels that grant routes, and the standing grants layered on them:

```toml
[skills.ki-trades.territory.subtypes]
shared-capability-maintenance = "Non-sensitive findings about shared capabilities."

[[skills.ki-trades.territory.channels]]
id = "harness-maintenance"
purpose = "Members report work and knowledge about shared capabilities to the harness."
from = ["https://github.com/owner/sender"]
to = ["https://github.com/owner/receiver"]
kinds = ["work", "knowledge"]

[[skills.ki-trades.territory.standing]]
subtype = "shared-capability-maintenance"
from = ["https://github.com/owner/sender"]
to = ["https://github.com/owner/receiver"]
```

`territory` carries only `subtypes`, `channels`, and `standing`, each optional. A subtype is a lower-case hyphenated identifier with a non-empty description; unused subtypes are allowed. A channel declares exactly a unique `id` in the same identifier form, a non-empty `purpose`, non-empty duplicate-free `from` and `to` arrays of canonical URLs, and a non-empty duplicate-free subset of `work` and `knowledge`. It expands to the exact `(source, receiver, kind)` triples of `from` x `to` x `kinds`. `from` and `to` must not overlap, every endpoint must be a member of the Capital's `[skills.ki-repo.territory]`, and no triple may be granted by two channels. There are no wildcards.

A standing grant declares exactly a defined `subtype` and non-overlapping canonical `from` and `to` arrays. It expands to `(source, receiver, subtype)` triples; each must already be joined by a `knowledge` channel triple, and no standing triple may repeat. A malformed policy fails closed: it grants no route and no standing grant anywhere in the territory until it is corrected.

### Resolution and activation

A repository resolves its policy through its own declared `capital`, never by scanning for a repository that declares a territory, so several territories can share one registry. The policy is the one held by the unique registered checkout declaring that canonical URL, which must name itself as its capital, declare a territory, and list the member. A Capital resolves its own policy.

- No registered checkout declares the capital: the audit warns `territory policy lives in <capital>, not available here`. Records are then reported as unverifiable rather than refused.
- No registered checkout declares the capital, but a registry entry claiming it points at a checkout whose `.ki.toml` cannot be read or parsed: the audit fails with `registered checkout at <path> has an unreadable .ki.toml` rather than reporting the policy as unavailable, and no route is granted.
- More than one registered checkout declares it, the checkout is not a Capital, it does not list the member, or its policy is malformed: the audit fails and no route is granted.

A granted route is active only when exactly one registered repository declares the peer's canonical home, declares ki-trades, and names the same Capital. An unregistered or non-participating peer leaves the route awaiting the receiver or sender, which the audit reports for information. A peer registered twice is ambiguous, and a peer naming another Capital is a cross-territory peer whose route is inactive; both fail the route audit. Filesystem visibility or Agora membership never activates a route.

A granted export authorises sender-local preparation and submission while the receiver is still awaiting registration or participation. Receipt requires an active route of the same kind. Removing a channel or standing grant is a change to the Capital's policy, proposed and accepted there; the Capital should refuse it while a local preparation, submitted outbound record, or retained inbound record still depends on the typed route.

### Knowledge subtypes and standing intake

Standing intake is an optional, exact grant layered onto an active ordinary `knowledge` route. The Capital's policy owns and describes the subtype vocabulary and grants each `(source, receiver, subtype)` triple; members declare no subtype or standing configuration. Work has no subtype or standing path. A subtype absent from a standing grant, or a grant without its knowledge channel, remains itemized-only; it never degrades into partial standing authority.

An itemized knowledge record may carry optional `subtype` classification. Existing records without it remain valid. The field is invalid on work, and its presence never upgrades an itemized trade into standing intake.

### Standing intake provenance

Direct capture is receiver-local and begins with the exact marker `<!-- ki-trades:standing-intake -->` immediately followed by a TOML block:

```toml
schema = "ki-trades/standing-intake/v1"
id = "STI-1a2b3c4d"
source = "https://github.com/owner/sender"
source_ref = "0123456789abcdef0123456789abcdef01234567:docs/source.md#finding"
receiver = "https://github.com/owner/receiver"
kind = "knowledge"
subtype = "shared-capability-maintenance"
captured_at = "2026-08-30T12:00:00Z"
capture = "docs/roadmap/RECEIVER-GOV-001.md#source-analysis"
```

The marker declares the following block as governed evidence; examples without the marker are inert. `STI-` identities use eight lower-case hexadecimal characters and are unique in the receiver. `source_ref` fixes a full commit, Markdown path, and anchor in the registered source repository. `capture` points into the containing receiver-owned Markdown artifact. Audit validates schema, closed fields, identities, source resolution, receiver, knowledge kind, subtype, timestamps, and capture location.

New capture requires a currently active exact-subtype standing import. Removing the standing grant from the Capital's policy, or the policy becoming malformed, immediately blocks new direct capture; while the policy is not available here, the grant is reported as unverifiable. Previously committed receiver-owned evidence remains historical; audit reports its introduction-time authority for review rather than invalidating retained knowledge solely because the route was revoked.

Standing intake grants no peer write, review, priority, implementation, publication, acceptance, completion, or roadmap authority. It may augment an existing record only when the insight directly supports that record's established goal and boundary. A distinct insight, decision, dependency, or scope creates receiver-local draft work. Canonical knowledge may receive a direct capture only when knowledge itself is the outcome; any public contract or implementation change still enters receiver-local work. Agora membership is presentational relationship context only and neither activates nor is required for standing intake.

### Authority lifecycle and automation boundary

Activation requires a current ordinary knowledge route plus an exact-subtype standing grant in the Capital's trade policy; neither member can grant or withhold it locally. Revocation blocks every new capture immediately, while committed introduction-time evidence remains historical and reviewable. Standing intake grants no peer write, review, priority, implementation, publication, acceptance, completion, or roadmap authority.

Standing intake is not automatic transport or execution. Any future agent that discovers, transfers, applies, or publishes work without a contemporaneous operator must have a separate explicit authority contract covering scheduling, idempotency, isolation, failure recovery, evidence, review, and revocation. A standing grant or `unattended` itemized policy supplies none of that authority.

## Storage and identity

The generic `+` and `-` working areas remain owned by `ki-repo`. A repository declaring `ki-trades` also carries:

```text
+/_TRADES/
└── <sender-owner>/<sender-repository>/TRD-<eight-hex>.md
-/_TRADES/
└── <receiver-owner>/<receiver-repository>/TRD-<eight-hex>.md
```

Each `_TRADES` directory retains its skill-owned README when empty. The two peer path segments match the record's sender for inbound records and receiver for preparations and outbound records. Every path segment encodes a counterpart and none encodes state, so a preparation and its submitted successor share one path. `_PREPARATIONS` is retired and a directory of that name is refused: a reserved name inside the owner namespace it sits in cannot be distinguished from an owner.

The canonical identity grammar is `TRD-[0-9a-f]{8}`. Generation uses eight lower-case hexadecimal characters from a random UUID and deliberately accepts the short form's collision risk. One identity appears at most once locally: submitting rewrites the preparation in place rather than copying it. Filename, `id`, and H1 must agree.

Every copy of a record declares its own `phase`, drawn from a closed vocabulary that names every state a copy can hold rather than only the first one:

- `preparing` — a mutable sender-local preparation under `-/_TRADES/<receiver-owner>/<receiver-repository>/`.
- `submitted` — a frozen outbound copy at that same path.
- `received` — a receiver-owned inbound copy under `+/_TRADES/<sender-owner>/<sender-repository>/`.

`phase` is required on every record and its value must match the copy the record is. It states the state of that copy, not the disposition of the receiver towards the trade: `decision_status` is a separate field on its own axis, and the two advance independently. `phase` is the one field each side writes for its own copy, so audit excludes it from the immutable sender projection alongside the receiver-local fields.

## Preparation and observation

A preparation uses the submitted sender envelope and body described below with `phase: preparing`. It must declare `observation` explicitly. It is mutable at its sender-local outbound path and is not receivable. Committing it makes it available for silent inspection through the sender's registered repository root but creates no receiver copy, acknowledgement, decision, response expectation, or dialogue record.

Preparation history is Git history. Observation compares the current committed record with one host-local last-observed full commit reference. When those commits are comparable it presents their diff; on first view, shallow or rewritten history, or a repository without usable history, it presents the current preparation verbatim and explains why comparison is unavailable. Observation writes only that disclosed host-local cursor. Abandonment removes only the local preparation.

Submission rewrites `phase` from `preparing` to `submitted` on a stable path and freezes the raw sender projection. It is an ordinary field update, not a file move and not a text substitution that depends on `phase` being the last key in the block, so reordering the frontmatter cannot leave a submitted record still declaring itself as preparing. It does not require receiver registration or participation. A submitted record is self-contained and survives sender disconnection.

## Submitted record format

The sender authors this envelope and payload:

```markdown
---
id: TRD-01234567
title: "Short submission title"
created_at: 2026-08-03T12:00:00Z
sender: sender-owner/sender-repository
receiver: receiver-owner/receiver-repository
kind: work
source_ref: KI-SENDER-FND-001
observation: decision
phase: submitted
---

# TRD-01234567: Short submission title

## Context

Why the submission exists and the originating constraints.

## Submission

The outcome proposed to the receiver.

## Constraints

Authority, safety, dependency, and verification boundaries the receiver must retain when evaluating it.
```

The eight sender fields and `phase` are required strings. `kind` is `work` or `knowledge`; knowledge permits `observation: unattended` or `observation: receipt`, while work additionally permits `observation: decision` or `observation: completion`; `phase` is `preparing`, `submitted`, or `received`. `created_at` is a UTC `YYYY-MM-DDTHH:MM:SSZ` timestamp. `source_ref` is provenance only and transfers no lifecycle authority. The three payload sections are required and non-empty. The H1 is the first non-blank body line and exactly repeats `id` and `title`.

An inbound receiver copy sets `phase: received` and adds `decision_status: unconsidered` and, when the committed sender reference is available, `received_from_ref: <full-commit>`. It may also carry receiver-local `reviewed_at`, `rationale`, `applied_commit`, `adopted_as`, `retained_as`, or `superseded_by`. Receiver-local commit references are 40 lower-case hexadecimal characters. No other frontmatter key is valid.

## Copy and write authority

The sender writes and removes only its preparation and outbound record and never sets receiver-local fields. The receiver creates and changes only its inbound copy. The sender projection—every sender frontmatter field and the whole body—is immutable in meaning after submission. `phase` is excluded from it, because it states what each copy is rather than what the sender asserted. Audit derives each sender projection by removing only the recognised single-line `phase` field and, on an inbound copy, the recognised single-line receiver-local fields, then compares the two copies by meaning rather than by byte: frontmatter values are unquoted and whitespace is collapsed, so rewrapping, reindenting, and requoting pass while any change to the words fails. Trade records are therefore formatted like any other authored Markdown, and are not excluded from the formatters. Where no registered peer holds the counterpart copy—most often because the sender has released—the comparison reports as unverifiable rather than passing silently.

A rewritten sender projection therefore surfaces on the receiving side as an `AUTH-1` mismatch, which reads like a stale or hand-edited inbound copy. It is not: the receiver's copy may be a faithful record of what was submitted, while the outbound record has since been amended in place. Before repairing an inbound copy, compare the sender's committed history against the copy's `received_from_ref`. When the sender moved, the repair is to re-copy the current projection and update that reference, and the amendment itself is the sender's breach to answer for.

Insensitivity to formatting is not a licence to normalise. A receiver never rewrites a sender-owned record to satisfy its own style, and a mismatch is escalated to the sender rather than repaired locally: audit reports, and never proposes a repair to either copy.

`received_from_ref`, when present, is a full lower-case hexadecimal Git commit locator for the committed sender version received. `reviewed_at` is a UTC timestamp. `rationale` records receiver reasoning. `applied_commit` is valid only for `applied` and is likewise a syntactic Git commit locator; this local checker does not verify object existence or ancestry. `adopted_as`, `retained_as`, and `superseded_by` are valid only for their matching decisions. These are local evidence, not priority or acceptance authority.

The governance checker is read-only across repositories. Its only conformable write is the local owned README scaffold. Preparation, observation, submission, receipt, disposition, release, and pruning are explicit local operations outside CONFORM.

## Delivery and decision

Publication, delivery, and decision are independent axes:

- `preparing` — mutable sender-local intent; no delivery fact exists.
- `submitted · waiting` — immutable outbound exists while its selected observation policy remains unsatisfied; before receipt, no matching inbound copy exists.
- `submitted · received` — both copies exist; this means delivery only.
- `released` — the receiver observes that an eligible outbound has gone.

The receiver alone moves its inbound decision status:

- `unconsidered` — received but not reviewed.
- `in_progress` — actively being considered.
- `parked` — intentionally paused; `rationale` is required.
- `clarify` — more information is requested; `rationale` is required.
- `applied` — a bounded work change was applied directly; `applied_commit` is required.
- `adopted` — a work trade informs separately governed local work; `adopted_as` is required.
- `retained` — a knowledge trade is retained in a canonical local artifact; `retained_as` is required.
- `declined` — not applied, adopted, or retained; `rationale` is required.
- `superseded` — replaced by another local record or trade; `rationale` and `superseded_by` are required.

`applied` and `adopted` are work-only; `retained` is knowledge-only. `retained` is the knowledge form of the receiver keeping a trade locally; `applied` is the work form where the receiver performed the bounded work directly. `adopted` remains distinct: the receiver accepted the work as a named local follow-on record, but that record is not thereby complete. There is no generic trade `completed` status.

## Observation policies

A sender chooses one policy for an itemized `TRD-*` record without imposing an obligation on the receiver:

- Knowledge or work may use `unattended` — no response is requested, but the sender still waits until explicit receipt is observable.
- Knowledge or work may use `receipt` — the sender waits only until explicit receipt is observable without making a statement about whether a response was requested.
- Work may use `decision` — the sender waits for a terminal receiver disposition: `applied`, `adopted`, `declined`, or `superseded`.
- Work may use `completion` — the sender waits for selected-adapter, owner-valid completion evidence for local work. This protocol has no such resolver, so it fails closed: `applied`, `adopted`, path scans, or absent records never satisfy completion. `declined` and `superseded` may resolve it because no delivery remains due.

`parked` and `clarify` remain non-terminal under every policy and continue to wait beyond receipt. `unattended` and `receipt` have the same evidenced release boundary; their only distinction is sender intent about a response. Neither bypasses receiver-created receipt or receiver-owned disposition. A policy grants no deadline, delivery guarantee, response guarantee, priority, implementation, acceptance, or completion authority.

## Release and pruning

The sender lifecycle has only mutable `preparing`, immutable `submitted`, and explicit release. “Waiting” is not a stored phase: a submitted record is waiting while its selected policy is unsatisfied. The sender may release its outbound copy only when that policy is satisfied; release removes the submitted sender projection. A release-eligible outbound remains valid until the sender explicitly removes it.

The receiver may prune its inbound copy only after an eligible sender release is observable. Absence before policy satisfaction is premature release, not permission to prune. An inbound record retains enough sender-policy and receiver-decision evidence to distinguish those cases after release. Cleanup is explicit and previewed; neither side performs background deletion.

## Roadmap and process boundary

`ki-next` presents inbound trades for a human-confirmed disposition. Direct `applied` is available only for one bounded, reversible, independently verifiable local work change with clear authority, no material design decision, dependency, migration, public-contract change, or cross-repository write, and an existing targeted gate. Everything else creates or links separately prioritised local work. Knowledge never uses the direct-work path and is retained only in a named canonical artifact. A future selected-adapter resolver, not this protocol, owns canonical local-work identity and completion evidence.

`ki-work-roadmap` may identify valid inbound records needing review and may record an explicit trade observation on which local work waits. It does not change a route, record, decision, or peer state. Neither skill gains cross-repository write authority.
