import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { RecordContext, WorkFolderRubricContext } from '../contexts/work-folder.ts'

const SOURCE = 'standards-work-folder.md'

const RECORD_1: RubricItem<RecordContext> = {
  code: 'RECORD-1',
  title: 'record identity is chosen and consistent',
  description:
    "Each work folder is named by the work's dotted id, lower-case kebab segments joined by `.` with no mechanically recognisable opaque runtime-session identifier, and the folder, `id` field and H1 agree. An old checkpoint's filename stem is a non-empty single path component, dotted `<initiative>.<project>` and `_state-of-play` included, repeated in its `thread` field and H1.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    heuristic: true,
    remediation: {
      class: 'guarded',
      guidance: 'Correct record identity only through an explicit user-selected thread update.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.identity }
  },
  judgment: {
    scope: 'Every work folder, id field and H1, and every old checkpoint filename, thread field and H1.',
    prompt: 'Is each id or thread name a stable chosen lookup key rather than a vendor or runtime identifier?',
    outcomes: ['conforming', 'explicit rename required', 'escalate to user'],
    guidance: 'Keep the work id as the lookup key; do not derive or replace it from runtime metadata.'
  }
}

const RECORD_2: RubricItem<RecordContext> = {
  code: 'RECORD-2',
  title: 'front matter and headings use the closed schema',
  description:
    'A work file declares id, level, title, worker, supervisor, state and since; project at project level and only there, target in handoff and only there, hold with its reason and release on hold and only there; and at most the optional label, theme, blocking, received, beat, mark and created_at, each of its stated type. Its body is the id H1 and the ordered Next steps, Messages and Parked H2 sections, each saying something. An old checkpoint keeps its closed type, thread, state, created_at, updated_at, optional label and role, and its six H2 sections.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'guarded',
      guidance: 'Correct authored record schema only through an explicit checkpoint update.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.schema }
  },
  judgment: {
    scope: 'The authored front matter, headings, and sections of every work file and old checkpoint.',
    prompt: 'Can the schema correction be made without inventing or discarding user-owned work state?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance: 'Ask the user to update uncertain authored content; the checker must not infer missing work state.'
  }
}

const RECORD_3: RubricItem<RecordContext> = {
  code: 'RECORD-3',
  title: 'an old checkpoint carries a presentation label',
  description:
    'Each old checkpoint carries a `label`: the exact thread name the human uses in their client, of the form `<Space> > <Initiative> > <project in words>`, `<Space> > SoP` for the state-of-play thread or `<Space> > <topic>`, with a `(<host>)` suffix only for a thread limited to that machine; a label in the earlier `<Initiative title>: <project>` or `Master: state-of-play` form stays valid until the owner approves its change. The label is presentation only and never used for resolution; a work file carries its required `title` instead.',
  sources: [SOURCE],
  mechanical: {
    level: 'WARN',
    remediation: {
      class: 'guarded',
      guidance: 'Add the label through an explicit checkpoint update; resolution still goes by thread and Project name.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.label }
  },
  judgment: {
    scope: 'Every old checkpoint label.',
    prompt: 'Does each label match the name the human uses for the thread in their client?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance: 'Take the label from the human; never derive identity or resolution from it.'
  }
}

const RECORD_4: RubricItem<RecordContext> = {
  code: 'RECORD-4',
  title: 'coordinating work lives only where ki-coordination is declared',
  description:
    'A work file at `territory` or `project` level, or an old checkpoint whose `role` is `coordination` or `state-of-play`, lives in a repository whose `.ki.toml` declares `[skills.ki-coordination]`. The level, or for an old checkpoint the role, is the one authority for the kind of work; the repository declaration is only the capability gate.',
  sources: [`${SOURCE}#front-matter`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'guarded',
      guidance:
        'Declare `[skills.ki-coordination]` where the repository coordinates, or correct the level through an explicit work-file update.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.role }
  },
  judgment: {
    scope: 'Every work file level and old checkpoint role.',
    prompt: 'Does each declared level or role match how the owner runs the work?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance: 'Take the level from the owner; never infer it from the title, folder name or repository declaration.'
  }
}

export const RECORD: RubricFamily<WorkFolderRubricContext, RecordContext> = {
  code: 'RECORD',
  title: 'Work-file record',
  description: 'Closed metadata and document shape make one work file portable and deterministically readable.',
  standard: SOURCE,
  selectContext: (context) => context.records,
  items: [RECORD_1, RECORD_2, RECORD_3, RECORD_4]
}
