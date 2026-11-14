---
name: ki-meeting
ki-kind: process
ki-applicability: invocation-only
ki-depends-on: []
description: >
  Call, hold and close a meeting: a room at one node of the work tree where named participants, each reaching it by
  the first route that works, make, review or look back on something together, in sittings with a roll call, one file
  per message, check-ins and minutes, while decisions go to a change document. Use to call a meeting, open, adjourn
  or join a sitting, or close one, and to choose a workshop, review or retrospective; use `ki-coordination` for
  coordinating work and its reports, and `ki-work-package` for the package a meeting serves.
argument-hint: 'adjourn <meeting> | call <node id> <slug> | close <meeting> | help | join <meeting> | sit <meeting>'
---

# ki-meeting

**Kind:** process. Runs one meeting from its call to its close, held by hand in a folder of plain files that every participant reaches by its own route.

Read [the meeting standard](references/standard-meeting.md) before calling, joining or keeping a meeting, and the standard for the meeting's type: [workshop](references/standard-workshop.md), which makes something together; [review](references/standard-review.md), which gives a verdict on each part of something made; or [retrospective](references/standard-retrospective.md), which looks back for what to keep and what to change. [The sources](references/sources.md) record the decisions behind them, the two points still proposed (MEET-CHAIR, MEET-BUSY) and the open questions.

## When to use it

Use a meeting when sessions that cannot reach each other through their own agent host's messaging need to work together for a while on one matter, or when the owner asks for one. Sessions on the same agent host talk through its messaging and need no meeting. A message between sessions is never a substitute for a meeting: addressed messages between work are gone.

## Contract

- **Routes, the first that works:** the agent host's own messaging; a meeting folder, reached on the file system or through the participant's own connector to the repository's host; exchange mode, the owner carrying prompts both ways, only as the exception.
- **One caller** calls, keeps and closes the meeting, and is the only session of its agent host in the room; the owner owns it, and the owner's word decides.
- **The folder** is `meetings/<node id>/<date>-<slug>/` in the store that holds the work tree, today the Cairn store: `_index.md` (summary, brief, agenda, boundaries, open asks, minutes), `messages/`, `brief/`, an output folder named for the work, and `notes/`.
- **Sittings,** A, B, C and on, each opened by a roll call, kept by listening and 15-minute check-ins, and adjourned with minutes and a resume note.
- **The meeting holds the conversation, never the decision.** Each decision the owner takes goes into its change document as it is taken; each choice left to the owner goes into that document's open questions.

## Relationship boundary

- `ki-work-package` owns the package a meeting serves and its change documents; only the session bound to a package changes it.
- `ki-coordination` owns coordinating work, its levels, states and report forms.
- `ki-delegation` owns the background runs a participant hands long work to.
- `ki-authoring` owns the format of the change documents that hold a meeting's decisions.
- The store's own contract owns its `meetings/` folder, who keeps it, its roster and its commit gate.

A repository that cannot work without this skill, such as the Cairn store, carries a committed copy of it, recording the harness commit it came from; that copy is the version that counts there.

## Invocation

- `help`, `-h`, or `?` explains the meeting shape and these verbs without reading or writing anything.
- `call <node id> <slug>` checks the caller may call at that node and that no simpler route serves, chooses the type, makes the folder, writes `_index.md` with its summary, brief, agenda and boundaries, commits it, and opens sitting A.
- `sit <meeting>` opens the next sitting: the roll call, the join check in the first sitting, listening at the agenda's intervals and the check-ins.
- `join <meeting>` takes part as a participant: read `_index.md` and the brief, answer the roll call by its own route, say what it needs, and listen at the interval the agenda gives it.
- `adjourn <meeting>` ends the current sitting with its minutes and a resume note.
- `close <meeting>` writes the closing message naming each outcome and the change document holding it, stops listening, and leaves the folder for removal once the owner has reviewed the work's record.

With no meeting, no node, or no owner's word to hold one, report what is missing and stop.
