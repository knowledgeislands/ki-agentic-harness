import type { HarnessRubricContext } from '../contexts/harness.ts'
import { HARNESS_PARTS } from '../contexts/harness.ts'
import type { AuditOutcome, ConformOutcome } from '../../vendored/ki-skills/rubric.ts'
import { outcomes, result } from './common.ts'
const LAYOUT_ITEMS = [
  {
    code: 'LAY-1',
    title: 'Five-part directory layout',
    description: 'skills/, agents/, mcp/, evals/, and hooks/ all exist at the harness root.',
    sources: ['standards.md#layout'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (!context.rootExists) return result('VIOLATION', `Harness root does not exist: ${context.root}.`, context.root)
          return outcomes<AuditOutcome>(
            HARNESS_PARTS.map((part) => ({
              status: context.exists(`${part}/`) ? 'PASS' : 'VIOLATION',
              message: 'Required five-part directory is present.',
              subject: `${part}/`
            }))
          )
        }
      },
      conform: {
        phase: 'PREPARE',
        run: (context: HarnessRubricContext) => outcomes<ConformOutcome>(HARNESS_PARTS.flatMap(context.ensurePart))
      }
    }
  },
  {
    code: 'LAY-2',
    title: 'Shelf descriptions',
    description: 'Each five-part directory contains a README.md declaring its purpose and status.',
    sources: ['standards.md#layout'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          outcomes<AuditOutcome>(
            HARNESS_PARTS.map((part) => ({
              status: !context.exists(`${part}/`) ? 'NOT_APPLICABLE' : context.exists(`${part}/README.md`) ? 'PASS' : 'VIOLATION',
              message: !context.exists(`${part}/`) ? 'Harness part is absent.' : 'Required shelf description is present.',
              subject: `${part}/README.md`
            }))
          )
      },
      conform: {
        phase: 'DERIVED',
        run: (context: HarnessRubricContext) => outcomes<ConformOutcome>(HARNESS_PARTS.flatMap(context.ensureShelfReadme))
      }
    }
  },
  {
    code: 'LAY-3',
    title: 'Root Claude orientation',
    description: 'CLAUDE.md exists at the harness root.',
    sources: ['standards.md#claudemd'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(context.exists('CLAUDE.md') ? 'PASS' : 'VIOLATION', 'Required root orientation is present.', 'CLAUDE.md')
      }
    }
  },
  {
    code: 'LAY-4',
    title: 'Root roadmap',
    description: 'ROADMAP.md exists at the harness root.',
    sources: ['standards.md#roadmapmd'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(context.exists('ROADMAP.md') ? 'PASS' : 'VIOLATION', 'Open-work register is present.', 'ROADMAP.md')
      }
    }
  },
  {
    code: 'LAY-5',
    title: 'Root Knowledge Islands configuration',
    description: '.ki-config.toml exists at the harness root.',
    sources: ['standards.md#ki-configtoml'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(context.exists('.ki-config.toml') ? 'PASS' : 'VIOLATION', 'Required KI configuration is present.', '.ki-config.toml')
      }
    }
  }
] as const
export const LAY_1 = LAYOUT_ITEMS[0]
export const LAY_2 = LAYOUT_ITEMS[1]
export const LAY_3 = LAYOUT_ITEMS[2]
export const LAY_4 = LAYOUT_ITEMS[3]
export const LAY_5 = LAYOUT_ITEMS[4]
export const LAYOUT = [LAY_1, LAY_2, LAY_3, LAY_4, LAY_5] as const
