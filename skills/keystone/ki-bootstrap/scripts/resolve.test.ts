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
  checkerDependenciesOf,
  checkerModulePayload,
  checkerModulePayloadAt,
  declaredSkills,
  resolveSet,
  SKILLS_ROOT,
  SkillResolutionError,
  skillDir
} from './lib/resolve.ts'

const SCRIPTS = dirname(fileURLToPath(import.meta.url))
const BOOTSTRAP = join(SCRIPTS, 'lib', 'repo-bootstrap.ts')
const AUDIT = join(SCRIPTS, 'audit.ts')

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

const bootstrapModules = checkerDependenciesOf('ki-bootstrap')
check(
  'checker module → migrated consumer declares the canonical module closure',
  JSON.stringify(bootstrapModules) ===
    JSON.stringify([
      { provider: 'ki-skills', module: 'rubric' },
      { provider: 'ki-skills', module: 'checker' },
      { provider: 'ki-skills', module: 'reporter' }
    ])
)
check(
  'checker module → every declared dependency resolves a provider file payload',
  bootstrapModules.every((module) => {
    const payload = checkerModulePayload(module)
    return (
      payload.kind === 'file' &&
      payload.targetName === `${module.module}.ts` &&
      payload.source.endsWith(`ki-skills/scripts/lib/${module.module}.ts`)
    )
  })
)

const modulePayloadFixture = fixture()
try {
  const scripts = join(modulePayloadFixture, 'scripts')
  mkdirSync(join(scripts, 'directory-module'), { recursive: true })
  writeFileSync(join(scripts, 'directory-module', 'index.ts'), 'export const payload = true\n')
  const payload = checkerModulePayloadAt('directory-module', scripts)
  check(
    'checker module → extension-free declaration resolves a directory payload',
    payload.kind === 'directory' && payload.targetName === 'directory-module' && payload.source === join(scripts, 'directory-module')
  )
  writeFileSync(join(scripts, 'directory-module.ts'), 'export const conflict = true\n')
  let rejectedAmbiguous = false
  try {
    checkerModulePayloadAt('directory-module', scripts)
  } catch {
    rejectedAmbiguous = true
  }
  check('checker module → ambiguous file and directory payload is rejected', rejectedAmbiguous)
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
  mkdirSync(join(invalidConfig, '.ki-meta'), { recursive: true })
  writeFileSync(join(invalidConfig, '.ki-meta', 'sentinel.txt'), 'keep me byte-identical\n')
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
  mkdirSync(join(invalidSeed, '.ki-meta'), { recursive: true })
  writeFileSync(join(invalidSeed, '.ki-meta', 'sentinel.txt'), 'keep seed failure clean\n')
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
  mkdirSync(join(globalOnlyDeclaration, '.ki-meta'), { recursive: true })
  writeFileSync(join(globalOnlyDeclaration, '.ki-meta', 'sentinel.txt'), 'keep capability failure clean\n')
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
    mkdirSync(join(pathSeed, '.ki-meta'), { recursive: true })
    writeFileSync(join(pathSeed, '.ki-meta', 'sentinel.txt'), 'reject noncanonical seed names\n')
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
  const selfCheck = spawnSync(join(seededRepo, '.ki-meta', 'bin', 'ki-audit'), ['--help'], { encoding: 'utf8' })
  check('seeded ki-repo → bootstrap exits cleanly', result.status === 0)
  check(
    'seeded ki-repo → default EDUCATE output is concise',
    result.stdout.includes('EDUCATE complete') && !result.stdout.includes('\x1b[32mvendor') && !result.stdout.includes('\x1b[32mcopy')
  )
  check('seeded ki-repo → owner scaffolds both foundation roots', JSON.stringify(roots) === JSON.stringify(['ki-authoring', 'ki-repo']))
  check(
    'seeded ki-repo → same run vendors both foundations',
    existsSync(join(seededRepo, '.ki-meta', 'checkers', 'ki-repo')) && existsSync(join(seededRepo, '.ki-meta', 'checkers', 'ki-authoring'))
  )
  check(
    'seeded ki-repo → checker module closure is copied beneath its consumer',
    ['rubric', 'checker', 'reporter'].every((module) =>
      existsSync(join(seededRepo, '.ki-meta', 'checkers', 'ki-authoring', 'scripts', 'vendored', 'ki-skills', `${module}.ts`))
    )
  )
  const educator = join(seededRepo, '.ki-meta', 'educators', 'ki-repo', 'educate.ts')
  const educatorHelp = spawnSync(join(seededRepo, '.ki-meta', 'bin', 'ki-educate'), ['ki-repo', '--help'], { encoding: 'utf8' })
  const beforeRejectedEducator = snapshot(seededRepo)
  const rejectedEducator = spawnSync(join(seededRepo, '.ki-meta', 'bin', 'ki-educate'), ['ki-repo/escape'], { encoding: 'utf8' })
  check(
    'seeded ki-repo → vendors a target-local standalone educator',
    existsSync(educator) && !readFileSync(educator, 'utf8').includes('resolve(dirname(fileURLToPath(import.meta.url))')
  )
  check(
    'seeded ki-repo → selected educator dispatches locally',
    educatorHelp.status === 0 && educatorHelp.stdout.includes('ki-educate ki-repo')
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
  check('seeded ki-repo → self-check entry point is runnable', selfCheck.status === 0 && selfCheck.stdout.includes('usage: ki-audit'))
} finally {
  rmSync(seededRepo, { recursive: true, force: true })
}

const checkerRoot = fixture('[ki-repo]\nsupported_runtimes = ["claude-code", "codex"]\n[ki-authoring]\n[ki-skills]\n')
try {
  const result = spawnSync('bun', [BOOTSTRAP, checkerRoot], { encoding: 'utf8' })
  check('checker-module provider → bootstrap exits cleanly', result.status === 0)
  check(
    'checker-module provider → owns its standalone local module closure',
    ['rubric', 'checker', 'reporter'].every((module) =>
      existsSync(join(checkerRoot, '.ki-meta', 'checkers', 'ki-skills', 'scripts', 'lib', `${module}.ts`))
    )
  )
  const vendoredRubricItem = join(checkerRoot, '.ki-meta', 'checkers', 'ki-skills', 'scripts', 'rubric', 'items', 'index.ts')
  const vendoredRubricContext = join(checkerRoot, '.ki-meta', 'checkers', 'ki-skills', 'scripts', 'rubric', 'contexts', 'subjects.ts')
  check(
    'checker-module provider → carries its regular internal rubric payload',
    existsSync(vendoredRubricItem) &&
      !lstatSync(vendoredRubricItem).isSymbolicLink() &&
      existsSync(vendoredRubricContext) &&
      !lstatSync(vendoredRubricContext).isSymbolicLink()
  )
  check(
    'checker-module provider → carries rubric metadata beside its runnable payload',
    existsSync(join(checkerRoot, '.ki-meta', 'checkers', 'ki-skills', 'references', 'rubric.md'))
  )
  check(
    'aggregate → retired mode-element implementation is not vendored',
    !existsSync(join(checkerRoot, '.ki-meta', 'checkers', 'ki-skills', '.ki-meta', 'mode-elements.json')) &&
      !existsSync(join(checkerRoot, '.ki-meta', 'bin', 'mode-elements.ts'))
  )
  const vendoredAudit = spawnSync('bun', [join(checkerRoot, '.ki-meta', 'checkers', 'ki-skills', 'scripts', 'audit.ts'), SKILLS_ROOT], {
    encoding: 'utf8'
  })
  const firstRecord = vendoredAudit.stdout.split(/\r?\n/, 1)[0]
  check('checker-module provider → standalone audit emits a canonical stream', JSON.parse(firstRecord).record === 'meta')

  const aggregate = join(checkerRoot, '.ki-meta', 'bin', 'aggregate.ts')
  const canonicalAggregate = spawnSync('bun', [aggregate, 'audit'], { cwd: checkerRoot, encoding: 'utf8' })
  check(
    'aggregate → renders a valid canonical stream without treating it as malformed',
    canonicalAggregate.stdout.includes('summary:') && !canonicalAggregate.stdout.includes('invalid checker reports')
  )

  const invalidSkill = join(checkerRoot, '.ki-meta', 'checkers', 'ki-invalid', 'scripts')
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
  const aggregate = join(reporterConsumerRoot, '.ki-meta', 'bin', 'aggregate.ts')
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
  const temporaryBootstrap = join(temporaryHarness, 'skills', 'keystone', 'ki-bootstrap', 'scripts', 'lib', 'repo-bootstrap.ts')
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
  const selfBootstrap = join(selfBootstrappingHarness, 'skills', 'keystone', 'ki-bootstrap', 'scripts', 'lib', 'repo-bootstrap.ts')
  const result = spawnSync('bun', [selfBootstrap, selfBootstrappingHarness, '--seed', 'ki-repo'], { encoding: 'utf8' })
  const selfPayload = join(selfBootstrappingHarness, '.claude', 'skills', 'ki-repo')
  check('source harness bootstrap → exits cleanly', result.status === 0)
  check(
    'source harness bootstrap → publishes regular runtime copies',
    lstatSync(selfPayload).isDirectory() && !lstatSync(selfPayload).isSymbolicLink()
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
    declaredSkills(config).includes('ki-authoring') && existsSync(join(partialRepo, '.ki-meta', 'checkers', 'ki-authoring'))
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
    !existsSync(join(seededDryRun, '.ki-config.toml')) && !existsSync(join(seededDryRun, '.ki-meta'))
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
    const vendored = join(sourceBearing, '.ki-meta', 'checkers', 'ki-authoring', 'scripts', `${mode}.ts`)
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

  const vendoredAudit = join(sourceBearing, '.ki-meta', 'checkers', 'ki-authoring', 'scripts', 'audit.ts')
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
