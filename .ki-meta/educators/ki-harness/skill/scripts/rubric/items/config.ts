import type { HarnessRubricContext } from '../contexts/harness.ts'
import { hasTomlTable } from '../contexts/harness.ts'
import { result } from './common.ts'

const CONFIG_ITEMS = [
  {
    code: 'CONFIG-1',
    title: 'Harness declaration',
    description: '.ki-config.toml contains a ki-harness root table.',
    sources: ['standards.md#ki-configtoml'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          context.config === null
            ? result('NOT_APPLICABLE', 'KI configuration is absent — skipping table checks.', '.ki-config.toml')
            : result(
                hasTomlTable(context.config, 'ki-harness') ? 'PASS' : 'VIOLATION',
                'Must have a [ki-harness] table.',
                '.ki-config.toml'
              )
      },
      conform: { phase: 'PRIMARY', run: (context: HarnessRubricContext) => context.ensureHarnessConfig() }
    }
  },
  {
    code: 'CONFIG-2',
    title: 'Repository governance declaration',
    description: '.ki-config.toml contains a ki-repo root table.',
    sources: ['standards.md#ki-configtoml'],
    mechanical: {
      level: 'WARN',
      audit: {
        phase: 'INSPECT',
        run: (context: HarnessRubricContext) =>
          context.config === null
            ? result('NOT_APPLICABLE', 'KI configuration is absent.', '.ki-config.toml')
            : result(hasTomlTable(context.config, 'ki-repo') ? 'PASS' : 'VIOLATION', 'Should have a [ki-repo] table.', '.ki-config.toml')
      }
    }
  },
  {
    code: 'CONFIG-3',
    title: 'Skill governance declaration',
    description: 'A populated skills/ directory is declared through ki-skills.',
    sources: ['standards.md#ki-configtoml'],
    judgment: { prompt: 'When skills/ is populated, verify that .ki-config.toml declares the ki-skills governance root.' }
  }
] as const
export const CONFIG_1 = CONFIG_ITEMS[0]
export const CONFIG_2 = CONFIG_ITEMS[1]
export const CONFIG_3 = CONFIG_ITEMS[2]
export const CONFIG = [CONFIG_1, CONFIG_2, CONFIG_3] as const
