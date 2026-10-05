import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectBoundaries, provesBoundaryFailure } from './boundaries.ts'

const temporary: string[] = []
const required = <T>(value: T | undefined): T => {
  if (value === undefined) throw new Error('Expected fixture element is absent.')
  return value
}
afterEach(() => {
  for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true })
})
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-boundary-fixture-'))
  temporary.push(root)
  for (const path of ['src/tests', 'node_modules', 'tooling/boundaries/node_modules/dependency-cruiser'])
    mkdirSync(join(root, path), { recursive: true })
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({
      devDependencies: { 'dependency-cruiser': '^18' },
      scripts: { test: 'vitest run' }
    })
  )
  writeFileSync(
    join(root, 'tooling/boundaries/package.json'),
    JSON.stringify({
      private: true,
      dependencies: { 'dependency-cruiser': '^18', typescript: '^6' }
    })
  )
  writeFileSync(join(root, '.dependency-cruiser.ts'), 'export default {}\n')
  writeFileSync(join(root, 'src/main.ts'), "import type { Value } from './types.ts'\n")
  writeFileSync(join(root, 'src/types.ts'), 'export type Value = string\n')
  writeFileSync(join(root, 'src/tests/boundaries.test.ts'), '// native proof fixture\n')
  return root
}
const configuration = () => ({
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    { name: 'no-unresolvable', severity: 'error', from: {}, to: { couldNotResolve: true } },
    { name: 'domain-does-not-import-cli', severity: 'error', from: { path: '^src/core/' }, to: { path: '^src/cli/' } }
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    doNotFollow: { path: 'node_modules' },
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import'], extensions: ['.ts', '.d.ts'] }
  }
})
const graph = () => ({
  modules: [
    {
      source: 'src/main.ts',
      dependencies: [{ resolved: 'src/types.ts', couldNotResolve: false, dependencyTypes: ['type-only'] }]
    },
    { source: 'src/types.ts', dependencies: [] },
    { source: 'src/tests/boundaries.test.ts', dependencies: [] }
  ],
  summary: { violations: [] }
})
const nativeCruise = () => ({
  ...graph(),
  summary: { violations: [{ rule: { name: 'domain-does-not-import-cli' }, from: 'src/main.ts', to: 'src/types.ts' }] }
})
const report = (failed = false, failure = 'AssertionError: expected [] to contain "domain-does-not-import-cli"') => ({
  success: !failed,
  numTotalTests: 1,
  numPassedTests: failed ? 0 : 1,
  numFailedTests: failed ? 1 : 0,
  numRuntimeErrorTestSuites: 0,
  testResults: [
    {
      assertionResults: [
        {
          fullName: 'rejects deliberate domain crossing',
          status: failed ? 'failed' : 'passed',
          failureMessages: failed ? [failure] : []
        }
      ]
    }
  ]
})
type Result = { status: number; stdout: string; stderr: string }
const result = (value: unknown, status = 0): Result => ({ status, stdout: JSON.stringify(value), stderr: '' })
const runner = (
  overrides: Partial<{
    config: unknown
    transpilers: unknown
    graph: unknown
    clean: Result
    mutated: Result
    observed: boolean
  }> = {}
) => {
  let tests = 0
  return async (_program: string, args: readonly string[], _cwd: string) => {
    if (args[0] === '--eval') return result(overrides.config ?? configuration())
    if (args[0] === '--input-type=module')
      return result(overrides.transpilers ?? [{ name: 'typescript', available: true }])
    if (args.includes('--output-type')) return result(overrides.graph ?? graph())
    tests += 1
    const response =
      tests === 1 ? (overrides.clean ?? result(report())) : (overrides.mutated ?? result(report(true), 1))
    writeFileSync(required(args[args.indexOf('--outputFile') + 1]), response.stdout)
    if (tests === 1 && overrides.observed !== false)
      writeFileSync(join(_cwd, 'reports/native-cruises.jsonl'), `${JSON.stringify(nativeCruise())}\n`)
    return response
  }
}

test('missing rulesets fail product repositories but scripts-only shape stays explicitly unassessed', async () => {
  const root = fixture()
  rmSync(join(root, '.dependency-cruiser.ts'))
  expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('FAIL')
  rmSync(join(root, 'src'), { recursive: true })
  expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('NOT_APPLICABLE')
})

test('an escaping configuration cannot supply active enforcement evidence', async () => {
  const root = fixture()
  const outside = fixture()
  rmSync(join(root, '.dependency-cruiser.ts'))
  symlinkSync(join(outside, '.dependency-cruiser.ts'), join(root, '.dependency-cruiser.ts'))
  expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('FAIL')
})

test('isolated tooling must be private, development-only and limited to its two dependencies', async () => {
  for (const manifest of [
    { private: false, dependencies: { 'dependency-cruiser': '^18', typescript: '^6' } },
    { private: true, dependencies: { 'dependency-cruiser': '^18' } },
    { private: true, dependencies: { 'dependency-cruiser': '^18', typescript: '^6', other: '*' } }
  ]) {
    const root = fixture()
    writeFileSync(join(root, 'tooling/boundaries/package.json'), JSON.stringify(manifest))
    expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('FAIL')
  }
  const root = fixture()
  writeFileSync(join(root, 'package.json'), JSON.stringify({ dependencies: { 'dependency-cruiser': '^18' } }))
  expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('FAIL')
})

test('baseline-only, disabled or type-blind rulesets fail before native proof execution', async () => {
  const cases = [configuration(), configuration(), configuration()]
  required(cases[0]).forbidden.pop()
  required(required(cases[1]).forbidden[0]).severity = 'ignore'
  required(cases[2]).options.tsPreCompilationDeps = false
  for (const config of cases)
    expect((await inspectBoundaries(fixture(), undefined, runner({ config })))[0]?.level).toBe('FAIL')
})

test('narrowed baseline rules cannot masquerade as globally active cycle/resolution enforcement', async () => {
  const config = configuration()
  Object.assign(required(config.forbidden[0]).from, { path: '^never/' })
  expect((await inspectBoundaries(fixture(), undefined, runner({ config })))[0]?.level).toBe('FAIL')
  const filtered = configuration()
  Object.assign(required(filtered.forbidden[1]).to, { pathNot: '.*' })
  expect((await inspectBoundaries(fixture(), undefined, runner({ config: filtered })))[0]?.level).toBe('FAIL')
})

test('alternate product layouts are diagnostic gaps, not scripts-only architecture passes', async () => {
  const root = fixture()
  rmSync(join(root, 'src'), { recursive: true })
  rmSync(join(root, '.dependency-cruiser.ts'))
  writeFileSync(join(root, 'package.json'), JSON.stringify({ bin: 'lib/cli.ts' }))
  expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('FAIL')
})

test('source-root symlinks cannot escape even the read-only inventory', async () => {
  const root = fixture()
  const outside = fixture()
  rmSync(join(root, 'src'), { recursive: true })
  symlinkSync(join(outside, 'src'), join(root, 'src'), 'dir')
  const findings = await inspectBoundaries(root, undefined, runner())
  expect(findings[0]?.level).toBe('FAIL')
  expect(findings[0]?.message).toContain('Source inventory escapes')
})

test('an unavailable transpiler, empty, partial, unresolved or type-blind graph cannot pass', async () => {
  expect(
    (
      await inspectBoundaries(fixture(), undefined, runner({ transpilers: [{ name: 'typescript', available: false }] }))
    )[0]?.level
  ).toBe('FAIL')
  const partial = graph()
  partial.modules.pop()
  const unresolved = graph()
  required(required(unresolved.modules[0]).dependencies[0]).couldNotResolve = true
  const blind = graph()
  required(required(blind.modules[0]).dependencies[0]).dependencyTypes = []
  for (const evidence of [{ modules: [], summary: { violations: [] } }, partial, unresolved, blind])
    expect((await inspectBoundaries(fixture(), undefined, runner({ graph: evidence })))[0]?.level).toBe('FAIL')
})

test('missing native proof and unsupported execution shapes are diagnostic failures', async () => {
  const root = fixture()
  rmSync(join(root, 'src/tests/boundaries.test.ts'))
  expect((await inspectBoundaries(root, undefined, runner()))[0]?.level).toBe('FAIL')
  for (const pkg of [
    { devDependencies: { 'dependency-cruiser': '^18' }, scripts: { test: 'bun test' } },
    { devDependencies: { 'dependency-cruiser': '^18' }, workspaces: ['packages/*'] }
  ]) {
    const workspace = fixture()
    writeFileSync(join(workspace, 'package.json'), JSON.stringify(pkg))
    expect((await inspectBoundaries(workspace, undefined, runner()))[0]?.level).toBe('FAIL')
  }
})

test('native proof rejects zero/skipped tests, surviving mutations and loader or unrelated failures', async () => {
  const noTests = { ...report(), numTotalTests: 0, numPassedTests: 0, testResults: [] }
  const skipped = report()
  skipped.numPassedTests = 0
  required(required(skipped.testResults[0]).assertionResults[0]).status = 'pending'
  for (const clean of [result(noTests), result(skipped), result(report(true), 1)])
    expect((await inspectBoundaries(fixture(), undefined, runner({ clean })))[0]?.level).toBe('FAIL')
  for (const mutated of [
    result(report()),
    result(report(true, 'Cannot find module original.ts'), 1),
    result(report(true, 'AssertionError: expected 2 to equal 3'), 1)
  ])
    expect((await inspectBoundaries(fixture(), undefined, runner({ mutated })))[0]?.level).toBe('FAIL')
})

test('positive and negative proof only mutate the disposable copy and cleanup it', async () => {
  const root = fixture()
  const original = readFileSync(join(root, '.dependency-cruiser.ts'), 'utf8')
  writeFileSync(join(root, '.env'), 'not copied\n')
  const run = runner()
  let snapshot = ''
  let calls = 0
  const findings = await inspectBoundaries(root, undefined, async (program, args, cwd) => {
    if (args[0] === 'run') {
      snapshot = cwd
      calls += 1
      expect(cwd).not.toBe(root)
      expect(() => readFileSync(join(cwd, '.env'))).toThrow()
      if (calls === 2) {
        const source = readFileSync(join(cwd, '.dependency-cruiser.ts'), 'utf8')
        expect(source).toContain('no-circular')
        expect(source).not.toContain('domain-does-not-import-cli')
      }
    }
    return run(program, args, cwd)
  })
  expect(findings[0]?.level).toBe('PASS')
  expect(calls).toBe(2)
  expect(readFileSync(join(root, '.dependency-cruiser.ts'), 'utf8')).toBe(original)
  expect(() => readFileSync(join(snapshot, 'package.json'))).toThrow()
})

test('failure proof needs a named removed rule in a newly failed assertion and no runtime errors', () => {
  const names = ['domain-does-not-import-cli']
  expect(provesBoundaryFailure(report(), report(true), [nativeCruise()], names)).toBe(true)
  expect(
    provesBoundaryFailure(report(), { ...report(true), numRuntimeErrorTestSuites: 1 }, [nativeCruise()], names)
  ).toBe(false)
  const other = report(true)
  required(required(other.testResults[0]).assertionResults[0]).fullName = 'not executed clean'
  expect(provesBoundaryFailure(report(), other, [nativeCruise()], names)).toBe(false)
  expect(
    provesBoundaryFailure(
      report(),
      report(true, 'AssertionError: timed out domain-does-not-import-cli'),
      [nativeCruise()],
      names
    )
  ).toBe(false)
})

test('configuration-presence assertions cannot substitute for an observed resolved native crossing', async () => {
  expect(provesBoundaryFailure(report(), report(true), [], ['domain-does-not-import-cli'])).toBe(false)
  const unresolved = nativeCruise()
  required(required(unresolved.modules[0]).dependencies[0]).couldNotResolve = true
  expect(provesBoundaryFailure(report(), report(true), [unresolved], ['domain-does-not-import-cli'])).toBe(false)
  expect((await inspectBoundaries(fixture(), undefined, runner({ observed: false })))[0]?.level).toBe('FAIL')
})
