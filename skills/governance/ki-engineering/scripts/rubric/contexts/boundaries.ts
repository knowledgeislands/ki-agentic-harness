import { execFile } from 'node:child_process'
import { chmod, cp, mkdir, mkdtemp, readdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import type { RubricEmitter } from '../../shared/rubric.ts'
import type { EngineeringEvidenceFinding } from './audit-evidence.ts'

const execute = promisify(execFile)
const configuration = '.dependency-cruiser.ts'
const tooling = 'tooling/boundaries'
const toolingManifest = 'tooling/boundaries/package.json'
const installedChecker = `${tooling}/node_modules/dependency-cruiser`
export const BOUNDARY_INSTALL = `bun install --frozen-lockfile --cwd ${tooling}`
const baselineRules = ['no-circular', 'no-unresolvable']
// A loaded CI runner needs headroom, but a hung checker must not hold audit indefinitely.
const timeout = 120_000
const maxBuffer = 8 * 1024 * 1024

type CommandResult = { status: number; stdout: string; stderr: string }
type Command = (program: string, args: readonly string[], cwd: string) => Promise<CommandResult>
const command: Command = async (program, args, cwd) => {
  try {
    const result = await execute(program, [...args], { cwd, timeout, maxBuffer, encoding: 'utf8' })
    return { status: 0, stdout: result.stdout, stderr: result.stderr }
  } catch (error) {
    const result = error as { code?: number; killed?: boolean; stdout?: string; stderr?: string }
    if (typeof result.code !== 'number' || result.killed) throw error
    return { status: result.code, stdout: result.stdout ?? '', stderr: result.stderr ?? '' }
  }
}

type Rule = { name: string; severity?: string; from?: Record<string, unknown>; to?: Record<string, unknown> }
type Configuration = {
  forbidden: Rule[]
  options?: {
    tsPreCompilationDeps?: boolean
    tsConfig?: { fileName?: string }
    doNotFollow?: { path?: string }
    enhancedResolveOptions?: { exportsFields?: string[]; conditionNames?: string[]; extensions?: string[] }
  }
}
type Graph = {
  modules: {
    source: string
    dependencies: { resolved: string; couldNotResolve?: boolean; dependencyTypes?: string[] }[]
  }[]
  summary: { violations: { rule: { name: string }; from: string; to: string }[] }
}
type Assertion = { fullName: string; status: string; failureMessages?: string[] }
type TestReport = {
  success: boolean
  numTotalTests: number
  numPassedTests: number
  numFailedTests: number
  numRuntimeErrorTestSuites?: number
  testResults: { status?: string; message?: string; assertionResults: Assertion[] }[]
}

/** Structural JSON alone is not proof: both runs must contain actual executed assertions. */
export const provesBoundaryFailure = (
  clean: TestReport,
  mutated: TestReport,
  nativeCruises: readonly Graph[],
  removedRules: readonly string[]
): boolean => {
  if (!clean.success || clean.numTotalTests < 1 || clean.numFailedTests || clean.numPassedTests < 1) return false
  if (mutated.success || !mutated.numFailedTests || mutated.numRuntimeErrorTestSuites) return false
  if (
    mutated.testResults.some(
      (suite) =>
        suite.message?.trim() ||
        (suite.status === 'failed' && !suite.assertionResults.some((assertion) => assertion.status === 'failed'))
    )
  )
    return false
  const passed = new Set(
    clean.testResults
      .flatMap((suite) => suite.assertionResults)
      .filter((assertion) => assertion.status === 'passed')
      .map((assertion) => assertion.fullName)
  )
  const observedRules = new Set(
    nativeCruises.flatMap((graph) =>
      graph.summary.violations
        .filter(
          (violation) =>
            removedRules.includes(violation.rule.name) &&
            graph.modules.some(
              (module) =>
                module.source === violation.from &&
                module.dependencies.some((edge) => edge.resolved === violation.to && edge.couldNotResolve === false)
            )
        )
        .map((violation) => violation.rule.name)
    )
  )
  return mutated.testResults
    .flatMap((suite) => suite.assertionResults)
    .some((assertion) => {
      const failures = assertion.failureMessages?.join('\n') ?? ''
      return (
        assertion.status === 'failed' &&
        passed.has(assertion.fullName) &&
        /AssertionError|expected .* to /is.test(failures) &&
        [...observedRules].some((name) => failures.includes(name)) &&
        !/timed?\s*out|timeout|cannot find|failed to (?:load|resolve)|syntaxerror/i.test(failures)
      )
    })
}

const contained = (root: string, path: string): boolean => {
  const relation = relative(root, path)
  return relation !== '..' && !relation.startsWith(`..${sep}`) && !isAbsolute(relation)
}

const regularFiles = async (root: string, path: string): Promise<string[]> => {
  const files: string[] = []
  try {
    if (!contained(root, await realpath(join(root, path))))
      throw new Error(`Source inventory escapes the repository: ${path}.`)
    for (const entry of await readdir(join(root, path), { withFileTypes: true })) {
      if (entry.isSymbolicLink() || entry.name === 'node_modules' || entry.name === 'generated') continue
      const child = join(path, entry.name)
      if (entry.isDirectory()) files.push(...(await regularFiles(root, child)))
      else if (entry.isFile()) files.push(child)
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  return files
}

const readJson = async (path: string): Promise<Record<string, unknown>> => JSON.parse(await readFile(path, 'utf8'))

type Member = { path: string; scripts?: Record<string, unknown> }

/** Expands literal and single-level `dir/*` workspace patterns; any other glob is an unsupported shape, not a pass. */
const workspaceMembers = async (root: string, patterns: unknown): Promise<Member[]> => {
  if (!Array.isArray(patterns) || !patterns.every((pattern) => typeof pattern === 'string'))
    throw new Error('Workspace boundary execution supports only a package.json workspaces array.')
  const members: Member[] = []
  for (const pattern of patterns as string[]) {
    const parent = pattern.endsWith('/*') ? pattern.slice(0, -2) : undefined
    if (/[*?[\]{}!]/.test(parent ?? pattern))
      throw new Error(`Workspace pattern ${pattern} needs a native proof adapter.`)
    let candidates = [pattern]
    if (parent !== undefined) {
      try {
        candidates = (await readdir(join(root, parent), { withFileTypes: true }))
          // A linked member is still a member: containment below rejects one that escapes.
          .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
          .map((entry) => join(parent, entry.name))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        candidates = []
      }
    }
    for (const path of candidates) {
      if (!contained(root, await realpath(join(root, path))))
        throw new Error(`Workspace member escapes the repository: ${path}.`)
      try {
        const manifest = await readJson(join(root, path, 'package.json'))
        members.push({ path, scripts: manifest.scripts as Record<string, unknown> | undefined })
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      }
    }
  }
  return members
}

const implementation = /(?<!\.d)\.[cm]?[jt]sx?$/
const relativeTypeImport = /^\s*(?:import|export)\s+type\b[^;]*?\bfrom\s*['"]\.\.?\//m

/** Read-only target inspection; destructive mutations are confined to a fresh private snapshot. */
export const inspectBoundaries = async (
  repository: string,
  emit?: RubricEmitter,
  run: Command = command
): Promise<readonly EngineeringEvidenceFinding[]> => {
  const finding = (level: EngineeringEvidenceFinding['level'], message: string): EngineeringEvidenceFinding => ({
    code: 'DESIGN-2',
    level,
    message,
    subject: configuration
  })
  let snapshot: string | undefined
  try {
    const root = await realpath(repository)
    let pkg: Record<string, unknown>
    try {
      pkg = await readJson(join(root, 'package.json'))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT')
        return [finding('NOT_APPLICABLE', 'No package.json; this TypeScript/Bun boundary adapter does not apply.')]
      throw error
    }
    // A workspace graph is proved per member: each member's src and scripts are source roots beside the root src.
    const members = pkg.workspaces === undefined ? [] : await workspaceMembers(root, pkg.workspaces)
    const roots = ['src', ...members.flatMap((member) => [join(member.path, 'src'), join(member.path, 'scripts')])]
    const inventory = await Promise.all(roots.map((path) => regularFiles(root, path)))
    const sourceRoots = roots.filter((_, index) => inventory[index]?.length)
    const sources = inventory.flat().filter((path) => /\.[cm]?[jt]sx?$/.test(path))
    let configExists = false
    try {
      configExists = contained(root, await realpath(join(root, configuration)))
    } catch {
      /* Missing is diagnosed below. */
    }
    const productSurface =
      ['main', 'module', 'bin', 'exports'].some((field) => pkg[field] !== undefined) ||
      Boolean((pkg.scripts as Record<string, unknown> | undefined)?.build)
    // A member is JavaScript/TypeScript product only if its tree holds implementation, wherever it sits; a
    // declaration shim beside another language's code is not a graph this adapter can prove.
    const memberTrees = await Promise.all(members.map((member) => regularFiles(root, member.path)))
    const implemented = [...sources, ...memberTrees.flat().filter((path) => !/(^|\/)dist\//.test(path))].some((path) =>
      implementation.test(path)
    )
    if (!configExists && !implemented && !productSurface)
      return [
        finding(
          'NOT_APPLICABLE',
          'No JavaScript or TypeScript product source tree or boundary configuration; scripts-only or other-language boundary choices remain judgment.'
        )
      ]
    if (!configExists)
      return [
        finding(
          'FAIL',
          'Product source, entrypoints, build or workspaces exist but the contained .dependency-cruiser.ts ruleset is missing.'
        )
      ]
    const prepare = (pkg.scripts as Record<string, unknown> | undefined)?.prepare
    if (typeof prepare !== 'string' || !prepare.includes(BOUNDARY_INSTALL))
      return [
        finding(
          'FAIL',
          `The root prepare script must run \`${BOUNDARY_INSTALL}\` so an ordinary install provisions the isolated boundary toolchain.`
        )
      ]
    for (const path of [configuration, toolingManifest, installedChecker]) {
      let resolved: string
      try {
        resolved = await realpath(join(root, path))
      } catch (error) {
        if (path !== installedChecker) throw error
        return [finding('FAIL', `The isolated boundary toolchain is not installed; run \`${BOUNDARY_INSTALL}\`.`)]
      }
      if (!contained(root, resolved)) return [finding('FAIL', `Boundary evidence escapes the repository: ${path}.`)]
    }
    const manifest = await readJson(join(root, toolingManifest))
    const dependencies = manifest.dependencies as Record<string, unknown> | undefined
    if (
      manifest.private !== true ||
      !dependencies?.['dependency-cruiser'] ||
      !dependencies.typescript ||
      Object.keys(dependencies).some((name) => !['dependency-cruiser', 'typescript'].includes(name))
    )
      return [
        finding(
          'FAIL',
          'tooling/boundaries must be private and depend only on dependency-cruiser and its supported TypeScript.'
        )
      ]
    if (!(pkg.devDependencies as Record<string, unknown> | undefined)?.['dependency-cruiser'])
      return [
        finding('FAIL', 'Declare dependency-cruiser as a root development dependency, never a runtime dependency.')
      ]
    if ((pkg.dependencies as Record<string, unknown> | undefined)?.['dependency-cruiser'])
      return [finding('FAIL', 'dependency-cruiser belongs to development tooling, not the runtime dependency surface.')]
    emit?.({ kind: 'step', label: 'boundary rules and supported transpiler', code: 'DESIGN-2' })
    const configResult = await run(
      'bun',
      [
        '--eval',
        'console.log(JSON.stringify((await import(process.argv[1])).default))',
        pathToFileURL(join(root, configuration)).href
      ],
      root
    )
    if (configResult.status)
      return [finding('FAIL', `Cannot load the boundary ruleset: ${configResult.stderr.trim()}.`)]
    const config = JSON.parse(configResult.stdout) as Configuration
    const options = config.options
    if (
      !Array.isArray(config.forbidden) ||
      !baselineRules.every((name) =>
        config.forbidden.some(
          (rule) =>
            rule.name === name &&
            rule.severity === 'error' &&
            rule.from &&
            Object.keys(rule.from).length === 0 &&
            rule.to &&
            Object.keys(rule.to).length === 1 &&
            (name === 'no-circular' ? rule.to.circular === true : rule.to.couldNotResolve === true)
        )
      ) ||
      !config.forbidden.some((rule) => !baselineRules.includes(rule.name) && rule.severity === 'error')
    )
      return [
        finding(
          'FAIL',
          'Rules must enforce no-circular, no-unresolvable and at least one repository-specific boundary at error severity.'
        )
      ]
    if (
      options?.tsPreCompilationDeps !== true ||
      !options.tsConfig?.fileName ||
      !options.doNotFollow?.path ||
      !options.enhancedResolveOptions?.exportsFields?.includes('exports') ||
      !options.enhancedResolveOptions.conditionNames?.length ||
      !['.ts', '.d.ts'].every((extension) => options.enhancedResolveOptions?.extensions?.includes(extension))
    )
      return [
        finding(
          'FAIL',
          'Configure type-only imports, tsconfig, third-party leaves and explicit exports/conditions/source/declaration resolution.'
        )
      ]
    const transpiler = await run(
      'node',
      [
        '--input-type=module',
        '--eval',
        "import {getAvailableTranspilers} from 'dependency-cruiser'; console.log(JSON.stringify(getAvailableTranspilers()))"
      ],
      join(root, tooling)
    )
    if (
      transpiler.status ||
      !JSON.parse(transpiler.stdout).some(
        (entry: { name: string; available: boolean }) => entry.name === 'typescript' && entry.available === true
      )
    )
      return [
        finding(
          'FAIL',
          'The isolated boundary checker has no supported TypeScript transpiler; a zero-module cruise is not a pass.'
        )
      ]
    const tests = sources.filter((path) => /(?:^|[./-])boundar(?:y|ies)\.test\.[cm]?[jt]sx?$/.test(path))
    // A boundary test runs under its own member's bare Vitest entrypoint, else under the root's; one runner per proof.
    const runners = new Set(
      tests.map((path) => {
        const owner = members.find((member) => path.startsWith(`${member.path}${sep}`))
        if (owner?.scripts?.test === 'vitest run') return owner.path
        return (pkg.scripts as Record<string, unknown> | undefined)?.test === 'vitest run' ? '.' : undefined
      })
    )
    const runner = runners.size === 1 ? [...runners][0] : undefined
    if (runner === undefined)
      return [
        finding(
          'FAIL',
          'Native failure proof could not be verified: provide boundary tests selected by one bare Vitest test entrypoint (root or owning workspace member), or implement a runner-appropriate proof adapter.'
        )
      ]
    emit?.({ kind: 'step', label: 'resolved boundary source graph', code: 'DESIGN-2' })
    const graphResult = await run(
      'node',
      [
        join(root, tooling, 'node_modules/.bin/depcruise'),
        '--config',
        configuration,
        '--output-type',
        'json',
        ...sourceRoots
      ],
      root
    )
    const graph = JSON.parse(graphResult.stdout) as Graph
    const paths = new Set(graph.modules.map((module) => module.source))
    const absent = sources.filter((path) => !path.endsWith('.d.ts') && !paths.has(path))
    const edges = graph.modules.flatMap((module) => module.dependencies)
    // Type-blindness is only observable where relative type-only imports exist; their absence is not a dropped edge.
    const typed = (await Promise.all(sources.map((path) => readFile(join(root, path), 'utf8')))).some((text) =>
      relativeTypeImport.test(text)
    )
    if (
      graphResult.status ||
      !graph.modules.length ||
      absent.length ||
      graph.summary.violations.length ||
      edges.some((edge) => edge.couldNotResolve) ||
      (typed &&
        !edges.some(
          (edge) =>
            paths.has(edge.resolved) && edge.couldNotResolve === false && edge.dependencyTypes?.includes('type-only')
        ))
    )
      return [
        finding(
          'FAIL',
          `Boundary graph is empty, partial, unresolved, type-blind or violating (${graph.modules.length} modules; ${absent.length} source files absent).`
        )
      ]
    snapshot = await mkdtemp(join(tmpdir(), 'ki-boundary-audit-'))
    const excluded = new Set(['.git', 'node_modules', 'reports', 'dist', '.agents', '.claude', '.ki-meta', '.vitest'])
    await cp(root, snapshot, {
      recursive: true,
      filter: async (path) => {
        if (path === root) return true
        if (excluded.has(basename(path)) || basename(path).startsWith('.env')) return false
        // Do not follow a source symlink into machine configuration or another repository.
        return (await realpath(path)) === resolve(path)
      }
    })
    for (const path of ['.', ...members.map((member) => member.path)]) {
      try {
        await symlink(await realpath(join(root, path, 'node_modules')), join(snapshot, path, 'node_modules'), 'dir')
      } catch (error) {
        // A hoisted member has no node_modules of its own; the root install must exist.
        if (path === '.' || (error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      }
    }
    const checkerModules = join(snapshot, tooling, 'node_modules')
    await mkdir(join(checkerModules, '.bin'), { recursive: true })
    for (const entry of await readdir(join(root, tooling, 'node_modules'))) {
      if (entry === '.bin') continue
      await symlink(join(root, tooling, 'node_modules', entry), join(checkerModules, entry))
    }
    const reportPath = join(snapshot, 'reports/boundaries.json')
    await mkdir(join(snapshot, 'reports'), { recursive: true })
    const cruiseLog = join(snapshot, 'reports/native-cruises.jsonl')
    const checker = join(checkerModules, '.bin/depcruise')
    // Observe the native suite's real CLI cruises, not strings in test source or config-presence assertions.
    // The proxy and its log are private; the installed dependency tree is never patched.
    await writeFile(
      checker,
      `#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
let output = '', status = 0;
try { output = execFileSync(process.execPath, [${JSON.stringify(join(root, tooling, 'node_modules/.bin/depcruise'))}, ...process.argv.slice(2)], {encoding:'utf8', maxBuffer:${maxBuffer}, stdio:['ignore','pipe','pipe']}); }
catch (error) { output = error.stdout || ''; status = typeof error.status === 'number' ? error.status : 1; if(error.stderr) process.stderr.write(error.stderr); }
try { const graph = JSON.parse(output); if (Array.isArray(graph.modules) && Array.isArray(graph.summary?.violations)) appendFileSync(${JSON.stringify(cruiseLog)}, JSON.stringify(graph) + '\\n'); } catch {}
process.stdout.write(output); process.exitCode = status;
`
    )
    await chmod(checker, 0o755)
    const args = [
      'run',
      'test',
      ...tests.map((path) => relative(runner, path)),
      '--reporter=json',
      '--outputFile',
      reportPath
    ]
    const cwd = join(snapshot, runner)
    emit?.({ kind: 'step', label: 'native boundary proof (private snapshot)', code: 'DESIGN-2' })
    const cleanResult = await run('bun', args, cwd)
    const clean = JSON.parse(await readFile(reportPath, 'utf8')) as TestReport
    if (
      cleanResult.status ||
      !clean.success ||
      !clean.numPassedTests ||
      /Unhandled (?:Errors?|Rejections?|Exceptions?)/i.test(cleanResult.stderr)
    )
      return [finding('FAIL', 'The native boundary proof did not execute and pass in the private snapshot.')]
    let nativeCruises: Graph[] = []
    try {
      nativeCruises = (await readFile(cruiseLog, 'utf8'))
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as Graph)
    } catch {
      /* Missing observations cannot establish proof. */
    }
    await writeFile(
      join(snapshot, configuration),
      `export default ${JSON.stringify({ ...config, forbidden: config.forbidden.filter((rule) => baselineRules.includes(rule.name)) })}\n`
    )
    // No stale clean report can stand in for a mutant that never reached the reporter.
    await rm(reportPath)
    emit?.({ kind: 'step', label: 'native proof rejects disabled boundaries', code: 'DESIGN-2' })
    const mutatedResult = await run('bun', args, cwd)
    const mutated = JSON.parse(await readFile(reportPath, 'utf8')) as TestReport
    const removedRules = config.forbidden.filter((rule) => !baselineRules.includes(rule.name)).map((rule) => rule.name)
    if (
      !mutatedResult.status ||
      /Unhandled (?:Errors?|Rejections?|Exceptions?)/i.test(mutatedResult.stderr) ||
      !provesBoundaryFailure(clean, mutated, nativeCruises, removedRules)
    )
      return [
        finding(
          'FAIL',
          'Disabling semantic boundary rules did not cause a previously passing native assertion to fail; missing, skipped or disconnected proof is not enforcement.'
        )
      ]
    return [
      finding(
        'PASS',
        `Resolved ${graph.modules.length} modules${typed ? ' with type-only edges' : ''}${members.length ? ` across ${members.length} workspace members` : ''}; native assertions pass and reject disabled semantic rules. Boundary selection and individual rule coverage remain judgment.`
      )
    ]
  } catch (error) {
    return [
      finding(
        'FAIL',
        `Cannot verify active boundary enforcement: ${error instanceof Error ? error.message : String(error)}`
      )
    ]
  } finally {
    if (snapshot) await rm(snapshot, { recursive: true, force: true })
  }
}
