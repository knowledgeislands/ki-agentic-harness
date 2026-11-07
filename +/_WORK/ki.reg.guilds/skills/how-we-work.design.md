# How we work: design note

Design note for [ki.sop.main](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/work.md), focus `aside`, under the `ki-work-design` method. It folds Kris's design input of 3 November 2026, HOW-WE-WORK (IMPORTANT), STATUS-FORM, STATUS-FORM-2, STATUS-FORM-3, URGENT-HANDOFF, ROUTE-UP and VALUES-UP-FRONT, all relayed by personal.reg.assistant-sol, together with FOOTER-GLYPHS (Kris, 2 November 23:40 GMT, relayed by personal.reg.assistant-terra) and its open FOOTER-SYNC-WORDING query, against the method as it stands at ki-agentic-harness `4721d886`: [standards-coordination.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/change-management/ki-coordination/references/standards-coordination.md) and [standards-work-package.md](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/skills/governance/ki-work-package/references/standards-work-package.md).

Status: draft, brief and merged-model stage. No independent review has run yet; the build plan's first step puts the medium-confidence decisions to blind review before they reach Kris. This note edits no standard.

## Summary

One model ties the seven inputs together. A work package states its **values, goals and focus order up front** in `work.md`; a **Status** form reads them back as a short, goal-led table; the thread's **identity and focus footer** (FOOTER-GLYPHS) names who holds the package and which focus leads; and the **`workers:` register** that gives each thread its role and tier also says who is live, so **urgent work escalates up the `parent` chain to the nearest live leader** rather than waiting in a sleeping queue. Three message words, `URGENT`, `ACK` and `SUPERSEDED`, carry that escalation in `messages.md`, and broadcasts shrink to pointer lines so held packages stop tripping the size warning.

## Units of comprehension

| Unit | Boundary | Hand-offs |
| --- | --- | --- |
| Values and focus in `work.md` | `ki-work-package` work file: a `## Values` line, and each `## Focus` item carrying **Goal**, **Order** and a ⭐ primary marker | Read by Status, by the footer's focus line and by goal-setting |
| Status form | `ki-coordination` report forms: a fourth, light form beside Summary | Reads `work.md` Focus, `state.md` and `discussions.md` tags; never moves the mark |
| Goal-setting mode | `ki-coordination`: an owner-invoked pass over the Focus list | Writes the steward's own `work.md`, logs in `decisions.md` |
| Footer and identity | `ki-coordination` Banner: mode lines, focus line, identity line | Role and ⭐ from the `workers:` register and Focus |
| Worker register and liveness | `ki-work-package` state file: the `workers:` list, today a pilot | Read by escalation and by the footer |
| Urgent escalation | `ki-coordination` Messages between work: a new Urgent work rule | Uses the register, the `parent` chain and the message words |
| Message words and pointer broadcasts | `ki-work-package` Messages lines, rubric LIFECYCLE-3 | Carry escalation; keep held queues small |

## Already decided by Kris

Each is quoted as relayed and dated; the full lines are in [messages.md](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/messages.md) until the coordinator removes them, and in Git history after.

- **Status form exists and is status-led, not decision-led** - STATUS-FORM, 3 November about 07:45 GMT: "add something to the coordination capability that can give us this kind of summary output ... not focused on decisions, but focused on status ... use a summary as the detailed version and a status is this version ... a consistent approach." Summary stays the full decision-led form.
- **Status is short, and shows what is out of scope by worker** - STATUS-FORM-2, about 10:15 GMT: "when we talk about status, it might be just a one line thing. Maybe you've got scope and out of scope. Because out of scope is something that you've given as a focus point over to, maybe, your co-assistant ..."
- **Status leads with goals** - STATUS-FORM-3, about 10:20 GMT: "we often talk about what's getting done, but we're not focused on what the goals are."
- **Status shape** - HOW-WE-WORK (3), about 10:40 GMT, the latest of the set and the one folding the rest: a focus table (Focus with its goal, Where it stands, Waiting on you as tags only), then Out of scope by worker, then what is waiting on Kris in detail under the table, then **What I heard**, a short read-back of Kris's words kept separate from what was decided. Read here as superseding STATUS-FORM-2's "one line" with one short table row per focus.
- **Urgent work goes to a live owner, else up to a live leader** - ROUTE-UP, about 10:10 GMT: "often we need to push the work into a high enough level that it gets filtered down the delegation chain in the right way"; HOW-WE-WORK (1): go straight to the live leader on the escalation path, "Jimmy is not in, so Bobby", without waiting on an ACK; "not everything" is an escalation. This supersedes URGENT-HANDOFF's step (2), wait for an ACK until a deadline, for escalation; the sender does the work itself only where no leader is live (ROUTE-UP).
- **Three message words** - HOW-WE-WORK (2): `URGENT`, `ACK` and `SUPERSEDED` become recognised in the message-line standard; until then the original tag goes first in the text.
- **Values, goals and order up front** - VALUES-UP-FRONT, about 10:30 GMT, and HOW-WE-WORK (4): values, goals and scope stated up front rather than in narrative; each Focus line carries its **Goal** and **Order**; the piloted shape is personal.reg.assistant-sol's [work.md](/Users/krisbrown/kis/personal/inbox/+/_WORK/personal.reg.inbox-sol/work.md). Kris suggested a Knowledge Islands "knowledge process" carry the values.
- **A goal-setting mode** - HOW-WE-WORK (5), named only.
- **Pointer broadcasts considered** - HOW-WE-WORK (6): long Ways of working broadcasts trip LIFECYCLE-3 in every package that holds them (HELD-BROADCASTS); "consider pointer form broadcasts".
- **New footer** - FOOTER-GLYPHS, Kris 2 November 23:40 GMT, "now", keeping 🤖: `🎧 listening` or `🎧 not listening`; on host sync threads `⇄  syncing ...` or `⇏  not syncing ...`; a focus line `🧭 focus: <primary>⭐ · <other>`; and the identity line, role icon, ⭐ where held, role word, 🔑 keyholder or 🔧 doer, package, and for a doer `🧭 <focus>`, replacing `🧵 <work-id>`. Thread names are the identity line without the role word (THREAD-NAME, 23:50 GMT). The four personal pillars already use it.
- **Standing authority** - SOLE-THREAD (3 November 03:14 GMT) and KI-TOOLING-GO (about 03:35 GMT) in [decisions.md](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/decisions.md) let State of play launch the build runs below; the decisions in the next section stay with Kris.

## What the current method says

- **Report forms** - Summary, Recap, Full summary and Hold report; `/ki-coordination <form>` invokes each; the standard says "invocation adds no fourth form". Status needs that sentence changed.
- **Banner on state** - any reply that "answers where work stands" ends with the banner (BANNER-ON-STATE, 19 October). Status therefore already closes with the banner; no new rule is needed.
- **Mode and thread lines** - `👂 listening` / `🔇 not listening`, `🔄 syncing for <host>`, and `🧵 <work-id>` last (FOOTER-CAPABILITY-STATUS-2, 1 November). FOOTER-GLYPHS replaces all three.
- **Focus** - `## Focus` lists ids with a line each; no Goal, Order or primary marker, and no `## Values` heading, which the exact heading sequence would fail today. The work body limit is 300 words, Focus aside.
- **Messages** - one flag, `IMPORTANT`, in the leading slot; one TAG token; about 60 words a line; a sender may replace its own line not yet acted on. Nothing names `URGENT`, `ACK` or `SUPERSEDED`, and there is no notion of a deadline or of liveness.
- **Liveness** - neither standard names the `workers:` register or Agora. The register is a pilot (REG-HOME a, REG-PILOT a) carried in [state.md](/Users/krisbrown/kis/knowledge-islands/ki-principal/+/_WORK/ki.sop.main/state.md) with `role`, `tier`, `status` and `listening`. Each package's `parent` field already gives the escalation path.
- **Authority** - "a line confers no execution authority" (ROUTE-RECEIPT, 19 October). A sender or leader doing another work's urgent unit acts only within its own authority; this design keeps that guard.

## Model

### Values and focus up front

`work.md` gains an optional `## Values` section between Scope and Focus: one line, linking the territory's values and adding any the package holds itself. Each Focus item reads `` `<id>` ⭐ - **Goal:** <one phrase> **Order:** <first, next, finish now, ...> ``, the ⭐ on exactly one item, the primary. Goal and Order are required where a package declares focus; `aside` keeps its own goal. The values line and the Focus goals stay outside the 300-word body limit, as Focus already is. Where the values live is VALUES-HOME.

### Status form

Invoked by "status" or `/ki-coordination status`, in any coordinating package. It opens with the report heading and a form line `**<glyph state> · Status at <time> · last mark <time>**`, then:

1. A table, one row per in-scope focus area in Order, primary first: **Focus** (id, ⭐, and its goal in a phrase), **Where it stands** (two or three plain sentences against the goal: done, running, next), **Waiting on you** (query tags only, or `-`).
2. **Out of scope**: one line per other worker holding a focus or strand this package handed over, `<focus or strand> · <worker name> · since <date>`, read from Scope `Out:` and the `workers:` register.
3. **Waiting on you**: each tag from the table once, at the depth STATUS-DETAIL decides.
4. **What I heard**: a short read-back of Kris's words since the window WHAT-I-HEARD decides, kept apart from decisions, which stay in the log.
5. The banner and its footer, as for any reply answering where work stands.

It has no Done, In Progress or Queries sections, never moves the mark, and never commits beyond what the coordinator would commit anyway.

### Goal-setting mode

Invoked by "goals" or `/ki-coordination goals`. The coordinator walks the Focus list one area at a time, as the interactive pass does, reading back the goal and order and asking Kris to confirm, reword, reorder, add or retire; it writes the steward's own `work.md` once the pass ends, logs Kris's words in `decisions.md` and closes with a Status. Its shape is GOAL-SETTING.

### Worker register and liveness

The piloted `workers:` list becomes a standard, optional `state.md` field: per worker `uri`, `name` (the identity line without the role word), `role`, `tier`, `focus`, `since`, `status` (`active`, `idle` or `gone`) and `listening`. A worker is **live** when its entry says `status: active` and `listening: on` and the package's last commit or Agora presence is recent enough; Agora is a reader of the register, not a second source. LIVENESS decides how recent.

### Urgent escalation

A unit is **urgent** when it carries a deadline or rolls out a process change that other work must follow (URGENT-CRITERIA). The sender:

1. Hands it to the owning work's live worker where one is live: an `URGENT` line in that work's `messages.md`.
2. Otherwise writes the same `URGENT` line, for the record, and at once sends it to the nearest live leader up the owner's `parent` chain (its State of play, then the territory's main State of play), without waiting for an ACK. The leader judges the urgency and delegates, within its authority.
3. Whoever takes it writes `ACK` back to the sender's `messages.md`.
4. Only where no leader on the path is live, and the unit is within the sender's own authority, does the sender do it through a detached run, then replace its own original line with a `SUPERSEDED` line naming what was done and its commits, so the owner can adjust or tidy when it next comes online. Outside the sender's authority it goes to Kris as a blocking query.

Non-urgent work keeps the ordinary route. Agora may broadcast or ping urgency and show acknowledgements; nothing in the rule depends on it.

### Message words and pointer broadcasts

The three words take the leading flag slot that `IMPORTANT` holds today, so the TAG stays one token and the checker parses them the same way (MESSAGE-WORDS):

```markdown
- URGENT · 2026-11-03 · by 2026-11-04 09:00 GMT · <TAG> · <sender label> (<sender id>): <instruction>
- ACK · 2026-11-03 · <TAG> · <sender label> (<sender id>): taken by <worker name>
- SUPERSEDED · 2026-11-03 · <TAG> · <sender label> (<sender id>): done by <run>, <commits>; adjust or tidy
```

`URGENT` sorts above `IMPORTANT` and implies it. A broadcast such as `REFRESH` becomes a pointer line within the 60-word cap: what changed in one clause and a link to the standard section at its pinned harness revision, whose commit message carries the detail (BROADCAST-POINTER). Lines already held are not rewritten; each holder takes them at its next wake.

### Footer

FOOTER-GLYPHS lands as Kris gave it. Its focus line reads the ⭐ primary from Focus, and its identity line reads role and ⭐ from the register, so it builds in the same coordination run as Status. The sync wording waits on FOOTER-SYNC-WORDING. The banner examples in the standard and the output style change together.

## Decisions needed

Confidence is the author's; every medium or low one goes to blind review before it reaches Kris, under the coordination standard's query review.

### VALUES-HOME - Where the shared values live

**Context:** Kris wants each package's values stated up front, and suggested that a Knowledge Islands "knowledge process" carry them. The piloted assistant package writes the five values in full in its own `work.md`. Copying them into every package means every package changes when the values do. Knowledge Islands Principal's [Work Process](/Users/krisbrown/kis/knowledge-islands/ki-principal/Pillars/Philosophy/Model/Processes/Work Process/Work Process.md) note already holds the work model; a change there goes through the Enactment Process.

**Query:** Where should the shared values be written?

**Options:**

a) (recommended, confidence medium - one canonical home avoids drift, but Kris named a "knowledge process" note, which may mean a new note rather than the Work Process) Write them once in the Work Process note under an Enactment record, and give each `work.md` an optional one-line `## Values` section linking them and adding any of its own.

b) Write them once in a new Knowledge Process note in Knowledge Islands Principal, linked the same way.

c) Copy the full values line into every package's `work.md`, as the pilot does.

### STATUS-DETAIL - How much detail Status gives on what waits for Kris

**Context:** STATUS-FORM asked for no full queries in Status; HOW-WE-WORK later asked for "what is waiting on Kris in detail under the table". The Summary already gives each query in full with its options.

**Query:** Under the Status table, how much should each waiting item show?

**Options:**

a) (recommended, confidence medium - keeps Status short and leaves the full form to Summary, but "in detail" may mean more) One line per tag: the plain question and the recommended option, with a pointer to the Summary for the rest.

b) Each query in full, Context, Query and Options, as the Summary gives it.

### WHAT-I-HEARD - Which of Kris's words the read-back covers

**Context:** Status ends with "What I heard", a short read-back of Kris's words kept apart from decisions. Status never moves the mark, so it needs its own window.

**Query:** Which of Kris's words should "What I heard" cover?

**Options:**

a) (recommended, confidence medium - the mark is the window every other form already uses, and a cap keeps it short) Kris's words since the mark, newest first, at most five lines, each quoted or closely paraphrased, with no decision restated.

b) Only Kris's words since the last Status or Summary.

### GOAL-SETTING - What the goal-setting mode does

**Context:** HOW-WE-WORK names "a goal-setting mode" and nothing more. Goals and order now live in each Focus item. The interactive pass already asks one question at a time.

**Query:** What should the goal-setting mode be?

**Options:**

a) (recommended, confidence medium - reuses a shape Kris already uses, though Kris may have meant something broader) An owner-invoked pass, "goals" or `/ki-coordination goals`, walking each focus area one at a time to confirm or reword its goal and order, then writing `work.md`, logging Kris's words and closing with a Status.

b) Leave it out of this build and shape it after Status has been in use for a week.

### URGENT-CRITERIA - What counts as urgent

**Context:** Kris said "not everything" is an escalation. Escalation interrupts a leader and, where none is live, lets a sender do another work's unit, so the test matters.

**Query:** Which units may be sent as `URGENT`?

**Options:**

a) (recommended, confidence medium - both come from Kris's own words, the deadline from URGENT-HANDOFF and the rollout from HOW-WE-WORK) Only a unit with a stated deadline, or a process rollout other work must follow; anything else goes as an ordinary or `IMPORTANT` line.

b) Any unit the sender judges urgent, giving its reason in the line.

### LIVENESS - How a worker is judged live

**Context:** Escalation needs to know who is live. The `workers:` register in `state.md` is a pilot, not in the standard; Agora shows presence but is not yet relied on. A register entry can go stale when a session dies without updating it, as the 3 November usage-limit outage showed.

**Query:** What makes a worker count as live for escalation?

**Options:**

a) (recommended, confidence medium - it reuses fields already piloted and guards against stale entries, but the 30-minute bound is a guess) Its register entry says `status: active` and `listening: on`, and its package or Agora shows activity within the last 30 minutes; the register becomes a standard optional `state.md` field.

b) The register entry alone, trusted as written.

c) Agora presence alone, once Agora is relied on.

### MESSAGE-WORDS - How the three words are written

**Context:** The checker accepts one flag, `IMPORTANT`, in the leading slot and one tag token; a held-territory run found that `SUPERSEDED <tag>` written as a two-word tag is rejected. A sender may already replace its own line not yet acted on.

**Query:** How should `URGENT`, `ACK` and `SUPERSEDED` be written in a message line?

**Options:**

a) (recommended, confidence high - it reuses the existing flag slot and the existing replace-own-line rule, so the checker changes least) As flags in the leading slot, `URGENT` carrying `by <deadline>` and sorting above `IMPORTANT`, `ACK` written into the sender's queue, and `SUPERSEDED` replacing the sender's own original line, each keeping the original tag.

b) As two-word tags, `ACK <tag>` and `SUPERSEDED <tag>`, with the checker widened to accept them.

### BROADCAST-POINTER - Where a broadcast's detail lives

**Context:** Long `REFRESH` broadcasts trip the 60-word message warning (LIFECYCLE-3) in every package that holds them. Today's REFRESH lines already link the standard at a pinned harness revision.

**Query:** Where should a broadcast's detail go so the line itself stays short?

**Options:**

a) (recommended, confidence high - the pinned standard and its commit message already exist, so nothing new needs keeping) A pointer line: what changed in one clause and a link to the standard section at its pinned revision, the harness commit message carrying the detail.

b) A broadcast note in the sender's work folder, linked from each line, kept until every receiver has taken it.

### FOOTER-SYNC-WORDING - Which wording the sync line uses

Carried unchanged from the method-intake report; it already waits with Kris and blocks only the sync line of FOOTER-GLYPHS.

**Context:** FOOTER-GLYPHS (Kris, 2 November 23:40 GMT, "now") writes the host sync line `⇄  syncing for <host>` and `⇏  not syncing for <host>`. household-sol's FOOTER-CONFIRM (3 November) reports that the later NAMES-ROLLOUT message wrote `⇄ syncing <host>`, without "for", and asks which is right.

**Query:** Should the sync line read "syncing for <host>" or "syncing <host>"?

**Options:**

a) (recommended, confidence high - it is Kris's own wording in the request that authorises the change, and keeps today's "syncing for <host>") `⇄  syncing for <host>` and `⇏  not syncing for <host>`.

b) `⇄  syncing <host>` and `⇏  not syncing <host>`.

## Build plan

In order; each step is one bounded detached run under SOLE-THREAD and KI-TOOLING-GO unless it says otherwise.

1. **Blind review** (State of play, no repository change): VALUES-HOME, STATUS-DETAIL, WHAT-I-HEARD, GOAL-SETTING, URGENT-CRITERIA and LIVENESS to one masked review run; then all nine queries to Kris. Waits on nothing. Size S.
2. **ki-work-package, harness** (waits on VALUES-HOME, LIVENESS, MESSAGE-WORDS, BROADCAST-POINTER): `## Values` in the heading sequence; Focus items with **Goal**, **Order** and ⭐; the `workers:` register as an optional state field with liveness; the three message flags and pointer broadcasts; rubric items, LIFECYCLE-3 wording and tests. Size M.
3. **ki-coordination, harness**, chained after step 2 in the same repository (waits on step 2, FOOTER-SYNC-WORDING, STATUS-DETAIL, WHAT-I-HEARD, GOAL-SETTING, URGENT-CRITERIA): FOOTER-GLYPHS in the Banner, its examples and the output style `ki-coordinator.md`; the Status form and `/ki-coordination status`; the goal-setting mode; an Urgent work rule in Messages between work; rubric `threads.ts` and `banner.test.ts`; `ki-delegation` run-prompt footer wording. Size L; split Status and goal-setting into a second run if the first passes M.
4. **Knowledge Islands Principal** (waits on VALUES-HOME and step 3): an Enactment record in `Streams/Roadmap/` for the values and the Work Process note's three glyph uses. Size S.
5. **tools-ki** (waits on step 3): START-NAME, the identity line as the run thread name; check whether any tools-ki message parser needs the new flags. Size S.
6. **Pilot** (waits on steps 2 and 3): ki.sop.main adopts Values, Focus goals, Status and the footer at its next state update; then a pointer-form `REFRESH` line to every live package, and replies to personal.reg.inbox-sol, personal.reg.inbox-terra and personal.reg.household-sol closing STATUS-FORM 1 to 3, URGENT-HANDOFF, ROUTE-UP, VALUES-UP-FRONT, HOW-WE-WORK, FOOTER-GLYPHS and FOOTER-CONFIRM. Size S.

This note graduates when steps 2 to 4 land and their decisions have durable homes; it is then deleted in the change that homes the last of them.
