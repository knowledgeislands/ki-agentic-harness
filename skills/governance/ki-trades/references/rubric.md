<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — Cross-repository trades

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-trades --write`.

Line-by-line criteria for auditing ki-trades. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [CONFIG — Declared participation](#config--declared-participation)
- [ROUTE — Capital-granted routes](#route--capital-granted-routes)
- [POLICY — Capital trade policy](#policy--capital-trade-policy)
- [SCAFFOLD — Trade scaffold](#scaffold--trade-scaffold)
- [RECORD — Record shape](#record--record-shape)
- [AUTH — Write authority](#auth--write-authority)
- [STATUS — Delivery and receiver decision](#status--delivery-and-receiver-decision)
- [RELEASE — Release and pruning](#release--release-and-pruning)
- [STANDING — Standing knowledge intake](#standing--standing-knowledge-intake)
- [ADOPTION — Receiver local authority](#adoption--receiver-local-authority)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standards-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standards-rubric-authoring.md#generated-rubric-publication)
  - _Remediation:_ automatic

## CONFIG — Declared participation

→ [standard](standards-trades.md)

A bare, canonical local ki-trades declaration.

- **CONFIG-1 [M] — the member table is bare and identities are canonical** — A participating repository declares `[skills.ki-trades]` carrying at most a presentation-only `map_bonus` integer from 0 through 3. The retired `routes` and `subtypes` keys fail because routes now come from the Capital trade policy, `territory` is permitted only in a Capital, and any other key fails. The repository identity comes only from the canonical GitHub form of `ki-repo.repository`. (standards-trades.md)
  - _Remediation:_ diagnostic — Remove retired or unknown ki-trades keys and propose any route change to the Capital trade policy, then rerun the audit.

## ROUTE — Capital-granted routes

→ [standard](standards-trades.md)

Routes granted by the Capital trade policy and their per-peer activation.

- **ROUTE-1 [M] — trade routes come from the resolved Capital policy and activate per peer** — Routes and standing grants are read only from the territory trade policy of the repository's declared Capital, resolved as the unique locally registered Capital listing this repository; a malformed or ambiguous policy fails closed and an unregistered Capital warns that the policy is not available here. A granted route is active only when exactly one registered repository declares the peer's canonical GitHub home, declares ki-trades, and names the same Capital. (standards-trades.md)
  - _Remediation:_ diagnostic — Correct the local capital declaration or register the Capital checkout; route changes are proposed to the Capital, never declared locally.
- **ROUTE-2 [M] — a participating member is named by its Capital policy** — A territory member that declares ki-trades is named as a source or receiver in at least one channel of its resolved Capital trade policy. The Capital itself hosts the policy and is exempt. (standards-trades.md)
  - _Remediation:_ diagnostic — Propose a channel naming this repository to the Capital, or remove the ki-trades declaration if the repository does not trade.

## POLICY — Capital trade policy

→ [standard](standards-trades.md)

The Capital-owned territory trade policy and the islands it names.

- **POLICY-1 [M] — the Capital trade policy is well formed** — In a Capital, `[skills.ki-trades.territory]` carries only `subtypes`, `channels`, and `standing`. Each channel declares exactly a unique `id`, a `purpose`, disjoint non-empty canonical `from` and `to` arrays of territory members, and a non-empty duplicate-free subset of work and knowledge, and no route triple is granted twice. Each standing grant names a defined knowledge subtype over disjoint canonical endpoints already joined by a knowledge channel, without duplicates. Any violation fails closed. (standards-trades.md)
  - _Remediation:_ diagnostic — Correct the Capital trade policy; until it is valid it grants no routes anywhere in the territory.
- **POLICY-2 [M] — named islands declare ki-trades** — In a Capital, every island the trade policy names that is registered locally declares `[skills.ki-trades]`; an island not checked out here is reported as unverifiable. (standards-trades.md)
  - _Remediation:_ diagnostic — Hand the named island a declaration of ki-trades through its own repository, or remove it from the policy channels.

## SCAFFOLD — Trade scaffold

→ [standard](standards-trades.md)

The optional capability owns only its `_TRADES` directories and README files.

- **SCAFFOLD-1 [M] — owned trade scaffold is canonical** — A repository declaring ki-trades carries the two `_TRADES` directories and their canonical README orientation beneath the generic working areas owned by ki-repo. (standards-trades.md)
  - _Remediation:_ automatic

## RECORD — Record shape

→ [standard](standards-trades.md)

One concise identity moves from mutable preparation to immutable submitted record on a stable path.

- **RECORD-1 [M] — preparation and submission shape is canonical** — Every trade uses one `TRD-` eight lower-case hexadecimal identity repeated in filename, metadata, and H1, a closed sender envelope with kind and observation policy, and non-empty payload sections. A preparation and its submitted successor share one peer path, so shape is judged identically on both sides of submission. (standards-trades.md)
  - _Remediation:_ diagnostic — Correct the locally owned trade record, then rerun the audit.
- **RECORD-2 [M] — every copy declares its own phase explicitly** — Every trade record carries a required `phase` drawn from `preparing`, `submitted`, and `received`, and the value matches the copy the record actually is: a preparation or a submitted outbound record beneath `-/_TRADES/<owner>/<name>/`, a received copy beneath `+/_TRADES/<owner>/<name>/`. Submission rewrites the field on a stable path rather than moving the file, so no state is expressed by an absent marker. The retired reserved `-/_TRADES/_PREPARATIONS/` directory is refused. `phase` records the state of the copy and `decision_status` records the disposition of the receiver, on separate axes. (standards-trades.md)
  - _Remediation:_ diagnostic — Set the phase of the locally owned record to the value its copy holds, move any record out of a retired `_PREPARATIONS/` directory to its peer path, then rerun the audit.
- **RECORD-3 [M] — a preparation title stays concise** — A trade title is at most six words. The limit is deliberately looser than the four `ki-work-roadmap` allows a work item, because a work item title sits beside its theme, repository-coded identifier, and horizon, while a trade lands alone in another repository and carries its whole meaning to a reader with none of that context. The criterion binds only on a preparation, which is still the sender's to change; a submitted or received copy is immutable evidence, so enforcing a local convention there would demand exactly the rewrite `AUTH-1` exists to detect. (standards-trades.md)
  - _Remediation:_ diagnostic — Shorten the title of the local preparation before submitting it; never retitle a submitted or received copy.

## AUTH — Write authority

→ [standard](standards-trades.md)

A trade remains a local copy protocol with an immutable raw sender projection and receiver-only local fields.

- **AUTH-1 [M] — sender and receiver write boundaries are preserved** — Preparations and outbound records belong to the local sender, retain an export route granted by the Capital trade policy, and contain no receiver-local fields; inbound records belong to the local receiver, retain an active receipt route granted by that policy, and preserve the submitted sender projection. That projection is compared against the registered peer's counterpart by meaning rather than by byte, so a formatter run is not reported as tampering while any change to the words is; where no registered peer holds the counterpart, the comparison reports as unverifiable rather than passing silently. Where the Capital policy is not available here, route authority is reported as unverifiable; an ambiguous or malformed policy grants no route. (standards-trades.md)
  - _Remediation:_ diagnostic — Correct only the locally owned record or route; do not alter a peer repository or the immutable sender projection.

## STATUS — Delivery and receiver decision

→ [standard](standards-trades.md)

Preparation, submission, receipt, receiver decision, and local completion remain separate facts with closed receiver-owned evidence.

- **STATUS-1 [M + J] — receipt evidence, decision status, and linkage are valid** — Inbound records evidence receipt independently from decision and carry one receiver-owned status: unconsidered, in_progress, parked, clarify, applied, adopted, retained, declined, or superseded, with full commit evidence and decision-appropriate rationale or local linkage. (standards-trades.md)
  - _Remediation:_ guarded — Record a receiver-owned decision only after the responsible human selects it; do not infer receipt, disposition, or local work.
  - _Evidence scope:_ Every inbound trade record whose receipt, decision status, rationale, or local linkage needs correction.
  - _Review prompt:_ Assess whether the receiver has independently confirmed any status transition and supporting rationale or linkage, without treating sender submission or route visibility as authority to decide.
  - _Outcomes:_ conforming; decision required; clarification required
  - _Conforming guidance:_ Record only the chosen receiver decision and its evidence, or leave the trade unconsidered or in clarification until authority is available.

## RELEASE — Release and pruning

→ [standard](standards-trades.md)

Absence is an observable release signal only after the sender-selected receipt, decision, or completion condition is satisfied.

- **RELEASE-1 [M + J] — release and pruning follow observable lifecycle evidence** — Unattended and receipt policies on itemised knowledge or work wait for evidenced receipt; unattended requests no response but grants no delivery or execution authority. Work may instead wait for decision or completion. Completion remains unavailable without selected-adapter, owner-valid evidence. Receiver pruning becomes eligible only after release is observable. (standards-trades.md)
  - _Remediation:_ guarded — Observe the sender-selected lifecycle evidence and make no release or pruning change until the responsible repository confirms it.
  - _Evidence scope:_ Every submitted trade whose sender release or receiver pruning eligibility is under review.
  - _Review prompt:_ Assess the observable receipt, terminal decision, and completion evidence against the sender-selected observation policy before any sender release or receiver pruning action.
  - _Outcomes:_ conforming; wait for evidence; eligible for human action
  - _Conforming guidance:_ Leave the record in place when evidence is incomplete; when eligible, the owning sender or receiver may make its own confirmed lifecycle change.

## STANDING — Standing knowledge intake

→ [standard](standards-trades.md)

A narrow two-sided subtype grant permits direct receiver-local knowledge capture without granting peer write or lifecycle authority.

- **STANDING-1 [M] — standing knowledge intake preserves exact authority and provenance** — Every marked STI provenance block is receiver-local, knowledge-only, uniquely identified, anchored to an exact source commit and capture location, and backed by an active or introduction-time exact-subtype standing grant in the Capital trade policy; where that policy is not available here the grant is reported as unverifiable. Revocation blocks new capture while preserving evidence introduced under a former grant. (standards-trades.md)
  - _Remediation:_ diagnostic — Correct only receiver-owned provenance, or propose the standing grant to the Capital trade policy; use an itemised knowledge trade whenever exact standing authority cannot be proven.

## ADOPTION — Receiver local authority

→ [standard](standards-trades.md)

Human-confirmed disposition remains distinct from local work selection, acceptance, and knowledge stewardship.

- **ADOPTION-1 [J] — disposition preserves receiver authority** — A receiver disposition is trade review only. Direct applied work is bounded and commit-verified; adoption does not automatically create, prioritise, implement, or accept a roadmap item; retention does not alter local knowledge authority. (standards-trades.md)
  - _Evidence scope:_ Every receiver disposition and any proposed direct application, local adoption, or knowledge retention following it.
  - _Review prompt:_ Confirm that applied is limited to one bounded, reversible, independently verifiable local work change with no material design, dependency, migration, public-contract, or cross-repository effect; every other work disposition remains separately confirmed, every retention remains a local knowledge decision, and none grants sender authority.
  - _Outcomes:_ conforming; separate local work required; decline or clarify required
  - _Conforming guidance:_ Keep the trade decision separate from local prioritisation and acceptance; create or link local work only through its own confirmed lifecycle.
