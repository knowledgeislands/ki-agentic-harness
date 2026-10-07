import type { AuditOutcome, RubricFamily, RubricItem, RubricOutcomes } from '../../shared/rubric.ts'
import type { DecisionRecordsRubricContext, RootRubricContext } from '../contexts/decision-records.ts'

const SOURCE = 'standards-decision-records.md'
const ADOPTION_TITLE = 'Adopting Decision Records'
const ADOPTION_PATTERN = /adopt(?:ing|s)? decision records/i

const outcomes = (values: AuditOutcome[], passMessage: string): RubricOutcomes<AuditOutcome> =>
  (values.length > 0 ? values : [{ status: 'PASS', message: passMessage }]) as RubricOutcomes<AuditOutcome>

const ROOT_1: RubricItem<RootRubricContext> = {
  code: 'ROOT-1',
  title: 'Every collection begins by adopting the instrument',
  description:
    'Every collection begins its index with `GDR-<SCOPE>-001` whose title contains "Adopting Decision Records" (a compound title such as "Adopt decision records and documentation instruments" satisfies it).',
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance: 'Create or retitle the collection root with a human review of its record identity and contents.'
    },
    audit: {
      phase: 'PREPARE',
      run: (context: RootRubricContext) => {
        const firstId = context.indexIds[0]
        const first = firstId ? context.records.find((record) => record.id === firstId) : undefined
        if (!first || !/^GDR-[A-Z0-9]*[A-Z][A-Z0-9]*(?:-[A-Z0-9]*[A-Z][A-Z0-9]*)*-001$/.test(first.id))
          return [
            {
              status: 'VIOLATION',
              message: 'A collection must begin its index with GDR-<SCOPE>-001: Adopting Decision Records.',
              subject: context.indexFile
            }
          ] as const
        return outcomes(
          ADOPTION_PATTERN.test(first.headingTitle ?? '')
            ? []
            : [
                {
                  status: 'VIOLATION',
                  message: `The adoption root title must contain "${ADOPTION_TITLE}".`,
                  subject: first.file
                } satisfies AuditOutcome
              ],
          'The collection begins with its Decision Records adoption root.'
        )
      }
    }
  }
}

const ROOT_2: RubricItem<RootRubricContext> = {
  code: 'ROOT-2',
  title: 'The scope is the repository code',
  description:
    "The `<SCOPE>` comes from the repository's `[skills.ki-repo].repo_code`, so `.ki.toml` declares no `[skills.ki-decision-records].scope`.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Remove `scope` from `[skills.ki-decision-records]` in `.ki.toml`. The scope is always `[skills.ki-repo].repo_code`; where existing records use another scope, rename them with a human review.'
    },
    audit: {
      phase: 'PREPARE',
      run: (context: RootRubricContext) =>
        outcomes(
          context.declaredScope === undefined
            ? []
            : [
                {
                  status: 'VIOLATION',
                  message: `[skills.ki-decision-records].scope = "${context.declaredScope}" is retired; the scope is always repo_code.`,
                  subject: '.ki.toml'
                } satisfies AuditOutcome
              ],
          'No retired Decision Record scope is declared.'
        )
    }
  }
}

export const ROOT: RubricFamily<DecisionRecordsRubricContext, RootRubricContext> = {
  code: 'ROOT',
  title: 'collection-root checks',
  description: 'The first Decision Record in every collection adopts the instrument itself, under the repository code.',
  standard: SOURCE,
  selectContext: (context) => context.root,
  items: [ROOT_1, ROOT_2]
}
