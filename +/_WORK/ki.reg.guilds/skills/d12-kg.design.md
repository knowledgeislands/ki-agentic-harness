# [KI › Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › d12-kg-design

**🤖 → 👤 Handoff to supervisor · Run report at 02:40 GMT · last mark 02:25 GMT**

---

## Done

- **What happened to both skills:** neither skill exists yet. Both were collected in the guild's [harvest](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/skills/harvest.md) and held until Kris answered HARNESS-SCOPE, which he did on 7 November. The material for them is in the Inbox: the [D12 card](/Users/krisbrown/kis/personal/inbox/knowledge/curated/knowledge-islands/ki-principal/Pillars/knowledge-tending/d12-dodecakrisis.md) (in the Inbox's staging area, not yet in ki-principal; the brief's ki-principal path does not exist yet), the [sorting-engine draft](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-terra/d12/sorting-engine.design.md), the [Gmail D12 design](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-terra/d12/gmail-d12.design.md), the funnel cards beside the D12 card, and the [staging knowledge base paper](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-terra/capture/knowledge-as-kb.design.md).
- **Main finding:** the harness `ki-acquire` skill already holds most of the knowledge-graph method. Its [standard](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/acquire/ki-acquire/references/standards-acquisition.md) has a "Staging and curation" and a "Dispatch and authority" section. A new skill should take those sections over and leave `ki-acquire` with capture only (query ACQUIRE-SPLIT). No harness skill sets the semantic card format (Semantic Markdown links and predicates), so the new skill fills a real gap.
- **Mail servers today:** neither `mcp-gsuite` nor `mcp-m365` has any protected-label check. `mcp-gsuite` cannot delete labels or filters. `mcp-m365` can create, list and reorder rules but cannot update or delete them, and has no category or change-history tools. Section 1.6 below lists what each server must build.
- **Both skill designs are below**, ready for Kris to approve their shape. No repository was changed, nothing was committed and no tool reached the network. One local read-only `ki repo roadmap summary` ran for the banner.

### 1. `ki-dodecakrisis`, the D12 sorting engine

**Purpose.** Run D12 in a mailbox, or any intake that can be labelled. Twelve Ds, a rule set that places each arrival, sweeps that act on age, protected labels nothing may touch, and a learning loop that turns Kris's corrections into proposed rules. The skill holds the method and the repository holds the data: rules, corrections and mailbox settings belong to the repository that declares the skill. That is the Inbox for personal Gmail, and hnr-principal for the HNR mailbox under HNR-HANDBACK.

**Boundary.**

- It owns: how D12 works in practice, how a mailbox is set up for it, the rule format and its guards, the sweeps, the protected-label contract seen from the caller's side, the learning loop, and the Deposit hand-off contract.
- It does not own: the D12 concept card (query D12-CANON); what happens after Deposit, which belongs to the knowledge-graph skill and `ki-acquire`; enforcing protected labels, which the servers do; running anything, which is a tool (query D12-RUNNER); scheduling, which is a separate approval each time; or legal evidential filing, which is Legal's policy and the future legal evidential skill.

**Units of comprehension, with hand-offs.**

| Unit | What it says | Hands off to |
| --- | --- | --- |
| U1 The sorter | The twelve Ds and the ten rules: only rules send items out; two exits; Delete carries a reason; everything has a timeline; Determine teaches; the Docket keeps actions | Deliveries come in from each source's approach (the sources card; `ki-acquire-*` for pulled sources) |
| U2 Mailbox binding | Queues are numbered labels or folders under one root (`D12/03 Determine` to `D12/12 Docket`); context is shown by tags beside the outcome, never by folders; each placement also gets `D12/Rules/<id>`; nothing is archived inside the mailbox | Platform differences: Gmail runs every matching filter, Outlook stops at the first matching rule |
| U3 Rules and guards | A rule has an id, a query, an outcome, a mode (automatic or suggest), a confidence and an origin (stated, learnt or decision). Every Delete or Digest rule carries the evidential guard. Every rule is dry-run with a count before it goes live. Anything D12 manages carries the `D12` prefix; D12 touches nothing without it | Filters and Outlook rules are optional helpers; D12 can run without them (GD12-SWEEP) |
| U4 Protected labels | A declared list of labels, folders and categories that no D12 action may change, along with the messages they hold. D12 reads the list from the server and never keeps its own copy. A refusal stops the run and gets reported; it is never worked around | Enforcement: `mcp-gsuite` and `mcp-m365` (query PROTECTED-HOME) |
| U5 Sweeps | Moves based on age: Delete to Trash after 7 days, Digest let go after 14, Defer returns on its date, Deposit leaves the mailbox 30 days after the store verifies it, plus short-lived rules (sign-in codes, parcel tracking). Each sweep is dry-run first and reports its counts | The scheduler, approved separately; the runner (query D12-RUNNER) |
| U6 Learning loop (D12-LEARNS) | Reads mail headers through the change history and logs one correction line per move Kris makes against a rule's placement. Three agreeing corrections produce a draft rule, which goes to Kris as a query and goes live only on his answer (GD12-LEARN a). A rule whose corrections pass 5% drops back to suggest. A rule Kris states is logged in his words as `D12-RULE`, dry-run and shown back, and outranks a learnt rule. The measure of learning is Determine shrinking | Kris, through the coordinating work's queries |
| U7 Deposit hand-off | Each Deposit route names its capture folder, its form (`capture` or `eml.txt`), its destination and its owner. An item leaves the mailbox only after the store has verified it | `ki-muninn` mail import; the knowledge-graph skill; Legal's intake for evidential mail |
| U8 Docket | A Docket item points at the item, which can go back through the rules while the action lives on | The declaring repository's actions area (query DOCKET-HOME) |

**SKILL.md outline.** Front matter: `name: ki-dodecakrisis`, `ki-kind: governance`, `ki-applicability: declaration-only`, `ki-depends-on: []`, `ki-shared-dependencies: [ki-skills:rubric]`. Draft description: "Govern D12, the Dodecakrisis: the twelve Ds, mailbox queues and tags, guarded sorting rules, sweeps, protected labels and the learning loop that turns corrections into proposed rules. Use to set up, audit, sort, sweep or improve a D12 mailbox; `ki-acquire` and the knowledge-graph skill own what happens after Deposit." The body is one paragraph saying what to read and the boundary, then modes:

- the four universal modes: AUDIT, which checks the declared mailboxes against the standard with read-only calls; CONFORM, which proposes missing labels or guards as a dry run; EDUCATE; and REFRESH, run from the canonical repository only;
- plus three D12 modes, each dry-run by default, writing only with an approval it cites (query D12-KIND): SORT places arrivals by the rules, SWEEP runs U5, and LEARN reads corrections and drafts rules or logs stated ones.

**References.**

- `standards-dodecakrisis.md`: U1, U3 and U8, describing the final state only (MIGRATION-OVERLAY).
- `standards-mailbox.md`: U2, U4, U5 and U7, with a short section each for Gmail and Outlook.
- `standards-learning.md`: U6 and the correction-line format.
- `sources.md`: Kris's decisions with dates.
- `rubric.md`: generated.

Configuration properties, in `[skills.ki-dodecakrisis]`: `mailboxes` (name, provider, server, root such as `D12`), `rules` (path to a rules file in the repository) and `corrections` (path to the correction log).

**Rubric criteria** ([M] means checked mechanically, [J] means a judgement on supplied evidence).

- DK-CONFIG-1 [M]: every declared mailbox has a provider, a server and a root, and the rules and corrections paths resolve.
- DK-LABELS-1 [M]: exactly the ten numbered outcome labels exist under the root, with no others.
- DK-RULE-1 [M]: every rule has an id, a query, an outcome, a mode, a confidence and an origin, and only rules send items to Deposit or Delete.
- DK-GUARD-1 [M]: every Delete or Digest rule carries the evidential guard.
- DK-PREFIX-1 [M]: every managed filter or rule carries the `D12` prefix or namespace, and no unprefixed filter is changed.
- DK-PROTECT-1 [M]: no rule, sweep or Deposit route targets a protected label, and the server reports protection switched on.
- DK-DELETE-1 [M]: Delete only labels and a sweep trashes after the grace period; no rule trashes at once.
- DK-LEARN-1 [J]: a learnt rule went live only on Kris's answer, and a stated rule is logged in his words with its dry-run count.
- DK-LEARN-2 [M]: correction lines carry headers only, never message bodies.
- DK-DEPOSIT-1 [M]: every Deposit route names its folder, form, destination and owner.
- DK-SWEEP-1 [J]: every scheduled sweep cites its approval.

**What other repositories must build.**

- **`mcp-gsuite`** (quartermaster):
  - A protected list in the server's own per-account configuration. Entries are label paths that also cover their sub-labels, resolved to label ids, so renaming a label does not lift its protection.
  - Refuse, with a typed error and an audit entry, any call that would rename, delete or create a label under a protected path; add a protected label to, or remove one from, any message or thread; or change, archive, trash, move or mark read or unread any message that carries a protected label (the read state depends on query PROTECTED-READ). The same applies to batch modify, and to creating a filter whose action names a protected label.
  - Report the list and whether protection is on in `gsuite_about`.
  - New tools: label delete and filter delete, both subject to the same refusals.
- **`mcp-m365`** (quartermaster):
  - The same protected list, covering folders and categories.
  - The same refusals for moving, deleting, categorising, folder renames and deletes, and rules that act on a protected item. The existing routing tools (triage, aged, drift, lint) must honour the list too.
  - New tools: rule update and rule delete (rules named `D12 …`), category list and set (for tags), and a mail change query for U6.
- **Inbox `ki-muninn`**: capture folders listed per mailbox, with form and destination (Gmail design section 4); the `eml.txt` form; and the D12 runner if query D12-RUNNER goes to option a.
- **ki-principal**: take the D12 card from the Inbox's staging area once its Rules section is settled (query D12-CANON).

### 2. The knowledge-graph method skill (proposed name `ki-knowledge-graph`)

**Purpose.** Take what D12 deposits and `ki-acquire` captures into a semantic knowledge graph: curate it a piece at a time into Semantic Markdown cards in a staging knowledge base, tend those cards while their ids can still change, and dispatch them to the Capital that owns them. The skill holds "how to do things"; the graph keeps "things that are" (SKILLS-OVER-GRAPH).

**Boundary.**

- It owns: the funnel's map from Deposit to dispatch; the card format; transactional curation; the staging-graph method; dispatch; and graph growth and tending.
- It does not own: sorting before Deposit (`ki-dodecakrisis`); faithful capture, coverage, originals and provider rules (`ki-acquire` and its provider skills); the folder and zone structure of a knowledge base, including zone aliases (`ki-repo-kb`, query STAGING-HOME); running the import (the Inbox's `ki-muninn`); or the evidential-node rules (the future legal evidential skill).

**Units of comprehension, with hand-offs.**

| Unit | What it says | Hands off to |
| --- | --- | --- |
| G1 The funnel | Deposit, capture, curate, dispatch, and who owns each stage. Only what is deposited enters. Pace: today first, then one day back at a time, with a report after each | In from D12's Deposit; capture to `ki-acquire` |
| G2 Cards | Semantic Markdown: front-matter links with predicates, one authoritative definition per concept within a territory, enrichment added little by little, no card for every noun, an `origin:` line only where it helps, a meeting treated as a source rather than a card, and future ideas kept as future concepts | `ki-authoring` for prose style |
| G3 Transactional curation | One bounded item per commit. Strike the item through in its capture with a note naming its destinations, in the same commit as the card change. Dropped items get their own "considered and dropped" commit. A capture is deleted only once every part is struck | `ki-acquire` for the capture package's own rules |
| G4 Staging graph | The staging area mirrors each receiving island under `<territory>/<island>/` in that island's own shape. Ids stay changeable until the structure settles. A routing graph (`context/`) points one way only. Material waiting to be brought in is held back and worked one day at a time | `ki-repo-kb`, which audits the staging base's zones through declared aliases |
| G5 Dispatch | A Git move into the receiving island's `+/_ACQUIRED/`. Delivery is acceptance; there is no ledger. A holding area dispatches nothing while its hold stands | The receiving island, through `ki-next` triage |
| G6 Growth and tending | Graph strategies, the naming game, measures of reach and duplication, and keeping cards coherent and findable | Roadmap records in each repository for the measuring tools |

**SKILL.md outline.** Front matter: `ki-kind: governance`, `ki-applicability: declaration-only`, `ki-depends-on: []`. Draft description: "Govern curation into a semantic knowledge graph: the capture funnel from Deposit to dispatch, Semantic Markdown cards, transactional curation, staging-graph tending and dispatch by Git move. Use to curate, tend or dispatch staged knowledge; `ki-acquire` owns capture, `ki-dodecakrisis` sorting, and `ki-repo-kb` knowledge-base structure." Modes: AUDIT, CONFORM, EDUCATE and REFRESH, plus CURATE (one bounded item) and DISPATCH (dry run unless approved). Configuration: `staging_root`, `capture_root` and `held_root`.

**References.**

- `standards-funnel.md`: G1 and G5.
- `standards-cards.md`: G2.
- `standards-curation.md`: G3 and G4.
- `standards-tending.md`: G6.
- `sources.md` and the generated `rubric.md`.

**Rubric criteria.**

- KG-CARD-1 [M]: every card has front-matter id, title, type and status, and its links carry predicates.
- KG-CARD-2 [M]: no card links into a capture, and nothing in a capture links into the routing graph.
- KG-CUR-1 [M]: every struck item has a destination note, and every destination it names exists.
- KG-CUR-2 [J]: each curation commit pairs the card change with its strike-through.
- KG-CUR-3 [M]: no capture is deleted while it holds an unstruck part or a part marked capture-only.
- KG-STAGE-1 [M]: each staged path resolves to an island's zone.
- KG-DUP-1 [J]: one authoritative definition per concept within a territory.
- KG-DISP-1 [M]: no dispatch from a declared holding area.

The Inbox's existing checks (`context_check.py` and the curation checks) are the source for the [M] items.

**What other repositories must build.**

- **Harness**: trim `ki-acquire` to capture only and move its staging and dispatch text across (query ACQUIRE-SPLIT); add a staging-base profile to `ki-repo-kb`, checked through the declared zone aliases (query STAGING-HOME).
- **Inbox**: declare `knowledge/` as a staging knowledge base under KNOWLEDGE-AS-KB a; strike the method cards (funnel, transactional curation, graph strategies, naming game) through to a link at the skill.
- **ki-principal**: the concept cards stay concepts.
- **Legal**: the evidential-node rules wait for the legal evidential skill.

### 3. The guild

The acquire guild today holds `ki-acquire`, `ki-acquire-chatgpt`, `ki-acquire-granola` and `ki-pulse`. With these two skills it would cover the whole intake path, from sorting through capture and curation to dispatch, and that is wider than "acquire". All of the material sits in Kris's own `Pillars/knowledge-tending/` folder (query GUILD-NAME).

## In Progress

Nothing is running.

Outstanding - no action requested now:

- These queries have not had a blind review. The coordinator should arrange one before they reach Kris for every query below high confidence: KG-NAME, GUILD-NAME, D12-CANON, D12-KIND, D12-RUNNER, STAGING-HOME and DOCKET-HOME.
- Three Gmail-design questions stay with personal.reg.inbox-terra and are not asked again here: GD12-VERBATIM-LAND (with lgl.sop.main), when the sweep is scheduled, and the shared tag tree with HNR.
- The legal evidential skill and the `specs-` kind rethink, also under SKILLS-OVER-GRAPH, were not part of this run.

## Queries

### KG-NAME - What to call the knowledge-graph method skill

**Context:** The new skill covers how deposited material is curated into a semantic knowledge graph: the card format, curating one item at a time, tending the staging area, and sending finished cards to their owners. Kris asked about it as "the semantic knowledge graph". Its sibling for capture is `ki-acquire`.

**Query:** What should the skill be called?

**Options:**

a) (recommended, confidence medium - it matches Kris's own words and the graph is the skill's centre) `ki-knowledge-graph`.

b) `ki-curate`, a verb that pairs with `ki-acquire`, though dispatch and the card format sit less naturally under it.

c) `ki-knowledge-funnel`, after the funnel card, though the funnel's capture stage belongs to `ki-acquire`.

### GUILD-NAME - Keep the guild called "acquire", or rename it

**Context:** HARNESS-SCOPE a) (Kris, 7 November) made each harness skill folder a guild and put both new skills under the acquire guild, leaving its name open. With D12 and the graph skill added, the guild runs from sorting through capture and curation to dispatch. Renaming the folder moves skill paths, the catalogue and links.

**Query:** What should this guild be called?

**Options:**

a) (recommended, confidence medium - it names what the guild serves, not just its first step) `knowledge`.

b) `knowledge-tending`, the name of the Pillar folder that holds all three cards; it is exact but long.

c) Keep `acquire`; it costs nothing, but sorting and curation are not acquisition.

### D12-CANON - Where D12's rules live once the skill exists

**Context:** The D12 card, Kris's fundamental tenet of 5 November, holds the twelve Ds, the names and the ten rules, and currently says "change them there". SKILLS-OVER-GRAPH (6 November) says method moves into skills and the graph keeps "things that are".

**Query:** Which holds the authoritative D12 rules, the card or the skill?

**Options:**

a) (recommended, confidence medium - it keeps the tenet as a concept and puts the method where it gets used) The card keeps the concept (the twelve Ds, the names and why) and links to the skill. The skill's standard holds the ten rules and how they run.

b) The card stays the authority for everything, and the skill cites it.

### D12-KIND - One D12 skill with working modes, or two skills

**Context:** House governance skills share four modes: audit, conform, educate and refresh. D12 also needs working modes: sort arrivals, run the sweeps, and learn from corrections. Each writes only with an approval it cites.

**Query:** Should one skill hold both the standard and the working modes?

**Options:**

a) (recommended, confidence medium - one place for Kris to look, and the working modes are small) One `ki-dodecakrisis` skill: the four standard modes plus SORT, SWEEP and LEARN.

b) Two skills: `ki-dodecakrisis` for the standard and a separate process skill for running it.

### D12-RUNNER - What runs the sweeps and the learning loop

**Context:** Sweeps are simple, repeated label and age searches. The learning loop reads mail headers through the change history. Executable importers live outside the harness, in the Inbox's `ki-muninn`, which already holds the mailbox settings. Kris said on 6 November that the sweeps are D12's own runs.

**Query:** What should execute D12's sweeps and learning?

**Options:**

a) (recommended, confidence medium - repeatable, cheap and uses existing mailbox settings) Code in `ki-muninn` (`ki-muninn d12 sweep`, `ki-muninn d12 learn`), governed by the skill. hnr-principal runs it too, for its own mailbox.

b) A scheduled agent pass that uses the skill and the mail servers directly, with code later.

### PROTECTED-HOME - Where the protected-label list lives

**Context:** Kris, about 23:40 GMT on 6 November: some labels "must never be changed or touched", as "a capability of the routing and of the mail MCP servers". A list held by the caller can be forgotten or left out; a list held in each server's own configuration (managed by chezmoi) protects every caller, D12 or not.

**Query:** Where should the protected list be declared?

**Options:**

a) (recommended, confidence high - only a server-side list protects against every caller) In each mail server's per-account configuration. The server refuses any change, and D12 reads the list from the server.

b) In the D12 settings of the declaring repository, passed to the server on each call.

### PROTECTED-READ - Does marking read count as touching

**Context:** Z-ARCHIVE (Kris, 6 November): nothing "adds, removes, renames or deletes any label under it, or changes the messages it holds". Opening a protected message in the Gmail web app marks it read regardless; this only concerns tool calls.

**Query:** Should the servers also refuse to mark protected messages read or unread?

**Options:**

a) (recommended, confidence high - it matches "never changed or touched") Yes, refuse every change, read state included.

b) Allow read-state changes and refuse everything else.

### ACQUIRE-SPLIT - Move curation and dispatch out of `ki-acquire`

**Context:** The `ki-acquire` standard already contains "Staging and curation" and "Dispatch and authority" sections, and its description mentions curation and dispatch. The new graph skill covers the same ground. Two copies would drift apart.

**Query:** Should `ki-acquire` be narrowed to capture, with its curation and dispatch text moved to the new skill?

**Options:**

a) (recommended, confidence high - one owner per rule is the house contract) Yes: `ki-acquire` keeps capture and hands off to the graph skill at curation.

b) No: `ki-acquire` keeps them, and the graph skill covers only the card format and tending.

### STAGING-HOME - Who owns the staging knowledge base's structure

**Context:** KNOWLEDGE-AS-KB a (6 November) makes the Inbox's `knowledge/` a declared staging knowledge base, using zone aliases that `ki-repo-kb` already supports. A staging base differs from an ordinary one: its ids can change, and it mirrors the islands it will dispatch to.

**Query:** Where is the staging base's shape set out?

**Options:**

a) (recommended, confidence medium - structure stays with the structure skill and method with the method skill) A staging profile in `ki-repo-kb` for the zones and aliases, with the graph skill covering how material moves through it.

b) All of it in the graph skill.

### DOCKET-HOME - Where D12's Docket items live

**Context:** In D12, the Docket keeps actions that outlive the item they came from. The Gmail design has a `D12/12 Docket` label. The Inbox keeps Kris's life actions as cards in `knowledge/actions/`, which the KIV viewer reads. How the two relate is still open in the sorting-engine draft, and the standard can only describe a settled final state.

**Query:** What is a Docket item?

**Options:**

a) (recommended, confidence low - it matches the existing viewer, but Kris has not discussed it) An action card in the declaring repository's actions area that points at the item. The `D12/12 Docket` label just marks the item as having one.

b) Only the mailbox label; no card.

c) Leave Docket out of the first version of the skill.

### 🤖 → 👤 Handoff to supervisor · at 02:40 GMT

👤 10 with you

🗺️ roadmap · 3 records · 0 open · 3 done awaiting prune · 0 ideas

- [with you] KG-NAME · owner · since 02:40
- [with you] GUILD-NAME · owner · since 02:40
- [with you] D12-CANON · owner · since 02:40
- [with you] D12-KIND · owner · since 02:40
- [with you] D12-RUNNER · owner · since 02:40
- [with you] PROTECTED-HOME · owner · since 02:40
- [with you] PROTECTED-READ · owner · since 02:40
- [with you] ACQUIRE-SPLIT · owner · since 02:40
- [with you] STAGING-HOME · owner · since 02:40
- [with you] DOCKET-HOME · owner · since 02:40

🧵 ki.reg.guilds
