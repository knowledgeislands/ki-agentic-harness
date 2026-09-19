import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

const temporaryDirectories: string[] = []
const repositoryRoot = resolve(import.meta.dir, '..')
const hook = join(repositoryRoot, '.husky', 'pre-commit')

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const write = (repository: string, path: string, content: string): void => {
  const target = join(repository, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
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
  const bunxCapture = join(repository, 'bunx-calls')

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

  write(repository, 'test-bin/bunx', '#!/bin/sh\nprintf \'%s\\n\' "$*" >> "$KI_HOOK_BUNX_CAPTURE"\nexit 0\n')
  write(
    repository,
    'test-bin/ki',
    `#!/bin/sh
focus="$4"
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
  chmodSync(join(binaries, 'bunx'), 0o755)
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
      KI_HOOK_LOCAL_CAPTURE: localCapture,
      KI_HOOK_BUNX_CAPTURE: bunxCapture
    }
  })

  expect(readFileSync(setCapture, 'utf8').trim()).not.toBe('')
  expect(readFileSync(localCapture, 'utf8').trim()).not.toBe('')
  expect(readFileSync(bunxCapture, 'utf8').trim().split('\n').slice(0, 2)).toEqual([
    'lint-staged',
    'syncpack format --check'
  ])
})
