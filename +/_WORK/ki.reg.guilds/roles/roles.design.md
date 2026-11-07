# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › roles-design

**🤖 → 👤 Handoff to supervisor · Run report at 02:36 GMT · last mark 02:25 GMT**

---

## Done

Read-only design for STAGE-C-ROLES. Nothing changed in any repository. The design was read against harness `ddfa3083`. No checks were run because this run makes no edits.

### 1. Glyphs in use today, and the proposed set

Evidence found:

| Glyph | Where it is in use today | Tied to |
| --- | --- | --- |
| 🏛️ | `ki.sop.main` `workers` name `🏛️ 🔑 ki.sop.main`; lgl.sop.main's session name (decisions line 425); hnr.sop.main's interim identity line `🏛️ councillor 🔑 hnr.sop.main` (REBOOT-FOOTER, 3 November); Agora's provisional catalogue | governor; the 2 November glyph set used it for councillor |
| 🏠 | household-sol and household-terra `workers` names; Agora | housekeeper |
| 🦉 / 🦉⭐ | inbox-sol `🦉 🔑 personal.reg.inbox-sol` (role `assistant`, tier `enablers`); inbox-terra `🦉⭐ 🔑 personal.reg.inbox-terra` (role `gatekeeper`, `designation: primary`); NAME-GLYPH a), 6 November | assistant, now gatekeeper (CAPTURE-ASSISTANT a)) |
| 🧰 | TOOLS-STEWARD decision, seat line `🧰 🔑 ki.reg.tools`; Agora | quartermaster |
| ⚒️ | Agora's provisional catalogue (`apps-agora.local/src/app/role-catalogue.ts`, `PROVISIONAL = true`) | warden |
| ⚖️ | Agora's provisional catalogue | guildmaster |
| 🐝, 🎨, 📨, 🎙️, 🧵 | the 2 November glyph set ([glyphs.md](/Users/krisbrown/kis/personal/inbox/knowledge/curated/knowledge-islands/ki-principal/Pillars/knowledge-tending/glyphs.md)): generalist, designer, intake, bard, coordinator; `🎨 🔧` on the retired `personal.reg.assistant-terra.kiv` | old doer roles, all retired by the catalogue |
| ⭐, 🔑, 🔧, 👁️, 🗂️ | the same set: primary designation, keyholder, doer working in a package, reserved observer, work package | relationship marks, not roles |

Nothing in the ki-work-package or ki-coordination skills, ki-principal or the Agora Atlas ties a glyph to a role beyond these. The 2 November set's `🎧`, `⇄` and `🧭` footer lines never reached the standard, which still uses 👂 and 🔇.

Proposed set. It keeps all six glyphs already tied to a catalogue role, carries 🐝 and 🎨 over from their predecessor roles, and adds four new ones. All twelve are distinct from each other and from the banner's state and line glyphs (🤖 👤 🎯 ⏸️ 🏁 💤 ↪️ 👂 🔇 🗺️ 📦 🧵 🔑 📤 🅿️ ⛔ 📥 ⏳):

| Role | Glyph | Source |
| --- | --- | --- |
| governor | 🏛️ | kept (in use) |
| councillor | 🗳️ | new: a vote in the council and in admissions; 🏛️ moves to governor alone |
| warden | ⚒️ | kept (Agora) |
| steward | 📋 | new |
| housekeeper | 🏠 | kept (in use) |
| gatekeeper | 🦉 | kept (in use on both inbox seats) |
| librarian | 📚 | new |
| guildmaster | ⚖️ | kept (Agora) |
| quartermaster | 🧰 | kept (in use) |
| journeyman | 🐝 | carried over from generalist |
| illustrator | 🎨 | carried over from designer |
| architect | 📐 | new |

### 2. The catalogue text, as it will be committed

The catalogue goes in a new file, `skills/governance/ki-work-package/references/standards-roles.md`, linked from ki-work-package's `SKILL.md` and its standard (query ROLES-HOME). It opens with the prime directive's one-line test and the tiers, then this table:

```markdown
## Role catalogue

Every seat takes one or more roles from this table, and this table is the one place that says what each glyph means. Role names are singular, and any seat may be one agent or a lead with a pack. Managers may also make. Chancellor, over several libraries, and a guildmaster for each guild are reserved: neither has a glyph until the work calls for it.

| Role | Tier | Glyph | Owns | Never does |
| --- | --- | --- | --- | --- |
| governor | leaders | 🏛️ | Heads one territory: its State of play, priorities, dispatch, the admission of its managers and the queries it brings to Kris; convenes its council | Outranks another territory's governor, decides for another territory, or does its managers' or makers' work |
| councillor | leaders | 🗳️ | A further leader's share of one territory's decisions, by its governor's grant, and its vote in the council and in admissions | Heads the territory, acts outside it, or decides alone what the council holds |
| warden | managers | ⚒️ | One Project: its package, records, runs and queue, from Ready to delivery awaiting acceptance | Sets priority across Projects, accepts its own delivery, or works outside its Project |
| steward | managers | 📋 | One regular package's standing work, within its standing grants | Takes up Project delivery or territory dispatch, or acts past its grants instead of taking the exception up |
| housekeeper | managers | 🏠 | One machine's health and its match with the declared setup: applies, drift, doctor findings and the installs Kris decides | Changes another machine, or changes the tooling and standards it applies |
| gatekeeper | managers | 🦉 | What comes in and goes out: capture, intake, mail and the packs prepared for Kris | Decides what it carries, or sends anything in Kris's name without his word |
| librarian | managers | 📚 | The library: what knowledge is kept, where, and how it is found | Owns the work the knowledge comes from, or keeps what has a durable home elsewhere |
| guildmaster | managers | ⚖️ | This catalogue and the skills that capture how we work | Judges roles alone, since Kris and the council may overturn it, or builds the tools and does the work its skills govern |
| quartermaster | managers | 🧰 | The island's tools and MCP servers, kept working, released and accounted for | Decides how a tool must behave, which is the guild's, or releases without Kris |
| journeyman | makers | 🐝 | A handed-off unit of general making, reported to the seat that handed it over | Takes work no seat handed it, or reports to Kris directly |
| illustrator | makers | 🎨 | Visual design and its artefacts for a handed-off piece | Takes work no seat handed it, or reports to Kris directly |
| architect | makers | 📐 | Information architecture: the structure, naming and models of a handed-off piece | Takes work no seat handed it, or reports to Kris directly |
```

The rest of `standards-roles.md` covers the following, in final-state wording only:

- the `role` and `workers` fields (section 3);
- the thread line (section 4);
- the four directive parts as one paragraph each, citing the [role-catalogue brief](https://github.com/krisb/dotfiles/blob/2fe13be/+/_WORK/personal.reg.household-terra/housekeeping/role-catalogue.brief.md);
- the brief's rules 1 to 12, as rules of the role model.

Tolerance for old forms goes in `references/migration-roles.md`, which defers to the standard and can be deleted whole, under MIGRATION-OVERLAY. It covers:

- the `🧵` form for a session that has a role;
- `role: assistant` read as gatekeeper, `keeper` read as warden;
- tier `enablers` read as managers, and `doers` read as makers;
- a top-level `role:` or `tier:` in `state.md`;
- `name`, `uri`, `designation` and `listening: agora-call` in `workers` (subject to WORKERS-URI);
- ⭐ and 🔧 in a glyph run.

Each is a warning, never a failure.

### 3. The fields, and why household-sol and household-terra fail

**Why they fail today.** `state.md`'s front-matter field set is closed (`STATE_FIELDS` in `skills/governance/ki-work-package/scripts/rubric/contexts/work-package.ts:85`), and `workers` is not in it. So `state.md front matter must use only its closed state field set` fails RECORD-2 for every package that carries `workers`. That is household-sol, household-terra, ki.sop.main, inbox-sol and inbox-terra.

The same closed-set rule fails a `role:` in `work.md` (`DEFINITION_FIELDS`, line 60). That hits ki.reg.guilds, hnr.prj.5g-emerge-phase3 and hnr.prj.site-robots. It also fails a top-level `role:` in `state.md`, which hits ki.prj.agora and hnr.prj.5g-emerge-p2ms3. Everything else in the two household packages passes: `hold.reason: more-expected` is still a valid reason.

**Proposed shape** (query ROLE-FIELDS):

```yaml
# work.md: the package's primary role, one catalogue role
role: housekeeper

# state.md: the live seats working this package
workers:
  - role: housekeeper            # a catalogue role, or a list with the primary first: [governor, guildmaster]
    tier: managers               # leaders | managers | makers, the catalogue tier of the primary role
    focus: [housekeeping]        # focus ids from work.md's Focus
    since: 2026-11-06T01:21:00Z  # UTC, when the seat took the package up
    status: active               # active | idle
    listening: on                # on | off
    uri: orca+claude-code://sol/<session-id>   # only under WORKERS-URI a)
```

- `name` and `designation` are dropped. The glyphs come from the roles, so the name is derived and never stored (WORKERS-SHAPE, MARKS-RETIRE).
- With several roles, the seat's glyphs are the roles' glyphs in list order, and `tier` is the primary role's tier. A further role may be from the same tier or a lower one (MULTI-ROLE).

**RECORD-2 change.** Two additions to the item text in `skills/governance/ki-work-package/scripts/rubric/items/records.ts:33`, regenerated into `references/rubric.md:64`:

- `work.md` may carry "at most the optional label, theme, role (one catalogue role) and created_at".
- `state.md` may carry "the optional `workers`, a list of the package's live seats, each with `role`, one catalogue role or a list with the primary first, and `tier`, the catalogue tier of its primary role, and at most `focus`, `since`, `status` and `listening`, each of its stated type".

Code changes in `contexts/work-package.ts`:

- Add `role` to `DEFINITION_FIELDS` and `workers` to `STATE_FIELDS`.
- Add a `workersChecks(state, fields, evidence)` beside `capabilityChecks`, and a `role` check in `definitionChecks`.
- Read the catalogue from `standards-roles.md`'s table at audit time, so the table stays the one home and the checker holds no copy.
- Add tests in `work-package.test.ts` for both household shapes, the multi-role seat, an unknown role, a tier mismatch, and each migration warning.

The existing `ROLES` constant (line 132, `conversational`, `coordination`, `state-of-play`) belongs to old checkpoints. It stays as it is, with a comment that it is not the catalogue.

### 4. The thread line

**Grammar.**

```text
thread-line = role-glyphs " 🔑 " work-id   ; a session whose seat has a role
            | "🧵 " work-id                ; a session with no role yet, and every background run
role-glyphs = glyph { glyph }              ; catalogue glyphs, primary role first, no spaces between
work-id     = the authoritative id from work.md
```

Examples: `⚖️ 🔑 ki.reg.guilds`, `🏛️ 🔑 ki.sop.main`, `🏠 🔑 personal.reg.household-sol`, `🦉 🔑 personal.reg.inbox-terra`, and `🏛️⚖️ 🔑 ki.sop.main` for a two-role seat. ⭐ and 🔧 are not part of the grammar (MARKS-RETIRE). A seat address, `package+role`, becomes a valid `work-id` only when seats land (SEAT-ID).

**Surfaces.** The same string is used in each of these places:

1. The banner's closing line.
2. The session name: the launch name `claude --name "<thread line>"`.
3. The `Rename thread: /rename <thread line>` line that ends `## Done` in bootstrap and re-bootstrap reports.
4. A message line's sender, `<label> (<thread line>):`, as in `KI > Guilds (⚖️ 🔑 ki.reg.guilds):`. The id stays last inside the brackets, so the existing `INBOUND_LINE` check needs no change. ACK and Outbound lines keep the bare id.
5. Run reports keep `🧵 <work-id>` of the work they report to (RUN-THREAD-LINE).

**Every file and line to change.** Line numbers are at `ddfa3083`.

- `skills/change-management/ki-coordination/references/standards-coordination.md`:
  - :122 glossary row "thread line";
  - :181 Work naming: drop the NAME-GLYPH exception, since the role-glyph name is now the rule and every report's line matches it, and name the message sender form;
  - :371 Summary footer item 7;
  - :389, :418, :440, :459, :499, :516 and :526 the banner example blocks: keep `🧵 ki.prj.ways-of-working` or switch to `⚒️ 🔑 ki.prj.ways-of-working`, but they must agree with the output style;
  - :462 the Thread line paragraph;
  - :863 the output-style source paragraph, including the rename exception;
  - :970, :988, :1010, :1043, :1058, :1086 and :1102 Templates;
  - :1144 Naming;
  - :1203 Opening work: the launch name and rename line;
  - :1268 Re-bootstrap step 7;
  - :777 and :783 the `run-report` and `footer-report` sources, wording only under RUN-THREAD-LINE.
  - The row `🧵 another thread` (:1118) is a status-table holder glyph and stays.
  - Add one sources.md entry for STAGE-C-ROLES (Kris, 7 November 2026, 02:30 GMT).
- `skills/change-management/ki-coordination/SKILL.md:100`.
- `skills/change-management/ki-coordination/references/rubric.md:55` (COORD-6) and its source text, `scripts/rubric/items/threads.ts:179`.
- `output-styles/ki-coordinator.md`: :80, :100, :117, :120, :134 and :149. These are generated, so run `ki dev skill generate ki-coordination --write`; do not hand-edit them. The same command rewrites `skills/governance/ki-delegation/assets/run-prompt.md:13` and the four `rules-*.md` footers (:10).
- `skills/change-management/ki-coordination/scripts/banner.test.ts`:
  - :69 `THREAD_LINE` accepts both forms;
  - :131 count lines matching it;
  - :461 and :480 the new wording;
  - :663 both forms per id;
  - :735 rename line;
  - :744 `claude --name "<thread line>"`;
  - add one test that every catalogue glyph is unique and outside the banner glyphs.
- `hooks/coordinator-footer/coordinator-footer.sh`:
  - :3 to :8 header comment;
  - :64 form detection, `/^(🧵|[^ -~]+ 🔑) [^ ]+ *$/`;
  - :83 the engagement grep, which takes either form: `(\\n|")(🧵|[^ -~"\\]+ 🔑) [A-Za-z0-9][A-Za-z0-9._+-]*(\\n|")` (HOOK-ENGAGE);
  - :121 a thread line straight after the heading is no counts line;
  - :125 thread detection in both forms;
  - :130 and :131 block messages name "the `<role glyphs> 🔑 <work-id>` or `🧵 <work-id>` thread line, last";
  - new warnings, never blocks: 🧵 inside a glyph run (`🧵 🔑 id`), ⭐ or 🔧 in a glyph run. The hook holds no copy of the catalogue.
- `hooks/coordinator-footer/coordinator-footer.test.ts`:
  - :195, :200, :228, :280, :287, :290, :324 and :359 the message strings;
  - add tests that a key-form Summary and banner pass, that a two-glyph line passes, that a key line not last blocks, that `🧵 🔑 x` and `🦉⭐ 🔑 x` pass with a warning, and that a mark word after an earlier key-form reply engages.
- `hooks/README.md:41` and `docs/specs/harness.md:149`: wording. `harness.md:139` still describes the retired `🧵 Coordination thread · <label>` footer, which is drift for `drift-fix` or this run.
- `skills/governance/ki-work-package/references/standards-work-package.md`:
  - the State file table gets `workers`;
  - the Work file table gets `role`;
  - the Messages lines sender sentence;
  - Sub-packages: retire into seats under SEATS-VS-SUBPACKAGES a); that is Stage C proper, not this unit;
  - Prohibited payloads, only under WORKERS-URI a).
- `skills/governance/ki-work-package/SKILL.md`: link `standards-roles.md` and `migration-roles.md`.
- `skills/keystone/ki-bootstrap/references/standards-bootstrap.md:112`: the opener's launch name (BOOTSTRAP-EDIT).
- ki-delegation needs no hand edit: its run prompt and footers are generated, and under RUN-THREAD-LINE a) they keep `🧵`.

### 5. Live seats

"Live" means a package not On hold or Finished, plus household-terra, which is Snoozing and still listening. The REFRESH goes to these 15 packages. ki.reg.guilds is excluded because it is the sender.

| Package | Role | Tier | Thread line | Note |
| --- | --- | --- | --- | --- |
| ki.sop.main | governor | leaders | `🏛️ 🔑 ki.sop.main` | already this |
| hnr.sop.main | governor | leaders | `🏛️ 🔑 hnr.sop.main` | was "councillor" (SOP-MAIN-GOVERNOR) |
| ki.reg.guilds | guildmaster | managers | `⚖️ 🔑 ki.reg.guilds` | this package |
| ki.prj.agora | warden | managers | `⚒️ 🔑 ki.prj.agora` | move `role` from state.md to work.md |
| ki.prj.chezmoi | warden | managers | `⚒️ 🔑 ki.prj.chezmoi` | |
| ki.prj.tools-burndown | warden | managers | `⚒️ 🔑 ki.prj.tools-burndown` | to be reparented to ki.reg.tools |
| hnr.prj.5g-emerge-phase2 | warden | managers | `⚒️ 🔑 hnr.prj.5g-emerge-phase2` | |
| hnr.prj.5g-emerge-phase3 | warden | managers | `⚒️ 🔑 hnr.prj.5g-emerge-phase3` | |
| hnr.prj.5g-emerge-p2ms3 | warden | managers | `⚒️ 🔑 hnr.prj.5g-emerge-p2ms3` | move `role` to work.md |
| personal.prj.tower-public-site | warden | managers | `⚒️ 🔑 personal.prj.tower-public-site` | |
| personal.reg.household-sol | housekeeper | managers | `🏠 🔑 personal.reg.household-sol` | drop `name` |
| personal.reg.household-terra | housekeeper | managers | `🏠 🔑 personal.reg.household-terra` | drop `name` |
| personal.reg.inbox-sol | gatekeeper | managers | `🦉 🔑 personal.reg.inbox-sol` | was assistant / enablers |
| personal.reg.inbox-terra | gatekeeper | managers | `🦉 🔑 personal.reg.inbox-terra` | was enablers; ⭐ and `designation` go |
| personal.reg.tower | steward | managers | `📋 🔑 personal.reg.tower` | |
| personal.reg.tower.site-design | illustrator | makers | `🎨 🔑 personal.reg.tower.site-design` | a sub-package; becomes seat `personal.reg.tower+illustrator` at its next take-up |

Not yet open: ki.reg.tools (quartermaster, `🧰 🔑 ki.reg.tools`) and ki.reg.library (librarian 📚).

On hold, taking their glyphs at their next bootstrap through `method_read` and receiving no REFRESH:

- the governor 🏛️ of er, lgl, personal, si, tmx and va `.sop.main`;
- every on-hold Project, as warden ⚒️;
- ki.reg.main and personal.reg.rig, as steward 📋;
- personal.reg.email-routing, as gatekeeper 🦉, to be confirmed when it opens.

The REFRESH line, one per package with its own seat filled in (about 60 words):

```markdown
- IMPORTANT · 2026-11-07 · MSG-<hex> ROLES-LANDED · KI > Guilds (⚖️ 🔑 ki.reg.guilds): the role catalogue and role glyphs have landed (harness <rev>, ki-work-package `standards-roles.md`). Your seat: <role> <glyph>, <tier>. Record `role: <role>` in work.md and `role`/`tier` in your state.md `workers` entry. Close banners with `<glyph> 🔑 <id>`, rename the session to it, and sign message lines `<label> (<glyph> 🔑 <id>)`. Refresh `method_read`, then ACK.
```

### 6. tools-ki

tools-ki is not edited here. ki.reg.tools does not exist yet, so the line goes to ki.prj.tools-burndown, the single tools-ki writer.

One drift was found: the standard (:1203) and ki-bootstrap (:112) say `ki agent prompts` prints `claude --name "🧵 <work-id>"`, but `tools-ki/src/core/work/prompts.ts` prints no launch command at all. No `ki` reader of `role:` or `tier:` exists today.

```markdown
- 2026-11-07 · MSG-<hex> ROLE-NAMES · KI > Guilds (⚖️ 🔑 ki.reg.guilds): the role catalogue landed in ki-work-package `standards-roles.md` (harness <rev>). Please make `ki agent prompts` print each opener's launch command, `claude --name "<thread line>"`: `<role glyphs> 🔑 <id>` from work.md's `role` and the catalogue's glyph, else `🧵 <id>`. It prints none today. Any future `role:`/`tier:` reader checks against that table.
```

A further line to ki.prj.agora (warden) is recommended, not required by the brief. It says the published catalogue replaces `role-catalogue.ts`'s stand-in, that Agora's tier word `doer` becomes `makers`, and that the glyphs come from the roles rather than from `workers.name`.

## In Progress

Nothing is running. Next in the chain: `roles-blind` on the queries below, then `roles-land`.

Outstanding - no action requested now:

- `docs/specs/harness.md:139` still describes the retired label footer (drift).
- tools-ki prints no launch name, though two standards say it does (section 6).

## Queries

### GLYPH-SET - The twelve role glyphs

**Context:** Kris asked for one glyph per role, keeping the glyphs already in use (02:30 GMT, 7 November). In use today: 🏛️ for the governor (ki.sop.main), 🏠 for the housekeeper, 🦉 for both inbox seats, now gatekeepers, and 🧰 for the quartermaster (the guild's decision of 6 November). Agora's stand-in catalogue already shows ⚒️ for the warden and ⚖️ for the guildmaster. The 2 November glyph set gave 🐝 to the general doer and 🎨 to the designer, whose successors are the journeyman and the illustrator. That set also gave 🏛️ to the councillor, which clashes with the governor. Four roles have no glyph yet. Each glyph must differ from the banner's state glyphs.

**Query:** Should the catalogue take this set: governor 🏛️, councillor 🗳️, warden ⚒️, steward 📋, housekeeper 🏠, gatekeeper 🦉, librarian 📚, guildmaster ⚖️, quartermaster 🧰, journeyman 🐝, illustrator 🎨, architect 📐?

**Options:**

a) (recommended, confidence medium - keeps every glyph already tied to a catalogue role and fills the four gaps with distinct, plain symbols, but the four new ones are taste) Take the set as listed.

b) Take the kept and carried-over glyphs, but choose different new ones for councillor, steward, librarian and architect, for example 🪑, 🧭, 🗃️ and 🏗️.

### SOP-MAIN-GOVERNOR - Every territory's main State of play is its governor

**Context:** The brief says the governor "heads a territory; may be its only leader", and a councillor is "any further leader". Agora's stand-in maps every `<territory>.sop.main` to governor. Before the catalogue, lgl.sop.main (5 November) and hnr.sop.main (3 November) called their seats "councillor", under the 2 November glyph set where 🏛️ meant councillor.

**Query:** Is every `<territory>.sop.main` seat the territory's governor, 🏛️, so that the two "councillor" seats become governors?

**Options:**

a) (recommended, confidence high - it follows the brief's definitions and Agora's mapping, and the old word came from a set the catalogue replaces) Yes: each `.sop.main` is its territory's governor; councillor is kept for any further leader.

b) Let lgl.sop.main and hnr.sop.main stay councillors, with a governor to be named later for each territory.

### ROLE-FIELDS - Where a package's role is recorded

**Context:** Rule 11 of the role-catalogue brief (6 November) says "the package's `role` field names one and replaces the unofficial `workers:` block in state.md". On 6 November, under ROLES-TIDY, Kris approved recording `role: guildmaster` in this package's `work.md` and warden on Project packages. On 7 November at 02:30 GMT Kris asked for "the `role:` and `tier:` fields in state.md's `workers`" to be defined and checked. Today packages carry the role in three places: `work.md` (3 packages), the top level of `state.md` (2) and `workers` (5). Agora reads the top level of `state.md` first, then `workers`.

**Query:** Where should the role live in the final state?

**Options:**

a) (recommended, confidence medium - it honours both of Kris's later words: a package's purpose belongs in its definition, and the sessions working it belong in its state) In two places with different meanings: `work.md` `role` is the package's primary role, and `state.md` `workers` lists each live seat with `role` and `tier`. A top-level `role` or `tier` in `state.md` is a migration warning.

b) Only in `state.md` `workers`, with `role` removed from `work.md` again.

c) Only `work.md` `role`, as rule 11 said, with `workers` retired.

### WORKERS-URI - Session addresses in `workers`

**Context:** Each `workers` entry carries a `uri` such as `orca+claude-code://sol/<session id>`; the id is the Claude Code session's own (checked for ki.sop.main). The ki-work-package standard says a package "has no vendor-session field, conversation URL, runtime identifier", and that a session's host "stays out" of packages. Agora reads the host from the `uri` to show which Mac a worker runs on. Kris asked for `role` and `tier` in `workers` (7 November); he did not mention `uri`.

**Query:** Should `workers` entries keep the session address?

**Options:**

a) (recommended, confidence medium - Agora relies on it and the record exists only while the seat is live, but it reverses a standing rule) Keep `uri` as a defined optional field, cleared when the session ends, and narrow the prohibited-payloads rule to exclude it.

b) Drop `uri` and keep the rule as it is. Agora learns the host another way, such as its own machine-local view.

### WORKERS-SHAPE - The closed fields of a `workers` entry

**Context:** The entries in use carry `uri`, `name` (the session name, such as `🏠 🔑 personal.reg.household-sol`), `role`, `tier`, `focus`, `since`, `status` and `listening`, and inbox-terra adds `designation: primary`. Values in use include `listening: agora-call` and `tier: enablers`. Once the catalogue gives each role its glyph, `name` repeats what the role already says.

**Query:** Should an entry be closed to `role`, `tier`, `focus`, `since`, `status` (`active` or `idle`) and `listening` (`on` or `off`), plus `uri` if WORKERS-URI a), with `name` and `designation` dropped and the old values warned on during migration?

**Options:**

a) (recommended, confidence medium - one source for each fact, and the name can always be derived) Yes, as listed.

b) Keep `name` too, checked against the derived thread line.

### MULTI-ROLE - How a seat with several roles is written

**Context:** Kris asked for "multi-role seats (several glyphs)" and said managers may also make. A seat's tier is one value.

**Query:** For a multi-role seat, should `role` be a list with the primary first, the glyphs be written together in that order with no space (`🏛️⚖️ 🔑 ki.sop.main`), and `tier` be the primary role's tier?

**Options:**

a) (recommended, confidence medium - one token before the key keeps the line easy to read and to check) Yes.

b) Separate the glyphs with spaces (`🏛️ ⚖️ 🔑 ki.sop.main`) and keep the rest.

### MARKS-RETIRE - ⭐ and 🔧 in names

**Context:** The 2 November glyph set added ⭐ after a role glyph for Kris's primary assistant (`🦉⭐ 🔑 personal.reg.inbox-terra`), and 🔧 for a doer working in someone else's package. Kris's 7 November form is `<role glyphs> 🔑 <work-id>`. The brief says "whatever Kris is talking to is his point of contact" and makes seats for doers.

**Query:** Should ⭐ and 🔧 leave the thread line, so that inbox-terra becomes `🦉 🔑 personal.reg.inbox-terra`?

**Options:**

a) (recommended, confidence medium - neither is a role, and seats replace the doer form) Yes. Both are warned on during migration.

b) Keep ⭐ as an optional mark after the glyphs for a designated primary seat.

### RUN-THREAD-LINE - What background runs close with

**Context:** Kris kept `🧵 <work-id>` "for a session with no role yet" (7 November). A background run takes no seat; it reports to the seat that launched it. Run reports and the four ki-delegation footers close today with `🧵 <work-id>` of the work they report to. The footer hook does not check launched agents.

**Query:** Should runs keep closing with `🧵 <work-id>` of the work they report to?

**Options:**

a) (recommended, confidence medium - a run holds no seat, and the run prompts and footers need no change beyond wording) Yes.

b) Runs close with their launching seat's key line, which every brief would then have to supply.

### SEAT-ID - Seat addresses in the thread line

**Context:** Under SEATS-VS-SUBPACKAGES a) (Kris, 7 November) seats replace sub-packages, addressed `package+role` with sibling folders. The seat rules land later in Stage C. Today's work-id checks accept dots and hyphens only.

**Query:** Should the thread-line grammar and the hook accept a `+<role>` seat address now, or wait until the seat rules land?

**Options:**

a) (recommended, confidence medium - it avoids a second change to the hook and tests, and nothing produces a seat address until the seat rules land) Accept it now in the hook and the test patterns, while the standard describes it only when seats land.

b) Wait until the seat rules land.

### HOOK-ENGAGE - When the footer hook steps in on a bare owner word

**Context:** On 6 November, under NAME-GLYPH-HOME, Kris said the hook "accepts both forms and engages for any session holding a work package, not only after a `🧵` line". The hook sees the working folder, the transcript and the session id, but not the session's name. A conversational session in the same checkout must stay quiet, and an existing test checks that.

**Query:** For a bare owner word such as "mark", should the hook engage when an earlier reply closed with either thread-line form?

**Options:**

a) (recommended, confidence medium - it catches every coordinating session that has given one report and keeps conversational sessions quiet, but it falls short of Kris's broader words for a brand-new session) Yes: either form in an earlier reply engages it.

b) Also engage when a package's `workers` entry in the checkout names this session's id. That needs WORKERS-URI a).

### ROLE-REQUIRED - Whether every package must name its role

**Context:** Only 3 of 46 packages carry `role` in `work.md` today. Rule 6 says naming migrates incrementally, and "each governor brings its territory's packages into line". MIGRATION-OVERLAY (Kris, 7 November) puts tolerance in a separate migration file.

**Query:** Should `work.md` `role` be required in the final standard, with its absence only warned on through the migration file until the governors have brought their packages into line?

**Options:**

a) (recommended, confidence medium - it states the final state, as MIGRATION-OVERLAY asks, without failing 43 packages today) Yes.

b) Keep `role` optional for good.

### ROLES-HOME - Where the catalogue file lives

**Context:** Kris named ki-work-package as the catalogue's home (7 November). ROLES-SLOT a) (7 November) reserved a `standards-roles.md` row in the planned load table of the split ki-coordination standard, to be created at Stage C. Rule 11 of the brief put role definitions "beside `subagents/`".

**Query:** Should the catalogue be created now as `skills/governance/ki-work-package/references/standards-roles.md`, with its migration file `migration-roles.md` beside it, and the reserved ki-coordination row pointing to it?

**Options:**

a) (recommended, confidence high - it follows Kris's named home, and one file serves both skills) Yes.

b) Create it in ki-coordination's references, as the split plan first placed it.

### BOOTSTRAP-EDIT - One line outside the named homes

**Context:** `skills/keystone/ki-bootstrap/references/standards-bootstrap.md:112` says the opener launches with `claude --name "🧵 <work-id>"`. Kris's list of homes for this unit does not name ki-bootstrap.

**Query:** May `roles-land` change that one line to the new thread-line form?

**Options:**

a) (recommended, confidence high - otherwise two standards disagree about the launch name) Yes, with a one-line wording change.

b) No; send it to the next ki-bootstrap edit.

### 🤖 → 👤 Handoff to supervisor · at 02:36 GMT

👤 13 with you

- [with you] 13 design queries · owner · since 02:36

🧵 ki.reg.guilds
