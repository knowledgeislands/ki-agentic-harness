# [KI > Regular > Ways of working](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › guild-plan

**🤖 → 👤 Handoff to supervisor · Run report at 18:50 GMT · last mark none**

---

## Done

- Read the [role catalogue brief](/Users/krisbrown/.local/share/chezmoi/+/_WORK/personal.reg.household-terra/housekeeping/role-catalogue.brief.md) in full at dotfiles `2fe13be`, and its draft at `4b38bab`, which shows that rules 12, 13 and 14 were the draft's open R13, R19 and R20, each settled on household-terra's recommended option a).
- Read this package's five files and four reports, [ki.prj.ways-of-working](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/work.md)'s `work.md`, `state.md` and `messages.md`, and the `ki-work-package` and `ki-coordination` standards at harness `71e06594`. I checked the touch points on sol read-only: ki.sop.main's `covers`, sol's Agora config, Agora's `call/` folder, the run group's `thread.json`, `subagents/` and every `workers:` block.
- Changed nothing and made no commit. No remote call.

### 1. What the brief settles

The brief says: "Everything under "Decided" is Kris's word; nothing is left open."

- **Prime directive.** Kris: this is to be "considered and baked into what we do as a prime directive", and "more of the Knowledge Islands principle is to be captured in skills". "Kris's word for this is **ethical**: ethical guilds, as distinct from guilds." The four parts, each of which "has to be visible in the skills", are radical simplicity, external accountability, open entry and purpose review.
- **Terms.** Territory, Package, Seat ("addressed `package+role` such as `ki.prj.agora+illustrator` ... its folder is a sibling, `+/_WORK/ki.prj.agora+illustrator/`, never a subfolder, and lives and dies with its package"), Tier, Role, Pack ("A seat's own subagents; private, never in Agora"), Guild ("A set of skills, such as change management, kept by the guildmaster") and Library ("The knowledge base, kept by the librarian").
- **Tiers and roles.** Leaders are governor and councillor. Managers are warden, steward, housekeeper, gatekeeper ("replaces assistant; owns what comes in and goes out"), librarian and guildmaster, with "chancellor (over several libraries), a guildmaster per guild" reserved. Makers are journeyman, illustrator and architect. "Paperclip-era role names are deleted (no confirmation needed). Rename the capture skill's "assistant" to match gatekeeper."
- **Rules 1 to 11.** These cover the Agora gate, availability before work, admission one tier up with a 75% quorum and a window of "about two hours" before it goes to Kris, authority by tier, seats created and torn down by the primary seat, incremental naming, separate web-address parameters, "One ratification round for today's members", ownership "as skills (a skill's standard, terminology first), not separate specs", "One library, `ki.reg.library`", and role definitions "in the harness beside `subagents/`" with a `role` field that "replaces the unofficial `workers:` block in state.md".
- **Rule 12 (R13).** "No governor outranks another; ki.sop.main's governor only convenes and records."
- **Rule 13 (R19).** "The guildmaster's package is renamed from `ki.reg.ways-of-working` to `ki.reg.guilds`, seat `ki.reg.guilds+guildmaster`, as its first job."
- **Rule 14 (R20).** "`ki.reg.guilds` absorbs `ki.prj.ways-of-working` in ki-principal (its unread messages and focus areas) and closes it, so one package owns the method."

**What the brief leaves open.** These are the mechanics behind its words, not new choices of direction:

- **Who closes the Project.** The standard lets only a State of play become a package's assigned steward. Only a folder's own work, or territory work for a finished folder, may delete it. Rule 14 gives the closing to the guild. This is ABSORB-STEWARD below.
- **Seats and sub-packages.** A seat folder "lives and dies with its package", which is the sub-package's job under SUB-PACKAGE of 2 November. This is SEATS-VS-SUBPACKAGES below.
- **The `+` sign.** Ids allow only `[a-z0-9-]`, and the slug alphabet that `ki agent` accepts is `[A-Za-z0-9_-]`. Neither accepts `+`, so the seat address needs a folder, slug and state-folder mapping. This is guild design work, sent to tools-ki, and does not need Kris.
- **Which "assistant" is meant.** The brief does not say which skill "the capture skill" is. TOOLING-STAYS (1 November) kept `ki-acquire`'s names. This is CAPTURE-ASSISTANT below.
- **How far the Paperclip deletion reaches.** The four 26 September "coordination lane" subagents are `ki-convenor`, `ki-ferryman`, `ki-steward` and `ki-wright`. AGENTS.md's Paperclip section carries a Convenor merge grant. This is PAPERCLIP-NAMES below.
- **When `ki.reg.library` opens, and where.** No such package exists yet. This is LIBRARY-OPEN below.
- **Where the `role` field goes.** The brief says "the package's `role` field" but not which file holds it. `work.md` front matter fits a stable definition. This is a guild design choice.
- **Sequencing.** The brief does not order the ratification round, the Agora gate and the catalogue's publication.

### 2. The twelve open queries

| Query | Status | Basis |
| --- | --- | --- |
| RIG-SPENT | Still open | The brief is silent on worktrees |
| LANDED-COPIES | Still open | As above |
| SUPERSEDED-FIXES | Still open | As above |
| DRAFT-SKILLS | Still open | As above. ORCA-HOME bears on `orca-adapter` |
| OLD-DIAGRAMS | Still open | As above |
| WOW-RELATIONSHIP | Answered, a) | Rule 14: "`ki.reg.guilds` absorbs `ki.prj.ways-of-working` ... and closes it, so one package owns the method". Options b) and c) are excluded |
| TRANSFER-SOP-QUERIES | Changed, still open | Rule 14's "one package owns the method" and rule 12's "only convenes and records" remove a) and c)'s basis. HOLD-STATES and METHOD-BATCH are unanswered, so moving them asks nothing twice. Refreshed below |
| TRANSFER-WOW-PARKED | Answered, a) | Rule 14 brings the Project's "unread messages and focus areas" here, which excludes c). Rule 4, "managers act within standing grants and take exceptions up", supports triage here before anything reaches Kris |
| HARNESS-SCOPE | Changed, still open | The term "A set of skills, such as change management, kept by the guildmaster", with "a guildmaster per guild" reserved, means today's one guildmaster keeps every skill set until work calls for another. That overturns the reviewed a). Refreshed below |
| ORCA-HOME | Still open | The brief is silent. Its Pack term ("never in Agora") is compatible with either option |
| COORD-OVERLAP | Still open, a) strengthened | "so one package owns the method" makes the guild the right addressee for inbox-sol's agreed sends |
| ACQUIRE-ROUTE | Still open, follows HARNESS-SCOPE | Under HARNESS-SCOPE a) below, acquisition is a guild here, so ACQUIRE-ROUTE b) applies. Under b), a) stands |

The four still-open worktree queries, ORCA-HOME, COORD-OVERLAP and ACQUIRE-ROUTE stand in `discussions.md` as written. They are not repeated below.

### 3. Staged plan

**Stage A - Rename to `ki.reg.guilds`.** Repository: ki-agentic-harness, plus one line each to ki-principal and dotfiles. Authority: rule 13, "renamed ... as its first job". Size: S. It waits on nothing, though doing it before Stage B means every transfer lands at the new id. The `ki-coordination` naming rule applies: "every derived name changes in the same commit". The touch points are:

1. **Folder:** `git mv +/_WORK/ki.reg.ways-of-working +/_WORK/ki.reg.guilds`.
2. **Ids:** the `id` and H1 in all five files. The title becomes `KI > Guilds`, the ad hoc title form. Replace "the enabler tier" with "the manager tier" in the description and Goals, because the brief has no enabler tier. Add the missing `Home: ki-agentic-harness` line to Scope, since the standard requires one for a member-homed regular package. Record the rename in `decisions.md`, citing rule 13.
3. **Run home binding:** `ki agent home wow-open --work ki.reg.guilds --repo <harness>` rewrites `wow-open/thread.json`. The run group's name and the run tokens stay, as the slug rule requires. A future coordinator state folder is `ki-reg-guilds`.
4. **Agora watch list.** Sol's `~/.config/agora/config.toml` does not yet watch this package, and AGORA-WATCH-WOW is not in sol's checkout of household-sol. Send one line to personal.reg.household-sol replacing AGORA-WATCH-WOW: watch `ki.reg.guilds` in `~/kis/knowledge-islands/ki-agentic-harness`. Agora's call then lands at `~/.local/state/ki/agora/call/ki.reg.guilds`. Ask ki.prj.agora whether terra watches it too.
5. **ki.sop.main routing.** Send one line asking it to: add `ki.reg.guilds` to `covers` with its member home in Scope, which is absent today; read GUILD-ROUTE (MSG-958bb583, still awaiting ACK) as addressed to `ki.reg.guilds`, dropping the withdrawn MSG-09e75f90; route method lines here rather than to ki.prj.ways-of-working; and change its description, which still says "method design itself (ki.prj.ways-of-working)" and "routing method changes to ki.prj.ways-of-working while it exists (STEWARD-HOME)". The State of play edits its own files.
6. **Links:** repoint this package's own links. Send household-terra a line to update its housekeeping `_index.md` and MSG-0624c1a4 references. Old message lines naming `ki.reg.ways-of-working` stay readable as history.
7. **Session:** the next bootstrap carries `Rename thread: /rename 🧵 ki.reg.guilds`, and a restart is suggested because the id changed.

**Stage B - Absorb ki.prj.ways-of-working.** Repositories: ki-principal for the Project's package and the Project note, and ki-agentic-harness for the receiving side. Authority: rule 14, "absorbs ... (its unread messages and focus areas) and closes it". The executor's route is missing; see ABSORB-STEWARD. Size: L, mostly because a 1,307-line decisions log must be homed before close-out. It waits on Stage A and ABSORB-STEWARD. The transfer list:

1. **The seven Inbound lines.** The five REFRESH lines (`3ffd23bc`, `db5dcab3`, EMERGING-FOCUS, MARK-STATUS, SUMMARY-NOW) are spent with the folder, because the guild is already at `3ffd23bc`. The two HK-006 tidy lines (MSG-b94130b1 and MSG-76265b12) are done by the close-out itself. MSG-6620cbb7 GRANOLA-CAPTURED-SKIP goes under ACQUIRE-ROUTE, and its reply goes to hnr.sop.main.
2. **The parked queries,** about 95. About 60 guild-remit queries are copied in whole: the standards wording, flow, package-definition fields, Paperclip, harness checks and Orca groups the message-backlog report lists. About 10 stale ones are dropped with their evidence in the guild's log, among them HOLD-ROUTE, SWEEP-GATE, HOST-SYNC, HOST-SYNC-CLOSE, TOPIC-SET, AGENDA-SHAPE, CLOSE-BLOCKED, CLOSE-GATE, ORCA-CODEX-WAKE and PRINCIPAL-READOPT. The rest go by one line each to their owners: ki.sop.main, ki.prj.tools-burndown, ki.prj.observatory, tools-rig and acquisition.
3. **The focus folders.** Live design notes come into matching guild focus areas. `_emerging` holds `agent-control-contract.md`, which OLD-PROPOSALS keeps as the accepted contract, `coordination-lessons.md` and `method-feedback.md` (both cited by harness skills, so their content moves before any deletion), plus `tending.md`, `overload-process.md` and `finish-line-plan.md`. `package-layout`, `work-model`, `discussions` and `orca-subagents` also carry notes. Spent briefs and homed reports are deleted. The Project's 14 focus areas come down to the few the guild needs: `roles`, `skills` and `method`, which is new and takes the work-model and package-layout notes.
4. **Decisions.** Each still-governing entry goes to its skill or to a one-line pointer in the guild's log. The rest are struck. The Held items in `state.md`, publication recovery and preserved refs, need an owner. HOLD-POINTERS, carried by ki.sop.main, sends its harness items (CI confirmations, GFM-HOSTING-RULES, PAPERCLIP-REQ) here.
5. **Close-out.** Set `state: finished` and commit `docs(work): ki.prj.ways-of-working finish`. Run `ki agent close` on the Project's runs with the strict gate and no `--reconciled`. The folder is deleted by `docs(work): ki.prj.ways-of-working close-out`. ki.sop.main removes it from `covers`, and its [Project note](/Users/krisbrown/kis/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) points at `ki.reg.guilds` as the outcome.
6. **Standard.** `ki-coordination`'s "Stewardship of continual improvement" paragraph has method stewardship pass to State of play when Ways of working finishes. Rule 14 overturns that: it now passes to `ki.reg.guilds`, which sends the REFRESH lines. The `ki-coordinator` output style's example `ki.prj.ways-of-working` thread lines change with it.

**Stage C - Skills for the catalogue, seats, admission and the prime directive.** Repository: ki-agentic-harness, with lines to tools-ki, ki-principal and the Inbox. Authority: rule 9, "the guildmaster owns all of this as skills (a skill's standard, terminology first)", and rule 11. Size: L in four slices. It waits on Stage A, and slice 3 waits on SEATS-VS-SUBPACKAGES.

1. **Terminology first.** Add a glossary of the brief's terms, tiers and roles to `ki-coordination`'s Glossary, or to the new roles skill, as one canonical home. Reconcile "steward", now a manager role, with the work-package standard's "the work's own steward", and "worker/supervisor" with the tiers.
2. **Role catalogue.** Add a new `roles/` beside `subagents/`, with one definition per role on the ADR-KI-HARNESS-AGENTS-002 contract: purpose, tier, standard, authority and hand-offs. The purpose field serves the directive's purpose review. Reserved roles are marked reserved. `ki-repo-harness` gains `roles/` as a fifth source part and publishes it in the installed payload Agora reads. `ki-subagents` separates a role from a pack's subagent. A `ki-skills` or `ki-subagents` rubric check covers the directive's simplicity part.
3. **Seats and the `role` field.** `ki-work-package` adds a `role` field to the closed schema and retires `workers:`, which nine `state.md` files carry, for example ki.sop.main, household-sol and household-terra, inbox-sol and inbox-terra. It adds the seat folder `<package>+<role>`, created and torn down by the primary seat, and the slug mapping, which goes to ki.prj.tools-burndown for `ki agent` and `ki work status`. `ki-coordination` covers work naming with seats (rule 6), the opener and thread line with a seat, the web-address parameters (rule 7, for the Observatory and Agora), authority by tier (rule 4, with makers never reporting to Kris), leadership (rule 12) and availability before work (rule 2). `ki-delegation` names the pack as a seat's private subagents.
4. **Admission and the prime directive.** A new standard covers admission (rule 3), objections that name the unmet standard, ratification (rule 8) and purpose review with its capture signs. It goes in `ki-coordination`, or in a new skill the guild names under `ki-skills`. Each of the four parts is cited where it binds.
5. **Deletions and renames.** Delete the Paperclip-era subagents, scoped by PAPERCLIP-NAMES. Rename the capture "assistant" to gatekeeper, scoped by CAPTURE-ASSISTANT.
6. **Rollout.** Send REFRESH lines to every live package. Send the ratification round to each governor, starting at ki.sop.main, which convenes. Before the Agora gate enforces anything, send a line to ki.sop.main and `ki.reg.library` for the Work Process note and GDR-KI-PRINCIPAL-009 to carry tiers and seats (rule 9's "islands, guilds and library into the Knowledge Islands concept").

**Stage D - What Agora must build (the gate).** Repository: apps-agora.local, through [ki.prj.agora](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.agora/work.md). Authority: rule 9, "ki.prj.agora builds the admission gate and vote into Agora". Size: M to L, Agora's own sizing. It waits on Stage C slices 2 and 3, because the catalogue must be installed and readable. Enforcement waits on the ratification round, so that today's members are not locked out. The guild sends one line, with the catalogue's path, covering:

- **The gate (rule 1):** admit only seats whose role is in the installed catalogue, and tell an unrecognised session the path in, "take a role, ask the tier above".
- **Seat identity:** `package+role` addressing, and routing to a seat as well as to a package.
- **The admission vote (rule 3):** ask one tier up within scope. The quorum is no objections and at least 75% of live members voting, or one live member alone. An objection must name the unmet standard. After about two hours short of quorum, the vote goes to Kris. The votes are recorded where anyone can read them, as the directive's second part requires.
- **The ratification round (rule 8):** declarations, confirmation by the tier above, and the cascade through each governor.
- **Web addresses (rule 7):** separate `package` and `seat` query parameters.
- **Availability (rule 2):** members show availability for messages ahead of doing work.

## In Progress

Nothing is running. Every stage waits on the coordinator receiving this report. Stage A can launch on rule 13 alone. Stage B also waits on ABSORB-STEWARD, and slice 3 of Stage C on SEATS-VS-SUBPACKAGES.

**Outstanding - no action requested now:**

- GUILD-ROUTE (MSG-958bb583) awaits ki.sop.main's ACK. Stage A's line amends it.
- AGORA-WATCH-WOW has not reached sol's checkout of household-sol. Stage A replaces it.
- Each query below is medium confidence. Under the query-review rule, each needs one blind review before it reaches Kris.

## Queries

### ABSORB-STEWARD - Who carries out the Project's transfer and close-out in ki-principal

**Context:** Rule 14 says `ki.reg.guilds` "absorbs `ki.prj.ways-of-working` in ki-principal ... and closes it". The Project's package sits in ki-principal and has had no session since 3 November. The work-package standard lets other work write only one line in its `messages.md`. Only the folder's own work, or territory work once the folder is finished, may delete it. Only a State of play can become a package's assigned steward, by an acknowledged handover. Rule 12 now says ki.sop.main's governor "only convenes and records". The close-out means homing a 1,307-line decisions log, transferring about 95 parked queries and 14 focus folders, and finishing the Project.

**Query:** How should the guild get the authority to work inside the Project's package and close it?

**Options:**

a) (recommended, confidence medium - this matches rule 14's words with the smallest rule change, but it widens a stewardship rule, which the directive's purpose review watches for) The guild becomes the Project's assigned steward for the absorption only, by a committed and acknowledged handover in both decisions logs. `ki-work-package`'s stewardship rule gains one sentence admitting "a package the owner names as absorbing it". The guild's runs then transfer, home and finish the Project, with rule 14 as Kris's `finish`, and close it out.

b) Kris opens ki.prj.ways-of-working once more, for one close-out session in ki-principal. That session sends its transfers to the guild as message lines and finishes itself. No rule changes, but it costs a session of Kris's attention.

c) ki.sop.main takes assigned stewardship and runs the close-out, as the standard allows today, although rule 12 limits its governor to convening and recording.

### SEATS-VS-SUBPACKAGES - Whether seats replace sub-packages

**Context:** On 2 November Kris set SUB-PACKAGE: a doer's short-lived package for one focus area, id `<parent>.<focus>`, a sibling folder, one worker and one inbox. `personal.reg.inbox-terra.kiv` is the live example. The brief's seat is "a role taking part in a package, addressed `package+role` ... its folder is a sibling ... and lives and dies with its package". Rule 6 has naming migrate incrementally. The directive's first part counts complexity as a defect. Two sibling-folder shapes for one doer would be that kind of complexity.

**Query:** Should the seat replace the sub-package?

**Options:**

a) (recommended, confidence medium - the two shapes do the same job, and keeping both fails the simplicity part, but the brief does not say so outright) Yes. The sub-package rules retire into the seat rules, and `personal.reg.inbox-terra.kiv` becomes a seat of inbox-terra the next time it takes up its role, under rule 6.

b) Keep both: a sub-package for a focus area's short-lived doer, and a seat for a role in the package.

### HARNESS-SCOPE - Does the guildmaster keep every skill set, as the brief's "guild" term implies?

**Context:** On 6 November the guild's blind review recommended keeping the guild to the ways-of-working skills, with engineering, website and repository asks staying with the paused ki.prj.baseline-rollout or going to ki.reg.main. That review came before the brief. The brief defines Guild as "A set of skills, such as change management, kept by the guildmaster", and reserves "a guildmaster per guild" until "the work calls for them". So today's one guildmaster keeps every guild. Engineering, website, repository and acquisition are each a set of skills, and acquisition follows this answer under ACQUIRE-ROUTE. About 25 harness asks wait with no active carrier, among them the HNR conform conflicts, `ki-e2e`, DRYRUN-SCOPE, AREA-COLUMN, the checker boundaries and the Baseline rollout's harness lines.

**Query:** Should the guild keep every skill set in ki-agentic-harness as guilds, until the work calls for a second guildmaster?

**Options:**

a) (recommended, confidence medium - this follows the brief's Guild and Reserved wording, which overturns a reviewed recommendation made before the brief) Yes. Each skill area is a guild kept here: change management, governance, engineering, repository, design, acquisition and environment. The work page says so. ACQUIRE-ROUTE takes b), and the idle harness asks come here.

b) No. The guild keeps only the change-management and coordination skills and the role catalogue. The other asks wait for ki.prj.baseline-rollout or go to ki.reg.main.

### TRANSFER-SOP-QUERIES - Move HOLD-STATES and METHOD-BATCH to the guild

**Context:** State of play holds two method bundles for Kris's return: [HOLD-STATES](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/discussions.md), seven hold-state choices plus HOLD-TIDY, and METHOD-BATCH, fifteen method choices with an ADR-007 update. Both are recommended at high and both are unanswered. The guild's earlier recommendation, made before the brief, was for Kris to answer them in State of play's pass "to avoid asking twice". Because they have not been asked, moving them asks nothing twice. Rule 14 says "one package owns the method", and rule 12 says ki.sop.main's governor "only convenes and records".

**Query:** Should both bundles and their design notes move to the guild and be asked there?

**Options:**

a) (recommended, confidence medium - rules 12 and 14 make the guild the one method owner, and moving unanswered queries costs Kris nothing; this changes a reviewed recommendation) Yes. State of play sends both bundles and their two design notes here by message line. The guild asks them and lands the harness run.

b) Kris answers them in State of play's pass, and State of play sends each answer here for the guild to land.

### CAPTURE-ASSISTANT - Which "assistant" becomes gatekeeper

**Context:** The brief says: "Rename the capture skill's "assistant" to match gatekeeper", and "gatekeeper (replaces assistant; owns what comes in and goes out)". Under TOOLING-STAYS on 1 November, Kris kept `ki-acquire` and its provider skills' names ("acquiring goes to the assistant"), which reversed SKILL-NAME's `ki-assistant` rename. "The assistant" survives in two places. One is the harness acquire skills' wording, which calls the Inbox's executable route "the assistant's `ki-muninn`". The other is the Inbox's own capture guide and AGENTS.md, whose trigger is Kris's **"give it to my assistant"** and which sit in the Personal territory. The brief also says "whatever Kris is talking to is his point of contact in that capacity", so his spoken phrase is not a role name.

**Query:** What does the rename cover?

**Options:**

a) (recommended, confidence medium - this covers both places the role word lives and keeps Kris's own phrase, but the brief names only "the capture skill") Rename the role word, not the skill. The harness acquire skills say "the gatekeeper" where they mean the Inbox's role. The guild sends one line asking personal.reg.inbox-terra to do the same in its capture guide and AGENTS.md, keeping "give it to my assistant" as Kris's words. `ki-acquire` keeps its name under TOOLING-STAYS.

b) Rename the skill too, `ki-acquire` to a gatekeeper name with deprecated aliases, revisiting TOOLING-STAYS.

### PAPERCLIP-NAMES - How far "Paperclip-era role names are deleted" reaches

**Context:** The brief: "Paperclip-era role names are deleted (no confirmation needed)." On 26 September `subagents/coordination/` gained four "coordination lane" roles: `ki-convenor`, `ki-steward`, `ki-wright` and `ki-ferryman`, which covers remote execution and is not a Paperclip delivery role as such. The harness AGENTS.md section "Paperclip local delivery" names Wright, Steward and Convenor, and holds Kris's standing grant for the Convenor to merge into local `main`. The parked PAPERCLIP-RETIRE and PAPERCLIP-GRANT ask about retiring the Paperclip skill and its 54 declarations, and about suspending that grant. "Steward" lives on as a manager role.

**Query:** Does the deletion take in the AGENTS.md Paperclip section and its merge grant, as well as the four subagents?

**Options:**

a) (recommended, confidence medium - the grant names only roles the brief deletes, and Paperclip was retired on 31 October by the stock-take's account, which I did not verify directly) Delete all four subagents and the AGENTS.md "Paperclip local delivery" section with its grant. The `ki-delegation-paperclip` skill and its declarations stay for PAPERCLIP-RETIRE.

b) Delete only `ki-convenor`, `ki-steward` and `ki-wright`. Keep `ki-ferryman` and the AGENTS.md grant until PAPERCLIP-GRANT is answered.

### LIBRARY-OPEN - When to open `ki.reg.library`

**Context:** Rule 10 says "One library, `ki.reg.library`". Rule 9 says "the guildmaster and the librarian together carry islands, guilds and library into the Knowledge Islands concept". No `ki.reg.library` package exists. The concept, the Work Process note and GDR-KI-PRINCIPAL-009, lives in ki-principal, where the guild may only send message lines. The directive says "Reserved roles stay reserved until the work calls for them". The librarian is not reserved, but opening a package still needs Kris's word, as OPEN-GUILD did.

**Query:** When should `ki.reg.library` open, and where?

**Options:**

a) (recommended, confidence medium - the concept update is the first work that needs a librarian, and opening earlier would leave an idle seat, which is a capture sign) Open it in ki-principal, the Knowledge Base Capital, when Stage C reaches its concept step. ki.sop.main seeds it at Kris's word.

b) Open it now in ki-principal, so that it can take the role catalogue's terminology into the Knowledge Base alongside the guild.

### 🤖 → 👤 Handoff to supervisor · since 18:50 GMT

👤 7 with you

- [with you] ABSORB-STEWARD · owner · since 18:50
- [with you] SEATS-VS-SUBPACKAGES · owner · since 18:50
- [with you] HARNESS-SCOPE · owner · since 18:50
- [with you] TRANSFER-SOP-QUERIES · owner · since 18:50
- [with you] CAPTURE-ASSISTANT · owner · since 18:50
- [with you] PAPERCLIP-NAMES · owner · since 18:50
- [with you] LIBRARY-OPEN · owner · since 18:50
- [awaiting ACK] MSG-958bb583 · to ki.sop.main · since 17:03

🧵 ki.reg.ways-of-working
