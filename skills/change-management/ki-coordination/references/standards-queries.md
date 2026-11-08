# Coordinating-work standard: queries

This file holds how queries reach the owner: the interactive and goal-setting passes, blind query review, the defaults query and acceptance bundles. It extends [the core](standards-coordination.md).

## Contents

- [Questions](#questions)
- [Interactive pass](#interactive-pass)
- [Goal-setting pass](#goal-setting-pass)
- [Query review](#query-review)
- [Review independence source](#review-independence-source)
- [Defaults query](#defaults-query)
- [Acceptance bundles](#acceptance-bundles)

## Questions

Queries reach the owner in the Summary by default. After a Summary that lists open queries, or on the owner's request, use the [interactive pass](#interactive-pass): one decision per turn, its context in chat Markdown, then a short question card, or plain chat Markdown alone where the runtime has no card.

## Interactive pass

After a Summary that lists open queries, or on the owner's request, the coordinator takes the open queries in an interactive pass; either one alone starts it. The pass after the Summary that closes a pass asks only the queries that pass did not. The pass never batches: one decision at a time, two replies per query, so the owner sends nothing between questions.

1. **First reply.** Start a short background timer, about 5 seconds, such as a background `sleep 5` whose completion wakes the coordinator. End the reply with its last text: the one-line read-back of the previous answer, if any, then the next query's context as ordinary Markdown:

   ```markdown
   <one-line read-back of the previous answer>

   Query <n> of <total>

   ## <TAG>: <plain title>

   **Where things stand**

   - <a short bullet>
   - <a few more, enough to decide without scrolling back>
   ```

2. **Second reply.** Woken by the timer, the reply holds only the card, through the runtime's question tool, such as `AskUserQuestion`:
   - **Title:** one line, the counter and the plain question, as in `Query 2 of 5: Release the held work now?`.
   - **Options:** each a short label, the recommended one first, its label carrying `(recommended, <confidence> confidence)`.
   - **Descriptions:** one or two sentences per option saying what it means; the recommended option's opens with `Why:`.
   - **Own words:** the card's free-text box takes the owner's own words, so no option offers them.
   - **Pairs:** two related questions may share one card, each with a short header; otherwise one question per card.
3. **After the answer.** Log it in `decisions.md`, then go back to step 1, whose read-back opens the next query's first reply.
4. **Why.** Orca folds everything in a reply under "Worked for" except its last text, and does not show text written after a card's answer in the same reply. So the context is the first reply's last text, the card stands alone in its own reply, and the read-back travels with the next context. Orca's card also drops line breaks in its title, as reported to Orca, while chat text renders in full above the card.
5. **At the end of the set.** When the last query is answered and logged, the next reply reads it back, takes a mark and gives the Summary, for a clean baseline and a fresh view.

**Where things stand** is a few short bullets, enough to decide without scrolling back.

**Plain fallback.** Where the runtime has no question card, or no way for a timer to wake the coordinator, ask in plain chat Markdown alone: one reply with the read-back, the context and **The options**, numbered, each with a bold name and what it means, the recommended one first carrying _(recommended, <confidence> confidence)_ and a one-line _Why:_, closing with "Reply with 1, 2 or 3, or your own words.". Then stop and wait. An unattended window asks in plain text, never through a card, because a card blocks the session.

- Never put the next query's card in the same reply as an answer's read-back.
- The total is the number of open queries when the pass starts. When an answer raises a new query, add it to the total and say so.
- Nothing is shortened because it is asked interactively, and each query keeps its [tag](standards-reporting.md#needs-tags).

Sources: SUMMARY-MODEL, QUERY-RULES, INTERACTIVE-QUERIES, QUERY-TURNS, QUERY-SET-MARK, CARD-LOOP and CARD-PATTERN in [the decision register](sources.md#decision-register).

## Goal-setting pass

The owner asks for a goal-setting pass with "goals" or `/ki-coordination goals`. The coordinator walks `_index.md`'s Focus list in order, one area at a time, in the [interactive pass](#interactive-pass)'s two-reply shape: it reads back the area's line, which states its goal, and its place in the order, and asks the owner to confirm, reword, reorder, add or retire it. At the end it writes the steward's own `_index.md` in one commit, logs the owner's words in `decisions.md` and closes with a Status. It strikes no mark and launches nothing.

Sources: GOAL-SETTING in [the decision register](sources.md#decision-register).

## Query review

Before a query reaches the owner, it goes to one blind review run if it is medium- or low-confidence, or high-confidence with a destructive recommended course.

- **Which queries:** each query whose option a) carries `medium` or `low` confidence, and each `high` one whose recommended course destroys, deletes or publishes, including queries drafted and not yet sent.
- **The review:** one blind review run, a background agent on the strongest model at high effort, under Codex rather than Claude Code where independence from the session's own model matters.
  - It is masked: the brief carries the query's Context and Query only, with the options in no ranked order and no recommendation, confidence or reason.
  - The reviewer never reads the work's `discussions.md`, `decisions.md` or any report, where the recommendation is written.
  - It checks what it can directly and returns its own recommended option with a confidence and a one-line reason.
- **Independence:** the brief carries the [review-independence sentence](#review-independence-source) word for word. Its Context states each earlier decision as a dated fact, what was decided, by whom and when, never as a premise the question takes for granted.
- **Agreement:** where the review recommends the same course, the confidence rises one level, `low` to `medium` or `medium` to `high`, and its reason begins `reviewed`, as in `a) (recommended, confidence high - reviewed, the patch is already on main) push it`. A `high` query keeps `high` and is marked `reviewed` the same way.
  - The lift never takes to `high` a destructive course resting on claims not verified directly.
  - Precedent alone earns no lift: agreement resting only on an earlier decision, or only on the coordinator's framing, leaves the confidence where it was, its reason beginning `reviewed, precedent only`.
- **Disagreement:** the confidence stays, its reason begins `review disagrees`, and the query shows both views: **Context** ends with the reviewer's view and reason in one sentence, and the reviewer's course joins the **Options** where it is not already one.
- **Challenge:** where the review questions an earlier decision the query rests on, whether or not it agrees with the recommended course, **Context** ends, after any disagreement, with the challenge in one sentence, naming the decision by its words and date and giving the reviewer's reason. The **Options** gain one to revisit that decision. A challenge is shown even when the confidence is unchanged, and nothing acts on it until the owner answers.
- **Run reports:** the coordinator reviews the queries a run report raises when it receives the report, before they reach the owner. The background agent that raised them does not launch the review itself.
- **Split rule:** a query still below `high` after review is split into separately tagged parts, each one decision the owner can answer with one instruction and each with its own confidence. Packed queries are unpacked before an [unattended window](standards-unattended.md#unattended-windows) starts, so nothing waiting on the owner bundles decisions while they are away.

Sources: QUERY-REVIEW, QUERY-REVIEW-STANDARD, BLIND-REVIEW, REVIEW-INDEPENDENCE, REVIEW-CHALLENGE, ACCEPT-BY-CRITERIA, REVIEW-LIFT and QUERY-RULES in [the decision register](sources.md#decision-register).

## Review independence source

<!-- ki-coordination:source review-independence -->

```markdown
**Independence**, in a review run: form your own view from the evidence before you weigh anything the brief says was decided. Earlier decisions are dated facts, not premises, and you may challenge any of them: where the evidence suggests one was wrong, name it by its words and date and give your reason, as well as answering what was asked. A challenge goes to the owner and is never acted on without them.
```

## Defaults query

Low-stakes choices the coordinator has already made, where the owner's silence is consent, go in one query headed `DEFAULTS - defaults unless you say otherwise`:

- Context: one line per choice.
- Query: `keep these defaults?`
- Options: `a) (recommended, confidence high - each choice is low-stakes and reversible) keep the defaults` and `b) object to the ones you name`.

A choice the owner objects to becomes its own tagged query. A decision that is not low-stakes never goes there. No other query bundles more than one decision: a query the owner cannot answer with one instruction is two queries.

## Acceptance bundles

Records awaiting acceptance reach the owner as one bundle per work, and the State of play brings them first.

- **When:** at bootstrap and resume, the State of play's first call on the owner, before any other query, is the territory's `awaiting-review` records. Project work brings its own at each handoff to the owner.
- **Shape:** one `ACCEPT` query per work, tagged with the work's name, listing each record oldest first, linked under [Linking records](standards-reporting.md#linking-records), with its outcome and any concern in one line. The owner answers `ACCEPT`, or `ACCEPT` with the exceptions named.
- **Grant:** the coordinator quotes the answer in `decisions.md` with its source and lists the exact records it covers. That is the standing human grant the `ki-accept` [closure authority](../../ki-accept/references/standards-acceptance.md#2-obtain-closure-authority) recognises. A named exception stays `awaiting-review` and keeps its own query.
- **Closure:** one `ki-accept` run per repository closes the accepted records from that quotation and prunes them in the next prune-only commit. The coordinator never accepts a record in its own turn.

Sources: ACCEPT-BUNDLE in [the decision register](sources.md#decision-register).
