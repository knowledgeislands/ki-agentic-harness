#!/usr/bin/env bun
/** Direct source-payload regression for declared harness shared-module links. */
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
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
  if (
    regularDeclared.status === 0 ||
    !`${regularDeclared.stdout ?? ''}${regularDeclared.stderr ?? ''}`.includes('ki-repo/scripts/vendored/ki-skills/checker.ts')
  )
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

function writeSkill(root: string, cluster: string, name: string, frontmatter: string[]): string {
  const directory = join(root, 'skills', cluster, name)
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'SKILL.md'), ['---', `name: ${name}`, ...frontmatter, 'description: fixture.', '---', ''].join('\n'))
  return directory
}

function snapshot(root: string): string {
  const rows: string[] = []
  const visit = (directory: string): void => {
    for (const name of readdirSync(directory).sort()) {
      const path = join(directory, name)
      const stat = lstatSync(path)
      const pathRelative = relative(root, path)
      if (stat.isSymbolicLink()) rows.push(`l:${pathRelative}:${readlinkSync(path)}`)
      else if (stat.isDirectory()) {
        rows.push(`d:${pathRelative}`)
        visit(path)
      } else rows.push(`f:${pathRelative}:${readFileSync(path).toString('base64')}`)
    }
  }
  visit(root)
  return rows.join('\n')
}

const nested = mkdtempSync(join(tmpdir(), 'ki-shared-module-nested-'))
try {
  writeFileSync(join(nested, '.ki-config.toml'), '[ki-harness]\n')
  const provider = writeSkill(nested, 'outer', 'ki-provider', ['ki-shared-modules: [checker]'])
  mkdirSync(join(provider, 'scripts', 'shared'), { recursive: true })
  writeFileSync(join(provider, 'scripts', 'shared', 'checker.ts'), 'export const checker = true\n')
  const consumer = writeSkill(nested, 'outer', 'ki-consumer', ['ki-shared-dependencies: [ki-provider:checker]'])
  const nestedRoot = join(nested, 'skills', 'nested')
  mkdirSync(nestedRoot, { recursive: true })
  writeFileSync(join(nestedRoot, '.ki-config.toml'), '[ki-harness]\n', { flag: 'w' })
  const innerConsumer = writeSkill(nestedRoot, 'inner', 'ki-consumer', ['ki-shared-dependencies: [ki-provider:checker]'])
  const beforeRefusal = snapshot(nested)
  const refused = spawnSync('bun', [scriptPath, nested], { encoding: 'utf8' })
  const outerPayload = join(consumer, 'scripts', 'vendored', 'ki-provider', 'checker.ts')
  if (refused.status === 0 || `${refused.stdout ?? ''}${refused.stderr ?? ''}`.includes('source harness lacks canonical skill') === false) {
    console.error(`${refused.stdout ?? ''}${refused.stderr ?? ''}`)
    throw new Error('nested harness must not fall back to an outer provider')
  }
  if (snapshot(nested) !== beforeRefusal) throw new Error('separate harness provider refusal must not mutate either source tree')
  const innerProvider = writeSkill(nestedRoot, 'inner', 'ki-provider', ['ki-shared-modules: [checker]'])
  mkdirSync(join(innerProvider, 'scripts', 'shared'), { recursive: true })
  writeFileSync(join(innerProvider, 'scripts', 'shared', 'checker.ts'), 'export const nestedChecker = true\n')
  const linked = spawnSync('bun', [scriptPath, nested], { encoding: 'utf8' })
  const innerPayload = join(innerConsumer, 'scripts', 'vendored', 'ki-provider', 'checker.ts')
  if (
    linked.status !== 0 ||
    !lstatSync(outerPayload).isSymbolicLink() ||
    realpathSync(outerPayload) !== realpathSync(join(provider, 'scripts', 'shared', 'checker.ts')) ||
    !lstatSync(innerPayload).isSymbolicLink() ||
    realpathSync(innerPayload) !== realpathSync(join(innerProvider, 'scripts', 'shared', 'checker.ts'))
  ) {
    console.error(`${linked.stdout ?? ''}${linked.stderr ?? ''}`)
    throw new Error('each same-root harness consumer must materialise its local live shared-module link')
  }
} finally {
  rmSync(nested, { recursive: true, force: true })
}

const ordinaryNested = mkdtempSync(join(tmpdir(), 'ki-shared-module-ordinary-'))
try {
  writeFileSync(join(ordinaryNested, '.ki-config.toml'), '[ki-repo]\n')
  writeSkill(ordinaryNested, 'outer', 'ki-consumer', ['ki-shared-dependencies: [ki-provider:checker]'])
  const foreignRoot = join(ordinaryNested, 'skills', 'foreign-harness')
  mkdirSync(foreignRoot, { recursive: true })
  writeFileSync(join(foreignRoot, '.ki-config.toml'), '[ki-harness]\n')
  const foreignProvider = writeSkill(foreignRoot, 'inner', 'ki-provider', ['ki-shared-modules: [checker]'])
  mkdirSync(join(foreignProvider, 'scripts', 'shared'), { recursive: true })
  writeFileSync(join(foreignProvider, 'scripts', 'shared', 'checker.ts'), 'export const foreign = true\n')
  const before = snapshot(ordinaryNested)
  const refused = spawnSync('bun', [scriptPath, ordinaryNested], { encoding: 'utf8' })
  if (refused.status === 0 || !`${refused.stdout ?? ''}${refused.stderr ?? ''}`.includes('ordinary source scope')) {
    console.error(`${refused.stdout ?? ''}${refused.stderr ?? ''}`)
    throw new Error('ordinary source consumers must not copy a nested harness provider')
  }
  if (snapshot(ordinaryNested) !== before) throw new Error('foreign harness provider refusal must leave ordinary source unchanged')
} finally {
  rmSync(ordinaryNested, { recursive: true, force: true })
}

const laterBlocker = mkdtempSync(join(tmpdir(), 'ki-shared-module-blocker-'))
try {
  writeFileSync(join(laterBlocker, '.ki-config.toml'), '[ki-harness]\n')
  const provider = writeSkill(laterBlocker, 'shared', 'ki-provider', ['ki-shared-modules: [checker]'])
  mkdirSync(join(provider, 'scripts', 'shared'), { recursive: true })
  writeFileSync(join(provider, 'scripts', 'shared', 'checker.ts'), 'export const checker = true\n')
  const first = writeSkill(laterBlocker, 'consumers', 'ki-consumer-a', ['ki-shared-dependencies: [ki-provider:checker]'])
  const second = writeSkill(laterBlocker, 'consumers', 'ki-consumer-b', ['ki-shared-dependencies: [ki-provider:checker]'])
  const blocked = join(second, 'scripts', 'vendored', 'ki-provider', 'checker.ts')
  mkdirSync(dirname(blocked), { recursive: true })
  writeFileSync(blocked, 'changed payload\n')
  const before = snapshot(laterBlocker)
  const refused = spawnSync('bun', [scriptPath, laterBlocker], { encoding: 'utf8' })
  if (refused.status === 0 || !`${refused.stdout ?? ''}${refused.stderr ?? ''}`.includes('refusing to replace changed')) {
    console.error(`${refused.stdout ?? ''}${refused.stderr ?? ''}`)
    throw new Error('later changed destination must refuse the complete synchronization')
  }
  if (
    snapshot(laterBlocker) !== before ||
    lstatSync(join(first, 'scripts', 'vendored', 'ki-provider', 'checker.ts'), { throwIfNoEntry: false })
  )
    throw new Error('later changed destination must leave every earlier consumer byte-for-byte unchanged')
} finally {
  rmSync(laterBlocker, { recursive: true, force: true })
}

const hostileParent = mkdtempSync(join(tmpdir(), 'ki-shared-module-hostile-'))
const hostileOutside = mkdtempSync(join(tmpdir(), 'ki-shared-module-hostile-outside-'))
try {
  writeFileSync(join(hostileParent, '.ki-config.toml'), '[ki-harness]\n')
  const provider = writeSkill(hostileParent, 'shared', 'ki-provider', ['ki-shared-modules: [checker]'])
  mkdirSync(join(provider, 'scripts', 'shared'), { recursive: true })
  writeFileSync(join(provider, 'scripts', 'shared', 'checker.ts'), 'export const checker = true\n')
  const consumer = writeSkill(hostileParent, 'consumers', 'ki-consumer', ['ki-shared-dependencies: [ki-provider:checker]'])
  writeFileSync(join(hostileOutside, 'sentinel'), 'outside\n')
  symlinkSync(hostileOutside, join(consumer, 'scripts'))
  const beforeParent = snapshot(hostileParent)
  const beforeOutside = snapshot(hostileOutside)
  const refused = spawnSync('bun', [scriptPath, hostileParent], { encoding: 'utf8' })
  if (refused.status === 0 || !`${refused.stdout ?? ''}${refused.stderr ?? ''}`.includes('unsafe shared module parent')) {
    console.error(`${refused.stdout ?? ''}${refused.stderr ?? ''}`)
    throw new Error('hostile shared-module parent must be refused')
  }
  if (snapshot(hostileParent) !== beforeParent || snapshot(hostileOutside) !== beforeOutside)
    throw new Error('hostile parent refusal must preserve source and outside snapshots')
} finally {
  rmSync(hostileParent, { recursive: true, force: true })
  rmSync(hostileOutside, { recursive: true, force: true })
}

console.log('sync-shared-modules.test.ts: all checks passed')
