---
id: KI-HARNESS-GOV-180
area: GOV
title: Tracked thread decisions home
project: ways-of-working
component: governance
purpose: governance
kind: deliver
status: ready
horizon: next
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-13T23:05:00Z
updated_at: 2026-10-14T09:38:22Z
---

# Tracked Thread Home for the Decisions Log and Agent Reports

## Goal

A coordinating thread's decisions log and its background agents' reports live in a tracked `+/_THREADS/<thread>/` folder in the owning repository, committed as the thread goes, so that losing the machine-local state folder loses no knowledge. The state folder under `~/.local/state/ki/agents/<run>/` keeps runtime material only. A prompt describes the decision it acts under rather than citing it by number.

## Context

The `ki-delegation` background-run standard puts the whole run packet, decisions log and final report included, under the XDG state root, and says of it: "The run directory, decisions log included, is non-durable, machine-local working material under the XDG state root: it is not backed up or synced, and it is not a Decision Record. At each checkpoint update, and before a run or thread closes, consolidate every in-force decision into its durable owner - a Decision Record through `ki-decision-records`, a skill, or the thread's checkpoint. Nothing durable may exist only in the run directory." Its decisions-log rule adds: "A prompt cites its authority by number ("Decision 18"), never by paraphrase alone."

Kris raised the durability problem on 2026-10-13 in the `ways-of-working` thread: decisions in the state folder's `decisions.md` "are part of the conversation and should materialise in repository records, otherwise knowledge is lost if work moves", and records that cite "Decisions 19 and 20 of the ways-of-working run" need local state to be understood. On the home for the log Kris first said: "I'm not sure why it can't be under a working area within the relevant repository. I think a key thing here should be that if the state folder is lost, you shouldn't lose any knowledge, or at least you should be able to recover from it." On citation by number: "I actually think we should not necessarily need to put the decision number anywhere. It should be written about what the decision was or is." The thread then offered three homes and Kris settled it, in words that reached the thread with stop words stripped, quoted as received: "DECISION-HOME - (b) tracked +/_THREADS/<thread>/ for the decisions log and agent reports; state folder keeps runtime only."

Kris also queued the clean-up of existing run folders behind this decision: "STATE-CLEANUP - Yes. Queue it after DECISION-HOME is settled." That sweep is Knowledge Islands Principal's record, since the folders span repositories; the `ki agent` change that writes the log and reports to the new home is the `tools-ki` agent run close record.

This record was captured from Kris's answers on 2026-10-13, adopted and planned on 2026-10-14, and approved for delivery the same day.

On 2026-10-14 Kris read a numbered citation in a thread summary and answered, as relayed by the master thread: "has no meaning to me because I don't know what the decision was ... and I don't know where the list is. I thought we'd looked at changing the way that decisions were recorded like this so that they became durable knowledge." The master thread relayed the consequence: "bring KI-HARNESS-GOV-180 forward to plan and deliver straight after the banner; banner, mark and resume line describe or date decisions, never cite numbers; tools-ki launcher change and ki-principal run-folder sweep stay with their owners as handoffs named in the plan." Kris then placed the subject: "everything to do with the decisions log belongs to ways-of-working". This record is therefore planned by the `ways-of-working` thread and delivered straight after the thread banner and re-anchoring change in the same standard.

## Boundary

- The standard's run-packet table, decisions-log section and run-close rule: which files are runtime and stay in the state folder, which are knowledge and move to `+/_THREADS/<thread>/` in the owning repository, when the thread commits them and when it deletes them.
- The prompt rule that cites authority by number, replaced by describing the decision in the prompt; the full summary and the mark cursor, which name a decision number today, are reworded to describe or date the decision.
- The hook and `ki-pmo` forms that read the state folder, so they read the tracked home instead.
- Not the `ki agent` launcher's own change, which `tools-ki` owns, and not the sweep of committed records that already cite by number or of existing run folders, which Knowledge Islands Principal owns.
- Not the design folder's retention, which Kris settled separately as `+/_DESIGN/<subject-slug>/`.

## Current state

Grounded on 2026-10-14 at harness `86744bfd`, tools-ki `7e3c05f` (installed `ki` 0.10.1) and Knowledge Islands Principal `024625d`:

- The background-run standard, `skills/governance/ki-delegation/references/standards-background-runs.md`, still places every run file in the state folder and cites by number. Its Run packet table lists six per-agent files, `<name>.report.md` included, all under `$KI_STATE_HOME/agents/<run>/`. Prompt shape item 1 reads "the task, citing the numbered owner decision that authorises it". The Decisions log section says "A prompt cites its authority by number ("Decision 18"), never by paraphrase alone", then the non-durable paragraph quoted in Context and the run-close rule. The Reporting section dates the owner report as "Decision 14 of the `ways-of-working` run"; the Full summary names "Decision 18", links each decision "to its entry in the run's decisions log" and lists "the run's decisions log from Decision 1" as a source; the Recap rule's mark form is `Mark: <UTC timestamp>, decisions log at Decision <N>` and its sources read "the run's decisions log after Decision N".
- `SKILL.md` line 74 says "A run's state directory is non-durable, machine-local runtime state, not a `ki-checkpoint` checkpoint or a Decision Record; in-force decisions are consolidated into their durable owner." `assets/run-prompt.md` line 3, the skeleton `ki agent new` fills, reads "<Owner> approved this; see Decision <N> in `<decisions log path>`." The three `rules-*.md` footers say "the decision this task cites" and name no number. `references/sources.md` cites decisions by number in five Last review paragraphs. No other file under the skill root cites a number (`git grep -nE 'Decision [0-9]+|Decision <N>|by number' -- skills/governance/ki-delegation`).
- `hooks/coordinator-reminder.sh` detects a coordinating thread by `+/_CHECKPOINTS/` alone and reads nothing from the state folder, so the hook needs no change for the tracked home. No `ki-pmo` skill exists yet; the thread forms live in this standard.
- `+/_THREADS/` is tracked by default. The managed ignore block in the harness, `tools-ki` and Knowledge Islands Principal ignores only `+/README.md`, `+/_BATCHES`, `+/_CHECKPOINTS` and `+/_TRADES`, so `git check-ignore '+/_THREADS/x/decisions.md'` matches nothing in any of the three. The `ki-repo` repository standard names an owner for each of those three subareas and none for `+/_THREADS/`.
- `ki agent` writes `decisions.md` and each `<name>.report.md` under the state folder, and `decide` numbers each entry and dates it by day. The launcher's move to the tracked home, with per-second timestamps on entries, is `tools-ki`'s agent run close record; this record's wording describes the target and says what the thread does by hand until the launcher ships.
- The thread banner and re-anchoring design in Knowledge Islands Principal (`Streams/Projects/ways-of-working/design/thread-banner-and-re-anchoring.md`) changes the same Reporting and Thread working rules sections and is delivered first. Kris brought this record forward behind it on 2026-10-14 after reading a numbered citation: "has no meaning to me because I don't know what the decision was ... and I don't know where the list is. I thought we'd looked at changing the way that decisions were recorded like this so that they became durable knowledge." The master thread's relay of that instruction: "bring KI-HARNESS-GOV-180 forward to plan and deliver straight after the banner; banner, mark and resume line describe or date decisions, never cite numbers".

## Steps

- [ ] Run packet: split the table into runtime files, which stay in the state folder (`<name>.prompt.md`, `<name>.launch.json`, `<name>.status`, `<name>.pid`, `<name>.log`, `queue.jsonl`, `seen`, `dispatch.*`, `worktrees/`), and knowledge files, which live in the owning repository's `+/_THREADS/<run>/` (`decisions.md`, `<name>.report.md`); state that the owning repository is the one holding the thread's checkpoint, that the folder takes the run's name, that `ki agent` writes the knowledge files there once `tools-ki` ships the change, and that until then the thread copies the log and each report into the folder at each mark and when a report lands.
- [ ] Decisions log: replace "A prompt cites its authority by number ("Decision 18"), never by paraphrase alone." with the rule that a prompt, brief, record, report, checkpoint or banner describes the decision in the owner's words and its date and never by number, while the log itself stays numbered and timestamped for the launcher's own handles; keep the two faithfulness rules; rewrite the non-durable paragraph so the tracked folder is the working record between consolidations, committed by the thread at each mark, when a report lands and before the thread closes, deleted at thread close once every in-force decision is consolidated, with the state folder holding runtime only and archived or deleted by `ki agent close` or by hand; keep the consolidation rule.
- [ ] Prompt shape item 1: "the task, quoting the owner decision that authorises it, in the owner's words and dated".
- [ ] Reporting and Full summary: replace "Decision 14 of the `ways-of-working` run" and "adopted as Decision 18 of the `ways-of-working` run" with the date and the words already quoted beside them; make `## Decided` link each decision to its entry in the tracked log or to the record that now holds it; make Sources read "the thread's decisions log from the thread's start".
- [ ] Thread working rules: the mark form becomes `Mark: <UTC timestamp>` and the timestamp bounds the log by entry timestamp; Sources read "the thread's decisions log entries after the mark"; add one sentence that the banner, the mark and the resume line describe or date decisions and never cite a number, in Kris's words above; in Opening a thread, the opener records `Thread folder: +/_THREADS/<run>/` in the checkpoint's `Current state` so `ki-recap` and, later, `ki-pmo` find it.
- [ ] `SKILL.md` line 74 and `assets/run-prompt.md` line 3: reword to the tracked home and the words-and-date rule; leave the `rules-*.md` footers, which already cite "the decision this task cites".
- [ ] `references/sources.md`: reword the five Last review paragraphs to describe each decision by date and words, and add a Last review entry for this change.
- [ ] `ki-repo` repository standard (`skills/keystone/ki-repo/references/standards-repository.md`): add one owner line beside the `+/_BATCHES`, `+/_CHECKPOINTS` and `+/_TRADES` lines, "`ki-delegation` owns `+/_THREADS/<run>/` thread folders".
- [ ] Assert `git grep -nE 'Decision [0-9]+|Decision <N>|by number' -- skills/governance/ki-delegation hooks` prints nothing, then run the gates in Verify and commit as `docs(ki-delegation): move the decisions log and reports to the tracked thread folder`.

## Files touched

- `skills/governance/ki-delegation/references/standards-background-runs.md`
- `skills/governance/ki-delegation/SKILL.md`
- `skills/governance/ki-delegation/assets/run-prompt.md`
- `skills/governance/ki-delegation/references/sources.md`
- `skills/keystone/ki-repo/references/standards-repository.md`

## Verify

- `git grep -nE 'Decision [0-9]+|Decision <N>|by number' -- skills/governance/ki-delegation hooks` prints nothing.
- `bun run test` passes.
- `bunx tsc --noEmit` passes.
- `ki repo audit --skill ki-delegation`, `ki repo audit --skill ki-repo` and `ki repo audit --skill ki-skills` report no failure; the pre-commit staged `ki-skills` audit of the touched skill roots passes without `--no-verify`.
- `git check-ignore -q '+/_THREADS/x/decisions.md'` exits non-zero in the harness, `tools-ki` and Knowledge Islands Principal, so the folder is tracked without an ignore change.

## Dependencies / blocks

- `blocked_by` is empty: nothing this record builds on is missing. Sequencing preference, not build order: deliver after the thread banner and re-anchoring change lands in the same standard, so the two edits do not collide in Reporting and Thread working rules.
- `tools-ki` must make `ki agent` write `decisions.md` and each `<name>.report.md` to the owning repository's `+/_THREADS/<run>/`, timestamp each decision to the second, and add the close command with its reconcile gate. The standard describes that behaviour as the target and says what a thread does by hand until the installed `ki` ships it; neither order blocks the other. Durable documentation: the `tools-ki` [background-agents guide](https://github.com/knowledgeislands/tools-ki/blob/main/docs/guides/user/background-agents.md).
- Knowledge Islands Principal owns the sweep of committed files outside this skill root that still cite a decision by number, and the reconcile-then-archive pass over closed run folders; this record changes nothing outside the harness.
- Later, when the pilot creates `ki-pmo`, the thread forms move with their new wording; this record does not wait for the pilot.

## Delegation

The `ways-of-working` Project thread coordinates; one detached background agent delivers under `ki-delegation`, in a worktree under its run folder, after the banner agent's commit has landed on harness `main`. Deliverable: the Steps above as one Conventional Commit, pushed fast-forward under the thread's standing push permission once the gates pass, with the Verify outcomes in its report. Gate between rounds: none; one round. The thread reviews the report against this plan and the quoted words, pulls the primary checkout forward, and Kris accepts through `ki-accept`.

## Documentation impact

### Decision Records

None new. The rule's rationale is Kris's own words, quoted and dated in the standard, which is the durable owner of the background-run contract; the pilot's Decision Record refinements for the thread model carry the thread-level consequence when `ki-pmo` is created.

### Specifications

None. The harness publishes no behaviour specification for the run packet; the standard is the contract.

### Guides

The background-run standard is the human and agent guidance for runs and threads, and it changes as the Steps say. The `tools-ki` background-agents guide changes under that repository's own record.

### Roadmap

No follow-on record in this repository. The `tools-ki` launcher change and Knowledge Islands Principal's sweep are already captured there and are named above as handoffs.

## Discussion

### What moves and what stays

Kris's answer splits the run packet by what it is for. The decisions log and each agent's `<name>.report.md` are knowledge: they record what the owner approved and what was done under it, and a later thread or another machine needs them. They move to `+/_THREADS/<thread>/` in the repository that owns the thread, and the thread commits them at each mark, when a report lands and before the thread closes, and deletes the folder when the thread closes with its in-force decisions consolidated into their durable owners. The prompt, launch record, status line, process identifier and log are runtime: they describe one process on one machine and stay in the state folder, which the run-close rule may then archive or delete without loss.

### Consequences for the standard's other rules

- The consolidation rule stands: a Decision Record, a skill or the checkpoint remains the durable owner of an in-force decision, and the tracked folder is the working record between consolidations, not a replacement for them.
- With the log in Git, a prompt can quote the decision it acts under in the owner's words, which is what Kris asked for, and the agent's report quotes the same words back. The thread's mark, which today reads "decisions log at Decision <N>", bounds the log by timestamp alone once numbers are no longer the handle.
- The coordinator-reminder hook detects a coordinating thread by `+/_CHECKPOINTS/`; whether `+/_THREADS/` becomes a second signal, or the hook stays as it is, is for the design.

### Open questions

Settled at planning on 2026-10-14:

- `+/_THREADS/<run>/` is tracked by default: the managed ignore block names only `+/README.md`, `+/_BATCHES`, `+/_CHECKPOINTS` and `+/_TRADES`, and `git check-ignore` matches nothing under `+/_THREADS/` in the harness, `tools-ki` or Knowledge Islands Principal. No ignore change is needed, and the `ki-repo` repository standard gains one owner line for the folder.
- One folder per thread, in the repository that holds the thread's checkpoint; agents working in other repositories report into it, as they report into one state folder today. A thread that spans repositories therefore commits its log in one place.
- The thread's checkpoint names the folder in `Current state` as `Thread folder: +/_THREADS/<run>/`; `ki-recap` reads the checkpoint already, and `ki-pmo` inherits the line when the pilot creates it.
- The coordinator-reminder hook keeps `+/_CHECKPOINTS/` as its only signal; `+/_THREADS/` adds nothing it needs.

Settled at approval on 2026-10-14, as the `ways-of-working` thread relayed Kris's settlement: "thread decisions logs and agent reports live tracked in the island under +/_THREADS/<thread>/; the state folder keeps runtime only; until the launcher writes there, the thread copies by hand". The thread therefore commits its own `+/_THREADS/<run>/` changes by hand until `ki agent` writes there, so no knowledge waits on `tools-ki`. Kris's addendum of the same day fixes the wording rule for committed text: a decision is described in words, never cited by number, because a number "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".

### Follow-on design

Kris has separately raised a wider question: thread types, how a decision becomes durable knowledge, and where a Project's design folders live. Another agent is designing that now. This record keeps to its planned scope, the tracked home for the log and reports and the words-and-date rule; the promotion of decisions into durable knowledge is that follow-on design and is not changed here.

### Adoption

On 14 October 2026 Kris approved the state-of-play thread's triage burn-down as written, under Kris's instruction to burn the roadmap down: adopted as `deliver / Next`. Kris asked for it in answering DECISION-HOME, and it fixes a durability defect, since losing the state folder loses the decisions log. It comes before the `tools-ki` launcher change and Knowledge Islands Principal's sweep. Adoption grants no planning, implementation or acceptance authority.

### Approval

On 2026-10-14 Kris approved the plan as it stands, in these words: "approve KI-HARNESS-GOV-180". The `ways-of-working` thread delivers it under `ki-implement` through one detached background agent, as Delegation says.
