# D12 standard

How D12, the Dodecakrisis, runs: the ten rules, the rules file and its guards, the configuration a declaring repository supplies, and the approval every write needs. The concept, the twelve Ds, their names and why, is the Knowledge Islands D12 card's; this standard holds the rules and how they run, under D12-CANON a) (Kris, 7 November 2026). The [mailbox standard](standards-mailbox.md) binds D12 to a mailbox and the [learning standard](standards-learning.md) improves its rules.

## Contents

1. [The ten rules](#the-ten-rules)
2. [Configuration](#configuration)
3. [The rules file](#the-rules-file)
4. [Writes and approvals](#writes-and-approvals)
5. [Boundary](#boundary)

## The ten rules

D12 is a sorter. Everything delivered drops into Do; the sorting rules place it in a queue by what it looks like; each queue is worked to a conclusion; a concluded item goes back through the rules, until the rules send it out to Deposit or Delete.

1. **The sorting rules are Do's top.** They place each delivery in a queue, or send it straight to Deposit or Delete. Sorting by hand is the same step done by a person.
2. **The cycle.** Concluded items come off the bottom of the queues and go back through the sorting rules, which place them again or send them out. The loop is the same whether a step was automatic or by hand.
3. **Only the rules send items out.** Deposit and Delete are reached from the sorting rules, never directly from a queue.
4. **Two exits.** Everything ends in Deposit or Delete; nothing stays in Do for good.
5. **Delete carries a reason, not a sub-state.** Junk is a reason, not a special case, and "junk" is the reason that teaches the rules. The rule that sent an item to Delete is its reason.
6. **Everything has a timeline.** Defer carries a wake-up date. Deposit carries a retention period, and when it ends the item is pruned to Delete. Evidential material is kept word for word for as long as its owner requires; the rest keeps only its gist for a period. A Deposit may carry a reminder without keeping the item in a queue.
7. **Determine teaches.** Every item placed by hand from Determine is a candidate for a new sorting rule, so Determine shrinks over time. Determine shrinking is the measure that the rules are learning.
8. **The Docket keeps actions.** A queue's conclusion may make an action that outlives its item, while the item itself goes back through the rules.
9. **Deposit is a handoff.** What happens to a deposit next, its capture, curation and dispatch, belongs to the knowledge capture funnel, which starts at Deposit and which `ki-acquire` governs.
10. **The sorter comes before the funnel.** Not everything enters the funnel: the sorter is where things are held back or dropped.

The outcomes a rule can name are the seven queues and the two exits, each with its D number:

| # | Outcome | Kind | Meaning |
| --- | --- | --- | --- |
| 3 | Determine | queue | The rules cannot place it, so a person does |
| 4 | Decide | queue | Kris acts |
| 5 | Discuss | queue | Talk it through at the next contact |
| 6 | Delegate | queue | Someone else acts |
| 7 | Defer | queue | Back into the rules on a date |
| 8 | Dormant | queue | Someday, with no date |
| 9 | Digest | queue | Read over time, then let go |
| 10 | Deposit | exit | Kept, with a retention period, through a Deposit route |
| 11 | Delete | exit | Let go, with the rule as its reason |

## Configuration

The declaring repository's `.ki.toml` holds one `[skills.ki-dodecakrisis]` table with three properties and no others:

| Property | Shape | Meaning |
| --- | --- | --- |
| `mailboxes` | Table of named mailboxes | Each entry has `provider` (`gmail` or `m365`), `server` (the mail server's name in the MCP inventory, such as `kb-mcp-gsuite`) and `root` (the label or folder root, normally `D12`) |
| `rules` | Repository-relative path | The rules file |
| `corrections` | Repository-relative path | The corrections log |

```toml
[skills.ki-dodecakrisis]
rules = "d12/rules.toml"
corrections = "d12/corrections.jsonl"

[skills.ki-dodecakrisis.mailboxes]
gmail = { provider = "gmail", server = "kb-mcp-gsuite", root = "D12" }
```

An empty table declares the skill with no mailbox, and then nothing else is required. Once a mailbox is declared, `rules` and `corrections` are required and both files exist. The protected-label list is never configured here: it belongs to the mail server's per-account configuration, as the [mailbox standard](standards-mailbox.md#protected-labels) sets out.

## The rules file

The rules file is TOML in the declaring repository, holding three arrays of tables: guards, Deposit routes and rules. Every identifier is unique within its array.

**Guards.** A guard is a query fragment that a rule's query excludes. Each declared mailbox has exactly one evidential guard, `evidential = true`: the senders, threads and subjects that may be evidence, so no Delete or Digest rule can ever match them.

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Such as `G` |
| `mailbox` | yes | A declared mailbox |
| `query` | yes | The fragment the rule excludes, in the provider's search syntax |
| `evidential` | no | `true` for the mailbox's evidential guard |

**Deposit routes.** A Deposit route says where a deposited item is captured, in what form, to where and for whom. An item leaves the mailbox only once its route's owner has verified the stored copy.

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Such as `inbox-capture` |
| `mailbox` | yes | A declared mailbox |
| `folder` | yes | The capture label or folder that the importer reads |
| `form` | yes | `capture` for a faithful Markdown capture, or `eml.txt` for the raw message, unchanged |
| `destination` | yes | Where the importer writes it |
| `owner` | yes | Who verifies the stored copy, such as `inbox` or `legal` |

**Rules.** A rule places what its query matches.

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Such as `R07`; the provenance label `<root>/Rules/<id>` follows it |
| `mailbox` | yes | A declared mailbox |
| `query` | yes | The match, in the provider's search syntax, from headers only |
| `outcome` | yes | One of the nine outcomes above |
| `mode` | yes | `automatic` takes the item out of the inbox; `suggest` labels it and leaves it for Kris to confirm or move |
| `confidence` | yes | `high`, `medium` or `low` |
| `origin` | yes | `stated` (Kris said it), `learnt` (drafted from corrections) or `decision` (from a decision in a work package) |
| `approval` | yes | The decision or answer that put it live, such as a `D12-RULE` line or a query tag |
| `guards` | for Delete and Digest | The guard ids the query excludes; must include the mailbox's evidential guard |
| `route` | for Deposit | A declared Deposit route |
| `filter` | no | The name of the platform filter or rule that helps it, which begins with `D12` |

```toml
[[guard]]
id = "G"
mailbox = "gmail"
evidential = true
query = "-from:(solicitor.example) -label:_INBOUND-Legal"

[[route]]
id = "inbox-capture"
mailbox = "gmail"
folder = "Inbox Capture"
form = "capture"
destination = "knowledge/captured"
owner = "inbox"

[[rule]]
id = "R07"
mailbox = "gmail"
query = "from:(substack.com OR medium.com)"
outcome = "Digest"
mode = "automatic"
confidence = "high"
origin = "decision"
approval = "GD12-AUTO a"
guards = ["G"]
filter = "D12 R07 newsletters to Digest"
```

Rules:

- **Only rules send items out.** Deposit and Delete come only from a rule in this file or a sweep the [mailbox standard](standards-mailbox.md#sweeps) sets; a person working a queue concludes the item and it goes back through the rules.
- **Delete only labels.** A Delete rule adds the Delete outcome; the Delete sweep moves it to Trash after its grace period. No rule trashes at once.
- **Every Delete or Digest rule carries the evidential guard.** Gmail runs every matching filter and Outlook stops at the first, so order never protects anything; the guard does.
- **A stated rule outranks a learnt one.** Where two rules match, `stated` wins over `learnt`, and both are reported.
- **Every rule is dry-run with a count before it goes live.** The count is shown with the approval, and the rule goes in once it matches what was expected.

## Writes and approvals

Every mode reads first. A write is anything that changes a mailbox (a label, folder, category, filter, rule or message) or the rules file or corrections log. A write happens only when all of these hold:

- **It cites its approval.** The approval is Kris's answer or a logged decision that names the run, the rule, the sweep or its schedule. Silence and a recommended option are never approval. Scheduling a sweep or the learning loop is its own approval each time.
- **It was dry-run first.** The dry run reports the count for each rule, sweep or label, and a run whose live count differs from the approved one stops.
- **It is D12's own.** D12 manages only what carries its prefix: labels or folders under the root, and filters or rules whose name begins with `D12`. It adds or deletes those as needed and never changes an unprefixed filter, rule or label, which belong to whoever made them. Platform filters and rules are optional helpers: D12 runs without them.
- **It touches nothing protected.** The run reads the protected list from the server before it starts, never targets a protected label, folder or category, and stops at the first refusal, reporting it. A refusal is never worked around.
- **It reads headers only.** Rules, sweeps and corrections use senders, subjects, dates, labels and thread membership. No message body is read.

## Boundary

- The D12 card owns the concept: the twelve Ds, their names and why.
- `mcp-gsuite` and `mcp-m365` own the protected list and its enforcement, and the tools D12 calls.
- The Inbox's `ki-muninn` owns execution: `ki-muninn d12 sweep`, `ki-muninn d12 learn` and the mail import that reads each Deposit route.
- `ki-acquire` owns capture, curation and dispatch after Deposit; the evidential owner, such as Legal, owns naming, filing and verifying evidential copies.
- Scheduling belongs to the scheduler and is approved separately each time.
