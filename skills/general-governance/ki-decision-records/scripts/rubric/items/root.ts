import type { AuditOutcome, RubricItem } from '../../vendored/ki-skills/rubric.ts'
import type { DecisionRecordsContext } from '../contexts/decision-records.ts'
import { outcomes } from './shared.ts'

const SOURCE = 'dr-format.md'
const ADOPTION_TITLE = 'Adopting Decision Records'

export const ROOT_1: RubricItem<DecisionRecordsContext> = {
  code: 'ROOT-1',
  title: 'Adoption root for a new collection',
  description:
    'An index marked `<!-- ki-decision-records: adoption-root -->` begins with `GDR-<SCOPE>-001: Adopting Decision Records`. Existing unmarked collections are migration cases and are not rewritten automatically.',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'PREPARE',
      run: (context: DecisionRecordsContext) => {
        if (!context.adoptionRootRequired)
          return [
            {
              status: 'NOT_APPLICABLE',
              message: 'No adoption-root marker: established collections remain migration cases.',
              subject: context.indexFile
            }
          ] as const

        const firstId = context.indexIds[0]
        const first = firstId ? context.records.find((record) => record.id === firstId) : undefined
        if (!first || !/^GDR-[A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*-001$/.test(first.id))
          return [
            {
              status: 'VIOLATION',
              message: 'A new collection must begin its index with GDR-<SCOPE>-001: Adopting Decision Records.',
              subject: context.indexFile
            }
          ] as const
        return outcomes(
          first.headingTitle === ADOPTION_TITLE
            ? []
            : [
                {
                  status: 'VIOLATION',
                  message: `The adoption root title must be "${ADOPTION_TITLE}".`,
                  subject: first.file
                } satisfies AuditOutcome
              ],
          'The marked collection begins with its canonical Decision Records adoption root.'
        )
      }
    }
  }
}

export const ROOT = [ROOT_1] as const satisfies readonly RubricItem<DecisionRecordsContext>[]
