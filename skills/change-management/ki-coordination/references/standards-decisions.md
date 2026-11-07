# Coordinating-work standard: decisions and design notes

This file holds the decisions log, decision classes, their life cycle and design notes. It extends [the core](standards-coordination.md).

## Decisions and design

 A logged, unrevoked owner decision authorises its stated scope across sessions; ask again only for a new decision, an explicit later gate or a changed boundary. A relay is not approval, and narrower repository gates still apply.

A coordinator turns the owner's words into durable knowledge. Every owner decision is logged in the turn it arrives, in the owner's words, in the work's `decisions.md`, under the [decisions log](#decisions-log) rules; this section says how an entry is written, what becomes of it, where design notes live and what finishes Project work. A record, report or banner describes a decision by its words and date and never by its number.

Sources: DECISION-NO-NUMBER in [the decision register](sources.md#decision-register).

### Decisions log

Each owner decision about the work becomes one timestamped entry in the work folder's decisions log, `+/_WORK/<id>/decisions.md`, quoted in the owner's own words where possible. Where the work declares focus areas, the entry's first line under its heading opens with the area it belongs to, `focus: <id> · `, under the `ki-work-package` [focus areas](../../../governance/ki-work-package/references/standards-work-package.md#focus-areas). Entries carry no numbers, and a prompt, brief, record, report, work file or banner describes the decision it acts under in the owner's words and with its date.

The owner's words are whole only on the turn they arrive: a context-compressing proxy, a compaction or a shell read of a transcript can rewrite every earlier turn without saying so. Two rules keep the log faithful, on any machine and whatever the proxy setting:

- **Log in the turn it arrives:** the coordinator writes an owner decision into the log in the same turn as the message that carries it, while that turn is still uncompressed, before it does anything else with the message.
- **Verify later quotations from the file:** any later quotation of the owner's words, in a log entry, a brief, a record or a report, is checked against the session transcript file read with the runtime's file-read tool, which the proxy protects, never from in-context recall or from shell output such as `cat` or `grep`, which it does not.

The coordinator writes the log by hand or through `ki agent decide`, and commits and pushes it under [Committing the work folder](standards-coordination.md#committing-the-work-folder). The log is the work's working record between consolidations, not a replacement for them, and it is not a Decision Record: each entry is classified under [decision classes](#decision-classes) and homed under the [decisions life cycle](#decisions-life-cycle), so that nothing durable exists only in the work folder. The launcher's part, adopting the log and the close gate's decision check, is the `ki-delegation` [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log)'s.

Sources: DECISION-NO-NUMBER and LOG-NO-LOSS in [the decision register](sources.md#decision-register).

### Decision classes

Every log entry is one of four things, and its class says where it goes.

| Class | What it is | Home |
| --- | --- | --- |
| Operational | Approves or steers one piece of work: a push, a tidy, an adoption, a release. Most entries | The work record or commit it drove; where there is none, the log entry is its own home until the work finishes |
| Rule | Changes how work is done from now on | The skill standard that owns the practice, through a record in the owning repository, or root `AGENTS.md` for a repository-local convention |
| Standalone | Durable rationale or authority a reader will need without the work folder: a structural or policy choice | A Decision Record, amended in place where one already owns the concern |
| Held | Open, or deferred to a later wave | Its query in `discussions.md`, under its Needs tag, until it resolves into one of the other three |

What is not a decision is not logged, under the note's Decisions life cycle: a relay from other work is a receive, an instruction to other work is a send, and an operational event such as a push, a restart or a drain is a move. Those are commits.

A roadmap record opens only for a product or standard change that needs Kris's acceptance. Operational work runs on the decisions log, the brief, the report and Git, and opens no record. `ki-work-roadmap`'s graduation test governs the shape of a record once one is due; this threshold says whether one is due at all.

Sources: DECISION-CLASSES and RECORD-THRESHOLD in [the decision register](sources.md#decision-register).

### Decisions life cycle

At each mark the coordinator checks each entry against its durable home and then, under the note's Decisions life cycle: strikes it, when a standard, skill, note, record, Decision Record or commit wholly carries it; reduces it to a one-line pointer, the tag, Kris's date and a link, when it still governs live work whose home is elsewhere; or keeps it. A struck entry leaves no stub, and entries carry no running numbers. A standalone entry with no Decision Record yet is kept, and the state file's next steps carry it as `homeless: <TAG>` so the Summary shows it, until a Decision Record takes it. Who homes: an operational entry is homed by the work it drove, through `ki-accept` or the commit; a rule by the delivery that changes the standard; a standalone entry by the Decision Record's author; a held entry by whichever class it resolves into; and at [Finishing Project work](standards-mark.md#finishing-project-work) the coordinator homes whatever is left. A conversational session homes at its recap.

The work's `decisions.md` is its one decisions list for its whole life: successive sessions on the same work share it, and it stays in the work folder, not beside the Project note. A design loop's own decisions file is a stage artefact that holds only the answers to its report's tagged decisions, and every one of those answers is also a decisions-log entry, logged in the turn it arrived.

### Design notes

Design notes of every kind - options papers, mocks, loop reports and their stage decisions - live in the work folder of the work whose concern they design, in the folder of the focus area they serve, `+/_WORK/<id>/<focus-id>/`, or in `+/_WORK/<id>/design/` in a package that declares no focus areas, under the `ki-work-design` standard and the `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list). No `design/` folder sits anywhere under `Streams/`, which holds only definitions and records. Design work with no coordinating work of its own takes an ad hoc work folder.

A design note's life cycle - draft, under review, graduated or deleted - and the rule that nothing cites a deleted note are the `ki-work-design` [artefact home](../../ki-work-design/references/standards-work-design.md#artefact-home)'s, which owns graduation; the `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list) sets which file kinds a focus folder or `design/` may hold. This standard reviews the design notes at each mark, under [Pruning the work folder](standards-mark.md#pruning-the-work-folder), and resolves it before Project work finishes.

Sources: DESIGN-RETENTION in [the decision register](sources.md#decision-register).
