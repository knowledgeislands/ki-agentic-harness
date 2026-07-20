#!/usr/bin/env bun
/**
 * Run-based regressions for fail-before-write bootstrap resolution. These scripts
 * are operational tooling rather than shipped `src/`, so the harness exercises
 * their real CLI boundaries directly instead of introducing a vitest project.
 */
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertExplicitDependencies,
  declaredSkills,
  resolveSet,
  SKILLS_ROOT,
  SkillResolutionError,
  sharedDependenciesOf,
  sharedModulePayload,
  sharedModulePayloadAt,
  skillDir
} from './resolve.ts'

const SCRIPTS = dirname(fileURLToPath(import.meta.url))
const BOOTSTRAP = join(SCRIPTS, 'repo-bootstrap.ts')
const AUDIT = join(SCRIPTS, '..', '..', 'audit.ts')

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function fixture(config = ''): string {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'ki-boot-resolve-')))
  if (config) writeFileSync(join(dir, '.ki-config.toml'), config)
  return dir
}

function snapshot(root: string): string {
  const rows: string[] = []
  function walk(dir: string): void {
    for (const name of readdirSync(dir).sort()) {
      const path = join(dir, name)
      const rel = relative(root, path)
      const stat = statSync(path)
      if (stat.isDirectory()) {
        rows.push(`d:${rel}`)
        walk(path)
      } else rows.push(`f:${rel}:${readFileSync(path).toString('base64')}`)
    }
  }
  walk(root)
  return rows.join('\n')
}

function namedFiles(root: string, filename: string): string[] {
  const matches: string[] = []
  function walk(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (entry.isFile() && entry.name === filename) matches.push(path)
    }
  }
  walk(root)
  return matches
}

check('skill sources → retire the mode-elements metadata model', namedFiles(SKILLS_ROOT, 'mode-elements.json').length === 0)

const parsed = declaredSkills(`
[ki-plan] # exact with a comment
[ki-plan.checks]
description = """
[ki-multiline-missing]
"""
["ki-housekeeping".zones.local] # dotted quoted owner
["ki-bootstrap"]
# [ki-commented-out]
coverage-extra = "[ki-value-only]"
`)
check(
  'parser → exact/dotted roots are deduplicated and sorted',
  JSON.stringify(parsed) === JSON.stringify(['ki-bootstrap', 'ki-housekeeping', 'ki-plan'])
)

const bootstrapModules = sharedDependenciesOf('ki-bootstrap')
check(
  'shared module → migrated consumer declares the canonical module closure',
  JSON.stringify(bootstrapModules) ===
    JSON.stringify([
      { provider: 'ki-skills', module: 'rubric' },
      { provider: 'ki-skills', module: 'checker' },
      { provider: 'ki-skills', module: 'reporter' }
    ])
)
check(
  'shared module → every declared dependency resolves a provider file payload',
  bootstrapModules.every((module) => {
    const payload = sharedModulePayload(module)
    return (
      payload.kind === 'file' &&
      payload.targetName === `${module.module}.ts` &&
      payload.source.endsWith(`ki-skills/scripts/shared/${module.module}.ts`)
    )
  })
)

const modulePayloadFixture = fixture()
try {
  const scripts = join(modulePayloadFixture, 'scripts')
  mkdirSync(join(scripts, 'directory-module'), { recursive: true })
  writeFileSync(join(scripts, 'directory-module', 'index.ts'), 'export const payload = true\n')
  const payload = sharedModulePayloadAt('directory-module', scripts)
  check(
    'shared module → extension-free declaration resolves a directory payload',
    payload.kind === 'directory' && payload.targetName === 'directory-module' && payload.source === join(scripts, 'directory-module')
  )
  writeFileSync(join(scripts, 'directory-module.ts'), 'export const conflict = true\n')
  let rejectedAmbiguous = false
  try {
    sharedModulePayloadAt('directory-module', scripts)
  } catch {
    rejectedAmbiguous = true
  }
  check('shared module → ambiguous file and directory payload is rejected', rejectedAmbiguous)
} finally {
  rmSync(modulePayloadFixture, { recursive: true, force: true })
}

const valid = fixture(`
[ki-plan]
[ki-housekeeping.zones]
[ki-bootstrap]
[ki-harness]
[ki-skills]
[ki-agents]
[ki-decision-records]
[ki-repo-roadmap]
[ki-repo]
[ki-authoring]
`)
try {
  const set = resolveSet(valid, false, [])
  check('valid declarations → process skill remains resolvable', set.includes('ki-plan'))
  check('valid declarations → environment/global skill remains resolvable', set.includes('ki-housekeeping'))
  let dependenciesValid = true
  try {
    assertExplicitDependencies(valid, set)
  } catch {
    dependenciesValid = false
  }
  check('declared dependencies → ki-harness requirements are explicitly present', set.includes('ki-harness') && dependenciesValid)
  check('bootstrap declaration → chain-starter stays excluded', !set.includes('ki-bootstrap'))
} finally {
  rmSync(valid, { recursive: true, force: true })
}

const unresolved = fixture(`
[ki-zeta-missing]
[ki-alpha-missing.checks]
[ki-zeta-missing.zones]
# [ki-comment-missing]
coverage-extra = "ki-value-missing"
`)
try {
  let caught: unknown
  try {
    resolveSet(unresolved, false, [])
  } catch (error) {
    caught = error
  }
  check('unknown declarations → typed resolution error', caught instanceof SkillResolutionError)
  check(
    'unknown declarations → each root appears once in sorted order',
    caught instanceof SkillResolutionError && JSON.stringify(caught.unresolved) === JSON.stringify(['ki-alpha-missing', 'ki-zeta-missing'])
  )
} finally {
  rmSync(unresolved, { recursive: true, force: true })
}

const noncanonical = fixture('[ki-NotReal]\n')
try {
  let caught: unknown
  try {
    resolveSet(noncanonical, false, [])
  } catch (error) {
    caught = error
  }
  check(
    'noncanonical ki-like header → fails loudly instead of disappearing',
    caught instanceof SkillResolutionError && caught.unresolved.includes('ki-NotReal')
  )
} finally {
  rmSync(noncanonical, { recursive: true, force: true })
}

const invalidConfig = fixture('[ki-does-not-exist]\n')
try {
  mkdirSync(join(invalidConfig, '.ki'), { recursive: true })
  writeFileSync(join(invalidConfig, '.ki', 'sentinel.txt'), 'keep me byte-identical\n')
  const before = snapshot(invalidConfig)
  const result = spawnSync('bun', [BOOTSTRAP, invalidConfig], { encoding: 'utf8' })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  check('bootstrap unknown declaration → non-zero exit', (result.status ?? 0) !== 0)
  check('bootstrap unknown declaration → names BOOT-9 and root', output.includes('BOOT-9') && output.includes('ki-does-not-exist'))
  check('bootstrap unknown declaration → target remains byte-identical', snapshot(invalidConfig) === before)
} finally {
  rmSync(invalidConfig, { recursive: true, force: true })
}

const invalidSeed = fixture()
try {
  mkdirSync(join(invalidSeed, '.ki'), { recursive: true })
  writeFileSync(join(invalidSeed, '.ki', 'sentinel.txt'), 'keep seed failure clean\n')
  const before = snapshot(invalidSeed)
  const result = spawnSync('bun', [BOOTSTRAP, invalidSeed, '--seed', 'ki-zeta-seed', '--seed', 'ki-alpha-seed', '--seed', 'ki-zeta-seed'], {
    encoding: 'utf8'
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  check('bootstrap invalid seed → non-zero exit', (result.status ?? 0) !== 0)
  check(
    'bootstrap invalid seeds → deduplicated and sorted',
    output.indexOf('ki-alpha-seed') < output.indexOf('ki-zeta-seed') && output.match(/ki-zeta-seed/g)?.length === 1
  )
  check('bootstrap invalid seed → target remains byte-identical', snapshot(invalidSeed) === before)
} finally {
  rmSync(invalidSeed, { recursive: true, force: true })
}

const globalOnlyDeclaration = fixture('[ki-plan]\n')
try {
  mkdirSync(join(globalOnlyDeclaration, '.ki'), { recursive: true })
  writeFileSync(join(globalOnlyDeclaration, '.ki', 'sentinel.txt'), 'keep capability failure clean\n')
  const before = snapshot(globalOnlyDeclaration)
  const result = spawnSync('bun', [BOOTSTRAP, globalOnlyDeclaration], { encoding: 'utf8' })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  check('bootstrap process/global declaration → non-zero exit', (result.status ?? 0) !== 0)
  check(
    'bootstrap process/global declaration → names the complete-capability contract and skill',
    output.includes('CAPABILITY-COMPLETE') && output.includes('ki-plan')
  )
  check('bootstrap process/global declaration → target remains byte-identical', snapshot(globalOnlyDeclaration) === before)
} finally {
  rmSync(globalOnlyDeclaration, { recursive: true, force: true })
}

for (const seed of ['keystone/ki-repo', '../skills/keystone/ki-repo']) {
  const pathSeed = fixture()
  try {
    mkdirSync(join(pathSeed, '.ki'), { recursive: true })
    writeFileSync(join(pathSeed, '.ki', 'sentinel.txt'), 'reject noncanonical seed names\n')
    const before = snapshot(pathSeed)
    const result = spawnSync('bun', [BOOTSTRAP, pathSeed, '--seed', seed], { encoding: 'utf8' })
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    check(`bootstrap path-shaped seed ${seed} → non-zero exit`, (result.status ?? 0) !== 0)
    check(`bootstrap path-shaped seed ${seed} → names rejected value`, output.includes(seed))
    check(`bootstrap path-shaped seed ${seed} → target remains byte-identical`, snapshot(pathSeed) === before)
  } finally {
    rmSync(pathSeed, { recursive: true, force: true })
  }
}

const seededRepo = fixture()
try {
  const result = spawnSync('bun', [BOOTSTRAP, seededRepo, '--seed', 'ki-repo'], { encoding: 'utf8' })
  const config = readFileSync(join(seededRepo, '.ki-config.toml'), 'utf8')
  const roots = declaredSkills(config)
  const selfCheck = spawnSync(join(seededRepo, '.ki', 'bin', 'ki-audit'), ['--help'], { encoding: 'utf8' })
  check('seeded ki-repo → bootstrap exits cleanly', result.status === 0)
  check(
    'seeded ki-repo → default EDUCATE output is concise',
    result.stdout.includes('EDUCATE complete') && !result.stdout.includes('\x1b[32mvendor') && !result.stdout.includes('\x1b[32mcopy')
  )
  check('seeded ki-repo → owner scaffolds both foundation roots', JSON.stringify(roots) === JSON.stringify(['ki-authoring', 'ki-repo']))
  check(
    'seeded ki-repo → same run vendors both foundations',
    existsSync(join(seededRepo, '.ki', 'bootstrap', 'checkers', 'ki-repo')) &&
      existsSync(join(seededRepo, '.ki', 'bootstrap', 'checkers', 'ki-authoring'))
  )
  check(
    'seeded ki-repo → shared module closure is copied beneath its consumer',
    ['rubric', 'checker', 'reporter'].every((module) =>
      existsSync(join(seededRepo, '.ki', 'bootstrap', 'checkers', 'ki-authoring', 'scripts', 'vendored', 'ki-skills', `${module}.ts`))
    )
  )
  const educator = join(seededRepo, '.ki', 'bootstrap', 'educators', 'ki-repo', 'educate.ts')
  const localEngine = join(
    seededRepo,
    '.ki',
    'bootstrap',
    'skills',
    'keystone',
    'ki-bootstrap',
    'scripts',
    'internal',
    'repo-bootstrap',
    'repo-bootstrap.ts'
  )
  const educatorHelp = spawnSync(join(seededRepo, '.ki', 'bin', 'ki-educate'), ['ki-repo', '--help'], { encoding: 'utf8' })
  const singleSkillEducate = spawnSync(join(seededRepo, '.ki', 'bin', 'ki-educate'), ['ki-repo'], { encoding: 'utf8' })
  const localWholeSet = spawnSync(join(seededRepo, '.ki', 'bin', 'ki-educate'), ['--dry-run'], { encoding: 'utf8' })
  const beforeRejectedEducator = snapshot(seededRepo)
  const rejectedEducator = spawnSync(join(seededRepo, '.ki', 'bin', 'ki-educate'), ['ki-repo/escape'], { encoding: 'utf8' })
  check(
    'seeded ki-repo → vendors a self-contained target-local educator',
    existsSync(educator) && !readFileSync(educator, 'utf8').includes('curl')
  )
  check(
    'seeded ki-repo → selected educator dispatches locally',
    educatorHelp.status === 0 && educatorHelp.stdout.includes('Refresh only ki-repo')
  )
  check(
    'seeded ki-repo → single-skill EDUCATE refreshes only local skill payloads',
    singleSkillEducate.status === 0 && singleSkillEducate.stdout.includes('EDUCATE complete — ki-repo')
  )
  check(
    'seeded ki-repo → retains a local whole-set bootstrap coordinator',
    existsSync(localEngine) && !readFileSync(join(seededRepo, '.ki', 'bin', 'ki-educate'), 'utf8').includes('curl')
  )
  check(
    'seeded ki-repo → whole-set EDUCATE runs from local material',
    localWholeSet.status === 0 && localWholeSet.stdout.includes('EDUCATE dry run complete')
  )
  check(
    'seeded ki-repo → unsafe selected educator is rejected without writing',
    rejectedEducator.status === 2 && snapshot(seededRepo) === beforeRejectedEducator
  )
  check(
    'seeded ki-repo → same run publishes regular runtime skill copies',
    lstatSync(join(seededRepo, '.claude', 'skills', 'ki-repo')).isDirectory() &&
      !lstatSync(join(seededRepo, '.claude', 'skills', 'ki-repo')).isSymbolicLink() &&
      existsSync(join(seededRepo, '.claude', 'skills', 'ki-repo', 'SKILL.md'))
  )
  check('seeded ki-repo → self-check entry point is runnable', selfCheck.status === 0 && selfCheck.stdout.includes('Usage: ki-audit'))
} finally {
  rmSync(seededRepo, { recursive: true, force: true })
}

const checkerRoot = fixture('[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n[ki-skills]\n')
try {
  const result = spawnSync('bun', [BOOTSTRAP, checkerRoot], { encoding: 'utf8' })
  check('shared-module provider → bootstrap exits cleanly', result.status === 0)
  check(
    'shared-module provider → owns its standalone local module closure',
    ['rubric', 'checker', 'reporter'].every((module) =>
      existsSync(join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-skills', 'scripts', 'shared', `${module}.ts`))
    )
  )
  const vendoredRubricItem = join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-skills', 'scripts', 'rubric', 'items', 'index.ts')
  const vendoredRubricContext = join(
    checkerRoot,
    '.ki',
    'bootstrap',
    'checkers',
    'ki-skills',
    'scripts',
    'rubric',
    'contexts',
    'subjects.ts'
  )
  check(
    'shared-module provider → carries its regular internal rubric payload',
    existsSync(vendoredRubricItem) &&
      !lstatSync(vendoredRubricItem).isSymbolicLink() &&
      existsSync(vendoredRubricContext) &&
      !lstatSync(vendoredRubricContext).isSymbolicLink()
  )
  check(
    'shared-module provider → carries rubric metadata beside its runnable payload',
    existsSync(join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-skills', 'references', 'rubric.md'))
  )
  check(
    'aggregate → retired mode-element implementation is not vendored',
    !existsSync(join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-skills', '.ki-meta', 'mode-elements.json')) &&
      !existsSync(join(checkerRoot, '.ki', 'bin', 'mode-elements.ts'))
  )
  const vendoredAudit = spawnSync(
    'bun',
    [join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-skills', 'scripts', 'audit.ts'), SKILLS_ROOT],
    {
      encoding: 'utf8'
    }
  )
  const firstRecord = vendoredAudit.stdout.split(/\r?\n/, 1)[0]
  check('shared-module provider → standalone audit emits a canonical stream', JSON.parse(firstRecord).record === 'meta')

  const aggregate = join(checkerRoot, '.ki', 'bin', 'aggregate.ts')
  const canonicalAggregate = spawnSync('bun', [aggregate, 'audit'], { cwd: checkerRoot, encoding: 'utf8' })
  check(
    'aggregate → renders a valid canonical stream without treating it as malformed',
    canonicalAggregate.stdout.includes('summary:') && !canonicalAggregate.stdout.includes('invalid checker reports')
  )

  const progressAggregate = spawnSync('bun', [aggregate, 'audit', '--skill', 'ki-skills', '--progress=always'], {
    cwd: checkerRoot,
    encoding: 'utf8'
  })
  const progressLines = progressAggregate.stderr
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trimEnd())
  check(
    'aggregate → reports stable startup, checker-plan discovery, and active skill without contaminating final output',
    progressAggregate.stderr.includes('AUDIT      [') &&
      progressAggregate.stderr.includes('initialising') &&
      progressAggregate.stderr.includes('reading checker plans 1/1') &&
      progressAggregate.stderr.includes('ki-skills') &&
      progressAggregate.stderr.includes('0% starting') &&
      progressLines.length >= 4 &&
      progressLines.every(
        (line) => line.indexOf('[') === 11 && line.match(/\[[#.>]+\]/)?.[0].length === 34 && line.indexOf(']') + 2 === 46
      ) &&
      !progressAggregate.stderr.includes('remaining') &&
      !progressAggregate.stdout.includes('AUDIT      [') &&
      !progressAggregate.stdout.includes('checker wrote to stderr')
  )
  const quietAggregate = spawnSync('bun', [aggregate, 'audit', '--skill', 'ki-skills', '--progress=never'], {
    cwd: checkerRoot,
    encoding: 'utf8'
  })
  check(
    'aggregate → suppresses progress explicitly',
    quietAggregate.stderr === '' && !quietAggregate.stdout.includes('checker wrote to stderr')
  )

  const largeSkill = join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-large', 'scripts')
  mkdirSync(largeSkill, { recursive: true })
  writeFileSync(
    join(largeSkill, 'audit.ts'),
    `const run = { version: 1, runId: '00000000-0000-4000-8000-000000000000', mode: 'audit', concern: 'large', target: '.', generatedAt: '2026-01-01T00:00:00.000Z' }\n` +
      `console.log(JSON.stringify({ ...run, record: 'meta' }))\n` +
      `for (let index = 0; index < 5_000; index += 1) console.log(JSON.stringify({ ...run, record: 'finding', level: 'PASS', code: 'LARGE-1', title: 'large capture', message: 'x'.repeat(128) }))\n` +
      `console.log(JSON.stringify({ ...run, record: 'summary', summary: { fail: 0, warn: 0, fixed: 0, info: 0, notApplicable: 0, pass: 5_000, judgment: { unevaluated: 0 } } }))\n`
  )
  const largeAggregate = spawnSync('bun', [aggregate, 'audit'], { cwd: checkerRoot, encoding: 'utf8' })
  check('aggregate → captures canonical streams larger than Bun pipe limits', !largeAggregate.stdout.includes('invalid checker reports'))

  const invalidSkill = join(checkerRoot, '.ki', 'bootstrap', 'checkers', 'ki-invalid', 'scripts')
  mkdirSync(invalidSkill, { recursive: true })
  writeFileSync(join(invalidSkill, 'audit.ts'), "process.stdout.write('legacy prose\\n')\n")
  const malformedAggregate = spawnSync('bun', [aggregate, 'audit'], { cwd: checkerRoot, encoding: 'utf8' })
  check(
    'aggregate → rejects malformed child output without a legacy fallback',
    malformedAggregate.status === 1 &&
      malformedAggregate.stdout.includes('invalid checker reports') &&
      malformedAggregate.stdout.includes('ki-invalid') &&
      !malformedAggregate.stdout.includes('legacy prose')
  )
} finally {
  rmSync(checkerRoot, { recursive: true, force: true })
}

const reporterConsumerRoot = fixture('[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n')
try {
  const result = spawnSync('bun', [BOOTSTRAP, reporterConsumerRoot], { encoding: 'utf8' })
  check('reporter consumers → bootstrap exits cleanly', result.status === 0)
  const aggregate = join(reporterConsumerRoot, '.ki', 'bin', 'aggregate.ts')
  const consumerAggregate = spawnSync('bun', [aggregate, 'audit', '--reporter-levels=all'], { cwd: reporterConsumerRoot, encoding: 'utf8' })
  check(
    'reporter consumers → vendored aggregate has no malformed checker output',
    consumerAggregate.stdout.includes('ki-authoring') && !consumerAggregate.stdout.includes('invalid checker reports')
  )
} finally {
  rmSync(reporterConsumerRoot, { recursive: true, force: true })
}

const temporaryHarness = realpathSync(mkdtempSync(join(tmpdir(), 'ki-bootstrap-temporary-source-')))
const temporaryTarget = fixture()
try {
  cpSync(SKILLS_ROOT, join(temporaryHarness, 'skills'), { recursive: true, dereference: true })
  const temporaryBootstrap = join(
    temporaryHarness,
    'skills',
    'keystone',
    'ki-bootstrap',
    'scripts',
    'internal',
    'repo-bootstrap',
    'repo-bootstrap.ts'
  )
  const result = spawnSync('bun', [temporaryBootstrap, temporaryTarget, '--seed', 'ki-repo'], { encoding: 'utf8' })
  rmSync(temporaryHarness, { recursive: true, force: true })
  const copiedSkill = join(temporaryTarget, '.claude', 'skills', 'ki-repo', 'SKILL.md')
  check('temporary bootstrap source → publishes copied runtime skills', result.status === 0 && existsSync(copiedSkill))
  check(
    'temporary bootstrap source removal → copied runtime skill remains readable',
    !lstatSync(copiedSkill).isSymbolicLink() && readFileSync(copiedSkill, 'utf8').includes('#')
  )
} finally {
  rmSync(temporaryHarness, { recursive: true, force: true })
  rmSync(temporaryTarget, { recursive: true, force: true })
}

const selfBootstrappingHarness = realpathSync(mkdtempSync(join(tmpdir(), 'ki-bootstrap-self-source-')))
try {
  cpSync(SKILLS_ROOT, join(selfBootstrappingHarness, 'skills'), { recursive: true, dereference: true })
  cpSync(join(dirname(SKILLS_ROOT), 'agents'), join(selfBootstrappingHarness, 'agents'), { recursive: true, dereference: true })
  writeFileSync(join(selfBootstrappingHarness, '.ki-config.toml'), readFileSync(join(dirname(SKILLS_ROOT), '.ki-config.toml')))
  const selfBootstrap = join(
    selfBootstrappingHarness,
    'skills',
    'keystone',
    'ki-bootstrap',
    'scripts',
    'internal',
    'repo-bootstrap',
    'repo-bootstrap.ts'
  )
  const result = spawnSync('bun', [selfBootstrap, selfBootstrappingHarness], { encoding: 'utf8' })
  const selfPayload = join(selfBootstrappingHarness, '.claude', 'skills', 'ki-repo')
  const selfSharedPayload = join(
    selfBootstrappingHarness,
    'skills',
    'keystone',
    'ki-repo',
    'scripts',
    'vendored',
    'ki-skills',
    'checker.ts'
  )
  check('source harness bootstrap → exits cleanly', result.status === 0)
  check(
    'source harness bootstrap → links canonical runtime skills',
    existsSync(selfPayload) &&
      lstatSync(selfPayload).isSymbolicLink() &&
      realpathSync(selfPayload) === join(selfBootstrappingHarness, 'skills', 'keystone', 'ki-repo')
  )
  check(
    'source harness bootstrap → links declared shared modules',
    lstatSync(selfSharedPayload).isSymbolicLink() &&
      realpathSync(selfSharedPayload) ===
        join(selfBootstrappingHarness, 'skills', 'keystone', 'ki-skills', 'scripts', 'shared', 'checker.ts')
  )
} finally {
  rmSync(selfBootstrappingHarness, { recursive: true, force: true })
}

const partialRepoText = '# preserve this prefix\n[ki-repo]\nvisibility = "public"\nsupported_runtimes = ["claude-code", "codex"]\n'
const partialRepo = fixture(partialRepoText)
try {
  const result = spawnSync('bun', [BOOTSTRAP, partialRepo], { encoding: 'utf8' })
  const config = readFileSync(join(partialRepo, '.ki-config.toml'), 'utf8')
  check('bare re-bootstrap → partial config exits cleanly', result.status === 0)
  check('bare re-bootstrap → existing config bytes remain the exact prefix', config.startsWith(partialRepoText))
  check(
    'bare re-bootstrap → missing authoring root is declared and vendored',
    declaredSkills(config).includes('ki-authoring') && existsSync(join(partialRepo, '.ki', 'bootstrap', 'checkers', 'ki-authoring'))
  )
} finally {
  rmSync(partialRepo, { recursive: true, force: true })
}

const seededDryRun = fixture()
try {
  const result = spawnSync('bun', [BOOTSTRAP, seededDryRun, '--seed', 'ki-repo', '--dry-run'], { encoding: 'utf8' })
  check('seeded ki-repo dry-run → exits cleanly', result.status === 0)
  check(
    'seeded ki-repo dry-run → reports planned vendor and runtime actions',
    result.stdout.includes('\x1b[32mvendor') &&
      result.stdout.includes('\x1b[32mignore') &&
      result.stdout.includes('EDUCATE dry run complete')
  )
  check(
    'seeded ki-repo dry-run → writes neither config nor vendored state',
    !existsSync(join(seededDryRun, '.ki-config.toml')) && !existsSync(join(seededDryRun, '.ki'))
  )
} finally {
  rmSync(seededDryRun, { recursive: true, force: true })
}

const verboseRepo = fixture('[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n')
try {
  const result = spawnSync('bun', [BOOTSTRAP, verboseRepo, '--verbose'], { encoding: 'utf8' })
  check('verbose EDUCATE → exits cleanly', result.status === 0)
  check(
    'verbose EDUCATE → reports vendor and runtime actions',
    result.stdout.includes('\x1b[32mvendor') && result.stdout.includes('\x1b[32mcopy') && result.stdout.includes('scope: ki-authoring')
  )
} finally {
  rmSync(verboseRepo, { recursive: true, force: true })
}

const auditInvalid = fixture('[ki-audit-missing.checks]\n')
try {
  const result = spawnSync('bun', [AUDIT, auditInvalid], { encoding: 'utf8' })
  const events = result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { record?: string; code?: string; level?: string; message?: string })
  const boot9 = events.find((event) => event.record === 'finding' && event.code === 'BOOT-9')
  check('BOOT-9 invalid declaration → structured non-zero FAIL', (result.status ?? 0) !== 0 && boot9?.level === 'FAIL')
  check('BOOT-9 invalid declaration → names dotted owner root', boot9?.message?.includes('ki-audit-missing') === true)
} finally {
  rmSync(auditInvalid, { recursive: true, force: true })
}

type AuditReport = { findings?: Array<{ area?: string; level?: string; msg?: string }> }
const auditReport = (stdout: string): AuditReport => ({
  findings: stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { record?: string; code?: string; level?: string; message?: string })
    .filter((event) => event.record === 'finding')
    .map((event) => ({ area: event.code, level: event.level, msg: event.message }))
})

const sourceBearing = fixture('[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n')
try {
  const source = skillDir('ki-authoring')
  const targetSource = join(sourceBearing, 'skills', relative(SKILLS_ROOT, source))
  mkdirSync(dirname(targetSource), { recursive: true })
  cpSync(source, targetSource, { recursive: true })

  const bootstrapped = spawnSync('bun', [BOOTSTRAP, sourceBearing], { encoding: 'utf8' })
  const freshAudit = spawnSync('bun', [AUDIT, sourceBearing], { encoding: 'utf8' })
  const freshReport = auditReport(freshAudit.stdout)
  const freshBoot11 = freshReport.findings?.find((finding) => finding.area === 'BOOT-11')
  check('BOOT-11 fresh file-kind vendors → bootstrap exits cleanly', bootstrapped.status === 0)
  check('BOOT-11 fresh file-kind vendors → explicit PASS with no drift', freshAudit.status === 0 && freshBoot11?.level === 'PASS')

  for (const mode of ['audit', 'conform']) {
    const vendored = join(sourceBearing, '.ki', 'bootstrap', 'checkers', 'ki-authoring', 'scripts', `${mode}.ts`)
    writeFileSync(vendored, `${readFileSync(vendored, 'utf8')}\n// injected BOOT-11 drift\n`)

    const driftAudit = spawnSync('bun', [AUDIT, sourceBearing], { encoding: 'utf8' })
    const driftReport = auditReport(driftAudit.stdout)
    const driftBoot11 = driftReport.findings?.find((finding) => finding.area === 'BOOT-11')
    check(`BOOT-11 mutated ${mode}.ts → ship-blocking FAIL`, (driftAudit.status ?? 0) !== 0 && driftBoot11?.level === 'FAIL')

    const repaired = spawnSync('bun', [BOOTSTRAP, sourceBearing], { encoding: 'utf8' })
    const repairedAudit = spawnSync('bun', [AUDIT, sourceBearing], { encoding: 'utf8' })
    const repairedReport = auditReport(repairedAudit.stdout)
    const repairedBoot11 = repairedReport.findings?.find((finding) => finding.area === 'BOOT-11')
    check(
      `BOOT-11 re-bootstrap repairs ${mode}.ts drift`,
      repaired.status === 0 && repairedAudit.status === 0 && repairedBoot11?.level === 'PASS'
    )
  }

  const canonicalAudit = join(targetSource, 'scripts', 'audit.ts')
  const canonicalAuditBytes = readFileSync(canonicalAudit)
  rmSync(canonicalAudit)
  const missingSourceAudit = spawnSync('bun', [AUDIT, sourceBearing], { encoding: 'utf8' })
  const missingSourceReport = auditReport(missingSourceAudit.stdout)
  check(
    'BOOT-11 missing declared canonical source → ship-blocking FAIL',
    (missingSourceAudit.status ?? 0) !== 0 &&
      missingSourceReport.findings?.some((finding) => finding.area === 'BOOT-11' && finding.level === 'FAIL') === true
  )
  writeFileSync(canonicalAudit, canonicalAuditBytes)

  const vendoredAudit = join(sourceBearing, '.ki', 'bootstrap', 'checkers', 'ki-authoring', 'scripts', 'audit.ts')
  const vendoredAuditBytes = readFileSync(vendoredAudit)
  rmSync(vendoredAudit)
  symlinkSync(canonicalAudit, vendoredAudit)
  const symlinkAudit = spawnSync('bun', [AUDIT, sourceBearing], { encoding: 'utf8' })
  const symlinkReport = auditReport(symlinkAudit.stdout)
  check(
    'BOOT-11 symlinked vendor → ship-blocking FAIL',
    (symlinkAudit.status ?? 0) !== 0 &&
      symlinkReport.findings?.some((finding) => finding.area === 'BOOT-11' && finding.level === 'FAIL') === true
  )
  rmSync(vendoredAudit)
  writeFileSync(vendoredAudit, vendoredAuditBytes)
} finally {
  rmSync(sourceBearing, { recursive: true, force: true })
}

const externalConsumer = fixture('[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n')
try {
  const bootstrapped = spawnSync('bun', [BOOTSTRAP, externalConsumer], { encoding: 'utf8' })
  const audit = spawnSync('bun', [AUDIT, externalConsumer], { encoding: 'utf8' })
  const report = auditReport(audit.stdout)
  const boot11 = report.findings?.find((finding) => finding.area === 'BOOT-11')
  check('BOOT-11 external consumer without canonical source → bootstrap exits cleanly', bootstrapped.status === 0)
  check(
    'BOOT-11 external consumer without canonical source → explicit NOT_APPLICABLE, not failure',
    audit.status === 0 && boot11?.level === 'NOT_APPLICABLE'
  )
} finally {
  rmSync(externalConsumer, { recursive: true, force: true })
}

if (failed) {
  console.log('\n\x1b[31mresolve.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mresolve.test.ts: all checks passed\x1b[0m')
