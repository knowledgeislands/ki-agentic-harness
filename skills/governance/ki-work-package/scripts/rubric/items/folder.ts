import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { FolderOutcomes } from '../contexts/work-folder.ts'
import type { WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standards-work-package.md'
const TIDY = `${SOURCE}#tidying-the-work-folder`

const FOLDER_1: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-1',
  title: 'every work folder holds only its closed list',
  description:
    'Each work folder `+/_WORK/<id>/` holds only the five package files, `<name>.report.md`, Markdown briefs under `briefs/`, Markdown feedback packages under `feedback/`, and under `design/` only design notes, subject folders of the same kinds, diagram sources and their `.svg` and `.html` renders. Scripts, screenshots, scratch folders and tool output fail. For the tolerance window a thread folder `+/_THREADS/<run>/` is checked against its old closed list, `decisions.md` and `<name>.report.md`, with a warning naming its new home.',
  sources: [`${SOURCE}#closed-list`],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'diagnostic',
      guidance:
        "Move each stray file to its owning home, or delete it where it is temporary output, which belongs in the run's temporary directory. Fix only your own work's folder; tell other work by one line in its `messages.md`."
    },
    audit: { phase: 'INSPECT', run: ({ closed }) => closed }
  }
}

const FOLDER_2: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-2',
  title: 'no work folder keeps a report whose queries are all answered',
  description:
    "A run report whose every Needs tag the folder's decisions log names, or which has no queries, is a candidate for the tidy once its outcome has a durable home. Whether it has one stays the steward's judgement; the listing is never permission to delete.",
  sources: [TIDY],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "At the steward's next send or mark, delete by explicit path each listed report whose outcome has a durable home, keeping any whose home is unclear."
    },
    heuristic: true,
    audit: { phase: 'INSPECT', run: ({ answered }) => answered }
  },
  judgment: {
    scope: 'The flagged work folders, their decisions logs and the work files and records the reports name.',
    prompt:
      "Does each flagged report's outcome have a durable home, a work record, the decisions log, the work package or a commit, and is every query it raised answered in the log, so that the owning steward may delete it, and did territory work name the flagged folders at its mark?",
    outcomes: ['conforming', 'prune the work folder', 'home the outcome first', 'escalate to owner'],
    guidance:
      'Delete by explicit path only the reports whose outcome is homed; home an unhomed outcome before deleting its report, and leave another work folder to its own steward, told by a line in its `messages.md`.'
  }
}

const FOLDER_3: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-3',
  title: "no work folder keeps a brief whose run's report it has received",
  description:
    "A brief `briefs/<run>.md` goes once its run's report has been received, which the folder shows by holding `<run>.report.md`.",
  sources: [TIDY],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Delete each listed brief by explicit path at the steward's next send or mark, unless its handoff is open."
    },
    heuristic: true,
    audit: { phase: 'INSPECT', run: ({ briefs }) => briefs }
  }
}

const FOLDER_4: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-4',
  title: "no finished work's folder outlives its closing mark",
  description:
    'Finished work keeps its package with `state: finished` only until the mark that closes it; a folder whose state is `finished` and whose `mark` falls at or after its `since` is due for the close-out.',
  sources: [`${SOURCE}#removal-lifecycle`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Once its decisions are homed and `design/` resolved, delete the finished work folder in one commit, with Git keeping it.'
    },
    audit: { phase: 'INSPECT', run: ({ finished }) => finished }
  }
}

const FOLDER_5: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-5',
  title: 'every folder awaiting review has its index line',
  description:
    "Each folder under `+/_WORK_REVIEW/` has one line in the holding area's `README.md` saying why it is there, and each index line names a folder still held.",
  sources: [`${SOURCE}#work-awaiting-review`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance: 'Add the missing index line, or remove the line in the same commit that moves or deletes its folder.'
    },
    audit: { phase: 'INSPECT', run: ({ review }) => review }
  }
}

const FOLDER_6: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-6',
  title: 'no work package holds more than eight open queries',
  description: "More than eight queries under `queries.md`'s `## Open` is a coordination smell and warns.",
  sources: [`${SOURCE}#queries-file`],
  mechanical: {
    level: 'WARN',
    remediation: { class: 'diagnostic', guidance: 'Answer, park or merge open queries until eight or fewer remain.' },
    audit: { phase: 'INSPECT', run: ({ queries }) => queries }
  }
}

const FOLDER_7: RubricItem<FolderOutcomes> = {
  code: 'FOLDER-7',
  title: 'every decisions log reads to the close gate as entries',
  description:
    "The `ki agent close` gate opens one entry at every `##` heading, timestamped, dated, numbered or free text, and reads nothing else. A list item or deeper heading before the first `##` heading is a decision the gate never sees, a heading with no text is one it cannot name, and a repeated heading is one `ki agent reconcile` cannot address. Thread folders' logs are read too, since the gate reads whichever log a run's home holds.",
  sources: [`${SOURCE}#decisions-log`],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'diagnostic',
      guidance:
        "Give each unread decision its own `## <YYYY-MM-DD HH:MM zone> - <title>` heading, the form `ki agent decide` writes, title any empty heading, and make repeated headings distinct. Fix only your own work's log; tell other work by one line in its `messages.md`."
    },
    audit: { phase: 'INSPECT', run: ({ decisions }) => decisions }
  }
}

export const FOLDER: RubricFamily<WorkPackageRubricContext, FolderOutcomes> = {
  code: 'FOLDER',
  title: 'Work-folder closed list and tidy',
  description:
    'Each work folder holds only its closed list, and what is due for the tidy is listed for its steward, so folders stay pruned without relying on memory.',
  standard: SOURCE,
  selectContext: (context) => context.folder,
  items: [FOLDER_1, FOLDER_2, FOLDER_3, FOLDER_4, FOLDER_5, FOLDER_6, FOLDER_7]
}
