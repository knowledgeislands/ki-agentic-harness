# Background-run standard

## Contents

- [Scope](#scope)
- [Detachment](#detachment)
- [Coordinating work](#coordinating-work)
- [Run packet](#run-packet)
  - [Working-area marks](#working-area-marks)
- [Prompt shape](#prompt-shape)
- [Authority tiers](#authority-tiers)
  - [Landing, then review](#landing-then-review)
  - [Grants](#grants)
  - [Provider tokens](#provider-tokens)
  - [Retiring shared things](#retiring-shared-things)
  - [Unattended deny list](#unattended-deny-list)
  - [Criticality test](#criticality-test)
  - [External systems](#external-systems)
  - [Questions in a window](#questions-in-a-window)
  - [Dotfiles and software](#dotfiles-and-software)
- [Decisions log](#decisions-log)
- [Coordination](#coordination)
  - [Conflict runs](#conflict-runs)
  - [Permission prompts](#permission-prompts)
  - [Connection-critical changes](#connection-critical-changes)
- [Concurrency](#concurrency)
- [Monitoring](#monitoring)
- [Reporting](#reporting)
  - [Owner report](#owner-report)
  - [Needs tags](#needs-tags)
- [Agent hosts](#agent-hosts)
- [Mechanical boundary](#mechanical-boundary)

## Scope

A background run is routine delegation of substantive work to one or more background agents. Anyone running Knowledge Islands work through an agent uses this contract, whatever the runtime.

A **background agent** is a subagent of the session's own agent host, the app the session runs in, such as Claude Code, Claude Desktop, Orca or ChatGPT Desktop, that the session starts to carry a unit of work under this contract. It works only within the repositories its package names in `repositories:`, and it is never another session: a session works alone and never asks another session to act, under the `ki-coordination` rule [Sessions work alone](../../../change-management/ki-coordination/references/standards-messages.md#sessions-work-alone). An **in-session subagent** runs inside the starting session's turn and is not a background agent.

It complements the [delegation-packet standard](standards-delegation-packets.md): a packet makes an approved high-risk handoff durable inside a work record, while a background run governs how any delegated agent is launched, reports, coordinates and is watched. A high-risk run carries both.

Process skills still select, authorise, plan and accept work. Subagent role definitions follow `ki-subagents`.

## Detachment

Start every background agent in the agent host's background or detached mode where it has one, so that the agent survives an interrupt of the session that started it.

An in-session subagent runs under the turn that started it and dies when that turn is interrupted, even when it still looks live. Use it only for work that may be lost.

## Coordinating work

Coordinating work - territory work or Project work, the two coordinating forms of the work model that the [Work Process](https://github.com/knowledgeislands/ki-principal/blob/main/Pillars/Philosophy/Model/Processes/Work%20Process/Work%20Process.md) note describes and `ki-coordination` governs - launches and steers background runs under this contract and is itself governed by [the coordinating-work standard](../../../change-management/ki-coordination/references/standards-coordination.md) that `ki-coordination` owns: the responsive-coordinator principle in Kris's words, the counted turn budget and self-check, the levels and forms, the states and moves, the Summary, recap and full summary, the glyph banner, re-anchoring after compaction, the openers and bootstrap, messages between work, the decision classes and their life cycle, Finishing Project work, the recap since the mark, parking tangents, linking records, committing and pruning the work folder, keeping primary checkouts current and refreshing that guidance. A repository that coordinates work declares `ki-coordination` beside this skill; the `coordinator-reminder` hook and the `ki-coordinator` output style belong to it.

What stays here is the run side of that relationship. Coordinating work records each owner decision in its work folder's [decisions log](#decisions-log) before starting the work it authorises, waits only on its agent host's notice that an agent has finished, under [Concurrency](#concurrency) and [Monitoring](#monitoring), and reports in the `ki-coordination` [owner report](../../../change-management/ki-coordination/references/standards-reporting.md#owner-report) form, which every agent report, Summary, recap and full summary takes unchanged.

At restart, each piece of coordinating work acts on the important `FIRST-STEP` line of its [message queue](../../../change-management/ki-coordination/references/standards-messages.md#messages-between-work), `messages.md`, or in a single-file work folder its work file's Messages section, before launching any run. Kris set on 2026-10-17 that "each thread fixes its checkpoint form and adds role on its FIRST-STEP line at restart"; under the work model the work file's front matter carries the level, worker and supervisor that the checkpoint's `role` carried.

## Run packet

A run is the set of background agents one session starts for one piece of work, named in its brief. The split follows what each file is for. Whatever the agent host keeps of a run, its transcript, logs and progress, is runtime: it describes one process on one machine and can be lost without losing knowledge. A knowledge file records what the owner approved and what was done under it, and later work or another machine needs it. Kris settled the split on 2026-10-14, in these words: "tracked +/_THREADS/<thread>/ for the decisions log and agent reports; state folder keeps runtime only." Under the work model the tracked folder is the work folder, `+/_WORK/<id>/`, of the reporting work named in the brief, which may differ from the starting State of play.

An agent writes its report to the path its brief names outside every work folder, or returns it as its final message where the brief names none. The session that started the agent copies the report into the owning work folder's `reports/`, as `+/_WORK/<id>/reports/<name>.report.md`, when it receives it. Kris took this step for Orca workers under REPORT-HOME a) on 7 November 2026; with the `ki agent` launcher removed in `tools-ki` v0.15.0 no launcher homes a report, so the receiving session homes every report. The session copies only the report its brief named for that agent and reporting package, never a path just because a message names it, keeps its content unchanged, treats a repeat copy of the same content as no change, and stops and reports if a different file already sits at the destination; the [Orca delegation standard](../../../agentic-systems/ki-delegation-orca/references/standards-orca-delegation.md#ids-briefs-and-reports) holds the step for Orca workers. The brief sits in the same folder as `briefs/<name>.md` while the run's handoff is open. The folder's closed list, what each entry point may write there and when each kind goes are the `ki-work-package` [work-package standard](../../ki-work-package/references/standard-work-package.md#43-the-shape)'s. When the session receives a report it copies each of the report's queries, whole, into the package's `discussions.md`, under QUERIES-FILE, so that the report can go once its outcome is homed.

The owning repository is the one that holds the work file, and the work folder takes the work's two-part id, which the `ki-coordination` [Work naming](../../../change-management/ki-coordination/references/standards-opening.md#work-naming) section sets, so work whose runs span repositories commits its log in one place and agents working in other repositories report into it. The receiving session is the only writer of report files there, as Kris decided on 2026-10-14 for the thread folder, then of its launcher: "make the launcher the only writer of the thread folder's log and report files". The session also writes the decisions log and the brief, and commits the folder.

Everything else a run produces has a home outside the work folder, and a run writes nothing into `+/_WORK/<id>/`; the folder's [closed list](../../ki-work-package/references/standard-work-package.md#43-the-shape) is the `ki-work-package` standard's, and its rubric fails a file outside it. A work product, such as a record, a standard, a diagram or a patch, lives in its owning home in the repository that owns it and is committed there. Temporary output, screenshots and other scratch included, goes in the run's temporary directory, `$TMPDIR/ki-agents/<run>/<name>/`, outside every repository, which the brief names; it never goes in a work folder or a working tree. A run never removes its temporary directory; the session that started it removes it once the report is homed, by a literal absolute path under [Permission prompts](#permission-prompts). Kris settled that the run leaves it on 25 October 2026 under PERM-PROMPTS-SCRATCH, "Close cleans up", after a scan traced 110 of 203 background-run `rm` denials to runs clearing that directory. Evidence a run must keep, such as a screenshot that proves an outcome, is copied deliberately to its owning home before the run ends and named in the report.

This replaces the temporary home Kris set on 2026-10-15, now superseded: "Temporary output goes in <primary checkout>/tmp/<run>/<name>/ in the repository the agent works in, ignored and deleted when the run closes or they are superflous to requirements; machine-only scratch may stay in the state folder as <name>.work/." In the 5G Emerge Phase 3 coordination work on 2026-10-16 Kris said: "basically you should be using the temp folder for things like screenshots, not the threads folders", and decided: "Create a Harness work record to add the rule to the ki-delegation background-run standard: screenshots and other scratch output go in the system temp folder, never in a thread folder or repository." On 2026-10-20 Kris adopted that rule under HARNESS-TRIAGE as the per-run directory.

An agent is finished when its agent host reports that it has ended with its report written or returned. An agent that ends without a report has failed and is never counted as finished. A milestone, a block or a failure the session should hear about before the end goes in the agent's progress in the forms `milestone: <text>`, `blocked: <text>` and `failed: <text>`, where its agent host shows progress, and otherwise in its report.

An agent's name is unique within its run. Anything a session relays from a run carries summaries, identifiers and paths, never file contents, secrets or the owner's addresses.

### Working-area marks

Every file an agent or a session writes into a repository's `+/` working area carries a mark that says who wrote it and when, so a later reader, agent or owner, can tell whether it is current, whose it is, and which run to ask before moving or deleting it. Kris confirmed the rule on 14 October 2026, "MARK-RULE - yes, that reading; capture as a harness deliver record at next", and settled the field names for now on 18 October, "Mark feels, let's go with it for now". This is the one place the names are stated, so a later change touches one rule. The fields, in this order:

- `work`: the work id of the work the file belongs to, under `ki-coordination`'s work naming.
- `run` and `agent`: the run and the agent within it, for a file a background run writes; or `session`, the native session, or `interactive` where none is named, for a file an interactive session writes.
- `written_at`: the time it was written, as an ISO 8601 UTC timestamp.

A Markdown file carries the mark in its front matter. A folder of non-Markdown output, such as a rebuilt diagram, carries one `mark.toml` sidecar at its root holding the same fields as TOML strings. Coordinating work and an interactive session mark their own working files the same way. A mark is not provenance for committed work, which Git carries, and says nothing about how long a file is kept; it goes only into the working area, never into a committed receipt or report.

## Prompt shape

A run prompt is cold-agent ready. It contains, in order:

1. the task, quoting the owner decision that authorises it, in the owner's words and dated;
2. numbered steps;
3. a verification step;
4. a landing step: how the work lands under its footer, and who writes the batch's record, under [Landing, then review](#landing-then-review);
5. the report path outside every work folder, or that the report is the agent's final message; the session that started the run homes it in the work folder's `reports/` under the [run packet](#run-packet);
6. the instructions "Do not use background subagents." and "Never end your session while waiting.", and the skeleton's **Independence** line, kept in every run prompt because it binds only a review run;
7. one authority footer, appended last, followed only by any [grant](#grants) sections the task needs.

Before starting the agent, verify the complete current brief contains the concrete authorised task and no unresolved template, and start it only once that check has passed. This is a preparation check, not a claim of perfect semantic validation.

When writing the steps and rules:

- Before forbidding a pattern, check whether the target repository already uses it as an established idiom. If it does, sanction it on the repository's own terms or raise the change as a separate decision.
- Tell the agent to run its tools quietly under the `ki-coordination` [quiet-tools rule](../../../change-management/ki-coordination/references/standards-reporting.md#quiet-tools): Git with `-q`, no gate, audit or Git output pasted into its status, updates or report, and each outcome reported in one line. Kris set it on 2026-10-17, as received: "Yes: a harness agent adds a quiet-tools rule to the ki-coordination standard and its run-report and brief sources (run git with -q, never paste gate, audit or git output, report each outcome in one line), cuts the coordinator hook line to a pointer plus the five hard rules, regenerates with ki dev skill generate ki-coordination --write and commits, before the RESTART-AGREE run."
- Tell the agent to keep tool output short, bounding searches and listings rather than printing them whole, and to write its report file early and update it as it goes, so that a run which ends without finishing still leaves a report. Two survey runs ended without a report or a recorded cause, one after very large search output, as LESSONS-TERRA recorded on 31 October 2026 under Kris's LEARN-LOOP: "how are we learning from what we're doing?".
- For a read-only audit, name the read-only checks, such as `prettier --check` or `rumdl check`, and forbid `lint:md` and any formatter run with `--write` or `--fix`.
- When hook or script work runs automatically on every matching event, propose an adversarial review by independent security and correctness reviewers, each finding reproduced by a separate agent, where multi-agent orchestration is authorised.
- Carry each target repository's standing rules into the brief by default, and check directly every path, ownership claim and instruction premise the brief rests on; an ambiguous direction is read back in one line before the brief goes out. Kris agreed CLAIM-CHECK as recommended on 2026-10-20, "CLAIM-CHECK - agreed as recommended", which `ki-coordination` [Coordinating practices](../../../change-management/ki-coordination/references/standards-coordination.md#coordinating-practices) applies to the coordinator.
- A fix or revise brief sweeps for the whole class of each finding, not only the instance a reviewer named, and a review loop stops when no must-fix finding remains; should-fix findings go to the owner's read rather than another round. Kris agreed CLASS-FIX as recommended on 2026-10-20, "CLASS-FIX - agreed as recommended".
- A blind review brief is masked under the `ki-coordination` [query review](../../../change-management/ki-coordination/references/standards-queries.md#query-review): it carries the query's Context and Query only, with the options in no ranked order and no recommendation or confidence, and tells the reviewer not to read the work's `discussions.md` or `decisions.md` or any report. Kris agreed BLIND-REVIEW as recommended on 2026-10-20, "BLIND-REVIEW - agreed as recommended". Every review brief keeps the run-prompt skeleton's **Independence** line word for word and states earlier decisions as dated facts, never as premises, as Kris took REVIEW-CHALLENGE a) under ACCEPT-BY-CRITERIA on 31 October 2026.
- For output a person will look at, such as a drawing, a page or an app screen, the verification step looks at the rendered result, a screenshot or the opened file, before the run reports. The report names each doubt the run could not settle as an open question rather than settling it with a silent guess, under [Ambiguity](#coordination). The design runtime reported both as part of what made the night's design work reliable, in CD-63 to `ki.prj.agora` on 7 November 2026, which Kris asked to be made durable.
- Tell the agent it creates no roadmap record. Kris took CAPTURE-GATE a) on 19 October: "runs never create records; the owning work's coordinator captures only a blocker, a defect seen failing or a Kris request; ideas go to Project notes; small audit fixes need no record". A run that finds a candidate names it in its report, and the owning coordinator decides under the `ki-next` [capture rule](../../../change-management/ki-next/references/standards-next-work.md#capture-substantive-prospective-work). A handoff or rollout a run's work needs elsewhere goes as a line in the receiving work's `messages.md` where the brief authorises it, otherwise into the report for the coordinator to send, never as a record in the receiving repository, as Kris set under HANDOFF-AS-MESSAGE on 2026-10-20: "Handoffs are not roadmap items".

A long wait belongs in the foreground: the agent checks the condition every two minutes and updates its status meanwhile.

## Authority tiers

Each prompt ends with exactly one footer from this skill's `assets/`, followed only by any [grants](#grants) the task needs. Footers are cumulative and generalised; the task supplies the specifics.

| Tier | Footer | Adds |
| --- | --- | --- |
| none | [rules-none.md](../assets/rules-none.md) | Local commits only; no remote call of any kind. For a run that lands nothing itself |
| push | [rules-push.md](../assets/rules-push.md) | `git fetch`, fast-forward pull and fast-forward `git push` of everything stacked on `main` under the standing push rule. The default for a run whose work lands, under [Landing, then review](#landing-then-review) |
| prune | [rules-prune.md](../assets/rules-prune.md) | Deleting `done` or `cancelled` work records the cited decision approves |
| release | [rules-release.md](../assets/rules-release.md) | Only the release calls the task names, one by one |

No grant is implied. Every remote call an agent may make is named explicitly, either in its footer or in the task. The push tier rests on the remit Kris gave on the change documents the task cites, for high-confidence or reversible work (WORK-MODES), under [Landing, then review](#landing-then-review); prune and release each need a cited owner decision. A brief that needs to push uses the push footer, whose tier grants it; a task never widens a no-push footer, as Kris chose PUSH-EXCEPTION a) on 7 November 2026: "Remove the exception, so a brief that needs to push must use the push footer." It retires the exception Kris set on 2026-10-17, "the generic brief footer gives way to an explicit push rule in the brief", now that a push footer exists. No footer supplies human approval or authorises self-approval, discretionary acceptance, force-pushing, `--no-verify`, handling secrets, or publication outside the cited task and standing push rule. Never approve your own delivery or accept work at your discretion. Record delivery closure through `ki-accept` only as an independent actor executing exact explicit human-approved closure of the reviewed record, or a recorded unattended-window grant in the coordinating work's decisions log that names closure for the record's frozen wave; recheck all review and evidence requirements. This footer supplies no human approval. Cancellation needs separate exact human approval of its resolution. Delivery closure never deletes a record. Separate explicit prune selection, eligible committed terminal state, reference/evidence checks and tier rules still apply under `ki-accept`; no acceptance condition raises the footer's tier.

A site, repository or note marked confidential is never made public without Kris's go in the thread. This holds at any time, attended or in a window, at every tier and under every grant: no footer, grant, task or standing rule lifts it, because a visibility change cannot be undone once the content has been crawled. Every authority footer carries the rule in one line. Kris set it on 25 October 2026, answering UNWRITTEN-RULES-CONFIDENTIAL.

Nothing is posted in Kris's name outside his own repositories and services without his express permission for that specific post: no issue, comment, reaction, pull request, discussion, review or message on another owner's repository or service, such as an upstream issue tracker. This holds attended or in a window, at every tier and under every grant: no footer, grant, task, standing rule or broader permission lifts it, and Kris's answer naming the exact post is the only permission. A run that judges a post worth making stops short of it and reports a query carrying the exact text it proposes, under the `ki-coordination` [posting rule](../../../change-management/ki-coordination/references/standards-reporting.md#owner-report). Every authority footer carries the rule in one line. Kris set it at about 19:40 GMT on 5 November 2026, after a run had posted to Orca issue 33114: "Any posting to external repositories in my name, such as the one that's done to Orca issue 33114, is not allowed without my express permission."

A brief cannot grant an external post. Its only permission is Kris's answer to a query showing the exact text, recorded in the work's [decisions log](#decisions-log) before the run launches; the task then cites that entry and carries the approved text word for word, and that one post, made exactly as approved, is the only remote call the footer's posting line allows beyond the tier. A brief that asks for a post without citing such an entry, or for any post other than the one approved, grants nothing, and the run stops short of posting and reports a query carrying the text. The Orca comment came from a brief whose body told the run to "add one comment ... otherwise open one issue" while its footer banned every other remote call, and the body prevailed unnoticed, as `personal.reg.household-sol` traced on 5 November 2026.

Where a brief's body and its authority footer conflict, the footer wins. The task supplies specifics within the footer's tier and grants, never authority beyond them, with no exception. Every authority footer carries both rules in its posting line.

In Kris's managed environment, when a task separately authorises a 1Password read, read only through the managed cached reader, `~/bin/chezmoi/op-cache "op://<vault>/<item>/<field>"`, with `OP_CACHE_SERVICE_ACCOUNT_ONLY=1`, and use `~/bin/chezmoi/op-cache --tag <tag> [--vault <vault>]` for discovery. Never call `op` directly or repeatedly: the reader caches each item for a day, so a run costs at most one read per item per day. Leave `chezmoi-op`, which manages the cache, to Kris. Kris set this on 30 October 2026 under OP-CACHE: "agents should be using cached_op". If the helper cannot read without a desktop prompt, stop and report; do not fall back to interactive access. Keep credential values out of output and tracked files. This condition grants no credential authority. When a task separately authorises a Cloudflare credential read, use only `~/bin/cf-token`. No territory's notes record credential item or token ids. Keep credential values out of output and tracked files; this rule grants no Cloudflare operation or credential authority. Kris adopted this Cloudflare half of RUN-SECRETS on 25 October 2026.

### Landing, then review

On 12 November 2026 Kris turned review round, so that he is never the blocker: work starts from change documents worked through with him, and within the remit he then gives, it lands without waiting for him, and he reviews it afterwards from a record of what each batch of work achieved. The decisions are recorded in the Cairn summit's [change 07](https://github.com/krisb/ki-cairn-store/blob/main/work/cairn/cairn.summit/07-record.change.md), relayed by the summit's guardian.

- **Change documents first:** all work, attended or unattended, is covered by a change document Kris and the session have worked through together, deciding each point there; Kris then gives a remit to act on what it settles. Small, obvious work that needs no change of its own, such as levelling a checkout or fixing a broken link, is just got on with and reported in the next record.
- **Land, then review:** within that remit, work that is high-confidence, or reversible through more work, lands on `main` without waiting for Kris. A run commits by explicit path and pushes under the push footer and the [Pushing](#coordination) rule, and Kris reviews the work afterwards.
- **Pull requests only when something major is at stake:** an experiment or a risky change goes on a branch with a pull request instead of landing on `main`, where the task names the branch and the pull request; otherwise the run commits locally and reports. Routine work opens no pull request.
- **Destructive work waits:** anything more work cannot undo needs real care and Kris's word first, cited by the task. Force-pushing, `--no-verify` and rewriting history stay banned at every tier.
- **The record:** the session that did the work writes its record as it lands, one for each unattended run or batch that lands real work and none for a session spent deciding, in the Cairn store's `record/`. While the record is a pilot its shape is the one the Cairn store's [change 07](https://github.com/krisb/ki-cairn-store/blob/main/work/cairn/cairn.summit/07-record.change.md#42-the-record) sets, and this standard does not restate it. A record holds nothing for Kris to do, and its links go only to what has landed. A run writes the batch's record where its brief names one; otherwise the session that started it writes it when it homes the report.
- **Review:** Kris reviews a whole record, marking its `review:` field `approved` or naming what to undo, which is then done as more work. An approved record stays a week, then the Cairn summit's guardian removes it at the next review; any other removal is Kris's choice.

Landing is not acceptance: a roadmap record still closes only under `ki-accept`, and no footer supplies that approval.

Sources: WORK-MODES, LAND-THEN-REVIEW, NO-PR-UNLESS-MAJOR, RECORD-WHO, RECORD-GRAIN, RECORD-REVIEW, RECORD-KEEP and RECORD-HARNESS in [the source register](sources.md).

### Grants

A grant is a section appended after the tier footer that lifts exactly one of the footer's bans and nothing else, for authority that is not a step on the cumulative tier ladder. A grant suits any tier. The task names the scope the grant needs: the remotes for a fetch, and each machine change for a machine grant.

| Grant | Section | Lifts |
| --- | --- | --- |
| fetch | [grant-fetch.md](../assets/grant-fetch.md) | Only the ban on a Git fetch: `git fetch` and a rebase or fast-forward pull from the remotes the task names; adds nothing under `push` or above |
| machine | [grant-machine.md](../assets/grant-machine.md) | Only the ban on an environment or scheduler change: the local changes the task names, on this machine, each with its undo; an upgrade of installed software but never a new install, and a dotfile edit only after Kris's direct approval of its diff or, absent that, its judgement check, under [Dotfiles and software](#dotfiles-and-software); credentials stay banned beyond a [provider-token](#provider-tokens) permission Kris has approved, and the [connection-critical rule](#connection-critical-changes) still applies |

A brief appends a grant section from its `## Grant: <name>` heading, after the tier footer. Kris approved both texts as drafted on 2026-10-18, taking the recommended option: "you've got my approval for all those things that were recommended".

### Provider tokens

Provider tokens, Cloudflare first, set up per profile and per account, stay least-privilege. Kris set this on 1 November 2026 under CF-TOKEN-APPROVAL: "leave them in a situation where they're not open to too much abuse. It's better to actually actively think about needing a permission and then considering it and then using the token to do it. But rather than asking me to do it, what you could do is you could seek advice from me, or you could seek approval from me, and then I'll approve it for you. And then you can go ahead and do it. And I think that just puts a bit of a check and balance in place".

- **Missing permission:** a run that needs a permission its token lacks stops and reports. Its coordinator raises one query naming the exact permission, the token and the account, never a manual task for Kris.
- **Approved permission:** once Kris approves that permission, a run whose task cites the approval grants it through the token, saving the token's policy before the change and verifying the policy after it, then does the work. The task names the provider calls, since no grant is implied.
- **No manual change:** never ask Kris to make the change by hand when a token can.

The rule grants nothing by itself. Each approved permission is the named exception to the footers' ban on a credential change, scoped to that permission, token and account, and each further permission needs Kris's approval again. Credential values stay out of output and tracked files under the cached-reader rule above. In an unattended window the [criticality test](#criticality-test) still keeps credentials out, so the query is parked for the return report.

### Retiring shared things

Before deleting or retiring anything shared, such as a token, a secret, a DNS record or a shared configuration value, list every consumer in every place that can name it, every repository, account, Worker, build and machine, not only the one being changed, and retire it only once no remaining consumer needs it or each has moved. The rule holds in every session, attended or in a window, and grants nothing: the deletion still needs its own authority. On 3 November 2026 a check of only the markhowarth.com Worker deleted a build token that Valle Armonia's ingress receiver still named, so its next build would have failed. Kris lifted the lesson into the method on 3 November 2026 under LEARN-LOOP, choosing CHECK-CONSUMERS LIFT a).

### Unattended deny list

An unattended window stays within its explicit grant and the coordinator's [window plan](../../../change-management/ki-coordination/references/standards-unattended.md#unattended-windows). Kris adopted DENY-LIST on 25 October 2026, with the review's safeguards, and later that day replaced its blanket exclusion of DNS, Cloudflare, GitHub settings, machine, scheduler, credential and connection-critical changes, and its exclusion of releases, with the [criticality test](#criticality-test). By default it performs none of these:

- force-pushes or use of `--no-verify`;
- acceptance, cancellation or pruning beyond the owner's answers at entry;
- any change the criticality test excludes: one that could cut Kris off or take a site down;
- messages to the people around us, new publication, or a change in an external system other people see or rely on, such as Linear, Notion or Slack, unless expressly agreed as part of the piece of work, under [External systems](#external-systems); GitHub and the systems the window's work is expressly about stay allowed;
- any issue, comment, reaction, pull request, discussion, review or message on another owner's repository or service in Kris's name without his express permission for that specific post, under the [external-posting rule](#authority-tiers); no grant lifts it;
- action on a question Kris has not answered: a question put to Kris during a window waits a couple of minutes at most and, unanswered, is parked as a query for the return report with nothing done on it, under [Questions in a window](#questions-in-a-window); silence is never consent;
- standard or configuration changes beyond the owner's answers at entry, a dotfiles rollout under [Dotfiles and software](#dotfiles-and-software) aside.

A grant lifts a permissible item only by naming it and its scope, within the authority tiers and any narrower repository gate. Force-push, `--no-verify` and posting in Kris's name outside his own repositories and services remain prohibited, and a change the criticality test excludes is never lifted. No inferred or proposed rule joins this list without the owner's confirmation. Eligibility is not authority: any unit that still needs a decision is parked. The coordinator may plan already adopted, authorised Now or Next drafts to Ready and deliver eligible Ready work to awaiting review in frozen one-repository waves citing the grant, the grant being their one authority record, honouring dependencies and the owner-queue cap; adoption, discretionary promotion, acceptance and pruning stay with the owner.

A run serving another package names its reporting package separately from its product repository in the brief. The session that started the run homes the report into that reporting package under the [run packet](#run-packet), and its explicitly assigned steward receives the queries, decisions and in-flight supervision under `ki-work-package`. The starting State of play is not a substitute report home.

### Criticality test

Kris reframed the window exclusions by criticality on 25 October 2026, answering UNWRITTEN-RULES-CLOUDFLARE "Window-only": "the point here is to exclude certain things in unattended mode ... DNS, Cloudflare, configuration ... I'm happy ... to make any alignments to GitHub ... from a Cloudflare perspective, I'm happy for you to do anything to get the builds passing ... I'm happy for you to do releases ... So it's more like any critical things that might break, that I can't then reconnect or deal with sites that go down." The test is whether a change could cut Kris off or take a site down.

- **Never in a window:** any change that could cut Kris off or take a site down. That means DNS, Cloudflare Access, routes and Zero Trust, credentials, and connection-critical machine configuration. No grant lifts it. Attended, such a change still carries the tested restore path the [connection-critical rule](#connection-critical-changes) requires.
- **Allowed in a window:** aligning GitHub settings with the declared standard; changing Cloudflare build settings to get builds passing; cutting a release under the repository's release process. Each stays within the authority tiers: a release run still carries the `release` footer with its calls named in the task, a GitHub settings change follows `ki-repo`, and a Cloudflare credential read follows the [credential condition](#authority-tiers) above.

Nothing else becomes a standing rule outside a window. The test governs unattended work; attended work keeps its existing gates.

### External systems

Kris set the window's limit on other systems on 25 October 2026, answering UNWRITTEN-RULES-DRAFTS: "[it's] saying [we] shouldn't [have] effects on other systems [or] messaging around us ... like GitHub, [for] example, [are expressly included] but [we] shouldn't [be] making changes [in] Linear [or] Notion unattended unless expressly agree[d as] part [of the] piece [of] work." The rule is the deny list's people-and-publication line read in full:

- **Never in a window unless agreed:** an unattended window makes no change in a system other people see or rely on, and sends no message to the people around us, unless that is expressly agreed as part of the piece of work. Linear, Notion and Slack are the examples: an issue, a page or a message there reaches other people before Kris has seen it. The agreement is the grant or the task naming the system and the change, within the authority tiers; a system the window's work is expressly about is agreed by that work.
- **Allowed in a window:** GitHub, under the standing push rule and the [criticality test](#criticality-test), and the systems the window's work is expressly about. GitHub here means Kris's own repositories: an issue, comment, reaction, pull request, discussion, review or message on another owner's repository stays under the [external-posting rule](#authority-tiers), which no agreement in a window lifts.

The rule governs unattended work only. An attended turn keeps its existing gates: it changes an external system or sends a message where its task and tier allow, with Kris in the thread. Posting in Kris's name on another owner's repository or service needs his express permission for that specific post even then, under the [external-posting rule](#authority-tiers). A visibility change in any of these systems is also governed by the [confidential rule](#authority-tiers), which no agreement in a window lifts.

### Questions in a window

Kris set the rule for a question asked during a window on 25 October 2026, routed from the HNR State of play as METHOD-UNATTENDED: "If you ask me for input as well in ... an unattended period, you should only really ask it for a couple of minutes. And if I don't respond, then you should not take any action from it. That's also something they should learn about."

- **Ask briefly:** a question put to Kris during an unattended window, by the coordinator or by a run, is asked in plain text in the thread, never through a blocking question prompt, and waits a couple of minutes at most for an answer.
- **No answer, no action:** with no answer in that time, nothing is done on the matter the question raised, in either direction: the work it gates is neither taken on nor dropped. The question is parked as a query, keeping its tag, Context, Query and Options, for the return report, and the other authorised work carries on. Silence is never consent: no default, no recommended option and no earlier pattern stands in for the answer.
- **A late answer:** an answer that arrives later in the window is an ordinary owner decision from then on, read back in the decisions log before the work it authorises launches.

The rule governs unattended work only; attended, a question waits for Kris in the thread as usual. It lifts nothing: a grant widens by Kris's words, never by Kris's silence, and a parked question keeps the work it gates parked with it.

### Dotfiles and software

Kris set these two rules on 25 October 2026, answering UNWRITTEN-RULES-CONFIG and confirming UNATTENDED-LIMITS, "Yes, write it". They hold in every session, attended or in a window.

- **Dotfiles:** a needed chezmoi or dotfiles rollout goes ahead after an independent judgement check: a blind review of the `chezmoi diff`, masked under the `ki-coordination` [query review](../../../change-management/ki-coordination/references/standards-queries.md#query-review), confirming that each change is needed and safe. The check stands in for Kris's approval: where Kris has directly approved the described diff, that approval satisfies the check and no blind review is needed; otherwise the coordinator runs the review before the rollout run, and the task cites whichever applies. Kris: "we should have an extra judgmental check on it instead to make sure that we're making changes ... that we need to make". A rollout that touches a connection-critical service still needs its tested restore path.
- **Software:** upgrading an already installed library or tool, our own releases included, needs no check. No session ever installs new software. Kris: "If we need to install a new version of a library ... such as our own releases, then [approval] doesn't need to happen", and "critically we should never install new software. We could upgrade existing ones, but never new software as well."

The [machine grant](../assets/grant-machine.md) carries both rules, and RUN-1 checks that it keeps them.

## Decisions log

Each owner decision about the work is one timestamped entry in the work folder's decisions log, `+/_WORK/<id>/decisions.md`. How an entry is written, logged in the turn it arrives and quoted only from the transcript file, and what becomes of it at each mark are `ki-coordination`'s [decisions log](../../../change-management/ki-coordination/references/standards-decisions.md#decisions-log) and [decisions life cycle](../../../change-management/ki-coordination/references/standards-decisions.md#decisions-life-cycle). A prompt, brief or report describes the decision it acts under in the owner's words and with its date, never by a number.

The run side is this standard's. The session that starts the runs keeps the log; a background agent never writes it. Whatever the agent host keeps of a run is runtime, is not backed up or synced, and is never a Decision Record. Nothing durable may exist only in runtime: the test Kris set on 2026-10-13 is that "if the state folder is lost, you shouldn't lose any knowledge".

A background agent never deletes a report or brief; the work folder is tidied by its coordinator under the `ki-work-package` [Tidying the work folder](../../ki-work-package/references/standard-work-package.md#410-the-tidy) rules, which also delete the folder of finished work at the mark that closes it. A run started as an Orca supervised worker is also closed out, reused, retained or released, under the `ki-coordination` [Closing out Orca workers](../../../change-management/ki-coordination/references/standards-mark.md#closing-out-orca-workers) rule, and close-out never deletes its conversation history.

## Coordination

- **Ordering:** an agent that depends on another waits until that agent's status ends `DONE`, checking every two minutes.
- **Isolation:** parallel agents in one repository each use their own Git worktree. A lone agent may use the primary checkout. A background run's worktrees go where its agent host places them, or under `$TMPDIR/ki-agents/<run>/worktrees/<repo>` where it places none. Before it reports `DONE`, the agent removes each worktree it created with `git worktree remove` and deletes its branch once merged.
- **Split, then join:** where two agents running at once would otherwise edit the same file, the second gets its own new module and a short note registering what must be wired in, and a small integration agent, waiting on both `DONE`s, joins them; where the work cannot be split, the agents are chained under the `ki-coordination` [concurrency practice](../../../change-management/ki-coordination/references/standards-coordination.md#coordinator-responsiveness). Each agent's model follows the `ki-tokenomics` model purposes. The design runtime's parallel background agents worked this way on 6 November 2026, as it reported in CD-63.
- **Integration:** a run working in a worktree integrates its own work before it reports `DONE`, under the `ki-git` [worktree-run self-integration](../../ki-git/references/standards-git.md#worktree-run-self-integration) grant: rebase onto local `main` without a fetch, gates on the rebased range, a fast-forward into the primary checkout's `main` with one writer at a time in that checkout, then the worktree removed and the branch deleted. Independent review still comes before acceptance. A run that cannot fast-forward keeps its worktree and branch and reports `stranded: <reason>` as a blocking query, never a quiet `DONE`. Kris took WORKTREE-INTEGRATE a) on 2026-10-20: "do whatever that needs to be".
- **Worktree trial:** from 2026-10-20 every writing run in a code repository works in a worktree; Knowledge Islands Principal's long runs join once the `ki` registry recognises a linked worktree as its registered repository, and coordinators and short work-package runs stay on the primary `main`. Kris took WORKTREE-START a) on 2026-10-20, "do whatever that needs to be", whose option read: "Start now in code repositories under F1 and F4, adding ki-principal's long runs once F5 lands."
- **Worktree baseline:** every writing run, under every agent host, works in its own worktree; only a run that writes nothing inside any repository may skip it, and a trivial writing run gets no exception. Writes to a work folder count as writes. The baseline takes effect when the `ki` integrate command and the four worktree prerequisites land: registry resolution of linked worktrees, a worktree base taken from committed `main`, package anchoring to the primary checkout, and a tested skills-and-dependencies check. Until then the checkout-isolation pilot rule stands: short work-package runs on the primary `main`, committing by pathspec with a landed check, beside the worktree trial above. Kris took WORKTREE-OPTOUT a) on 30 October 2026.
- **Worktree audit:** until the `ki` registry recognises linked worktrees, `ki repo audit` in a worktree reports false REPO-REG-1 and RUNTIMES-2 failures, because the real registry knows only the primary checkout. Audit a worktree in an isolated home, never against the real registry: from the worktree, point `HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_STATE_HOME` and every `KI_*_HOME` at a fresh temporary directory, seed there the empty runtime settings and MCP inventory that CI's install step writes, then run `ki bootstrap`, `ki registry add --repo .`, `ki dev local set <harness> "$(pwd -P)"` and `ki dev local on <harness>` when the repository is a harness, `ki repo repair --repo .` and `ki repo audit --repo .`, and delete the temporary directory. This mirrors CI's install step, and on 2026-10-20 it gave the harness the same zero-failure verdict as CI under CI's pinned `ki` v0.11.3 and under v0.12.0, with nothing written under the real home. Kris took WORKTREE-AUDIT a) on 2026-10-20: "the work tree order needs to be a case as well", read as the worktree audit.
- **Commits:** commit each complete unit and each finished work-package change by explicit path before the turn ends; sync after each finished change and at least every 15 minutes while work runs, pulling with `--ff-only` into a clean checkout and pushing under the standing rule. Uncommitted package changes block pulls and pushes, as Kris warned on 25 October 2026. Commit only explicit paths, and leave other uncommitted changes untouched, following `ki-git`, whose [checks before committing](../../ki-git/references/standards-git.md#checks-before-committing) rule every run commit follows.
- **Commit trailer:** an agent's co-author trailer names the model that actually made the commit, read from its agent host's runtime, never the coordinator's model or one copied from the brief. This line owns the rule; footers and briefs point here.
- **Pushing:** Kris replaced the own-commits-only rule on 25 October 2026 under PACKAGE-PUSH, choosing "Tonight's rule always": after verification, fetch and pull fast-forward only into a clean checkout, then push everything stacked on `main`, other sessions' commits included, where the task and repository permit publication; high-confidence or reversible work lands this way without waiting for Kris, under [Landing, then review](#landing-then-review). Never force-push or use `--no-verify`; stop on divergence and use a [bounded conflict run](#conflict-runs). Never commit, revert or stash another session's files. Commit hooks run lint-staged with `--no-stash`, under the never-stash rule as Kris chose HOOK-STASH a) on 1 November 2026, and a leftover `lint-staged automatic backup` stash is reported, never dropped. Owner reports, run reports and banners omit routine push state and other sessions' stacked commits. If the run's own unit could not be published because its push failed, its `## Done` names the affected unit and reason. A hold report keeps nothing about pushes beyond a failure. The same rule governs coordinating work under [Pushing beneath other sessions](../../../change-management/ki-coordination/references/standards-sync.md#pushing-beneath-other-sessions).
- **Green baseline:** a run starts only from a green harness `main`, and an estate-wide rollout only once the harness hook tests pass. An agent that finds the baseline red stops the line, reports it and changes nothing else; harness edits are made off the shared main checkout, under the `ki-git` [working-copy and review approaches](../../ki-git/references/standards-git.md#working-copy-and-review-approaches). Kris agreed GREEN-MAIN as recommended on 2026-10-20, "GREEN-MAIN - agreed as recommended".
- **Ambiguity:** stop and report rather than guess.

### Conflict runs

Kris adopted CONFLICT-RUN on 25 October 2026 with the review's stop boundaries. A sync that cannot fast-forward goes to a bounded resolve run at push tier in its own worktree. It rebases only this work's unpublished commits onto the remote, resolves only changes whose ownership and content it has verified directly, reruns the required gates and pushes fast-forward within its existing authority. File ownership alone does not establish that a file contains no other session's content. Stop on another session's content, uncertain ownership or a judgement call; park a blocking query and make no further push from that repository in the window. Skip and name a checkout another session left dirty. Never stash, rebase or reset in the coordinator's checkout, never rewrite published commits, and never infer push permission from the conflict itself.

### Permission prompts

A runtime-specific check, Claude Code's built-in `rm` safety check, still asks under bypass mode, with no Codex counterpart observed yet, and a background run has nobody to answer, so a run issues no call that may stop on it. The shapes that trip the check are an `rm` with a glob, a shell-variable or `$(...)` target, or a target under a workspace directory, alone or inside a compound command or `sh -c`; `git worktree remove`; and a foreground `sleep` of 60 seconds or more. The alternatives: a coordinator uses a bounded run for removal, under the `ki-coordination` [tool-calls rule](../../../change-management/ki-coordination/references/standards-coordination.md#coordinator-responsiveness), and a run uses literal absolute paths copied from earlier output or leaves removal to the tool that made the thing, its temporary directory to the session that started it under the [run packet](#run-packet). A run that is denied reports the denial and goes on; it never waits for an answer. Kris adopted PERM-PROMPTS-SHAPES, "Both standards", on 25 October 2026; the interactive cause is probable, not proven, until Kris reports a prompt's wording. This grants no bypass of a permission gate.

### Connection-critical changes

Kris set this rule on 2026-10-14, after a Headroom proxy rollout removed the proxy's launchd service and cut every session off for forty minutes: "any change to a firewall or to the configuration of a service critical for connection (Headroom proxy, SSH, Tailscale, network, auth) must carry in its rollout plan a tested restore path that reconnects first, then evaluates why it failed", placed where "Claude and Codex both load it (ki-delegation and the engineering standard)". So a task that changes any of those carries its restore path in the brief, tested as the `ki-engineering` standard's [connection-critical rollouts](../../../governance/ki-engineering/references/standards-engineering.md#connection-critical-rollouts) subsection defines, and an agent given such a task without one stops and reports before changing anything. Every authority footer carries the rule in one line.

## Concurrency

Keep agents moving. A session never waits for a whole batch to finish before starting the next piece of work.

- **Concurrency:** under the practice Kris set on 2026-10-14, "CONCURRENCY / add the current practice to ki-coordination: chain agents that touch the same files, run different repositories in parallel, about three running per thread, the rest queued", about three agents run at once per session; agents that touch the same files run one after another, and agents in different repositories run side by side. The session keeps the rest of its ready briefs in its own order and starts the next as one finishes.
- **Gates:** an agent that depends on another starts only once that agent has finished, under [Coordination](#coordination).
- **Waking:** the agent host's notice that an agent has finished, failed or is blocked is the session's wake. The session reads it at its next turn, reports it to the owner and starts what it unblocks; it never waits, polls or relays in the foreground, under [Coordinating work](#coordinating-work). Where an agent host gives no notice of its own, its `wait` verb is the wake: a coordinator keeps exactly one detached waiter at a time, whatever the agent host, bounded at five minutes and re-armed after each wake, and an agent host's `wait` is proved for each runtime before anyone relies on it. Session wakes are best effort and cannot promise an unattended service. The durable wake is the `ki-coordination` [headless pass](../../../change-management/ki-coordination/references/standards-unattended.md#headless-passes); Orca automations are not wakes. Kris took WAKE-SESSION a) and WAKE-DURABLE a) on 30 October 2026; WAKE-HOST, where a headless coordinator runs, remains open.

## Monitoring

The session stays non-blocking. It follows its agents through its agent host's own view of them and never watches in the foreground.

An agent that has ended without a report is flagged, never counted as finished.

After an interrupt, check through the agent host which agents still run before saying anything is running. Start a lost agent again rather than wait for a notice that will not come.

## Reporting

The owner sees only status one-liners and each report, in the [reply forms](../../../change-management/ki-coordination/references/standards-reporting.md#reply-forms) the `ki-coordination` standard sets; a background agent's final report is always a completed-work report. Kris set the cadence on 2026-10-14, as received: "UPDATE-CADENCE / yes: add to ki-coordination - full Summary only when all dispatched work has finished or on request; otherwise timed one-to-two-line updates; a blocking query raised in a single line; the resume line shown only at rest; a report that does not repeat unchanged queries still carries the full stacked reply block for every open query". So coordinating work gives timed updates of one or two lines while work lies with a worker, raises a blocking query in a single line when it arises, and gives the full Summary only when all dispatched work has finished or on request. Under the work model each query keeps its Context, Query and Options with confidence, and a report carrying a query closes its queries with the `ki-coordination` [reply block](../../../change-management/ki-coordination/references/standards-reporting.md#owner-report), its queries grouped by priority under numbered headings and each line carrying the recommended option's confidence, as Kris set under REPLY-FORMAT on 2026-11-07 and REPLY-GROUPS on 2026-11-12, replacing REPLY-BLOCK of 2026-10-18; the owner sends the block back as it stands or changed, or answers in speech, and the coordinator reads each answer back as taken in the decisions log; the send line replaces the resume line. Tooling output, commit identifiers and step narration stay in the log and in the report, unless the owner asks, and the report gives each tool outcome in one line, never pasted output, under the `ki-coordination` [quiet-tools rule](../../../change-management/ki-coordination/references/standards-reporting.md#quiet-tools).

An owner report, in every form including the coordinator's [Summary](../../../change-management/ki-coordination/references/standards-report-forms.md#the-summary), is a complete deliverable: its sections, its queries and its banner are never shortened by any output style, proxy shaping block or communication level, which govern prose around the report and not the report itself.

### Owner report

Every completed-work report, a background agent's final report, a coordinator's Summary and a conversational session's end-of-unit report alike, is an **owner report** in the shape the `ki-coordination` standard's [owner report](../../../change-management/ki-coordination/references/standards-reporting.md#owner-report) sets, a run report closing with the glyph banner of the work's state as the run leaves it. That standard is the shape's one source, as Kris decided on 2026-10-14: "REPORT-SOURCE - generate the hook line, output style and prompt skeleton from the ki-coordination standard with a ki dev command, make ki-delegation link to it, and have the existing test check the generated files". This standard does not restate it: the **Report** paragraph of [the run-prompt skeleton](../assets/run-prompt.md) and the report rule of each authority footer are rendered from that standard's [generated surfaces](../../../change-management/ki-coordination/references/standards-coordination.md#generated-surfaces), and a change to them is made there.

### Needs tags

Each outstanding query carries a stable mnemonic Needs tag, never a number, defined with the owner report under the `ki-coordination` standard's [Needs tags](../../../change-management/ki-coordination/references/standards-reporting.md#needs-tags).

## Agent hosts

A session delegates to its own agent host's subagents: Claude Code's and Claude Desktop's agents, Orca workers under `ki-delegation-orca`, and ChatGPT Desktop's agents. Each agent host keeps its own runtime mechanics, and neither this skill nor personal setup restates them. The `ki agent` launcher in `tools-ki`, earlier the reference launcher with its state folder, run queue, dispatcher and run inbox, was removed in v0.15.0.

**Where Orca runs.** Orca starts runs only on attended Macs, and only for work packages that opt in by a logged owner decision. An always-on Orca server that launches or hosts background runs comes only through Knowledge Islands Principal's Enactment Process, not by a run or a grant. A reach-only server, which gives remote reach into attended sessions and launches no runs, rests instead on Kris's BASELINE-ORCA direction, relayed by `personal.reg.rig-sol` on 8 November 2026, as Rig's `service:orca-serve` does on sol's studio profile. Kris took ORCA-REACH a) on 30 October 2026, "as recommended but with a follow up in a weeks time", and AGENT-HOME a) the same day, "as recommended but with a follow up in a few days".

Sources: BASELINE-ORCA in [the source register](sources.md).

## Mechanical boundary

The native rubric checks that each authority footer exists, carries the shared prohibitions, and grants exactly its tier. It cannot judge whether a prompt cites a real decision, whether its steps are sufficient, or whether a tier is warranted; the RUN judgment item reviews those.
