<!-- GENERATED FILE: produced by `ki dev skill rubric`. Do not hand-edit; edit scripts/rubric/items/, then rerun `ki dev skill rubric <skill> --write`. -->

# Generated rubric — how a meeting is called, held and closed

> **Generated publication.** The TypeScript rubric items under `scripts/rubric/items/` are canonical. Edit those definitions, then rerun `ki dev skill rubric ki-meeting --write`.

Line-by-line criteria for auditing ki-meeting. Classifications are derived from item aspects: **[M]** mechanical, **[J]** judgment, **[M + J]** hybrid, and **[M-heuristic + J]** hybrid with heuristic mechanical evidence. Sources are cited as declared by each canonical item.

## Contents

- [RUBRIC — Generated rubric publication](#rubric--generated-rubric-publication)
- [MEETING — Meeting conduct](#meeting--meeting-conduct)

## RUBRIC — Generated rubric publication

→ [standard](../../../keystone/ki-skills/references/standard-rubric-authoring.md)

The tracked readable rubric is the exact publication of the structured catalogue.

- **RUBRIC-1 [M] — structured catalogue publication is exact** — A structured catalogue tracks `references/rubric.md` as its exact generated publication. The host supplies only validated publication evidence: a missing or differing file is a FAIL; during CONFORM this item requests the host-owned derived write without choosing its path or bytes. (../../../keystone/ki-skills/references/standard-rubric-authoring.md#414-generated-rubric-publication)
  - _Remediation:_ automatic

## MEETING — Meeting conduct

→ [standard](standard-meeting.md)

A meeting is the right channel, kept in the standard folder, reached by the first route that works, held in sittings with roll calls, clock-named messages, listening and check-ins, careful with Git and private data, and closed with its decisions in change documents.

- **MEETING-1 [J] — a meeting is the right channel and is called from the right node** — A meeting is held only where sessions cannot reach each other through their own agent host's messaging, sits at one node of the work tree with a type, a purpose and its participants, and is called by the session holding that node or one above it. (standard-meeting.md#41-when-to-meet, standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was a meeting the first route that works, and was it called at one node by the session holding it or one above it?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-2 [J] — the folder and its entry file keep the standard shape** — The meeting lives in its own folder at `meetings/<node id>/<date>-<slug>/`, holding `_index.md`, `messages/`, `brief/`, an output folder and `notes/`; `_index.md` opens with the front matter block tools read and then gives the summary, brief, agenda, boundaries, open asks and minutes. (standard-meeting.md#44-where-a-meeting-is-kept, standard-meeting.md#45-the-entry-file)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Does the folder hold the standard parts, and does `_index.md` carry a current front matter block followed by its six parts in order?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-3 [J] — each participant reaches the room by the first route that works** — Each participant's route is stated in the agenda and is the first of the three that works: the agent host's own messaging, the meeting folder, or exchange mode only as the exception. (standard-meeting.md#46-routes)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is each participant's route stated, and is exchange mode used only where no other route reaches the folder?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-4 [J] — each sitting opens with a roll call and ends with its minutes** — Each sitting opens with a roll call in which every participant gives its clock from `date -u`, its role and the goal in its own words; the first sitting proves each route with a join check; each sitting is adjourned with its minutes and a resume note. (standard-meeting.md#47-sittings-and-the-roll-call, standard-meeting.md#414-minutes)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Did each sitting open with a full roll call, and end with minutes and a resume note where it was adjourned?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-5 [J] — messages are one immutable, clock-named file each** — Each message is one file in `messages/`, never edited once written, named from `date -u` with its sender's role, and opens with who it is from, who it is for and what it answers, closing with its asks; the caller keeps the open asks in the entry file until each is answered. (standard-meeting.md#48-messages)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is every message a single unedited file, named from the clock and its role, saying whom it is from and for, what it answers and what it asks?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-6 [J] — the caller listens and checks in while the meeting is open** — The caller watches the whole folder while the meeting is open, the agenda states each participant's listening interval, and the caller posts a check-in every 15 minutes, which each participant answers unless it wrote in that time. (standard-meeting.md#49-listening-and-check-ins)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Did the caller listen to the whole folder, did the agenda state each interval, and were check-ins sent as the standard sets?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-7 [J] — Git and private data are handled as the standard sets** — Each participant that reaches the repository commits its own files and pushes fast-forward only; the caller commits for a participant without Git or in exchange mode; store data stays in the meeting folder, and the caller's side renders anything that carries it. (standard-meeting.md#412-git-and-private-data)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was every file committed by its writer or by the caller for one without Git, and did store data stay in the folder and on the caller's side?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-8 [J] — decisions go to change documents, never the meeting** — Each decision the owner takes goes into its change document as it is taken, and each choice left to the owner is carried into that document's open questions with its recommendation; the meeting holds the conversation, never the decision, and a refusal goes to the owner rather than round it. (standard-meeting.md#413-decisions, standard-meeting.md#414-minutes)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Is every decision the meeting led to held in a change document, with every choice left to the owner carried there with its recommendation?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
- **MEETING-9 [J] — the caller's last message closes the meeting** — The meeting closes only by the caller's last message, naming each outcome and the change document that holds it; listening then ends, the work that landed gets its record, and the folder is removed once the owner has reviewed that record. (standard-meeting.md#415-closing)
  - _Evidence scope:_ The target skill and the evidence named by this criterion.
  - _Review prompt:_ Was the meeting closed by a message naming each outcome and its change document, with listening ended and the record written?
  - _Outcomes:_ conforming; gap; exclusion
  - _Conforming guidance:_ Record the review as conforming, a named Gap with its next action, or an explicit justified exclusion.
