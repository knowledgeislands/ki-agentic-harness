# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › wow-absorb-plan

**🤖 → 👤 Handoff to supervisor · Run report at 02:44 GMT · last mark 02:25 GMT**

---

## Done

- Read-only inventory of [ki.prj.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/work.md) made and the absorption plan drawn up. Nothing changed and nothing was committed. No checks were run because nothing changed.
- What it holds: 117 distinct parked query tags, counting each of the eight duplicated one-line entries once (94 full blocks and 23 one-line entries, with no open queries); a 1,313-line decisions log of about 300 entries; 14 focus folders plus `reports/`; 11 inbound messages; 92 finished runs in the `ki-project-ways-of-working` group, none live; two harness branches with worktrees, `ki-e2e` and `orca-adapter`, each two commits ahead of `main`.
- Material finding: the two "Z" reports in `reports/` were meant to stay uncommitted (Z-FILES), but they were committed in ki-principal `7109c998` ("chore: baseline", 4 November) and are on `origin/main`. ki-principal's `.ki.toml` declares `visibility = "public"`. This is query Z-PUBLISHED below.
- Material finding: two untracked run reports, `reports/wow-naming-reader-remedy.report.md` and `reports/wow-naming-thread-priority.report.md`, were written at 16:57 GMT on 6 November and still carry the old `~/workspaces` paths. This run did not write them, and it left them alone. They are listed in step 3.

### 1. Parked queries: where each one goes

There are seven kinds of disposition. **Settled** means a later decision already answers it, so it closes, citing that decision. **Close-out** means the close-out steps in section 5 take it in. **Folder plan** means the design-note plan in section 3 takes it in. **Merge** means it joins an open or held guild query. **Move** means it moves to ki.reg.guilds unchanged. **Route** means it goes as one message line to the work that owns it. **Drop** means it is overtaken, and needs Kris's agreement (query ABSORB-DROPS).

Totals: Settled 6 · Close-out 2 · Folder plan 6 · Merge 24 · Move 39 · Route 27 · Drop 13 = 117.

**Already handled elsewhere:** ki.sop.main has already sent the sixteen Orca adapter queries and SCOPE-SPLIT's four (TRIAL-PUBLISH, TRIAL-ASK, TRIAL-PRACTICE, ORCA-IDENTITY-LEAK) to the guild (ki.sop.main log, 02:33 GMT). None of them is in this package any more. ORCA-CODEX-WAKE is the only Orca query still here, and it is listed under Orca below.

#### Roles

| Tag | Disposition | Where / why |
| --- | --- | --- |
| STEWARD-FIELD | Merge | With the guild's ROLE-FIELDS: both decide which field says who looks after a package. The standard still marks it as a placeholder awaiting Kris |

#### Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`)

| Tag | Disposition | Where / why |
| --- | --- | --- |
| HOOK-PATCH | Move | Still live: no skill mentions a leftover `.git/lint-staged/` patch |
| WP-HEARTBEAT | Move | Still live: the Work Process note still has the timed "Stuck and the heartbeat" paragraph |
| RESTART-POLICY, RESTART-EVIDENCE, RESTART, SIGNAL | Move | Keep together as one restart and session-freshness set; the current restart rule stands until they are settled |
| OPTION-CONFIDENCE | Move | Still live: the standard still gives a confidence only to the recommended option |
| FOCUS-SLOT-OWNER | Move | Message-line `focus:` slot |
| FOCUS-TOP | Move | Still live: household-sol's `work.md` still has Focus above Goals |
| THREAD-DEFAULTS | Move | Session selection |
| GIT-REBASE | Move | Partly settled: `ki-git`'s worktree-run self-integration already lets a run rebase its own branch onto local `main` (WORKTREE-INTEGRATE a, 20 October). Only the case of a resolve run against the remote remains |
| PUSH-RETRY | Move | Method choice; the current stop-and-resolve route stands |
| HNR-CAP | Move | Rule COORD-3, the cap on active Project work: whether it should read a recorded cap raise |
| LINT-WHERE | Move | Where generated Markdown is linted (`ki-authoring`) |
| CLI-PREVIEW | Merge | With DRYRUN-SCOPE, below: the same dry-run question |

#### Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`)

| Tag | Disposition | Where / why |
| --- | --- | --- |
| IDEAS-REVISIT, PARKED-TO-IDEAS, PARKED-TO-IDEAS-MOVE, ROADMAP-UPCOMING, ROADMAP-UPCOMING-HELD, ROADMAP-UPCOMING-CAP, GATES, GATES-SIZE, WIP-PACKAGE, WIP-TERRITORY | Merge | With the guild's held KNW-005 (where ideas live, work-in-progress reset), with the empty-board notes as its design |
| HOLD-CLOSE, HOLD-ROUTE | Merge | With the guild's HOLD-STATES and HOLD-TIDY. HOLD-ROUTE is partly settled by SOP-ACTS-FOR-IDLE (State of play acts on an idle package's messages) |
| HOMES, EXECUTION, HOST, DISPLAY, THEME, ROUTING | Move | One package-definition set, kept with the package-definition-freshness merged report |
| PACKAGE-FORWARDING | Move | Package pointers after a rename |
| STREAM9-SHA | Move | Identifier checker boundary |
| STATE-MACHINE-DECISIONS | Move | Check first against the seven-state model now in the Work Process note; drop whatever that note already settles |
| ENACTMENT-ADMIN | Move | The 20 October choice on narrowing the gate is still unmade |
| GATE-BASELINE-COMPARATOR | Move | How to tell a finding inherited from `origin/main` from a new one |
| UNATTENDED-FIELD, UNATTENDED-AND-DUE-DATES, DUE-FIELD | Move | Record fields; keep the three together |

#### Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers)

| Tag | Disposition | Where / why |
| --- | --- | --- |
| HNR-OFFLINE, HNR-MJS, HNR-PROOF | Move | The harness gives way; the fix is in the harness's own skills |
| HNR-SITE-SHAPE, HNR-DR-LINKS | Move | The harness rule's owner decides (website standard, BODY-11) |
| LEGACY-PREFIX, PARTIAL-REPOS, LINK-EXTERNAL, STREAMS-CHECKER-GAP | Move | Guild-owned checkers |
| AREA-COLUMN | Move | Skill-catalogue publication; sits beside HARNESS-SCOPE's Agora Atlas map |
| DRYRUN-SCOPE | Move | The dry-run convention (`ki-engineering`); delivery in tools goes to ki.prj.tools-burndown |
| E2E-ADOPT, E2E-KIND, E2E-OFFRAMP, E2E-HELPERS | Merge | With the guild's held APP-SKILLS, which already names the `ki-e2e` draft |

#### Orca

| Tag | Disposition | Where / why |
| --- | --- | --- |
| ORCA-CODEX-WAKE | Merge | Joins the guild's Orca set, as the guild's `state.md` already plans; its own option a) proposes closing it |
| PILOT-CONTRACT-LINE | Drop | The pilot it would have added checks to was answered on 1 November (ORCA-SUBAGENT-PILOT-ANSWERS) |
| ORCA-REACH-VEGA | Route | One line, for information, to [ki.prj.agent-host](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.agent-host/messages.md) |

#### Acquisition (the guild's parked ACQUIRE-ROUTE)

| Tag | Disposition | Where / why |
| --- | --- | --- |
| ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE, CHECKSUMS-SETTLED | Merge | ACQUIRE-ROUTE already lists them. Kris, 7 November: "We can come back to that later" |
| GRANOLA-COUNT | Merge | ACQUIRE-ROUTE too. It looks delivered by `granola-screenshots` (tools-ki `eca35dbe`, 2 November); confirm when ACQUIRE-ROUTE is taken up |

#### Already settled

| Tag | Settled by |
| --- | --- |
| PAPERCLIP-RETIRE, PAPERCLIP-GRANT | PAPERCLIP-DROP, Kris on 7 November at 01:58 GMT (guild log); `paperclip-drop` is delivering it |
| HOST-SYNC, HOST-SYNC-CLOSE | HOST-ALL, Kris on 1 November at 00:29 GMT: "we've moved on from these points", plus the host-reconcile plan |
| TOPIC-SET | LAYOUT-PILLARS and PILOT-ON-PILLARS (2 November): the 14-area layout landed in ki-principal `76d86a11` |
| FOLDER-MIGRATE | The same layout rollout (TERRITORY-LAYOUT, 2 November) |

#### This package's own housekeeping

| Tag | Disposition | Why |
| --- | --- | --- |
| CLOSE-BLOCKED, CLOSE-GATE | Close-out | Closing the run group is step 7 of the close-out, under query CLOSE-WAIVER |
| HOST-SYNC-NOTES, CITED-NOTES, CITED-NOTES-LINKED, OLD-PROPOSALS, OLD-PROPOSALS-OWNED, OLD-PROPOSALS-IDEAS | Folder plan | Section 3 decides what happens to each note |
| QUICK-FIXES, AGENDA-SHAPE, RECORD-2, FOLDER-1, COORD-7-REST | Drop | Audit findings and duplicates that belong to this folder, which is being deleted. The guild's STAGE-C-ROLES work deals with RECORD-2 for every package |
| SPLIT-COMMIT | Drop | History only; its own option a) changes nothing |
| SWEEP-GATE | Drop | The rename sweep it was guarding has been rolled out across the live packages |
| Z-FILES, Z-FILES-HOME | Drop | Their premise is gone: the files are already published. Replaced by query Z-PUBLISHED |
| PRINCIPAL-READOPT, PRINCIPAL-KIND-SIZE | Drop | Each proposed its own closure, reviewed at high confidence; the Halloween record's date has passed |
| PROTECTED-PUBLICATION | Drop, after one check | The stack it was protecting has since been published (`7109c998` baseline). A run confirms the Observatory's disposition line is gone before dropping it |

#### Routed to their owners, one message line each

| Tag | To |
| --- | --- |
| HNR-TOOLROOT, HNR-EMPTY-PROJECT | hnr.sop.main (HNR gives way) |
| OBS-FEEDBACK-LINE, ANSWER-VECTOR, DONE-PRUNE-OBSERVATORY | [ki.prj.observatory](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.observatory/messages.md); ANSWER-VECTOR is already quoted there, so check before sending |
| SWEEP-NOTE-LINKS | ki.prj.observatory and Rig's roadmap owner, with the pinned link |
| DONE-PRUNE, DONE-PRUNE-TOOLS-KI | [ki.sop.main](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/messages.md), for its ACCEPT bundles; pruning stays Kris's to approve |
| QUICK-FIXES-LIFECYCLE, QUICK-FIXES-FOLDER, AGENT-HOME-IDEA, MIRROR-TOKEN | ki.sop.main: the Project registry, closing out the finished [ki.prj.knowledge-acquisition](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.knowledge-acquisition/work.md) folder, the Techné theme page, and an action that is Kris's own |
| MGIT-CACHE-SCOPE, MGIT-CACHE-FAILED, SYNC-UNPUSHED-EXIT, REL-X64-TIMEOUT, MD-STANDARD-REMAINDER | [ki.prj.tools-burndown](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.tools-burndown/messages.md); send `_emerging/mgit-cache.md`'s pinned link with the mgit lines |
| PERM-PROMPTS-SETTINGS, PROXY-SHAPER | [ki.prj.chezmoi](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.chezmoi/messages.md); both deferred by Kris on 25 October |
| RIG-ATTENDED, AUTOSTASH-LEFTOVER, MISSING-TOOLS | personal.reg.household-terra and personal.reg.household-sol: Rig attended checks, the stash sweep and hook tools |
| TERRA-LOCAL-REPORTS, TERRA-PR-CHECK, TERRA-RECOVERY | personal.reg.household-terra. The retention ref and archive behind TERRA-RECOVERY stay as a pointer in the guild's log (section 2) |
| PERSONAL-KINDS | Personal's State of play |

### 2. Decisions log (1,313 lines)

| Block (lines) | What it holds | Disposition |
| --- | --- | --- |
| 17–25 Oct (3–170) | COUNSEL, MECHANICAL, LOCAL-MODE, NET-DOWN and WIP-CAP, the over-engineering guard, permissions, QUERY-RULES, COORD-COMMANDS, DECISION-HOMES, METHOD-NUDGE, DOCS-PUBLISH, REVIEW-DIGEST | Mostly strike: the coordination and delegation standards carry them, and the cap is COORD-3. **Move to the guild log:** KI-AGENTS-NAME, which DECISION-HOMES made this log its home and no skill cites; the over-engineering guard (22 October), unless the one skill citing it holds Kris's words; ENACTMENT-ADMIN and PROXY-SHAPER as pointers beside their parked queries |
| 25–27 Oct (170–294) | Receipts from runs and away grants; Kris's words on the mgit cache; UNATTENDED-LIMITS; the 26 October answers (HNR-LEVEL, ACCEPT, MGIT-CACHE-TTL, WAKE-SUBSTRATE, RECAP-NAME, DIAGRAM-PRIVATE-CITATIONS); the "too many questions" steer; the 27 October bulk reading | Strike the receipts, grants and done answers (RECAP-NAME, WAKE-SUBSTRATE and DIAGRAM-PRIVATE-CITATIONS are cited in skills). **Pointer** for the mgit-cache words and TTL, homed with the MGIT lines in tools-burndown. **Move:** the "too many questions" steer (27 October), unless the clustered-query rule now carries it |
| 27–29 Oct (294–605) | CONFIDENT-UNATTENDED waves, closure follow-through, naming and thread types, the sleep window, qualification receipts | Strike: operational and spent. **Pointer, keep live:** "Live pointers - 29 October" and "Retained publication evidence" (`refs/retention/wow-publication-original-20261029-urag5vjr` and the work archive), which go into the guild log as one retention pointer tied to TERRA-RECOVERY |
| 29–30 Oct (605–846) | The work-model decisions (DRAIN-MEANS, WORK-FOLDER-PURPOSE, WORK-STATE-MACHINE, TRANSITION-CONDITIONS, WORK-CYCLE-*, ROLES-*, MOVE-*, DIAGRAM-*, MACHINE-HOME), the ORCA-FIT and LANDSCAPE commissions, the 30 October owner answers, ORCA-SUBAGENTS | Strike wherever the Work Process note and `ki-coordination` now carry them; none is cited by tag, so the reconcile run in step 7 confirms each in substance. **Pointer:** the ORCA-REACH and AGENT-HOME follow-ups, sent with their route lines |
| 31 Oct (846–1000) | The AWAY-31-OCT window and its answers under ACCEPT-BY-CRITERIA, QUERY-TURNS, INBOX-WATCH, owner remarks | Strike: the window is spent, and its answers are in the standards (ACCEPT-BY-CRITERIA is cited in 7 skill files) |
| 31 Oct–3 Nov (996–1300) | Host-reconcile answers, the card loop, SYNC-QUIET, LISTEN-TENDS-PACKAGE, FOOTER-LAYOUT, MARK-THEN-SUMMARY, RENAME-THREAD-FORM, TOP-LEVEL-NOW, DISCUSSIONS, QUALIFY-ITEMS, HOST-ALL, ORCH-NAME-*, BROKEN-LINKS-HISTORY, PAPERCLIP-DORMANT, the AWAY-1-NOV window, PERSONAL-SHAPE and its handover, RIGS-YAML, MAIL-ENGINE, WORKER-LEFTOVERS, token-approval, E2E-WAY, DRY-RUN-FLAGS, LAYOUT-PILLARS, REPORTS-HOMING, ORCA-AUTO-RELEASE, the Granola lines, DRAIN-TO-SOP, SUB-PACKAGE, LISTEN-TRUTH, CLOSE-SPILL, ANNOTATED-BOARD-SKILL | Strike those the skills cite: MARK-THEN-SUMMARY, SYNC-QUIET, LAYOUT-PILLARS, SUB-PACKAGE, HOLDING-SCOPE-CARDS, WORKER-LEFTOVERS, the provider-token rule. Strike as superseded: PAPERCLIP-DORMANT (by PAPERCLIP-DROP) and HOST-* (by HOST-ALL). Strike the spent windows and receipts. **Pointer:** PERSONAL-SHAPE, HOUSEHOLD-IS-CHEZMOI, ROLLOUT-LEAD and KRIS-VIA-ASSISTANT to the Personal packages that carry them; DRY-RUN-FLAGS and E2E-WAY beside DRYRUN-SCOPE and APP-SKILLS. **Move to the guild log:** QUALIFY-ITEMS, LISTEN-TRUTH and ANNOTATED-BOARD-SKILL (Kris's words not yet in any skill); route CLOSE-SPILL to tools-burndown, which owns `ki agent close` |
| 3–7 Nov (1300–1313) | SOLE-THREAD, ORCA-HOME routing | Strike: operational |

Rough outcome: about 85% struck, about 15 one-line pointers, and about 6 entries of Kris's words moving into the guild's decisions log.

### 3. Folders, notes and reports

| Folder | Holds | Disposition |
| --- | --- | --- |
| `package-layout/` (13) | layout design, finished-tidy-kick, package-definition-freshness brief, report and two reviews, briefs, reports | Layout design and finished-tidy-kick have graduated into `ki-work-package`: delete. Move the freshness merged report to guild `skills/` as the design for the definition set; delete the rest |
| `discussions/` (4) | rollout plan, reports, brief | Spent (DISCUSSIONS b has landed): delete |
| `host-sync/` (6) | brief, reports, two reviews, live design | Superseded by HOST-ALL: delete under HOST-SYNC-NOTES' checks, first pinning the Observatory report's link |
| `host-reconcile/` (5) | plan, briefs, a resolve report | Spent; GIT-REBASE carries the remaining context: delete |
| `inbox-wake/` (3) | design, two reports | Graduated into the inbox watcher rule: delete |
| `orca-subagents/` (7) | orca-fit, explainer, design, briefs | Under ORCA-HOME, move `orca-fit.md` and `design.md` to guild `skills/` until ADAPTER-MERGE settles; delete the briefs and the explainer |
| `capture-model/` (9) | acquisition-process-draft, capture brief, briefs, a report | Keep the draft with ACQUIRE-ROUTE by moving it to guild `skills/`; the capture brief has graduated into `ki-acquire`; delete the rest |
| `empty-board/` (2) | design, ideas | Move to guild `skills/` as KNW-005's design |
| `window-31-oct/` (3) | plan, interim-cover, unattended-work | The window is spent. `unattended-work.md` goes under CITED-NOTES-LINKED: pin its links, then delete |
| `landscape/` (7) | landscape study, reviews, vendor and skills inventories | The study is done (30 October). Pass its conclusions to `ki-agentic-radar` as a source with the pinned link, then delete |
| `work-model/` (9) | state machine (md, mmd, svg, html), rollout plan, work-id plan, model shape, tags-model, MOD-011 wording | The state machine has graduated into the Work Process note: delete after the STATE-MACHINE-DECISIONS check. `work-id-shape-plan` goes under CITED-NOTES-LINKED and `tags-model` under OLD-PROPOSALS-IDEAS; MOD-011 wording is checked against its record |
| `rollout/` (23) | 17 conform reports, burn-down and field reports, territory-stock, two briefs | Spent once their outcomes are confirmed homed; this also settles HK-006's link items (MSG-76265b12): delete |
| `personal-shape/` (3) | handover reports, brief | The handover is done: delete |
| `_emerging/` (37) | 14 briefs, 11 reports, 12 notes | Briefs: delete. Reports: delete once each is confirmed homed. Notes: `agent-control-contract` (accepted) sends its undelivered remainder to tools-burndown and is then deleted (OLD-PROPOSALS); `coordination-lessons` and `method-feedback` feed SKILL-HARVEST and are deleted after the CITED-NOTES check; `gfm-migration` goes under CITED-NOTES-LINKED; `gov-227-storage-schema` and `observatory-review` go under OLD-PROPOSALS-OWNED; `overload-process` goes under OLD-PROPOSALS-IDEAS; `mgit-cache` goes with the MGIT lines; `findings.md` has graduated into the Findings section; `repository-metadata` and `tending` feed SKILL-HARVEST (`ki-repo`, the housekeeper role); `finish-line-plan`, `roadmap-sizing-and-burn-down` and `stocktake-2026-11-01` are spent |
| `reports/` (6) | granola-screenshots and launcher-reports reports, two Z files, two untracked wow-naming reports | Two reports spent: delete. Z files: query Z-PUBLISHED. The wow-naming reports are untracked; check that their outcome (CLI-174, GOV-233) is homed, then remove them |
| top level | `self-focus.report.md`, `wow-tidy-5.report.md` | Spent: their outcomes are in the log |

### 4. Messages, runs and worktrees

| Item | Disposition |
| --- | --- |
| MSG-c6fa7c81 SKILL-HARVEST (from the guild itself) | Answered by the absorption: the harvest items are `coordination-lessons`, `method-feedback`, `repository-metadata`, `tending` and the moved Kris words (section 2), written into the guild's `skills/harvest.md` |
| Seven IMPORTANT REFRESH lines (MSG-c3d6e663, MSG-4a743269, MSG-19dc7d02, MSG-d11b2698, and EMERGING-FOCUS, MARK-STATUS and SUMMARY-NOW) | Spent: the package closes rather than refreshes. One ACK line to ki.sop.main for all seven, "absorbed into ki.reg.guilds" |
| MSG-b94130b1 and MSG-76265b12 (household-terra, HK-006) | Settled by the close-out, which deletes the folder they flag. ACK to household-terra |
| MSG-6620cbb7 GRANOLA-CAPTURED-SKIP (hnr.sop.main) | Already in the guild's parked ACQUIRE-ROUTE. Send an ACK to hnr.sop.main now; the answer follows when ACQUIRE-ROUTE is taken up |
| 92 runs in group `ki-project-ways-of-working` | All finished, none live. 34 of their temporary folders still hold files (54 MB). `ki agent close` needs every decision homed (CLOSE-WAIVER) |
| `ki-e2e` branch and worktree (2 ahead, `c8272712`) | Goes with E2E-ADOPT into APP-SKILLS; it stays until that is settled, and is then landed or removed by its run |
| `orca-adapter` branch and worktree (2 ahead, `ed8f62fa`) | Already the guild's under ORCA-HOME; ADAPTER-MERGE settles it |
| The older stale runs `ways-of-working-reg` and `ways-sol-resume-20261029` (CLOSE-BLOCKED) | Closed in the same step |

### 5. Close-out steps in order

1. **Guild decisions (needs Kris):** ABSORB-DROPS, CLOSE-WAIVER and Z-PUBLISHED below.
2. **Copy into the guild** (one harness run, after STAGE-C-ROLES): copy the 39 Move queries into guild `discussions.md` in full under their areas, without the eight duplicate one-liners; add the 24 Merge queries to their guild queries; move the six Kris-words entries and the pointers into the guild's `decisions.md`; move the five live notes into guild `skills/`; write the harvest items into `skills/harvest.md`.
3. **Send the route lines** (ki-principal and the receivers): the 27 Route lines and the four ACKs from section 4, one line each, each with its pinned links.
4. **Reconcile the decisions log** (a run in ki-principal): strike or point every entry as in section 2, recording each one's home or class with `ki agent reconcile` so that the close gate can pass.
5. **Resolve the notes and reports** in section 3: check each note against its home, pin the external links (CITED-NOTES-LINKED, HOST-SYNC-NOTES), and delete spent reports and briefs by explicit path.
6. **Finish:** clear ki.prj.ways-of-working's `discussions.md` and `messages.md`; set `state: finished`, routing its durable information; commit `docs(work): ki.prj.ways-of-working finish`. The [Project note](/Users/krisbrown/kis/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) goes from `active` to `completed`, its outcome pointing to ki.reg.guilds. This needs Kris's `finish` (rule 14 asks for it in substance; the standard asks for the word).
7. **Close the runs:** `ki agent close` for `ki-project-ways-of-working` and the two stale groups, under the strict gate.
8. **Delete the folder** at the closing mark: `docs(work): ki.prj.ways-of-working close-out`, in one commit by explicit path. Then send ki.sop.main one line to drop the package from its `covers` and the Model theme page.

## In Progress

Nothing is running.

Outstanding - no action requested now:

- The plan waits behind STAGE-C-ROLES, as the guild log orders.
- Four checks are left to the runs that carry out the plan: whether GRANOLA-COUNT has been delivered, whether PROTECTED-PUBLICATION is overtaken, whether the six Kris-words entries in section 2 are truly absent from the skills, and whether ANSWER-VECTOR is already with the Observatory.
- No confidence below high in this report has had a blind review; the guild should send CLOSE-WAIVER and Z-PUBLISHED to its next blind review before they reach Kris.

## Queries

### ABSORB-DROPS - Drop the 13 overtaken ways-of-working queries

**Context:** Of the 117 parked queries in ki.prj.ways-of-working, 13 no longer ask anything live. Seven are findings or duplicates in the folder being deleted (QUICK-FIXES, AGENDA-SHAPE, RECORD-2, FOLDER-1, COORD-7-REST, Z-FILES, Z-FILES-HOME). Two proposed their own closure and were reviewed at high confidence (PRINCIPAL-READOPT, PRINCIPAL-KIND-SIZE). SPLIT-COMMIT is history only. SWEEP-GATE guarded a rename sweep that has since run. PILOT-CONTRACT-LINE wanted checks added to a pilot that was answered on 1 November. PROTECTED-PUBLICATION protected a stack that has since been published, and is dropped only after one check. Every other query moves, merges, routes or is already settled, with no drop.

**Query:** May the guild drop these 13 and keep the rest as planned?

**Options:**

a) (recommended, confidence high - each is overtaken by something checked directly in this run, and Git keeps the text) Yes: drop all 13, recording each with its reason in the guild's decisions log.

b) Carry all 13 into the guild's Parked section too, and decide them later.

### CLOSE-WAIVER - How to close the 92 finished runs

**Context:** `ki agent close` retires the whole `ki-project-ways-of-working` run group, and passes only when every entry in the 1,313-line decisions log has a recorded home or class and the run folders are empty. 34 of those folders still hold files. The owner can waive the decisions check with `--reconciled`. On 1 November the recommended answer to CLOSE-GATE was to meet the gate rather than bypass it, and the standard says "keep the close gate strict with the reconciled waiver". About 85% of the entries can be recorded as struck or operational in bulk.

**Query:** Should the absorption meet the close gate entry by entry, or should Kris waive it?

**Options:**

a) (recommended, confidence medium - not blind-reviewed; it keeps the gate strict as Kris settled, though recording about 300 entries is a long run) Meet it: a reconcile run records a home or class for every entry, then closes the group under the strict gate.

b) Waive it: once the guild has moved the live entries, Kris authorises `--reconciled` for this group only.

### Z-PUBLISHED - The two Z reports are already public

**Context:** On 1 November, Z-FILES recommended keeping `reports/hold-request-20261030-z.md` and `reports/z-session-retirement-20261030.md` uncommitted until Kris said who the reports are for (PUBLIC-REPORT-AUDIENCE). Both were committed in ki-principal `7109c998` ("chore: baseline", 4 November) and are on `origin/main`, and ki-principal's `.ki.toml` declares it public. The retirement report describes private archives and recovery bundles by count; this run saw no secrets in it but did not judge its sensitivity. Rewriting published history needs a force-push, which no agent may do.

**Query:** What should happen to the two published Z reports?

**Options:**

a) (recommended, confidence medium - not blind-reviewed; it removes them from the current tree with the folder and touches no history, but nobody has judged how sensitive they are) Delete them with the folder at the close-out; Kris reads them once and says whether anything in history needs more than that.

b) Remove them now in their own commit, ahead of the close-out, and leave history as it is.

c) Leave them where they are until Kris has named the audience for public reports.

---

### 🤖 → 👤 Handoff to supervisor · at 02:44 GMT

👤 3 with you

- [with you] ABSORB-DROPS · owner · since 02:44
- [with you] CLOSE-WAIVER · owner · since 02:44
- [with you] Z-PUBLISHED · owner · since 02:44

🧵 ki.reg.guilds
