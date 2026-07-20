import type { AuditOutcome, RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { outcomes } from './shared.ts'

const SOURCE = 'dr-format.md'

export const FM_0: RubricItem<DecisionRecordsContext> = {
  code: 'FM-0',
  title: 'Knowledge-base frontmatter',
  description: 'YAML frontmatter block is present in KB repositories; it is optional in code repositories.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        !context.kbMode
          ? ([{ status: 'NOT_APPLICABLE', message: 'Frontmatter is optional in code repositories.' }] as const)
          : outcomes(
              context.records
                .filter((record) => !record.frontmatter)
                .map((record): AuditOutcome => ({ status: 'VIOLATION', message: 'YAML frontmatter is absent.', subject: record.file })),
              'Every KB decision record has YAML frontmatter.'
            )
    }
  }
}

export const FM_3: RubricItem<DecisionRecordsContext> = {
  code: 'FM-3',
  title: 'Decision document type',
  description: '`type` field is `admin/governance/decision`.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context: DecisionRecordsContext) =>
        !context.kbMode
          ? ([{ status: 'NOT_APPLICABLE', message: 'Decision type frontmatter is optional in code repositories.' }] as const)
          : outcomes(
              context.records
                .filter((record) => record.frontmatter && record.type !== 'admin/governance/decision')
                .map(
                  (record): AuditOutcome => ({
                    status: 'VIOLATION',
                    message: '`type` must be `admin/governance/decision`.',
                    subject: record.file
                  })
                ),
              'Every KB decision record declares the canonical document type.'
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
        !context.kbMode
          ? ([{ status: 'NOT_APPLICABLE', message: 'Decision type frontmatter is optional in code repositories.' }] as const)
          : outcomes(
              context.records
                .filter((record) => record.frontmatter && !record.decisionType)
                .map(
                  (record): AuditOutcome => ({
                    status: 'VIOLATION',
                    message: '`decision_type` is absent.',
                    subject: record.file
                  })
                ),
              'Every KB decision record declares `decision_type`.'
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
        const evaluated = context.records.filter((record) => record.decisionType)
        if (evaluated.length === 0) return [{ status: 'NOT_APPLICABLE', message: '`decision_type` is not present on any record.' }] as const
        return outcomes(
          evaluated
            .filter((record) => record.decisionType !== record.expectedType)
            .map(
              (record): AuditOutcome => ({
                status: 'VIOLATION',
                ...(context.kbMode ? {} : { level: 'WARN' as const }),
                message: `Expected decision_type ${record.expectedType}; found ${record.decisionType}.`,
                subject: record.file
              })
            ),
          'Every declared `decision_type` matches the filename prefix.'
        )
      }
    }
  }
}

export const FM = [FM_0, FM_3, FM_4, FM_5] as const satisfies readonly RubricItem<DecisionRecordsContext>[]
