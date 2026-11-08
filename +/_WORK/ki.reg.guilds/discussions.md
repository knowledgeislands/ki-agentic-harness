# ki.reg.guilds discussions

## Open

None.

## Parked

Parked at Kris's word, 7 November 2026 09:14 GMT ("put everything that's waiting for me as parked"), in full as they stood.

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

### HOOK-PATCH - Treat a leftover lint-staged patch like a leftover stash

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-11-01 · from run/hook-nostash · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** With `--no-stash`, lint-staged no longer makes a backup stash. While its checks run, it still sets aside the unstaged part of any partly staged file, and it keeps that part in a patch file at `.git/lint-staged/<id>/unstaged.patch`. In the scratch test, killing lint-staged at that moment left the working file without those edits. Only the patch held them, and `git apply` brought them back exactly. A normal Ctrl-C did not cause this. The review confirmed from lint-staged's own source that the patch is written before, and apart from, any stash; it did not repeat the kill test. The standards now cover a leftover `lint-staged automatic backup` stash, but they say nothing about this patch, so an agent tidying `.git` could delete someone's only copy of their unstaged edits.

**Query:** Should the `ki-delegation` standard and the coordinator style also say that a leftover `.git/lint-staged/` patch is reported, never deleted or applied by an agent?

**Options:**

a) (recommended, confidence high - reviewed; the hook runs in this mode and lint-staged's source confirms the patch is made independently of the stash) Add it to the same sentence in both places, in a small follow-up run: a leftover patch is reported to its owner by its location, found through Git since a worktree keeps its own, without printing its contents, and never deleted or applied by an agent. The run changes the source standard and regenerates the coordinator style from it.

b) Leave the standards as they are and rely on the general rule against touching other sessions' files.

### WP-HEARTBEAT - Bring the Work Process note into line with the quiet watcher

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-10-31 · from run/quiet-listen · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The harness standard no longer has a timed heartbeat. A run finishing, or a new message, is now the only thing that wakes the thread, and listening is on request. The [Work Process note](</Users/krisbrown/kis/knowledge-islands/ki-principal/Pillars/Philosophy/Model/Processes/Work Process/Work Process.md>) in Knowledge Islands Principal still says, under "Stuck and the heartbeat", that a heartbeat gives "an update on change, at least every 5 minutes and always by 10". The review found that the note's rule for when work counts as stuck, and its statement on listening, also rely on that beat. The note is canonical content, so changing it goes through the Enactment Process.

**Query:** Should the Work Process note's heartbeat paragraph be changed to match QUIET-LISTEN?

**Options:**

a) (recommended, confidence high - reviewed; QUIET-LISTEN explicitly replaces the timed heartbeat, and changing only the paragraph would leave the rules that depend on it contradicting the standard) Yes. Launch a bounded run in Knowledge Islands Principal that rewrites the paragraph and the parts that depend on it, the stuck rule and the listening statement, so the thread wakes only when a run finishes or a message lands, citing QUIET-LISTEN as the owner instruction for the Enactment Process.

b) Leave the note as it is for now, and accept that it disagrees with the standard until a wider model refresh.

### RESTART-POLICY - How should the two restart policies coexist?

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-10-31 · from run/restart-review · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The restart rule now in the standard suggests a fresh session only when the work's id, label or run name changes, after a second compaction, or when the method changes; never for age or length alone; and repeats the suggestion until you decline it. A separate parked design, RESTART, proposes instead a reminder after four hours or 100 messages, given once at a safe point. That design is still design-only, and neither the delivery nor its review answered it.

**Query:** Should the rule now in the standard stay the current rule while the numerical design stays separately parked?

**Options:**

a) (recommended, confidence high - reviewed; an unadopted design should not silently replace the current rule) Keep the current rule for now, record that it does not settle RESTART, and reconcile the triggers, safe timing and repetition explicitly before any numbers are adopted.

b) Commission one combined design revision now, covering both kinds of trigger, evidence, safe timing and repetition, for your review before any further implementation.

c) Request a scoped revision replacing the current rule with the numerical proposal, after first deciding its values, evidence and implementation authority.

### RESTART-EVIDENCE - Qualify the trigger rationale as a workflow convention?

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-10-31 · from run/restart-review · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The standard says a second compaction, a changed identity and a changed method each make a fresh session necessary. The reviewed evidence and passing tests show a coherent written rule, but they do not show that sessions improve or that correcting course in the same session cannot work, and the standard already has an in-session re-anchoring procedure. The parked numerical design already admits this.

**Query:** Should a later authorised wording revision describe these triggers as provisional working conventions rather than proven necessities?

**Options:**

a) (recommended, confidence high - reviewed; it matches the wording to the evidence without choosing a new threshold) Commission a bounded wording revision describing the triggers as reversible working conventions and keeping your discretion, without changing when the suggestion is made or implying that a fresh session is always better; any change of behaviour goes under RESTART-POLICY.

b) Keep the present wording until specific evidence shows the claimed necessity and the second-compaction cutoff.

### RESTART - Advisory policy and safe continuation

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The owner requested threshold-triggered advice. The masked review independently supports the same reversible four-hour/100-message convention with medium confidence in workflow fit and low confidence in the particular values. No evidence validates degradation prediction or numerical superiority. Existing pick-up defines safe continuation.

**Query:** For the design only, use four elapsed hours or 100 evidenced user/assistant messages as the provisional reminder cutoff?

**Options:**

a) (recommended, confidence medium - reviewed workflow fit; numerical values unvalidated; fulfils the requested reminder through an explicitly unvalidated, reversible convention) Use four elapsed hours or 100 evidenced user/assistant messages, with a qualifying usable observation making one reminder pending per current session for the next existing safe resumable boundary. Unknown/stale evidence cannot establish a crossing; label partial coverage. The owner may continue and may request safe continuation earlier. No automatic restart, repeat or escalation; no implementation, pilot or study authority follows.

b) Retain truthful signals and user-requested safe continuation without numerical reminders, explicitly deferring the requested threshold-triggered element.

c) Choose different provisional numerical values as an owner workflow preference, with the same advisory and evidence constraints and no degradation claim.

### SIGNAL - Truthful session indicator

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** No reviewed source proves universal telemetry. Package timestamps cannot supply session age. Useful partial evidence can coexist with explicitly unknown signals.

**Query:** Display separately evidenced age and volume with volatile runtime observations and explicit unknowns?

**Options:**

a) (recommended, confidence high - useful without fabricating counters or adding package state) Append evidenced elapsed wall-clock age and user/assistant message volume after `🧵 <id>` on the same final thread line, with coverage, provenance and observation time; preserve stable identity, epoch/reset rules, unknown/stale labels and no new persistent telemetry store. Keep the current footer unchanged until adoption and compatible reader migration.

b) Show only a qualitative resumability reminder until one client can evidence both full-session age and volume; keep numerical freshness display deferred.

### OPTION-CONFIDENCE - Give every option its own confidence

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-11-01 · from hnr.reg.email-routing (Kris's thinking) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Today only the recommended option carries a confidence and a reason. Kris, 1 November: "if something's confidence medium … then something else must have a different confidence, right? … they might have two options, which are confidence medium, and you recommend one of them. Maybe all options should be given a confidence indicator." The change touches the query format in `ki-coordination`, the output style, the run-prompt Report paragraph and the blind-review handling.

**Query:** Should every lettered option carry its own confidence and one-line reason?

**Options:**

a) (recommended, confidence high - it is Kris's own proposal, it shows how close a call is, and it changes only wording) Yes: every option carries `(confidence <level> - <reason>)`; the recommended one stays first and also says "recommended".

b) No: keep confidence on the recommended option only.

### FOCUS-SLOT-OWNER - Whose focus area a message line names

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-11-02 · from run/focus-layout (LAYOUT-PILLARS) · blind review 2 November differs · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** LAYOUT-PILLARS says decisions, messages and discussion points each name their focus area, and that only the owning thread assigns items to its focus areas. For decisions and discussion points the owner is clear: it's the work itself. A message line is written by one work into another's queue. In the pilot, assistant-sol wrote `focus: aside` on a line it sent to household-terra, which is the sender's own area. The standard now allows the slot but doesn't say whose area it names. The blind review prefers b) at high confidence: a message is an item in the receiver's incoming queue, so its focus slot should use the receiver's areas, and a sender should not assign it.

**Query:** On a message line, should the `focus:` slot name the sender's focus area or the receiver's?

**Options:**

a) (recommended, confidence medium - it matches the pilot and keeps "only the owning thread assigns" true, because the sender only ever labels its own matter) The slot names the sender's focus area. The receiver assigns the matter to one of its own areas when it acts on the line.

b) The slot names one of the receiver's focus areas. A sender writes it only when echoing an assignment the receiver has already made, such as in a reply, and otherwise leaves it out.

### FOCUS-TOP - Where household-sol's Focus section sits

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-11-02 · from run/focus-layout (LAYOUT-PILLARS) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** LAYOUT-PILLARS puts `## Focus` after Goals and Scope. FOCUS-IN-WORK first piloted it at the top of `work.md`, and household-sol still has it there. The audit accepts that position with a tolerance warning, so all four pillars pass.

**Query:** Should a Focus section above Goals stay a warning that household-sol clears by moving it, or become an accepted second position?

**Options:**

a) (recommended, confidence high - Kris's LAYOUT-PILLARS words set the position after Goals and Scope) Keep the warning. household-sol moves its section at its next update.

b) Accept Focus either at the top or after Scope, with no warning.

### THREAD-DEFAULTS - Select a session and its default work home

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-10-28; parked until session/default selection is decided, sources THREAD-HOME and HOOK-SHORTCUT. · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Typed readers and member-launched coordination support are delivered. The new unknown-session hook partial emits a short conditional pointer and avoids checkout-wide scans; it does not discover the selected session. Default selection for member-local status, a Capital package and multiple candidates remains undecided. No session marker, schema or automatic work opening is authorised.

**Query:** How should a session explicitly select its one work and determine the default status/home context without assuming the launch checkout is the package home?

**Options:**

a) (recommended, confidence high - keeps delivered launch support usable while retaining explicit selection) Preserve explicit work selection and the quiet-hook partial; design the remaining default/session boundary separately.

b) Have the owner choose the intended default-selection contract before qualifying another implementation unit.

### GIT-REBASE - May a run tidy its own commits into a straight line instead of making merge commits?

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-11-01 · from run/rebase-review · blind review 1 November 17:10 GMT differs · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Several sessions commit into one shared copy of each repository (the primary checkout). The rules ban "rebasing" there, that is, rewriting commits so they sit on top of newer ones, because doing so in a shared copy can disturb another session's work. When a sync cannot simply move forward, a short "resolve run" does the joining in its own private copy (a worktree). The written rules already let that run rebase its own unpublished commits there before pushing, but since 31 October the briefs have told resolve runs to make merge commits and never rebase. On 31 October and 1 November that gave nine extra merge commits in ki-principal, each joining one or two small commits, out of 14 merge commits in total. On 1 November Kris said rebasing "in some situations absolutely has merit … I prefer not to pollute a tree with mergers … Maybe with everything now happening with work trees, merging is more preferable".

The blind review prefers b), merging, at medium confidence: once a run has merged or another session has pushed, a rebased branch can no longer simply fast-forward the shared `main`, so a) would often still end in a merge or need rewriting of shared history; it also warns that unpublished does not always mean unshared, and that rebasing changes commit identities that reviews refer to.

**Query:** Should runs rebase their own unpublished commits in their private worktree, keeping the ban only for the shared checkout?

**Options:**

a) (recommended, confidence medium - matches the rules as written and Kris's dislike of merge clutter; the risk is low because only a run's own unpublished commits in its own copy are rewritten, but Kris's last words leaned towards merging) Allow rebase only inside a run's private worktree: the run rebases its own unpublished commits onto `origin/main`, checks them again, then pushes and fast-forwards the shared copy. Merge commits are kept for cases a rebase cannot settle cleanly. The shared checkout keeps its ban on rebase, stash and reset, and the resolve briefs and the hold prompt are brought into line.

b) Prefer merge everywhere: rewrite the conflict-run and worktree self-integration rules to make merge commits, accepting a branching history in return for never rewriting any commit.

c) Keep things as they are: leave the written rules unchanged and let briefs keep asking for merge commits, accepting the mismatch between the standard and practice.

d) Also allow rebase in the shared checkout when it is clean and only this session's commits are unpublished, as ki-principal's Git settings already do for a bare `git pull`. Not recommended, because another session may commit at the same moment.

### PUSH-RETRY - Decide whether any bounded retry is wanted

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-10-28; parked pending method choice, source Personal Rig terra PUSH-RETRY. · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The sender proposes up to five retries for a queue append losing a push race. Current coordination/delegation/Git rules distinguish an uncontested remote append from actual divergence, peer-owned history, contested staging or content conflict. No blind replay or retry policy has been adopted. The existing private qualification preserves the two routes and their source sections.

**Query:** Should the method retain the current bounded conflict-run route or design a narrowly qualified retry for uncontested append races?

**Options:**

a) (recommended, confidence high - uses the existing supported route and preserves every ownership/refusal guard) Retain the current stop-and-bounded-conflict-run method; make no retry policy change now.

b) Qualify a bounded own-content-only retry for disjoint append races before adoption; the sender's five-attempt count remains a proposal and cannot override divergence, privacy or narrower push rules.

### HNR-CAP - Let the cap check see a recorded cap raise

area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`) · since 2026-11-01 · from run/hnr-conflicts (HNR-CONFORM-FRICTION) · blind review 1 November 05:18 GMT · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The coordination standard caps active Project work at three or four. Going over needs "the owner's explicit agreement beforehand", and the coordinator cannot raise it alone. Kris gave that agreement for HNR on 28 October, in [CAP-RAISE](/Users/krisbrown/kis/humans-not-robots/hnr-principal/+/_WORK/hnr.sop.main/decisions.md): "we temporarily raise cap ... if you go over cap of five, be very explicit in doing so. In this case, I'm giving explicit agreement". The audit check COORD-3 has a fixed limit of four and cannot read a recorded agreement, so HNR warns for as long as the raise lasts. A Ways of working run (wow-sleep-method-finish) was briefed to add "explicit CAP-RAISE wording" to the standard; the current text names no place to record one. The raise is temporary, "until site threads settle", and has no end date.

**Query:** Should COORD-3 read a recorded, dated cap raise and report it rather than warning?

**Options:**

a) (recommended, confidence high - the rule already provides for owner agreement, and a warning that cannot be cleared by doing what the rule asks teaches people to ignore the check) The harness gives way: Ways of working defines where a raise is recorded (the territory's `state.md` front matter, with the new limit, the decision it cites and an end or review condition), and COORD-3 reports INFO while within the raised limit, warning again over it or once it ends. HNR records CAP-RAISE in that form, with an end condition Kris names.

b) Keep the check fixed at four and accept the warning while the raise lasts.

### HOMES - Repository identity and defaults

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Existing packages default to the territory Capital, with approved regular/ad hoc exceptions. Local keys and canonical repository identities differ. Explicit metadata must not create a new home or permission.

**Query:** Use canonical repository identities, a derived Capital default and optional checked `territory`?

**Options:**

a) (recommended, confidence high - portable identity and existing authority remain distinct) Use the HOMES model above: optional matching `territory`, omitted `canonical_home` derives Capital, explicit null stays unresolved, supplied identities must resolve uniquely and exceptions retain their approval requirements.

b) Keep home declarations only in current Scope and omit both new fields; retain the current resolution contract.

### EXECUTION - One default execution context

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The owner means where work is meant to be running and illustrates the chezmoi repository footprint. Both earlier reviews prefer plural execution hints; neither establishes support in current readers. One declared default can supply a verified launch working directory without replacing canonical package home, explicit unit targets or authority.

**Query:** Use one optional execution repository/context as a checked launch default, with explicit unit targets and overrides?

**Options:**

a) (recommended, confidence medium - meets the owner's execution intent with lean semantics; launch compatibility remains unproved) Keep singular `execution_home`, unspecified when absent/null, as one default repository/context that can supply a verified launch working directory after explicit work selection, host requirements and unit authority checks. Preserve explicit unit targets and overrides; resolving the directory grants no write authority. Current readers need separately authorised compatibility work; no binding or directory change happens here.

b) Defer an execution field and retain explicit per-unit working-directory and target declarations under current readers, leaving the requested package-level launch default undelivered.

### HOST - Required machine versus session seat

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Device constraints already resolve through inventory, while live placement stays out of packages. Most constraints belong to units. The current naming ban needs clarification for the owner's illustrative machine-related subject id.

**Query:** Add an optional whole-package host/category requirement and distinguish subject naming from live placement?

**Options:**

a) (recommended, confidence high - explicit constraints do not imply placement or authority) Adopt the optional typed `host_requirement` design, normally using unit constraints instead; unresolved required identities block device-dependent execution. Permit owner-chosen machine-related subjects such as illustrative `rig-sol`, with no inferred binding and no live-seat encoding.

b) Retain all constraints in existing labels/Scope/unit prose and retain the current host-in-id prohibition; choose a different subject id before any adoption.

### DISPLAY - Remove mandatory stored title compatibly

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Readers currently require title, but ordinary names are derivable and the owner wants a smaller definition. Custom labels and report headings must keep their meaning.

**Query:** Approve title removal as the destination, after compatible readers and preserved display overrides?

**Options:**

a) (recommended, confidence medium - feasible from naming rules, but compatibility needs fixture proof) Remove mandatory stored `title` after dual-reading readers can derive names, preserve custom display in optional `label`, expose compatible display projections and fall back visibly to id when metadata is unresolved.

b) Retain required stored `title` as the permanent authoring contract, updating it from display metadata as today.

### THEME - Independent grouping

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Regular is a work level; theme is optional thematic grouping. Requiring `theme: regular` would replace meaningful grouping or require an invented theme.

**Query:** Keep theme independent and derive a Regular work display group from level?

**Options:**

a) (recommended, confidence high - preserves both meanings without extra metadata) Keep optional/null `theme`, validate supplied theme slugs, and derive regular grouping from `level`; impose no regular-theme invariant.

b) Make regular level imply `theme: regular`, deliberately replacing independent grouping for those packages and requiring a separately authorised real theme definition.

### ROUTING - One exclusion source

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Description already includes exclusions at register depth. A separate `not_for` could improve authoring clarity but has no demonstrated routing gain and risks hidden or conflicting boundaries.

**Query:** Keep the combined description as the proposed routing contract?

**Options:**

a) (recommended, confidence high - simplest design matching the actual reveal boundary) Retain purpose, Takes and Not for in `description`, the combined soft 500-character budget and Scope collision handling; add no anti field in this design.

b) Introduce optional text `not_for` as the sole exclusion source when present, with positive-only authored description, a combined legacy projection and the same total soft budget; migrate all register readers before conversion.

### STREAM9-SHA - Define the bare SHA-256 boundary

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · since 2026-10-28; parked pending owner boundary, source STREAM9-SHA and the masked source review. · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** A bare hexadecimal SHA-256 can collide with an otherwise valid work identifier. The source review did not establish a high-confidence grammar-wide exemption. Filename and source-linked work references must retain precedence. No classifier change was delivered and no HNR source was inspected.

**Query:** What context should distinguish a bare checksum from a work identifier without suppressing a genuine identifier?

**Options:**

a) (recommended, confidence high - retains the existing hard boundary until the ambiguous case is defined) Keep the classifier change held; qualify a context-specific rule and negative examples before implementation.

b) Bring the exact bare-identifier ambiguity to an owner design decision before qualifying a patch; no general hexadecimal exemption is selected.

### GATE-BASELINE-COMPARATOR - Define inherited-finding equivalence

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · since 2026-10-28; parked until a source-grounded comparison can be reviewed, source GATE-BASELINE-PREFLIGHT. · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The routed approval asks that inherited origin/main findings be distinguished from regressions. The current preflight hard stops still apply; an exact baseline comparator, its identity/provenance and refusal cases have not been settled. A prose clarification cannot silently waive all existing WARN/FAIL findings. The sibling-worktree half already belongs to Tools under GATE-BASELINE-SIBLING.

**Query:** What exact evidence establishes that a finding is unchanged from the declared baseline, while preserving hard stops for new, changed or uncomparable findings?

**Options:**

a) (recommended, confidence high - preserves the approved goal without weakening an undefined guard) Retain current hard stops until the narrow comparator and refusal evidence are qualified; keep this a held method need.

b) Revisit the approved approach with the owner before defining comparator semantics. No baseline-wide exemption is adopted.

### DUE-FIELD - Add an optional due date to roadmap records

area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`) · since 2026-11-01 · from personal.reg.acquire-intake (ROADMAP-DUE-FIELD) · blind review 1 November 05:36 GMT differs · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Acquire's restructure, which Kris accepted on 1 November ("restructure now"), stages work to be done as unnumbered roadmap drafts with a due date for the receiving Capital's Streams. Roadmap records have no `due:` field today, and Personal already works around its absence. Adding an optional field changes the roadmap standard and its checks, and every reader that lists records could show it.

The blind review prefers neither option as written: it would add no new field but use the roadmap's existing structured target mechanism, rather than a prose-only note in the body.

**Query:** Should roadmap records gain an optional `due:` date?

**Options:**

a) (recommended, confidence medium - it serves a decided need at little cost, being optional, but no one has yet said how a due date interacts with horizons and the owner queue) Yes: add an optional `due:` ISO date to the record front matter in `ki-work-roadmap` and its checks, with no effect on horizon or ordering until Kris says otherwise.

b) No: keep due dates in the record body, as Personal does now.

c) (the blind review's view) Add no field; record the date through the roadmap's existing structured target mechanism.

### HNR-OFFLINE - Make an offline audit truly offline

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-11-01 · from run/hnr-conflicts (HNR-CONFORM-FRICTION) · blind review 1 November 05:18 GMT · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Setting `KI_REPO_OFFLINE=1` makes `ki repo audit` skip GitHub, but only in the `ki-repo` part of the audit. The engineering part's dependency check still runs `bun outdated` and fetches from the npm registry, the public package index ([audit-evidence.ts](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-engineering/scripts/rubric/contexts/audit-evidence.ts), around line 942). The written rule ([ki-repo-project standard](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/repo-structure/ki-repo-project/references/standards-project-repository.md)) only ever promised offline behaviour for the `ki-repo` collector, so the tool does what it says. But anyone setting the switch on a whole audit expects no network, and the HNR run broke its no-network brief without meaning to. The engineering check already handles an unreachable registry gracefully, as "freshness unknown". No recorded decision covers it. Nothing in HNR is at fault.

**Query:** Should the offline switch cover the whole audit, so the dependency check reports "not checked offline" rather than reaching npm?

**Options:**

a) (recommended, confidence high - the source shows the gap directly, the fix only skips work the check already treats as optional when the registry is unreachable, and nothing in HNR needs to change) The harness gives way: every skill's audit honours the offline switch, and the dependency check reports "not checked offline" without running `bun outdated` or calling the registry. The fix goes to the harness owner through KI main State of play; Tools burndown owns any `ki` CLI change.

b) Keep the switch scoped to GitHub, document that, and run future offline passes only where network access is blocked at the machine.

### HNR-MJS - Let rule BUN-2 accept the boundary config DESIGN-2 now allows

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-11-01 · from run/hnr-conflicts (HNR-CONFORM-FRICTION) · blind review 1 November 05:18 GMT · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** HNR asked for, and the harness delivered on 29 October (`9feb9581`), support in design rule DESIGN-2 for a boundary rules file written as `.dependency-cruiser.mjs`. A boundary rules file is the configuration of the tool that blocks forbidden imports between parts of the code. HNR needed `.mjs` because the file must load under plain Node 22 (Home `5e61a77`, 25 October). Rule BUN-2 still fails every tracked `.mjs` file and tells the repository to rename it to `.ts`, which undoes the fix. Eight HNR sites hit this.

**Query:** Should BUN-2 exempt the boundary rules file that DESIGN-2 has selected?

**Options:**

a) (recommended, confidence high - the harness approved `.mjs` for this file five days ago, and BUN-2 was simply not updated to match) The harness gives way: BUN-2 skips the selected `.dependency-cruiser.mjs`, keeping its ban on every other `.mjs` file.

b) Withdraw the 29 October support and have HNR move to `.dependency-cruiser.ts`, accepting the Node 22 loading problem HNR fixed with `.mjs`.

### HNR-PROOF - A boundary failure proof for Bun-tested sites

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-11-01 · from run/hnr-conflicts (HNR-CONFORM-FRICTION) · blind review 1 November 05:18 GMT · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** DESIGN-2 proves the boundary checker really works by disabling a rule and confirming a test then fails. Its proof runner accepts only Vitest, a test framework ([boundaries.ts](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-engineering/scripts/rubric/contexts/boundaries.ts), around line 368). The engineering standard says Vitest is "recommended, not mandated" and allows `bun test`. All nine HNR sites run `bun test ./test` in `apps/site`, and the conform run found three where this blocks the proof. The audit's own message offers the alternative of "a runner-appropriate proof adapter". This was routed to the harness owner on 25 October as HARNESS-DEFECTS, in Baseline rollout's messages, which is on hold.

**Query:** Should the harness add a Bun proof adapter rather than HNR moving its sites to Vitest?

**Options:**

a) (recommended, confidence high - the standard explicitly lets a repository choose Bun's test runner, and the checker already names an adapter as the remedy) The harness gives way: DESIGN-2 gains a Bun test proof adapter, and HARNESS-DEFECTS is released from Baseline rollout's hold to the harness owner for this item alone.

b) HNR moves its site tests to Vitest to satisfy the current proof.

### HNR-SITE-SHAPE - Split the 74 website findings before anyone redesigns

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-11-01 · from run/hnr-conflicts (HNR-CONFORM-FRICTION) · blind review 1 November 05:18 GMT · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The website content skill prescribes one Eleventy site layout: the source folders, JSON5 and TypeScript data loaders, a Tailwind build hook, a watch target and the Tailwind import pair (rules WEB-9 and WEB-12 to WEB-19). HNR's own [sites standard](/Users/krisbrown/kis/humans-not-robots/hnr-principal/+/_WORK/hnr.sop.sites/design/sites-standard.md) of 22 October, written after Kris asked for the sites to be "conformant", lists "Content or build" as a gap to close on every site. It already answers WEB-19 locally with the phase3 stylesheet composition, and records only three exceptions (APEX-PLAIN, demos' appearance and testbed's legacy hosting). Its "Lines for Knowledge Islands" ask the harness to name its local answers. So the conform report's "deliberate HNR layouts" holds only for a few things: home's single hand-written page, Stoa-vendored or mirrored content, and WEB-14 demanding JSON5 where none exists (already routed to the harness on 25 October). The harness already has a way to record a per-repository exception with its reason: a `[skills.<skill>.checks]` table in `.ki.toml`. No one has sorted the 74 findings rule by rule.

**Query:** Should one read-only run sort the 74 findings into planned HNR gaps and real variants, with only the variants going to the website standard's owner?

**Options:**

a) (recommended, confidence high - reviewed; HNR's recorded standard points to conforming for most rules, but the rule-by-rule split has not been made, so the size of the variant set is unknown) Neither side gives way wholesale. A read-only run sorts the 74 by rule. Findings HNR's standard already plans to close go to the site Projects as owner work. Real variants (home's single page, vendored content, JSON5 with no JSON5 data) go to the website content skill's owner, to become a named variant in the standard or a recorded per-repository exception with its reason. HNR's eight "Lines for Knowledge Islands" travel with them.

b) The harness website standard first defines variants for portal and landing sites, and HNR conforms only after that.

c) HNR conforms every site to the current single layout, home included.

### HNR-DR-LINKS - Infoschematics decision records linking outside their collection

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-11-01 · from run/hnr-conflicts (HNR-CONFORM-FRICTION) · blind review 1 November 05:18 GMT · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Since 7 and 8 October (`b4a8a6f6`, `60b1da92`), harness rule BODY-11 fails a decision record that links to anything except another decision record or an external web address. The aim is a self-contained record that reads fully without chasing links that can break, naming other material in its own words instead. Infoschematics has 26 of its 54 records carrying 76 such links, written mostly in September: 61 to `docs/reference/vocabulary.md` and 15 to specs. Its orientation file, [AGENTS.md](/Users/krisbrown/kis/humans-not-robots/infoschematics/AGENTS.md), asks for a vocabulary link when "a guide, design document, or specification" first uses a term. Decision records are not on that list, so on its own wording there is no direct conflict. But Infoschematics' [docs README](/Users/krisbrown/kis/humans-not-robots/infoschematics/docs/README.md) says its documents "should link to one another rather than repeat one another", which pulls the other way. Each vocabulary term has a stable id, so a record can name the term and its id without a link and without copying the definition. No recorded decision settles this.

**Query:** Should Infoschematics' decision records name vocabulary terms and specs in plain text, rather than the harness allowing links to them?

**Blind review:** differs, preferring a narrow allowance for supplemental links to the repository's declared canonical vocabulary and specifications, keeping the rule that a decision reads on its own.

**Options:**

a) (recommended, confidence medium - the harness rule is deliberate and recent, and Infoschematics' own orientation does not require links in decision records, but its link-rather-than-repeat principle is also deliberate and Kris has not weighed the two) HNR gives way: each record names the term with its stable vocabulary id (for example "Flow (`flow`)") and names the spec, with no link and no copied definition. The `references/` folder moves out of `docs/decisions/` under the same rule, and the docs README notes that decision records are the exception to its linking principle. This is owner work routed through HNR main State of play, as Infoschematics has no package of its own.

b) The harness gives way narrowly: BODY-11 allows links to a repository's declared canonical vocabulary and specifications, which are stable, and fails the rest.

c) Record a per-repository exception for BODY-11 in Infoschematics' `.ki.toml`, with its reason.

### LINK-EXTERNAL - Decide the external linked-target boundary

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-10-28; parked until owner boundary decision, source THREAD-HOME/LINK-CHECKER. · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Shared LINK-1 now follows contained linked directories and contained absolute filesystem paths, with outside-byte/refusal checks. Targets outside the selected root are still excluded. This does not clear the reported HNR sibling-tree findings; no HNR source was inspected or changed.

**Query:** Should a future resolver follow a separately declared external target, and under what explicit source-access and containment contract?

**Options:**

a) (recommended, confidence high - preserves the tested containment boundary and confidential-source guard) Keep external targets held and the contained partial unchanged until the access contract is decided.

b) Ask the owner to define a bounded external-target model before any source discovery, traversal or implementation.

### STREAMS-CHECKER-GAP - The Streams checker cannot see the migrated fields

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since before 25 October 2026 · from run/fields-personal-principal · from stocktake · blind review 1 November, which found the gap still in the source · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The Streams checker does not warn on a retired horizon, on `initiative` or on a theme beside a Project, and it lists `initiative` as a known field. The review found it also does not warn on an adopted record with no kind. The migration window in [GDR-KI-PRINCIPAL-016](/Users/krisbrown/kis/knowledge-islands/ki-principal/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-016-priority-and-size-on-work-records.md) says the checkers warn on all of these and closes on "a complete scan of that inventory showing no gaps", so a scan of Streams Capitals would wrongly report no gaps. This matches VALIDATOR-PARITY, which the tools-burndown work holds.

**Query:** Should the coordinator route this gap to the harness owner before the remaining Streams migrations?

**Options:**

a) (recommended, confidence high - reviewed; the before and after audits gave the same warnings, and the checker's source has no rule for these shapes) Route it now as a message line to the harness work that owns the checkers, copied to the tools-burndown work, naming the missing-kind warning too. Each remaining field run proves its result with a front-matter scan, and no migration window is declared closed from a clean checker result or one Capital's scan.

b) Fold it into the next harness release run, and carry on with the front-matter scans meanwhile.

### AREA-COLUMN - publish the existing area reading aid?

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Irreducible hold:** `standards-compatible-harness.md` under `skills/repo-structure/ki-repo-harness/references/` explicitly calls areas a diagram reading aid rather than a published skill fact. Its marker-bounded README catalogue derives from frontmatter; `capability-publication.ts` has no area projection. The original blind review recommended extending this boundary, but that recommendation was never accepted. Existing area values avoid a new taxonomy/schema design; publishing them as a stable consumer contract still needs the choice below. A release is not the blocker.

**Delivered partial:** The immutable-ref local catalogue adapter is committed in website `2c15168`; Primary baseline received and final facts (27 October 07:03 GMT) records its integration, focused replacement evidence and the closed factual catalogue correction. The earlier dispatch and verification instructions are complete. They do not authorise the README publication extension below.

**Parked:** README publication remains outside the two independently qualified local website units; release when Kris decides the consumer contract.

**Context:** The current contract deliberately keeps areas outside published skill facts. The parked recommendation would make the harness README a stable consumer boundary. Local sync alone does not authorise that change; the two direct units and local-input partial can proceed independently.

**Query:** May the harness publish the existing area membership as a generated README reading aid and have the website consume it, without changing applicability or dependency semantics?

**Options:**

a) (recommended, confidence high - reuses the existing model and removes generator-code coupling, with the contract change explicit) Approve that bounded publication extension, then qualify exact harness generator/contract/test paths and the website parser/provenance companion paths. Use local immutable commits and local sync; no release cycle.

b) Retain the diagram-only publication boundary and the current finder/parser coupling; deliver only the independently qualified units above.

### DRYRUN-SCOPE - Which commands must dry-run by default

area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers) · since 2026-11-02 · from run/dry-run-survey (DRY-RUN-FLAGS) · blind review 2 November agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** DRY-RUN-FLAGS says "any command that changes something dry-runs by default", while the relayed message says it is to be rolled out "where they have dry runs". The survey shows the difference is large. About 20 commands already preview or have a `--dry-run` and convert cleanly. About 40 more change things with no preview at all because their name is the change itself: `ki agent launch`, `ki repo init`, `ki harness install`, `ki agent send`, `techne host start`, `mgit sync`. Read literally, every one of these, and every brief, script and coordinator step that calls them, would need `--no-dry-run` added. `rig apply` and `rig upgrade` sit between: they reconcile the machine against declared state, like a repair, so they fall in scope either way. This recommendation has not been through a blind review. The blind review agrees, adding that each command should be classified explicitly in a published table, by its effects rather than its name, and that a preview must never be taken as delivery.

Merged from CLI-PREVIEW, parked in ki.prj.ways-of-working under the 27 October bulk reading: whether public state-changing commands write by default and preview with `--dry-run`; a fleet-wide tool convention while tools are not ready and releases are deprioritised. Recommended: write by default, `--dry-run` and `-n` preview, both standards reconciled first and each tool changed through its own work. Parked under the 27 October bulk reading; comes back when a repair command is next touched.

**Query:** Should the dry-run default apply to every command that changes anything, or only to commands that work out a set of changes from current state?

**Options:**

a) (recommended, confidence high - reviewed; it covers every command where a preview tells you something you did not already ask for, including `rig apply`, without adding `--no-dry-run` to every agent launch and install; not yet blind-reviewed) Apply it to commands that compute what to change from current state: repair, conform, converge, sync-style reconcile, apply, upgrade, migrate, prune, sweep, register, receive or release in batches, and bulk delete. A command whose name is one explicit action the caller asked for (launch, queue, send, init, install, start, stop, commit) acts by default and keeps `--dry-run` as an opt-in preview where it has one.

b) Apply it literally to every command that changes anything, including launch, init, install and send, so the rule has no exceptions.

c) (from CLI-PREVIEW) Public state-changing commands write by default and preview with `--dry-run` and `-n`, both standards reconciled first and each tool changed through its own work.

### FINISH-HOLD - Hold the final close-out of ki.prj.ways-of-working until Kris is back

since 2026-11-07 · from run/absorb (ki.prj.ways-of-working absorption, ABSORB-STEWARD a)) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** Under ABSORB-CLOSE, the plan's last steps set the package to `finished`, change the [Ways of working Project note](/Users/krisbrown/kis/knowledge-islands/ki-principal/Streams/Projects/ways-of-working.md) from `active` to `completed`, and delete the folder. Those steps need Kris's word `finish`. They also touch knowledge the away window excludes: the Project note links six notes in the folder, the [Work Process note](</Users/krisbrown/kis/knowledge-islands/ki-principal/Pillars/Philosophy/Model/Processes/Work Process/Work Process.md>) and `Pillars/Engineering Practice/Foundations/Principles.md` link the folder and its log, and [KI-PRINCIPAL-MOD-011](/Users/krisbrown/kis/knowledge-islands/ki-principal/Streams/Roadmap/KI-PRINCIPAL-MOD-011-amend-work-model-assigned-package-cascade.md) links two `work-model/` notes. Deleting the folder would break all of those links unless they are first repointed to a pinned GitHub revision. The work this run could do without those edits is done, and committed.

**Query:** Should the finish, the link repointing and the folder deletion wait for Kris's return and his `finish`, as one bounded run?

**Options:**

a) (recommended, confidence high - the away window excludes Streams and Pillars edits, and the plan itself asks for Kris's `finish`) Wait. When Kris is back and says `finish`, after the guild has placed A1 to A9, one ki-principal run repoints the links to ki-principal `d8ab8112`, marks the Project note completed with its outcome pointing to ki.reg.guilds, closes the run groups and deletes the folder.

b) Close the package now, leave the folder and its links in place, and delete the folder later.

### WOW-NAMING-FILES - The two untracked reports in the old package

since 2026-11-07 · from run/absorb (ki.prj.ways-of-working absorption, ABSORB-STEWARD a)) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** `reports/wow-naming-reader-remedy.report.md` and `reports/wow-naming-thread-priority.report.md` are untracked files, written at 16:57 GMT on 6 November by an earlier run. They still use the old `~/workspaces` paths. The plan says to check that their outcome is homed ([KI-TOOL-KI-CLI-174](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-174-typed-work-naming-readers.md), [KI-HARNESS-GOV-233](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/KI-HARNESS-GOV-233-typed-work-naming-readers.md)) and then remove them. This run did not touch them, because the rules forbid touching another session's uncommitted files. While they are there, the run-close gate refuses, since the thread folder is not clean, and the folder cannot be deleted.

**Query:** May a later run check their outcome against the two records and delete them?

**Options:**

a) (recommended, confidence medium - not blind-reviewed; both records are done and accepted, but nobody has compared the reports with them yet) Yes: the closing run compares each report with its record, deletes the two files if the outcome is there, and otherwise commits them into the folder first so Git keeps them.

b) Commit both into the folder now so Git keeps them, and let them go with the folder.

### PROTECTED-STILL - PROTECTED-PUBLICATION's drop check failed

since 2026-11-07 · from run/absorb (ki.prj.ways-of-working absorption, ABSORB-STEWARD a)) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** ABSORB-DROPS a) drops PROTECTED-PUBLICATION only after one check: that ki.prj.observatory's disposition line has gone. It has not gone. [ki.prj.observatory's Inbound](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.observatory/messages.md) still holds the IMPORTANT PROTECTED-PUBLICATION line of 29 October, which holds Principal publication. The stack it protected has since been published in ki-principal `7109c998`, and the Z reports were deleted under Z-HISTORY. The query stays parked in the old package for now.

**Query:** What should happen to PROTECTED-PUBLICATION now that its drop check has failed?

**Options:**

a) (recommended, confidence medium - not blind-reviewed; it follows the plan's own check, but the Observatory decides about its own line) Send ki.prj.observatory one line saying the protected stack was published in `7109c998` and asking it to dispose of its IMPORTANT line. Drop the query once that line has gone.

b) Move PROTECTED-PUBLICATION unchanged to the guild as an open query.

### RUN-GROUPS - Two more ways-of-working run groups the plan does not name

since 2026-11-07 · from run/absorb (ki.prj.ways-of-working absorption, ABSORB-STEWARD a)) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`

**Context:** The plan closes three run groups: `ki-project-ways-of-working`, `ways-of-working-reg` and `ways-sol-resume-20261029`. This run also found `ki-prj-ways-of-working` (729 files) and `ways-of-working` (5,480 files) in `~/.local/state/ki/agents/`, both tied to this package. Some of these groups record their work home under the old `~/workspaces` path, which no longer exists, so a close needs `--repo` pointing at ki-principal. Under CLOSE-WAIVER a) the gate stays strict, and their temporary folders must be emptied before a close can pass.

**Query:** Should the closing run also retire `ki-prj-ways-of-working` and `ways-of-working` under the same strict gate?

**Options:**

a) (recommended, confidence medium - not blind-reviewed; they belong to the same package, but their contents have not been inspected) Yes: the closing run inspects them, homes anything still live and closes them with `--repo` under the strict gate. Any it cannot clear are reported.

b) Leave them out of this close-out and raise them separately.

- DOCKET-HOME: what a D12 Docket item is; recommended a) (low) an action card in the declaring repository's actions area pointing at the item, the `D12/12 Docket` label marking it; the blind reviewer preferred leaving it out of the first version. Kris, 7 November: "not sure, come back later".
- ACQUIRE-ROUTE: acquisition items (GRANOLA-CAPTURED-SKIP MSG-6620cbb7, GRANOLA-COUNT, CHECKSUMS-SETTLED, ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE) to ki.reg.main via State of play; recommended a) high. Kris, 7 November: "We can come back to that later." The full ACQ-HOLD-WORDING, ACQ-SCAFFOLD-NOTE, ACQUISITION-PROCESS-APPROVE, CHECKSUMS-SETTLED and GRANOLA-COUNT blocks, absorbed from ki.prj.ways-of-working, are below.
- LINT-WHERE - where generated Markdown gets linted; the check-only staged hook of 26 October stops a bad report at commit with CI the backstop, and a generator check is extra machinery. Recommended: check-only in the generator, after FORM-VS-RUMDL. Parked under the 27 October bulk reading; comes back if bad reports still reach `+/_WORK`. Area: Skills: Coordination (`ki-coordination`, `ki-delegation`, `ki-git`); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- PACKAGE-FORWARDING - PKG-POINTER original request preserved at bcb3c1a3:+/_WORK/ki.ways-of-working/messages.md and the Principal enactment report. Owner approved one authoritative package and a Capital discovery reference; principal-only message forwarding remains separate design before any relay or second queue is built. Area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- STATE-MACHINE-DECISIONS - Open choices remain in [work-state-machine.md](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/work-model/work-state-machine.md). Recommended: settle them with the rollout. Area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- ENACTMENT-ADMIN - the 20 October tiered/Admin-only gate-narrowing choice remains unmade; retain the current gate. Full original decision is retained in decisions.md. Area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- UNATTENDED-FIELD - recording unattended eligibility on records; a new record field with reviews disagreeing while the roadmap is cut to next to nothing. Recommended: adopt the optional `unattended` mapping and criteria. Parked under the 27 October bulk reading; comes back if a window plan needs it. Area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- UNATTENDED-AND-DUE-DATES - adopting the eight criteria as the unattended assessment; the due-date half is done and the criteria stay Personal's prototype. Recommended: adopt the criteria in `ki-delegation`, leaving UNATTENDED-FIELD to decide where the verdict is recorded. Parked under the 27 October bulk reading; comes back with UNATTENDED-FIELD. Area: Skills: Work lifecycle and Work records (`ki-work-package`, `ki-work-roadmap`, `ki-next`, `ki-plan`); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- LEGACY-PREFIX - whether a `repo_code` rename stays a one-sweep change; renames are rare and Personal's runs as one sweep, while an allowance costs two checkers and tools-ki. Recommended: write the one-sweep rename into `ki-work-roadmap`. Parked under the 27 October bulk reading; comes back at the next rename. Area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- PARTIAL-REPOS - how a repository with only Pillars and Resources fits the model; Kris's own words defer it and HNR's tracked-notes workaround holds. Recommended: record the idea on the Ways of working Project note and open a `ki-work-design` brief when Kris takes it up. Parked under the 27 October bulk reading; comes back when Kris opens it. Area: Skills: Design and repository structure (`ki-repo`, `ki-engineering`, `ki-decision-records`, website and Streams checkers); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- STEWARD-FIELD - where a package records who looks after it; reviews disagree, the harness carries the model with a marked placeholder and the Valle Armonia pilot runs on `worker` as it is. Recommended: a new dedicated field taking `work/<id>` values only. Parked under the 27 October bulk reading; comes back if the pilot needs it. Merged with ROLE-FIELDS, which ROLES-WRITE (7 November) took as recommended; the standard still marks the steward field as a placeholder awaiting Kris (STEWARD-FIELD stays undecided); absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112`.
- DEPS-HOLD: held for ki.prj.estate-factorisation's parked DEPS-HOLD, ACKed to ki.sop.main by ki.prj.ways-of-working; the message as received: 2026-11-07 · MSG-35f55f3c DEPS-HOLD · from KI > SoP (🏛️ 🔑 ki.sop.main) · 04:04 GMT · Estate factorisation is retiring under PROJECT-CLOSE a) (Kris, 25 October) and ESTATE-CLOSE a) (Kris, 7 November), per [the retirement note](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/_emerging/estate-factorisation-retirement.md): [ki.prj.estate-factorisation](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.estate-factorisation/discussions.md)'s parked DEPS-HOLD stays with you, the work that reported it: the four overdue development-tool patch updates blocking store-repair review and release checks. Reply as one line in ki.sop.main's Inbound, starting `ACK MSG-35f55f3c`.

### IDEAS-REVISIT - Where a future idea lives

since 2026-11-01 · from IDEAS-ROADMAP-PRINCIPLE in the interactive pass; replaces it · to shape with the empty-board design · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** On 31 October Kris said "future ideas could go into the knowledge graph in a way, rather than saying these are things which we're enacting for now" (IDEAS-IN-GRAPH). On 1 November Kris was no longer sure what was meant: ideas may relate to roadmap items, ways of working, work packages and Projects, and perhaps a future idea is "just part of a card at the bottom of it ... things we need to go away and look at in the future in respect to this area". The roadmap standard still offers `Idea:` bullets and `_IDEAS.md`; the capture skill follows IDEAS-IN-GRAPH. IDEAS-HOME in the empty-board design is still open.

**Query:** Where should a future idea live?

**Options:** to be drafted by the empty-board design and reviewed before it comes back; candidates are a "future" section at the foot of the card, Project or work package it concerns, future concepts in the knowledge graph, and the roadmap's idea places as now.

### PARKED-TO-IDEAS - Sort parked queries into ideas and live decisions?

since 2026-10-31 · from run/ideas-board · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** 120 parked queries sit in nine packages with no age limit; several point at records that no longer exist, and eight here are duplicated. A parked query nobody is making is in effect an idea, but the review found that some parked entries are live approval gates tied to owned work, which an ideas list would lose. The package standard keeps parked queries in full, each with its reason and release. Moving the ideas out is now a separate part, PARKED-TO-IDEAS-MOVE.

**Query:** At each package's next mark, should each parked query be sorted into a future idea or a live decision kept with its work?

**Options:**

a) (recommended, confidence high - reviewed; the review agrees once each entry is sorted, and sorting changes nothing by itself) Yes: at each package's next mark, sort each parked query into a future idea or a live decision tied to owned work, and mark exact duplicates and those pointing at records that no longer exist for your decision.

b) Keep Parked sections as they are, but offer any parked query older than 30 days for dropping at your next review.

### PARKED-TO-IDEAS-MOVE - Move the sorted ideas out of Parked?

since 2026-11-01 · from the blind review of PARKED-TO-IDEAS · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Once sorted, the future ideas would move out of the Parked sections to the ideas list, each kept whole, with its tag, full context, source, dependencies and recommendation, and checked at its destination before it leaves. Where ideas live is still open under IDEAS-REVISIT. The review agrees with moving genuine ideas but not with removing a Parked section while live decisions remain in it.

**Query:** Should the sorted ideas move to the ideas list, leaving the live decisions parked with their work?

**Options:**

a) (recommended, confidence medium - reviewed; the review agrees for genuine ideas, but where ideas live is still open) Yes: move each idea whole once IDEAS-REVISIT settles where ideas live; live decisions stay parked with their work, and a Parked section goes only when it is empty.

b) Leave the ideas in the Parked sections, sorted and labelled.

### ROADMAP-UPCOMING - Should soon and future records go back to ideas?

since 2026-10-31 · from run/ideas-board · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Records can sit on a roadmap with horizon `now`, `next`, `soon`, `future` or `hold`, and done records stay until pruned; on 31 October 19 of 22 records counted were finished, held, in triage or tied to work that is not moving. The empty-board design proposes that a roadmap hold only `now` and `next`, which needs the roadmap standard and its checker changed in the harness and tools-ki, and other territories use both. This query is now split into three parts: this one, ROADMAP-UPCOMING-HELD and ROADMAP-UPCOMING-CAP. The review disagrees with this part: showing only `now` and `next` as upcoming gives the same focus without dismantling adopted future commitments, and the decision on priority and size, [GDR-KI-PRINCIPAL-016](/Users/krisbrown/kis/knowledge-islands/ki-principal/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-016-priority-and-size-on-work-records.md), allows records outside `now` and `next`.

**Query:** Should `soon` and `future` records leave the roadmap and go back to ideas?

**Options:**

a) (recommended, confidence medium - review disagrees; it is what EMPTY-BOARD asks for, but it changes a standard and a checker that other territories also use) Yes: only `now` and `next` stay on the roadmap, and `soon` and `future` records go back to ideas.

b) Keep the horizons, and show and count only `now` and `next` as upcoming (the review's pick).

### ROADMAP-UPCOMING-HELD - Should held records go back to ideas?

since 2026-11-01 · from the blind review of ROADMAP-UPCOMING · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Under the same proposal, held records would go back to ideas unless their release is in sight within a fortnight. The review disagrees: moving adopted held records into ideas can lose their dependencies, review dates and adoption history, and the fortnight is arbitrary.

**Query:** Should held records leave the roadmap unless their release is within a fortnight?

**Options:**

a) (recommended, confidence medium - review disagrees; it clears the board, but it can lose a held record's history and the fortnight is arbitrary) Yes: held records go back to ideas, keeping their dependencies and release condition in the idea, unless their release is within a fortnight.

b) Keep held records on the roadmap with their release condition (the review's pick).

### ROADMAP-UPCOMING-CAP - How many upcoming records?

since 2026-11-01 · from the blind review of ROADMAP-UPCOMING · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Both the proposal and the review would cap upcoming work, counting only `now` and `next`. The proposal sets three per repository and ten across the territory. The review agreed with a cap but did not test the numbers, and noted that the count must keep work being delivered apart from work awaiting your review.

**Query:** Should upcoming work be capped at three per repository and ten across the territory?

**Options:**

a) (recommended, confidence medium - reviewed in part; the review agrees with a cap but did not test these numbers) Yes: at most three `now` or `next` records per repository and ten across the territory, with work awaiting your review counted separately.

b) Cap upcoming work, with numbers you choose.

c) No cap.

### GATES - Adopt the two gates, apart from the size rule?

since 2026-10-31 · from run/ideas-board · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Section 3 of the empty-board design proposes Gate 1, idea to upcoming: you say yes, it has a home, the next step is known, it is small, and there is room; and Gate 2, upcoming to active: it is Ready, nothing it needs is missing, and the package and the territory have a free slot. Most of these already exist in `ki-next` and `ki-plan`; the new parts are the size rule and the room checks, which rest on WIP-PACKAGE, WIP-TERRITORY and ROADMAP-UPCOMING-CAP. The review agrees with both gates apart from the size rule, now GATES-SIZE, and adds that a bounded investigation whose purpose is to settle an open question must count as having a known next step.

**Query:** Should both gates be adopted, leaving the size rule to GATES-SIZE?

**Options:**

a) (recommended, confidence high - reviewed; most of each gate restates existing rules, and the room checks are easily relaxed later) Adopt both gates without the size rule, with a bounded investigation counting as a known next step and slots counted the same way in both gates.

b) Leave the gates out and keep the current `ki-next` and `ki-plan` rules.

### GATES-SIZE - Should Gate 1 admit only small work?

since 2026-11-01 · from the blind review of GATES · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Gate 1 would admit only small work to upcoming. The decision on size, [GDR-KI-PRINCIPAL-016](/Users/krisbrown/kis/knowledge-islands/ki-principal/Admin/Governance/Decisions/GDR-KI-PRINCIPAL-016-priority-and-size-on-work-records.md), admits `l` and only requires `xl` work to be split before it is Ready, and size measures relative effort, not days. The review disagrees with the size rule: it conflicts with that decision, would lock out work that needs splitting after adoption, and the design mixes days with effort.

**Query:** Should Gate 1 admit only small work?

**Options:**

a) (recommended, confidence medium - review disagrees; it keeps upcoming work small and is easily relaxed, but it conflicts with GDR-KI-PRINCIPAL-016) Yes, as written, amending GDR-KI-PRINCIPAL-016 to match.

b) No: keep GDR-KI-PRINCIPAL-016's rule that `xl` work is split before Ready, so larger work can be adopted and split later (the review's pick).

### WIP-PACKAGE - How many units may a package have in flight?

since 2026-10-31 · from run/ideas-board · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** Overnight this package ran up to three units at once, as the current "keep about three agents running" rule allows. You asked for one at a time where possible, finished quickly. A unit's independent review is a separate run, but it works on the same change.

**Query:** How many units may one work package have in flight at a time?

**Options:**

a) (recommended, confidence high - reviewed; one unit limits competing changes, and allowing its review keeps reviews independent without a second piece of work) One unit at a time, plus at most one independent review of that same unit, as a trial: the review works on a fixed version of the change, and a unit may not be a bundle of separate changes.

b) One unit at a time with nothing alongside it, reviews included.

c) Up to two units at a time where they touch different repositories.

### WIP-TERRITORY - How many packages may be active across the territory?

since 2026-10-31 · from run/ideas-board · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with KNW-005 (where ideas live, work-in-progress reset, held in `state.md`); design in [empty-board.design.md](skills/empty-board.design.md) and [empty-board-ideas.md](skills/empty-board-ideas.md)

**Context:** The current cap is "three or four" Project packages, not counting State of play, and it already counts packages waiting on you, leaving out only those on hold or finished. Today five Project packages are neither on hold nor finished, one being worked and four waiting on you.

**Query:** How many work packages may be active at once across the Knowledge Islands territory?

**Options:**

a) (recommended, confidence high - reviewed; counting work waiting on you stops the cap being met by sending more to you, and a trial is easily relaxed) At most three Project or regular packages, plus State of play, with packages waiting on you counting as active, as a trial: no package is closed or held automatically to meet it, packages over the cap are drained or held one at a time by your choice, and secondary State of play and ad hoc work are counted explicitly.

b) One package at a time, plus State of play: strictly serial.

c) Keep the current "three or four" Project packages, still counting packages waiting on you.

### HOLD-CLOSE - Close packages held more than 14 days?

since 2026-10-31 · from run/ideas-board · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with HOLD-TIDY (held in `state.md`, waiting on TRANSFER-SOP-QUERIES); HOLD-STATES has landed (`84b28fc6`, `6dca3174`)

**Context:** Nine packages are on hold, six of them since 18 to 20 October. Closing a held package would home its decisions, move its messages and parked queries to the ideas list and remove its folder, leaving the Project `paused`; reopening means creating a fresh package. Several hold live handoffs, such as the ORCA-ENV-LEAK security fix waiting in tools-burndown; where new messages for a held package go is now HOLD-ROUTE. The review disagrees: age alone does not show a package is finished or safe to remove, so it would have State of play review each held package and propose release, close or keep, with no deadline.

**Query:** Should a package on hold for more than 14 days be closed out?

**Options:**

a) (recommended, confidence low - review disagrees; it clears the board fastest, but closing a package is hard to undo cleanly and several held packages hold live handoffs) Yes, after you have seen what each would close, one package at a time.

b) No age rule: State of play reviews each held package at its next mark and proposes release, close or keep, one at a time (the review's pick).

c) Keep held packages as they are.

### HOLD-ROUTE - Send new messages for a held package to State of play?

since 2026-11-01 · from the blind review of HOLD-CLOSE · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with HOLD-TIDY (held in `state.md`, waiting on TRANSFER-SOP-QUERIES); HOLD-STATES has landed (`84b28fc6`, `6dca3174`); partly settled by SOP-ACTS-FOR-IDLE (State of play acts on an idle package's messages)

**Context:** While a package is on hold it still receives messages it cannot act on, such as the ORCA-ENV-LEAK security fix waiting in tools-burndown. The review proposes that new messages for a held package go to State of play instead, naming the original destination on the line, so State of play can reassign the work or ask for the hold to be released.

**Query:** Should new messages for a package on hold go to State of play?

**Options:**

a) (recommended, confidence medium - the review picks it and it stops urgent work waiting behind a hold, but it changes a message route other works rely on) Yes: a sender finding its target on hold sends the line to State of play's `messages.md`, naming the original destination, and State of play reassigns it or asks you to release the hold.

b) Keep sending to the held package, as now.

### E2E-ADOPT - Review and land the draft

since 2026-11-02 · from run/ki-e2e-draft (E2E-WAY) · blind review 2 November differs · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with APP-SKILLS (held in `state.md`), which names the `ki-e2e` draft; E2E-WAY is in `decisions.md`

**Context:** The skill is drafted on the local branch `ki-e2e`, two commits ahead of `main`, with tests, type check and audits passing. The brief asked for it unpublished, for your review. Under this repository's way of working, an approved change is fast-forwarded into `main` and then pushed.

The blind review prefers b): try it in one real site first, running SETUP and EVIDENCE with the pinned runner, before landing it in the harness.

**Query:** Should the `ki-e2e` branch be fast-forwarded into `main` once you have reviewed it?

**Options:**

a) (recommended, confidence medium - the checks pass, but the versions have not been checked against the package itself) Review it, then have a run fast-forward it into `main` and push. Remove the worktree and branch afterwards.

b) First have a run install e2e 0.22.0 in a test site and try SETUP and EVIDENCE end to end, then decide.

### E2E-KIND - Process skill now, or a governance standard with checks

since 2026-11-02 · from run/ki-e2e-draft (E2E-WAY) · blind review 2 November agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with APP-SKILLS (held in `state.md`), which names the `ki-e2e` draft; E2E-WAY is in `decisions.md`

**Context:** I drafted `ki-e2e` as a process skill: it runs only when asked for, and has no automatic checks. A governance skill would add automatic checks, for example that the versions are pinned, telemetry is off and the output folder is ignored. Those checks would then run in the audit of every site that declares the skill, but they need a set of check definitions written in code first.

**Query:** Should `ki-e2e` stay a process skill for now?

**Options:**

a) (recommended, confidence high - reviewed; the practice is one pilot old, and checks are easier to add once a second site has used it) Keep it a process skill for now. Capture a later work item to turn it into a governance skill with checks once two sites use it.

b) Turn it into a governance skill with automatic checks before it lands.

### E2E-OFFRAMP - Have the neighbouring skills point to ki-e2e

since 2026-11-02 · from run/ki-e2e-draft (E2E-WAY) · blind review 2 November agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with APP-SKILLS (held in `state.md`), which names the `ki-e2e` draft; E2E-WAY is in `decisions.md`

**Context:** `ki-e2e`'s description sends unit testing to `ki-engineering` and site structure to `ki-repo-website`. Neither of those skills mentions `ki-e2e` yet. The skills standard asks for each pair of overlapping skills to point to each other, but editing other skills' descriptions was outside this brief, and the audit did not flag it.

**Query:** Should `ki-engineering` and `ki-repo-website` gain a one-line pointer to `ki-e2e` for browser tests?

**Options:**

a) (recommended, confidence high - this is what the skills standard asks for, and it is a small text change) Yes, add it in a follow-up commit on the same branch before it lands.

b) Leave them as they are.

### E2E-HELPERS - How sites get the helpers

since 2026-11-02 · from run/ki-e2e-draft (E2E-WAY) · blind review 2 November agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with APP-SKILLS (held in `state.md`), which names the `ki-e2e` draft; E2E-WAY is in `decisions.md`

**Context:** The helpers are in the skill's `assets/`, and a site copies them unchanged into its `e2e/` folder. Copies can drift from the skill's version. A shared package would avoid that, but publishing a package needs your approval.

**Query:** Are copied helpers acceptable for now?

**Options:**

a) (recommended, confidence high - reviewed; it avoids publishing anything, and the files say not to edit them) Yes, copy them for now. Revisit with a drift check, or a pinned Git reference, once several sites use them.

b) Make them a shared package now.

### ORCA-CODEX-WAKE - Whether a Codex coordinator can be woken by Orca

since 2026-11-01 · from run/orca-adapter (ORCA-LAUNCHER) · blind review 1 November 05:25 GMT · proposed to close · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · joins the guild's Orca set (held in `state.md`); its own option a) proposes closing it; notes in [orca-fit.md](skills/orca-fit.md) and [orca-subagents.design.md](skills/orca-subagents.design.md)

**Context:** On 1 November Kris answered CODEX-WAKE a): one attended trial with Kris watching, to be arranged when Kris is at the machine, and meanwhile a Codex coordinator checks its inbox only when Kris writes. That trial has not run. The draft says a Codex coordinator does not rely on Orca's wait until a wake is proved. The delegation standard already requires a wake to be proved on each runtime before it is relied on, so the draft only restates that. The review agrees, and finds no new decision is needed to obey a rule that already exists; workers succeeding under Codex does not show that a Codex coordinator can be woken.

**Query:** Should this close, with the draft keeping its interim rule until the CODEX-WAKE trial proves a wake?

**Options:**

a) (recommended, confidence high - reviewed; the rule relies on nothing unproved and the standard already requires it) Close it: the draft keeps its interim rule, and the later trial must show a detached, time-limited wait that wakes the right Codex session without losing messages across a timeout and re-arming.

b) Drop the interim rule from the draft and leave the matter to the CODEX-WAKE trial alone.

### ACQ-HOLD-WORDING - Acquire's text does not yet say when cards leave

since 2026-11-01 · from run/acq-recheck · blind review 1 November 05:36 GMT agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with the parked ACQUIRE-ROUTE (Kris, 7 November: "We can come back to that later"); draft in [acquisition-process-draft.md](skills/acquisition-process-draft.md)

**Context:** Acquire's README says the cards are held in `processed/` "until each group's home is decided". On 1 November, under HOLDING-SCOPE-CARDS in Ways of working, Kris said more than that: cards mature with no rush and move into the islands once they conform to the standards being built, or earlier when a card's home is plainly decided. The skill keeps Kris's 1 November wording. Acquire's own text has not picked it up, and Acquire's text is the method's authority for now (ACQ020-OWNER).

**Query:** Should Acquire be told to add the "once they conform to the standards" condition to its README and AGENTS.md?

**Options:**

a) (recommended, confidence high - reviewed; the two texts do not contradict each other, but Acquire is the authority and currently says less than Kris decided) Ways of working sends a one-line notice to Acquire intake's `messages.md`, so that Acquire aligns its wording when it next revises its entry points.

b) Leave both as they are. The skill carries the fuller wording, and Acquire's shorter phrase stands.

### ACQ-SCAFFOLD-NOTE - The design note still says nothing is scaffolded empty

since 2026-11-01 · from run/acq-recheck · blind review 1 November 05:36 GMT agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with the parked ACQUIRE-ROUTE (Kris, 7 November: "We can come back to that later"); draft in [acquisition-process-draft.md](skills/acquisition-process-draft.md)

**Context:** Section 3 of Acquire's design note, `+/_WORK/personal.reg.acquire-intake/design/acquire-structure.md`, says "A zone folder appears with its first file; nothing is scaffolded empty". Kris's later SCAFFOLD decision on 1 November gave every principal a scaffolded skeleton with a README in each zone. README.md and AGENTS.md follow SCAFFOLD, and so does the skill. The note's 1 November amendment covers meetings but not the scaffold. The note calls itself a draft in which "nothing here is decided".

**Query:** Should Acquire intake amend the design note to record SCAFFOLD?

**Options:**

a) (recommended, confidence high - reviewed; the published entry points are already right, so this only tidies a draft) Ask Acquire intake, through a line in its `messages.md`, to add SCAFFOLD to the note's amendment or to prune the note once its phase 1 has graduated.

b) Leave the note as it is, as a superseded draft.

### ACQUISITION-PROCESS-APPROVE - Approve the revised Acquisition Process note

since 2026-11-01 · from run/acq-process-note (ACQUISITION-PROCESS-NOTE a) · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with the parked ACQUIRE-ROUTE (Kris, 7 November: "We can come back to that later"); draft in [acquisition-process-draft.md](skills/acquisition-process-draft.md)

**Context:** The canonical [Acquisition Process](</Users/krisbrown/kis/knowledge-islands/ki-principal/Pillars/Philosophy/Model/Processes/Acquisition Process/Acquisition Process.md>) note still describes dispatch then removal. A full revised draft is at [acquisition-process-draft](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.prj.ways-of-working/capture-model/acquisition-process-draft.md): it adds curation and the staging graph under `processed/<territory>/<island>/`, two ways out (whole captures by dispatch; matured cards once their home is decided), and marks how cards migrate as undecided. Canonical changes need Kris's approval under the Enactment Process.

**Query:** Should the draft replace the canonical note?

**Options:**

a) (recommended, confidence high - it brings the canonical note into line with decisions Kris has already made and leaves the undecided part marked as such) Approve it as drafted, enacted under this approval with the change logged.

b) Review it first and send changes.

### CHECKSUMS-SETTLED - CAPTURE-LEAN also answers the checksum choice

since 2026-11-01 · from run/capture-settled · from stocktake · blind review 1 November · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with the parked ACQUIRE-ROUTE (Kris, 7 November: "We can come back to that later"); draft in [acquisition-process-draft.md](skills/acquisition-process-draft.md)

**Context:** CAPTURE-LEAN was read back in Acquire as "there is no `original.txt` and no checksum file". That covers the capture-model brief's CHECKSUMS choice, whose recommended option is to stop writing `SHA256SUMS` for intake captures. The `capture-settled` run was told to settle only LEAN-CAPTURE and to leave the other choices open with their wording unchanged, so CHECKSUMS is still shown as open. The acquisition standard already keeps checksums for required original files.

**Query:** Should the brief also mark CHECKSUMS as settled by CAPTURE-LEAN before the blind reviews?

**Options:**

a) (recommended, confidence high - reviewed; the read-back says it in so many words, and reviewers would otherwise test something already decided) Yes: a one-line follow-up marks CHECKSUMS as settled for intake captures only, quoting CAPTURE-LEAN; checksums for required original files and every other route stay as they are.

b) No: leave CHECKSUMS open for the reviews.

### GRANOLA-COUNT - Granola's meeting list no longer gives a screenshot count

since 2026-11-02 · from run/granola-transport · blind review 2 November agrees · absorbed from ki.prj.ways-of-working at ki-principal `d8ab8112` · merged with the parked ACQUIRE-ROUTE (Kris, 7 November: "We can come back to that later"); draft in [acquisition-process-draft.md](skills/acquisition-process-draft.md); looks delivered by `granola-screenshots` (tools-ki `eca35dbe`, 2 November); confirm when ACQUIRE-ROUTE is taken up

**Context:**

The importer only captures a meeting's screenshots when two numbers agree. One is the screenshot count in Granola's meeting list. The other is the number of screenshots named in the meeting's detail. Granola's list no longer has a `screenshot_count` field, so the importer reads it as 0 and withholds every meeting that has screenshots. The list now has an `attachment_count` field instead, and it counts more than screenshots. For 28 October it shows 26, 25 and 12, while the details name 20, 20 and 12 screenshots. Granola's own description says attachments include photos the user attached, as well as shared-screen screenshots. Simply reading the new field would still withhold two of the three meetings. This changes the importer's safety check, which is a judgement call and beyond this transport brief, so I have not changed it.

The blind review agrees with a), adding that the run must first check the attachment tool returns the complete list (every page) with a clear type for each attachment, must never treat an untyped attachment as a screenshot, and must keep withholding any meeting whose inventory is incomplete or ambiguous.

**Query:**

How should the importer check screenshots now that Granola only gives a total attachment count?

**Options:**

a) (recommended, confidence high - reviewed; this keeps a real cross-check against Granola's own inventory and still withholds on any true mismatch) Treat the full attachment list from Granola's attachment tool as the reference. Check that the screenshots plus photos it returns add up to `attachment_count`, and capture the screenshots. This would be a bounded tools-ki run with tests.

b) Read `attachment_count` and accept a meeting when its screenshots are no more than that count. This is quicker but a weaker check.

c) Leave the importer as it is and ask Granola whether `screenshot_count` is coming back. Meetings with screenshots stay withheld until then.
