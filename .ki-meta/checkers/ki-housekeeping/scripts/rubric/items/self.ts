import type { AuditOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'
import type { HousekeepingRubricContext } from '../contexts/housekeeping.ts'

const one = <Result>(outcome: Result): RubricOutcomes<Result> => [outcome]
const runtimeExpected = (context: HousekeepingRubricContext): string[] =>
  (context.declaredRuntimes ?? []).filter((runtime) => runtime === 'claude-code' || runtime === 'codex')

const SELF_ITEMS = [
  {
    code: 'SELF-1',
    title: 'Repository-local ki-self payloads',
    description:
      'For every recognised runtime declared by `[ki-repo].supported_runtimes`, the repository contains the `ki-self` payload at that runtime’s discovery path: `.claude/skills/ki-self/SKILL.md` for `claude-code`; `.agents/skills/ki-self/SKILL.md` for `codex`. Missing is a WARN. A symlink or non-regular file is a FAIL.',
    sources: ['standards.md'],
    mechanical: {
      level: 'WARN' as const,
      overrideLevels: ['FAIL' as const],
      audit: {
        phase: 'INSPECT' as const,
        run: (context: HousekeepingRubricContext) => {
          if (!context.declaredRuntimes)
            return one({
              status: 'NOT_APPLICABLE',
              message: 'no declared supported_runtimes — ki-repo owns the required runtime-support contract',
              subject: '.ki-config.toml'
            })
          const outcomes: AuditOutcome[] = []
          for (const runtime of runtimeExpected(context)) {
            const payload = context.runtimePayload(runtime)
            if (!payload || payload.state === 'missing')
              outcomes.push({
                status: 'VIOLATION',
                message: `missing repo-local ki-self payload for declared ${runtime} runtime`,
                subject: payload?.path
              })
            else if (payload.state === 'invalid')
              outcomes.push({
                status: 'VIOLATION',
                level: 'FAIL',
                message: `ki-self payload for declared ${runtime} runtime must be an owned regular file, not a symlink`,
                subject: payload.path
              })
            else
              outcomes.push({
                status: 'PASS',
                message: `repo-local ki-self payload present for declared ${runtime} runtime`,
                subject: payload.path
              })
          }
          return outcomes.length
            ? (outcomes as unknown as RubricOutcomes<AuditOutcome>)
            : one({ status: 'NOT_APPLICABLE', message: 'no recognised runtime declaration to check', subject: '.ki-config.toml' })
        }
      }
    }
  },
  {
    code: 'SELF-2',
    title: 'ki-self payload name',
    description: 'Each present payload declares `name: ki-self`. A mismatch is a FAIL.',
    sources: ['standards.md'],
    mechanical: {
      level: 'FAIL' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (context: HousekeepingRubricContext) => {
          const outcomes: AuditOutcome[] = runtimeExpected(context).flatMap((runtime) => {
            const payload = context.runtimePayload(runtime)
            return payload?.state === 'present'
              ? [
                  {
                    status: /^name:\s*ki-self\s*$/m.test(payload.content ?? '') ? ('PASS' as const) : ('VIOLATION' as const),
                    message: /^name:\s*ki-self\s*$/m.test(payload.content ?? '')
                      ? 'repo-local skill payload declares name: ki-self'
                      : 'repo-local skill payload must declare name: ki-self',
                    subject: payload.path
                  }
                ]
              : []
          })
          return outcomes.length
            ? (outcomes as unknown as RubricOutcomes<AuditOutcome>)
            : one({ status: 'NOT_APPLICABLE', message: 'no present recognised runtime payload to check', subject: 'ki-self' })
        }
      }
    }
  },
  {
    code: 'SELF-3',
    title: 'Runtime payload parity',
    description: 'When several recognised runtimes are declared, their `ki-self` payloads are byte-identical. Drift is a FAIL.',
    sources: ['standards.md'],
    mechanical: {
      level: 'FAIL' as const,
      audit: {
        phase: 'INSPECT' as const,
        run: (context: HousekeepingRubricContext) => {
          const payloads = runtimeExpected(context)
            .map((runtime) => [runtime, context.runtimePayload(runtime)] as const)
            .filter(
              (entry): entry is readonly [string, { path: string; state: 'present'; content?: string }] => entry[1]?.state === 'present'
            )
          if (payloads.length < 2)
            return one({
              status: 'NOT_APPLICABLE',
              message: 'fewer than two present recognised runtime payloads to compare',
              subject: 'ki-self'
            })
          const [firstRuntime, first] = payloads[0]
          const mismatch = payloads.filter(([, payload]) => payload.content !== first.content).map(([runtime]) => runtime)
          return one(
            mismatch.length
              ? {
                  status: 'VIOLATION',
                  message: `runtime payloads differ: ${firstRuntime} is not identical to ${mismatch.join(', ')}`,
                  subject: 'ki-self'
                }
              : {
                  status: 'PASS',
                  message: `runtime payloads are byte-identical: ${payloads.map(([runtime]) => runtime).join(', ')}`,
                  subject: 'ki-self'
                }
          )
        }
      }
    }
  },
  {
    code: 'SELF-4',
    title: 'Local-concerns contract',
    description:
      'The local skill gives its repository an intelligible local-concerns contract: regular work has a repeatable check or procedure; semi-regular human review has a ledger such as `HOUSEKEEPING.md`; one-off work remains on the roadmap; cross-repository patterns graduate to a named shared skill.',
    sources: ['standards.md'],
    judgment: {
      prompt:
        'The local skill gives its repository an intelligible local-concerns contract: regular work has a repeatable check or procedure; semi-regular human review has a ledger such as `HOUSEKEEPING.md`; one-off work remains on the roadmap; cross-repository patterns graduate to a named shared skill.'
    }
  }
] as const

export const SELF_1 = SELF_ITEMS[0]
export const SELF_2 = SELF_ITEMS[1]
export const SELF_3 = SELF_ITEMS[2]
export const SELF_4 = SELF_ITEMS[3]
export const SELF = [SELF_1, SELF_2, SELF_3, SELF_4] as const
