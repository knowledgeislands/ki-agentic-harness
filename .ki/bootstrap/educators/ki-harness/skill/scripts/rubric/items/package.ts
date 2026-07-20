import type { AuditOutcome } from '../../vendored/ki-skills/rubric.ts'
import type { HarnessRubricContext } from '../contexts/harness.ts'
import { hasPackageScript, REQUIRED_HARNESS_SCRIPTS } from '../contexts/harness.ts'
import { outcomes, result } from './common.ts'

const packageMissing = (context: HarnessRubricContext): boolean => !context.exists('package.json')
const PACKAGE_ITEMS = [
  {
    code: 'PKG-1',
    title: 'Project skill delivery script',
    description: 'package.json contains the normal ki:skills:copy:project delivery entry.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(
            packageMissing(context) || !hasPackageScript(context.packageJson, 'ki:skills:copy:project') ? 'VIOLATION' : 'PASS',
            packageMissing(context) ? 'Package manifest is absent — cannot check scripts.' : "Must have a 'ki:skills:copy:project' script.",
            'package.json'
          )
      }
    }
  },
  {
    code: 'PKG-2',
    title: 'Skill audit script',
    description: 'package.json contains the ki:skills:audit quality gate.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          result(
            packageMissing(context) || !hasPackageScript(context.packageJson, 'ki:skills:audit') ? 'VIOLATION' : 'PASS',
            packageMissing(context) ? 'Package manifest is absent — cannot check scripts.' : "Must have a 'ki:skills:audit' script.",
            'package.json'
          )
      }
    }
  },
  {
    code: 'PKG-4',
    title: 'Harness development and evaluation scripts',
    description: 'package.json carries the repository linking, global linking, refresh-status, and evaluation entries.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (packageMissing(context)) return result('NOT_APPLICABLE', 'Package manifest is absent.', 'package.json')
          return outcomes<AuditOutcome>(
            REQUIRED_HARNESS_SCRIPTS.slice(2).map((script) => ({
              status: hasPackageScript(context.packageJson, script) ? 'PASS' : 'VIOLATION',
              message: `Should have a '${script}' script.`,
              subject: 'package.json'
            }))
          )
        }
      }
    }
  },
  {
    code: 'PKG-5',
    title: 'Checker invocation documentation',
    description: 'Governed-repository documentation uses generated .ki checker entry points rather than harness-only package aliases.',
    sources: ['standards.md#packagejson'],
    judgment: {
      prompt: 'Review user-facing documentation and ensure vendored checker invocations are canonical outside harness-only guidance.'
    }
  },
  {
    code: 'PKG-6',
    title: 'Package script target integrity',
    description: 'Every ki:* bun or bunx script target names a file that exists below the harness root.',
    sources: ['standards.md#packagejson'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) => {
          if (packageMissing(context)) return result('NOT_APPLICABLE', 'Package manifest is absent.', 'package.json')
          const scripts = (context.packageJson.scripts as Record<string, string> | undefined) ?? {}
          const missing: AuditOutcome[] = []
          for (const [key, command] of Object.entries(scripts)) {
            if (!key.startsWith('ki:') || typeof command !== 'string') continue
            for (const segment of command.split(/&&|\|\||[;|]/)) {
              const tokens = segment.trim().split(/\s+/)
              for (let index = 0; index < tokens.length - 1; index++) {
                if (tokens[index] !== 'bun' && tokens[index] !== 'bunx') continue
                const argument = tokens[index + 1] as string
                if (
                  argument === 'run' ||
                  argument.startsWith('-') ||
                  !(/\.(ts|tsx|js|mjs|cjs|sh)$/.test(argument) || argument.startsWith('./') || argument.startsWith('.ki/bootstrap/'))
                )
                  continue
                if (!context.exists(argument))
                  missing.push({
                    status: 'VIOLATION',
                    message: `Script '${key}' shells 'bun ${argument}', which does not exist.`,
                    subject: 'package.json'
                  })
              }
            }
          }
          return missing.length > 0
            ? outcomes<AuditOutcome>(missing)
            : result('PASS', 'All ki:* bun script targets resolve to a file.', 'package.json')
        }
      }
    }
  }
] as const

export const PACKAGE_1 = PACKAGE_ITEMS[0]
export const PACKAGE_2 = PACKAGE_ITEMS[1]
export const PACKAGE_4 = PACKAGE_ITEMS[2]
export const PACKAGE_5 = PACKAGE_ITEMS[3]
export const PACKAGE_6 = PACKAGE_ITEMS[4]
export const PACKAGE = [PACKAGE_1, PACKAGE_2, PACKAGE_4, PACKAGE_5, PACKAGE_6] as const
