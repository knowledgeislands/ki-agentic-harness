import type { AuditOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import { type ActivitiesContext, type ActivityNote, KNOWN_REALIZATIONS, KNOWN_STATUSES } from '../contexts/activities.ts'

const unavailable = (context: ActivitiesContext): RubricOutcomes<AuditOutcome> | null =>
  !context.available
    ? [{ status: 'VIOLATION', message: 'audit target is not an existing directory', subject: context.target }]
    : !context.activitiesAvailable
      ? [{ status: 'NOT_APPLICABLE', message: 'no activities directory — nothing to audit', subject: 'Admin/Operations/Activities/' }]
      : null

const notesWithFrontmatter = (context: ActivitiesContext): readonly ActivityNote[] =>
  context.notes.filter((note) => note.frontmatter !== null)

const oneOrMore = <Outcome>(values: readonly Outcome[]): RubricOutcomes<Outcome> => {
  if (values.length === 0) throw new Error('expected one or more rubric outcomes')
  return [values[0], ...values.slice(1)]
}

export const ACT_S_1: RubricItem<ActivitiesContext> = {
  code: 'ACT-S-1',
  title: 'activity index',
  description: '`Activities.md` exists when one or more activity notes exist and lists every note.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        if (context.notes.length === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'no activity notes found — index check not applicable' }]
        if (!context.indexContent)
          return [
            {
              status: 'VIOLATION',
              message: 'index is absent — create an index listing all activities',
              subject: 'Admin/Operations/Activities/Activities.md'
            }
          ]
        const missing = context.notes.filter((note) => !context.indexContent.includes(note.indexLink))
        return missing.length
          ? oneOrMore(
              missing.map((note) => ({
                status: 'VIOLATION' as const,
                message: `activity note is absent from the index: ${note.indexLink}`,
                subject: 'Admin/Operations/Activities/Activities.md'
              }))
            )
          : [
              {
                status: 'PASS',
                message: `index lists all ${context.notes.length} activity note(s)`,
                subject: 'Admin/Operations/Activities/Activities.md'
              }
            ]
      }
    },
    conform: { phase: 'PRIMARY', run: (context) => context.ensureIndex() }
  },
  judgment: { prompt: 'Is the index current, well ordered, and informative rather than merely mechanically complete?' }
}

export const ACT_S_2: RubricItem<ActivitiesContext> = {
  code: 'ACT-S-2',
  title: 'activity collection location',
  description: 'Activity notes are assessed only within `Admin/Operations/Activities/` in an existing base.',
  sources: ['sources.md'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'PREPARE',
      run: (context) =>
        context.available
          ? [{ status: 'PASS', message: 'base path is an existing directory', subject: context.target }]
          : [{ status: 'VIOLATION', message: 'audit target is not an existing directory', subject: context.target }]
    }
  }
}

export const ACT_F_1: RubricItem<ActivitiesContext> = {
  code: 'ACT-F-1',
  title: 'activity status',
  description: 'Frontmatter-bearing activity notes declare `status` as `active`, `paused`, or `retired`.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const outcomes: AuditOutcome[] = []
        for (const note of context.notes) {
          if (!note.frontmatter)
            outcomes.push({ status: 'INFO', message: 'no frontmatter block — judgment check only', subject: note.relative })
          else if (!note.frontmatter.status)
            outcomes.push({
              status: 'VIOLATION',
              message: "missing required field 'status' (active | paused | retired)",
              subject: note.relative
            })
          else if (!KNOWN_STATUSES.includes(note.frontmatter.status as (typeof KNOWN_STATUSES)[number]))
            outcomes.push({
              status: 'VIOLATION',
              message: `status '${note.frontmatter.status}' is not one of active / paused / retired`,
              subject: note.relative
            })
          else outcomes.push({ status: 'PASS', message: `status '${note.frontmatter.status}' is valid`, subject: note.relative })
        }
        return outcomes.length ? oneOrMore(outcomes) : [{ status: 'NOT_APPLICABLE', message: 'no activity notes found' }]
      }
    }
  }
}

export const ACT_F_2: RubricItem<ActivitiesContext> = {
  code: 'ACT-F-2',
  title: 'activity realization',
  description: 'Frontmatter-bearing activity notes declare a `realization`.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const outcomes: AuditOutcome[] = []
        for (const note of notesWithFrontmatter(context))
          outcomes.push(
            note.frontmatter?.realization
              ? { status: 'PASS', message: `realization '${note.frontmatter.realization}' declared`, subject: note.relative }
              : { status: 'VIOLATION', message: "missing required field 'realization'", subject: note.relative }
          )
        return outcomes.length
          ? oneOrMore(outcomes)
          : [{ status: 'NOT_APPLICABLE', message: 'no frontmatter-bearing activity notes found' }]
      }
    }
  }
}

export const ACT_F_3: RubricItem<ActivitiesContext> = {
  code: 'ACT-F-3',
  title: 'recognized realization',
  description: 'Unknown realization values are surfaced for environment documentation without blocking extension.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const outcomes = notesWithFrontmatter(context)
          .filter((note) => note.frontmatter?.realization)
          .map((note) =>
            KNOWN_REALIZATIONS.includes(note.frontmatter?.realization as (typeof KNOWN_REALIZATIONS)[number])
              ? { status: 'PASS' as const, message: `realization '${note.frontmatter?.realization}' is known`, subject: note.relative }
              : {
                  status: 'INFO' as const,
                  message: `realization '${note.frontmatter?.realization}' is not in the known list — ensure the agentic environment is documented`,
                  subject: note.relative
                }
          )
        return outcomes.length ? oneOrMore(outcomes) : [{ status: 'NOT_APPLICABLE', message: 'no realized activity notes found' }]
      }
    }
  }
}

export const ACT_R_1: RubricItem<ActivitiesContext> = {
  code: 'ACT-R-1',
  title: 'slash-command skill field',
  description: 'A `slash-command` activity declares its `skill` field.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const notes = notesWithFrontmatter(context).filter((note) => note.frontmatter?.realization === 'slash-command')
        if (notes.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'no slash-command activities found' }]
        return oneOrMore(
          notes.map((note) =>
            note.frontmatter?.skill
              ? { status: 'PASS' as const, message: `skill '${note.frontmatter.skill}' declared`, subject: note.relative }
              : {
                  status: 'VIOLATION' as const,
                  message: "slash-command requires a 'skill' field naming the SKILL.md",
                  subject: note.relative
                }
          )
        )
      }
    }
  }
}

export const ACT_R_2: RubricItem<ActivitiesContext> = {
  code: 'ACT-R-2',
  title: 'slash-command skill resolution',
  description: 'A declared slash-command skill resolves when a harness path is supplied.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const notes = notesWithFrontmatter(context).filter(
          (note) => note.frontmatter?.realization === 'slash-command' && note.frontmatter.skill
        )
        if (notes.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'no declared slash-command skills found' }]
        if (!context.harness)
          return oneOrMore(
            notes.map((note) => ({
              status: 'INFO' as const,
              message: `skill '${note.frontmatter?.skill}' declared but no harness path provided — pass --harness <path> to verify`,
              subject: note.relative
            }))
          )
        return oneOrMore(
          notes.map((note) =>
            context.hasHarnessSkill(note.frontmatter?.skill ?? '')
              ? { status: 'PASS' as const, message: `skill '${note.frontmatter?.skill}' exists in the harness`, subject: note.relative }
              : {
                  status: 'VIOLATION' as const,
                  message: `skill '${note.frontmatter?.skill}' is absent from the harness`,
                  subject: note.relative
                }
          )
        )
      }
    }
  }
}

export const ACT_R_3: RubricItem<ActivitiesContext> = {
  code: 'ACT-R-3',
  title: 'scheduled-task name',
  description: 'A `scheduled-task` activity declares its `schedule_name`.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const notes = notesWithFrontmatter(context).filter((note) => note.frontmatter?.realization === 'scheduled-task')
        if (notes.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'no scheduled-task activities found' }]
        return oneOrMore(
          notes.map((note) =>
            note.frontmatter?.schedule_name
              ? { status: 'PASS' as const, message: `schedule '${note.frontmatter.schedule_name}' declared`, subject: note.relative }
              : { status: 'VIOLATION' as const, message: "scheduled-task requires a 'schedule_name' field", subject: note.relative }
          )
        )
      }
    }
  }
}

export const ACT_R_4: RubricItem<ActivitiesContext> = {
  code: 'ACT-R-4',
  title: 'scheduled-task registration',
  description: 'Scheduled-task registrations are surfaced for verification in their external environment.',
  sources: ['sources.md'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const stop = unavailable(context)
        if (stop) return stop
        const notes = notesWithFrontmatter(context).filter(
          (note) => note.frontmatter?.realization === 'scheduled-task' && note.frontmatter.schedule_name
        )
        if (notes.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'no named scheduled-task activities found' }]
        return oneOrMore(
          notes.map((note) => ({
            status: 'INFO' as const,
            message: `verify '${note.frontmatter?.schedule_name}' is registered and active in ${note.frontmatter?.schedule_env ?? 'the external scheduling system'}`,
            subject: note.relative
          }))
        )
      }
    }
  }
}

export const ACT_J_1: RubricItem<ActivitiesContext> = {
  code: 'ACT-J-1',
  title: 'activity note clarity',
  description: 'Each activity note body explains what the activity does, when it runs, and why it was adopted.',
  sources: ['sources.md'],
  judgment: { prompt: 'Does each activity note clearly explain what it does, when it runs, and why it was adopted?' }
}

export const ACT_J_2: RubricItem<ActivitiesContext> = {
  code: 'ACT-J-2',
  title: 'activity index quality',
  description: 'The activity index is current, ordered, and useful to a reader.',
  sources: ['sources.md'],
  judgment: { prompt: 'Is the activity index current, ordered, and useful rather than just mechanically complete?' }
}

export const ACT_J_3: RubricItem<ActivitiesContext> = {
  code: 'ACT-J-3',
  title: 'retirement rationale',
  description: 'Retired activities document why they were retired rather than disappearing silently.',
  sources: ['sources.md'],
  judgment: { prompt: 'Do retired activities document a clear retirement rationale?' }
}

export const ACT_J_4: RubricItem<ActivitiesContext> = {
  code: 'ACT-J-4',
  title: 'slash-command documentation',
  description: 'Slash-command activities link to their skill documentation or trigger description.',
  sources: ['sources.md'],
  judgment: { prompt: 'Does every slash-command activity link to useful skill documentation or trigger guidance?' }
}

export const ACT_J_5: RubricItem<ActivitiesContext> = {
  code: 'ACT-J-5',
  title: 'scheduled-task narrative',
  description: 'Scheduled-task activities document cadence and expected outcome.',
  sources: ['sources.md'],
  judgment: { prompt: 'Does every scheduled-task note state its cadence and expected outcome?' }
}

export const ACT = [
  ACT_S_1,
  ACT_S_2,
  ACT_F_1,
  ACT_F_2,
  ACT_F_3,
  ACT_R_1,
  ACT_R_2,
  ACT_R_3,
  ACT_R_4,
  ACT_J_1,
  ACT_J_2,
  ACT_J_3,
  ACT_J_4,
  ACT_J_5
] as const
