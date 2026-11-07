# ki.reg.guilds discussions

## Open

### KEYSTONE - Move `ki-knowledge-graph` to the keystone group

**Context:** Kris suggested, in the note sent with the cards, that this become a keystone skill, under `skills/keystone/`. The keystone group holds `ki-repo`, `ki-bootstrap` and `ki-skills`, the skills the rest of the harness stands on. HARNESS-SCOPE a) on 7 November put the knowledge-graph skill in the acquire group, which is where it now sits. A move would change the skill's folder, its catalogue section, the functional-area table and two diagrams, and links to it would need updating. Its applicability would stay declaration-only, meaning a repository uses it only by declaring it.

**Query:** Should the skill move to the keystone group?

**Options:**

a) (recommended, confidence low - only Kris knows whether he meant keystone as a load-bearing method or as a group, and this has had no blind review) Keep it in acquire for now and decide together with GUILD-NAME, since renaming that group may settle where the intake skills belong.

b) Move it to keystone now, because the card format and layered graphs underlie every knowledge base and not just intake.

c) Keep it in acquire for good, beside `ki-dodecakrisis` and `ki-acquire`, as one step of the intake path.

### ATTACH-FORM - How a graph declares an attachment point and what a shadow node records

**Context:** The layered-graphs card leaves two questions open: how a graph declares an attachment point (a front-matter flag, a register, or its index note), and exactly what a shadow node records about its subject. The standard says only that a graph declares its attachment points, and that a shadow records which card it shadows, where that card lives and when it was last checked. The Inbox's 22 new shadows already use one form: front-matter `shadow-of` with a path and an address, plus a `checked` date. Until this is settled, no mechanical check of shadows or attachment points can be written.

**Query:** Should the standard adopt the Inbox's shadow form, and which way of declaring attachment points?

**Options:**

a) (recommended, confidence low - it matches what already exists, but Kris has not discussed either form) Adopt the Inbox's `shadow-of` path and address with a `checked` date for shadows, and a front-matter flag on each card for attachment points.

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
