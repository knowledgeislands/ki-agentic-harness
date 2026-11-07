# ki.reg.guilds discussions

## Open

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
