#!/usr/bin/env bun
/** Direct source-payload regression for declared harness shared-module links. */
import { spawnSync } from 'node:child_process'
import { cpSync, lstatSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { allSkillNames, SKILLS_ROOT, sharedDependenciesOf, sharedModulePayload, skillDir } from './resolve.ts'

const script = new URL('./sync-shared-modules.ts', import.meta.url)
const scriptPath = fileURLToPath(script)
const result = spawnSync('bun', [fileURLToPath(script), '--check'], { encoding: 'utf8' })
const output = `${result.stdout ?? ''}${result.stderr ?? ''}`

if (result.status !== 0 || !output.includes('shared module payloads are current')) {
  console.error(output)
  process.exit(1)
}

for (const skill of allSkillNames()) {
  for (const module of sharedDependenciesOf(skill)) {
    const payload = sharedModulePayload(module)
    const target = join(skillDir(skill), 'scripts', 'vendored', module.provider, payload.targetName)
    if (!lstatSync(target).isSymbolicLink() || realpathSync(target) !== realpathSync(payload.source)) {
      console.error(`shared module is not a canonical source link: ${skill}/${module.provider}/${payload.targetName}`)
      process.exit(1)
    }
  }
}

function assertNoLinks(path: string): void {
  for (const entry of readdirSync(path)) {
    const child = join(path, entry)
    const stat = lstatSync(child)
    if (stat.isSymbolicLink()) throw new Error(`vendored governance must not contain a symlink: ${child}`)
    if (stat.isDirectory()) assertNoLinks(child)
  }
}

assertNoLinks(join(dirname(SKILLS_ROOT), '.ki-meta'))

const fixture = mkdtempSync(join(tmpdir(), 'ki-shared-module-links-'))
try {
  cpSync(SKILLS_ROOT, join(fixture, 'skills'), { recursive: true, dereference: true })
  writeFileSync(join(fixture, '.ki-config.toml'), '[ki-repo]\n')
  const copied = spawnSync('bun', [scriptPath, fixture], { encoding: 'utf8' })
  const fixturePayload = join(fixture, 'skills', 'keystone', 'ki-repo', 'scripts', 'vendored', 'ki-skills', 'checker.ts')
  const fixtureProvider = join(fixture, 'skills', 'keystone', 'ki-skills', 'scripts', 'shared', 'checker.ts')
  if (
    copied.status !== 0 ||
    lstatSync(fixturePayload).isSymbolicLink() ||
    !readFileSync(fixturePayload).equals(readFileSync(fixtureProvider))
  ) {
    console.error(`${copied.stdout ?? ''}${copied.stderr ?? ''}`)
    throw new Error('ordinary source synchronisation must retain a regular copy')
  }

  writeFileSync(join(fixture, '.ki-config.toml'), '[ki-repo]\n\n[ki-harness]\n')
  const preview = spawnSync('bun', [scriptPath, fixture, '--dry-run'], { encoding: 'utf8' })
  if (preview.status !== 0 || lstatSync(fixturePayload).isSymbolicLink()) {
    console.error(`${preview.stdout ?? ''}${preview.stderr ?? ''}`)
    throw new Error('harness shared-module dry run must not write a link')
  }

  const linked = spawnSync('bun', [scriptPath, fixture], { encoding: 'utf8' })
  if (
    linked.status !== 0 ||
    !lstatSync(fixturePayload).isSymbolicLink() ||
    realpathSync(fixturePayload) !== realpathSync(fixtureProvider)
  ) {
    console.error(`${linked.stdout ?? ''}${linked.stderr ?? ''}`)
    throw new Error('harness source synchronisation must create a canonical link')
  }

  rmSync(fixturePayload)
  writeFileSync(fixturePayload, readFileSync(fixtureProvider))
  const regularDeclared = spawnSync('bun', [scriptPath, fixture, '--check'], { encoding: 'utf8' })
  if (regularDeclared.status === 0 || !`${regularDeclared.stdout ?? ''}${regularDeclared.stderr ?? ''}`.includes('ki-repo/scripts/vendored/ki-skills/checker.ts'))
    throw new Error('harness source check must reject a regular declared payload')

  const restored = spawnSync('bun', [scriptPath, fixture], { encoding: 'utf8' })
  if (restored.status !== 0 || !lstatSync(fixturePayload).isSymbolicLink()) {
    console.error(`${restored.stdout ?? ''}${restored.stderr ?? ''}`)
    throw new Error('harness source synchronisation must restore a regular declared payload to a link')
  }

  const stray = join(fixture, 'skills', 'keystone', 'ki-repo', 'scripts', 'vendored', 'ki-skills', 'stray.ts')
  writeFileSync(stray, 'export const stray = true\n')
  const undeclared = spawnSync('bun', [scriptPath, fixture, '--check'], { encoding: 'utf8' })
  if (undeclared.status === 0 || !`${undeclared.stdout ?? ''}${undeclared.stderr ?? ''}`.includes('undeclared source-vendored payload'))
    throw new Error('harness source check must reject an undeclared vendored payload')
} finally {
  rmSync(fixture, { recursive: true, force: true })
}

console.log('sync-shared-modules.test.ts: all checks passed')
