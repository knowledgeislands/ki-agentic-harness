import type { RubricItem } from '../../shared/rubric.ts'
import type { PortabilityRubricContext } from '../contexts/contexts.ts'
import { unqualifiedRuntimeAssumptions } from '../contexts/portability.ts'

export const PORT_1: RubricItem<PortabilityRubricContext> = {
  code: 'PORT-1',
  title: 'portable contracts make runtime assumptions explicit',
  description:
    'Portable guidance has no unqualified vendor, runtime, or runtime-home reference. Declare a dedicated runtime-binding skill, use a `Runtime binding` section, attribute source material, or compare multiple runtimes explicitly.',
  sources: ['KI'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        const findings = unqualifiedRuntimeAssumptions(context).map(({ line, reference }) => ({
          status: 'VIOLATION' as const,
          message: `line ${line}: unqualified runtime reference to ${reference} — move it to a Runtime binding section, attribute it as source material, or compare runtimes explicitly`
        }))
        return findings.length > 0
          ? [findings[0] as (typeof findings)[number], ...findings.slice(1)]
          : [{ status: 'PASS', message: 'portable contracts make runtime assumptions explicit' }]
      }
    }
  }
}

export const PORTABILITY = [PORT_1] as const
