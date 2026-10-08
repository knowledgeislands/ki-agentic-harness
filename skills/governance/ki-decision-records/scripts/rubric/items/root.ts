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

const ROOT_3: RubricItem<RootRubricContext> = {
  code: 'ROOT-3',
  title: 'Every record scope belongs to the repository',
  description:
    "Every Decision Record identifier's `<SCOPE>` equals the repository's `[skills.ki-repo].repo_code` or begins with `<repo_code>-` for a sub-domain. There is no exception, including for a record mirrored from another repository.",
  sources: [SOURCE],
  mechanical: {
    level: 'FAIL',
    remediation: {
      class: 'diagnostic',
      guidance:
        'Rename the record under the repository code (`<PREFIX>-<repo_code>-NNN`, or `<PREFIX>-<repo_code>-<SUB>-NNN` for a sub-domain), renumber it into that series, and update its index entry and every citation. A record owned by another repository is cited by its canonical URL rather than copied.'
    },
    audit: {
      phase: 'PREPARE',
      run: (context: RootRubricContext) => {
        const code = context.repoCode
        if (code === undefined)
          return [{ status: 'PASS', message: 'No repo_code is declared, so record scopes are not compared.' }] as const
        return outcomes(
          context.records
            .filter((record) => record.scope !== code && !record.scope.startsWith(`${code}-`))
            .map(
              (record) =>
                ({
                  status: 'VIOLATION',
                  message: `${record.id} has scope ${record.scope}; the scope must be ${code} or begin with ${code}-, for example ${record.prefix}-${code}-NNN.`,
                  subject: record.file
                }) satisfies AuditOutcome
            ),
          `Every record scope is ${code} or begins with ${code}-.`
        )
      }
    }
  }
}

export const ROOT: RubricFamily<DecisionRecordsRubricContext, RootRubricContext> = {
  code: 'ROOT',
  title: 'collection-root checks',
  description:
    'The first Decision Record in every collection adopts the instrument itself, and every record is scoped to the repository code.',
  standard: SOURCE,
  selectContext: (context) => context.root,
  items: [ROOT_1, ROOT_2, ROOT_3]
}
