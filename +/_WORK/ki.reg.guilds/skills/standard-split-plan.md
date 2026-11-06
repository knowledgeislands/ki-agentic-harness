# [KI > Guilds](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/+/_WORK/ki.reg.guilds/work.md) › standard-split

**🤖 → 👤 Handoff to supervisor · Run report at 23:55 GMT · last mark none**

---

## Done

- Design run only: I read the standard, `SKILL.md`, the rubric, `sources.md`, the output style, the generator, the banner test, both hooks and every inbound link, and changed nothing in the harness or the package. No commit was made.
- The plan below cuts the standard from about 45,600 words in one file to about 21,000 words in sixteen files. It names one core of about 3,500 words and fourteen purpose files, and reserves a slot for the Stage C role catalogue. It also cuts the always-loaded output style from about 6,700 words to about 3,900.
- The two sample rewrites come out 41% and 46% shorter with no rule dropped (540 → 321 and 543 → 295 words).
- Mapping the sections and rubric items turned up nine places where the rubric, `SKILL.md` or the examples no longer match the standard. They are listed under "Found while mapping" and raised as DRIFT-FIRST.

### The model: units of comprehension

Each unit is one file under `skills/change-management/ki-coordination/references/`. `SKILL.md` links every file directly, which keeps references one level deep as `ki-skills` requires. A purpose file stays short enough to count as the turn budget's "one short file" read, so loading it costs one tool call.

| # | Unit | File | Boundary: what it owns | Loaded when, by what | Hands to |
| --- | --- | --- | --- | --- | --- |
| 0 | Core | `standards-coordination.md` (name kept) | The principle and three hard rules; turn budget, self-check, small fixes, permission-prompt shapes; waiting and the one watcher loop in brief; update cadence and gap Summary; concurrency; states, moves and receive words; report heading, form line and the three times; banner layout and the one table of states; thread line; mark verbs; the message-acting rule in five lines; commit-and-sync rule; decisions logged in the turn; `method_read` check; the five-rule hook paragraph; generated-surfaces map; the **load table** naming each purpose file and its occasion | Every coordinating turn, through the output style generated from it; read at bootstrap by Codex sessions, which have no style; the hook line points here | Every purpose file, through the load table |
| 1 | Reporting | `standards-reporting.md` | The three reply forms, session kinds, units of work, conversational bounded work, coordinator-only machinery; the owner report (sections, query shape, confidence, posting outside, plain English, levels); answers; tags; quiet tools; linking records; the `run-report` and `footer-report` source blocks | Every session when a unit of work ends; non-coordinating sessions through the hook line's "otherwise" clause; every run through its footer and run-prompt links | Report forms (coordinator shapes), Queries (review) |
| 2 | Report forms and banner | `standards-report-forms.md` | The form table and verbs; one template per form; the Summary with its status table, footer art and long and short footers; Findings; roadmap and package lines; mode lines; rendered glyphs; the restart suggestion; the six marked banner examples the style embeds | Before writing a Summary, Status, re-bootstrap, hold or finish report when the style's summary is not enough; by `SUMMARY`, `MARK` and `SEND` modes | Queries (the pass after a Summary), Holds (hold report detail) |
| 3 | Queries | `standards-queries.md` | Blind query review, split rule, `DEFAULTS` query, proposed transfers placed last, the interactive pass (two replies, timer, card shape, plain fallback), acceptance bundles | Before raising a medium-, low- or destructive high-confidence query; at receive of a run report with queries; after a Summary that lists queries | Decisions (each answer logged) |
| 4 | Holds and Snoozing | `standards-holds.md` | Drain, `drain` alone, cannot drain, paused hold, Snoozing, territory hold, release | On `pause`, `done for now`, `snooze`, `drain`, `hold`, `resume`; by `HOLD`, `DRAIN`, `RESUME` modes | Mark and tidy (mark struck at hold), Report forms (hold report) |
| 5 | Unattended windows and headless passes | `standards-unattended.md` | Away grants, the window (clock, grant, entry plan, awake, progress, questions, expiry, return), scheduled wakes, out-of-session wakes, headless passes | When the owner grants time away; at window expiry or return; by the headless-pass job's brief | Queries (unpack before entry), Sync (conflict run), Report forms (return Summary) |
| 6 | Listening and host sync | `standards-listening.md` | The watcher's shape, the four capability fields, the tidy at each wake, host sync passes | When the owner says "listen" or "stop listening"; at each arm or stop; at bootstrap of a Rig host sync thread | Messages (acting on a new line) |
| 7 | Territory work | `standards-territory.md` | Main and secondary States of play, registry, cap, seeding, flags, dispatch, stewardship of improvement, assigned-package stewardship, acting for idle packages, worktree sweep, work awaiting review | Opener of any `<territory>.sop.*` package; by a State of play acting for an idle package | Messages (routing), Queries (acceptance first), Roles (Stage C) |
| 8 | Opening and naming | `standards-opening.md` | Levels and forms, id, slug, title, label and work name, the four openers, `ki agent prompts`, the rename line | When seeding or renaming a package, writing an opener, or checking identity at bootstrap | Bootstrap |
| 9 | Bootstrap and re-anchoring | `standards-bootstrap.md` | Machine readiness pointer, the bootstrap steps, re-anchoring after compaction, picking work up by state, red-x recovery, targeted refresh and landed notices | By every opener's "First step"; by the hook pointer after compaction; on a `REFRESH` line; on a red x | Opening (identity check), Territory (acceptance and review first) |
| 10 | Messages and routing | `standards-messages.md` | Queue place, priority and `IMPORTANT`, sender and receiver, route receipt, handoffs and rollouts, release notices, inbox check, surfaces and "a backend reply is not visible progress", first-message seeding | When a line needs more than the core's acting rule; when sending, routing or returning a line | Territory (dispatch), Queries (what needs the owner) |
| 11 | Decisions and design notes | `standards-decisions.md` | The two faithfulness rules, decision classes, record threshold, life cycle, design-note home and review | When logging a decision that is more than operational; at each mark | Mark and tidy |
| 12 | Mark, tidy and Finishing | `standards-mark.md` | The mark in detail, parking tangents, pruning the package, closing out Orca workers, the four-step close-out and Finished | At `mark`, at each send, at hold, at `finish`; by `MARK` mode | Decisions, Sync (level check) |
| 13 | Sync | `standards-sync.md` | Commit cadence detail, pushing beneath other sessions, the conflict run, the level check, keeping primary checkouts current | When a pull cannot fast-forward; before a host move; at each mark for the level check | Delegation (conflict-run boundary) |
| 14 | Past shapes | `standards-past-shapes.md` | The thread-to-work mapping, the tolerance window, and every "a report written before X keeps Y" reader rule in one table | Only by readers of old reports, the rubric's tolerance checks and migrations; never by a working coordinator | None |
| 15 | Roles (reserved for Stage C) | `standards-roles.md` | The role catalogue (governor, councillor, guildmaster, warden, steward, housekeeper, gatekeeper, librarian, quartermaster, makers), the `role` field in `work.md`, what each role may do and whom it hands to | At bootstrap when `work.md` carries `role`; by the opener's role line | Core (the three rules bind every coordinating role), Territory, Opening |

`sources.md` gains a **decision register**: one row per tag giving the date, the owner's words and the rule it now lives in. Each section of the standard ends with at most one `Sources:` line naming its tags. The deferred host-move notes stay where they are.

### Glossary: one term for each idea

| Use | Means | Stop using |
| --- | --- | --- |
| the owner | Kris, in rules | Kris (outside quotes in `sources.md`), the supervisor (except in state names) |
| coordinator | the session coordinating a package | coordinating session, coordinating thread, thread (except "thread line", "sync thread") |
| run | what the coordinator launches through `ki agent` and later receives | background agent, agent, helper (the three hard rules keep "detached background agent" word for word) |
| package | `+/_WORK/<id>/` and its five files | work package, work folder, work file (as a name for the package) |
| `work.md`, `state.md`, `discussions.md`, `messages.md`, `decisions.md` | the five files, always by file name | work file, state file, decisions log, queue file |
| State of play | territory work; "main" or "secondary" where it matters | territory work, SoP (outside ids and titles) |
| line | one entry in `messages.md` | message, entry, message line |
| watcher | the one detached loop that wakes the coordinator | heartbeat, background check, inbox watcher, monitor, waiter |
| wake | the watcher exiting on news | — |
| hold, drain, Snoozing | the state, the activity into it, and the hold that waits for a message | more expected, listening hold |
| mark | the timestamp in `state.md` | — |
| Summary, Status | the two board forms | recap, full summary |
| report | any owner report form | completed-work report, owner report (after its definition) |
| heading, form line, banner, thread line | the report's frame | footer (except "long footer" and "short footer", defined once) |
| query, tag | an open decision and its stable mnemonic | Needs tag, Needs item |
| decision | one entry in `decisions.md` | — |
| record | a roadmap work record | work item, roadmap item |
| sync | fetch, fast-forward pull into a clean checkout, push fast-forward only | git sync, the sink |
| past shape | anything written before a change, readable under `standards-past-shapes.md` | "a report written before X keeps Y; anything that reads past reports accepts it" |
| opener | the steering brief that opens a coordinator | prompt (for openers) |

### The terse rewrite: rules

This takes Caveman's method and leaves its voice: every sentence stays a full sentence, as `ki-authoring` requires, and only filler and repetition go.

1. **One fact, one place.** The standard says a rule once, in its unit, and other units link to it. Most of the length today is the same rule stated three to five times: the hold rule appears in the standard's banner section, Putting work on hold, Templates, the output-style source and `SKILL.md`.
2. **History out.** Every "as Kris set under X on date, in these words: …" clause, every quote and every trial account moves to the `sources.md` register, leaving a section-end `Sources:` line.
3. **Past shapes out.** All 25 "written before" and tolerance-window clauses move to `standards-past-shapes.md`.
4. **Lists and tables for long sentences.** A sentence with more than two "and"-joined clauses becomes a list. Parallel facts with short cells become a table. Under `ki-authoring`, a two-column table or one whose cells run to full sentences becomes a list instead.
5. **Fixed terms** from the glossary, with no synonyms.
6. **Drop the obvious.** Filler such as "so that", "in every case", "as it does", "whatever the case" and "the coordinator then" goes. So does any sentence that restates a heading, and any rationale the reader does not need in order to act; that rationale goes to the register.
7. **Keep every hard token:** command, field, value, number, glyph and path. The proof below checks them mechanically.

### Sample 1: Thread capabilities, 540 → 321 words (−41%)

Before, from `standards-coordination.md` lines 223-232:

```markdown
### Thread capabilities

A coordination thread may have two capabilities, as Kris set under THREAD-CAPABILITIES on 31 October 2026: "we've got coordination threads, and then I think we've got syncing threads. A coordination thread can be a syncing thread which syncs between hosts or a host sync capability. And then I think we've got one which is like a listening capability". Each is switched on only by the owner's express word, recorded in the work's decisions log, or by an agreed role, such as a Rig host sync thread's.

Each thread records its capabilities in four `state.md` fields under the `ki-work-package` state file, as Kris set under FOOTER-CAPABILITY-STATUS-2, relayed on 1 November 2026: `listening_enabled` and `syncing_enabled`, `true` or `false`, say whether the thread has the capability, and `listening_status` and `syncing_status`, `on` or `off`, say whether it is running now. If `syncing_enabled` is true, `listening_enabled` must be true, because a syncing thread is always a listening thread. The coordinator sets `_enabled` when the owner's word or the agreed role grants the capability and clears it only when the owner withdraws it; it sets `_status` at every arm, stop, drain, hold and resume. "stop the wake" or "stop listening" turns the status off and leaves the capability enabled. At Finished the close-out clears both `_enabled` fields.

- **Listening:** the thread keeps the inbox watcher armed, under LISTEN-OPT-IN. A listening thread also tends its own work package, as Kris set under LISTEN-TENDS-PACKAGE the same day: "if a thread is listening, it's important that it is also helping to manage and refine the work packages and make sure they're in good state". At a wake it makes at most one small tidy, within its turn budget: it keeps `state.md`'s front matter and next steps true; prunes received reports and spent briefs under the `ki-work-package` tidy rules; strikes a decision, or reduces it to a one-line pointer, once a durable home carries it, under the decisions life cycle; keeps `discussions.md` free of answered entries; and raises what it cannot settle as a query. It says nothing about a tidy unless something needs the owner. It never edits another work's package, though it may point out a problem in one with a line in that work's `messages.md`.
- **Host sync:** the thread is its Mac's sync thread. It repeats each pass until the Mac and GitHub are clean and level, or until something needs judgement, and only then waits for its next slot, as Kris set under SYNC-UNTIL-CLEAN the same day: "a resync doesn't finish until it's got to a point of being clean". It stays quiet on quiet passes, under SYNC-QUIET: nothing when nothing changed, at most one short line when something did, and a full report only for something that needs judgement or the owner. Host sync implies listening.

The banner's mode lines show the listening capability's status, `👂 listening` or `🔇 not listening`. Host sync has no banner line, as Kris decided under SYNC-LINE-OFF at about 18:00 GMT on 4 November 2026: remove the sync mode line from the banner entirely, now, because Agora keeps the machines in sync through each machine's household work package, so the line no longer says anything true and useful. The `syncing_enabled` and `syncing_status` fields stay in `state.md`.
```

After:

```markdown
### Thread capabilities

A coordinator may hold two capabilities. Each is switched on only by the owner's express word, logged in `decisions.md`, or by an agreed role, such as a Rig host sync thread's. `state.md` records them in four fields:

| Field | Values | Set |
| --- | --- | --- |
| `listening_enabled`, `syncing_enabled` | `true` or `false` | when the owner grants or withdraws the capability |
| `listening_status`, `syncing_status` | `on` or `off` | at every arm, stop, drain, hold and resume |

- `syncing_enabled: true` requires `listening_enabled: true`.
- "stop the wake" or "stop listening" sets the status to `off` and keeps the capability.
- Finishing clears both `_enabled` fields.

**Listening.** The coordinator keeps the watcher armed under [Listening](#listening). At each wake it also makes at most one small tidy of its own package, within the turn budget:

- keep `state.md`'s front matter and next steps true;
- prune received reports and spent briefs under the `ki-work-package` tidy rules;
- strike a decision, or cut it to a pointer, once a durable home carries it;
- clear answered entries from `discussions.md`;
- raise what it cannot settle as a query.

It mentions a tidy only when something needs the owner. It never edits another package; it may flag a problem there with one line in that package's `messages.md`.

**Host sync.** The coordinator is its Mac's sync thread. It repeats each pass until the Mac and GitHub are clean and level, or until something needs judgement, and only then waits for its next slot. A quiet pass says nothing, a pass that changed something says one line, and only a matter for judgement or the owner gets a report. Host sync implies listening. The banner has no sync line, because Agora keeps the machines in sync; the two sync fields stay in `state.md`.

Sources: THREAD-CAPABILITIES, LISTEN-OPT-IN, LISTEN-TENDS-PACKAGE, SYNC-UNTIL-CLEAN, SYNC-QUIET, FOOTER-CAPABILITY-STATUS-2 and SYNC-LINE-OFF in [the decision register](sources.md#decision-register).
```

The banner's `👂 listening` and `🔇 not listening` sentence is not lost: it is stated once, in the core's banner layout.

### Sample 2: The mark, 543 → 295 words (−46%)

Before, from `standards-coordination.md` lines 1346-1357:

```markdown
### The mark

The mark is only a timestamp: the default start of the next Summary, as Kris approved under SUMMARY-MODEL on 4 November 2026. A Summary is distinct from `ki-recap`, which summarises one session at a lower level; the two share no format or procedure.

At each mark, perform the repository level check before reporting the mark.

- **Mark:** the point at which the next Summary starts by default, and at which decisions are struck and the working area tidied, struck by the owner at a moment of their choosing or by a hold. Each piece of work has one mark, and striking a new one replaces it; Git holds the history of earlier marks. The state file's front matter keeps it as `mark: <UTC timestamp>`. The timestamp bounds the logbook, work-record transitions, background-agent reports and the decisions log, whose entries carry their own timestamps. The banner and the mark describe or date a decision and never cite a number, because a number, in Kris's words of 2026-10-14, "has no meaning to me because I don't know what the decision was ... and I don't know where the list is".
- **Striking:** only the owner moves the mark, by saying `mark`, `mark only` or `mark, status only`, and a hold strikes one. Giving a Summary or a Status does not move it. The coordinator then works the decisions life cycle on the entries, prunes its work folder, closes out its Orca workers, commits the work folder and confirms in one line.
- **Summary after the mark:** `mark`, and every mark struck at the end of a query set, is followed at once, in the same reply, by the Summary since the previous mark, with every open query in full, so Kris never has to ask for it; `mark only` strikes it with no Summary, and `mark, status only` strikes it and gives the Status, the Summary without its history. A hold report stays the exception: a hold's mark is followed by its hold report instead. Kris set the Summary after the mark on 31 October 2026 under MARK-THEN-SUMMARY: "you take mark, can you tell me basically you're expecting always summary in full after mark has been taken? That's I expect", and added `mark only` under SUMMARY-MODEL.
- **Outstanding:** the open and parked Needs tags in `discussions.md`, open work records in the work's scope, running or queued background agents, and parked tangents. Outstanding carries forward across marks: striking a mark resets only the window of `## Summary since <time>`, and never drops, closes or hides an open item, which the Summary's status table and `## Queries` carry in full.
- **History:** the work's history comes from the logbook and the run reports, never from `state.md`, as Kris took STATE-HISTORY on 19 October. `git log -- +/_WORK/<id>/work.md` is the history of what the work is and `git log -- +/_WORK/<id>/state.md` the history of its moves; `state.md` holds no dated log, commit runs or test counts, and may link one report or commit rather than copy it, which the `ki-work-package` rubric's history check warns on.
- **No mark yet:** a Summary runs from the thread's start, and the first `mark` strikes the first mark; where the thread's start is unknown, it runs from `work.md`'s `created_at`.
```

After:

```markdown
### The mark

The mark is a timestamp, `mark: <UTC timestamp>` in `state.md`'s front matter, and the default start of the next Summary. Each package has one mark; a new mark replaces it, and Git keeps the earlier ones.

- **Who moves it:** only the owner, with `mark`, `mark only` or `mark, status only`, and a hold. A Summary or a Status never moves it.
- **What follows it:** `mark` gives the Summary since the previous mark in the same reply, with every open query in full, and so does the mark that closes a query set. `mark only` gives nothing more, `mark, status only` gives the Status, and a hold's mark gives the hold report.
- **Work at the mark,** in this order: run the [level check](standards-sync.md#level-check); work the [decisions life cycle](standards-decisions.md#life-cycle); [prune the package](#pruning-the-package) and review its design notes; [close out Orca workers](#closing-out-orca-workers); commit the package; confirm in one line.
- **Open items carry forward:** a mark resets only the Summary's window. Open and parked queries, open records in scope, running and queued runs and parked tangents stay on the status table and in `## Queries`.
- **History:** comes from Git and run reports, never from `state.md`. `git log -- +/_WORK/<id>/work.md` shows what the work is and `git log -- +/_WORK/<id>/state.md` its moves. `state.md` holds no dated log, commit list or test counts; it may link one report or commit.
- **No mark yet:** the Summary runs from the session's start, or from `work.md`'s `created_at` where that is unknown. Work opened in a new session with no mark strikes one at its start.
- **Not a recap:** a Summary covers the package since the mark, and `ki-recap` covers one session; they share no form.

Sources: SUMMARY-MODEL, MARK-THEN-SUMMARY and STATE-HISTORY in [the decision register](sources.md#decision-register).
```

Two rules move elsewhere rather than drop. "Never cite a decision by number" is said once, in the core. "The timestamp bounds the logbook, record transitions, run reports and decisions" moves to the Summary's sources paragraph. The sample also takes in Bootstrap's duplicate rule that a new session with no mark strikes one.

### The output style

- **What it carries:** the core alone, rendered from it, plus the six banner examples it already embeds from Report forms. The core is the every-turn contract: the three rules, budget, wakes, cadence, states, heading, banner and table of states, mark verbs, acting on lines, commit and sync, logging decisions, the refresh check, and the load table that tells the coordinator which purpose file to read for each occasion. Purpose-file detail stays out.
- **How it is generated:** the `output-style` source block, 6,450 words of hand-maintained second copy, is deleted. The generator builds the style from the core's front-matter block plus the core body between `<!-- ki-coordination:style-start -->` and `<!-- ki-coordination:style-end -->`. It rewrites relative links to plain `ki-coordination <file> § <section>` text, because a link in a style file does not resolve. The Contents list and the generated-surfaces map stay outside the markers.
- **Size:** about 3,500 core words plus 350 words of banner examples and front matter, about 3,900 words, down from 6,716 (−42%). Holding the core to 3,000 words would take the style to about 3,400.
- **Effect:** the style and the standard can no longer drift apart, because the style is the core. The banner test's byte-identity check becomes trivially true for the core and stays meaningful for the embedded examples.

### The mechanics

- **`ki dev skill generate ki-coordination`** (`scripts/generate/index.ts`): `STANDARD` becomes a list of the reference files. `markedBlock` searches the whole set and still requires exactly one marker across it. `hook-line` stays in the core and keeps pointing at `standards-coordination.md`. `hook-pointer` moves its target to `standards-bootstrap.md#re-anchoring-after-compaction`. `run-report` and `footer-report` move with the owner report into `standards-reporting.md`, and their links are retargeted there. `review-independence` moves to `standards-queries.md`. The style is built as above.
- **`scripts/banner.test.ts`:** `standard` becomes the concatenation of every `references/standards-*.md`, so its 30-odd shape assertions keep holding wherever a rule lands. Assertions that pin a home read that file: the five hard rules and the load table read the core, and templates read report forms. New tests:
  - every reference file is linked from `SKILL.md`;
  - every file over 100 lines opens with a contents list;
  - every `standards-*.md#anchor` link in the harness resolves to a heading or `<a id>` in its target;
  - a soft word budget warns over 3,500 words for the core and 1,500 for a purpose file, which keeps each a "short file";
  - the hard-token coverage test below.
- **Footer hook** (`hooks/coordinator-footer/coordinator-footer.sh`): it reads the report shape, not the standard's text, so only its `SOURCE` comment and the hooks README pointer change, to `standards-report-forms.md`. `hooks/coordinator-reminder/coordinator-reminder.test.ts` reads the core path twice; the path is unchanged, so only an assertion on the pointer text moves.
- **The rubric:** each item's `source` anchors in `scripts/rubric/items/threads.ts` are retargeted per the criteria map below. Then `ki dev skill rubric ki-coordination --write` regenerates `references/rubric.md`, whose "→ standard" link stays on the core.
- **`ki-work-package` and the other inbound links:** 41 distinct anchors from about 35 harness files are rewritten in the same commit. That covers `ki-work-package`, `ki-delegation` and its four generated footers, `ki-trades`, `ki-accept`, `ki-recap`, `ki-work`, `ki-work-design`, `ki-tokenomics`, `ki-repo`, `ki-repo-tools`, the hooks README and three roadmap records. Outside the harness, about 70 files link the standard, 51 of them in Knowledge Islands Principal, mostly packages under `+/_WORK/`. Of their links, 78 are pinned to a revision and keep working; 109 are local and unpinned. Those are handled under LINK-STUBS.
- **`SKILL.md`:** it is rewritten as a router. Its long description paragraph becomes the load table, which lists each reference with what it holds and when to load it, and each mode names its file (HOLD, DRAIN and RESUME → holds; MARK → mark; SUMMARY → report forms). Its notes keep only what is not in a unit. That takes it from about 2,470 to about 1,200 words.
- **`method_read`:** it watches whole directories, so the split needs no change. Each delivery commit is itself a method change, and Ways of working or the State of play sends the targeted `REFRESH` line.

### Proving no rule is lost

1. **Rule inventory.** Before any edit, a run extracts every normative sentence from the standard and the output-style source into an inventory: each sentence carrying a must, never, only, every, always or an imperative, and each table row. Each entry gets a source anchor. Each is then given one disposition: **kept** (new file and anchor), **merged** (duplicate of entry N), **to sources** (history only) or **dropped** (reason, owner-approved). The inventory is committed as a design note in the package and deleted when the split graduates.
2. **Hard-token coverage, mechanical.** A test extracts every inline code span, every number with a unit (`15 minutes`, `31 days`, `ten turns`, `eight`, `three or four`) and every glyph line from the pre-split standard at a pinned revision. It asserts each appears somewhere in the new reference set or `sources.md`, or in a reviewed allowlist of deliberate drops.
3. **Blind section-pair review.** One Codex reviewer on the strongest model reads each old section beside its new home, with the inventory, and flags any rule missing or changed in meaning. It sees neither this report nor the coordinator's view.
4. **Existing gates:** `bun run test` (with the banner test reading the set), `bunx tsc --noEmit`, `ki repo audit --skill ki-coordination`, `--skill ki-skills` and `--skill ki-work-package`, and `ki dev skill generate ki-coordination` reporting no stale surface.

### Mapping: every `##` and `###` section (words now → new home)

| Section now | Words | New home |
| --- | --- | --- |
| Contents | 206 | each file's own contents list |
| Scope | 239 | Core § Scope (the `[skills.ki-coordination]` declaration sentence included) |
| The work model | 443 | Core § Scope (one paragraph: the Work Process note owns the model); mapping table and tolerance window → Past shapes |
| The responsive coordinator | 346 | Core § The responsive coordinator; SMALL-FIXES rationale → sources; "four layers" paragraph → Core § Surfaces (pilot acceptance-test clause dropped as stale, see DRIFT-FIRST) |
| Glossary | 316 | Core § Glossary, rebuilt from the glossary above |
| Levels and forms | 575 | Opening § Levels and forms; the "coordination is an explicitly selected role" paragraph → Core § Scope |
| Work naming | 1,425 | Opening § Naming; examples table refreshed to canonical ids |
| Coordinator responsiveness | 2,891 | Core (budget, small fixes, never in-session, waiting, brief-writing, self-check, tool calls, owner messages, cadence, gap Summary, concurrency, five-rule paragraph, binding); Listening (inbox watch, listening lines); Unattended (away grants, scheduled wakes, out-of-session wake); the hook paragraph → Core § Surfaces |
| Thread capabilities | 537 | Listening (Sample 1) |
| Coordinating practices | 775 | Core (heading and banner, heading levels, self-contained, sending, state file, decisions, claims); Reporting (links, wording); Queries (questions); Territory (owner-queue cap); Messages (messages) |
| Interactive pass | 829 | Queries § Interactive pass |
| States and moves | 309 | Core § States and moves |
| Banner | 4,857 | Core (layout, one table of states, heading-for line, thread line, push state, hold lists nothing); Report forms (report heading detail, roadmap and package lines, mode lines, rendered glyphs, restart suggestion, the six examples, run-report heading example) |
| Re-anchoring after compaction | 314 | Bootstrap § Re-anchoring |
| Surfaces | 416 | Messages § Surfaces |
| Recovering a session showing a red x | 158 | Bootstrap § Red-x recovery |
| Reply forms | 440 | Reporting § Reply forms (the recommendation-with-confidence rule included) |
| Session kinds | 203 | Reporting § Session kinds; the opener-resolution paragraph → Bootstrap |
| Units of work | 289 | Reporting § Units of work |
| Conversational bounded work | 200 | Reporting |
| Coordinator-only machinery | 70 | Reporting |
| Owner report | 2,617 | Reporting § Owner report; the 13 October blockquote and heading-rename history → sources |
| Answers | 125 | Reporting |
| Quiet tools | 196 | Reporting (anchor `quiet-tools` kept; 9 inbound links) |
| Needs tags | 91 | Reporting § Tags |
| Query review | 705 | Queries § Review |
| Generated surfaces | 7,699 | Core § Surfaces (map, hook-line, hook-pointer, footer-check paragraph); Reporting (run-report, footer-report sources); Queries (review-independence); output-style source deleted, the style generated from the core |
| Report forms | 928 | Report forms § Forms and verbs |
| Templates | 797 | Report forms § Templates |
| The Summary | 1,029 | Report forms § The Summary; `DEFAULTS` paragraph → Queries |
| Coordinating work | 268 | Territory § Project work under a State of play; the release-on-demand line → Core § Scope |
| Territory work | 1,449 | Territory |
| Coordinating assigned packages | 527 | Territory § Assigned packages |
| Secondary States of play | 516 | Territory § Secondary States of play |
| Opening work | 786 | Opening § Openers |
| Bootstrap | 566 | Bootstrap § Steps; "no mark yet" → Mark |
| Messages between work | 1,121 | Messages; acting rule summarised in Core |
| Decisions and design | 138 | Decisions (lead paragraph); "a logged decision authorises across sessions" → Core |
| Decisions log | 394 | Decisions § Log |
| Decision classes | 360 | Decisions § Classes and record threshold |
| Decisions life cycle | 235 | Decisions § Life cycle |
| Design notes | 177 | Decisions § Design notes |
| Finishing Project work | 238 | Mark § Finishing |
| Working rules | 14 | dissolved; each rule in its unit |
| The mark | 540 | Mark § The mark (Sample 2); verbs summarised in Core |
| Parking tangents | 124 | Mark § Parking tangents |
| Linking records | 413 | Reporting § Links |
| Committing the work folder | 347 | Core (the rule); Sync (cadence detail) |
| Pruning the work folder | 544 | Mark § Pruning |
| Closing out Orca workers | 619 | Mark § Orca workers |
| Putting work on hold | 1,422 | Holds; the 15 October drain blockquote → sources |
| Unattended windows | 889 | Unattended |
| Headless passes | 1,128 | Unattended § Headless passes |
| Picking work up | 583 | Bootstrap § Picking work up |
| Work awaiting review | 191 | Territory § Work awaiting review |
| Acceptance bundles | 209 | Queries § Acceptance bundles |
| Worktree sweep | 169 | Territory § Worktree sweep |
| Pushing beneath other sessions | 363 | Sync |
| Repository level check | 234 | Sync § Level check |
| Keeping primary checkouts current | 93 | Sync |
| Refreshing this guidance | 444 | Core (the `method_read` check); Bootstrap (targeted refresh, landed notices); METHOD-NUDGE history → sources |
| Mechanical boundary | 265 | **No home: dropped.** It restates the generated rubric, which stays the one source of what the checks cover; Core keeps one pointer line |

### Mapping: rubric criteria

| Item | Cites now | Cites after |
| --- | --- | --- |
| RUBRIC-1 | `ki-skills` rubric-authoring standard | unchanged |
| COORD-1 territory work in the Capital | territory-work, the-work-model | Territory; Past shapes |
| COORD-2 Project resolves in registry | work-naming, coordinating-work | Opening § Naming; Territory |
| COORD-10 level agrees with id | levels-and-forms | Opening § Levels and forms |
| COORD-3 active Project cap | territory-work | Territory § Cap |
| COORD-7 record identifiers linked | linking-records | Reporting § Links |
| COORD-11 recommended option has confidence | owner-report, query-review | Reporting § Owner report; Queries § Review |
| COORD-12 report opens with heading | owner-report | Reporting § Owner report; Report forms |
| COORD-8 hook and style bound | coordinator-responsiveness | Core § Surfaces |
| COORD-4 responsive coordinator | coordinator-responsiveness, coordinating-work | Core; Listening; Territory |
| COORD-5 tangents, links, checkouts | working-rules | Mark § Parking tangents; Reporting § Links; Sync |
| COORD-6 owner forms, mark, refresh | coordinating-practices, report-forms, working-rules | Core; Report forms; Holds; Mark; Unattended; Queries § Interactive pass |
| COORD-13 blind query review | query-review | Queries § Review |

### Found while mapping (no home until fixed)

1. COORD-13's last sentence says the interactive pass "takes one or two self-contained blocks at a time", which contradicts the one-decision, two-reply pass.
2. COORD-6 says the coordinator notes `ki-coordination read at <revision>`; the standard uses `method_read`.
3. COORD-6 and `SKILL.md` give a hold report only on `pause` or `done for now`, omitting `snooze`.
4. `SKILL.md`'s refresh note compares two directories; the standard compares three skills and the output style.
5. The glossary's "thread line" still names "the thread type, work label and id"; the rule is the bare `🧵 <work-id>`.
6. The Work naming examples use the old ids (`ki`, `ki.ways-of-working`, `ki.regular`), as does its work-name example.
7. The standard's form-line list omits `Finish report`, which its own template and the output style use.
8. "Keeping primary checkouts current … before a recap" still uses the retired word.
9. Two items may be stale: the "pilot's acceptance tests" layer and the `thread.status` row in the surfaces table, which lasts "until `ki work status` reads the work package directly".

### Sizes (words, approximate)

| File | Before | After |
| --- | --- | --- |
| Core `standards-coordination.md` | 45,607 (whole file); its own share ≈ 6,400 | 3,500 |
| Reporting | ≈ 4,800 | 2,600 |
| Report forms and banner | ≈ 5,600 | 2,800 |
| Queries | ≈ 1,700 | 1,000 |
| Holds and Snoozing | ≈ 1,400 | 750 |
| Unattended and headless | ≈ 2,500 | 1,300 |
| Listening and host sync | ≈ 1,300 | 650 |
| Territory | ≈ 3,200 | 1,500 |
| Opening and naming | ≈ 2,800 | 1,300 |
| Bootstrap and re-anchoring | ≈ 2,100 | 1,100 |
| Messages and routing | ≈ 1,800 | 950 |
| Decisions and design notes | ≈ 1,200 | 650 |
| Mark, tidy and Finishing | ≈ 1,600 | 950 |
| Sync | ≈ 900 | 450 |
| Past shapes | ≈ 1,300 | 700 |
| Output-style source block | 6,450 | 0 |
| Contents and mechanical boundary | ≈ 450 | contents lists ≈ 400 |
| **Reference set total** | **≈ 45,600** | **≈ 21,000 (−54%)** |
| Roles (Stage C) | 0 | reserved, ≈ 800-1,200 |
| `sources.md` | 10,451 | ≈ 16,500 with the decision register |
| `SKILL.md` | 2,466 | ≈ 1,200 |
| `output-styles/ki-coordinator.md` (always loaded) | 6,716 | ≈ 3,900 (−42%) |

The standard roughly halves, as Kris expected. Most of the cut is repetition and history, not rules, and the history is kept in `sources.md`.

### Implementation steps, in order

1. **Drift fixes first** (DRIFT-FIRST): one small delivery fixes the nine items above in the current single file, so that the split moves a consistent text.
2. **Rule inventory** (proof step 1) at a pinned revision; commit it as a design note in this package.
3. **Mechanical split, no rewording.** Create the fifteen files by moving sections as mapped. Add the core's load table and the anchor stubs if LINK-STUBS a) is taken. Retarget the generator, the banner test (concatenated set), the hook pointer, the rubric item sources, `SKILL.md` links and every harness inbound link, all in one commit. Regenerate the surfaces and the rubric, run the gates, and add the hard-token coverage test against the pinned revision. The output style is still the source block at this step, so its behaviour is unchanged.
4. **History out.** Build the `sources.md` decision register and replace quotes and dated clauses with `Sources:` lines. Move every past-shape clause to `standards-past-shapes.md`. Coverage test and gates.
5. **Terse rewrite, one unit per commit**, core last, each against the glossary. A blind section-pair review runs per unit before its commit lands.
6. **Style from the core.** Add the style markers to the core, delete the `output-style` source block, switch the generator, and add the word-budget and link-resolution tests. Regenerate, run the gates, and check one live Claude session and one Codex bootstrap.
7. **Rollout.** Send a targeted `REFRESH` line to every package whose `method_read` predates step 6, and send a line to `ki.sop.main` to rewrite live unpinned links in Knowledge Islands Principal. Remove the anchor stubs once a scan finds no live unpinned link to a moved anchor.
8. **Stage C** adds `standards-roles.md` into its reserved slot.

## In Progress

Nothing is running.

Outstanding - no action requested now:

- Every query below except LEGACY-FILE carries medium confidence, so each needs one blind review before it reaches Kris. Under the query-review rule, the coordinator runs those reviews at receive; this run did not launch them.
- The temporary samples were folded into this report, and the temporary folder is empty.

## Queries

### STAGING - one delivery or staged

**Context:** The split touches the standard, its generator, its test, the rubric, the hooks and about 35 inbound files. Doing it in stages means the first stage only moves text, the second moves history out, the third rewords one unit at a time, and the fourth generates the style from the core. Each stage can then prove no rule was lost before the next one starts.

**Query:** Should the split land in the staged order above, or as one delivery?

**Options:**

a) (recommended, confidence medium - stages make each proof small, but four rounds of review cost more owner time) land it in the seven implementation steps above, each a separate delivery with its own gates

b) land the split, history move and terse rewrite as one delivery, with one large review

### STYLE-FROM-CORE - generate the always-loaded style from the core

**Context:** Today the output style is a 6,450-word hand-written second copy of the rules, kept in a source block inside the standard, and it drifts from the standard (three of the drift items above show this). The plan deletes that copy and builds the style from the core itself, so it is about 3,900 words and cannot drift. The cost is that the style reads like a reference file, with links turned into plain section names, rather than a tuned second-person brief.

**Query:** Should the output style become the core, generated, rather than a separate source?

**Options:**

a) (recommended, confidence medium - removes 6,450 duplicated words and all drift, untested in a live session) generate the style from the core between two markers, with the banner examples embedded as now

b) keep a separate, shorter hand-written style source, about 2,500 words, and test it against the core's hard tokens

### OWNER-WORD - "the owner" or "Kris" in the rules

**Context:** The standard uses "the owner", "Kris" and "the supervisor" for the same person, and the output style mostly uses "Kris". One fixed word is part of the terse rewrite. "The owner" travels to other principals' territories and matches the reply forms; "Kris" is shorter and is what the style already says. The states keep "With supervisor" either way, because those are the Work Process note's words.

**Query:** Which word should the rules use for Kris?

**Options:**

a) (recommended, confidence medium - portable and already the standard's majority word, though the style would change its voice) "the owner" in every rule, with Kris's name kept only in the quotes in `sources.md`

b) "Kris" everywhere outside state names

### LINK-STUBS - keep old section links working

**Context:** About 35 harness files link 41 sections of the standard; the plan rewrites those in the same commit. Outside the harness, about 70 files link it, 51 of them in Knowledge Islands Principal, mostly inside work packages. Of their links, 78 are pinned to a revision and keep working; 109 are local and would open the core at its top instead of at the section. The house Markdown rules allow inline HTML, so the core could carry a short "moved sections" table whose rows hold `<a id="…">` anchors, about 400 words, until those links are rewritten.

**Query:** Should the core carry temporary anchor stubs for the moved sections?

**Options:**

a) (recommended, confidence medium - keeps every live link landing on a pointer, at about 400 words of core until removed) add the anchor table to the core outside the style markers, ask `ki.sop.main` by a line to rewrite live links in Knowledge Islands Principal, and remove the table when a scan finds none left

b) add no stubs; rewrite harness links only and let other repositories' unpinned links open the core at its top

### LEGACY-FILE - one home for past shapes

**Context:** The standard holds about 25 clauses saying an older report keeps an older shape and that readers accept both, as well as the thread-to-work mapping table. Only readers of old reports, the rubric's tolerance checks and migrations need them, but every coordinator reads them today. Several cover tolerance windows that may already have closed, such as the theme cutover on 7 November 2026.

**Query:** Should all past-shape rules move into one reader-only file?

**Options:**

a) (recommended, confidence high - no working coordinator needs them, and the rubric keeps its checks by citing the new file) move them into `standards-past-shapes.md` as one table and drop rows whose tolerance window the rubric already fails

b) keep each clause beside the rule it qualifies, shortened to one line

### ROLES-SLOT - when the role catalogue file appears

**Context:** Stage C adds the roles (governor, councillor, guildmaster, warden, steward, housekeeper, gatekeeper, librarian, quartermaster, makers) and the `role` field, which `ki.reg.guilds` already carries as `role: guildmaster`. Under `ki-skills`, every reference file must be linked from `SKILL.md` and say what it holds, so an empty placeholder file would be a stub with no content.

**Query:** Should the roles file be created now as a placeholder or at Stage C?

**Options:**

a) (recommended, confidence medium - avoids an empty reference, but bootstrap meets `role:` before the file exists) reserve the name `standards-roles.md` and its row in the core's load table now, marked "Stage C", and create the file at Stage C

b) create `standards-roles.md` now holding the role names and the `role` field definition only

### DRIFT-FIRST - fix the nine mismatches before the split

**Context:** Mapping found nine places where the rubric, `SKILL.md` or examples disagree with the standard. The worst is COORD-13 describing an interactive pass that takes "one or two blocks at a time", against the one-at-a-time rule. Fixing them inside the split would mix rule changes into a text move, which makes the no-rule-lost proof harder to read.

**Query:** Should the mismatches be fixed in a small delivery before the split begins?

**Options:**

a) (recommended, confidence medium - keeps the split a pure move, at the cost of one extra small delivery) fix all nine first as one small delivery in this package, then start the split

b) fix them during the terse rewrite of each unit

### CORE-BUDGET - how short the core must be

**Context:** The core loads every coordinating turn through the style. The plan sets about 3,500 words; a 3,000-word core would bring the style to about 3,400 words, but would push the listening and message-acting summaries out into their purpose files and add reads at wakes. The budget can be a soft test warning or a hard failure.

**Query:** What word budget should the core keep, and how is it enforced?

**Options:**

a) (recommended, confidence medium - 3,500 keeps the every-wake rules in the core, and a soft check matches how `ki-skills` treats size) 3,500 words, with a test that warns, never fails

b) 3,000 words, with a test that fails above it

### 🤖 → 👤 Handoff to supervisor · at 23:55 GMT

👤 8 with you

- [with you] STAGING · owner · since 23:55
- [with you] STYLE-FROM-CORE · owner · since 23:55
- [with you] OWNER-WORD · owner · since 23:55
- [with you] LINK-STUBS · owner · since 23:55
- [with you] LEGACY-FILE · owner · since 23:55
- [with you] ROLES-SLOT · owner · since 23:55
- [with you] DRIFT-FIRST · owner · since 23:55
- [with you] CORE-BUDGET · owner · since 23:55

🧵 ki.reg.guilds
