# D12 learning standard

How D12's rules improve: corrections noticed from Kris's moves, rules he states, and drafts that go live only on his answer. It applies the [D12 standard](standards-dodecakrisis.md), whose rule 7, Determine teaches, it carries out. Kris set it on 6 November 2026 (D12-LEARNS): D12 "learns from how I reorder things, or I can tell you expressly how certain things need to move, so you can put better rules in place."

## Contents

1. [Noticing corrections](#noticing-corrections)
2. [The corrections log](#the-corrections-log)
3. [Drafting rules](#drafting-rules)
4. [Stated rules](#stated-rules)

## Noticing corrections

`ki-muninn d12 learn` reads one mailbox's change history since its last checkpoint, headers and labels only, and records a correction whenever Kris:

- swaps one outcome for another on an item a rule placed (the rule said Digest, Kris made it Decide);
- takes an item out of Delete or out of Trash;
- places an item from Determine by hand, the case rule 7 says should teach a rule; or
- moves an item into or out of a Deposit route's capture folder.

The provenance label `<root>/Rules/<id>` names the rule a correction is against; a hand placement from Determine has no rule. Moves on protected labels are never read as corrections.

## The corrections log

The corrections log is a JSON Lines file in the declaring repository, at the configured `corrections` path: one object per line, appended and never rewritten. Each line carries exactly these fields and no others, so no message body, snippet or address beyond the sender's domain is ever kept:

| Field | Meaning |
| --- | --- |
| `date` | When the move was seen, as an ISO 8601 date |
| `mailbox` | A declared mailbox |
| `kind` | `relabel`, `undelete`, `placed` or `capture` |
| `rule` | The rule id the move corrects, or `null` for a hand placement from Determine |
| `sender_domain` | The sender's domain |
| `subject_pattern` | The subject with names, numbers and dates generalised |
| `from` | The outcome before the move, or `null` |
| `to` | The outcome after the move |

```json
{"date":"2026-11-08","mailbox":"gmail","kind":"relabel","rule":"R07","sender_domain":"substack.com","subject_pattern":"Weekly digest #<n>","from":"Digest","to":"Decide"}
```

## Drafting rules

- **Three agreeing corrections draft a change.** When three corrections agree on a sender domain or subject pattern, the learning run drafts a new rule, an exception to an existing one, or a move from automatic to suggest.
- **A draft goes to Kris as a query** with its dry-run count and confidence, through the coordinating work's queries, and goes into the rules file with `origin = "learnt"` only on his answer, which its `approval` cites (GD12-LEARN a).
- **A rule whose corrections pass 5% of what it placed drops back to suggest** on its own, since that only makes it more careful; the run reports the change.
- **Determine shrinking week on week** is the measure that the rules are learning, and each learning run reports it.

## Stated rules

Kris may state a rule in plain words, such as "mail from the parish goes to Digest". The rule is logged as a `D12-RULE` decision line in his words in the coordinating work's decisions log, given a rule id, dry-run against the live mailbox and its count shown back. His statement is the approval: it goes into the rules file with `origin = "stated"` and that line as its `approval` once the count matches what he expects. A stated rule outranks a learnt one.
