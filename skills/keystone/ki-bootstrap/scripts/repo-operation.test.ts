import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const script = resolve(import.meta.dir, 'repo-operation.sh')

describe('repo-operation public entry point', () => {
  for (const args of [['-h'], ['--help'], ['clean', '--help'], ['uninstall', '--help'], ['doctor', '--help']]) {
    test(`${args.join(' ')} prints help without fetching the harness`, () => {
      const result = spawnSync('/bin/sh', [script, ...args], { encoding: 'utf8', env: { PATH: '' } })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('Usage: repo-operation.sh')
      expect(result.stdout).toContain('clean')
      expect(result.stdout).toContain('uninstall')
      expect(result.stdout).toContain('doctor')
      expect(result.stderr).toBe('')
    })
  }
})
