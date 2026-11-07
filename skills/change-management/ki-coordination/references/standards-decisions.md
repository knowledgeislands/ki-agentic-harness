# Coordinating-work standard: decisions and design notes

This file holds `decisions.md`, decision classes, their life cycle and design notes. It extends [the core](standards-coordination.md).

## Decisions and design

A logged, unrevoked owner decision authorises its stated scope across sessions. Ask again only for a new decision, an explicit later gate or a changed boundary. A relay is not approval, and narrower repository gates still apply.

The coordinator logs every owner decision in the turn it arrives, in the owner's words, in the work's `decisions.md`, under the [rules below](#decisions-log). A record, report or banner describes a decision by its words and date, never by a number.

Sources: DECISION-NO-NUMBER in [the decision register](sources.md#decision-register).

### Decisions log

Each owner decision about the work is one timestamped entry in `+/_WORK/<id>/decisions.md`, in the owner's own words where possible. Where the work declares focus areas, the entry's first line under its heading opens `focus: <id> · `, under the `ki-work-package` [focus areas](../../../governance/ki-work-package/references/standards-work-package.md#focus-areas). Entries carry no numbers, and a prompt, brief, record, report, package file or banner describes the decision it acts under in the owner's words and with its date.

The owner's words are whole only on the turn they arrive: a context-compressing proxy, a compaction or a shell read of a transcript can silently rewrite earlier turns. Two rules keep the log faithful on any machine and proxy setting:

- **Log in the turn it arrives:** write the decision in the same turn as the message carrying it, before doing anything else with the message.
- **Verify later quotations from the file:** check any later quotation of the owner's words, in an entry, brief, record or report, against the session transcript file read with the runtime's file-read tool, which the proxy protects. Never quote from recall or from shell output such as `cat` or `grep`, which it does not protect.

Write the log by hand or through `ki agent decide`, and commit and push it under [Committing the work folder](standards-coordination.md#committing-the-work-folder).

- The log is the work's working record between consolidations, not a Decision Record. Each entry is classed under [decision classes](#decision-classes) and homed under the [life cycle](#decisions-life-cycle), so nothing durable lives only in the package.
- The launcher's part, adopting the log and the close gate's decision check, is the `ki-delegation` [decisions log](../../../governance/ki-delegation/references/standards-background-runs.md#decisions-log)'s.

Sources: DECISION-NO-NUMBER and LOG-NO-LOSS in [the decision register](sources.md#decision-register).

### Decision classes

Every entry is one of four classes, and its class sets its home.

| Class | What it is | Home |
| --- | --- | --- |
| Operational | Approves or steers one piece of work: a push, a tidy, an adoption, a release. Most entries | The record or commit it drove; where there is none, the entry itself until the work finishes |
| Rule | Changes how work is done from now on | The skill standard owning the practice, through a record in the owning repository, or root `AGENTS.md` for a repository-local convention |
| Standalone | Durable rationale or authority a reader needs without the package: a structural or policy choice | A Decision Record, amended in place where one already owns the concern |
| Held | Open, or deferred to a later wave | Its query in `discussions.md`, under its tag, until it resolves into another class |

What is not a decision is not logged: a relay from other work is a receive, an instruction to other work is a send, and an operational event such as a push, a restart or a drain is a move. Those are commits.

**Record threshold.** A record opens only for a product or standard change that needs the owner's acceptance. Operational work runs on `decisions.md`, the brief, the report and Git, and opens no record. `ki-work-roadmap`'s graduation test sets a due record's shape; this threshold says whether one is due.

Sources: DECISION-CLASSES and RECORD-THRESHOLD in [the decision register](sources.md#decision-register).

### Decisions life cycle

At each mark, check each entry against its durable home, under the Work Process note's Decisions life cycle, and:

- **strike it** when a standard, skill, note, record, Decision Record or commit wholly carries it; a struck entry leaves no stub;
- **cut it to a one-line pointer**, the tag, the owner's date and a link, when it still governs live work whose home is elsewhere;
- **keep it** otherwise. A standalone entry with no Decision Record yet is kept, and `state.md`'s next steps carry it as `homeless: <TAG>`, so the Summary shows it, until a Decision Record takes it.

Who homes each class:

- operational: the work it drove, through `ki-accept` or the commit;
- rule: the delivery that changes the standard;
- standalone: the Decision Record's author;
- held: whoever homes the class it resolves into;
- anything left at [Finishing Project work](standards-mark.md#finishing-project-work): the coordinator. A conversational session homes at its recap.

The work's `decisions.md` is its one decisions list for its whole life: successive sessions share it, and it stays in the package, not beside the Project note. A design loop's own decisions file is a stage artefact holding only the answers to its report's tagged decisions, and each answer is also an entry in `decisions.md`, logged in the turn it arrived.

### Design notes

Design notes of every kind, options papers, mocks, loop reports and their stage decisions, live in the package of the work whose concern they design: in the folder of the focus area they serve, `+/_WORK/<id>/<focus-id>/`, or in `+/_WORK/<id>/design/` where the package declares no focus areas, under the `ki-work-design` standard and the `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list). No `design/` folder sits under `Streams/`, which holds only definitions and records. Design work with no coordinating work of its own takes an ad hoc package.

- The `ki-work-design` [artefact home](../../ki-work-design/references/standards-work-design.md#artefact-home) owns a note's life cycle, draft, under review, graduated or deleted, its graduation, and the rule that nothing cites a deleted note.
- The `ki-work-package` [closed list](../../../governance/ki-work-package/references/standards-work-package.md#closed-list) sets which file kinds a focus folder or `design/` may hold.
- This standard reviews the notes at each mark, under [Pruning the work folder](standards-mark.md#pruning-the-work-folder), and resolves them before Project work finishes.

Sources: DESIGN-RETENTION in [the decision register](sources.md#decision-register).
