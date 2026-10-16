import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { CheckpointsRubricContext, RecordContext } from '../contexts/checkpoints.ts'

const SOURCE = 'standards-checkpoints.md'

const RECORD_1: RubricItem<RecordContext> = {
  code: 'RECORD-1',
  title: 'record identity is human-selected and consistent',
  description:
    'Each filename stem is a non-empty single path component that is neither `.` nor `..` and does not encode a mechanically recognisable opaque runtime-session identifier; dotted `<initiative>.<project>` names and the leading-underscore master name `_state-of-play` are valid. The filename, `thread` field, and H1 repeat the same human-selected thread name.',
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
    scope: 'Every checkpoint filename, thread field, and H1.',
    prompt: 'Is each thread name a stable human-selected lookup key rather than a vendor or runtime identifier?',
    outcomes: ['conforming', 'explicit rename required', 'escalate to user'],
    guidance: 'Keep the user-selected thread as the lookup key; do not derive or replace it from runtime metadata.'
  }
}

const RECORD_2: RubricItem<RecordContext> = {
  code: 'RECORD-2',
  title: 'frontmatter and headings use the closed schema',
  description:
    'Active records declare type, thread, state, created_at, and updated_at, plus at most the optional label, which is a non-empty single-line string when present, and the optional role, which is `conversational`, `coordination` or `state-of-play` when present. Every record uses the exact H1 and ordered Objective, Current state, Decisions made, Files touched, Open questions, and Next step H2 sections, each with substantive content.',
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
    scope: 'The authored frontmatter, headings, and reconstruction sections of every record.',
    prompt: 'Can the schema correction be made without inventing or discarding user-owned reconstruction state?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance: 'Ask the user to update uncertain authored content; the checker must not infer missing checkpoint state.'
  }
}

const RECORD_3: RubricItem<RecordContext> = {
  code: 'RECORD-3',
  title: 'record carries a presentation label',
  description:
    'Each active record carries a `label`: the exact thread name the human uses in their client, of the form `<Space> > <Initiative> > <project in words>`, `<Space> > SoP` for the state-of-play thread or `<Space> > <topic>`, with a `(<host>)` suffix only for a thread limited to that machine; a label in the earlier `<Initiative title>: <project>` or `Master: state-of-play` form stays valid until the owner approves its change. The label is presentation only and never used for resolution.',
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
    scope: 'Every checkpoint label.',
    prompt: 'Does each label match the name the human uses for the thread in their client?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance: 'Take the label from the human; never derive identity or resolution from it.'
  }
}

const RECORD_4: RubricItem<RecordContext> = {
  code: 'RECORD-4',
  title: 'a coordinating role is declared only where ki-pmo is',
  description:
    'A record whose `role` is `coordination` or `state-of-play` lives in a repository whose `.ki.toml` declares `[skills.ki-pmo]`; an absent role means `conversational`. The role field is the one authority for the thread type; the repository declaration is only the capability gate.',
  sources: [`${SOURCE}#thread-role`],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'guarded',
      guidance:
        'Declare `[skills.ki-pmo]` where the repository coordinates, or correct the role through an explicit checkpoint update.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.role }
  },
  judgment: {
    scope: 'Every checkpoint role.',
    prompt: 'Does each declared role match how the owner runs the thread?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance: 'Take the role from the owner; never infer it from the label, file name or repository declaration.'
  }
}

export const RECORD: RubricFamily<CheckpointsRubricContext, RecordContext> = {
  code: 'RECORD',
  title: 'Checkpoint record',
  description: 'Closed metadata and document shape make one snapshot portable and deterministically readable.',
  standard: SOURCE,
  selectContext: (context) => context.records,
  items: [RECORD_1, RECORD_2, RECORD_3, RECORD_4]
}
