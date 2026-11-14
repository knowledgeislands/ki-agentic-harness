---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-14T13:51:34Z
refresh: canonical · on-change
---

# Meeting sources

## Contents

- [1. Introduction](#1-introduction)
- [2. Outside sources](#2-outside-sources)
  - [2.1 Authoritative](#21-authoritative)
  - [2.2 Advisory](#22-advisory)
- [3. Decisions](#3-decisions)
- [4. Last review](#4-last-review)

## 1. Introduction

The sources behind [the meeting standard](standard-meeting.md) and the three type standards, [workshop](standard-workshop.md), [review](standard-review.md) and [retrospective](standard-retrospective.md). The standards are owned in house, so the sources are Kris's decisions and the first meeting held by hand rather than outside specifications. The meeting standard was agreed in the Cairn summit's change 34 and made a skill of its own by change 24 (MEET-SKILL a); the Cairn store carries a committed copy of this skill, recording the harness commit it came from (SKILL-COPIES a, SKILL-MODE a).

[Back to contents](#contents)

## 2. Outside sources

The changes and the meeting the standards draw on.

### 2.1 Authoritative

| Source | Governs | Last reviewed |
| --- | --- | --- |
| [Change 34, Meetings](https://github.com/krisb/ki-cairn-store/blob/b450e98f2f69e3479bb56c8e557d43a47bc60edd/work/cairn/cairn.summit/34-meetings.change.md), the Cairn summit's, §4.1 and §4.2 | Every rule in the meeting standard: §4.1's decisions of 11 and 13 November and the four taken overnight on 14 November, and §4.2's seventeen points for meetings held by hand, from the first trial, of 13 November | 2026-11-14 |
| [Change 35, The first meeting's lessons](https://github.com/krisb/ki-cairn-store/blob/b450e98f2f69e3479bb56c8e557d43a47bc60edd/work/cairn/cairn.summit/35-meeting-trial.change.md), the Cairn summit's, §4.1 and §6 | The six lessons of the first meeting taken overnight on 14 November, and where each is written | 2026-11-14 |
| [Change 24, Runtimes and skill copies](https://github.com/krisb/ki-cairn-store/blob/1ffac0a5ee2ea0b94fda4e973596c889f9341573/work/cairn/cairn.summit/24-runtimes-and-skill-copies.change.md#44-the-meetings-skill), §4.2 and §4.4 | The skill itself: the meeting standard and one standard per type, each saying what the type produces; the committed copy in the Cairn store | 2026-11-13 |
| [The Cairn store contract](https://github.com/krisb/ki-cairn-store/blob/1ffac0a5ee2ea0b94fda4e973596c889f9341573/STORE.md#meetings), its Meetings section | The short form of the standard, now a pointer to this skill, and what stays the store's: the folder path and who keeps `meetings/` | 2026-11-13 |

[Back to contents](#contents)

### 2.2 Advisory

| Source | Informs | Last reviewed |
| --- | --- | --- |
| [The first meeting, `cairn.wayfinder.designs`](https://github.com/krisb/ki-cairn-store/blob/1ffac0a5ee2ea0b94fda4e973596c889f9341573/meetings/cairn.wayfinder.designs/_index.md), a workshop opened by ki.cairn's warden with Claude Design, a Claude Desktop session, on 13 November 2026, later joined by an illustrator in the ChatGPT desktop app's Codex | A worked example of the entry file, the agenda's routes, sittings, the roll call and join check, render passes and minutes; the workshop standard's rounds and review passes | 2026-11-13 |

[Back to contents](#contents)

## 3. Decisions

Kris took each decision below as recommended, unless the Status says otherwise. MEET-ROOM, MEET-OWNER and MEET-CHECKINS were settled without an id in change 34 and take one here, as they land.

| Id | Decision | Date | Backs | Status |
| --- | --- | --- | --- | --- |
| MEET-FILE | A folder per meeting: an opening file, then one file per turn, the close a turn of its own; nothing is edited. | 2026-11-11 | [meeting](standard-meeting.md#44-where-a-meeting-is-kept) | In force |
| MEET-PATH | Meetings live at `meetings/<node id>/<date>-<slug>/`, with no territory folder. | 2026-11-11 | [meeting](standard-meeting.md#44-where-a-meeting-is-kept) | In force |
| MEET-CALL | A meeting is called by the node's holder or one above it; the guardian at the root; one below asks up. | 2026-11-11 | [meeting](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) | In force |
| MEET-KINDS | Question, answer and info are turns inside a meeting; the opening carries the brief, joining replaces ack, the close ends it; addressed messages end. | 2026-11-11 | [meeting](standard-meeting.md#41-when-to-meet) | In force |
| MEET-ATTEND | No new roster field: `listening` is true while an actor attends an open meeting. | 2026-11-11 | [meeting](standard-meeting.md#49-listening-and-check-ins) | In force |
| MEET-CLOSE | The caller closes a meeting, naming each outcome and the change document now holding it; nothing closes by itself; harvest takes closed meetings only. | 2026-11-11 | [meeting](standard-meeting.md#415-closing) | In force |
| MEET-NOW | Nothing in `meetings/` until the MCP holds meetings; outcomes go straight to change documents. | 2026-11-11 | [meeting](standard-meeting.md) | Superseded by MEET-HAND |
| MESSAGES-GO | Addressed messages go away from the apps and the MCP; meetings take their place. Relayed by sol's housekeeper. | 2026-11-13 | [meeting](standard-meeting.md#41-when-to-meet) | In force |
| MEET-HAND | Meetings are held by hand now, in `meetings/`, without waiting for the MCP, which builds the same shape later. | 2026-11-13 | [meeting](standard-meeting.md) | In force |
| MEET-ROOM | One caller in the room: the only Claude Code session that listens there; a host without Orca sits in the room with it; other Claude Code sessions talk to the caller over Orca. | 2026-11-13 | [meeting](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) | In force |
| MEET-OWNER | Kris owns the meeting and his word decides; a participant that disagrees says so in a message and does not change course on its own. | 2026-11-13 | [meeting](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) | In force |
| MEET-SHAPE | "Run it like a good meeting": types, the entry file, the folder, sittings, roll call, messages, listening, doing the work, Git, private data, decisions, minutes and closing, as change 34 §4.2 sets out. | 2026-11-13 | [meeting](standard-meeting.md), [workshop](standard-workshop.md), [review](standard-review.md), [retrospective](standard-retrospective.md) | In force |
| MEET-ROUTES | Three levels of route, the first that works: the agent host's own messaging; a meeting folder reached on the file system or through a GitHub connector; exchange mode, Kris carrying prompts, only as the exception. Kris, at 17:05. | 2026-11-13 | [meeting](standard-meeting.md#46-routes) | In force |
| MEET-CHECKINS | Check-ins every 15 minutes, in the room and by Orca to those outside it; a participant that wrote in the last 15 minutes may skip one. | 2026-11-13 | [meeting](standard-meeting.md#49-listening-and-check-ins) | In force |
| INDEX-FILE | A folder that needs an opening file uses `_index.md`, never `README.md`. | 2026-11-13 | [meeting](standard-meeting.md#44-where-a-meeting-is-kept) | In force |
| MEET-SKILL | The meeting standard becomes a skill of its own, `ki-meeting`, holding the standard and one standard per type of meeting. | 2026-11-13 | [meeting](standard-meeting.md) | In force |
| MEET-CHAIR | The caller chairs; the chair need not hold the package the meeting serves; the package's holder records outcomes from the chair's minutes. | 2026-11-13 | [meeting](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| MEET-BUSY | Briefs posted whole; no one waits on a reply; nothing left stopped on a choice only Kris can make. | 2026-11-13 | [meeting](standard-meeting.md#410-a-busy-participant) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| MEETINGS-SOURCE | Cairn reads `meetings/` read only: the entry file's front matter block, kept by the caller, and the message file names, whose `<from>` is the sender's role there. | 2026-11-13 | [meeting](standard-meeting.md#45-the-entry-file) | In force |
| CROSS-RIG-TRY | Nothing is built for a route between machines, a relay included, until one try of the agent host's own remote messaging, Claude Code's Remote Control, between a session on sol and one on terra; the try waits for Kris to turn it on at each. | 2026-11-14 | [meeting](standard-meeting.md#46-routes) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| STANDING-NOW | The housekeepers' standing room carries on as it is, the one exception to the three types, until that try; no fourth type goes into the standard yet. | 2026-11-14 | [meeting](standard-meeting.md#43-types) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| SITTING-END | Every sitting has a stated end, given in its opening from `date -u`; the chair may extend it; one closing call from the chair 15 minutes before. | 2026-11-14 | [meeting](standard-meeting.md#47-sittings-and-the-roll-call) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| GIT-ROUTE | Each participant states its route to Git at roll call; for one without Git, the chair commits each file as soon as it is posted as ready, before rendering it. | 2026-11-14 | [meeting](standard-meeting.md#47-sittings-and-the-roll-call), [Git](standard-meeting.md#412-git-and-private-data) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| CHAIR-FIELD | The entry file's front matter block carries a `chair` field, the caller's role unless Kris starts another session to chair. | 2026-11-14 | [meeting](standard-meeting.md#45-the-entry-file) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| TRIAL-LESSONS | A sample with invented names agreed at the start; a one-line "hold", one render per board per pass, and new messages read by time; a correction names what it corrects. | 2026-11-14 | [messages](standard-meeting.md#48-messages), [private data](standard-meeting.md#412-git-and-private-data) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| CHOICES-WHOLE | Choices go to Kris whole: context, options and a recommendation with its confidence, in the message itself; a close restates them and never refers back. | 2026-11-14 | [minutes](standard-meeting.md#414-minutes), [closing](standard-meeting.md#415-closing) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| TIMES-CLOCK | Every recorded time comes from `date -u` or Git, and any other is marked "about", in the meetings standard and `ki-coordination`. | 2026-11-14 | [messages](standard-meeting.md#48-messages) | Taken overnight 2026-11-14 under REMIT-HIGH, for Kris's review |
| OPENER-NAME | Every brief or opener that starts a new agent session names the session line it is to take and tells it to rename itself to that line as its first act, `/rename <line>` in Claude Code; meeting participants' openers included. Kris, in conversation, relayed by Wayland. | 2026-11-14 | [sittings](standard-meeting.md#47-sittings-and-the-roll-call) | In force |
| SEAT-LINE | A seat working in a package without its keys, such as a maker in a meeting, is named `<role glyph> <work-id>+<role>`, as Wayland named `📐 ki.cairn+architect` and `🎨 ki.cairn+illustrator` for sitting D; the form is `ki-work-package`'s thread line. Kris, in conversation. | 2026-11-14 | [sittings](standard-meeting.md#47-sittings-and-the-roll-call) | In force |

[Back to contents](#contents)

## 4. Last review

- 2026-11-14 - OPENER-NAME a and SEAT-LINE a, which Kris took that day in conversation, written into [4.7](standard-meeting.md#47-sittings-and-the-roll-call): the opener that starts a participant in a new session names its session line and has it rename itself first, a maker without the package's keys taking `<role glyph> <work-id>+<role>`, and the agenda gives each participant's line. The Cairn store's committed copy of this skill needs refreshing. No external source refreshed.
- 2026-11-14 - The ten points of change 34 §4.1 (MEET-CHAIR, MEET-BUSY, CROSS-RIG-TRY, STANDING-NOW) and change 35 §4.1 (SITTING-END, GIT-ROUTE, CHAIR-FIELD, TRIAL-LESSONS, CHOICES-WHOLE, TIMES-CLOCK), taken overnight by the Cairn summit's guardian under REMIT-HIGH, written into the meeting standard at the sections change 35 §6 names, each marked where it stands, for Kris's review; he confirms or undoes them as a whole. Held for Kris and not written: WAKE-OPENER and DRAW-BUILD from change 35, CHECKIN-QUIET, ROSTER-LISTEN, CROSS-RIG and MEET-STANDING from change 34.
- 2026-11-13 - The skill written from change 34 §4.1 and §4.2 and change 24 §4.4, on Kris's word ("you need to write the meeting skill now"), and copied into the Cairn store. Only the workshop has been held, in one meeting; the review and retrospective standards are kept to what each type needs until one is held, and change 34's gap "more meetings to test it" stands. Watching four open questions in [change 34 §7.1](https://github.com/krisb/ki-cairn-store/blob/1ffac0a5ee2ea0b94fda4e973596c889f9341573/work/cairn/cairn.summit/34-meetings.change.md#71-questions), each recommended a):
  - **CHECKIN-QUIET:** between rounds, when no work is running, a check-in is sent only when there is news; or every 15 minutes regardless.
  - **MEET-CHAIR:** a chair that need not hold the package, as [the standard](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) proposes; or the chair is always the package's holder.
  - **MEET-BUSY:** whole briefs and no waiting on replies, as [the standard](standard-meeting.md#410-a-busy-participant) proposes; or left to each meeting's agenda.
  - **ROSTER-LISTEN:** every participant with a roster entry shows `listening` while it takes part in an open meeting; or only the chair does.

[Back to contents](#contents)
