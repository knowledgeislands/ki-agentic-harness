import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CoordinationRubricContext } from '../contexts/coordination.ts'

const SOURCE = 'standards-coordination.md'
const REPORTING = 'standards-reporting.md'
const REPORT_FORMS = 'standards-report-forms.md'
const QUERIES = 'standards-queries.md'
const TERRITORY = 'standards-territory.md'
const OPENING = 'standards-opening.md'
const MIGRATION = 'standards-coordination-migration.md'

const COORD_1: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-1',
  title: 'territory work belongs to the Capital',
  description:
    'A territory Capital, a repository whose declared `capital` is itself, holds its territory work, `+/_WORK/<territory>.sop.main/_index.md`, retaining legacy `<territory>` input indefinitely, titled `<Territory> > SoP`, and no other repository holds territory or Project packages; deliberately owner-approved regular/ad hoc member work declares Home: in _index.md Scope, and its parent maintains the existing covers/home reference without a second package. Regular umbrella and child packages remain eligible; coverage never opens coordination. For the tolerance window a Capital whose territory work is still the state-of-play checkpoint `+/_CHECKPOINTS/_state-of-play.md` passes with a warning naming its new home.',
  sources: [`${TERRITORY}#territory-work`, `${MIGRATION}#thread-model`],
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
    "Each Project work file `+/_WORK/<territory>.prj.<project>/_index.md` names its `project`, its title ends in that Project's title, as in `KI > Model > Ways of working`, and on a Capital its Project resolves in `Streams/Projects/` and any `theme` in `Streams/Themes/`; a theme resolving only in the legacy `Streams/Initiatives/` warns, naming its new page, until 2026-11-07 and fails from that day. For the tolerance window an `<initiative>.<project>.md` checkpoint is checked as before, its label ending in its Project's title, or its slug in words where the Project note has no title, and its Initiative resolving in `Streams/Initiatives/`, with a warning naming its new home.",
  sources: [`${OPENING}#work-naming`, `${TERRITORY}#coordinating-work`],
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
    'Each work file declares its `level`, which agrees with its id: `sop` names territory work (`main` or a named secondary), `prj` names Project work and `reg` names regular work (legacy `regular` stays readable); legacy one- and two-part names stay readable indefinitely. For the tolerance window the `_state-of-play.md` checkpoint carries `role: state-of-play` and each `<initiative>.<project>.md` checkpoint `role: coordination`, or `role: conversational`, and no other checkpoint declares `state-of-play`.',
  sources: [`${OPENING}#levels-and-forms`],
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
    "At most three or four pieces of Project work are active at once, neither On hold nor Finished, reading the state from `state.md` where the work package has one, counting old-shape coordination checkpoints whose state is active; territory work and regular work are not counted. Under the owner-queue cap, more than eight roadmap records with `status: awaiting-review` naming a piece of Project work's Project also warn, counted in the checkout and in each checkout beside it that names the same Capital.",
  sources: [`${TERRITORY}#territory-work`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Have territory work put Project work on hold or queue it until the active list is within the cap; exceeding that active Project cap requires explicit owner agreement beforehand, never a unilateral increase; over eight records awaiting acceptance, launch no new build or planning run until acceptance catches up, keeping acceptance fixes and backlog-clearing work.'
    },
    audit: { phase: 'INSPECT', run: ({ cap }) => cap.outcomes }
  }
}

const COORD_7: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-7',
  title: 'every record identifier in a work report is a link',
  description:
    "In every report in a work folder, in each focus folder its `_index.md` declares, `+/_WORK/<id>/<focus-id>/*.report.md`, and in `+/_WORK/<id>/reports/*.report.md`, and for the tolerance windows in every report still at a work folder's top level and every thread report `+/_THREADS/<run>/*.report.md`, each full record identifier in the prose, a work record such as `KI-HARNESS-GOV-187` or a Decision Record such as `ADR-KI-HARNESS-010`, sits inside the text of a Markdown link, and a link that names a record and targets an absolute local path points at a file that exists, inside the audited checkout or wherever the target's folder is present on the machine; a target outside the checkout whose folder is absent, as on a CI runner, is checked for shape only, a Markdown file name opening with the linked identifier; a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision. Fenced blocks, such as a past reply block, inline code spans, which quote literal text such as a commit subject, and Needs tags such as `ACCEPT-181` are not checked.",
  sources: [`${REPORTING}#linking-records`, `${MIGRATION}#coord-7-and-thread-folders`],
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
    'In every report under `+/_WORK/<id>/` or `+/_THREADS/<run>/` whose form line leads with a glyph state, or whose block-letter footer was issued on or after 2026-10-18, each line of its Queries section that marks a lettered option recommended, `<letter>) (recommended`, reads `<letter>) (recommended, confidence high|medium|low - <reason>)`, and no `###` query marks more than one option recommended. A report issued earlier, or with neither to date it, and fenced blocks are not checked.',
  sources: [`${REPORTING}#owner-report`, `${QUERIES}#query-review`, `${MIGRATION}#coord-11-confidence-cutover`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Give each flagged option its confidence and a one-line reason, never `high` for a destructive course resting on claims not verified directly; split a query that recommends more than one option into separately tagged queries. Fix only the reports of the work under review.'
    },
    audit: { phase: 'INSPECT', run: ({ confidence }) => confidence.outcomes }
  }
}

const COORD_12: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-12',
  title: 'every work report opens with its report heading',
  description:
    'Every report under `+/_WORK/<id>/` or `+/_THREADS/<run>/` has the `#` report heading as its first non-blank line, or, for a report saved with front matter, the front matter first and the heading as the first non-blank line after it. A frame rule, a lint directive or a form line before the heading does not pass. Work awaiting review is not read.',
  sources: [`${REPORTING}#owner-report`, `${REPORT_FORMS}#report-forms`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Move the report heading to the top of each flagged report, after its front matter if it has any, before the work is marked or sent. Fix only the reports of the work under review; other work fixes its own before its next mark.'
    },
    audit: { phase: 'INSPECT', run: ({ headings }) => headings.outcomes }
  }
}

const COORD_8: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-8',
  title: 'the coordinator hook and output style are bound where ki-coordination is declared',
  description:
    'In the runtime-specific Claude Code binding, a repository that declares `[skills.ki-coordination]` selects `"outputStyle": "ki-coordinator"` in its tracked `.claude/settings.json`, and, where the user\'s Claude Code settings are present, they run the harness `hooks/coordinator-reminder/coordinator-reminder.sh` at `UserPromptSubmit` and `SessionStart` and the style is deployed as `~/.claude/output-styles/ki-coordinator.md`. The user-environment manager, chezmoi, stays the binder; the rubric only checks that the binding is present.',
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
    'A coordinator never does substantive work itself, sends every unit of work to a detached background agent and treats an owner message as steering rather than a stop; each turn makes at most five tool calls with reads limited to the work package, one read of its files counting as one call, the agent host view of its agents, one report and one short file and writes limited to the work package, the decisions log and a brief, waits only on the agent host notice or a detached background check, keeps a background check armed while work lies with a worker that wakes it only when a run finishes, with no timed bound and no timed update while it waits, with no heartbeat otherwise, keeps one inbox watcher armed only when the owner has asked the thread to listen, or it is a Rig host sync thread, and the work is not draining, On hold or Finished, that silently fetches and fast-forwards and wakes it only on a new message line or a finished run, shows a listening or sync mode line in the banner only while that mode is on, acts on new `messages.md` lines at each wake in queue order, important lines first, answers owner messages within one short turn and reports drift in one line; each territory Capital has one main State of play coordinating registered Project packages within its cap, through explicit committed assignment and acknowledged handover of in-flight runs without timeout takeover; the assignment field remains undecided. It acts in one assigned package per turn, keeps the queue and seeds each work folder and opener, and any secondary State of play names the main as `parent`, lists the work it `covers` and routes cross-cutting matters to the main, which stays the front door for the owner; Project work works only its Project, follows the bootstrap, keeps its state file current and records approvals before launching; a routed line is never rejected whole, only the part not its own returned once to the State of play that routed it.',
  sources: [
    `${SOURCE}#coordinator-responsiveness`,
    'standards-listening.md#inbox-watch',
    `${TERRITORY}#coordinating-work`
  ],
  judgment: {
    scope: 'Coordinator transcripts, work packages, decisions logs and summaries the owner selects for review.',
    prompt:
      'Did the coordinator keep within five tool calls a turn, delegate rather than analyse, draft, edit, test or wait in the foreground, issue no command that may wait for a permission prompt, such as an `rm` with a glob, variable or `$(...)` target, `git worktree remove` or a foreground `sleep` of 60 seconds or more, give timed updates only when work launched or a run finished, with no timed wake or update while waiting, keep the inbox watcher armed only when the owner had asked the thread to listen, or it was a Rig host sync thread, and the work was not draining, On hold or Finished, show a listening line in the banner only while listening, answer owner messages within one short turn and stop work only on an express, named instruction, does territory work stay on project management with active Project work within the cap and a prepared work folder and opener for each, and does each piece of Project work run through background agents from a current state file, taking its message queue in priority order?',
    outcomes: ['conforming', 'delegate longer work', 'escalate to owner'],
    guidance:
      'Move longer coordinator work into background agents and note the drift in the state file; escalate to territory work when a direction touches more than one Project.'
  }
}

const COORD_5: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-5',
  title: 'coordinators park tangents, link records and keep checkouts current',
  description:
    "A coordinator parks passing side topics as dated one-line items under `discussions.md`'s `## Parked`, cites and links every record, work file, theme and Project by full identifier and local path, and fast-forward pulls affected clean primary checkouts after background agents push. Commit each complete unit and finished package change by explicit path before its turn ends; sync after each finished change and at least every 15 minutes. Push everything stacked on main, including other sessions' commits, fast-forward only, never forced or with --no-verify, stopping on divergence. Conflict repair belongs to a bounded isolated run that rebases only this work's unpublished commits and stops on other content, uncertain ownership or judgement.",
  sources: [
    'standards-mark.md#parking-tangents',
    `${REPORTING}#linking-records`,
    'standards-sync.md#keeping-primary-checkouts-current'
  ],
  judgment: {
    scope: 'Coordinator transcripts, status lines, reports, summaries and work files the owner selects for review.',
    prompt:
      "Were side topics parked without derailing the work and later homed or dropped, does every mention of a record, work file, theme or Project carry its full identifier and a local link, and are the owner's primary checkouts current, with dirty or diverged ones reported rather than altered? Were completed package changes committed promptly, was the 15-minute sync floor met, and did any conflict run stay within those ownership and authority boundaries?",
    outcomes: ['conforming', 'park or home tangents', 'fix references', 'refresh checkouts', 'escalate to owner'],
    guidance:
      "Move tangents into `discussions.md`'s `## Parked` or their proper home, replace short or unlinked references with full identifiers and local paths, and fast-forward only clean checkouts; report a dirty or diverged checkout to the owner instead of repairing it."
  }
}

const COORD_6: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-6',
  title: 'coordinators report in the owner forms, summarise from the mark and refresh their guidance',
  description:
    "A coordinator asks clear-option decisions one at a time in two replies: the first starts a short background timer and ends with the previous answer's one-line read-back and the next query's context as chat Markdown opening with a `Query <n> of <total>` counter line, and the second, woken by the timer, holds only a short question card with a one-line title, short option labels and the recommendation first, or plain chat Markdown alone where the runtime has no card or no wake; it logs each answer before the next first reply and closes the set with a mark and then the Summary, logs each owner decision before launching its work and reads each spoken answer back as taken in the decisions log, gives every reply the structure and layout its trigger sets, opens every Summary, Status, Bootstrap and Stop with the report heading, with no rule before it, one `#` heading of the theme linked to its local page, ` › ` and the Project linked to its local note, both as display names, a bold form line giving the reply structure, the local time and the last mark, with no state, and one rule, keeps the sections at H2 and each query at H3, a Summary's sections being `## Summary` with a bold headline and what changed, `## Status` with its two-column Focus and Where it stands table, each item line opening with its holder's glyph and Kris's items last by query tag, and `## Queries` with every open query in full, then the footer of the Knowledge Islands art, unless `no art` was asked for, and the banner, and any other report's those of the owner report, each query carrying Context, Query and lettered Options with a) marked recommended with a high, medium or low confidence and a one-line reason and no bullets, with a reply block whenever there is a query, its queries grouped by priority under numbered headings and each line, `<TAG> a (high)`, carrying the recommended option's confidence, closes every such report with the glyph banner exactly as the standard prints it, omitting routine push state and other sessions' stacked commits and reporting a failed push that prevented publication of the run's own unit with its unit and reason, a `###` heading of the glyph state and at, a settled state showing its holder's glyph alone and an arrow only in a handoff state or With worker's bracketed hold or handoff target, a counts line of all five views and a `- [state] what · holder · at <time>` list, a listening line always shown, and exactly one closing thread line, `<role glyph> 🔑 <work-id>` for every explicitly coordinating package, including main and secondary State of play, Project, regular and ad hoc work, its glyph from the role catalogue, or `🧵 <work-id>` for a session with no role yet, never a send or resume prompt, and Finished once only at Project close, rewrites its work file's front matter at every send, receive, mark and hold, naming no session host seat, gives a Stop for a hold only when the owner agrees a hold with `pause` or `done for now`, or `snooze` for a hold that waits for more to come, after draining and parking every open query in the work file with its front matter `state: on-hold`, its sections `Done`, `In Progress` holding Left over and `Queries` holding the parked tags one line each, under the form line `Stop at <local time> · mark <local time>`, with no Context, Query, Options or reply block, closing with the On hold or Snoozing banner, its closing thread line, or stays With worker, blocked, with one line on what blocks it, never points an owner-facing report back to an earlier one, keeps its one mark, only a timestamp, in its work file's front matter, gives the Summary after every `mark` and the Position after `mark only`, and gives Summaries since that mark, the session's start or any time the owner names that carry every open item forward across marks, at each mark strikes, points or keeps each decision with no numbering and prunes its own work folder by explicit path, and re-reads this standard at bootstrap, before each work-file update and whenever the skill has changed, keeping the revision read as `method_read` in `state.md`'s front matter. A report written before 2026-10-22 keeps its send or resume line; one written before 2026-10-18 keeps its block-letter frame, resume line and reply block, and one written before 2026-10-14 its earlier heading and query shape. Summary Done and In Progress are windowed on the mark; handoffs appear once in Done, roadmap-held items stay in the roadmap and Outstanding holds only this work's holdings. Carry requested Findings and hand-on prompts in full until settlement. Bootstrap and re-bootstrap include one Rename thread: /rename <thread line> line in Done, the named paste-line exception. Drain checks put DRAINED or NOT DRAINED in Done and keep the thread line last. Unattended entry records the unambiguous end, baseline revisions and plan; a question put to the owner during the window is asked in plain text in the thread, never through a blocking question prompt, waits a couple of minutes at most and, unanswered, is parked as a query with nothing done on it, silence never read as consent; return is the Summary across repositories with failures and misses, then the next mark only after the owner has seen it.",
  sources: [
    `${SOURCE}#coordinating-practices`,
    `${REPORT_FORMS}#report-forms`,
    'standards-holds.md#putting-work-on-hold',
    'standards-mark.md#the-mark',
    'standards-unattended.md#unattended-windows',
    `${QUERIES}#interactive-pass`
  ],
  judgment: {
    scope: 'Coordinator transcripts, summaries, decisions logs and work files the owner selects for review.',
    prompt:
      "Were clear-option decisions asked one at a time in two replies, the first starting a short background timer and ending with the previous answer's one-line read-back and the next query's context as chat Markdown opening with a counter line, the second, woken by the timer, holding only a short question card, or plain chat Markdown where the runtime has no card or no wake, with the recommendation first, each answer logged before the next first reply, and the set closed with a mark and then the Summary, and any question in an unattended window asked in plain text with no blocking prompt, was every decision logged before its work launched and every spoken answer read back, did each reply take the structure and layout its trigger sets, does every Summary, Status, Bootstrap and Stop open with the report heading as the standard draws it, the theme and the Project linked as display names in one `#` heading, the bold form line with no state and one rule, with the owner report's sections at H2 and queries at H3, each query giving Context, a one-sentence Query and lettered Options with a) marked recommended with a confidence and one-line reason, never high for a destructive course resting on unverified claims, a reply block whenever there is a query, grouped by priority under numbered headings with each line carrying its confidence, and no pointer back to an earlier report, does every such report close with the glyph banner as the standard prints it, the holder's glyph alone in a settled state and an arrow only in a handoff state or With worker's bracketed target, the counts line and the holder list, with no decision number anywhere in it, and exactly one closing thread line identifying the work type, exact label and id in every state, with no send or resume prompt, does every send leave the work file's front matter agreeing with the banner and naming no session host seat, does a hold's Stop carry only Done, In Progress with Left over and Queries with the parked tags, every open query parked in the work file, then the On hold banner, its closing thread line, or stay With worker and say what blocks the drain, does each Summary run its `## Summary`, the two-column status table as the full board with holder glyphs, and every open query in full, then the footer, does the work file hold one mark, does each Summary cover the window it names with outstanding work in full, at each mark were decisions struck, pointed or kept and the work folder pruned to its closed list by explicit path, and does the work file's noted ki-coordination revision match the skill's latest change, do owner reports, run reports and banners omit routine push state and other sessions' stacked commits, and does a failed push preventing publication of the run's own unit name that unit and reason, with a Stop keeping nothing about pushes beyond a failure? Does a territory Summary name each package, qualify each query by work id and tag, keep queries and answers in their owning package and preserve each package's state, since, mark and beat? Are inventory-based host requirements limited to device-dependent execution, preserving IMPORTANT and queue order? Are Summary holdings windowed on the mark, requested findings and prompts carried in full, rename and drain lines in Done, and unattended entry, scope and return consistent with the grant, with every question the owner left unanswered during the window parked rather than acted on?",
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
      'Record missing decisions and read-backs before further launches; open each report with the report heading, the theme and the Project linked, and its glyph form line, at the shared heading levels, give each query its Context, Query and lettered Options with a) recommended with its confidence and reason, and close each with the glyph banner and its closing thread line as the standard prints, restate anything that said see earlier, add the missing status-table rows and open queries to a Summary; restore the mark in the work file and summarise from it; strike, point or keep each decision and delete by explicit path each report whose queries are answered and whose outcome is homed, keeping any whose home is unclear; and re-read this standard, update the noted revision and tell the owner what changed.'
  }
}

const COORD_13: RubricItem<CoordinationRubricContext> = {
  code: 'COORD-13',
  title: 'coordinators have doubtful and destructive queries reviewed blind',
  description:
    'Before a query reaches the owner, a coordinator sends every query whose recommended option carries `medium` or `low` confidence, and every `high` one whose course destroys, deletes or publishes, to one blind review run on the strongest model at high effort, under Codex rather than Claude Code where independence matters; agreement lifts the confidence one level, never to `high` for a destructive course resting on claims not verified directly, with its reason beginning `reviewed`, and disagreement keeps the confidence, begins the reason `review disagrees` and shows both views in the query. The review brief carries the review-independence sentence and states earlier decisions as dated facts, and a review that challenges an earlier decision is shown at the end of the Context with an option to revisit it, never acted on without the owner. The queries a run report raises are reviewed at receive. A query still below high confidence after review is split into separately tagged parts; packed queries are unpacked before an unattended window. After a Summary that lists open queries, and on request, the interactive pass asks exactly one decision at a time, each query in two replies, and logs and reads back each answer before the next.',
  sources: [`${QUERIES}#query-review`, `${QUERIES}#interactive-pass`],
  judgment: {
    scope: 'Coordinator summaries, discussion files and review-run reports the owner selects for review.',
    prompt:
      'Did every medium- or low-confidence query, and every high-confidence query with a destructive course, pass one blind review run before it reached the owner, did the run see the query without its recommendation or confidence, with the review-independence sentence and earlier decisions stated as dated facts, does each agreed query show its lifted confidence with a reason beginning `reviewed`, or, where the agreement rests only on precedent or only on how the coordinator framed it, its unchanged confidence with a reason beginning `reviewed, precedent only`, does each disputed one keep its confidence and show both views, and does each challenge to an earlier decision end the Context with an option to revisit it?',
    outcomes: ['conforming', 'review the query', 'show both views', 'escalate to owner'],
    guidance:
      'Hold an unreviewed query back from the owner until one blind review run has seen it, then mark it reviewed with its lifted confidence, or with its unchanged confidence and `reviewed, precedent only` where the agreement rests only on precedent or framing, or show both views, and show any challenge at the end of the Context with an option to revisit it; never raise a destructive course resting on claims not verified directly to high.'
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
    COORD_8,
    COORD_4,
    COORD_5,
    COORD_6,
    COORD_13
  ]
}
