---
type: standard@2026-11-09T21:36:32Z
revised: 2026-11-14T06:00:00Z
status: in force
---

# Meeting

## Contents

- [1. Introduction](#1-introduction)
- [2. Scope](#2-scope)
  - [2.1 In scope](#21-in-scope)
  - [2.2 Out of scope](#22-out-of-scope)
- [3. Terms and definitions](#3-terms-and-definitions)
- [4. Rules](#4-rules)
  - [4.1 When to meet](#41-when-to-meet)
  - [4.2 Who calls, keeps and owns a meeting](#42-who-calls-keeps-and-owns-a-meeting)
  - [4.3 Types](#43-types)
  - [4.4 Where a meeting is kept](#44-where-a-meeting-is-kept)
  - [4.5 The entry file](#45-the-entry-file)
  - [4.6 Routes](#46-routes)
  - [4.7 Sittings and the roll call](#47-sittings-and-the-roll-call)
  - [4.8 Messages](#48-messages)
  - [4.9 Listening and check-ins](#49-listening-and-check-ins)
  - [4.10 A busy participant](#410-a-busy-participant)
  - [4.11 Doing the work](#411-doing-the-work)
  - [4.12 Git and private data](#412-git-and-private-data)
  - [4.13 Decisions](#413-decisions)
  - [4.14 Minutes](#414-minutes)
  - [4.15 Closing](#415-closing)
  - [4.16 Runtime binding](#416-runtime-binding)

## 1. Introduction

A meeting is a room at one node of the work tree, where named participants come together for a while, with a purpose and an express remit, to make, review or look back on something, and then go back to working alone. It is held by hand today, in a folder of plain files that every participant reaches by its own route; a tool may later hold the same shape. The owner, the person whose work it is, owns every meeting, and the meeting holds the conversation, never the decision. The decisions behind these rules are in [the sources file](sources.md#3-decisions).

Ten points were taken overnight on 14 November 2026 under the owner's remit for high-confidence work, for the owner's review; the owner confirms or undoes them as a whole. Each is marked "taken overnight for the owner's review" where it stands, and [the sources file](sources.md#3-decisions) lists them.

[Back to contents](#contents)

## 2. Scope

What a meeting is, how it is called, held and closed, and how its participants reach each other.

### 2.1 In scope

- When a meeting is the right channel, and who calls, keeps and owns one.
- The three types of meeting and what each produces, with a standard of its own for each.
- The meeting folder, its entry file and its messages.
- Routes, sittings, roll calls, listening and check-ins.
- How work, Git, private data and decisions are handled in a meeting, and its minutes and close.

[Back to contents](#contents)

### 2.2 Out of scope

- The work package a meeting serves and its change documents: `ki-work-package`.
- Coordinating work, its levels, states and reports: `ki-coordination`.
- Background runs a participant starts: `ki-delegation`.
- The format of a change document: `ki-authoring`.
- The store a meeting lives in, its roster and its commit gate: that store's own contract.
- What a meeting is finally called; "meeting" is the working word.

[Back to contents](#contents)

## 3. Terms and definitions

| Term | Definition |
| --- | --- |
| **Meeting** | A room at one node of the work tree that named participants attend for a while, with a purpose, a type and an end. **Standard:** this one, [4.1](#41-when-to-meet) |
| **Owner** | The person whose work it is; owns every meeting, and whose word decides. **Standard:** this one, [4.2](#42-who-calls-keeps-and-owns-a-meeting) |
| **Caller** | The session that calls a meeting, keeps it and closes it, and the only session of its agent host in the room. **Standard:** this one, [4.2](#42-who-calls-keeps-and-owns-a-meeting) |
| **Chair** | The session that runs a meeting's sittings; the caller, unless the owner starts another session to chair. **Standard:** this one, [4.2](#42-who-calls-keeps-and-owns-a-meeting) |
| **Participant** | Each session or person taking part, with a role stated in the agenda, such as caller, maker, reviewer, illustrator or owner. **Standard:** this one, [4.5](#45-the-entry-file) |
| **Route** | How a participant reaches the others: its agent host's own messaging, the meeting folder, or exchange mode. **Standard:** this one, [4.6](#46-routes) |
| **Exchange mode** | The exception in which the owner carries prompts both ways for a participant that cannot reach the folder. **Standard:** this one, [4.6](#46-routes) |
| **Sitting** | One period of a meeting, lettered A, B, C and on, with a stated end, opened by a roll call and ended by its minutes. **Standard:** this one, [4.7](#47-sittings-and-the-roll-call) |
| **Closing call** | The chair's message, 15 minutes before a sitting's stated end, that asks what each participant will finish by then. **Standard:** this one, [4.7](#47-sittings-and-the-roll-call) |
| **Roll call** | Each participant's answer at a sitting's start: its clock, its role and the sitting's goal in its own words. **Standard:** this one, [4.7](#47-sittings-and-the-roll-call) |
| **Message** | One file in the meeting's `messages/`, never edited once written. **Standard:** this one, [4.8](#48-messages) |
| **Open ask** | Something a message asks of a named participant, tracked in the entry file until answered. **Standard:** this one, [4.8](#48-messages) |
| **Minutes** | A sitting's record in the entry file: what was done, decisions, other business, actions, choices left to the owner and the transcript. **Standard:** this one, [4.14](#414-minutes) |

[Back to contents](#contents)

## 4. Rules

The rules, part by part.

### 4.1 When to meet

1. **The first route that works.** Sessions on the same agent host talk through its own messaging, and need no meeting for it ([4.6](#46-routes)).
2. **Otherwise, a meeting.** Sessions that cannot reach each other that way are brought together in a meeting, for a time and with an express remit to discuss its matters. Addressed messages between work are gone; a meeting takes their place, and nothing is said between sessions across hosts outside one.
3. **A meeting sits at one node** of the work tree, has a type, a purpose and its participants, and ends. Question, answer and information are messages inside it; the opening carries the brief, joining replaces an acknowledgement, and the close ends it.
4. **Each session goes back to working alone** when the meeting ends. A meeting grants no authority beyond what the owner gives in it or in the owner's own sessions.

[Back to contents](#contents)

### 4.2 Who calls, keeps and owns a meeting

1. **Who calls.** The session holding the node, or one above it; at the root, the root's guardian. A session below the node asks up.
2. **The owner owns the meeting.** The owner's word decides. A participant that disagrees says so in a message, and does not change course on its own.
3. **One caller in the room.** The caller is the only session of its agent host that listens in the room. A session on another agent host, one the caller's host messaging cannot reach, such as a desktop design session, sits in the room with it and is treated almost as a subagent. Other sessions on the caller's host stay out and talk to the caller through their host's messaging; the caller brings them what the room needs and carries their answers back.
4. **The caller keeps it.** It makes the folder, writes and keeps the entry file, opens and adjourns each sitting, keeps the open asks and the minutes, and closes the meeting.
5. **A chair who need not hold the package** (MEET-CHAIR, taken overnight for the owner's review). The caller chairs the meeting. The chair need not hold the work package the meeting serves; the owner may start a session to chair it. The entry file names the owning package and its change document; the package's holder takes part from outside the room through its host's messaging, or in it. The chair puts each outcome and each choice left to the owner in the minutes and sends them to the holder, who records them in its change documents, since only the session bound to a package changes it; while no session holds the package, the root's guardian does.

[Back to contents](#contents)

### 4.3 Types

Each meeting is of one type, named in its entry file, which says what the meeting produces:

| Type | What it does | What it produces | Standard |
| --- | --- | --- | --- |
| **Workshop** | Makes something together, such as designs | The thing made, in the output folder, each part final or with its choices listed | [Workshop](standard-workshop.md) |
| **Review** | Assesses something already made | A verdict on each part | [Review](standard-review.md) |
| **Retrospective** | Looks back at a meeting or a run of work | What to keep and what to change, each sent to the change document that owns that way of working | [Retrospective](standard-retrospective.md) |

A meeting runs by this standard and by its type's.

**The standing room, for now** (STANDING-NOW, taken overnight for the owner's review). The one standing room already held, the housekeepers' room between two rigs, carries on as it is, the one exception to the three types, until the try between machines in [4.6](#46-routes); no fourth type is set until then.

[Back to contents](#contents)

### 4.4 Where a meeting is kept

1. **A folder per meeting** at `meetings/<node id>/<date>-<slug>/`, with no territory folder, in the store the work tree lives in; today that is the Cairn store, whose contract says who keeps its `meetings/`. `<node id>` is the node's work id and `<date>` the day the meeting is called. This is the current depth. The first trial's folder, `meetings/cairn.wayfinder.designs/`, predates it and keeps its place until it closes; a reader takes both.
2. **The folder holds:**
   - `_index.md`, the entry file, never `README.md`;
   - `messages/`, one file per message;
   - `brief/`, what participants work from;
   - an output folder named for the work, such as `designs/`;
   - `notes/`, for anything too long for a message.
3. **How output is named** belongs to the kind of work, such as a design meeting's levels, not to this standard.
4. **Nothing in the folder is a decision.** Outcomes live in change documents ([4.13](#413-decisions)).

[Back to contents](#contents)

### 4.5 The entry file

The caller makes the folder and writes `_index.md`. Setting a meeting up and briefing it are one thing. It opens with a front matter block that tools read (MEETINGS-SOURCE), kept by the caller and changed at each roll call, adjournment and close:

```yaml
---
meeting: cairn.wayfinder.designs   # the folder's name
kind: workshop                     # workshop | review | retrospective
sitting: C                         # the current or last sitting
chair: warden                      # the chair's role; the caller's, unless the owner started another session to chair
status: open                       # open | adjourned | closed, the meeting closed after its last sitting
opened: 2026-11-13T22:29Z          # when this sitting opened, from date -u
closed:                            # when this sitting was adjourned or the meeting closed
participants:                      # those who answered this sitting's roll call
  - role: warden                   # its messages' <from>, lower-case kebab-case
    name: Wayland                  # its name, where the owner has given one
    host: orca                     # its agent host, spelt as the roster spells hosts
    rig: sol
    route: host                    # host | folder | exchange, as 4.6 numbers them
  - role: information-architect
    host: claude-desktop
    rig: sol
    route: folder
---
```

The `chair` field (CHAIR-FIELD, taken overnight for the owner's review) names the chair by its role. A tool reads this block and the message file names ([4.8](#48-messages)), and nothing else in the folder. The owner is not listed; the owner is at every meeting. Then, in order:

1. **Summary,** kept current: where the meeting stands, the decisions it has led to, and what comes next.
2. **Brief:** why the meeting exists, what it should produce, the change document that will hold its decisions, and what participants work from.
3. **Agenda:** the sittings, each with its items and its end, stated when it opens ([4.7](#47-sittings-and-the-roll-call)), and each participant with its role, how it is reached, how it writes, and who listens at what interval and until when.
4. **Boundaries:** what the meeting may and may not do.
5. **Open asks,** as a checklist the caller ticks as each is answered.
6. **Minutes,** one part per sitting ([4.14](#414-minutes)).

[Back to contents](#contents)

### 4.6 Routes

How participants reach each other, three levels, the first that works:

1. **The agent host's own messaging.** Agents on the same agent host talk through it; no meeting is needed for that.
2. **A meeting folder.** Otherwise they are brought together in a meeting. Each participant must reach the repository that holds the folder, by whatever route its runtime gives. Most reach it on the file system, where each sees what another writes at once, and still commits, pulls and pushes. One that cannot reaches it through its own connector to the repository's host, such as a GitHub connector. The agenda gives each participant's route.
3. **Exchange mode, the exception.** Only when an agent is too limited to reach the repository at all, or the owner chooses to manage the exchange in person, does the owner carry prompts both ways. The caller writes each prompt as a message ending in one block to paste; the owner pastes it across and brings the answer back; the caller files the answer as that participant's message, marked as carried by the owner, such as "carried by Kris".

**Between machines** (CROSS-RIG-TRY, taken overnight for the owner's review). Sessions on different machines meet in a meeting folder. Nothing is built for a route between machines, a relay included, until one try of the agent host's own remote messaging between a session on each machine, and that try waits for the owner to turn it on at each; [4.16](#416-runtime-binding) names what is tried.

[Back to contents](#contents)

### 4.7 Sittings and the roll call

1. **Sittings.** A meeting has no fixed end; it runs in sittings, A, B, C and on. A sitting that reaches its end, or runs out of work, is adjourned: the caller writes its minutes and a resume note saying where the next sitting picks up. The meeting closes after its last sitting.
2. **Each sitting has a stated end** (SITTING-END, taken overnight for the owner's review). The sitting's opening message states its end, from `date -u`, and the chair may extend it by posting a new one. Fifteen minutes before the end, the chair sends one closing call, asking what each participant will finish by then.
3. **Roll call.** Each sitting opens with one. Every participant answers with its clock, from `date -u`, its role, and the sitting's goal in its own words, so all work to one time and one aim.
4. **Each route to Git** (GIT-ROUTE, taken overnight for the owner's review). At roll call each participant also states its route to Git: whether it can commit, pull and push.
5. **The join check.** In the first sitting, the roll call also proves each route. The caller sends each participant a code word by its own route, the owner gives each a small task in its own session, and each answers by its route, which proves listening and replying before real work starts.
6. **First needs.** Each participant's first message says what it needs from the meeting.

[Back to contents](#contents)

### 4.8 Messages

1. **One file per message** in `messages/`, never edited once written.
2. **Named** `<YYYYMMDD>T<HHMM>Z-<from>-<subject>.md` from `date -u`, so the folder lists in order and two messages in one minute stay distinct. `<from>` is the sender's `role` in the entry file's front matter ([4.5](#45-the-entry-file)), exactly, since tools read who posted when from the name; a message the owner carries keeps the role of the participant it is from.
3. **Each opens** with who it is from, who it is for, and the message it answers, if any; then what changed, in plain words; the files it points to, by their path in the folder; and a closing `Asks:` naming who must do what.
4. **Open asks.** The caller keeps them in the entry file and ticks each off when it is answered, so nothing asked is lost.
5. **Against crossing** (TRIAL-LESSONS, taken overnight for the owner's review). A participant that needs the others to wait posts a one-line "hold"; each board or other piece of output is rendered once per review pass; and new messages are read in the order of their times.
6. **A correction names what it corrects** (TRIAL-LESSONS, taken overnight for the owner's review): the message it corrects, by its file name.
7. **Times come from the clock** (TIMES-CLOCK, taken overnight for the owner's review). Every time recorded in a message, the entry file or the minutes comes from `date -u` or from Git, never from memory; any other time is marked "about".

[Back to contents](#contents)

### 4.9 Listening and check-ins

1. **The caller listens** while the meeting is open, watching the whole folder and waking when anything in it changes, since a participant can write a note or a brief without a message. Where participants have presence entries, such as the Cairn store's roster, the caller's shows `listening` while it attends an open meeting.
2. **A host without a lasting shell** listens by scheduled wake-ups instead, and otherwise re-reads `messages/` when the owner prompts it and before each new piece of work.
3. **The agenda states** each participant's interval, the longest a message waits for it, and when its listening ends.
4. **Sessions outside the room** do not watch it.
5. **Check-ins.** Every 15 minutes the caller posts `<caller> → all: check-in` in the folder and sends each participant outside the room a short note by its host's messaging; each replies with what is done, what it is doing and what blocks it, or "nothing". A participant that wrote in the last 15 minutes may skip it.

[Back to contents](#contents)

### 4.10 A busy participant

Taken overnight for the owner's review (MEET-BUSY):

1. **Briefs are whole.** Each brief is posted whole, in `brief/` or in a message, complete enough to act on without asking, so a participant busy elsewhere picks it up when free.
2. **No one waits on a reply** to keep working. A participant that meets a choice only the owner can make finishes what does not depend on it, lists the choice with its recommendation, and moves to other work, never leaving work stopped on it.

[Back to contents](#contents)

### 4.11 Doing the work

1. **Long work goes to subagents.** Each session hands long work to its own agent host's subagents and keeps its thread free to answer, and reports results as messages, not commentary.
2. **The caller checks a participant's output** with its own reviewer, such as a render check, and keeps that reviewer across passes, resumed rather than started afresh, so it reuses its scripts and baseline.

[Back to contents](#contents)

### 4.12 Git and private data

1. **Each participant that reaches the repository** commits its own files, pulls and pushes, on the file system or through its connector, and expects to rebase. Pushes are fast-forward only, never forced, and hooks are never skipped.
2. **The caller commits** what a participant in exchange mode, or one without Git, writes. For a participant without Git, such as one in a sandbox that cannot commit, the chair commits each file as soon as it is posted as ready, before rendering it (GIT-ROUTE, taken overnight for the owner's review).
3. **Commit messages** use the store's own commit gate; in the Cairn store, `docs(meetings): …`.
4. **Private data.** Store data shared with a participant, such as a sample of the store for a design to fill, stays in the meeting folder, which is as private as the store, and the caller's side, not the participant's, renders anything that carries it.
5. **An invented sample** (TRIAL-LESSONS, taken overnight for the owner's review). Where a participant's work would be filled with store data, a sample with invented names is agreed at the start, so the participant can render its own work.

[Back to contents](#contents)

### 4.13 Decisions

1. **Each decision the owner takes** goes into its change document as it is taken, by the session that holds the package the meeting serves. The meeting holds the conversation, never the decision.
2. **A refusal** in one participant's session, by its permissions or its own checks, is never relayed through another participant to get round it; it goes to the owner.

[Back to contents](#contents)

### 4.14 Minutes

1. **Each sitting ends with its minutes** in the entry file:
   - what was done;
   - the decisions the owner took, each pointing to its change document;
   - any other business;
   - the actions, each with its owner;
   - the choices left to the owner, each with its recommendation;
   - the resume note, after an adjournment;
   - the transcript: the sitting's messages in order, a line each linking to its file.
2. **Choices left to the owner.** Whoever did the work lists them, each with its recommendation, and the caller carries them into the change document's open questions, which feeds the owner's next report.
3. **Choices go to the owner whole** (CHOICES-WHOLE, taken overnight for the owner's review). Each choice carries its context, its options and a recommendation with its confidence, in the message itself.

[Back to contents](#contents)

### 4.15 Closing

1. **The caller's last message closes the meeting,** naming each outcome and the change document that now holds it. Nothing closes by itself. The close restates each choice and recommendation it carries, and never refers back to an earlier message for them (CHOICES-WHOLE, taken overnight for the owner's review).
2. **Listening ends.** The caller's watcher stops, and its presence entry's `listening` is set back to false.
3. **Work that landed** during the meeting gets its record, as the store's own rule for records sets.
4. **The folder is removed** from the tree once the owner has reviewed that record, and Git history keeps it.

[Back to contents](#contents)

### 4.16 Runtime binding

How the rules above fall on the agent hosts in use when the standard was written. The rules stand without them.

- **Agent host messaging:** Orca's messages between its sessions, for Claude Code sessions on one rig. The caller is a Claude Code session; other Claude Code sessions stay out of the room and reach it over Orca.
- **In the room on the file system:** Claude Design in Claude Desktop, and an illustrator in the ChatGPT desktop app's Codex, each reading and writing the folder directly and committing its own files.
- **Through a connector:** ChatGPT's voice mode, which cannot reach the file system, through its own GitHub connector.
- **Between machines:** the remote messaging to try is Claude Code's Remote Control, between a session on sol and one on terra (CROSS-RIG-TRY).
- **Without Git:** Claude Design works in a sandboxed shell that cannot delete Git's lock files and has no checkout or push of its own, so it is a participant without Git, and the chair commits its files.
- **Listening:** the caller runs a shell watcher on the folder; Claude Desktop, which cannot keep a shell loop open between turns, listens by scheduled wake-ups. In the first sitting the caller checked every 30 seconds and Claude Design every two minutes until a set time.

[Back to contents](#contents)
