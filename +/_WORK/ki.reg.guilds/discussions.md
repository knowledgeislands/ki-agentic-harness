# ki.reg.guilds discussions

## Open

### STAGE6-BUDGET - The core is too long for the agreed size limit

**Context:** Under CORE-BUDGET a) (Kris, 7 November 02:00 GMT), the core's word check warns above 3,500 words and fails above about 4,000. After the stage 5 rewrite, the part of the core that would become the always-loaded style is about 5,000 words. That is because stage 5 cut only about 6%, which is the open STAGE5-DEPTH question. This run was told to make no deeper cut, so stage 6 cannot add its size check without failing the tests.

The blind reviewer (Codex) chose a) too, at medium confidence: a ceiling at today's oversized core would postpone the context saving the switch exists for, while a reviewed cut proves it before rollout. It asked that the budget cover the final core with the CORE-EVERY-TURN summaries included, and that the cut's feasibility and preserved meaning still be proven. Confidence is not lifted: the coordinator's masking slipped and the reviewer saw the tail of a)'s reason, so the review was not fully blind.

**Query:** Should the deeper cut of the core be done together with the style switch, before stage 6 lands?

**Options:**

a) (recommended, confidence medium - it is the only way to meet the agreed limit, and pinned sentences are best changed with their tests, as STAGE5-DEPTH a) proposes; but the cut is large, about 1,000 words) Answer STAGE5-DEPTH with a), and send stage 6 back to cut the core to under 4,000 words. Each reworded sentence changes with its test, and a blind section review checks the cut before the switch lands.

b) Land the switch now with the core at about 5,000 words. The size check fails above the current size so the core cannot grow, and the limit drops to 4,000 once a later deeper cut lands.

### CORE-EVERY-TURN - Rules the style would lose on every turn

**Context:** The style will be generated from the core alone (STYLE-FROM-CORE a)). Today's style carries the mark words, the shape of a query's options, the interactive pass and the listening and sync fields. The current core has none of them. Each is in a purpose file that the coordinator would have to read when it needs it. The plan meant the mark words and a five-line rule for acting on messages to sit in the core. A switch would change every coordinator on this machine as soon as it is committed.

The reviewer added: message handling is partly in the core already, so complete its summary rather than duplicate it; include the interactive-pass trigger, which a) omits; make the loading occasions explicit; keep detailed procedures in their purpose files.

**Query:** Before the switch, should the core gain a short every-turn summary of the rules that are not in it today?

**Options:**

a) (recommended, confidence high - reviewed: the blind Codex reviewer chose the same course, since the switch removes reminders the current style supplies and a contents table cannot reliably trigger the purpose-file reads that replace them; it keeps the rules every turn needs always loaded, as the plan meant, but it adds about 300 words against the size limit) Yes. Add one short paragraph each for the mark words, acting on messages, the query's lettered options and the listening fields, inside the markers, each pointing to its purpose file. The blind review checks these in the same stage 6 pass.

b) No. Leave them in their purpose files and rely on the load table, accepting that a coordinator must read a purpose file before using them.

### HOLD-RUNSTATE - Where copied run state goes when work is put on hold

**Context:** When work goes on hold, the rules say to copy into the work's package anything from a run's state folder (`~/.local/state/ki/agents/<run>/`) that is needed to resume. The drafter noticed that the package may only hold a fixed list of file kinds, set by `ki-work-package`. Copied run state may not be on that list. I kept the rule as it stands today, with the same meaning, so nothing changed. Neither the plan nor the earlier split decision settles where such files belong.

The reviewer thinks the closed list may not need changing: the run state a resume needs is almost always a report, brief or design note, which `<focus-id>/` already admits, so a holds-rule-only edit ("copy it into the focus folder the run served as one of the closed-list kinds, usually its report") may suffice.

**Query:** Should copied run state go to a named place in the package, such as the focus folder of the work it serves, so that it fits the package's list of allowed files?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since the closed list admits only its kinds and FOLDER-1 is must-pass, so the holds rule as written steers a hold towards a rubric failure; it fits the package's existing focus-folder rule, but the allowed-file list is in another skill and I have not tested it against this case) Name the focus folder the run served, or `findings/` for a finding, as the home for copied run state. Change the holds rule and, if needed, the `ki-work-package` list in stage 6 or a small follow-up.

b) Leave the rule as it is, and deal with any clash with the allowed-file list when a real hold runs into it.

### STAGE5-DEPTH - Accept the modest cut, or go deeper later

**Context:** The terse rewrite now in the repository keeps every rule's meaning. Many tests pin exact sentences, and templates, tables and fixed tokens make up most of the remaining length, so the files are only about 6% shorter. A deeper cut means rewording the pinned sentences and changing their tests at the same time. That is stage 6's ground, where the tests and the generated style are rewritten anyway.

The reviewer asked that a) name the deeper cut as an explicit stage 6 step, measured by the plan's size table (about 54% smaller reference set, 42% smaller style) and the word budget, since stage 5 gave 6%. The stage 6 run has since stopped on STAGE6-BUDGET, which depends on this answer.

**Query:** Should any deeper cut wait for stage 6, alongside the test changes, rather than opening a second stage 5 pass?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since stage 6 already rewrites the banner test, generates the style and adds the word budget, so each pinned test changes once; pinned wording is safest changed together with its tests, and stage 6 already rewrites both) Leave the deeper cut to stage 6, which may shorten pinned sentences while it changes their tests.

b) Send stage 5 back now for a deeper second pass, allowing pinned sentences to change and listing the test edits each one needs.

### PARTS-HOME - Where to write the four change-management parts

**Context:** CM-PARTS a) and PART-HOME a) record the four parts in two places: the guild's work page and a field in the skills catalogue's generated data. The brief forbade editing `+/_WORK/ki.reg.guilds/`. A catalogue field needs a new frontmatter key accepted by `ki-skills`, plus a change to the `ki-repo-harness` catalogue generator, and both are outside change-management. The parts are Coordination, Work lifecycle, Work records and Design.

The blind reviewer disagreed and preferred b): every skill frontmatter key today (`ki-kind`, `ki-applicability`, `ki-depends-on`, `ki-runtime-binding`) is a harness-wide contract enforced by `ki-skills` and parsed by `ki-repo-harness`, so a `ki-part` key serving one area's grouping is a schema change for the whole harness; the catalogue already groups skills by concern folder, and parts can be promoted later if other areas need them. It named a missing option, c) below, and noted that b) partly revisits CM-PARTS a) and PART-HOME a).

**Query:** Should a run add the catalogue field and its generator support, with the coordinator writing the parts into the guild work page?

**Options:**

a) (recommended, confidence medium - the field name and generator change are small but are a schema change no one has reviewed) Yes. Add a `ki-part` frontmatter key, validated by `ki-skills` and published by the `ki-repo-harness` catalogue. Set it on the 12 named skills, and have the coordinator write the same list into `work.md`.

b) Record the parts in the guild work page only, and leave the catalogue alone for now.

c) Keep the four parts in a home change-management owns, the `ki-work` SKILL.md or its adapter reference, with no new catalogue key, and write the same list into the guild's `work.md`.

### REMOTE-CONFIG - Where the folded GitHub Issues and Linear settings live

**Context:** REMOTE-ADAPTERS a) folds `ki-work-github-issues` and `ki-work-linear` into one `ki-work` reference, selected by `adapter = "github-issues"` or `"linear"`. Today each adapter's settings sit in that skill's own table:

- GitHub Issues: the repository and the lifecycle mapping.
- Linear: the team and the mapping.

`ki-repo` reads the GitHub Issues table to decide whether the Issues tab is on. The option does not say where these settings go once the skills are gone. The code that would change lives in `ki-work` and also in `ki-repo` and `ki-repo-harness`, the last two outside this brief. No repository declares either adapter, so nothing in use breaks. Nothing was landed, so that the old and new homes would not exist side by side.

The reviewer called b) nearly as strong, since GitHub Issues remote execution is already described as unavailable, and noted that no repository declares either adapter, so a migration file would have nothing to migrate.

**Query:** Where should a remote adapter's settings live after the fold?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since a skill keeping settings in a sub-table of its own table is an established convention (`[skills.ki-repo.checks]`, `[skills.ki-tokenomics.budgets]`, `[skills.ki-repo-kb.zones]`) and dropping the settings would turn the fold into a removal; it keeps one table per adapter under its selector, but it is a new configuration shape) In a sub-table of `ki-work`, `[skills.ki-work.github-issues]` or `[skills.ki-work.linear]`. `ki-repo` reads `adapter = "github-issues"`, and one run lands the reference, the code in all three skills, and the deletion of the two skills, with a migration file.

b) Drop the settings entirely. The two values become reserved and stop until a remote executor exists, and the Issues tab stays off everywhere.

### PKG-PRIMARY - Should package repositories become a core repository shape?

**Context:** `ki-repo` keeps a list of core shapes, the main kinds a Project repository can say it is, such as tools, MCP server or website. The new `ki-repo-packages` skill works as an add-on to the general Project shape and needs no place on that list. Putting it on the list would change `ki-repo`'s list, its automatic detection of declared skills and its per-shape commit hooks. Kris said on 7 November: "It seems like it's a new repo shape really, doesn't it?" Only one package repository exists, `packages-stoa`.

The blind reviewer disagreed and preferred b): `ki-repo` says the primary shape names a repository's main responsibility, and vendoring is plainly Stoa's; single-repository core shapes already exist (`ki-repo-homebrew-tap`, `ki-repo-specifications`); the shape needs no staged lint of its own, so its commit hook can equal the general Project hook; and today `ki-repo`'s detection list leaves out `ki-repo-packages`, so the overlay's declaration goes unseen until that changes.

**Query:** Should package repositories stay an add-on to the general Project shape, or join `ki-repo`'s core shapes?

**Options:**

a) (recommended, confidence medium - the add-on already does the whole job without touching `ki-repo`, and one repository is thin evidence for a new core kind) Keep it as an add-on for now, and revisit when a second package repository appears.

b) Make it a core shape now: add it to `ki-repo`'s list, its detection and its commit hooks in a follow-up run, then let `packages-stoa` select it as its primary shape.

### PKG-DECLARE - Ask the Stoa work to adopt the new skill

**Context:** The away-window grant allows building the skills but nothing more: "don't do anything else with it". Stoa will benefit from the skill only once it is declared there. Today `packages-stoa` declares only the general Project shape, with a comment pointing to the tools shape, and it still keeps a consumer list that Kris asked on 1 November to retire (STOA-NO-CONSUMERS).

**Query:** Once you are back, may a message go to the Stoa Project, `ki.prj.stoa`, asking it to add `[skills.ki-repo-packages] package = "stoa"` and to replace its consumer list with finding consumers by their lock file?

**Options:**

a) (recommended, confidence high - it is the receiver's own change, made through its own queue, and it closes two lines of the migration overlay) Yes: send one line to `ki.prj.stoa`'s `messages.md` naming the skill and both changes.

b) Wait for the Stoa work to raise it itself.

### PKG-GENERAL - Confirm two Stoa rules widened to every package repository

**Context:** The skill applies two rules to every package repository. First, the standard says package releases follow the release-on-demand policy that `ki-repo-tools` keeps for tooling: hold releases by default, and release only when something needs it. Second, Kris's words of 1 November about Stoa, "There should be no reference out of Knowledge Islands to other territories", and the addendum, "It shouldn't have a finite list of them", become a rule that no package repository keeps a list of its consumers. Both are written as final state, so changing either later means editing the standard.

The reviewer also noted that `packages-stoa` still keeps `consumers.json5`, naming Humans Not Robots sites, against the 1 November rule; the migration overlay records it under STOA-NO-CONSUMERS.

**Query:** Should both rules apply to every package repository, as written?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since `ki-repo-tools`'s release-on-demand section already calls itself the policy for any repository that cuts versioned releases, so only the no-list rule widens, and finding consumers by lock file costs nothing anywhere; both follow from the words and policies as they stand, but each widens a rule beyond the case it was set for) Yes, keep both as written.

b) Narrow them: keep release timing to Stoa's own rules and the no-list rule to repositories serving other territories, and edit the standard to match.

### EDA-DISCOVERY - Let people find the new skill beyond its description

**Context:** The design note's plan has two more ways for people to find the skill. One is a line in the ways-of-working guidance. The other is a short "Exchange Dynamics Analysis" pointer note among Knowledge Islands Principal's Emerging Concepts, which would go through the Enactment Process. Both were left out because the away-window grant says "Don't introduce knowledge at top level anywhere". For now the skill is found only by its description. The migration overlay lists this gap and should be cleared once the gap is closed.

The blind reviewer added two points: the overlay line should go only once both items have landed, not when the message is routed; and the two items differ in weight, since the ways-of-working line is cheap while the Principal pointer note goes through the Enactment Process and may be declined, so the line could go first and the note as its own proposal.

**Query:** Should the ways-of-working line and the Principal pointer note now be written through their owners?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since the overlay's own release condition is that both land through their owners and a later review gives no trigger; the design note planned both, but the pointer note adds knowledge to Principal, which needs your word) Yes, after the away window: route a message to ki.sop.main for the pointer note and the ways-of-working line, then delete that line of the overlay.

b) The skill's description is enough for now: keep the overlay line until the discovery guidance is next reviewed.

### KEYSTONE - Move `ki-knowledge-graph` to the keystone group

**Context:** Kris suggested, in the note sent with the cards, that this become a keystone skill, under `skills/keystone/`. The keystone group holds `ki-repo`, `ki-bootstrap` and `ki-skills`, the skills the rest of the harness stands on. HARNESS-SCOPE a) on 7 November put the knowledge-graph skill in the acquire group, which is where it now sits. A move would change the skill's folder, its catalogue section, the functional-area table and two diagrams, and links to it would need updating. Its applicability would stay declaration-only, meaning a repository uses it only by declaring it.

**Query:** Should the skill move to the keystone group?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer chose the same course, since keystone skills are what the harness itself runs on and apply at baseline, while this one applies only where declared; only Kris knows whether he meant keystone as a load-bearing method or as a group) Keep it in acquire for now and decide together with GUILD-NAME, since renaming that group may settle where the intake skills belong.

b) Move it to keystone now, because the card format and layered graphs underlie every knowledge base and not just intake.

c) Keep it in acquire for good, beside `ki-dodecakrisis` and `ki-acquire`, as one step of the intake path.

### ATTACH-FORM - How a graph declares an attachment point and what a shadow node records

**Context:** The layered-graphs card leaves two questions open: how a graph declares an attachment point (a front-matter flag, a register, or its index note), and exactly what a shadow node records about its subject. The standard says only that a graph declares its attachment points, and that a shadow records which card it shadows, where that card lives and when it was last checked. The Inbox's 22 new shadows already use one form: front-matter `shadow-of` with a path and an address, plus a `checked` date. Until this is settled, no mechanical check of shadows or attachment points can be written.

**Query:** Should the standard adopt the Inbox's shadow form, and which way of declaring attachment points?

**Options:**

a) (recommended, confidence medium - reviewed: the blind reviewer chose the same course, since both forms are already in use and a flag in the card moves with it, where a register would drift; it matches what already exists, but Kris has not discussed either form) Adopt the Inbox's `shadow-of` path and address with a `checked` date for shadows, and a front-matter flag on each card for attachment points.

b) Adopt the shadow form, and declare attachment points in a register in each graph's index note.

c) Leave both open until more graphs are layered.

### MAKER-PROTOCOL - Make the night's seat-to-seat protocol a standard practice

**Context:** On the night of 6 November, `ki.prj.agora` coordinated two makers working in their own sessions: Claude Design (architect) and ChatGPT Codex (illustrator). They wrote to each other through mailbox files. Both makers say a protocol made it work, agreed between the agents as CD-54: The blind reviewer disagreed and preferred c): the brief marker, the window lines and the finished-set line do not depend on how messages travel and fill a real gap for maker seats, while the timings rest on one night's evidence, are not your choice yet, and depend on file polling Agora may replace.

- each brief is marked "delegate; stay available"
- one writer per direction
- an ACK within 30 seconds, and escalation to Kris after 3 minutes without one
- heartbeats only after 5 quiet minutes
- the maker keeps its turn open with short polling loops, because it can only hear while its turn is open
- explicit WINDOW-OPEN and WINDOW-CLOSED lines
- a DESIGN or ART line for each finished set

None of this is in the standards. Part of it conflicts with `ki-coordination` as written. A coordinator must never wait in the foreground, and a thread whose runtime cannot be woken counts as "not listening" rather than holding its turn open. Background runs, however, are allowed to wait in the foreground. Kris has not chosen these numbers, and Agora's own messaging may later replace file polling.

**Query:** Should this protocol become a standard practice for makers working in another session, or stay local to `ki.prj.agora`?

**Options:**

a) (recommended, confidence medium - both makers reported it working, but Kris has not chosen the numbers and it bends a coordinator rule) Adopt it in `ki-coordination` as a "Makers in other sessions" practice. The timings above become the defaults. Holding a turn open is allowed for a maker seat only, never for a coordinator. A guilds run writes it and marks it to be revisited once Agora's messaging replaces file polling.

b) Keep it as `ki.prj.agora`'s local protocol, recorded in that package's decisions log, and decide again when Agora's messaging lands.

c) Adopt only the parts that do not conflict: the brief marker, the window lines and the finished-set line. The timings and holding the turn open stay with `ki.prj.agora`.

### OUTBOUND-RECOVERY - Follow up messages left unacknowledged after an interruption

**Context:** The illustrator noted that the next thing to settle is how to recover work after missing ACKs. On the night, one proposal got no reply in its 25-minute window, and three finished design sets went unacknowledged once the coordinator's session went quiet. Today, a line still waiting for an ACK only appears in the banner as `[awaiting ACK]`. No rule says when the sender follows it up.

**Query:** Should a sender actively follow up a message that is still unacknowledged after an interruption?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, adding that the follow-up first checks whether the line is still in the receiver's Inbound before re-sending; closes the gap seen on the night with a single resend before involving Kris) Add a `ki-work-package` rule to Messages lines: at bootstrap, re-anchoring and the return from an interruption, the sender reads its Outbound. For each line awaiting ACK whose receiver is not live, it re-sends once under the same id, and raises the line to Kris if it is still unacknowledged at the next bootstrap.

b) Leave it as it is: the `[awaiting ACK]` banner items stay the only signal, and Kris or the coordinator follows up by judgement.

### IDLE-HEADING - Confirm how the idle hold's heading reads

**Context:** HOLD-IDLE a), which Kris chose on 7 November, says the idle hold is "shown as `💤 On hold · idle`". That wording was written before the hold was renamed. On 6 November, Kris renamed the more-expected hold to Snoozing, with the heading `💤 Snoozing (on hold)`. To keep one heading per state, I landed the idle hold as `### 💤 Snoozing (on hold) · idle · at <time>`. Its counts line is the same as Snoozing's, `💤 waiting for a message`, rather than the design note's `💤 resting`.

**Query:** Should the idle hold's heading stay `💤 Snoozing (on hold) · idle`?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since one state keeps one glyph, heading and counts line and the old wording predates the rename; it is what has landed) Keep `💤 Snoozing (on hold) · idle`, with Snoozing's counts line.

b) Use `💤 On hold · idle` exactly as HOLD-IDLE wrote it, with its own counts line, `💤 resting`.

### PROTECTED-INTERIM - May D12 change a mailbox before the servers enforce the protected list

**Context:** Under PROTECTED-HOME a) (Kris, 7 November 2026), each mail server holds and enforces the list of protected labels, and D12 reads the list from the server. Neither `mcp-gsuite` nor `mcp-m365` can do this yet. The new standard says D12 does not change a mailbox whose server does not report protection switched on. Until the servers are built, the migration file therefore stops SORT, SWEEP, LEARN and CONFORM from writing to any mailbox. Audits and dry runs continue. Work that inbox-terra's own approvals already cover, such as the Gmail legal move, is not run through the skill and is unaffected.

**Query:** Should D12's writing modes stay switched off until the servers enforce the protected list?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course, since a run-side check cannot see every case, such as a message carrying both a protected and an ordinary label, sub-labels or a renamed label; it matches "never changed or touched" and leaves no gap for a forgotten list, though it delays live sorting) Yes. D12 writes nothing to a mailbox until its server reports protection on.

b) Allow writes in the meantime, but only with an approval that names the protected labels the run must leave alone, and check each target against them.

### MAILBOX-CONFIG - Where a D12 mailbox's provider and server are declared

**Context:** The skill reads its own `[skills.ki-dodecakrisis]` table, which gives each mailbox a provider, a server and a label root, following the design note. The Inbox already declares the same mailboxes for `ki-muninn` under `[muninn.mail.mailboxes]`, with provider and server. The house rule lets a skill check only its own table, so the two tables cannot be checked against each other, and the provider and server would be written twice. The blind reviewer disagreed and preferred b): `ki-muninn` already declares the mailboxes with provider and server and is D12's own runner, so a second copy could send SORT and SWEEP to different servers after a rename; it suggests `ki-muninn`'s own check confirm that every D12 mailbox name exists in its table.

**Query:** Should the D12 table repeat each mailbox's provider and server?

**Options:**

a) (recommended, confidence medium - the skill's audit can check its own table, and this is the shape the design note proposed) Yes, keep provider, server and root in the D12 table, as built.

b) The D12 table names only each mailbox and its root, and `ki-muninn`'s table stays the one place for provider and server.

### STAGING-HOME - Who owns the staging knowledge base's structure

**Context:** KNOWLEDGE-AS-KB a (6 November) makes the Inbox's `knowledge/` a declared staging knowledge base, using zone aliases that `ki-repo-kb` already supports. A staging base differs from an ordinary one: its ids can change, and it mirrors the islands it will dispatch to.

**Query:** Where is the staging base's shape set out?

**Options:**

a) (recommended, confidence high - reviewed: the blind reviewer chose the same course; structure stays with the structure skill and method with the method skill) A staging profile in `ki-repo-kb` for the zones and aliases, with the graph skill covering how material moves through it.

b) All of it in the graph skill.

### GUILD-NAME - Keep the guild called "acquire", or rename it

**Context:** HARNESS-SCOPE a) (Kris, 7 November) made each harness skill folder a guild and put both new skills under the acquire guild, leaving its name open. With D12 and the graph skill added, the guild runs from sorting through capture and curation to dispatch. Renaming the folder moves skill paths, the catalogue and links. The blind reviewer disagreed and preferred: `knowledge-tending`, because it is exact, matches the Pillar folder, other guild folders are already hyphenated, and a bare `knowledge` could be confused with the knowledge-base skills in `repo-structure`.

**Query:** What should this guild be called?

**Options:**

a) (recommended, confidence medium - it names what the guild serves, not just its first step) `knowledge`.

b) `knowledge-tending`, the name of the Pillar folder that holds all three cards; it is exact but long.

c) Keep `acquire`; it costs nothing, but sorting and curation are not acquisition.

### ACQUIRE-SPLIT - Move curation and dispatch out of `ki-acquire`

**Context:** The `ki-acquire` standard already contains "Staging and curation" and "Dispatch and authority" sections, and its description mentions curation and dispatch. The new graph skill covers the same ground. Two copies would drift apart.

**Query:** Should `ki-acquire` be narrowed to capture, with its curation and dispatch text moved to the new skill?

**Options:**

a) (recommended, confidence high - one owner per rule is the house contract) Yes: `ki-acquire` keeps capture and hands off to the graph skill at curation.

b) No: `ki-acquire` keeps them, and the graph skill covers only the card format and tending.

## Parked

- DOCKET-HOME: what a D12 Docket item is; recommended a) (low) an action card in the declaring repository's actions area pointing at the item, the `D12/12 Docket` label marking it; the blind reviewer preferred leaving it out of the first version. Kris, 7 November: "not sure, come back later".
- ACQUIRE-ROUTE: acquisition items (GRANOLA-CAPTURED-SKIP MSG-6620cbb7, GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE) to ki.reg.main via State of play; recommended a) high. Kris, 7 November: "We can come back to that later." None.
