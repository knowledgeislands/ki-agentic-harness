import type { RubricFamily, RubricItem } from '../../shared/rubric.ts'
import type { RecordContext, WorkPackageRubricContext } from '../contexts/work-package.ts'

const SOURCE = 'standards-work-package.md'

const RECORD_1: RubricItem<RecordContext> = {
  code: 'RECORD-1',
  title: 'record identity is chosen and consistent',
  description:
    "Each work folder is named by the work's dotted id, lower-case kebab segments joined by `.` with no mechanically recognisable opaque runtime-session identifier, and the folder, the `id` fields of `work.md` and `state.md`, and each file's H1 agree. An old checkpoint's filename stem is a non-empty single path component, dotted `<initiative>.<project>` and `_state-of-play` included, repeated in its `thread` field and H1.",
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
    "A package's `work.md` declares id, level, title, description, worker and supervisor, project at project level and only there, parent on every package below the main and covers on States of play, checked against the main register and unique secondary coverage, its role, one role from the role standard's catalogue, its absence and the old words assistant and keeper warned on under the role migration file, and at most the optional label, theme and created_at, with no state field, and its body is the id H1 then Goals, Scope, an optional one-line Values, linking the shared values, and an optional Focus, which lists each focus area by its kebab-case id as a code span, listing `_emerging`, the one id allowed its leading underscore, only while it holds something, and never a type folder's name, and both stay outside the body's word limit; for the tolerance window a Focus above Goals, as FOCUS-IN-WORK piloted it, and a Focus listing `aside` in place of `_emerging`, as EMERGING-FOCUS renamed it, are warned on rather than failed. Its `state.md` declares id, state and since; target in handoff and only there, hold with its reason, release and optional set_by, owner or worker, the worker setting only more-expected, on hold and only there; and at most the optional blocking, received, beat, mark and method_read, each of its stated type (method_read is a short harness revision string or null), and the thread capability fields: listening_enabled and syncing_enabled booleans, listening_status and syncing_status on or off, each status present exactly while its capability is enabled, and syncing_enabled true only where listening_enabled is true, and the optional `workers`, a list of the package's live seats, each a mapping of `role`, one catalogue role, and `tier`, that role's catalogue tier, and at most `focus`, a list of focus ids, `since`, a UTC timestamp, `status`, active or idle, and `listening`, on or off, checked against the catalogue table read at audit time, a top-level role or tier, an entry's name, uri or designation, `listening: agora-call` and the old tiers enablers and doers warned on under the role migration file, and its body is the `<id> state` H1 then Now, Queue for territory work only, Next steps and Held. The discussion file, `discussions.md` or for the tolerance window `queries.md` and never both, holds its H1 naming the file, Open and Parked, each discussion point a `<TAG> - <title>` block with Context, Query and Options; `messages.md` holds its H1 then `## Inbound` and `## Outbound` under MSG-SECTIONS, Inbound holding ACK lines first, then message lines, each with a short `MSG-` id and an optional `focus: <id>` slot before it, flagged URGENT, which alone carries a `by <deadline>` slot, IMPORTANT or SUPERSEDED, urgent lines first, then important lines, and Outbound each sent line awaiting its ACK, each section a list or None; for the tolerance window an H1-only `messages.md` with message lines is warned on rather than failed. Every section says something. A single-file work file keeps its old closed fields and its Next steps, Messages and Parked sections, and an old checkpoint keeps its closed type, thread, state, created_at, updated_at, optional label and role, and its six H2 sections.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    remediation: {
      class: 'guarded',
      guidance: 'Correct authored package schema only through an explicit update.'
    },
    audit: { phase: 'INSPECT', run: (context) => context.schema }
  },
  judgment: {
    scope:
      'The authored front matter, headings, and sections of every package file, single-file work file and old checkpoint.',
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
    'A territory or Project package, or old coordination/state-of-play checkpoint, needs [skills.ki-coordination] capability. This never assigns an active session role. A regular package needs no coordination capability merely by existing. Explicitly owner-opened regular coordination checks capability at bootstrap, unless a specific owner-approved exception covers that opening. No stored coordinator field is added.',
  sources: [`${SOURCE}#state-file`],
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
    scope: 'Work levels, legacy roles and explicitly owner-opened coordinating sessions.',
    prompt:
      'Does the explicit opener check authority and coordination capability or its specific owner-approved exception, while regular packages remain usable conversationally?',
    outcomes: ['conforming', 'explicit update required', 'escalate to user'],
    guidance:
      'Preserve the actual level; package, id, binding and capability never select coordination. Check the opener under ki-coordination Session kinds, preserving the specific Acquire intake exception.'
  }
}
export const RECORD: RubricFamily<WorkPackageRubricContext, RecordContext> = {
  code: 'RECORD',
  title: 'Work-package record',
  description: 'Closed metadata and document shape make one work package portable and deterministically readable.',
  standard: SOURCE,
  selectContext: (context) => context.records,
  items: [RECORD_1, RECORD_2, RECORD_3, RECORD_4]
}
