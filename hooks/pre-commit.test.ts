import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

const temporaryDirectories: string[] = []
const repositoryRoot = resolve(import.meta.dir, '..')
const hook = join(repositoryRoot, '.githooks', 'pre-commit')

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const write = (repository: string, path: string, content: string): void => {
  const target = join(repository, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

// The hook refuses unless its tools sit in the repository's node_modules/.bin, so each
// fixture installs stand-ins that record their arguments and succeed.
const installTools = (repository: string, capture = '/dev/null'): void => {
  for (const tool of ['lint-staged', 'syncpack', 'tsc']) {
    const target = join(repository, 'node_modules', '.bin', tool)
    write(repository, join('node_modules', '.bin', tool), `#!/bin/sh\nprintf '${tool} %s\\n' "$*" >> '${capture}'\nexit 0\n`)
    chmodSync(target, 0o755)
  }
}

const skill = (name: string, extra = ''): string => `---
name: ${name}
ki-depends-on: []
${extra}description: Tests ${name}.
---

# ${name}
`

test('the staged skill audit includes unchanged siblings, providers, and the local ki-self source', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-pre-commit-'))
  temporaryDirectories.push(repository)
  const binaries = join(repository, 'test-bin')
  const setCapture = join(repository, 'set-audit-focus')
  const localCapture = join(repository, 'local-audit-focus')
  const toolCapture = join(repository, 'tool-calls')

  write(repository, '.ki.toml', '["knowledgeislands/ki-agentic-harness:ki-skills"]\n')
  write(repository, 'README.md', '# Fixture\n')
  write(
    repository,
    'skills/governance/ki-consumer/SKILL.md',
    skill('ki-consumer', 'ki-shared-dependencies: [ki-skills:rubric]\n')
  )
  write(repository, 'skills/governance/ki-sibling/SKILL.md', skill('ki-sibling'))
  write(repository, 'skills/keystone/ki-skills/SKILL.md', skill('ki-skills', 'ki-shared-modules: [rubric]\n'))
  write(repository, 'skills/repo-structure/ki-repo-specifications/SKILL.md', skill('ki-repo-specifications'))
  write(repository, '.agents/skills/ki-self/SKILL.md', skill('ki-self'))

  installTools(repository, toolCapture)
  write(
    repository,
    'test-bin/ki',
    `#!/bin/sh
while [ "$#" -gt 0 ] && [ "$1" != --repo ]; do shift; done
focus="$2"
case "$focus" in
  */.agents)
    test -f "$focus/.ki.toml" || exit 21
    test -f "$focus/skills/ki-self/SKILL.md" || exit 22
    printf '%s\\n' "$focus" > "$KI_HOOK_LOCAL_CAPTURE"
    ;;
  *)
    test -f "$focus/skills/governance/ki-consumer/SKILL.md" || exit 11
    test -f "$focus/skills/governance/ki-sibling/SKILL.md" || exit 12
    test -f "$focus/skills/keystone/ki-skills/SKILL.md" || exit 13
    test -f "$focus/.agents/skills/ki-self/SKILL.md" || exit 14
    test -f "$focus/skills/repo-structure/ki-repo-specifications/SKILL.md" || exit 15
    ! grep -q 'Unstaged sibling bytes' "$focus/skills/governance/ki-sibling/SKILL.md" || exit 16
    printf '%s\\n' "$focus" > "$KI_HOOK_SET_CAPTURE"
    ;;
esac
`
  )
  chmodSync(join(binaries, 'ki'), 0o755)

  execFileSync('git', ['init', '-q'], { cwd: repository })
  execFileSync('git', ['config', 'user.name', 'Hook Test'], { cwd: repository })
  execFileSync('git', ['config', 'user.email', 'hook@example.test'], { cwd: repository })
  execFileSync('git', ['add', '.'], { cwd: repository })
  execFileSync('git', ['commit', '-qm', 'fixture'], { cwd: repository })

  write(repository, '.agents/skills/ki-self/SKILL.md', `${skill('ki-self')}\nUpdated.\n`)
  execFileSync('git', ['add', '.agents/skills/ki-self/SKILL.md'], { cwd: repository })
  write(repository, 'skills/governance/ki-sibling/SKILL.md', `${skill('ki-sibling')}\nUnstaged sibling bytes.\n`)

  execFileSync('/bin/sh', [hook], {
    cwd: repository,
    env: {
      ...process.env,
      PATH: `${binaries}:${process.env.PATH ?? ''}`,
      KI_HOOK_SET_CAPTURE: setCapture,
      KI_HOOK_LOCAL_CAPTURE: localCapture
    }
  })

  expect(readFileSync(setCapture, 'utf8').trim()).not.toBe('')
  expect(readFileSync(localCapture, 'utf8').trim()).not.toBe('')
  expect(readFileSync(toolCapture, 'utf8').trim().split('\n').slice(0, 2)).toEqual([
    'lint-staged --quiet',
    'syncpack format --check'
  ])
})

test('a failing concise skill audit is run again in full so its findings print', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-pre-commit-'))
  temporaryDirectories.push(repository)
  const binaries = join(repository, 'test-bin')
  const auditCapture = join(repository, 'audit-calls')

  write(repository, '.ki.toml', '["knowledgeislands/ki-agentic-harness:ki-skills"]\n')
  write(repository, 'skills/governance/ki-sibling/SKILL.md', skill('ki-sibling'))
  installTools(repository)
  write(
    repository,
    'test-bin/ki',
    `#!/bin/sh
printf '%s\\n' "$*" | sed 's|--repo [^ ]*|--repo FOCUS|' >> "$KI_HOOK_AUDIT_CAPTURE"
exit 1
`
  )
  chmodSync(join(binaries, 'ki'), 0o755)

  execFileSync('git', ['init', '-q'], { cwd: repository })
  execFileSync('git', ['config', 'user.name', 'Hook Test'], { cwd: repository })
  execFileSync('git', ['config', 'user.email', 'hook@example.test'], { cwd: repository })
  execFileSync('git', ['add', '.'], { cwd: repository })
  execFileSync('git', ['commit', '-qm', 'fixture'], { cwd: repository })

  write(repository, 'skills/governance/ki-sibling/SKILL.md', `${skill('ki-sibling')}\nUpdated.\n`)
  execFileSync('git', ['add', 'skills/governance/ki-sibling/SKILL.md'], { cwd: repository })

  expect(() =>
    execFileSync('/bin/sh', [hook], {
      cwd: repository,
      stdio: 'pipe',
      env: { ...process.env, PATH: `${binaries}:${process.env.PATH ?? ''}`, KI_HOOK_AUDIT_CAPTURE: auditCapture }
    })
  ).toThrow()
  expect(readFileSync(auditCapture, 'utf8').trim().split('\n')).toEqual([
    'repo audit --concise --progress never --reporter-levels FAIL --repo FOCUS --skill ki-skills',
    'repo audit --repo FOCUS --skill ki-skills'
  ])
})
