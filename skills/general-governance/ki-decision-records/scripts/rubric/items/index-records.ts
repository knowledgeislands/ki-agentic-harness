import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { outcomes } from './shared.ts'

const SOURCE = 'dr-format.md'

export const INDEX = [
  {
    code: 'INDEX-1',
    title: 'Decision index exists',
    description: 'The index file exists (`Decisions.md` in a KB, `README.md` in a code repository).',
    sources: [SOURCE],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'PREPARE',
        run: (context: DecisionRecordsContext) =>
          [
            {
              status: context.indexExists ? 'PASS' : 'VIOLATION',
              message: 'Required decision index exists.',
              subject: context.indexFile
            }
          ] as const
      }
    }
  },
  {
    code: 'INDEX-2',
    title: 'Exactly one index entry per record',
    description: 'Every decision-record file has exactly one entry in the index list, linked by ID.',
    sources: [SOURCE],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'DERIVED',
        run: (context: DecisionRecordsContext) => {
          if (!context.indexExists)
            return [{ status: 'NOT_APPLICABLE', message: 'The index is absent.', subject: context.indexFile }] as const
          return outcomes(
            context.records
              .filter((record) => (context.indexCounts.get(record.id) ?? 0) !== 1)
              .map(
                (record): AuditOutcome => ({
                  status: 'VIOLATION',
                  message: `Expected exactly one index entry; found ${context.indexCounts.get(record.id) ?? 0}.`,
                  subject: record.id
                })
              ),
            'Every decision record has exactly one index entry.'
          )
        }
      },
      conform: {
        phase: 'DERIVED',
        run: (context: DecisionRecordsContext) => {
          if (!context.indexExists)
            return [{ status: 'NOT_APPLICABLE', message: 'The index is absent.', subject: context.indexFile }] as const
          const fixed = context.appendMissingIndexEntries().map(
            (record): ConformOutcome => ({
              status: 'FIXED',
              message: context.dryRun ? 'Would append missing index entry.' : 'Appended missing index entry.',
              subject: record.id
            })
          )
          const duplicates = context.records
            .filter((record) => (context.indexCounts.get(record.id) ?? 0) > 1)
            .map(
              (record): ConformOutcome => ({
                status: 'VIOLATION',
                message: `Expected exactly one index entry; found ${context.indexCounts.get(record.id) ?? 0}.`,
                subject: record.id
              })
            )
          const results = [...fixed, ...duplicates]
          return (results.length > 0
            ? results
            : [
                { status: 'PASS', message: 'Every decision record has exactly one index entry.' }
              ]) as unknown as RubricOutcomes<ConformOutcome>
        }
      }
    }
  },
  {
    code: 'INDEX-3',
    title: 'No stale index entries',
    description: 'No index entry references a decision-record file that does not exist.',
    sources: [SOURCE],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'DERIVED',
        run: (context: DecisionRecordsContext) => {
          if (!context.indexExists)
            return [{ status: 'NOT_APPLICABLE', message: 'The index is absent.', subject: context.indexFile }] as const
          const ids = new Set(context.records.map((record) => record.id))
          return outcomes(
            context.indexIds
              .filter((id) => !ids.has(id))
              .map(
                (id): AuditOutcome => ({
                  status: 'VIOLATION',
                  message: 'Index entry has no matching decision-record file.',
                  subject: id
                })
              ),
            'Every index entry has a matching decision-record file.'
          )
        }
      }
    }
  },
  {
    code: 'INDEX-6',
    title: 'Reveal order',
    description:
      'Entries are in a sensible reveal order: a from-scratch build narrative with roots first, then dependents, weaving sub-scopes in.',
    sources: [SOURCE],
    judgment: { prompt: 'Assess whether index entries form a sensible from-scratch reveal order with roots before dependents.' }
  },
  {
    code: 'INDEX-7',
    title: 'Index gloss alignment',
    description: "An entry's gloss matches the decision record's heading title, excluding the ID prefix.",
    sources: [SOURCE],
    judgment: { prompt: "Compare every index gloss with its decision record's heading title, excluding the ID prefix." }
  },
  {
    code: 'INDEX-8',
    title: 'Ascending serial reveal order',
    description:
      'Within each prefix, serials ascend in reveal order; a higher serial never precedes a lower serial. A violation is fixed by renumbering rather than reordering out of sequence.',
    sources: [SOURCE],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'DERIVED',
        run: (context: DecisionRecordsContext) =>
          outcomes(
            context.outOfOrderIds.map(
              ({ id, previous }): AuditOutcome => ({
                status: 'VIOLATION',
                message: `Serial appears after ${String(previous).padStart(3, '0')}.`,
                subject: id
              })
            ),
            'Decision-record serials ascend within each prefix in reveal order.'
          )
      }
    }
  }
] as const satisfies readonly RubricItem<DecisionRecordsContext>[]

export const [INDEX_1, INDEX_2, INDEX_3, INDEX_6, INDEX_7, INDEX_8] = INDEX
