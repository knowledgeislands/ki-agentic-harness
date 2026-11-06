# [KI > Regular > Ways of working](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › message-backlog

**🤖 → 👤 Handoff to supervisor · Run report at 17:05 GMT · last mark none**

---

## Done

- Read-only stock-take of the guild backlog across every territory's work packages, the harness and the Personal pillars; nothing was changed, staged or committed, and no remote call was made.
- Read in full or by section: [ki.prj.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/work.md) (all five files, its 95 parked queries and its 3 November handover lines), [ki.sop.main](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/work.md) (all five files and its [packed queries](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/_emerging/packed-queries.md)), the Inbound sections of all 41 packages (480 lines), and the open query headings of every other package.
- Headline: about 60 items fall to the guild. Most sit in ki.prj.ways-of-working's parked queries, which nobody has asked since that work was put on hold on 3 November: State of play's consolidation on 6 November packed only its own 76 queries, not these. The others are seven lines in State of play's Inbound, two of State of play's open queries, and a group of harness asks queued on the paused Baseline rollout.
- Overlap found: [personal.reg.inbox-sol](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-sol/work.md) holds the `coordination` ⭐ and `method` focus areas under COORD-SOLE (5 November). Those focus areas cover the session-coordination spec, with 14 lines it will send once each part is agreed, and the scored planning method, whose stated end is "handed to Ways of working".

## In Progress

Nothing is running.

Outstanding - no action requested now:

- MSG-99cc0cec GUILD-OPEN and MSG-ec65a132 AGORA-WATCH still wait for their ACKs from ki.sop.main and ki.prj.agora.
- The role catalogue design is still with personal.reg.household-terra; its MSG-09e75f90 to ki.sop.main is also unACKed.
- Five IMPORTANT REFRESH lines (3 to 6 November) are unACKed in ki.prj.ways-of-working's Inbound. Under SOP-ACTS-FOR-IDLE that package is State of play's to ACK while it is held, and the lines are not guild work.
- The `orca-adapter` and `ki-e2e` branches are still checked out in harness worktrees. They belong to the worktree stock-take run, not to this one.

## Findings

### BACKLOG - Guild message and query backlog

**Goal:** list every pending message line, work item and open query across the territories that belongs to the guild remit, with a proposed disposition for each.

**Scope:** `+/_WORK/` in every Capital, the harnesses, the Personal pillars (inbox, dotfiles, Rig, Tower) and ki-agentic-harness. Covers Inbound lines, open and parked queries, and lines handed over but never visibly settled. Outbound lines already ACKed and REFRESH broadcasts from the method owner to other packages are left out, because they are rollouts the receivers must act on.

**As of:** 6 November 2026, 17:00 GMT; harness at `3ffd23bc`, ki-principal at `491f5c8b`.

Dispositions: **transfer** means it moves to ki.reg.ways-of-working; **leave** means it stays with the named owner; **done** means already delivered; **stale** means overtaken. HARNESS-SCOPE and the other tags refer to the queries below.

#### ki.prj.ways-of-working Inbound (on hold since 3 November)

| Package | Line or tag | Date | Gist | Disposition |
| --- | --- | --- | --- | --- |
| ki.prj.ways-of-working | MSG-19dc7d02 REFRESH `3ffd23bc` | 6 Nov | State of play acts for idle packages; role-glyph session names | leave - State of play ACKs for the held package |
| ki.prj.ways-of-working | MSG-d11b2698 REFRESH `db5dcab3` | 5 Nov | Inbound/Outbound sections, `_index.md`, trimmed banner | leave - as above |
| ki.prj.ways-of-working | REFRESH EMERGING-FOCUS `37b7b312` | 3 Nov | `aside` renamed `_emerging` | done - folder moved in `2a8711af` |
| ki.prj.ways-of-working | REFRESH MARK-STATUS `f85ce21a` | 3 Nov | Status table after mark | stale - replaced by SUMMARY-NOW |
| ki.prj.ways-of-working | REFRESH SUMMARY-NOW `d9dbdd9c` | 4 Nov | one Summary since the mark | leave - read on release |
| ki.prj.ways-of-working | MSG-b94130b1 HK-006 | 5 Nov | 1,307-line decisions log, spent briefs, 45 reports, `reports/` folder, 14 focus folders without `_index.md` | leave - package's own tidy, per WOW-RELATIONSHIP |
| ki.prj.ways-of-working | MSG-76265b12 HK-006 | 5 Nov | rollout reports link pruned records; KI-TOOL-RIG-CORE-056 has no local file | leave - as above |
| ki.prj.ways-of-working | MSG-6620cbb7 GRANOLA-CAPTURED-SKIP | 6 Nov | should `ki-acquire-granola` skip "Captured" meetings with no capture behind them? reply to hnr.sop.main | leave - acquisition owner, per ACQUIRE-ROUTE |

#### ki.prj.ways-of-working: lines handed to State of play at DRAIN-TO-SOP (3 November)

| Package | Line or tag | Date | Gist | Disposition |
| --- | --- | --- | --- | --- |
| ki.sop.main (carried) | FOOTER-GLYPHS | 2 Nov | new footer glyphs, focus line, identity line | stale - SYNC-LINE-OFF and NAME-GLYPH landed; the rest is in SoP's how-we-work design |
| ki.sop.main (carried) | THREAD-NAME | 2 Nov | role-glyph thread names | done - NAME-GLYPH, harness `3ffd23bc` |
| ki.sop.main (carried) | SUB-PACKAGE | 2 Nov | `<parent>.<focus>` sub-packages | done - tools-ki `997c6e80`, harness `2ce5e134` |
| ki.sop.main (carried) | FOOTER-CONFIRM | 3 Nov | one footer; sync-line wording | stale - sync line removed |
| ki.sop.main (carried) | AUDIT-FIXES | 3 Nov | triage 91 queries; drop `syncing_status`; close two terra runs; add `workers:` entry | transfer - query triage (TRANSFER-WOW-PARKED); `syncing_status` already gone; terra runs not checked |
| ki.sop.main (carried) | LISTEN-TRUTH | 3 Nov | set `listening_status: off` | done |
| ki.sop.main (carried) | LAYOUT-PILOT-PATH | 3 Nov | repoint two links to assistant-sol's pruned layout report | leave - still unrepointed (decisions line 1264, `package-layout/focus-layout.brief.md`); package tidy |
| ki.sop.main (carried) | RUN-CLOSE | 3 Nov | per-run close in `ki agent` | done - tools-ki `1237e1d8` |
| ki.sop.main (carried) | CLOSE-SPILL | 3 Nov | `ki agent close` checks blockers before moving reports | done, probably - landed with LAUNCHER-PATHS `03593db4`; reply sent to hnr.sop.main |
| ki.sop.main (carried) | SITE-LINT | 3 Nov | let a repository add its own exclusions to the house Markdown settings | transfer - no disposition found; harness template (HARNESS-SCOPE) |
| ki.sop.main (carried) | CHECK-CONSUMERS | 3 Nov | method lesson: list every consumer before retiring anything shared | transfer - no disposition found in KI; only homed in the chezmoi Cloudflare guide |
| ki.sop.main (carried) | ANNOTATED-BOARD-SKILL and addendum | 3 Nov | annotated design board in `ki-design-system` | done - harness `4721d886`; BOARD-CAPTURE sits in METHOD-BATCH |
| ki.sop.main (state) | HOLD-POINTERS | 3 Nov | harness CI `build` confirmations, GFM-HOSTING-RULES, GFM-CONVERTER, BURNDOWN-PUSH, PAPERCLIP-REQ | transfer the harness ones (CI confirmations, GFM-HOSTING-RULES, PAPERCLIP-REQ); leave GFM-CONVERTER and BURNDOWN-PUSH with ki.prj.tools-burndown; not verified in detail |

#### ki.prj.ways-of-working parked queries (all parked 3 November, unasked since)

| Package | Tag | Date | Gist | Disposition |
| --- | --- | --- | --- | --- |
| ki.prj.ways-of-working | IDEAS-REVISIT | ≤1 Nov | where a future idea lives | transfer - overlaps PERSONAL-ASSISTANT-KNW-005 and inbox-sol `method` |
| ki.prj.ways-of-working | HOOK-PATCH | ≤1 Nov | a leftover `.git/lint-staged/` patch is reported, never deleted | transfer |
| ki.prj.ways-of-working | SWEEP-GATE | ≤1 Nov | "both Macs level" before each rename sweep | stale - Agora keeps rigs level |
| ki.prj.ways-of-working | HOST-SYNC-CLOSE | 1 Nov | close HOST-SYNC as superseded | stale - close |
| ki.prj.ways-of-working | HOST-SYNC-NOTES | 1 Nov | delete six host-sync notes | leave - package tidy |
| ki.prj.ways-of-working | CITED-NOTES | 1 Nov | delete `coordination-lessons` and `method-feedback`, which harness skills cite | transfer - harness citations |
| ki.prj.ways-of-working | CITED-NOTES-LINKED | 1 Nov | delete three notes once links repaired | leave - package tidy |
| ki.prj.ways-of-working | OLD-PROPOSALS | 1 Nov | keep `agent-control-contract` as the accepted contract | transfer |
| ki.prj.ways-of-working | OLD-PROPOSALS-OWNED, OLD-PROPOSALS-IDEAS | 1 Nov | delete two notes; make two ideas | leave - package tidy |
| ki.prj.ways-of-working | TOPIC-SET | 1 Nov | 13 topic folders for the layout pilot | stale - focus-area layout and `_index.md` landed |
| ki.prj.ways-of-working | PILOT-CONTRACT-LINE | 1 Nov | extra pilot checks to Orca evaluation | stale - Orca evaluation held and closing via the Inbox |
| ki.prj.ways-of-working | SYNC-UNPUSHED-EXIT | 1 Nov | does an unpushed branch make sync fail? | leave - sync tooling owner |
| ki.prj.ways-of-working | CHECKSUMS-SETTLED | 1 Nov | CAPTURE-LEAN also settles checksums | leave - acquisition (ACQUIRE-ROUTE) |
| ki.prj.ways-of-working | OBS-FEEDBACK-LINE | 1 Nov | Observatory feedback as a message line | leave - ki.prj.observatory |
| ki.prj.ways-of-working | WP-HEARTBEAT | 1 Nov | Work Process note heartbeat paragraph vs quiet watcher | transfer |
| ki.prj.ways-of-working | RESTART-POLICY, RESTART-EVIDENCE | 1 Nov | how the two restart policies coexist; triggers as conventions | transfer |
| ki.prj.ways-of-working | SPLIT-COMMIT | 1 Nov | split published inside another session's commit | leave - package tidy, likely stale |
| ki.prj.ways-of-working | CLOSE-BLOCKED, CLOSE-GATE | 1 Nov | finished runs cannot close one at a time | stale - per-run close delivered |
| ki.prj.ways-of-working | AGENT-HOME-IDEA | 1 Nov | who writes the Techné dispatch `Idea:` line | leave - ki.sop.main |
| ki.prj.ways-of-working | ORCA-REACH-VEGA | 1 Nov | tell ki.prj.agent-host about the `vega` launcher | leave - ki.sop.main |
| ki.prj.ways-of-working | WIP-PACKAGE, WIP-TERRITORY | 1 Nov | work-in-progress limits per package and territory | transfer - overlaps inbox-sol `method` |
| ki.prj.ways-of-working | ROADMAP-UPCOMING, -HELD, -CAP | 1 Nov | soon/future/held records back to ideas; cap upcoming | transfer - as above |
| ki.prj.ways-of-working | GATES, GATES-SIZE | 1 Nov | two admission gates; small-only Gate 1 | transfer - as above |
| ki.prj.ways-of-working | PARKED-TO-IDEAS, PARKED-TO-IDEAS-MOVE | 1 Nov | sort parked queries into ideas and live decisions | transfer |
| ki.prj.ways-of-working | HOLD-CLOSE | 1 Nov | close packages held over 14 days | transfer - joins HOLD-STATES |
| ki.prj.ways-of-working | HOLD-ROUTE | 1 Nov | new messages to a held package go to State of play | done - SOP-ACTS-FOR-IDLE, harness `3ffd23bc` |
| ki.prj.ways-of-working | QUICK-FIXES | 1 Nov | remove eight duplicated parked entries | leave - package tidy |
| ki.prj.ways-of-working | QUICK-FIXES-LIFECYCLE | 1 Nov | nine Project pages' lifecycles | leave - ki.sop.main |
| ki.prj.ways-of-working | QUICK-FIXES-FOLDER | 1 Nov | close the Knowledge acquisition folder | leave - is SoP's KA-CLOSE |
| ki.prj.ways-of-working | DONE-PRUNE | 1 Nov | prune three finished harness records | transfer - harness records |
| ki.prj.ways-of-working | DONE-PRUNE-TOOLS-KI, DONE-PRUNE-OBSERVATORY | 1 Nov | prune finished tools-ki and Observatory records | leave - owning works |
| ki.prj.ways-of-working | PRINCIPAL-READOPT, PRINCIPAL-KIND-SIZE | 1 Nov | proposed closures as superseded | stale - close |
| ki.prj.ways-of-working | PERSONAL-KINDS | 1 Nov | four Personal records lack a kind | leave - personal.sop.main |
| ki.prj.ways-of-working | STREAMS-CHECKER-GAP | 1 Nov | Streams checker cannot see migrated fields | transfer - harness checker (HARNESS-SCOPE) |
| ki.prj.ways-of-working | Z-FILES, Z-FILES-HOME | 1-2 Nov | two uncommitted Z session files | leave - package tidy |
| ki.prj.ways-of-working | SWEEP-NOTE-LINKS | 1 Nov | tell two records where `roadmap-sweep` went | leave - ki.sop.main |
| ki.prj.ways-of-working | PAPERCLIP-RETIRE, PAPERCLIP-GRANT | 1 Nov | Paperclip skill and 54 declarations; suspend standing grant | transfer - delegation skill; Paperclip retired 31 Oct |
| ki.prj.ways-of-working | AGENDA-SHAPE | ≤1 Nov | AGENDA block in `queries.md` | stale - five-file package has no `queries.md` |
| ki.prj.ways-of-working | DUE-FIELD | ≤1 Nov | optional `due:` on roadmap records | transfer - work-record method |
| ki.prj.ways-of-working | ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE | ≤1 Nov | Acquire wording and design note | leave - acquisition (ACQUIRE-ROUTE) |
| ki.prj.ways-of-working | HNR-OFFLINE, HNR-MJS, HNR-PROOF, HNR-TOOLROOT, HNR-SITE-SHAPE, HNR-DR-LINKS | ≤1 Nov | HNR conform conflicts with engineering, website and decision-record rules | HARNESS-SCOPE |
| ki.prj.ways-of-working | HNR-CAP | ≤1 Nov | COORD-3 cap check reads a recorded cap raise | transfer - `ki-coordination` audit |
| ki.prj.ways-of-working | HNR-EMPTY-PROJECT | ≤1 Nov | empty Product Project warning reads work packages | transfer - work-package check |
| ki.prj.ways-of-working | ACQUISITION-PROCESS-APPROVE | ≤1 Nov | enact the revised Acquisition Process note | leave - acquisition (ACQUIRE-ROUTE) |
| ki.prj.ways-of-working | ORCA-SKILL-KIND, CLOSEOUT-STRIKE, ONE-LAUNCHER, ONE-LAUNCHER-UNIT, OUTLIVE, PROMPT-RENDER, HEARTBEAT-ACK, STOP-VERB, RUN-RECOVERY, QUEUE-PACE, REPORT-HOME, WORKER-SURVIVAL, DELIVERY-REPLAY, RUN-HANDOVER, OWNER-ASK, ADAPTER-MERGE | 1 Nov | Orca adapter (`ki-delegation-orca`) rules, trials and the unmerged `orca-adapter` branch | transfer - per ORCA-HOME |
| ki.prj.ways-of-working | ORCA-CODEX-WAKE | 1 Nov | proposed closure | stale - close |
| ki.prj.ways-of-working | GIT-REBASE | ≤2 Nov | runs may rebase their own unpublished commits in a private worktree | transfer - `ki-git`, `ki-delegation` |
| ki.prj.ways-of-working | AUTOSTASH-LEFTOVER | ≤2 Nov | automatic stash left in the assistant repository | leave - Inbox; GITCONFIG-AUTOSTASH with ki.sop.main |
| ki.prj.ways-of-working | OPTION-CONFIDENCE | ≤2 Nov | every option carries its own confidence | transfer |
| ki.prj.ways-of-working | E2E-ADOPT, E2E-KIND, E2E-OFFRAMP, E2E-HELPERS | ≤2 Nov | land the `ki-e2e` branch and its shape | HARNESS-SCOPE |
| ki.prj.ways-of-working | DRYRUN-SCOPE | 2 Nov | which commands dry-run by default | HARNESS-SCOPE |
| ki.prj.ways-of-working | FOCUS-SLOT-OWNER | 2 Nov | message line `focus:` names sender's or receiver's area | transfer |
| ki.prj.ways-of-working | FOCUS-TOP | 2 Nov | household-sol's Focus section above Goals | transfer |
| ki.prj.ways-of-working | GRANOLA-COUNT | 2 Nov | screenshot check now Granola gives only attachment count | leave - acquisition (ACQUIRE-ROUTE) |
| ki.prj.ways-of-working | TERRA-LOCAL-REPORTS, TERRA-PR-CHECK, TERRA-RECOVERY | ≤30 Oct | terra-only reports, PR inventory, private recovery location | leave - package's held publication recovery |
| ki.prj.ways-of-working | RIG-ATTENDED | 27 Oct | attended Rig prerequisites | leave - tools-rig |
| ki.prj.ways-of-working | ANSWER-VECTOR | ≤30 Oct | Observatory writes answer line, or waits for `ki work answer` | leave - ki.prj.observatory and tools-ki |
| ki.prj.ways-of-working | AREA-COLUMN | ≤30 Oct | publish the area reading aid in the harness README | HARNESS-SCOPE |
| ki.prj.ways-of-working | HOST-SYNC | ≤30 Oct | two-host synchronisation design | stale - Agora keeps rigs level |
| ki.prj.ways-of-working | STREAM9-SHA, GATE-BASELINE-COMPARATOR, LINK-EXTERNAL | ≤30 Oct | harness checker boundaries | HARNESS-SCOPE |
| ki.prj.ways-of-working | THREAD-DEFAULTS | ≤30 Oct | how a session selects its work and default home | transfer |
| ki.prj.ways-of-working | PUSH-RETRY | ≤30 Oct | bounded retry for a queue append losing a push race | transfer |
| ki.prj.ways-of-working | HOMES, EXECUTION, HOST, DISPLAY, THEME, ROUTING, SIGNAL, RESTART | ≤30 Oct | work-package definition fields (package-definition freshness design) | transfer |

#### ki.sop.main Inbound and queries

| Package | Line or tag | Date | Gist | Disposition |
| --- | --- | --- | --- | --- |
| ki.sop.main | MSG-09e75f90 ROLE-CATALOGUE | 6 Nov | a role catalogue: name, purpose, authority, tier; `role` field replaces `workers:` | transfer - unACKed |
| ki.sop.main | MSG-0853cd4c LINT-BEFORE-PUSH | 6 Nov | run repository checks before committing; refused commit is a failure; clean status before push | transfer |
| ki.sop.main | MSG-0cf5c6ff SKILL-SPECS | 6 Nov | skills are the home of reusable knowledge; RFC-style specifications | transfer |
| ki.sop.main | MSG-d80879a3 SKILLS-OVER-GRAPH | 6 Nov | four new skills; `specs-` reference kind and `ki-specs` rethink | transfer part (4); leave (1)-(3) with SoP's SKILLS-OVER-GRAPH query |
| ki.sop.main | MSG-7c61ab43 HOLD-TIDY | 4 Nov | tidy before hold; audit fails an untidy held package | transfer - with HOLD-STATES |
| ki.sop.main | ATER-025 and MSG-107f13ae | 5-6 Nov | PERSONAL-ASSISTANT-KNW-004, -005, -010 now SoP's; Inbox pruning them | transfer KNW-005 (ideas and work-in-progress reset, for the Work Process); leave KNW-004 and -010 with the knowledge plan |
| ki.sop.main | ATER-014, ATER-011 | 5 Nov | knowledge cards pull; Stoa icon names | leave - knowledge plan |
| ki.sop.main | MSG-99cc0cec GUILD-OPEN | 6 Nov | guild open; route guild lines here | leave - ours, awaiting ACK |
| ki.sop.main | MSG-d9280f4d AWAY-UNTIL-0800, MSG-a171521d, MSG-00cdf195 | 6 Nov | away window; Agora call path; health | stale or leave - State of play's own |
| ki.sop.main | MSG-7ab0b624 MAIL-GAPS; GRANOLA-MARK-FAULTS | 4-6 Nov | mail server gaps; tools-ki Granola marking | leave - mail owner; ki.prj.tools-burndown |
| ki.sop.main | STOA-* (eleven lines), MSG-d7d46e9f, MSG-d56132fe | 1-6 Nov | Stoa asks and release | leave - Stoa work |
| ki.sop.main | HOLD-STATES (query) | 6 Nov | seven hold-state choices plus HOLD-TIDY, one run | transfer the landing run; answer where it stands (TRANSFER-SOP-QUERIES) |
| ki.sop.main | METHOD-BATCH (query) | 6 Nov | fifteen method choices, one harness run | transfer the landing run; as above |
| ki.sop.main | SKILLS-OVER-GRAPH (query) | 6 Nov | where four skills land | leave - but part (4) comes here |
| ki.sop.main | OTHER-TERRITORIES (query) | 6 Nov | BASELINE part adopts the Capital baseline "through ki.prj.ways-of-working" | leave - redirect its BASELINE carrier here if taken |
| ki.sop.main | TIDY-UPS (query) | 6 Nov | BRANCH-SWEEP, UNMERGED-STRAYS, PRE-REBASE-REF touch harness branches | leave - overlaps the guild's worktree run; agree who acts |
| ki.sop.main | SKILL-HOMES (query) | 6 Nov | new `ki-exchange-dynamics` harness skill; two acquisition items to ki.reg.main | leave - build comes here only under HARNESS-SCOPE b) |
| ki.sop.main | GRANOLA, WATCH-AGORA, RESUME-SPECS, CHEZMOI-HANDOVER, STOA-PROJECT, RIG-LANE, MAIL-OWNER, KNOWLEDGE-PLAN, ACCEPTANCE, CHAIN-START-FIRST, SANCTUARY-STAGE5, RESOURCES-IN (queries) | 6 Nov | territory, tools and acquisition decisions | leave |

#### Other packages

| Package | Line or tag | Date | Gist | Disposition |
| --- | --- | --- | --- | --- |
| ki.prj.baseline-rollout (paused) | HARNESS-DEFECTS | 25 Oct | DESIGN-2 accepts only Vitest proof; SCR-5 sets `core.hooksPath` unconditionally; root orientation in `AGENTS.md`; WEB-14 | HARNESS-SCOPE |
| ki.prj.baseline-rollout | HARNESS-FEEDBACK, HARNESS-FEEDBACK-2 | 25 Oct | Valle Armonia's harness findings; `ki-repo` thin-`CLAUDE.md` rule against `ki-repo-kb`'s memory anchor | HARNESS-SCOPE - repository instruction files lean guild |
| ki.prj.baseline-rollout | WEBSITE-SKILL, PRODUCT-RECORDS | 25 Oct | `ki-repo-website-*` changes; harness records | HARNESS-SCOPE |
| ki.prj.baseline-rollout | REPO-METADATA, REPO-CODE-CAP | 25 Oct | repository-metadata standard and checker; 24-character code limit in `ki-repo` | HARNESS-SCOPE |
| ki.prj.baseline-rollout | SITE-STD-GAPS, SPA-FALLBACK-SCOPE | 27-28 Oct | website standard gaps; 404 fallback | leave - website standard owner |
| ki.prj.baseline-rollout | TYPED-ID-ROLLOUT | 28 Oct | coordinate typed-id rollout to HNR and other territories | transfer - work-method rollout |
| ki.prj.orca-evaluation (held) | SCOPE-SPLIT (query) | ≤3 Nov | hand four method questions and ORCA-FIT choices to "Ways of working" | transfer - per ORCA-HOME |
| ki.prj.agora | MARK-WORDS (query) | 6 Nov | does the `mark` broadcast carry Kris's own words | leave - Agora's broadcast |
| ki.prj.tools-burndown | HOOK-PAYLOAD | 24 Oct | harness hook payload delivery through `ki` | leave - tools-ki, with harness contract |
| personal.reg.inbox-sol | `coordination` and `method` focus areas | 4-6 Nov | session-coordination spec (14 lines to send, mostly to ki.sop.main) and scored planning method | leave for now - per COORD-OVERLAP |
| personal.reg.household-terra | ROLE-CATALOGUE design | 6 Nov | the role catalogue's starting design | leave - the guild takes it when it lands |

## Queries

### WOW-RELATIONSHIP - How the Ways of working Project relates to the new guild

**Context:** [ki.prj.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/work.md) is a Project in Knowledge Islands Principal. Its remit is the work model, the work package, coordination, delegation and their rollout, which is the same ground as [ki.reg.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md)'s skills focus. The new package adds the role catalogue and guild management. The Project has been on hold since you drained it to State of play on 3 November ("move all of the work to be coordinated through the SOP main"). It holds 95 parked queries, about 60 of them in the guild remit, and 14 focus folders of design notes and reports. Its own goal already said that method stewardship passes on once the method is defined (WOW-REFRESH, STEWARD-HOME). Keeping both alive means two homes for the same method.

**Query:** Should the guild take over the Project's live remit, with the Project closed once what it holds has homes?

**Options:**

a) (recommended, confidence medium - the remits coincide and the Project's own goal anticipated the hand-on; unreviewed) Yes. Transfer the guild-remit queries and live design notes to ki.reg.ways-of-working, leave its territory and tools items with their owners, let it tidy and close through the normal finished close-out, and mark the [Ways of working Project](/Users/krisbrown/kis/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) as handed to the regular work.

b) Keep the Project on hold as the design home for large method changes, with the guild only maintaining the skills and the role catalogue.

c) Reopen the Project and treat the guild as its harness-side worker.

### TRANSFER-SOP-INBOUND - Route seven State of play Inbound lines to the guild

**Context:** Before the guild opened, these went to [ki.sop.main](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/messages.md) as the method's interim steward. They are ROLE-CATALOGUE (MSG-09e75f90), LINT-BEFORE-PUSH (MSG-0853cd4c), SKILL-SPECS (MSG-0cf5c6ff), HOLD-TIDY (MSG-7c61ab43), part (4) of SKILLS-OVER-GRAPH (a `specs-` reference kind and the `ki-specs` rethink), the PERSONAL-ASSISTANT-KNW-005 part of ATER-025 (where ideas live and the work-in-progress reset), and two lines from the 3 November handover with no disposition found, SITE-LINT and CHECK-CONSUMERS. Your GUILD-OPEN word gives the guild all guild-management work, and State of play keeps routing authority.

**Query:** Should State of play route these lines to ki.reg.ways-of-working's Inbound?

**Options:**

a) (recommended, confidence high - each is method or skill design, which GUILD-OPEN gives to the guild; routing is State of play's existing authority and is easily reversed) Yes. State of play ACKs each line where it sits and routes it here; the guild takes it into `roles`, `skills` or `_emerging`.

b) Leave them with State of play until the role catalogue lands, then route.

### TRANSFER-SOP-QUERIES - HOLD-STATES and METHOD-BATCH

**Context:** State of play's consolidated set for your return holds two method bundles, both recommended at high after review. [HOLD-STATES](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/discussions.md) covers seven hold-state choices plus HOLD-TIDY, and METHOD-BATCH covers fifteen method choices with an ADR-007 update. Each plans one harness run that changes the coordination and work-package standards, which is now guild ground. Moving the queries themselves would mean asking them again.

**Query:** Should you answer them where they are, with the run that lands them launched by the guild?

**Options:**

a) (recommended, confidence medium - avoids asking twice while putting the harness change with its new owner; unreviewed) Yes. You answer them in State of play's pass; State of play sends each answer to the guild as a message line, and the guild lands it in the harness with the design notes as its brief.

b) Move both queries and their two design notes into the guild package now, and ask them there.

c) Leave both, including the landing run, with State of play.

### TRANSFER-WOW-PARKED - The Project's parked method queries

**Context:** The Project's 95 parked queries were never packed into State of play's consolidated set. About 60 fall to the guild: standards wording (HOOK-PATCH, WP-HEARTBEAT, RESTART-POLICY, RESTART-EVIDENCE, OPTION-CONFIDENCE, GIT-REBASE, PUSH-RETRY, FOCUS-SLOT-OWNER, FOCUS-TOP), flow and work in progress (WIP-PACKAGE, WIP-TERRITORY, GATES, GATES-SIZE, ROADMAP-UPCOMING and its two parts, PARKED-TO-IDEAS and its part, HOLD-CLOSE, IDEAS-REVISIT, DUE-FIELD), the package-definition fields (HOMES, EXECUTION, HOST, DISPLAY, THEME, ROUTING, SIGNAL, RESTART, THREAD-DEFAULTS), Paperclip (PAPERCLIP-RETIRE, PAPERCLIP-GRANT), harness checks (HNR-CAP, HNR-EMPTY-PROJECT, CITED-NOTES, DONE-PRUNE, OLD-PROPOSALS) and the Orca adapter group (ORCA-HOME). About ten are stale, for example HOLD-ROUTE, which SOP-ACTS-FOR-IDLE now covers. The rest belong to State of play, tools-ki, the Observatory, Rig or acquisition. An audit on 3 November already flagged 91 open queries against a warning level of eight.

**Query:** Should the guild take the guild-remit queries and triage them before anything reaches you?

**Options:**

a) (recommended, confidence medium - most were recommended before 3 November, but the method has moved since, so a triage pass avoids re-asking stale ones; unreviewed) Yes. The guild copies them in, drops each stale one with its evidence in the decisions log, re-checks the rest against the current method, packs them into a few bundles and blind-reviews the medium ones before they reach you. State of play sends each non-guild item to its owner.

b) Transfer them as they stand and take them one at a time in an interactive pass.

c) Leave them parked with the Project until it is reopened or closed.

### HARNESS-SCOPE - Does the guild take every harness change, or only the ways-of-working skills?

**Context:** ki.reg.ways-of-working lives in ki-agentic-harness. Its work page says it keeps "the skills ... that capture how we work" and the harness's worktrees and branches. Many open harness asks concern engineering, website and repository skills instead: the HNR conform conflicts (HNR-OFFLINE, HNR-MJS, HNR-PROOF, HNR-TOOLROOT, HNR-SITE-SHAPE, HNR-DR-LINKS), the unmerged `ki-e2e` branch (E2E-ADOPT, E2E-KIND, E2E-OFFRAMP, E2E-HELPERS), DRYRUN-SCOPE, AREA-COLUMN, STREAMS-CHECKER-GAP, STREAM9-SHA, GATE-BASELINE-COMPARATOR, LINK-EXTERNAL, SITE-LINT, and the Baseline rollout lines HARNESS-DEFECTS, HARNESS-FEEDBACK, HARNESS-FEEDBACK-2, WEBSITE-SKILL, PRODUCT-RECORDS, REPO-METADATA and REPO-CODE-CAP. Their natural carrier, [ki.prj.baseline-rollout](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.baseline-rollout/work.md), is paused, so nobody acts on them.

**Query:** Should the guild steward every ki-agentic-harness change, not only the ways-of-working skills?

**Options:**

a) (recommended, confidence medium - the harness has no other active steward, and the guild already holds its branches; this widens the work page beyond "how we work"; unreviewed) Yes. The guild adds a `harness` focus area for engineering, website and repository skill asks, kept apart from `skills`, and its work page says so.

b) No. The guild keeps to ways-of-working skills and roles; the other asks stay with ki.prj.baseline-rollout until you resume it, or go to ki.reg.main as ad hoc work.

### ORCA-HOME - Who holds the Orca adapter's rules

**Context:** Sixteen parked queries settle the `ki-delegation-orca` adapter's rules and trials and the unmerged `orca-adapter` branch in the harness (ORCA-SKILL-KIND, CLOSEOUT-STRIKE, ONE-LAUNCHER, ONE-LAUNCHER-UNIT, OUTLIVE, PROMPT-RENDER, HEARTBEAT-ACK, STOP-VERB, RUN-RECOVERY, QUEUE-PACE, REPORT-HOME, WORKER-SURVIVAL, DELIVERY-REPLAY, RUN-HANDOVER, OWNER-ASK, ADAPTER-MERGE). The held [ki.prj.orca-evaluation](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.orca-evaluation/work.md) also proposes, as SCOPE-SPLIT, handing its four method questions to "Ways of working". Meanwhile State of play's ORCA-CLOSE-HOME would give that Project's five questions and two notes to the Inbox, and inbox-sol's coordination spec plans runs as Orca workers (its Q17).

**Query:** Should the adapter's rules and branch come to the guild, while Orca usage evidence and upstream feedback go to the Inbox?

**Options:**

a) (recommended, confidence medium - the adapter is a delegation skill in the harness, while trial evidence and upstream feedback are about using Orca; unreviewed) Yes. The guild takes the sixteen adapter queries, SCOPE-SPLIT's four method questions and the `orca-adapter` branch; the Inbox takes Orca usage and upstream feedback under ORCA-CLOSE-HOME.

b) Send everything Orca-related to the Inbox, including the adapter.

c) Drop the adapter for now, because Agora now does the waking, and close the sixteen as no longer needed.

### COORD-OVERLAP - The Inbox's coordination and method focus areas

**Context:** Under COORD-SOLE (5 November), [personal.reg.inbox-sol](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-sol/coordination/_index.md) alone holds coordination and communication: a session-coordination spec built with you part by part, with about ten open questions and 14 lines it will send once each part is agreed, most of them to ki.sop.main. It also holds the scored planning method, which it says is "done when ... handed to Ways of working". Both reach into `ki-coordination`, `ki-trades` and the work model, which the guild now keeps.

**Query:** Should the Inbox keep designing these with you, sending what is agreed to the guild instead of State of play?

**Options:**

a) (recommended, confidence medium - keeps the live design conversation where it is, while the guild lands the agreed parts in the skills; unreviewed) Yes. The guild sends inbox-sol one line asking it to address its agreed coordination and method sends to ki.reg.ways-of-working, and to hand the planning method here when it is done.

b) Move the `coordination` and `method` focus areas into the guild now.

c) Leave it as it is, with State of play routing each send on.

### ACQUIRE-ROUTE - Acquisition items are not guild work

**Context:** Several items concern acquisition skills rather than how we work: GRANOLA-CAPTURED-SKIP (MSG-6620cbb7, from hnr.sop.main, which wants a reply), GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE and ACQUISITION-PROCESS-APPROVE. [ki.prj.knowledge-acquisition](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.knowledge-acquisition/work.md) is finished, acquisition now runs through the Inbox's `ki-muninn`, and State of play's SKILL-HOMES recommends sending harness acquisition items to ki.reg.main.

**Query:** Should State of play send these to ki.reg.main, with the Inbox consulted on the Granola ones?

**Options:**

a) (recommended, confidence medium - consistent with SKILL-HOMES; leaves the guild to method and roles; unreviewed) Yes. State of play routes them to ki.reg.main, and the Granola reply goes to hnr.sop.main from there.

b) The guild takes them under HARNESS-SCOPE b), because the acquisition skills live in the harness.

### 🤖 → 👤 Handoff to supervisor · since 17:05 GMT

👤 8 with you

- [with you] WOW-RELATIONSHIP · owner · since 17:05
- [with you] TRANSFER-SOP-INBOUND · owner · since 17:05
- [with you] TRANSFER-SOP-QUERIES · owner · since 17:05
- [with you] TRANSFER-WOW-PARKED · owner · since 17:05
- [with you] HARNESS-SCOPE · owner · since 17:05
- [with you] ORCA-HOME · owner · since 17:05
- [with you] COORD-OVERLAP · owner · since 17:05
- [with you] ACQUIRE-ROUTE · owner · since 17:05

🧵 ki.reg.ways-of-working
