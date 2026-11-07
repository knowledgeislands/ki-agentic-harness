# Exchange dynamics standard

How an exchange, a conversation, thread, meeting or negotiation between people, agents or both, becomes one structured, evidence-linked analysis of its chronology, its dynamics, its phases and its participants. The governing principle is Kris's, from his note of 4 November 2026: **analyse once, render many ways**. Interpretation, evidence and presentation stay distinct: this standard holds the method and the analysis contract, [the rendering standard](standards-exchange-dynamics-rendering.md) holds how an analysis is presented, and every rendering reads the analysis and nothing else. The method is independent of the model that runs it and the tool that draws it.

## Contents

1. [Scope](#scope)
2. [Method](#method)
3. [The four layers](#the-four-layers)
4. [Safeguards](#safeguards)
5. [The analysis contract](#the-analysis-contract)
6. [Workflow](#workflow)
7. [Privacy](#privacy)
8. [Boundary](#boundary)

## Scope

The method serves any exchange whose dynamics matter: messaging and chat threads, email threads, meeting transcripts, negotiations and disagreements, community discussions, and exchanges between people and AI agents or among agents. It reads an exchange that already exists, usually a capture made under the `ki-acquire` skill, and never captures one itself.

## Method

1. **Scope the exchange.** Record the source kind, its span, its participants, how complete it is and what is missing. An incomplete transcript or missing context is stated, never smoothed over.
2. **Select events.** Choose the contributions that change the exchange, a new position, a challenge, a concession, a turn, rather than an even sample of messages. The count adapts to the exchange: about five for a simple one, twenty or more for a long negotiation. Each event keeps its exact quotation and a reference to where it is in the source.
3. **Read the dynamics on separate axes.** Score every event for **sentiment**, its emotional tone from -5 to +5, and for **tension**, its confrontation from 0 to 10, independently and each with a one-line basis. Negative emotion does not by itself mean confrontation, and polite language can carry sharp disagreement; the two axes exist to show exactly that. Tag what else the event does, from defensiveness, cooperation, escalation, de-escalation, perspective change and turning point. Scores are interpretative estimates, not psychometric measurements.
4. **Detect phases.** Group consecutive events where the dynamics shift, and label each group from a descriptive vocabulary: opening, challenge, escalation, clarification, mediation, de-escalation, resolution, unresolved disagreement. The labels are descriptions, not a required sequence, and the boundaries come from the material.
5. **Read the participants.** For each participant, describe their dominant tone, their conversational role, their assertiveness or defensiveness, whether their contributions build or confront, and how their approach changes over time, each with the events that show it and an alternative reading where the evidence allows one. Describe behaviour within this exchange only; make no claim about anyone's personality.
6. **Conclude.** Write the key takeaways and an overall read: the character of the exchange, its main sources of tension or misunderstanding, its turning points, how far it resolved, and what stays uncertain.
7. **Validate.** Every conclusion traces to events, every event to its place in the source, every score carries its basis, and alternative readings are kept where the evidence supports them. The contract below is checked mechanically before anything is rendered.

## The four layers

Every event, participant reading and conclusion keeps four layers apart:

| Layer | What it holds |
| --- | --- |
| Observation | What was actually said or done, quoted verbatim |
| Interpretation | What the contribution does in the exchange |
| Inference | A possible explanation of someone's intentions or motives, always marked as inference and never stated as fact |
| Uncertainty | What the evidence cannot establish |

## Safeguards

Kris's ten mandatory principles hold for every analysis:

1. Preserve direct quotations verbatim.
2. Do not attribute unverified motives as facts.
3. Separate subjective experience from observable behaviour.
4. Describe communication styles; do not diagnose personalities.
5. Keep sentiment and tension distinct.
6. Explain the basis of every score.
7. Keep alternative interpretations where the evidence supports them.
8. Do not force a narrative of escalation or of resolution.
9. Name incomplete transcripts and missing context.
10. Make every significant conclusion traceable to its evidence.

**Sensitive contexts.** Where an exchange is legal, about employment, or otherwise sensitive between people, the analysis is marked `sensitive` or `legal` and takes the stronger tier: every event cites the messages it rests on, every participant reading carries an alternative or says why there is none, no inference appears in a rendering meant for anyone outside the exchange, and the analysis is never rendered for sharing without the owner's word.

## The analysis contract

One analysis is one JSON document conforming to [`assets/eda-analysis.schema.json`](../assets/eda-analysis.schema.json), `schema_version` 1. It is written before any rendering and is the only thing a renderer reads. Its parts:

| Part | Holds |
| --- | --- |
| `exchange` | Id, title, source kind, span, language, completeness, missing context, sensitivity and, where the source sits beside it, the source's relative path |
| `participants` | Stable id, display name, initials, avatar reference only where supplied, tone, role, assertiveness, trajectory, the events that show them, alternative readings and confidence |
| `messages` | Optional index of the source: id, speaker, timestamp and text |
| `events` | Sequence id from 1, speaker, timestamp, verbatim quotation, context, interpretation, contribution, sentiment with label, score and basis, tension with score, band and basis, tags, phase, the message ids it rests on, confidence, and an optional marked inference |
| `phases` | Id, label, first and last event, description |
| `takeaways` | Each conclusion with the events that support it |
| `overall` | Character, sources of tension, turning points, degree of resolution, uncertainties and alternative readings |
| `rendering` | Optional requests: the outputs wanted, the layout and whether scores are shown |

The tension band follows the score: green 0 to 2, yellow 3 to 4, amber 5 to 7, red 8 to 10.

[`scripts/validate-analysis.ts`](../scripts/validate-analysis.ts) checks a document against the contract and its cross-references: ids are unique and events run 1, 2, 3 in order; every event's speaker is a participant and its phase exists; phases cover the events in order with no gap or overlap and every event sits in the phase that contains it; bands match scores; every takeaway, participant reading and turning point cites existing events; every event's message ids exist where messages are indexed; and every quotation appears in the source, or in its cited messages, where either is supplied. An analysis that fails is repaired before it is rendered.

## Workflow

1. Ingest the source exchange; record its provenance and its gaps.
2. Identify the participants and the chronology, and give each participant a stable id.
3. Select the significant events.
4. Quote each verbatim and reference its place in the source.
5. Score sentiment and tension separately, each with its basis.
6. Detect the phase transitions.
7. Read each participant's role with evidence and alternatives.
8. Write the key takeaways and the overall read.
9. Validate, and repair until the document passes.
10. Write the analysis beside its source, in the same privacy tier.
11. Render through whatever renderer is available, under the rendering standard, and record the renderer, the variant and the instructions in a `design-decisions.md` beside the rendering.

Steps 1 to 10 make an analysis; step 11 can be repeated for any number of renderings without touching it. A change of reading is a change to the analysis, followed by fresh renderings, never an edit to a rendering alone.

## Privacy

The analysis inherits its source's privacy: it is kept where the source is kept, in the territory's private store when the source is private. A rendering meant for anyone outside the exchange names no real person without their consent; it uses consistent invented names or role labels instead, and an anonymised example is kept apart from its private source material. Worked examples published with this skill are wholly invented. A real exchange's original rendering stays in its private capture and is never copied into a public repository.

## Boundary

Capture, coverage and originals are the `ki-acquire` skill's and its provider skills'. Where a private original is stored is the territory's source store's. Diagrams of systems are the `ki-diagrams` skill's. Drawing is delegated to the renderers named in the rendering standard, which add no analysis of their own. An explorable, interactive view of an analysis is a later capability, recorded in the rendering standard and not part of this method.
