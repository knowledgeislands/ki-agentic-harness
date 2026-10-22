import { afterEach, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { canonicalHooks, type HookVariant } from './canonical-hooks.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})
const fixture = (stage: boolean, auditResult = 0, variant: HookVariant = 'no-package') => {
  const root = mkdtempSync(join(tmpdir(), 'ki-canonical-project-'))
  roots.push(root)
  const bin = join(root, 'bin')
  mkdirSync(bin)
  const log = join(root, 'audit.log')
  writeFileSync(join(bin, 'rumdl'), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
  writeFileSync(join(bin, 'ki'), '#!/bin/sh\nprintf "%s\\n" "$*" >> "$AUDIT_LOG"\nexit "$AUDIT_RESULT"\n', {
    mode: 0o755
  })
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, AUDIT_LOG: log, AUDIT_RESULT: String(auditResult) }
  expect(spawnSync('git', ['init', '-q'], { cwd: root, env }).status).toBe(0)
  writeFileSync(join(root, 'README.md'), '# Project\n')
  if (stage) expect(spawnSync('git', ['add', '--', 'README.md'], { cwd: root, env }).status).toBe(0)
  mkdirSync(join(root, 'node_modules/.bin'), { recursive: true })
  for (const tool of ['lint-staged', 'syncpack', 'biome', 'rumdl']) {
    writeFileSync(join(root, 'node_modules/.bin', tool), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
  }
  const hook = join(root, 'pre-commit')
  writeFileSync(hook, canonicalHooks('ki-repo-project', variant)?.['pre-commit'] ?? '')
  return { root, log, hook, env }
}

test('canonical Project gate checks staged repository paths and stays quiet on success', () => {
  const fixtureRun = fixture(true)
  const result = spawnSync('/bin/sh', [fixtureRun.hook], {
    cwd: fixtureRun.root,
    env: fixtureRun.env,
    encoding: 'utf8'
  })
  expect(result.status).toBe(0)
  expect(result.stdout).toBe('')
  const calls = readFileSync(fixtureRun.log, 'utf8').trim().split('\n')
  expect(calls).toHaveLength(1)
  expect(calls[0]).toContain('--skill ki-repo')
  expect(calls[0]).toContain('--staged')
  expect(calls[0]).not.toContain('conform')
})

test('canonical Project gate fails closed and keeps the diagnostic retry staged', () => {
  const fixtureRun = fixture(true, 42)
  const result = spawnSync('/bin/sh', [fixtureRun.hook], { cwd: fixtureRun.root, env: fixtureRun.env })
  expect(result.status).toBe(1)
  const calls = readFileSync(fixtureRun.log, 'utf8').trim().split('\n')
  expect(calls).toHaveLength(2)
  for (const call of calls) {
    expect(call).toContain('--skill ki-repo')
    expect(call).toContain('--staged')
    expect(call).not.toContain('conform')
  }
})

test('empty Project index exits without an audit', () => {
  const fixtureRun = fixture(false)
  const result = spawnSync('/bin/sh', [fixtureRun.hook], { cwd: fixtureRun.root, env: fixtureRun.env })
  expect(result.status).toBe(0)
  expect(existsSync(fixtureRun.log)).toBe(false)
})

for (const variant of ['package', 'no-package'] as const) {
  for (const missingLicense of [false, true]) {
    test(`real ${variant} Project session stays offline with local failure=${missingLicense}`, () => {
      const run = fixture(true, 0, variant)
      // Authentication would succeed if reached. Every provider invocation is recorded.
      const requests = join(run.root, 'remote-requests.log')
      for (const tool of ['gh', 'curl', 'wget', 'ssh']) {
        writeFileSync(join(run.root, 'bin', tool), '#!/bin/sh\nprintf "%s\\n" "$*" >> "$REMOTE_LOG"\nexit 0\n', {
          mode: 0o755
        })
      }
      expect(
        spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/fixture/hosted.git'], {
          cwd: run.root,
          env: run.env
        }).status
      ).toBe(0)
      const config = '[skills.ki-repo]\nrepo_type = "project"\nprimary_shape = "ki-repo-project"\n'
      writeFileSync(join(run.root, '.ki.toml'), config)
      for (const file of ['.gitignore', '.editorconfig', 'CLAUDE.md']) writeFileSync(join(run.root, file), '')
      if (!missingLicense) writeFileSync(join(run.root, 'LICENSE'), 'MIT\n')
      // A shell launcher replaces only CLI argument parsing. The default repository session,
      // collector and FILES-1 criterion are real; the original unconditional audit stub is gone.
      const runner = join(run.root, 'audit.ts')
      writeFileSync(
        runner,
        `
import {appendFileSync} from 'node:fs';
import {createRepoSession} from ${JSON.stringify(join(import.meta.dir, 'repository.ts'))};
import {FILES} from ${JSON.stringify(join(import.meta.dir, '../items/files.ts'))};
const args=process.argv.slice(2);
if(!args.includes('--staged')||args.includes('conform')) process.exit(98);
const root=args[args.indexOf('--repo')+1];
const session=await createRepoSession({mode:'audit',repository:root,userHome:root,configuration:{}});
const subject=session.subjects.find(s=>s.families.includes('FILES'));
const item=FILES.items.find(i=>i.code==='FILES-1');
const outcomes=item.mechanical.audit.run(FILES.selectContext(subject.context()));
appendFileSync(process.env.AUDIT_LOG,JSON.stringify({args,outcomes})+'\\n');
process.exit(outcomes.some(o=>o.status==='VIOLATION')?1:0);
`
      )
      writeFileSync(join(run.root, 'bin/ki'), `#!/bin/sh\nexec "${process.execPath}" "${runner}" "$@"\n`, {
        mode: 0o755
      })
      const result = spawnSync('/bin/sh', [run.hook], {
        cwd: run.root,
        env: { ...run.env, REMOTE_LOG: requests, KI_REPO_OFFLINE: '' },
        encoding: 'utf8'
      })
      expect(result.status, result.stderr).toBe(missingLicense ? 1 : 0)
      expect(existsSync(requests)).toBe(false)
      const calls = readFileSync(run.log, 'utf8')
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line))
      expect(calls).toHaveLength(missingLicense ? 2 : 1)
      for (const call of calls) {
        expect(call.args).toContain('--staged')
        expect(call.outcomes.some((outcome: { status: string }) => outcome.status === 'VIOLATION')).toBe(missingLicense)
      }
      expect(readFileSync(join(run.root, '.ki.toml'), 'utf8')).toBe(config)
      expect(existsSync(join(run.root, 'LICENSE'))).toBe(!missingLicense)
    })
  }
}
