---
type: sources@2026-11-09T21:36:32Z
revised: 2026-11-13T17:19:10Z
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
| [Change 34, Meetings](https://github.com/krisb/ki-cairn-store/blob/1ffac0a5ee2ea0b94fda4e973596c889f9341573/work/cairn/cairn.summit/34-meetings.change.md), the Cairn summit's, §4.1 and §4.2 | Every rule in the meeting standard: §4.1's decisions of 11 November, and §4.2's seventeen points for meetings held by hand, from the first trial, of 13 November | 2026-11-13 |
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
| MEET-CHAIR | The caller chairs; the chair need not hold the package the meeting serves; the package's holder records outcomes from the chair's minutes. | 2026-11-13 | [meeting](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) | Proposed, awaiting Kris's word |
| MEET-BUSY | Briefs posted whole; no one waits on a reply; nothing left stopped on a choice only Kris can make. | 2026-11-13 | [meeting](standard-meeting.md#410-a-busy-participant) | Proposed, awaiting Kris's word |
| MEETINGS-SOURCE | Cairn reads `meetings/` read only: the entry file's front matter block, kept by the caller, and the message file names, whose `<from>` is the sender's role there. | 2026-11-13 | [meeting](standard-meeting.md#45-the-entry-file) | In force |

[Back to contents](#contents)

## 4. Last review

- 2026-11-13 - The skill written from change 34 §4.1 and §4.2 and change 24 §4.4, on Kris's word ("you need to write the meeting skill now"), and copied into the Cairn store. Only the workshop has been held, in one meeting; the review and retrospective standards are kept to what each type needs until one is held, and change 34's gap "more meetings to test it" stands. Watching four open questions in [change 34 §7.1](https://github.com/krisb/ki-cairn-store/blob/1ffac0a5ee2ea0b94fda4e973596c889f9341573/work/cairn/cairn.summit/34-meetings.change.md#71-questions), each recommended a):
  - **CHECKIN-QUIET:** between rounds, when no work is running, a check-in is sent only when there is news; or every 15 minutes regardless.
  - **MEET-CHAIR:** a chair that need not hold the package, as [the standard](standard-meeting.md#42-who-calls-keeps-and-owns-a-meeting) proposes; or the chair is always the package's holder.
  - **MEET-BUSY:** whole briefs and no waiting on replies, as [the standard](standard-meeting.md#410-a-busy-participant) proposes; or left to each meeting's agenda.
  - **ROSTER-LISTEN:** every participant with a roster entry shows `listening` while it takes part in an open meeting; or only the chair does.

[Back to contents](#contents)
