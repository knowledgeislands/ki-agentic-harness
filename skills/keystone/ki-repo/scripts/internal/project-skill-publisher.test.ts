#!/usr/bin/env bun
/** Hostile-path and transaction regressions for the combined project link writer. */
import { spawnSync } from 'node:child_process'
import {
  existsSync,
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
import { runProjectLinks } from '../../../ki-bootstrap/scripts/internal/repo-bootstrap/project-skill-publisher.ts'

const LINKER = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'ki-bootstrap',
  'scripts',
  'internal',
  'repo-bootstrap',
  'project-skill-publisher.ts'
)
let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function declaredTables(tables: string[]): string[] {
  const dependencies: Record<string, string[]> = {
    'ki-kb': ['ki-kb-activities', 'ki-kb-live-artifacts', 'ki-kb-streams'],
    'ki-repo': ['ki-authoring']
  }
  return [...new Set(tables.flatMap((table) => [table, ...(dependencies[table] ?? [])]))]
}

function fixture(runtimes = ['claude-code']): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-')))
  const tables = declaredTables(['ki-repo', 'ki-kb', 'ki-agents'])
  writeFileSync(
    join(root, '.ki-config.toml'),
    `${tables
      .map((table) =>
        table === 'ki-repo' ? `[ki-repo]\nsupported_runtimes = [${runtimes.map((runtime) => `"${runtime}"`).join(', ')}]` : `[${table}]`
      )
      .join('\n\n')}\n`
  )
  return root
}

function sourceHarnessFixture(): { root: string; repo: string } {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-harness-')))
  const names = [
    'ki-repo',
    'ki-authoring',
    'ki-harness',
    'ki-skills',
    'ki-agents',
    'ki-decision-records',
    'ki-repo-roadmap',
    'ki-local',
    'ki-local-support'
  ]
  writeFileSync(
    join(root, '.ki-config.toml'),
    `[ki-repo]\nsupported_runtimes = ["claude-code"]\n\n${names
      .filter((name) => name !== 'ki-repo')
      .map((name) => `[${name}]`)
      .join('\n\n')}\n`
  )
  for (const name of names) {
    const directory = join(root, 'skills', name)
    mkdirSync(directory, { recursive: true })
    writeFileSync(
      join(directory, 'SKILL.md'),
      `---\nname: ${name}${name === 'ki-local' ? '\nki-depends-on: [ki-local-support]' : ''}\ndescription: fixture.\n---\n`
    )
  }
  const repo = join(root, 'skills', 'ki-repo')
  return { root, repo }
}

function run(root: string, env: Record<string, string> = {}, args: string[] = []): ReturnType<typeof spawnSync> {
  return spawnSync('bun', [LINKER, ...args, root], {
    encoding: 'utf8',
    env: { ...process.env, ...env }
  })
}

function writeLocalKiSelf(root: string, runtime: 'claude-code' | 'codex'): string {
  const path = join(root, runtime === 'claude-code' ? '.claude' : '.agents', 'skills', 'ki-self', 'SKILL.md')
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, ['---', 'name: ki-self', 'description: Local concerns.', '---', '', '# KI Self', ''].join('\n'))
  return path
}

function writeCanonicalKiSelf(root: string, description = 'Local concerns.'): string {
  const path = join(root, '.ki', 'self', 'skill', 'SKILL.md')
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, ['---', 'name: ki-self', `description: ${description}`, '---', '', '# KI Self', ''].join('\n'))
  return path
}

function snapshot(root: string): string {
  const rows: string[] = []
  function walk(dir: string): void {
    for (const name of readdirSync(dir).sort()) {
      const path = join(dir, name)
      const stat = lstatSync(path)
      const rel = relative(root, path)
      if (stat.isSymbolicLink()) rows.push(`l:${rel}:${readlinkSync(path)}`)
      else if (stat.isDirectory()) {
        rows.push(`d:${rel}:${stat.mode & 0o777}`)
        walk(path)
      } else rows.push(`f:${rel}:${stat.mode & 0o777}:${readFileSync(path).toString('base64')}`)
    }
  }
  walk(root)
  return rows.join('\n')
}

const normal = fixture(['claude-code', 'codex'])
try {
  const result = run(normal)
  check('combined publication → exits successfully', result.status === 0)
  check('combined publication → Claude skill copy exists', lstatSync(join(normal, '.claude', 'skills', 'ki-kb')).isDirectory())
  check('combined publication → Codex skill copy exists', lstatSync(join(normal, '.agents', 'skills', 'ki-kb')).isDirectory())
  check(
    'combined publication → copied skill has no top-level symlink',
    !lstatSync(join(normal, '.claude', 'skills', 'ki-kb')).isSymbolicLink() &&
      existsSync(join(normal, '.claude', 'skills', 'ki-kb', 'SKILL.md'))
  )
  check(
    'combined publication → Claude agent link exists',
    lstatSync(join(normal, '.claude', 'agents', 'ki-kb-curator.md')).isSymbolicLink()
  )
  check(
    'combined publication → Codex agents are explicitly skipped',
    !existsSync(join(normal, '.agents', 'agents')) && result.stdout.includes('skip  [codex]')
  )
  const ignored = readFileSync(join(normal, '.gitignore'), 'utf8')
  check(
    'combined publication → writes one shared gitignore payload',
    ignored.includes('.claude/skills/') && ignored.includes('.agents/skills/') && ignored.includes('.claude/agents/')
  )
  const repeated = run(normal)
  check('combined publication → re-runs with its generated metadata intact', repeated.status === 0)
} finally {
  rmSync(normal, { recursive: true, force: true })
}

const sourceHarness = sourceHarnessFixture()
try {
  const result = run(sourceHarness.root)
  const runtime = join(sourceHarness.root, '.claude', 'skills', 'ki-repo')
  const linked = result.status === 0 && existsSync(runtime) && lstatSync(runtime).isSymbolicLink()
  check('source harness → runtime skill is a same-root link', linked)
  check('source harness → runtime link resolves to canonical source', linked && realpathSync(runtime) === realpathSync(sourceHarness.repo))
  check(
    'source harness → local-only declared dependency resolves without the global catalogue',
    lstatSync(join(sourceHarness.root, '.claude', 'skills', 'ki-local')).isSymbolicLink()
  )
  const checked = run(sourceHarness.root, {}, ['--check'])
  check(
    'source harness → check accepts local-only runtime links without BOOT-1 drift',
    checked.status === 0 && !checked.stdout.includes('[BOOT-1]')
  )
  writeFileSync(join(sourceHarness.repo, 'live.ts'), 'export const live = true\n')
  check('source harness → canonical edit is live through runtime link', linked && existsSync(join(runtime, 'live.ts')))
  check(
    'source harness → requested copy does not escape the same-root link contract',
    runProjectLinks('skills', 'copy', [sourceHarness.root]) === 0 && lstatSync(runtime).isSymbolicLink()
  )
} finally {
  rmSync(sourceHarness.root, { recursive: true, force: true })
}

const linkAssertion = fixture()
try {
  const originalError = console.error
  let refused = false
  try {
    console.error = () => undefined
    refused = runProjectLinks('skills', 'development-link', [linkAssertion]) !== 0
  } finally {
    console.error = originalError
  }
  check('development-link assertion → ordinary repository is refused without a global fallback', refused)
} finally {
  rmSync(linkAssertion, { recursive: true, force: true })
}

const localSelf = fixture(['claude-code', 'codex'])
try {
  const claudeSelf = writeLocalKiSelf(localSelf, 'claude-code')
  writeFileSync(join(localSelf, '.gitignore'), '.claude/skills/*\n.agents/skills/*\n')
  const beforeDryRun = snapshot(localSelf)
  const preview = run(localSelf, {}, ['--dry-run'])
  check('legacy local ki-self → dry-run plans migration without writing', preview.status === 0 && snapshot(localSelf) === beforeDryRun)
  const result = run(localSelf)
  const source = join(localSelf, '.ki', 'self', 'skill', 'SKILL.md')
  const codexSelf = join(localSelf, '.agents', 'skills', 'ki-self')
  check('legacy local ki-self → publication succeeds', result.status === 0)
  check('legacy local ki-self → moves the sole source outside runtime directories', lstatSync(source).isFile())
  check(
    'legacy local ki-self → projects both runtime directories to the canonical source',
    lstatSync(dirname(claudeSelf)).isSymbolicLink() &&
      lstatSync(codexSelf).isSymbolicLink() &&
      realpathSync(dirname(claudeSelf)) === realpathSync(dirname(source)) &&
      realpathSync(codexSelf) === realpathSync(dirname(source))
  )
  const checked = run(localSelf, {}, ['--check'])
  check(
    'canonical local ki-self → generated-coverage check accepts the projection',
    checked.status === 0 && !checked.stdout.includes('[BOOT-1]')
  )
  check(
    'canonical local ki-self → wildcard ignores are accepted without rewriting',
    !/^(?:\.claude|\.agents)\/skills\/?$/m.test(readFileSync(join(localSelf, '.gitignore'), 'utf8'))
  )
} finally {
  rmSync(localSelf, { recursive: true, force: true })
}

const divergentLocalSelf = fixture(['claude-code'])
try {
  writeCanonicalKiSelf(divergentLocalSelf, 'Canonical local concerns.')
  writeLocalKiSelf(divergentLocalSelf, 'claude-code')
  const before = snapshot(divergentLocalSelf)
  check('divergent local ki-self → transaction refuses replacement', run(divergentLocalSelf).status !== 0)
  check('divergent local ki-self → preserves both authored versions', snapshot(divergentLocalSelf) === before)
} finally {
  rmSync(divergentLocalSelf, { recursive: true, force: true })
}

const unsafeLocalSelf = fixture(['claude-code'])
const unsafeLocalSelfOutside = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-self-outside-')))
try {
  writeFileSync(join(unsafeLocalSelfOutside, 'sentinel'), 'outside\n')
  mkdirSync(join(unsafeLocalSelf, '.ki', 'self'), { recursive: true })
  symlinkSync(unsafeLocalSelfOutside, join(unsafeLocalSelf, '.ki', 'self', 'skill'))
  check('unsafe canonical ki-self → transaction refuses the source link', run(unsafeLocalSelf).status !== 0)
  check(
    'unsafe canonical ki-self → never follows the source link',
    readFileSync(join(unsafeLocalSelfOutside, 'sentinel'), 'utf8') === 'outside\n'
  )
} finally {
  rmSync(unsafeLocalSelf, { recursive: true, force: true })
  rmSync(unsafeLocalSelfOutside, { recursive: true, force: true })
}

const blocker = fixture()
try {
  const blocked = join(blocker, '.claude', 'skills')
  mkdirSync(blocked, { recursive: true })
  writeFileSync(join(blocked, 'ki-kb'), 'do not replace')
  const before = snapshot(blocker)
  check('real destination blocker → transaction refuses', run(blocker).status !== 0)
  check('real destination blocker → transaction leaves repository byte-for-byte unchanged', snapshot(blocker) === before)
} finally {
  rmSync(blocker, { recursive: true, force: true })
}

const parentSymlink = fixture()
const outside = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-outside-')))
try {
  writeFileSync(join(outside, 'sentinel'), 'outside\n')
  symlinkSync(outside, join(parentSymlink, '.claude'))
  const before = snapshot(outside)
  check('symlinked managed parent → transaction refuses', run(parentSymlink).status !== 0)
  check('symlinked managed parent → outside remains unchanged', snapshot(outside) === before)
} finally {
  rmSync(parentSymlink, { recursive: true, force: true })
  rmSync(outside, { recursive: true, force: true })
}

const rootOutside = fixture()
const rootAlias = `${rootOutside}-alias`
try {
  symlinkSync(rootOutside, rootAlias)
  const before = snapshot(rootOutside)
  check('symlinked target root → transaction refuses', run(rootAlias).status !== 0)
  check('symlinked target root → real repository remains unchanged', snapshot(rootOutside) === before)
} finally {
  rmSync(rootAlias, { force: true })
  rmSync(rootOutside, { recursive: true, force: true })
}

const configSymlink = fixture()
const configOutside = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-config-outside-')))
try {
  const source = join(configOutside, 'config')
  writeFileSync(source, '[ki-kb]\n')
  rmSync(join(configSymlink, '.ki-config.toml'))
  symlinkSync(source, join(configSymlink, '.ki-config.toml'))
  const before = snapshot(configOutside)
  check('symlinked configuration → transaction refuses', run(configSymlink).status !== 0)
  check('symlinked configuration → outside remains unchanged', snapshot(configOutside) === before)
} finally {
  rmSync(configSymlink, { recursive: true, force: true })
  rmSync(configOutside, { recursive: true, force: true })
}

const gitignoreSymlink = fixture()
const gitignoreOutside = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-ignore-outside-')))
try {
  writeFileSync(join(gitignoreOutside, 'ignore'), 'outside\n')
  symlinkSync(join(gitignoreOutside, 'ignore'), join(gitignoreSymlink, '.gitignore'))
  const before = snapshot(gitignoreOutside)
  check('symlinked .gitignore → transaction refuses', run(gitignoreSymlink).status !== 0)
  check('symlinked .gitignore → outside remains unchanged', snapshot(gitignoreOutside) === before)
} finally {
  rmSync(gitignoreSymlink, { recursive: true, force: true })
  rmSync(gitignoreOutside, { recursive: true, force: true })
}

const rollback = fixture()
try {
  const before = snapshot(rollback)
  check('partial publication failure → transaction reports failure', run(rollback, { KI_PROJECT_LINKS_TEST_FAIL_AFTER: '1' }).status !== 0)
  check('partial publication failure → copies, agent, gitignore and created directories roll back', snapshot(rollback) === before)
} finally {
  rmSync(rollback, { recursive: true, force: true })
}

const quarantineRollback = fixture()
try {
  const skills = join(quarantineRollback, '.claude', 'skills')
  mkdirSync(skills, { recursive: true })
  symlinkSync('../wrong-target', join(skills, 'ki-kb'))
  const before = snapshot(quarantineRollback)
  check(
    'failure after quarantine → transaction reports failure',
    run(quarantineRollback, { KI_PROJECT_LINKS_TEST_FAIL_AFTER_QUARANTINE: '1' }).status !== 0
  )
  check('failure after quarantine → displaced destination is restored exactly', snapshot(quarantineRollback) === before)
} finally {
  rmSync(quarantineRollback, { recursive: true, force: true })
}

const changedAfterPlan = fixture()
try {
  const gitignore = join(changedAfterPlan, '.gitignore')
  const result = run(changedAfterPlan, { KI_PROJECT_LINKS_TEST_MUTATE_AFTER_PLAN: gitignore })
  check('destination changed after validation → transaction refuses', result.status !== 0)
  check(
    'destination changed after validation → third-party bytes are preserved',
    readFileSync(gitignore, 'utf8') === 'third-party change\n'
  )
  check(
    'destination changed after validation → no generated copy is published',
    !existsSync(join(changedAfterPlan, '.claude', 'skills', 'ki-kb'))
  )
} finally {
  rmSync(changedAfterPlan, { recursive: true, force: true })
}

const prune = fixture()
const pruneOutside = realpathSync(mkdtempSync(join(tmpdir(), 'ki-project-links-prune-outside-')))
try {
  const skills = join(prune, '.claude', 'skills')
  mkdirSync(skills, { recursive: true })
  symlinkSync('../missing', join(skills, 'legacy-dangling'))
  writeFileSync(join(pruneOutside, 'sentinel'), 'outside\n')
  symlinkSync(join(pruneOutside, 'sentinel'), join(skills, 'ki-removed'))
  const before = snapshot(pruneOutside)
  check('unfamiliar legacy link → transaction refuses migration', run(prune).status !== 0)
  check(
    'unfamiliar legacy link → transaction preserves the local entries',
    lstatSync(join(skills, 'legacy-dangling')).isSymbolicLink() && lstatSync(join(skills, 'ki-removed')).isSymbolicLink()
  )
  check('unfamiliar legacy link → outside target remains unchanged', snapshot(pruneOutside) === before)
} finally {
  rmSync(prune, { recursive: true, force: true })
  rmSync(pruneOutside, { recursive: true, force: true })
}

const codexOnly = fixture(['codex'])
try {
  const result = run(codexOnly)
  check('Codex-only → skill transaction succeeds', result.status === 0 && existsSync(join(codexOnly, '.agents', 'skills', 'ki-kb')))
  check(
    'Codex-only → agent generation is skipped without guessing a path',
    !existsSync(join(codexOnly, '.claude', 'agents')) && result.stdout.includes('skip  [codex]')
  )
} finally {
  rmSync(codexOnly, { recursive: true, force: true })
}

const forgedMarker = fixture()
try {
  check('fresh generated payload → initial publication succeeds', run(forgedMarker).status === 0)
  const copiedSkill = join(forgedMarker, '.claude', 'skills', 'ki-kb')
  writeFileSync(join(copiedSkill, 'SKILL.md'), '# locally altered payload\n')
  const before = snapshot(forgedMarker)
  check('marker with mismatched payload → transaction refuses replacement', run(forgedMarker).status !== 0)
  check('marker with mismatched payload → preserves the local payload', snapshot(forgedMarker) === before)
} finally {
  rmSync(forgedMarker, { recursive: true, force: true })
}

if (failed) {
  console.log('\n\x1b[31mproject-links.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mproject-links.test.ts: all checks passed\x1b[0m')
