# Coordinating-work standard: opening and naming

This file holds the levels and forms, work naming and the openers. It extends [the core](standards-coordination.md).

## Contents

- [Levels and forms](#levels-and-forms)
- [Work naming](#work-naming)
- [Opening work](#opening-work)

## Levels and forms

The Work Process note's Levels and forms of work table sets the three levels, the two forms and the cascade rule. Under this standard:

| | State of play | Project work | Regular work and ad hoc work |
| --- | --- | --- | --- |
| Id | `<territory>.sop.main`, such as `ki.sop.main`; a secondary `<territory>.sop.<name>`, such as `hnr.sop.5ge` | `<territory>.prj.<project>`, such as `ki.prj.ways-of-working` | `<territory>.reg.main`; ad hoc `<territory>.reg.<slug>` |
| `work.md` | `+/_WORK/<territory>.sop.main/work.md` in the Capital, and `+/_WORK/<territory>.sop.<name>/work.md` for each secondary | `+/_WORK/<territory>.prj.<project>/work.md` in the Capital | `+/_WORK/<territory>.reg.main/work.md`, and one package per ad hoc piece |
| Coordinates | Assigned packages: priorities, the queue and cross-cutting decisions; a secondary, only its `covers` subset; executes nothing | One Project's work items and runs when explicitly opened | Its own work, conversationally or through explicitly opened coordination |
| Governed by | This standard | This standard while coordinating | Activity notes, `ki-work-recurring` and declared skills; this standard while coordinating |
| Report forms | The coordinator forms, the report heading reading `› State of play` | The coordinator forms while coordinating, under the Project's heading | The coordinator forms while coordinating, under the real work label and page; otherwise the conversational reply forms |

`work.md` declares the level in its `level` field under the work-package standard: `territory`, `regular` or `project`, ad hoc work taking `regular`. The level follows from the id:

- one segment: the main State of play;
- second segment `sop`: a State of play, `main` or a named [secondary](standards-territory.md#secondary-states-of-play);
- second segment `reg`: regular or ad hoc work;
- any other second segment: Project work.

The State of play sends direction down into Project work through each receiving package's [`messages.md`](standards-messages.md#messages-between-work). Its first concern with any new matter is where the work goes, not holding it in its own context.

Sources: SOP-ROLE in [the decision register](sources.md#decision-register).

## Work naming

Every piece of work above a work item has an **id**, a **slug** and a **title**; the id is authoritative and the other two derive from it. This section is the one place they are defined; `ki-work-package` and `ki-delegation` point here.

| Work | Id | Slug | Title |
| --- | --- | --- | --- |
| Main State of play | `<territory>.sop.main` | `<territory>-sop-main` | `<Territory> > SoP` |
| Secondary State of play | `<territory>.sop.<name>` | `<territory>-sop-<name>` | `<Territory> > SoP (<name>)` |
| Project work | `<territory>.prj.<project>` | `<territory>-prj-<project>` | `<Territory> > <Theme title> > <Project title>`, or `<Territory> > <Project title>` with no theme |
| Regular work | `<territory>.reg.main` | `<territory>-reg-main` | `<Territory> > Regular work` |
| Ad hoc work | `<territory>.reg.<slug>` | `<territory>-reg-<slug>` | `<Territory> > <topic>` |
| Sub-package | `<parent id>.<parent focus id>` | `<parent slug>-<parent focus id>` | `<parent title> > <focus in words>` |

Canonical stored names are `<territory>.sop.main`, `<territory>.prj.<project>`, `<territory>.reg.main` and `<territory>.reg.<topic>`; secondaries keep `<territory>.sop.<name>`. The Project slug stays `<project>`.

A member-repository Project session is a seat for its Capital package, not authority to move that package. Deliberate member-homed regular exceptions stay valid. A package's existence never selects coordination.

**Id.**

- **Segments:** joined by `.`, each a lower-case kebab name, `[a-z0-9]+(-[a-z0-9]+)*`, so a segment never holds a dot, an underscore, a host or a runtime session identifier.
- **Territory:** the alias of the territory whose Capital holds `work.md`, from the estate's territory list in the principal Knowledge Base: `ki`, `hnr`, `er`, `tmx`, `va`, `lgl`, `personal` or `si`. `personal` is the reserved handle for the owner's own territory under the `ki-repo` [territory selection](../../../keystone/ki-repo/references/standards-configuration.md#territory-selection) standard.
- **Project:** the `slug` of the Project note under the `ki-work` [Project registry standard](../../ki-work/references/standards-project-registry.md), such as `tools-burndown`. No id carries a theme, so relabelling a Project's theme renames nothing.
- **Secondary name:** the third segment of a [secondary State of play](standards-territory.md#secondary-states-of-play), a short kebab name for what it covers, such as `5ge` or `sites`, chosen by the owner. `sop` is reserved as a second segment, so no Project or ad hoc slug is `sop`.
- **Ad hoc slug:** chosen when the work first takes a package, by the owner, or proposed by the agent and confirmed: a short kebab name for the subject, led by the system it works on where the subject alone would be ambiguous, as in `acquire-intake` rather than `intake`. It is never `regular`, never a Project slug of the territory, and never carries a date or host.
- **Sub-package:** a grounded doer's own short-lived package for one focus area of a regular, ad hoc or Project package. Its id is the parent's canonical id with the focus id as a fourth segment, as in `personal.reg.inbox-terra.kiv`, the only four-part id. A sub-package has no sub-package; the folder, slug and title rules apply unchanged. It exists so each package has one worker and one inbox; its parent, writers and fold-back are the work-package standard's [Sub-packages](../../../governance/ki-work-package/references/standards-work-package.md#sub-packages).
- **Unique and stable:** no two pieces of work in a territory share an id or a slug. The id is set once, when the package is created, and changes only through an owner-approved rename when a Project's slug is renamed; every derived name then changes in the same commit.

**Slug.** The id with each `.` written as `-`: one path component in the run-name alphabet `ki agent` accepts, `[A-Za-z0-9_-]`, which has no dot.

- It names the work's state folder, `~/.local/state/ki/agents/<slug>/`, its native-session binding, `~/.local/state/ki/threads/<repository>/<slug>.json`, and its coordinator run. The package folder itself is named by the dotted id.
- Existing runtime folder names and immutable run tokens stay unchanged through a package rename; only mutable current home pointers follow the package. Runs keep their own hyphenated slugs.
- The slug is never parsed back into an id; the id is read from `work.md`.

**Title and label.** The title is the human name, built from display names joined by ` > `. It keeps the theme as display text while the id carries none:

- **Territory:** the territory's name where it is one word, `Personal`, `Legal` or `Techmedix`, otherwise its alias in capitals, `KI`, `HNR`, `ER`, `VA` or `SI`.
- **Theme and Project:** the `title` fields of the theme page and the Project note as they stand, such as `Model` and `Ways of working`. A title follows a registry change at `work.md`'s next update; the id does not.
- **State of play:** `SoP` in the title and `State of play` in full in the report heading. A secondary adds its name in brackets: `HNR > SoP (5ge)` in the title, `State of play (5ge)` in the heading.
- **Topic:** ad hoc work's slug in words, in sentence case, unless the owner names it otherwise.
- **Label:** the title, plus a `(<host>)` suffix, after a space, only when the work is limited to that machine. The id, slug and title never carry a host.
- **Work name:** the label followed by the id in brackets, `<label> (<id>)`, as in `KI > Model > Ways of working (ki.prj.ways-of-working)` and `KI > SoP (ki.sop.main)`.

**Where each name is used.**

- The work name names the work in replies and reports, as the sender of a [line](standards-messages.md#messages-between-work), in a handoff and in the opener's `Label:` line.
- A native session takes its seat's [thread line](../../../governance/ki-work-package/references/standards-roles.md#thread-line) instead: `<role glyph> 🔑 <work-id>`, the glyph of its one role from the [role catalogue](../../../governance/ki-work-package/references/standards-roles.md#role-catalogue), with 🔑 marking the keyholder, the session holding the package's keys; or `🧵 <work-id>` while it has no role. The launch name, the `Rename thread:` line, every report's [thread line](standards-coordination.md#banner) and the sender of every line the seat writes agree. A line's sender is the label with the thread line in brackets, as in `KI > Guilds (⚖️ 🔑 ki.reg.guilds):`. The work id stays last, so the name still names the work.
- The label stays in the opener and the [report heading](standards-coordination.md#banner). The report heading uses the same display names, linked to their notes and joined by ` › `, without the territory.

| Work | Id | Title | Old shape |
| --- | --- | --- | --- |
| Knowledge Islands main State of play | `ki.sop.main` | `KI > SoP` | `_state-of-play.md`, `ki.sop`, `ki` |
| A Humans not Robots secondary State of play | `hnr.sop.5ge` | `HNR > SoP (5ge)` | none |
| Ways of working | `ki.prj.ways-of-working` | `KI > Model > Ways of working` | `knowledge-islands-model.ways-of-working.md`, `ki.ways-of-working` |
| Tools burndown | `ki.prj.tools-burndown` | `KI > Foundations > Tools burndown` | `platform-foundations.tools-burndown.md`, `ki.tools-burndown` |
| Knowledge Islands regular work | `ki.reg.main` | `KI > Regular work` | recurring work in Initiative notes, `ki.regular` |
| Registry removal | `ki.reg.registry-removal` | `KI > Registry removal` | a conversational thread, `ki.regular.registry-removal` |

Sources: NAMING-MODEL, SUB-PACKAGE, TITLE-THEME, LABEL-HOST, WORK-LABEL, STAGE-C-ROLES and RENAME-NAME in [the decision register](sources.md#decision-register).

## Opening work

The owner opens a session in the actual package-home checkout, the Capital by default or the approved regular or ad hoc member home, names it by its [thread line](#work-naming) where the runtime can name a session, and pastes one opener.

- **Runtime binding:** in the runtime-specific Claude Code binding, the opener launches the session as `claude --name "<thread line>"`: `<role glyph> 🔑 <work-id>` from `work.md`'s `role`, or `🧵 <work-id>` with no role yet, the same name as the rename line and every report's thread line.
- **Rename line:** every bootstrap and re-bootstrap report carries one `Rename thread: /rename <thread line>` line, so a session opened another way can take the name. It is one of two named exceptions to the rule that reports carry no paste line; the other is the [restart suggestion](standards-coordination.md#banner).
- **Ownership:** `ki agent prompts`, which prints the launch command, belongs to `tools-ki`. The State of play prepares the package first, so every session opens with one opener and nothing else.
- **Shape:** an opener is a steering-ready brief, not a transcript: it names the work and leaves state to the package. Its role line carries the three rules of [the responsive coordinator](standards-coordination.md#the-responsive-coordinator).

For the main State of play:

```text
Bootstrap as <territory>.sop.main territory work under ki-coordination.
Role: coordinator only. The coordinator never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Territory> > SoP (<territory>). Work package: +/_WORK/<territory>.sop.main/ in <capital>.
Project management only: priorities, the Project-work queue (cap three or four), decisions and releases; route real work to Project work.
Background agents: run substantive work through `ki agent` in run `<territory>-sop-main`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-coordination, then give the full re-bootstrap report.
```

For Project work:

```text
Bootstrap as <territory>.prj.<project> Project work under ki-coordination.
Role: coordinator only. The coordinator never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Territory> > <Theme> > <Project> (<territory>.prj.<project>). Work package: +/_WORK/<territory>.prj.<project>/ in <capital>.
Project: <project>; work only this Project's records.
Background agents: run substantive work through `ki agent` in run `<run>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-coordination, then give the full re-bootstrap report.
```

For a secondary State of play:

```text
Bootstrap as <territory>.sop.<name> territory work under ki-coordination.
Role: coordinator only. The coordinator never does substantive work itself; every unit of work goes to a detached background agent; an owner message never pre-empts work in flight. Dispatch, decide with me, report; stay responsive.
Label: <Territory> > SoP (<name>) (<territory>.sop.<name>). Work package: +/_WORK/<territory>.sop.<name>/ in <capital>.
Secondary State of play under <Territory> > SoP (<territory>): project management only for the work its work.md covers, within its own cap; the main State of play stays the owner's front door and owns cross-cutting decisions, so route those to it.
Background agents: run substantive work through `ki agent` in run `<territory>-sop-<name>`; stay responsive.
Steering: my messages steer; stop or abort only when I expressly say so, naming the work.
First step: follow the Bootstrap in ki-coordination, then give the full re-bootstrap report.
```

For explicitly selected regular or ad hoc coordination, keeping its actual level and home:

```text
Bootstrap as <id> regular work under ki-coordination.
Role: coordinator only, explicitly selected for this package. Delegate substantive units to detached background agents; stay responsive; owner messages steer and never pre-empt work in flight.
Label: <actual work label> (<id>). Work package: +/_WORK/<id>/ in <actual package-home repository>.
Authority: <owner opening instruction or logged decision>. Scope: <approved episode>; end condition: <bounded end condition, or explicitly approved continuity>.
Background agents: run substantive work through `ki agent` in run <run>; stay responsive.
First step: follow Bootstrap in ki-coordination, checking capability or the specific owner-approved exception, then give the full re-bootstrap report.
```

For a session already on this contract, the one-line `Re-bootstrap as <id> under ki-coordination.` under [Bootstrap](standards-bootstrap.md#bootstrap) is enough.

`ki agent prompts [<territory>]` prints these openers, filled from each work's `work.md`, for the main State of play, each secondary and each unfinished eligible package, regular and ad hoc work included; `--short` prints the one-line form. It is how the owner gets an opener; reports and banners still carry none, under the [thread line](standards-coordination.md#banner).

Sources: RENAME-NAME, STAGE-C-ROLES, THREAD-RENAME, RENAME-THREAD-FORM and RESPONSIVE-PRINCIPLE in [the decision register](sources.md#decision-register).
