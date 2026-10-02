---
name: ki-recap
ki-kind: process
ki-applicability: invocation-only
ki-depends-on: [ki-authoring]
description: >
  Recap the live session by summarising changes, decisions, touched files, unfinished work, and durable
  learning routes. Use for a session recap or outstanding-work handoff; use `ki-next` to select backlog work
  and housekeeping skills for historical session acquisition.
argument-hint: 'checkpoint <thread> | help | recap [--runtime detect|claude|codex] [--transcript <session-file>]'
---

# ki-recap

**Kind:** process. Recaps a **live** session — warm, in-context, run inside the session itself. Read [the session-recap standard](references/standards-session-recap.md) for the procedure and [the runtime sources](references/sources.md) when refreshing runtime claims.

## What this skill does

Three legs, always in this order:

1. **Summarise** the whole live thread through this invocation — changes, decisions, and files touched across every repository involved. A recap or compaction within the thread does not reset its scope.
2. **Surface what is outstanding** — only work still open in this thread. Check session-owned files in each touched repository separately; dirty files from other threads and generic future work are out of scope. Verify a canonical roadmap or Stream record in the owning repository for every substantive follow-up agreed in this thread. A captured follow-up is a recorded deferral: name its home and state, but do not count its remaining lifecycle work as outstanding here. Returning work to another owner is not, by itself, a durable handoff; an explicit decision that no follow-up is intended needs no record.
3. **Harvest the learnings** — dead-ends, workarounds, conventions discovered in-session — and route each through `ki-authoring`'s knowledge-promotion convention set: distinguish a durable learning from unfinished work, then choose its narrowest appropriate owner. Confirm with the user before writing anywhere durable.

During the learning harvest, raise any new reusable repository-review question, lens, evidence expectation, output requirement, or method that the `ki-repo` REVIEW procedure does not yet cover as a **repository-review checklist candidate**. Offer to update that canonical checklist, but do not change it without the user's confirmation.

Reconcile every material discussion point before claiming the thread is closed. When the user asks for coverage, or several materially different discussion points would otherwise be hard to trace, show the **Discussion coverage** matrix after the three legs and before Actions. The matrix is a reviewer aid, not proof that an unavailable transcript was complete; the full procedure fixes its four columns, closed dispositions, and evidence limits.

Normal recap also applies the `ki-batch` “Batch retention” rule to eligible inactive records under `+/_BATCHES/`, reports exact removals, and refreshes Git grounding afterwards. This narrowly authorised housekeeping is separate from proposed recap Actions and never prunes roadmap records.

The recap always closes with an **Actions** section: a concrete, imperative checklist of only the current thread's unfinished work (files to commit, gates to re-run, agreed follow-up to capture, approved learning routes to apply). When that evidence-led list is empty, section 6 of the procedure decides between a truthful one-line no-actions state and the fixed evidence-bearing completion banner; the banner appears only when every completion gate passes, and repeats for as long as they do. Do not turn a recorded roadmap deferral, its review or acceptance, peer state, or prospective work into an action; `ki-next` owns selecting or sequencing future work. Prefix each action with a short, unique, uppercase hyphenated label that names the work, rather than an arbitrary sequence number (for example, `FIX-AUTHORING-AUDIT`). It is a checklist for the user, not actions taken unprompted.

When `ki-accept` asks for a work-record mini recap, use the same grounding and learning-routing boundary in the smaller item scope: delivered work, verification evidence, outstanding concerns, and proposed learning routes. Cite the item by its canonical `<REPO>-<NNN>` or area-qualified `<REPO>-<AREA>-<NNN>` identifier; in a KB, also cite its `Streams/Roadmap/` path. The roadmap item's `## Review` section is not permission to promote a learning outside that record.

When the user wants to select or sequence future work after a recap, route that separate request to `ki-next`. Do not present it as an action, invent a future-work checklist, or invoke `ki-next` from the recap itself.

The boundary after every recap and before a new work cycle is a compaction decision point: preserve only what is in scope for the next cycle, then offer the documented runtime mechanism when it is available. Do not autonomously invoke a user-facing compaction command. Two conditions withhold that offer — the recap has not yet recorded the durable outcome (an active change, unresolved tool operation, or uncommitted implementation unit), or no substantive work has entered context since the last compaction, the minimum-footprint floor that stops a recap and an immediately following `ki-next` compacting twice across an unchanged span. The applicable `ki-tokenomics` runtime adapter owns the mechanism's evidence boundary; current Claude Code and Codex both document user-invocable compaction, but availability and agent authority are runtime/session-specific. Where it cannot be invoked, say so plainly — a digest is useful handoff material, not context reduction.

The recap grounds every checkable claim in current reality, not in warm context or recalled memory: before asserting a commit landed, a gate passed, or a file's state, it re-checks (`git log`, the read-only gate, a fresh read) — stale context otherwise reads as fact.

A mechanical **grounding helper**, [`scripts/recap-grounding.ts`](scripts/recap-grounding.ts), resolves one physical Git root before reporting staged, unstaged, and untracked evidence. Run it for each repository touched by this thread. If Git cannot establish a root or read its evidence, it reports `repository.status: unavailable`; never call that state clean. It may parse a repository-matching Claude or Codex transcript for advisory tool tally and historical markers, but that selection neither identifies the invoking thread nor limits its scope. Those local JSONL formats are version-sensitive convenience evidence, not a stable runtime interface. On a later recap it compares a compatible prior marker and reports `unchanged`, `changed`, or `unavailable`; current Git state remains authoritative.

When the user explicitly invokes `checkpoint <thread>`, follow the [portable checkpoint hand-off](references/standards-session-recap.md#9-create-a-portable-checkpoint-hand-off) procedure. This optional composition supplies grounded recap evidence to `ki-checkpoint`; it does not take ownership of checkpoint identity, schema, lifecycle, or writes. The pure [`checkpoint-handoff.ts`](scripts/internal/checkpoint-handoff.ts) model documents and tests the fail-closed preflight; it performs no live reads or writes.

## Invocation

`help` / `-h` / `?` explains this skill and stops, taking no action. With no argument, run the three-leg procedure over the whole current thread, then preserve a carry-forward digest and compact unless a safety or minimum-footprint condition withholds it. Grounding uses `--runtime detect` by default, selecting the newest repository-matching Claude or Codex transcript as advisory evidence; use `--runtime claude` or `--runtime codex` to force one runtime. `--transcript <session-file>` selects one eligible candidate by basename only when concurrent sessions make modification time ambiguous. Neither option changes the live thread's coverage boundary.

`checkpoint <thread>` is available only when the user explicitly requests that exact human-selected thread and the target repository declares a valid `ki-checkpoint` capability. It validates the portable hand-off inputs, then invokes the existing `ki-checkpoint` UPDATE procedure; it is not a host command and does not make a checkpoint automatically during ordinary recap.

## Notes

- No universal AUDIT/CONFORM/EDUCATE/REFRESH modes — this is a process skill (ADR-KI-HARNESS-SKILLS-001, ADR-KI-HARNESS-SKILLS-006); it has one procedure with an optional coverage matrix.
- Sibling to the offline, mechanical "mine historical sessions" ROADMAP candidate — that is the **cold** leg (after the fact, over stored transcripts); this is the **warm** leg (in-session, while context is live). They share the grounding substrate and the routing table, not an implementation.
- Installed as a core user skill by `ki bootstrap` — usable in any repo on the machine. Like `ki-bootstrap`, it is not a repository-governance root and has no `[skills.ki-recap]` table.
