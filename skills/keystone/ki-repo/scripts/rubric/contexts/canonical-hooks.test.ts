import { expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { generate } from '../../generate/index.ts'
import { canonicalHooks, HOOK_VARIANTS, SHAPE_HOOKS } from './canonical-hooks.ts'
import { inspectFrame } from './hooks.ts'
import type { RepositoryShape } from './shapes.ts'

const HARNESS = resolve(import.meta.dir, '../../../../../..')
const SHAPES = Object.keys(SHAPE_HOOKS) as RepositoryShape[]

test('every canonical hook passes the frame: refusal before its first command, every tool tested, no bypass', () => {
  for (const shape of SHAPES)
    for (const variant of HOOK_VARIANTS) {
      const hooks = canonicalHooks(shape, variant)
      if (!hooks) continue
      for (const [name, text] of Object.entries(hooks))
        expect(inspectFrame(`${shape} ${variant} ${name}`, text).status, `${shape} ${variant} ${name}`).toBe('PASS')
    }
})

test('each pre-commit exits on an empty index before refusing, and is check-only and offline', () => {
  for (const shape of SHAPES)
    for (const variant of HOOK_VARIANTS) {
      const text = canonicalHooks(shape, variant)?.['pre-commit']
      if (!text) continue
      const lines = text.split('\n')
      const empty = lines.indexOf('git diff --cached --quiet && exit 0')
      const refusal = lines.findIndex((line) => /command -v|node_modules\/\.bin\//.test(line))
      expect(empty, shape).toBeGreaterThan(0)
      expect(empty, shape).toBeLessThan(refusal)
      expect(text).not.toMatch(/--(?:fix|write)\b|\bbunx\b|\btsc\b|\bbun test\b|\bbats\b|ki repo conform/)
      expect(text).not.toMatch(/ki repo audit(?![^\n]*--staged)/)
    }
})

test('only the dotfiles shape declares no hook, and message validation follows package presence', () => {
  expect(SHAPES.filter((shape) => SHAPE_HOOKS[shape] === null)).toEqual(['ki-repo-dotfiles-chezmoi'])
  expect(canonicalHooks('ki-repo-project', 'package')?.['commit-msg']).toContain('commitlint --edit "$1" || exit 1')
  expect(canonicalHooks('ki-repo-project', 'no-package')?.['commit-msg']).toContain(
    'ki git check-message "$1" || exit 1'
  )
})

test('each shape skill publishes its canonical hooks as committed assets', () => {
  for (const surface of generate(HARNESS)) {
    const path = join(HARNESS, surface.path)
    expect(existsSync(path), surface.path).toBe(true)
    expect(readFileSync(path, 'utf8'), surface.path).toBe(surface.content)
  }
})

test('both tools package variants retain the shell checks after their common staged lint', () => {
  for (const variant of HOOK_VARIANTS) {
    const hook = canonicalHooks('ki-repo-tools', variant)?.['pre-commit'] ?? ''
    for (const command of ['shellcheck', 'bash -n', 'mandoc -T lint', 'quiet_audit --skill ki-repo-tools'])
      expect(hook, variant).toContain(command)
    const lint = variant === 'package' ? 'syncpack format --check' : 'rumdl check --quiet'
    expect(hook.indexOf(lint), variant).toBeLessThan(hook.indexOf('staged_shell()'))
  }
})

test('both general Project variants delegate only the staged ki-repo audit', () => {
  for (const variant of HOOK_VARIANTS) {
    const hook = canonicalHooks('ki-repo-project', variant)?.['pre-commit'] ?? ''
    expect(hook).toContain('quiet_audit --skill ki-repo || exit 1')
    expect(hook).not.toContain('quiet_audit --skill ki-repo-project')
    const audits = hook.split('\n').filter((line) => line.includes('ki repo audit'))
    expect(audits).toHaveLength(2)
    for (const line of audits) {
      expect(line).toContain('--staged')
      expect(line.trim()).toStartWith('KI_REPO_OFFLINE=1 ki repo audit')
    }
    expect(hook).not.toMatch(/ki repo conform|--(?:fix|write)\b/)
  }
})
