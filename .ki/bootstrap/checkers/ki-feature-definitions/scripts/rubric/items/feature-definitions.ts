import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { FeatureDefinitionsContext } from '../contexts/feature-definitions.ts'

const SOURCE = ['feature-format.md'] as const
const auditOutcomes = (findings: AuditOutcome[], pass: string): RubricOutcomes<AuditOutcome> => {
  const first = findings[0]
  return first ? [first, ...findings.slice(1)] : [{ status: 'PASS', message: pass }]
}

export const INDEX_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'INDEX-1',
  title: 'docs/features/index.md exists',
  description: '`docs/features/index.md` exists. Missing is a FAIL — there is no registry to validate against.',
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) => [
        context.indexExists
          ? { status: 'PASS', message: 'The Feature Definitions index exists.', subject: 'index.md' }
          : { status: 'VIOLATION', message: 'The Feature Definitions index is missing.', subject: 'index.md' }
      ]
    }
  }
}

export const INDEX_2: RubricItem<FeatureDefinitionsContext> = {
  code: 'INDEX-2',
  title: 'index.md contains a populated areas table',
  description: '`index.md` contains at least one areas table (a table with `Prefix` and `File` columns) with ≥ 1 row. No table is a FAIL.',
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) => [
        !context.indexExists
          ? { status: 'NOT_APPLICABLE', message: 'The areas table cannot be inspected until index.md exists.', subject: 'index.md' }
          : context.prefixToFile.size > 0
            ? { status: 'PASS', message: 'The index contains a populated Prefix and File areas table.', subject: 'index.md' }
            : { status: 'VIOLATION', message: 'No populated areas table with Prefix and File columns was found.', subject: 'index.md' }
      ]
    }
  }
}

export const AREA_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'AREA-1',
  title: 'every file named in an areas table exists',
  description: 'Every file named in an areas table exists on disk. A missing file is a WARN (the table is ahead of the corpus).',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        auditOutcomes(
          context.registeredMissingFiles.map(({ prefix, file }) => ({
            status: 'VIOLATION',
            message: `The areas table lists ${file} for prefix ${prefix}, but the file is missing.`,
            subject: 'index.md'
          })),
          'Every file registered by the areas table exists.'
        )
    }
  }
}

export const AREA_2: RubricItem<FeatureDefinitionsContext> = {
  code: 'AREA-2',
  title: 'every area file is registered',
  description:
    'Every `*.md` in `docs/features/` (except `index.md`) is registered under at least one prefix in an areas table. An unregistered file is a WARN.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        auditOutcomes(
          context.unregisteredFiles.map((file) => ({
            status: 'VIOLATION',
            message: 'The area file is not registered in the index.md areas table.',
            subject: file
          })),
          'Every area file is registered by the areas table.'
        )
    }
  }
}

const auditId1 = (context: FeatureDefinitionsContext): RubricOutcomes<AuditOutcome> =>
  auditOutcomes(
    context.headingIssues.map((issue) => ({
      status: 'VIOLATION',
      message: `Level-3 heading is not a valid requirement ID: “${issue.heading}”.`,
      subject: issue.file
    })),
    'Every level-3 heading outside Gaps has canonical requirement-ID form.'
  )

const conformId1 = (context: FeatureDefinitionsContext): RubricOutcomes<ConformOutcome> => {
  const fixed = context.normaliseHeadings()
  const outcomes: ConformOutcome[] = [
    ...fixed.map((issue) => ({
      status: 'FIXED' as const,
      message: `${context.dryRun ? 'Would normalise' : 'Normalised'} the requirement-heading separator to “ — ”.`,
      subject: issue.file
    })),
    ...context.headingIssues
      .filter((issue) => !issue.canonical)
      .map((issue) => ({
        status: 'VIOLATION' as const,
        message: `Level-3 heading requires manual repair: “${issue.heading}”.`,
        subject: issue.file
      }))
  ]
  const first = outcomes[0]
  return first ? [first, ...outcomes.slice(1)] : [{ status: 'PASS', message: 'Requirement headings are canonical.' }]
}

export const ID_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'ID-1',
  title: 'requirement headings use canonical IDs',
  description:
    'Every level-3 heading outside a `## Gaps …` section matches `### <PREFIX>-NNN — <title>` (multi-segment uppercase prefix, ≥ 3-digit serial, em-dash separator). A non-conforming H3 is a FAIL.',
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    audit: { phase: 'INSPECT', run: auditId1 },
    conform: { phase: 'NORMALISE', run: conformId1 }
  }
}

export const ID_2: RubricItem<FeatureDefinitionsContext> = {
  code: 'ID-2',
  title: 'requirement prefixes are registered to their file',
  description:
    "Each requirement's prefix is registered in an areas table, and to this file. An unregistered prefix, or a prefix registered to a different file, is a FAIL.",
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        auditOutcomes(
          context.requirements
            .filter((requirement) => requirement.owner !== requirement.file)
            .map((requirement) => ({
              status: 'VIOLATION',
              message: requirement.owner
                ? `${requirement.id} uses prefix ${requirement.prefix}, registered to ${requirement.owner} rather than this file.`
                : `${requirement.id} uses prefix ${requirement.prefix}, which no areas-table row registers.`,
              subject: requirement.file
            })),
          'Every requirement prefix is registered to its containing area file.'
        )
    }
  }
}

export const ID_3: RubricItem<FeatureDefinitionsContext> = {
  code: 'ID-3',
  title: 'requirement IDs are unique across the corpus',
  description: 'IDs are unique across the corpus (append-only, never reused). A duplicate `<PREFIX>-NNN` is a WARN.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        auditOutcomes(
          context.requirements
            .filter((requirement) => requirement.duplicateOf)
            .map((requirement) => ({
              status: 'VIOLATION',
              message: `${requirement.id} is already defined by ${requirement.duplicateOf}; IDs are append-only and never reused.`,
              subject: requirement.file
            })),
          'Requirement IDs are unique across the corpus.'
        )
    }
  }
}

export const REQ_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'REQ-1',
  title: 'requirements carry an RFC-2119 keyword',
  description:
    "Each non-deprecated requirement's body carries an RFC-2119 keyword (`MUST` / `SHOULD` / `MAY` …, uppercase). None is a FAIL — a requirement with no normative verb is not testable.",
  sources: SOURCE,
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        auditOutcomes(
          context.requirements
            .filter((requirement) => !requirement.deprecated && !requirement.hasNormativeKeyword)
            .map((requirement) => ({
              status: 'VIOLATION',
              message: `${requirement.id} has no RFC-2119 keyword in its statement.`,
              subject: requirement.file
            })),
          'Every active requirement carries an RFC-2119 keyword.'
        )
    }
  }
}

export const VERIFY_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'VERIFY-1',
  title: 'requirements carry a Verify hook',
  description: 'Each non-deprecated requirement has a `_Verify:_` line. Missing is a WARN.',
  sources: SOURCE,
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) =>
        auditOutcomes(
          context.requirements
            .filter((requirement) => !requirement.deprecated && !requirement.hasVerify)
            .map((requirement) => ({
              status: 'VIOLATION',
              message: `${requirement.id} has no _Verify:_ line.`,
              subject: requirement.file
            })),
          'Every active requirement carries a _Verify:_ hook.'
        )
    }
  }
}

export const BEHAVIOUR_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'BEHAVIOUR-1',
  title: 'requirements describe behaviour',
  description:
    'The statement describes behaviour, not rationale (that is a DR) or procedure (that is a guide). A requirement that explains why should move the reasoning to a Decision Record and cite it.',
  sources: SOURCE,
  judgment: {
    prompt:
      'The statement describes behaviour, not rationale (that is a DR) or procedure (that is a guide). A requirement that explains why should move the reasoning to a Decision Record and cite it.'
  }
}

export const AS_BUILT_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'AS-BUILT-1',
  title: 'numbered requirements describe the system today',
  description:
    'The numbered requirement is true of the system today. Aspirational or not-yet-built behaviour belongs in `## Gaps`, not in the numbered contract.',
  sources: SOURCE,
  judgment: {
    prompt:
      'The numbered requirement is true of the system today. Aspirational or not-yet-built behaviour belongs in `## Gaps`, not in the numbered contract.'
  }
}

export const VERIFY_2: RubricItem<FeatureDefinitionsContext> = {
  code: 'VERIFY-2',
  title: 'Verify hooks are concrete and checkable',
  description:
    'The `_Verify:_` hook is concrete and checkable — a built-output assertion, a named test, or a linked source symbol — not a restatement of the requirement.',
  sources: SOURCE,
  judgment: {
    prompt:
      'The `_Verify:_` hook is concrete and checkable — a built-output assertion, a named test, or a linked source symbol — not a restatement of the requirement.'
  }
}

export const SPLIT_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'SPLIT-1',
  title: 'unrelated behaviours use separate IDs',
  description: 'A heading that bundles several unrelated behaviours should split into separate IDs so each verifies independently.',
  sources: SOURCE,
  judgment: { prompt: 'A heading that bundles several unrelated behaviours should split into separate IDs so each verifies independently.' }
}

export const DR_LINK_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'DR-LINK-1',
  title: 'governed requirements cite their Decision Record',
  description:
    'A requirement that follows from a recorded decision cites its DR. Absence is not a mechanical failure, but a governed behaviour with no link is a gap in the audit trail from why to what.',
  sources: SOURCE,
  judgment: {
    prompt:
      'A requirement that follows from a recorded decision cites its DR. Absence is not a mechanical failure, but a governed behaviour with no link is a gap in the audit trail from why to what.'
  }
}

export const AREA_FIT_1: RubricItem<FeatureDefinitionsContext> = {
  code: 'AREA-FIT-1',
  title: 'requirements fit their area file',
  description:
    'Each requirement sits in the area file its prefix belongs to; a requirement that has drifted to the wrong area should move (and, if its behaviour changed area, take a new ID in the right prefix rather than moving the number).',
  sources: SOURCE,
  judgment: {
    prompt:
      'Each requirement sits in the area file its prefix belongs to; a requirement that has drifted to the wrong area should move (and, if its behaviour changed area, take a new ID in the right prefix rather than moving the number).'
  }
}
