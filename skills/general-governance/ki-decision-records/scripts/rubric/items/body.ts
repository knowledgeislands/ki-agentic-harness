import type { AuditOutcome, RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { outcomes } from './shared.ts'

const SOURCE = 'dr-format.md'

export const BODY = [
  {
    code: 'BODY-1',
    title: 'Canonical heading',
    description: 'Heading matches `# <PREFIX>-<SCOPE>-NNN: <title>`; the ID prefix is present and matches the filename.',
    sources: [SOURCE],
    mechanical: {
      level: 'FAIL',
      overrideLevels: ['WARN'],
      audit: {
        phase: 'INSPECT',
        run: (context: DecisionRecordsContext) =>
          outcomes(
            context.records.flatMap((record): AuditOutcome[] => {
              if (!record.headingId)
                return [{ status: 'VIOLATION', message: 'Canonical decision-record heading is absent.', subject: record.file }]
              if (record.headingId !== record.id)
                return [
                  {
                    status: 'VIOLATION',
                    level: 'WARN',
                    message: `Heading ID is ${record.headingId}; expected ${record.id}.`,
                    subject: record.file
                  }
                ]
              return []
            }),
            'Every decision-record heading has the canonical form and matches its filename.'
          )
      }
    }
  },
  {
    code: 'BODY-3',
    title: 'Optional date format',
    description: 'A `**Date:**` line is optional; if present it must be `YYYY-MM-DD`.',
    sources: [SOURCE],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: DecisionRecordsContext) =>
          outcomes(
            context.records
              .filter((record) => record.date && !/^\d{4}-\d{2}-\d{2}$/.test(record.date))
              .map((record): AuditOutcome => ({ status: 'VIOLATION', message: 'Date must use YYYY-MM-DD.', subject: record.file })),
            'Every present decision-record date uses YYYY-MM-DD.'
          )
      }
    }
  },
  {
    code: 'BODY-4',
    title: 'Required decision sections',
    description: '`## Context`, `## Decision`, and `## Consequences` sections are all present.',
    sources: [SOURCE],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: DecisionRecordsContext) =>
          outcomes(
            context.records.flatMap((record) =>
              record.missingSections.map(
                (section): AuditOutcome => ({
                  status: 'VIOLATION',
                  message: `Required section is absent: ${section}.`,
                  subject: record.file
                })
              )
            ),
            'Every decision record contains Context, Decision, and Consequences sections.'
          )
      }
    }
  },
  {
    code: 'BODY-5',
    title: 'Value-neutral context',
    description: 'Context is value-neutral forces, not advocacy ("the island currently…" not "we need to…").',
    sources: [SOURCE],
    judgment: { prompt: 'Assess whether Context states value-neutral forces rather than advocacy.' }
  },
  {
    code: 'BODY-6',
    title: 'Active-voice decision',
    description: 'Decision is in active voice ("This island adopts…" or "We will…").',
    sources: [SOURCE],
    judgment: { prompt: 'Assess whether Decision uses active voice.' }
  },
  {
    code: 'BODY-7',
    title: 'Substantive sections',
    description: 'Each section has real, non-placeholder substance.',
    sources: [SOURCE],
    judgment: { prompt: 'Assess whether every required section contains real, non-placeholder substance.' }
  },
  {
    code: 'BODY-8',
    title: 'Focused length',
    description: 'Length is one to two pages, roughly 200–500 body words.',
    sources: [SOURCE],
    judgment: { prompt: 'Assess whether the body is a focused one to two pages, roughly 200–500 words.' }
  },
  {
    code: 'BODY-9',
    title: 'Noun-phrase title',
    description: 'Title is a short noun phrase, not a question or full sentence.',
    sources: [SOURCE],
    judgment: { prompt: 'Assess whether the title is a short noun phrase rather than a question or full sentence.' }
  },
  {
    code: 'BODY-10',
    title: 'Present-state record',
    description:
      'The record is written as now and carries no historic, superseding, or forward-looking narration. Such content belongs in the ROADMAP or a KB stream, not in a present-state record.',
    sources: [SOURCE],
    judgment: {
      prompt:
        'Assess whether the record states the present decision without historic, superseding, forward-looking, parked, or not-yet-started narration.'
    }
  }
] as const satisfies readonly RubricItem<DecisionRecordsContext>[]

export const [BODY_1, BODY_3, BODY_4, BODY_5, BODY_6, BODY_7, BODY_8, BODY_9, BODY_10] = BODY
