import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CoordinationRubricContext } from '../contexts/coordination.ts'

const SOURCE = 'standards-coordination.md'

const COORD_1: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-1',
  title: 'territory work belongs to the Capital',
  description:
    'A territory Capital, a repository whose declared `capital` is itself, holds its territory work, `+/_WORK/<territory>/work.md` with an id of one segment, titled `<Territory> > SoP`, and no other repository holds territory work. For the tolerance window a Capital whose territory work is still the state-of-play checkpoint `+/_CHECKPOINTS/_state-of-play.md` passes with a warning naming its new home.',
  sources: [`${SOURCE}#territory-work`, `${SOURCE}#the-work-model`],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        "Create the territory work package in the Capital under the `ki-work-package` work-package standard, or move the state-of-play checkpoint there at the territory's migration, and remove territory work from any repository that is not its own capital."
    },
    audit: { phase: 'INSPECT', run: ({ master }) => master.outcomes }
  }
}

const COORD_2: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-2',
  title: 'Project work resolves in the registry',
  description:
    "Each Project work file `+/_WORK/<territory>.<project>/work.md` names its `project`, its title ends in that Project's title, as in `KI > Model > Ways of working`, and on a Capital its Project resolves in `Streams/Projects/` and any `theme` in `Streams/Themes/`. For the tolerance window an `<initiative>.<project>.md` checkpoint is checked as before, its label ending in its Project in words and its Initiative resolving in `Streams/Initiatives/`, with a warning naming its new home.",
  sources: [`${SOURCE}#work-naming`, `${SOURCE}#coordinating-work`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Correct the work file's `project`, `theme` or title at its next update, or register the Project or theme under the `ki-work` registry standard."
    },
    audit: { phase: 'INSPECT', run: ({ labels }) => labels.outcomes }
  }
}

const COORD_10: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-10',
  title: 'work files declare a level that agrees with their id',
  description:
    'Each work file declares its `level`, which agrees with its id: one segment is `territory`, a second segment `regular` is `regular`, and any other second segment is `project`. For the tolerance window the `_state-of-play.md` checkpoint carries `role: state-of-play` and each `<initiative>.<project>.md` checkpoint `role: coordination`, or `role: conversational`, and no other checkpoint declares `state-of-play`.',
  sources: [`${SOURCE}#levels-and-forms`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Have the work correct its `level`, or an old-shape checkpoint its `role`, at its next update, or ask by a line in its `messages.md`; never edit another piece of work's front matter to change it."
    },
    audit: { phase: 'INSPECT', run: ({ roles }) => roles.outcomes }
  }
}

const COORD_3: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-3',
  title: 'active Project work is within the cap',
  description:
    'At most three or four pieces of Project work are active at once, neither On hold nor Finished, reading the state from `state.md` where the work package has one, counting old-shape coordination checkpoints whose state is active; territory work, regular work and work awaiting review in `+/_WORK_REVIEW/` are not counted, and a non-empty `+/_WORK_REVIEW/` warns so that territory work raises it as one `REVIEW-HOLD` query.',
  sources: [`${SOURCE}#territory-work`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Have territory work put Project work on hold or queue it until the active list is within the cap.'
    },
    audit: { phase: 'INSPECT', run: ({ cap }) => cap.outcomes }
  }
}

const COORD_7: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-7',
  title: 'every record identifier in a work report is a link',
  description:
    "In every report in a work folder, `+/_WORK/<id>/*.report.md`, and for the tolerance window in every thread report `+/_THREADS/<run>/*.report.md`, each full record identifier in the prose, a work record such as `KI-HARNESS-GOV-187` or a Decision Record such as `ADR-KI-HARNESS-010`, sits inside the text of a Markdown link, and a link that names a record and targets an absolute local path points at a file that exists, inside the audited checkout or wherever the target's folder is present on the machine; a target outside the checkout whose folder is absent, as on a CI runner, is checked for shape only, a Markdown file name opening with the linked identifier; a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision. Fenced blocks, such as a past reply block, inline code spans, which quote literal text such as a commit subject, and Needs tags such as `ACCEPT-181` are not checked; work awaiting review is not checked.",
  sources: [`${SOURCE}#linking-records`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Make each bare identifier the text of a link to its record by absolute path; where the record has been pruned, link it as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. Fix only the reports of the work under review.'
    },
    audit: { phase: 'INSPECT', run: ({ links }) => links.outcomes }
  }
}

const COORD_11: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-11',
  title: 'every recommended option in a work report carries its confidence',
  description:
    'In every report under `+/_WORK/<id>/` or `+/_THREADS/<run>/` whose form line leads with a glyph state, or whose block-letter footer was issued on or after 2026-10-18, each line of its Queries section that marks a lettered option recommended, `<letter>) (recommended`, reads `<letter>) (recommended, confidence high|medium|low - <reason>)`. A report issued earlier, or with neither to date it, and fenced blocks are not checked.',
  sources: [`${SOURCE}#owner-report`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Give each flagged option its confidence and a one-line reason, never `high` for a destructive course resting on claims not verified directly. Fix only the reports of the work under review.'
    },
    audit: { phase: 'INSPECT', run: ({ confidence }) => confidence.outcomes }
  }
}

const COORD_12: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-12',
  title: 'every work report opens with its report heading',
  description:
    'Every report under `+/_WORK/<id>/` or `+/_THREADS/<run>/` has the `#` report heading as its first non-blank line, or, for a report saved with front matter, the front matter first and the heading as the first non-blank line after it. A frame rule, a lint directive or a form line before the heading does not pass. Work awaiting review is not read.',
  sources: [`${SOURCE}#owner-report`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Move the report heading to the top of each flagged report, after its front matter if it has any. Fix only the reports of the work under review; other work fixes its own at its next mark.'
    },
    audit: { phase: 'INSPECT', run: ({ headings }) => headings.outcomes }
  }
}

const COORD_9: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-9',
  title: 'every work folder is pruned to what is still open',
  description:
    "Each work folder `+/_WORK/<id>/` holds only the closed list, the five package files `work.md`, `state.md`, `queries.md`, `messages.md` and `decisions.md`, `<name>.report.md`, `briefs/`, `design/` and `feedback/`, and no report whose queries are all answered and whose outcome has a durable home; a report counts as answered when the folder's decisions log names every Needs tag under its Queries, and one with no queries counts as answered. The coordinator prunes its own folder at every send and each mark, and territory work names the flagged folders at its own mark. More than eight open queries under `queries.md`'s `## Open` is a coordination smell and warns, and so, under the owner-queue cap, are more than eight roadmap records with `status: awaiting-review` naming a piece of Project work's Project, counted in the checkout and in each checkout beside it that names the same Capital. For the tolerance window a thread folder `+/_THREADS/<run>/` is checked against its old closed list, `decisions.md` and `<name>.report.md`, with a warning naming its new home.",
  sources: [`${SOURCE}#pruning-the-work-folder`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "At the owning coordinator's next send, move each stray file to its home under the closed list and delete by explicit path each listed report whose outcome has a durable home, keeping any whose home is unclear; answer, park or merge open queries beyond eight, and over eight records awaiting acceptance launch no new build or planning run until acceptance catches up, keeping acceptance fixes and backlog-clearing work. The listing is never permission to delete another piece of work's files."
    },
    heuristic: true,
    audit: { phase: 'INSPECT', run: ({ tidy }) => tidy.outcomes }
  },
  judgment: {
    scope: 'The flagged work folders, their decisions logs and the work files and records the reports name.',
    prompt:
      "Does each flagged report's outcome have a durable home, a work record, the decisions log, the work package or a commit, and is every query it raised answered in the log, so that the owning coordinator may delete it, and did territory work name the flagged folders at its mark?",
    outcomes: ['conforming', 'prune the work folder', 'home the outcome first', 'escalate to owner'],
    guidance:
      'Delete by explicit path only the reports whose outcome is homed; home an unhomed outcome before deleting its report, and leave another work folder to its own coordinator, told by a line in its `messages.md`.'
  }
}

const COORD_8: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-8',
  title: 'the coordinator hook and output style are bound where ki-coordination is declared',
  description:
    'In the runtime-specific Claude Code binding, a repository that declares `[skills.ki-coordination]` selects `"outputStyle": "ki-coordinator"` in its tracked `.claude/settings.json`, and, where the user\'s Claude Code settings are present, they run the harness `hooks/coordinator-reminder.sh` at `UserPromptSubmit` and `SessionStart` and the style is deployed as `~/.claude/output-styles/ki-coordinator.md`. The user-environment manager, chezmoi, stays the binder; the rubric only checks that the binding is present.',
  sources: [`${SOURCE}#coordinator-responsiveness`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Select the output style in the repository's tracked `.claude/settings.json`; bind the hook and deploy the style through the user-environment manager, such as `chezmoi apply` after reviewing `chezmoi diff`, rather than by editing user settings by hand."
    },
    audit: { phase: 'INSPECT', run: ({ binding }) => binding.outcomes }
  }
}

const COORD_4: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-4',
  title: 'coordinators stay responsive and work stays current',
  description:
    'A coordinator never does substantive work itself, sends every unit of work to a detached background agent and treats an owner message as steering rather than a stop; each turn makes at most five tool calls with reads limited to the work package, one read of its files counting as one call, `ki agent status`, one report and one short file and writes limited to the work package, the decisions log and a brief, waits only through a detached waiter or monitor, keeps a background check armed while work lies with a worker that wakes it at least every 5 minutes, or sooner when an agent finishes, for a one-to-two-line timed update naming the current step of each running agent, with no heartbeat otherwise, acts on new `messages.md` lines at each wake in queue order, important lines first, answers owner messages within one short turn and reports drift in one line; each territory Capital has one piece of territory work doing project management only, keeping the Project-work queue within its cap and seeding each work folder and opener; Project work works only its Project, follows the bootstrap, keeps its state file current and records approvals before launching; a routed line is never rejected whole, only the part not its own returned once to territory work.',
  sources: [`${SOURCE}#coordinator-responsiveness`, `${SOURCE}#coordinating-work`],
  judgment: {
    scope: 'Coordinator transcripts, work packages, decisions logs and recaps the owner selects for review.',
    prompt:
      'Did the coordinator keep within five tool calls a turn, delegate rather than analyse, draft, edit, test or wait in the foreground, give a timed heartbeat update naming the current step of each running agent at least every 5 minutes while work lay with a worker and none otherwise, answer owner messages within one short turn and stop work only on an express, named instruction, does territory work stay on project management with active Project work within the cap and a prepared work folder and opener for each, and does each piece of Project work run through background agents from a current state file, taking its message queue in priority order?',
    outcomes: ['conforming', 'delegate longer work', 'escalate to owner'],
    guidance:
      'Move longer coordinator work into background agents and note the drift in the state file; escalate to territory work when a direction touches more than one Project.'
  }
}

const COORD_5: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-5',
  title: 'coordinators park tangents, link records and keep checkouts current',
  description:
    "A coordinator parks passing side topics as dated one-line items under `queries.md`'s `## Parked`, cites and links every record, work file, theme and Project by full identifier and local path, and fast-forward pulls affected clean primary checkouts after background agents push.",
  sources: [`${SOURCE}#working-rules`],
  judgment: {
    scope: 'Coordinator transcripts, status lines, reports, recaps and work files the owner selects for review.',
    prompt:
      "Were side topics parked without derailing the work and later homed or dropped, does every mention of a record, work file, theme or Project carry its full identifier and a local link, and are the owner's primary checkouts current, with dirty or diverged ones reported rather than altered?",
    outcomes: ['conforming', 'park or home tangents', 'fix references', 'refresh checkouts', 'escalate to owner'],
    guidance:
      "Move tangents into `queries.md`'s `## Parked` or their proper home, replace short or unlinked references with full identifiers and local paths, and fast-forward only clean checkouts; report a dirty or diverged checkout to the owner instead of repairing it."
  }
}

const COORD_6: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-6',
  title: 'coordinators report in the owner forms, recap since the mark and refresh their guidance',
  description:
    "A coordinator asks clear-option decisions through the runtime's structured-question tool, logs each owner decision before launching its work and reads each spoken answer back as taken in the decisions log, opens every Summary, recap, full summary, re-bootstrap and hold report with the report heading, with no rule before it, one `#` heading of the theme linked to its local page, ` › ` and the Project linked to its local note, both as display names, a bold form line leading with the work's glyph state and giving the form, the local time and the last mark, and one rule, keeps the sections at H2 and each query at H3 under the owner report, each query carrying Context, Query and lettered Options with a) marked recommended with a high, medium or low confidence and a one-line reason and no bullets, with no reply block, closes every such report with the glyph banner exactly as the standard prints it, a `###` heading of the glyph state and since, a settled state showing its holder's glyph alone and an arrow only in a handoff state, a counts line and a `- [state] what · holder · since` list, and, in handoff to the owner only, the send line in its own text block, and Finished once only at Project close, rewrites its work file's front matter at every send, receive, mark and hold, naming no host, gives a hold report only when the owner agrees a hold with `pause` or `done for now`, after draining and parking every open query in the work file with its front matter `state: on-hold`, its sections `Done`, `Parked` and `Left over` under the form line `⏸️ On hold · Hold report at <local time> · mark <local time>`, with no Context, Query or Options, closing with the On hold banner, the line \"To bring this work back and continue it, paste this:\" and the hold send line, or stays With worker, blocked, with one line on what blocks it, never points an owner-facing report back to an earlier one, gives a full summary of the whole work on request with every owner decision linked under Decided and every open query in full, keeps its one mark in its work file's front matter and gives recaps since that mark that carry every open item forward across marks, at each mark strikes, points or keeps each decision with no numbering and prunes its own work folder by explicit path, and re-reads this standard at bootstrap, before each work-file update and whenever the skill has changed, noting the revision read as `ki-coordination read at <revision>`. A report written before 2026-10-18 keeps its block-letter frame, resume line and reply block, and one written before 2026-10-14 its earlier heading and query shape.",
  sources: [`${SOURCE}#coordinating-practices`, `${SOURCE}#report-forms`, `${SOURCE}#working-rules`],
  judgment: {
    scope: 'Coordinator transcripts, summaries, recaps, decisions logs and work files the owner selects for review.',
    prompt:
      "Were clear-option decisions asked as structured questions with the recommendation first, was every decision logged before its work launched and every spoken answer read back, does every Summary, recap, full summary, re-bootstrap and hold report open with the report heading as the standard draws it, the theme and the Project linked as display names in one `#` heading, the bold glyph form line and one rule, with the owner report's sections at H2 and queries at H3, each query giving Context, a one-sentence Query and lettered Options with a) marked recommended with a confidence and one-line reason, never high for a destructive course resting on unverified claims, no reply block and no pointer back to an earlier report, does every such report close with the glyph banner as the standard prints it, the holder's glyph alone in a settled state and an arrow only in a handoff state, the counts line and the holder list, with no decision number anywhere in it, and the send line only in handoff to the owner, does every send leave the work file's front matter agreeing with the banner and naming no host, does a hold report carry only Done, Parked and Left over, every open query parked in the work file, then the On hold banner, the closing line and the hold send line, or stay With worker and say what blocks the drain, does a full summary list every owner decision since the work began with a link to each and restate every open query in full, does the work file hold one mark, does each recap cover the window since that mark with outstanding work in full, at each mark were decisions struck, pointed or kept and the work folder pruned to its closed list by explicit path, and does the work file's noted ki-coordination revision match the skill's latest change?",
    outcomes: [
      'conforming',
      'log decisions',
      'add the banner',
      'restore the mark',
      'prune the work folder',
      'refresh guidance',
      'escalate to owner'
    ],
    guidance:
      'Record missing decisions and read-backs before further launches; open each report with the report heading, the theme and the Project linked, and its glyph form line, at the shared heading levels, give each query its Context, Query and lettered Options with a) recommended with its confidence and reason, and close each with the glyph banner and, in handoff to the owner, the send line the standard prints, restate anything that said see earlier, add the linked Decided list and the missing open queries to a full summary; restore the mark in the work file and recap from it; strike, point or keep each decision and delete by explicit path each report whose queries are answered and whose outcome is homed, keeping any whose home is unclear; and re-read this standard, update the noted revision and tell the owner what changed.'
  }
}

const COORD_13: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-13',
  title: 'coordinators have doubtful and destructive queries reviewed blind',
  description:
    'Before a query reaches the owner, a coordinator sends every query whose recommended option carries `medium` or `low` confidence, and every `high` one whose course destroys, deletes or publishes, to one blind review run on the strongest model at high effort, under Codex rather than Claude Code where independence matters; agreement lifts the confidence one level, never to `high` for a destructive course resting on claims not verified directly, with its reason beginning `reviewed`, and disagreement keeps the confidence, begins the reason `review disagrees` and shows both views in the query. The queries a run report raises are reviewed at receive.',
  sources: [`${SOURCE}#query-review`],
  judgment: {
    scope: 'Coordinator summaries, recaps, queries.md files and review-run reports the owner selects for review.',
    prompt:
      'Did every medium- or low-confidence query, and every high-confidence query with a destructive course, pass one blind review run before it reached the owner, did the run see the query without its recommendation or confidence, does each agreed query show its lifted confidence with a reason beginning `reviewed`, and does each disputed one keep its confidence and show both views?',
    outcomes: ['conforming', 'review the query', 'show both views', 'escalate to owner'],
    guidance:
      'Hold an unreviewed query back from the owner until one blind review run has seen it, then mark it reviewed with its lifted confidence or show both views; never raise a destructive course resting on claims not verified directly to high.'
  }
}

export const COORD: RubricFamily<CoordinationRubricContext, CoordinationRubricContext> = {
  code: 'COORD',
  title: 'Coordinating work',
  description:
    'The territory work and Project work a repository shows in its work files, with old-shape checkpoints for the tolerance window, and the responsiveness, reporting and currency of the coordinators behind them.',
  standard: SOURCE,
  selectContext: (context) => context,
  items: [
    COORD_1,
    COORD_2,
    COORD_10,
    COORD_3,
    COORD_7,
    COORD_11,
    COORD_12,
    COORD_9,
    COORD_8,
    COORD_4,
    COORD_5,
    COORD_6,
    COORD_13
  ]
}
