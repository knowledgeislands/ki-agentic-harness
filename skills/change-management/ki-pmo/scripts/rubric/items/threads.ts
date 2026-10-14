import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { PmoRubricContext } from '../contexts/pmo.ts'

const SOURCE = 'standards-pmo.md'

const PMO_1: RubricItem<PmoRubricContext> = {
  code: 'PMO-1',
  title: 'the state-of-play checkpoint belongs to the Capital',
  description:
    'A territory Capital, a repository whose declared `capital` is itself, holds the state-of-play thread checkpoint `+/_CHECKPOINTS/_state-of-play.md` labelled `Master: state-of-play`, and no other repository holds one.',
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
    "Each `<initiative>.<project>.md` checkpoint's label ends in `: <project>`, and on a Capital its Project and Initiative resolve in the `Streams/Projects/` and `Streams/Initiatives/` registry.",
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
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Make each bare identifier the text of a link to its record by absolute path; where the record has been pruned, link it as `[<FULL-ID> (pruned)](https://github.com/<owner>/<repo>/blob/<last revision>/<path>)`. Fix only the reports of the thread under review.'
    },
    audit: { phase: 'INSPECT', run: ({ links }) => links.outcomes }
  }
}

const PMO_4: RubricItem<PmoRubricContext> = {
  code: 'PMO-4',
  title: 'coordinators stay responsive and threads stay current',
  description:
    'A coordinating thread never does substantive work itself, sends every unit of work to a detached background agent and treats an owner message as steering rather than a stop; each turn makes at most five tool calls with reads limited to the checkpoint, `ki agent status`, one report and one short file and writes limited to the checkpoint, the decisions log and a brief, waits only through a detached waiter or monitor, answers owner messages within one short turn and reports drift in one line; each territory Capital has one state-of-play thread at `_state-of-play.md` doing project management only, keeping the coordination-thread queue within its cap and seeding each checkpoint and opener; a coordination thread works only its Project, follows the bootstrap, keeps its checkpoint current and records approvals before launching.',
  sources: [`${SOURCE}#coordinator-responsiveness`, `${SOURCE}#coordination-threads`],
  judgment: {
    scope:
      'Coordinating-thread transcripts, project checkpoints, decisions logs and recaps the owner selects for review.',
    prompt:
      'Did the coordinator keep within five tool calls a turn, delegate rather than analyse, draft, edit, test or wait in the foreground, answer owner messages within one short turn and stop work only on an express, named instruction, does the state-of-play thread stay on project management with active coordination threads within the cap and a prepared checkpoint and opener for each, and does each coordination thread work through background agents from a current checkpoint?',
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
    "A coordinating thread asks clear-option decisions through the runtime's structured-question tool, logs each owner decision before launching its work, opens every Summary, recap and full summary with the shared H1 banner heading naming the thread, its Project and Initiative, the window and its state, keeps the sections at H2 and each query at H3 under the `ki-delegation` owner report, closes every Summary, recap, full summary and re-bootstrap report with the banner frame in the standard's shape, the thread type, the report form and the issued time in its top border, the label centred in its body and the mark in its bottom border, widened equally when the top border needs it, with a blank line and then the bracketed-state list beneath, `- [at rest] nothing running or queued` first when nothing is running or queued, and the resume line in its own text block, and DONE once only at Project close, never points an owner-facing report back to an earlier one, gives a full summary of the whole thread on request with every owner decision linked under Decided and every open query in full, ends at a resting point with a Summary whose banner says it is resting or what it waits on, keeps its one owner-struck mark in its checkpoint Current state and gives recaps since that mark that carry every open item forward across marks, and re-reads this standard at bootstrap, before each checkpoint update and whenever the skill has changed, noting the revision read as `ki-pmo read at <revision>`.",
  sources: [`${SOURCE}#coordinating-thread-practices`, `${SOURCE}#report-forms`, `${SOURCE}#thread-working-rules`],
  judgment: {
    scope:
      'Coordinating-thread transcripts, summaries, recaps, decisions logs and checkpoints the owner selects for review.',
    prompt:
      "Were clear-option decisions asked as structured questions with the recommendation first, was every decision logged before its work launched, does every Summary, recap and full summary open with an H1 banner heading giving thread, Project and Initiative links, window and state, with the owner report's sections at H2 and queries at H3 and no pointer back to an earlier report, does every Summary, recap, full summary and re-bootstrap report close with the frame exactly as the standard prints it, the thread type, the report form and the issued time in its top border, the label centred in its body and the mark in its bottom border, a blank line and then the bracketed-state list beneath with `- [at rest]` first when nothing is running or queued, and the resume line in its own text block, with no decision number anywhere in the banner, does a full summary list every owner decision since the thread began with a link to each and restate every open query in full, does a resting or waiting thread's last message say so, does the checkpoint hold one mark in the standard form that only the owner moved, does each recap cover the window since that mark with outstanding work in full whenever it arose, and does the checkpoint's noted ki-pmo revision match the skill's latest change?",
    outcomes: [
      'conforming',
      'log decisions',
      'add the banner',
      'restore the mark',
      'refresh guidance',
      'escalate to owner'
    ],
    guidance:
      'Record missing decisions before further launches; open each Summary, recap and full summary with the H1 banner heading at the shared heading levels and close each, and each re-bootstrap report, with the frame and resume line the standard prints, restate anything that said see earlier, add the linked Decided list and the missing open queries to a full summary, and end a resting point with a Summary that states the wait; restore the mark line in Current state and recap from it; and re-read this standard, update the noted revision and tell the owner what changed.'
  }
}

export const PMO: RubricFamily<PmoRubricContext, PmoRubricContext> = {
  code: 'PMO',
  title: 'Coordinating threads',
  description:
    'The state-of-play and coordination thread checkpoints a repository shows, and the responsiveness, reporting and currency of the threads behind them.',
  standard: SOURCE,
  selectContext: (context) => context,
  items: [PMO_1, PMO_2, PMO_3, PMO_7, PMO_4, PMO_5, PMO_6]
}
