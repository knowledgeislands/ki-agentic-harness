# Coordinating-work standard: queries

This file holds how queries reach the owner: the interactive and goal-setting passes, blind query review, the defaults query and acceptance bundles. It extends [the core](standards-coordination.md).

## Questions

- **Questions:** queries reach the owner in the Summary by default; on request use the [interactive pass](#interactive-pass), one decision per turn, its context in chat Markdown and then a short question card, with plain chat Markdown alone where the runtime has no card.

## Interactive pass

Queries reach the owner in full in the Summary, and after a Summary that lists open queries the coordinator also takes them in an **interactive pass**, as it does on the owner's request, because, as Kris added to SUMMARY-MODEL on 4 November 2026, "I'm probably not going to be able to go back and read everything"; the pass after the Summary that closes a pass asks only queries that pass did not. The pass never batches: it asks exactly one decision at a time, and each query takes two replies, so that the owner sends nothing between questions.

1. **First reply.** The coordinator starts a short background timer, about 5 seconds, such as a background `sleep 5` whose completion wakes it. Then it ends the reply with its last text: the one-line read-back of the previous answer, if there is one, followed by the next query's context as ordinary Markdown:

   ```markdown
   <one-line read-back of the previous answer>

   Query <n> of <total>

   ## <TAG>: <plain title>

   **Where things stand**

   - <a short bullet>
   - <a few more, enough to decide without scrolling back>
   ```

2. **Second reply.** Woken by the timer, the coordinator's reply holds only the card, through the runtime's question tool, such as `AskUserQuestion`:
   - **Title:** one line, the counter and the plain question, as in `Query 2 of 5: Release the held work now?`.
   - **Options:** each a short label, the recommended one first, its label carrying `(recommended, <confidence> confidence)`.
   - **Descriptions:** one or two sentences under each option saying what it means, the recommended option's opening with its `Why:`.
   - **Own words:** the card's free-text box serves for the owner's own words, so no option offers them.
   - **Pairs:** two related questions may share one card, each with a short header; otherwise one question per card.
3. **After the answer.** The coordinator logs it in the decisions log, then goes back to step 1, whose read-back opens the next query's first reply.
4. **Why.** Orca folds everything in a reply under "Worked for" except its last text, and it does not show text written after a card's answer within the same reply. So the context must be the first reply's last text, the card must stand alone in its own reply, and the read-back travels with the next context rather than after the answer. Orca's card also drops line breaks in its title, which was reported to Orca, while chat text renders in full and shows above the card.
5. **At the end of the set.** When the last query of the set is answered and logged, the coordinator's next reply reads it back, takes a mark and then gives the Summary, so that the owner has a clean baseline and a fresh view of where things stand.

**Where things stand** is a few short bullets, enough for the owner to decide without scrolling back. Where the runtime has no question card, or no way for a timer to wake the coordinator, the coordinator asks in plain chat Markdown alone: one reply carries the read-back, the context and **The options**, numbered, each with a bold name and what it means, the recommended one first carrying _(recommended, <confidence> confidence)_ and a one-line _Why:_, closing with "Reply with 1, 2 or 3, or your own words.", and then stops and waits. An unattended window keeps its own rule and asks in plain text, never through a card, because a card blocks the session.

The coordinator never asks the next query's card in the same reply as an answer's read-back. The total is the number of open queries when the pass starts; when an answer raises a new query, the coordinator adds it to the total and says so. Nothing is shortened because it is asked interactively, and the query keeps its [Needs tag](standards-reporting.md#needs-tags) either way. Kris chose QUERY-RULES a), "Adopt both", on 25 October 2026, which also set the split rule under [Query review](#query-review); Kris set the one-decision rule as INTERACTIVE-QUERIES on 31 October 2026, after a question tool showed a bare question with no context during Acquire intake that day, and refined it the same day as QUERY-TURNS: "Put each query in the chat as normal Markdown, starting with a counter line ... The total is the number of open queries when we start; if an answer raises a new one, add it to the total and say so." Kris added the closing mark the same day as QUERY-SET-MARK. The same day, after a run of test cards under CARD-LOOP, Kris set the card shape as CARD-PATTERN: "maybe you could give the context just before you ask the question, and then after you've received the response of it, you don't ask the same question immediately after it in the same contextual block. So I can then see the new context. So you kind of reflect back what the answer was." A further test loop settled the two-reply timer pattern that afternoon, Kris saying: "Yes, use this pattern".

## Goal-setting pass

The owner asks for a goal-setting pass with "goals" or `/ki-coordination goals`, as Kris chose GOAL-SETTING a) on 7 November 2026: "An owner-invoked pass, "goals" or `/ki-coordination goals`, walking each focus area one at a time to confirm or reword its goal and order, then writing `work.md`, logging Kris's words and closing with a Status." The coordinator walks `work.md`'s Focus list in order, one area at a time, in the [interactive pass](#interactive-pass)'s two-reply shape: it reads back the area's line, which says its goal, and its place in the order, and asks the owner to confirm, reword, reorder, add or retire it. When the pass ends it writes the steward's own `work.md` in one commit, logs the owner's words in `decisions.md` and closes with a Status. It strikes no mark and launches nothing.

## Query review

Before a query reaches the owner, every medium- or low-confidence query, and any high-confidence query whose recommended course is destructive, goes to one blind review run. Kris agreed the trial on 2026-10-19 at 08:22 BST under QUERY-REVIEW, "QUERY-REVIEW - agreed, make it so", taken as: "every medium- or low-confidence query (and any high-confidence destructive one) goes to one blind review run on the strongest model at high effort (Codex where independence matters) before it reaches Kris; agreement lifts confidence one level, marked reviewed; disagreement shows both". The same evening, under QUERY-REVIEW-STANDARD, Kris made it a rule of this standard for every coordinator, ahead of the trial evidence: "agreed, please go ahead". Codex in those words is the reviewing runtime, set against the Claude Code most coordinators run in. So:

- **Which queries:** each query whose option a) carries `medium` or `low` confidence, and each `high` one whose recommended course destroys, deletes or publishes. Queries already drafted and not yet sent are included.
- **The review:** one blind review run, a background agent on the strongest model at high effort, run under Codex rather than Claude Code where independence from the session's own model matters. The review is masked, as Kris agreed under BLIND-REVIEW on 2026-10-20, "BLIND-REVIEW - agreed as recommended": the reviewer's brief carries the query's Context and Query only, with the options in no ranked order and no recommendation, confidence or reason, and the reviewer never reads the work's `discussions.md` or `decisions.md` or any report, where the recommendation is written. It checks what it can directly and returns its own recommended option with a confidence and a one-line reason.
- **Independence:** the brief carries the review-independence sentence of [Generated surfaces](standards-coordination.md#generated-surfaces) word for word, and its Context states each earlier decision as a dated fact, what was decided, by whom and when, never as a premise the question takes for granted. Kris asked on 30 October 2026, under REVIEW-INDEPENDENCE, that blind reviews "must not really be concerned with previous decisions too much, and they must be able to challenge those, so we can make sure that we haven't gone down a particular avenue incorrectly", and took REVIEW-CHALLENGE a) under ACCEPT-BY-CRITERIA on 31 October 2026.
- **Agreement:** where the review recommends the same course, the confidence rises one level, `low` to `medium` or `medium` to `high`, and its reason begins `reviewed`, as in `a) (recommended, confidence high - reviewed, the patch is already on main) push it`. A `high` query keeps `high` and is marked `reviewed` the same way. The lift never takes to `high` a destructive course resting on claims not verified directly, which the confidence rule above forbids. Precedent alone earns no lift: a review whose agreement rests only on an earlier decision, or only on the coordinator's framing of the question, leaves the confidence where it was, and its reason begins `reviewed, precedent only`, as Kris took REVIEW-LIFT a) under ACCEPT-BY-CRITERIA on 31 October 2026.
- **Disagreement:** the confidence stays where it was, its reason begins `review disagrees`, and the query shows both views: **Context** ends with the reviewer's view and reason in one sentence, and the reviewer's course, where it is not already an option, joins the **Options**.
- **Challenge:** where the review questions an earlier decision the query rests on, whether or not it agrees with the recommended course, **Context** ends, after any disagreement, with the challenge in one sentence, naming the decision by its words and date and giving the reviewer's reason, and the **Options** gain one to revisit that decision. A challenge is shown even when the confidence is unchanged, and nothing acts on it until Kris answers.
- **Run reports:** the coordinator reviews the queries a run report raises when it receives the report, before they reach the owner. The background agent that raised them does not launch the review itself.
- **Split rule:** a query still below `high` confidence after its review is split into separately tagged parts, each one decision the owner can answer with one instruction, and each part takes its own confidence. Packed queries are unpacked before an [unattended window](standards-unattended.md#unattended-windows) starts, so nothing waiting on the owner bundles decisions while they are away. Kris set the rule under QUERY-RULES a) on 25 October 2026.

## Review independence source

<!-- ki-coordination:source review-independence -->

```markdown
**Independence**, in a review run: form your own view from the evidence before you weigh anything the brief says was decided. Earlier decisions are dated facts, not premises, and you may challenge any of them: where the evidence suggests one was wrong, name it by its words and date and give your reason, as well as answering what was asked. A challenge goes to the owner and is never acted on without them.
```

## Defaults query

Low-stakes choices the coordinator has already made, where the owner's silence is consent, go in one query headed `DEFAULTS - defaults unless you say otherwise`: the Context one line per choice, the Query `keep these defaults?`, and the Options `a) (recommended, confidence high - each choice is low-stakes and reversible) keep the defaults` and `b) object to the ones you name`. A choice the owner objects to becomes its own tagged query. A decision that is not low-stakes never goes there, and no other query bundles more than one decision: a query the owner cannot answer with one instruction is two queries.

## Acceptance bundles

Records awaiting acceptance reach the owner as one bundle per work, and territory work brings them first. Kris adopted ACCEPT-BUNDLE on 2026-10-20: "from Knowledge Islands perspective, I think we need to accept them ... happier for us to go through that ... definitely something that should happen as the first point of call in the state of play".

- **When:** at bootstrap and at resume, territory work's first call on the owner, before any other query, is the territory's `awaiting-review` records; Project work brings its own at each handoff to the owner.
- **Shape:** one `ACCEPT` query per work, tagged with the work's name, listing each record oldest first, linked under [Linking records](standards-reporting.md#linking-records), with its outcome and any concern in one line. The owner answers in one word, `ACCEPT`, or `ACCEPT` with the exceptions named.
- **Grant:** the coordinator quotes the answer in the decisions log with its source and lists the exact records it covers, which is the standing human grant the `ki-accept` [closure authority](../../ki-accept/references/standards-acceptance.md#2-obtain-closure-authority) recognises. A named exception stays `awaiting-review` and keeps its own query.
- **Closure:** one `ki-accept` run per repository closes the accepted records from that quotation and prunes them in the next prune-only commit; the coordinator never accepts a record in its own turn.
