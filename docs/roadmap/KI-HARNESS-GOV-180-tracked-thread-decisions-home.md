---
id: KI-HARNESS-GOV-180
area: GOV
title: Tracked thread decisions home
project: ways-of-working
component: governance
status: triage
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-13T23:05:00Z
updated_at: 2026-10-13T23:05:00Z
---

# Tracked Thread Home for the Decisions Log and Agent Reports

## Goal

A coordinating thread's decisions log and its background agents' reports live in a tracked `+/_THREADS/<thread>/` folder in the owning repository, committed as the thread goes, so that losing the machine-local state folder loses no knowledge. The state folder under `~/.local/state/ki/agents/<run>/` keeps runtime material only. A prompt describes the decision it acts under rather than citing it by number.

## Context

The `ki-delegation` background-run standard puts the whole run packet, decisions log and final report included, under the XDG state root, and says of it: "The run directory, decisions log included, is non-durable, machine-local working material under the XDG state root: it is not backed up or synced, and it is not a Decision Record. At each checkpoint update, and before a run or thread closes, consolidate every in-force decision into its durable owner - a Decision Record through `ki-decision-records`, a skill, or the thread's checkpoint. Nothing durable may exist only in the run directory." Its decisions-log rule adds: "A prompt cites its authority by number ("Decision 18"), never by paraphrase alone."

Kris raised the durability problem on 2026-10-13 in the `ways-of-working` thread: decisions in the state folder's `decisions.md` "are part of the conversation and should materialise in repository records, otherwise knowledge is lost if work moves", and records that cite "Decisions 19 and 20 of the ways-of-working run" need local state to be understood. On the home for the log Kris first said: "I'm not sure why it can't be under a working area within the relevant repository. I think a key thing here should be that if the state folder is lost, you shouldn't lose any knowledge, or at least you should be able to recover from it." On citation by number: "I actually think we should not necessarily need to put the decision number anywhere. It should be written about what the decision was or is." The thread then offered three homes and Kris settled it, in words that reached the thread with stop words stripped, quoted as received: "DECISION-HOME - (b) tracked +/_THREADS/<thread>/ for the decisions log and agent reports; state folder keeps runtime only."

Kris also queued the clean-up of existing run folders behind this decision: "STATE-CLEANUP - Yes. Queue it after DECISION-HOME is settled." That sweep is Knowledge Islands Principal's record, since the folders span repositories; the `ki agent` change that writes the log and reports to the new home is the `tools-ki` agent run close record.

This record is captured from Kris's answers and is not adopted, planned or implemented by it.

## Boundary

- The standard's run-packet table, decisions-log section and run-close rule: which files are runtime and stay in the state folder, which are knowledge and move to `+/_THREADS/<thread>/` in the owning repository, when the thread commits them and when it deletes them.
- The prompt rule that cites authority by number, replaced by describing the decision in the prompt; the full summary and the mark cursor, which name a decision number today, are reworded to describe or date the decision.
- The hook and `ki-pmo` forms that read the state folder, so they read the tracked home instead.
- Not the `ki agent` launcher's own change, which `tools-ki` owns, and not the sweep of committed records that already cite by number or of existing run folders, which Knowledge Islands Principal owns.
- Not the design folder's retention, which Kris settled separately as `+/_DESIGN/<subject-slug>/`.

## Discussion

### What moves and what stays

Kris's answer splits the run packet by what it is for. The decisions log and each agent's `<name>.report.md` are knowledge: they record what the owner approved and what was done under it, and a later thread or another machine needs them. They move to `+/_THREADS/<thread>/` in the repository that owns the thread, and the thread commits them at each mark, when a report lands and before the thread closes, and deletes the folder when the thread closes with its in-force decisions consolidated into their durable owners. The prompt, launch record, status line, process identifier and log are runtime: they describe one process on one machine and stay in the state folder, which the run-close rule may then archive or delete without loss.

### Consequences for the standard's other rules

- The consolidation rule stands: a Decision Record, a skill or the checkpoint remains the durable owner of an in-force decision, and the tracked folder is the working record between consolidations, not a replacement for them.
- With the log in Git, a prompt can quote the decision it acts under in the owner's words, which is what Kris asked for, and the agent's report quotes the same words back. The thread's mark, which today reads "decisions log at Decision <N>", bounds the log by timestamp alone once numbers are no longer the handle.
- The coordinator-reminder hook detects a coordinating thread by `+/_CHECKPOINTS/`; whether `+/_THREADS/` becomes a second signal, or the hook stays as it is, is for the design.

### Open questions

- Whether `+/_THREADS/<thread>/` is ignored or tracked by default in repositories whose `+/` is otherwise untracked working material, and what `ki-repo-kb`'s zone model says about a tracked folder under `+/`.
- Whether a thread that spans repositories keeps one folder in its owning repository, with the other repositories' agents reporting into it, or one folder per repository.
- How `ki-recap` and `ki-pmo` find the folder, and whether the thread's checkpoint names it.
