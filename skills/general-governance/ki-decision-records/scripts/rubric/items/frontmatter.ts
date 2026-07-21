import type { AuditOutcome, RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { outcomes } from './shared.ts'

const SOURCE = 'dr-format.md'

export const FM_0: RubricItem<DecisionRecordsContext> = {
  code: 'FM-0',
  title: 'Decision-record frontmatter',
  description: 'YAML frontmatter block is present on every decision record.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          context.records
            .filter((record) => !record.frontmatter)
            .map((record): AuditOutcome => ({ status: 'VIOLATION', message: 'YAML frontmatter is absent.', subject: record.file })),
          'Every decision record has YAML frontmatter.'
        )
    }
  }
}

export const FM_3: RubricItem<DecisionRecordsContext> = {
  code: 'FM-3',
  title: 'Human-readable record type',
  description: '`type` is the canonical human-readable record type for the filename prefix.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          context.records
            .filter((record) => record.type !== record.expectedType)
            .map(
              (record): AuditOutcome => ({
                status: 'VIOLATION',
                message: `Expected type ${record.expectedType}; found ${record.type ?? '(absent)'}.`,
                subject: record.file
              })
            ),
          'Every decision record declares its canonical human-readable type.'
        )
    }
  }
}

export const FM_4: RubricItem<DecisionRecordsContext> = {
  code: 'FM-4',
  title: 'Decision type metadata',
  description: '`decision_type` field is present.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          context.records
            .filter((record) => !record.decisionType)
            .map(
              (record): AuditOutcome => ({
                status: 'VIOLATION',
                message: '`decision_type` is absent.',
                subject: record.file
              })
            ),
          'Every decision record declares `decision_type`.'
        )
    }
  }
}

export const FM_5: RubricItem<DecisionRecordsContext> = {
  code: 'FM-5',
  title: 'Prefix and decision type alignment',
  description:
    '`decision_type` exactly matches the canonical value encoded by the filename prefix. This makes required KB metadata internally consistent; it does not prove that the prefix is the right semantic classification.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    overrideLevels: ['WARN'],
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) => {
        return outcomes(
          context.records
            .filter((record) => record.decisionType !== record.expectedDecisionType)
            .map(
              (record): AuditOutcome => ({
                status: 'VIOLATION',
                message: `Expected decision_type ${record.expectedDecisionType}; found ${record.decisionType ?? '(absent)'}.`,
                subject: record.file
              })
            ),
          'Every `decision_type` matches the filename prefix.'
        )
      }
    }
  }
}

export const FM_6: RubricItem<DecisionRecordsContext> = {
  code: 'FM-6',
  title: 'Core decision metadata',
  description:
    '`id`, `title`, `date`, `status`, and `type_url` are present; ID and title compose the H1, date uses YYYY-MM-DD, and the URL matches the record prefix.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        outcomes(
          context.records.flatMap((record): AuditOutcome[] => {
            if (record.frontmatterId !== record.id)
              return [{ status: 'VIOLATION', message: '`id` must exactly match the H1 identifier.', subject: record.file }]
            const expectedTitle = record.headingTitle ?? ''
            if (!record.title) return [{ status: 'VIOLATION', message: '`title` is absent.', subject: record.file }]
            if (record.title !== expectedTitle)
              return [{ status: 'VIOLATION', message: '`title` must exactly match the H1 title.', subject: record.file }]
            if (!record.date) return [{ status: 'VIOLATION', message: '`date` is absent.', subject: record.file }]
            if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date))
              return [{ status: 'VIOLATION', message: '`date` must use YYYY-MM-DD.', subject: record.file }]
            if (!record.status) return [{ status: 'VIOLATION', message: '`status` is absent.', subject: record.file }]
            if (record.typeUrl !== record.expectedTypeUrl)
              return [
                {
                  status: 'VIOLATION',
                  message: `Expected type_url ${record.expectedTypeUrl}; found ${record.typeUrl ?? '(absent)'}.`,
                  subject: record.file
                }
              ]
            return []
          }),
          'Every decision record has matching ID and title, YYYY-MM-DD date, maintenance status, and canonical type URL metadata.'
        )
    }
  }
}

export const FM = [FM_0, FM_3, FM_4, FM_5, FM_6] as const satisfies readonly RubricItem<DecisionRecordsContext>[]
