import { judgment, mechanical } from './common.ts'

export const TEST_1 = mechanical(
  'TEST-1',
  'test capability and Vitest profile',
  'Test-capable repos expose bare `test`; a recognised root Vitest config requires the canonical test, coverage, and watch scripts, while no capability is not applicable.',
  'WARN',
  ['FAIL']
)
export const TEST_2 = mechanical(
  'TEST-2',
  'Vitest coverage thresholds',
  'Under the Vitest profile, coverage thresholds are exactly 100% for lines, functions, branches, and statements.',
  'FAIL'
)
export const TEST_3 = mechanical(
  'TEST-3',
  'Vitest test-source exclusion',
  'Under the Vitest profile, coverage excludes `src/**/*.test.ts`.',
  'WARN'
)
export const TEST_4 = mechanical(
  'TEST-4',
  'Vitest monorepo scoping',
  'Under the Vitest profile, workspace repos scope include, exclude, and reportsDirectory to the workspace rather than a flat root.',
  'WARN'
)
export const TEST_5 = mechanical(
  'TEST-5',
  'Vitest coverage command passes',
  'Under the Vitest profile, `bun run test:coverage` exits clean when the companion script exists.',
  'FAIL'
)
export const TEST_6 = judgment(
  'TEST-6',
  'tests are colocated and genuinely complete',
  'Under the Vitest profile, tests are colocated with the source they cover and genuinely reach the 100% bar.',
  'Are tests colocated with their source and does their coverage evidence substantiate the 100% claim?'
)
export const TEST = [TEST_1, TEST_2, TEST_3, TEST_4, TEST_5, TEST_6] as const
