import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PmoRubricContext } from '../contexts/pmo.ts'

const SOURCE = 'standards-pmo.md'

const PMO_1: RubricItem<PmoRubricContext> = {
  code: 'PMO-1',
  title: 'the state-of-play checkpoint belongs to the Capital',
  description:
    'A territory Capital, a repository whose declared `capital` is itself, holds the state-of-play thread checkpoint `+/_CHECKPOINTS/_state-of-play.md` labelled `<Space> > SoP`, or `Master: state-of-play` until its change is approved, and no other repository holds one.',
  sources: [`${SOURCE}#state-of-play-thread`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Open the state-of-play thread in the Capital so it creates `_state-of-play.md` there, and remove a state-of-play checkpoint from any repository that is not its own capital through an explicit `ki-checkpoint` REMOVE.'
    },
    audit: { phase: 'INSPECT', run: ({ master }) => master.outcomes }
  }
}

const PMO_2: RubricItem<PmoRubricContext> = {
  code: 'PMO-2',
  title: 'coordination thread checkpoints resolve in the registry',
  description:
    "Each `<initiative>.<project>.md` checkpoint's label ends in its Project in words, as in `KI > Model > ways of working`, or in the earlier form `: <project>`, and on a Capital its Project and Initiative resolve in the `Streams/Projects/` and `Streams/Initiatives/` registry.",
  sources: [`${SOURCE}#coordination-threads`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Rename the checkpoint or correct its label through an explicit `ki-checkpoint` UPDATE, or register the Project or Initiative under the `ki-work` registry standard.'
    },
    audit: { phase: 'INSPECT', run: ({ labels }) => labels.outcomes }
  }
}

const PMO_10: RubricItem<PmoRubricContext> = {
  code: 'PMO-10',
  title: 'coordinating thread checkpoints declare their role',
  description:
    "The `_state-of-play.md` checkpoint carries `role: state-of-play` and each `<initiative>.<project>.md` checkpoint carries `role: coordination`, or `role: conversational` where the owner runs it as a conversation; no other checkpoint declares `state-of-play`. An existing checkpoint gains the field through its own thread's next update.",
  sources: [`${SOURCE}#thread-types`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Have the thread add its `role` at its next `ki-checkpoint` UPDATE, or ask through the state-of-play thread's messages block; never edit another thread's checkpoint to add it."
    },
    audit: { phase: 'INSPECT', run: ({ roles }) => roles.outcomes }
  }
}

const PMO_3: RubricItem<PmoRubricContext> = {
  code: 'PMO-3',
  title: 'active coordination threads are within the cap',
  description:
    'At most three or four coordination thread checkpoints are active at once, plus the state-of-play thread.',
  sources: [`${SOURCE}#state-of-play-thread`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Have the state-of-play thread close or queue coordination threads until the active list is within the cap, removing a closed checkpoint through an explicit `ki-checkpoint` REMOVE.'
    },
    audit: { phase: 'INSPECT', run: ({ cap }) => cap.outcomes }
  }
}

const PMO_7: RubricItem<PmoRubricContext> = {
  code: 'PMO-7',
  title: 'every record identifier in a thread report is a link',
  description:
    'In every thread report `+/_THREADS/<run>/*.report.md`, each full record identifier in the prose, a work record such as `KI-HARNESS-GOV-187` or a Decision Record such as `ADR-KI-HARNESS-010`, sits inside the text of a Markdown link, and a link that names a record and targets an absolute local path points at a file that exists; a pruned record is linked as `<FULL-ID> (pruned)` to the GitHub link to the file at its last revision. Fenced blocks, such as the reply block, and Needs tags such as `ACCEPT-181` are not checked.',
  sources: [`${SOURCE}#linking-records`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Make each bare identifier the text of a link to its record by absolute path; where the record has been pruned, link it as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. Fix only the reports of the thread under review.'
    },
    audit: { phase: 'INSPECT', run: ({ links }) => links.outcomes }
  }
}

const PMO_9: RubricItem<PmoRubricContext> = {
  code: 'PMO-9',
  title: 'every thread folder is trimmed to what is still open',
  description:
    "Each thread folder `+/_THREADS/<run>/` holds only the closed list, `decisions.md` and `<name>.report.md`, and no report whose queries are all answered and whose outcome has a durable home; a report counts as answered when the folder's decisions log names every Needs tag under its Queries, and one with no queries counts as answered. The thread tidies its own folder at every resting point as well as at each mark, and the state-of-play thread names the flagged folders at its own mark.",
  sources: [`${SOURCE}#tidying-the-thread-folder`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "At the owning thread's next resting point, move each stray file to its home under the closed list and delete by explicit path each listed report whose outcome has a durable home, keeping any whose home is unclear. The listing is never permission to delete another thread's files."
    },
    heuristic: true,
    audit: { phase: 'INSPECT', run: ({ tidy }) => tidy.outcomes }
  },
  judgment: {
    scope: 'The flagged thread folders, their decisions logs and the checkpoints and records the reports name.',
    prompt:
      "Does each flagged report's outcome have a durable home, a work record, the decisions log, the checkpoint or a commit, and is every query it raised answered in the log, so that the owning thread may delete it, and did the state-of-play thread name the flagged folders at its mark?",
    outcomes: ['conforming', 'tidy the thread folder', 'home the outcome first', 'escalate to owner'],
    guidance:
      "Delete by explicit path only the reports whose outcome is homed; home an unhomed outcome before deleting its report, and leave another thread's folder to that thread, told through its messages block."
  }
}

const PMO_8: RubricItem<PmoRubricContext> = {
  code: 'PMO-8',
  title: 'the coordinator hook and output style are bound where ki-pmo is declared',
  description:
    'In the runtime-specific Claude Code binding, a repository that declares `[skills.ki-pmo]` selects `"outputStyle": "ki-coordinator"` in its tracked `.claude/settings.json`, and, where the user\'s Claude Code settings are present, they run the harness `hooks/coordinator-reminder.sh` at `UserPromptSubmit` and `SessionStart` and the style is deployed as `~/.claude/output-styles/ki-coordinator.md`. The user-environment manager, chezmoi, stays the binder; the rubric only checks that the binding is present.',
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

const PMO_4: RubricItem<PmoRubricContext> = {
  code: 'PMO-4',
  title: 'coordinators stay responsive and threads stay current',
  description:
    'A coordinating thread never does substantive work itself, sends every unit of work to a detached background agent and treats an owner message as steering rather than a stop; each turn makes at most five tool calls with reads limited to the checkpoint, `ki agent status`, one report and one short file and writes limited to the checkpoint, the decisions log and a brief, waits only through a detached waiter or monitor, keeps a background check armed while work runs that wakes it at least every 5 minutes, or sooner when an agent finishes, for a one-to-two-line timed update naming the current step of each running agent, with no heartbeat at rest, answers owner messages within one short turn and reports drift in one line; each territory Capital has one state-of-play thread at `_state-of-play.md` doing project management only, keeping the coordination-thread queue within its cap and seeding each checkpoint and opener; a coordination thread works only its Project, follows the bootstrap, keeps its checkpoint current and records approvals before launching.',
  sources: [`${SOURCE}#coordinator-responsiveness`, `${SOURCE}#coordination-threads`],
  judgment: {
    scope:
      'Coordinating-thread transcripts, project checkpoints, decisions logs and recaps the owner selects for review.',
    prompt:
      'Did the coordinator keep within five tool calls a turn, delegate rather than analyse, draft, edit, test or wait in the foreground, give a timed heartbeat update naming the current step of each running agent at least every 5 minutes while work ran and none at rest, answer owner messages within one short turn and stop work only on an express, named instruction, does the state-of-play thread stay on project management with active coordination threads within the cap and a prepared checkpoint and opener for each, and does each coordination thread work through background agents from a current checkpoint?',
    outcomes: ['conforming', 'delegate longer work', 'escalate to owner'],
    guidance:
      'Move longer coordinator work into background agents and note the drift in the checkpoint; escalate to the state-of-play thread when a direction touches more than one Project.'
  }
}

const PMO_5: RubricItem<PmoRubricContext> = {
  code: 'PMO-5',
  title: 'threads park tangents, link records and keep checkouts current',
  description:
    'A coordinating thread parks passing side topics as dated one-line items under its checkpoint Open questions, cites and links every record, checkpoint, Initiative and Project by full identifier and local path, and fast-forward pulls affected clean primary checkouts after background agents push.',
  sources: [`${SOURCE}#thread-working-rules`],
  judgment: {
    scope:
      'Coordinating-thread transcripts, status lines, reports, recaps and checkpoints the owner selects for review.',
    prompt:
      "Were side topics parked without derailing the work and later homed or dropped, does every mention of a record, checkpoint, Initiative or Project carry its full identifier and a local link, and are the owner's primary checkouts current, with dirty or diverged ones reported rather than altered?",
    outcomes: ['conforming', 'park or home tangents', 'fix references', 'refresh checkouts', 'escalate to owner'],
    guidance:
      'Move tangents into checkpoint Open questions or their proper home, replace short or unlinked references with full identifiers and local paths, and fast-forward only clean checkouts; report a dirty or diverged checkout to the owner instead of repairing it.'
  }
}

const PMO_6: RubricItem<PmoRubricContext> = {
  code: 'PMO-6',
  title: 'threads report in the three forms, recap since the mark and refresh their guidance',
  description:
    "A coordinating thread asks clear-option decisions through the runtime's structured-question tool, logs each owner decision before launching its work, opens every Summary, recap, full summary and re-bootstrap report with the report heading, three rules, one `#` heading of the Initiative linked to its local note, ` › ` and the Project linked to its local note, both as display names, a bold line giving the form, the local time and the last mark, and one rule, a report written before 2026-10-14 keeping its earlier heading, keeps the sections at H2 and each query at H3 under the `ki-delegation` owner report, each query carrying Context, Query and lettered Options with a) marked recommended and no bullets, or Summary, Need from you and Recommendation if written before 2026-10-14, closes every Summary, recap, full summary and re-bootstrap report with the block-letter REST or BUSY footer banner exactly as the standard prints it, the lower-case form word and the issued time in its top border, one blank framed line inside each border, a report issued before 2026-10-14 keeping its `issued` border and unpadded frame, with a blank line and then the bracketed-state list beneath and no label-and-mark line, `- [at rest] nothing running or queued` first when nothing is running or queued, and, at rest, the resume line in its own text block, and DONE once only at Project close, rewrites its checkpoint's pick-up block at every REST, BUSY, HOLD or DONE banner, naming no host, gives a hold report only when the owner asks it to drain to a hold, after parking every open query, held, parked and waiting-on item and the next step in the checkpoint with nothing running and the pick-up block's status `hold`, its sections `Done`, `Parked` and `Left over` under the form line `Hold report at <local time> · mark <local time>`, with no reply block and no Context, Query or Options, closing with the HOLD frame exactly as the standard prints it, its list, the line \"To bring this thread back and continue the work, paste this:\" and the resume line from the pick-up block, a report written before 2026-10-15 keeping its drain report and DRAINED frame, or with BUSY and one line on what blocks it, never points an owner-facing report back to an earlier one, gives a full summary of the whole thread on request with every owner decision linked under Decided and every open query in full, ends at a resting point with a Summary whose banner says it is resting or what it waits on, keeps its one owner-struck mark in its checkpoint Current state and gives recaps since that mark that carry every open item forward across marks, at every resting point and each mark deletes by explicit path every report in its own thread folder whose queries are all answered and whose outcome has a durable home, keeping `decisions.md` and the reports with open queries while Git history holds the rest, and re-reads this standard at bootstrap, before each checkpoint update and whenever the skill has changed, noting the revision read as `ki-pmo read at <revision>`.",
  sources: [`${SOURCE}#coordinating-thread-practices`, `${SOURCE}#report-forms`, `${SOURCE}#thread-working-rules`],
  judgment: {
    scope:
      'Coordinating-thread transcripts, summaries, recaps, decisions logs and checkpoints the owner selects for review.',
    prompt:
      "Were clear-option decisions asked as structured questions with the recommendation first, was every decision logged before its work launched, does every Summary, recap, full summary and re-bootstrap report open with the report heading as the standard draws it, three rules, the Initiative and the Project linked as display names in one `#` heading, the bold form line with the local time and the last mark, and one rule, or an earlier heading if written before 2026-10-14, with the owner report's sections at H2 and queries at H3, each query giving Context, a one-sentence Query and lettered Options with a) marked recommended, or the earlier Summary, Need from you and Recommendation if written before 2026-10-14, and no pointer back to an earlier report, does every Summary, recap, full summary and re-bootstrap report close with the block-letter REST or BUSY footer exactly as the standard prints it, the lower-case form word and the issued time in its top border, one blank framed line inside each border, a report issued before 2026-10-14 keeping its `issued` border and unpadded frame, a blank line and then the bracketed-state list beneath with `- [at rest]` first when nothing is running or queued and no label-and-mark line, and, at rest, the resume line in its own text block, with no decision number anywhere in the banner, does every banner leave the checkpoint's pick-up block agreeing with it and naming no host, does a hold report carry only Done, Parked and Left over with no reply block, every open query parked in the checkpoint, then the HOLD frame, its list, the closing line and the resume line from the pick-up block, or BUSY and what blocks the drain, does a full summary list every owner decision since the thread began with a link to each and restate every open query in full, does a resting or waiting thread's last message say so, does the checkpoint hold one mark in the standard form that only the owner moved, does each recap cover the window since that mark with outstanding work in full whenever it arose, after each resting point and mark does the thread folder hold only `decisions.md` and the reports with open queries, the answered and homed reports deleted by explicit path and recoverable from Git history, and does the checkpoint's noted ki-pmo revision match the skill's latest change?",
    outcomes: [
      'conforming',
      'log decisions',
      'add the banner',
      'restore the mark',
      'tidy the thread folder',
      'refresh guidance',
      'escalate to owner'
    ],
    guidance:
      'Record missing decisions before further launches; open each Summary, recap, full summary and re-bootstrap report with the report heading, the Initiative and the Project linked, and its form line, at the shared heading levels, give each query its Context, Query and lettered Options with a) recommended, and close each, and each re-bootstrap report, with the block-letter footer, its list and, at rest, the resume line the standard prints, restate anything that said see earlier, add the linked Decided list and the missing open queries to a full summary, and end a resting point with a Summary that states the wait; restore the mark line in Current state and recap from it; delete by explicit path each report whose queries are answered and whose outcome is homed, keeping any whose home is unclear; and re-read this standard, update the noted revision and tell the owner what changed.'
  }
}

export const PMO: RubricFamily<PmoRubricContext, PmoRubricContext> = {
  code: 'PMO',
  title: 'Coordinating threads',
  description:
    'The state-of-play and coordination thread checkpoints a repository shows, and the responsiveness, reporting and currency of the threads behind them.',
  standard: SOURCE,
  selectContext: (context) => context,
  items: [PMO_1, PMO_2, PMO_10, PMO_3, PMO_7, PMO_9, PMO_8, PMO_4, PMO_5, PMO_6]
}
