import { describe, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const script = resolve(import.meta.dir, 'repo-bootstrap.sh')

describe('repo-bootstrap public entry point', () => {
  for (const flag of ['-h', '--help']) {
    test(`${flag} prints help without fetching the harness`, () => {
      const result = spawnSync('/bin/sh', [script, flag], { encoding: 'utf8', env: { PATH: '' } })
      expect(result.status).toBe(0)
      expect(result.stdout).toContain('Usage: repo-bootstrap.sh')
      expect(result.stdout).toContain('--ref <ref>')
      expect(result.stderr).toBe('')
    })
  }
})
