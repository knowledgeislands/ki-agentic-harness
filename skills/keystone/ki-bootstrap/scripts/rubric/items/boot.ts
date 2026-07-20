import type { AuditOutcome, ConformOutcome, RubricItem, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { BootstrapPublication, BootstrapRubricContext } from '../contexts/bootstrap.ts'

type BootstrapCode = `BOOT-${number}`

const projectAudit = (context: BootstrapRubricContext, code: BootstrapCode): RubricOutcomes<AuditOutcome> => {
  if (code === 'BOOT-1' && context.projectInspectionError)
    return [
      {
        status: 'VIOLATION',
        level: 'FAIL',
        message: context.projectInspectionError,
        subject: '.ki-config.toml'
      }
    ]
  const violations = context.projectChecks.filter((check) => check.code === code && check.level !== 'PASS')
  const outcomes = violations.map((check) => ({
    status: 'VIOLATION' as const,
    level: check.level === 'FAIL' ? ('FAIL' as const) : ('WARN' as const),
    message: check.message,
    subject: check.subject
  }))
  const [first, ...rest] = outcomes
  return first ? [first, ...rest] : [{ status: 'PASS', message: `${code} project-local payload contract is satisfied` }]
}

const projectConform = (
  context: BootstrapRubricContext,
  code: 'BOOT-1' | 'BOOT-3' | 'BOOT-6' | 'BOOT-8'
): RubricOutcomes<ConformOutcome> => {
  const publication: BootstrapPublication = context.publishProjectSkills()
  const before = publication.before.filter((check) => check.code === code && check.level !== 'PASS')
  const after = publication.after.filter((check) => check.code === code && check.level !== 'PASS')
  if (publication.status !== 0) {
    const message = publication.error ?? 'project skill publisher exited non-zero'
    return [{ status: 'VIOLATION', ...(code === 'BOOT-1' ? { level: 'FAIL' as const } : {}), message }]
  }
  if (publication.dryRun && before.length > 0)
    return [{ status: 'FIXED', message: `would reconcile ${before.length} ${code} finding${before.length === 1 ? '' : 's'} (dry run)` }]
  if (after.length > 0) {
    const outcomes = after.map((check) => ({
      status: 'VIOLATION' as const,
      level: check.level === 'FAIL' ? ('FAIL' as const) : ('WARN' as const),
      message: check.message,
      subject: check.subject
    }))
    const [first, ...rest] = outcomes
    if (first) return [first, ...rest]
  }
  if (before.length > 0)
    return [{ status: 'FIXED', message: `reconciled ${before.length} ${code} finding${before.length === 1 ? '' : 's'}` }]
  return [{ status: 'PASS', message: `${code} project-local payload contract was already satisfied` }]
}

export const BOOT_1: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-1',
  title: 'runtime skill directories mirror declared coverage',
  description:
    "For each declared runtime, the project-local skills directory mirrors the repository's declared coverage. Ordinary repositories receive complete generated regular-file copies; a harness links its own canonical source skills. Missing, extra, invalidly linked, or source-drifted payloads are WARN; an unresolvable declaration or dependency is FAIL and must be reconciled by hand. A valid committed `ki-self` skill is preserved as the local-governance exception.",
  sources: ['[KR]', '[AH]', '[ADR-KI-HARNESS-007]'],
  mechanical: {
    level: 'WARN',
    overrideLevels: ['FAIL'],
    audit: { phase: 'INSPECT', run: (context) => projectAudit(context, 'BOOT-1') },
    conform: { phase: 'PRIMARY', run: (context) => projectConform(context, 'BOOT-1') }
  }
}

export const BOOT_3: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-3',
  title: 'runtime skill directories are gitignored',
  description:
    "Each declared runtime's project-local skills directory is gitignored because its published payloads are generated and never committed. CONFORM writes the recognised trailing-slash entry and creates `.gitignore` when needed.",
  sources: ['[KR]', '[KH]'],
  mechanical: {
    level: 'WARN',
    audit: { phase: 'INSPECT', run: (context) => projectAudit(context, 'BOOT-3') },
    conform: { phase: 'PRIMARY', run: (context) => projectConform(context, 'BOOT-3') }
  }
}

export const BOOT_4: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-4',
  title: 'declared governance coverage is correct for the repository',
  description:
    "The repository opts into the skills it actually uses. This is `ki-repo`'s coverage cascade rather than a bootstrap mutation; wrong declarations are corrected through that owner rather than by hand-linking.",
  sources: ['[KR]'],
  judgment: {
    prompt: 'Does the repository declare the governance skills its actual artifacts and responsibilities require?'
  }
}

export const BOOT_6: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-6',
  title: 'governance agent directories mirror the declared agent set',
  description:
    "Each supported runtime's governance agent directory mirrors the available governance agents when the repository declares `[ki-agents]`, and is empty otherwise, with no missing, extra, or dangling managed links.",
  sources: ['[KH]'],
  mechanical: {
    level: 'WARN',
    audit: { phase: 'INSPECT', run: (context) => projectAudit(context, 'BOOT-6') },
    conform: { phase: 'PRIMARY', run: (context) => projectConform(context, 'BOOT-6') }
  }
}

export const BOOT_8: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-8',
  title: 'governance agent directories are gitignored',
  description:
    "Each supported runtime's generated governance agent directory is gitignored when applicable, because managed agent links are regenerated rather than committed.",
  sources: ['[KH]'],
  mechanical: {
    level: 'WARN',
    audit: { phase: 'INSPECT', run: (context) => projectAudit(context, 'BOOT-8') },
    conform: { phase: 'PRIMARY', run: (context) => projectConform(context, 'BOOT-8') }
  }
}

export const BOOT_9: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-9',
  title: 'vendored checker set matches the resolved governance set',
  description:
    '`.ki-meta/checkers/` mirrors the explicitly declared, resolvable checker-bearing governance set with no injected baseline. Missing or extra generated checkers and a retired `.ki-meta/skills/` tree are WARN; missing dependencies or unresolvable declarations are FAIL and are never guessed or renamed mechanically.',
  sources: ['[KR]', '[AH]', '[ADR-KI-HARNESS-006]'],
  mechanical: {
    level: 'WARN',
    overrideLevels: ['FAIL'],
    audit: {
      phase: 'INSPECT',
      run: ({ vendor }) => {
        if (vendor.resolutionError)
          return [
            {
              status: 'VIOLATION',
              level: 'FAIL',
              message: `${vendor.resolutionError} — reconcile .ki-config.toml before re-vendoring`,
              subject: '.ki-config.toml'
            }
          ]
        const outcomes: AuditOutcome[] = []
        if (vendor.retiredPayload)
          outcomes.push({
            status: 'VIOLATION',
            message: 'retired `.ki-meta/skills/` payload is present — re-run EDUCATE to migrate it safely',
            subject: '.ki-meta/skills'
          })
        const missing = vendor.expectedCheckers.filter((skill) => !vendor.actualCheckers.includes(skill))
        const extra = vendor.actualCheckers.filter((skill) => !vendor.expectedCheckers.includes(skill))
        if (missing.length)
          outcomes.push({
            status: 'VIOLATION',
            message: `missing checker payloads: ${missing.join(', ')} — re-run EDUCATE`,
            subject: '.ki-meta/checkers'
          })
        if (extra.length)
          outcomes.push({
            status: 'VIOLATION',
            message: `checker payloads are no longer expected: ${extra.join(', ')} — re-run EDUCATE to prune them`,
            subject: '.ki-meta/checkers'
          })
        if (outcomes.length === 0) {
          if (vendor.expectedCheckers.length === 0 && vendor.actualCheckers.length === 0)
            return [{ status: 'NOT_APPLICABLE', message: 'no vendored checkers are selected or present' }]
          return [
            {
              status: 'PASS',
              message: `vendored checker set matches the resolved set (${vendor.expectedCheckers.length} skills)`,
              subject: '.ki-meta/checkers'
            }
          ]
        }
        const [first, ...rest] = outcomes
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'vendored checker set matches the resolved set' }]
      }
    }
  }
}

export const BOOT_11: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-11',
  title: 'direct vendored checker units match canonical source bytes',
  description:
    'When the target carries matching canonical skill sources, every direct file-kind AUDIT and CONFORM unit in `.ki-meta/checkers/` is a regular file matching its canonical source byte-for-byte. Drift is a commit-blocking FAIL repaired by restoring source and re-running EDUCATE; a bootstrapped-only target reports NOT_APPLICABLE.',
  sources: ['[AH]', '[ADR-KI-HARNESS-006]'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ vendor }) => {
        if (vendor.resolutionError)
          return [{ status: 'NOT_APPLICABLE', message: 'the resolved set is invalid, so source-copy comparison cannot run' }]
        if (vendor.checkedSourceCopies === 0)
          return [{ status: 'NOT_APPLICABLE', message: 'canonical skill sources are not present in the target' }]
        if (vendor.driftedSourceCopies.length)
          return [
            {
              status: 'VIOLATION',
              message: `canonical source/vendor mismatch: ${vendor.driftedSourceCopies.join(', ')}`,
              subject: '.ki-meta/checkers'
            }
          ]
        return [
          {
            status: 'PASS',
            message: `${vendor.checkedSourceCopies} direct file-kind vendor units match canonical source byte-for-byte`,
            subject: '.ki-meta/checkers'
          }
        ]
      }
    }
  }
}

export const BOOT_12: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-12',
  title: 'educator payloads match the resolved governance set',
  description:
    '`.ki-meta/educators/` contains one regular, non-symlinked target-local EDUCATE launcher for every resolved skill declaring `educate`, with no missing, extra, or unsafe payloads. EDUCATE restores or prunes this generated surface.',
  sources: ['[AH]', '[ADR-KI-HARNESS-006]'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: ({ vendor }) => {
        if (vendor.resolutionError)
          return [{ status: 'NOT_APPLICABLE', message: 'the resolved set is invalid, so educator comparison cannot run' }]
        const missing = vendor.expectedEducators.filter((skill) => !vendor.actualEducators.includes(skill))
        const extra = vendor.actualEducators.filter((skill) => !vendor.expectedEducators.includes(skill))
        const outcomes: AuditOutcome[] = []
        if (missing.length)
          outcomes.push({ status: 'VIOLATION', message: `missing educator payloads: ${missing.join(', ')}`, subject: '.ki-meta/educators' })
        if (extra.length)
          outcomes.push({
            status: 'VIOLATION',
            message: `educator payloads are no longer expected: ${extra.join(', ')}`,
            subject: '.ki-meta/educators'
          })
        if (vendor.unsafeEducators.length)
          outcomes.push({
            status: 'VIOLATION',
            message: `unsafe educator payloads: ${vendor.unsafeEducators.join(', ')}`,
            subject: '.ki-meta/educators'
          })
        if (outcomes.length === 0)
          return [
            {
              status: 'PASS',
              message: `educator payload set matches the resolved set (${vendor.expectedEducators.length} skills)`,
              subject: '.ki-meta/educators'
            }
          ]
        const [first, ...rest] = outcomes
        return first ? [first, ...rest] : [{ status: 'PASS', message: 'educator payload set matches the resolved set' }]
      }
    }
  }
}

export const BOOT_13: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-13',
  title: 'source harness shared payloads are declared canonical links',
  description:
    'A source harness has no copied or undeclared payload beneath canonical `skills/**/scripts/vendored/`: every payload is declared by `ki-shared-dependencies` and resolves as a link to its provider. This source-only rule never applies to deliberately self-contained `.ki-meta/` copies or ordinary repository payloads.',
  sources: ['[AH]', '[ADR-KI-HARNESS-006]'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: ({ sourceSharedModules }) => {
        if (!sourceSharedModules.applicable)
          return [{ status: 'NOT_APPLICABLE', message: 'target is not a source harness with canonical skills' }]
        if (sourceSharedModules.error)
          return [
            {
              status: 'VIOLATION',
              message: `${sourceSharedModules.error} — reconcile source-vendored payloads through their shared-module declarations`,
              subject: 'skills'
            }
          ]
        return [{ status: 'PASS', message: 'source-vendored shared payloads are declared canonical links', subject: 'skills' }]
      }
    }
  }
}

export const BOOT_10: RubricItem<BootstrapRubricContext> = {
  code: 'BOOT-10',
  title: "aggregate governance includes each governed skill's judgment criteria",
  description:
    "Whenever vendored checkers are present, AUDIT and CONFORM apply each governed skill's judgment criteria after the mechanical aggregate, using a matching governance lead where one exists and the generated readable rubric otherwise. The mechanical checker reports this work only through the unevaluated judgment count.",
  sources: ['[KS]', '[ADR-KI-HARNESS-SKILLS-001]', '[ADR-KI-HARNESS-SKILLS-010]'],
  judgment: {
    prompt: "Did the aggregate review apply every governed skill's judgment criteria as well as its mechanical checker output?"
  }
}

export const BOOT = [BOOT_1, BOOT_3, BOOT_4, BOOT_6, BOOT_8, BOOT_9, BOOT_11, BOOT_12, BOOT_13, BOOT_10] as const
