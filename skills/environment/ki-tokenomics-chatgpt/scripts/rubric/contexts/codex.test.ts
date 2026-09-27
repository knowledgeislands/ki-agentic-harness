import { describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createCodexSession } from './codex.ts'

describe('Codex tokenomics context', () => {
  test('reports only selected repository structural sources and unavailable session facts', () => {
    const home = mkdtempSync(join(tmpdir(), 'codex-tokenomics-'))
    try {
      const repo = join(home, 'repo')
      mkdirSync(join(repo, '.agents', 'skills', 'local'), { recursive: true })
      mkdirSync(join(repo, '.codex', 'agents'), { recursive: true })
      writeFileSync(join(repo, '.codex', 'config.toml'), '[mcp_servers]\n')
      const session = createCodexSession({ mode: 'audit', repository: repo, userHome: home, configuration: {} })
      const evidence = session.subjects[0]?.context().codex
      expect(evidence?.surfaces.map((item) => item.message).join(' ')).not.toContain('mcp_servers')
      expect(evidence?.unavailable.map((item) => item.message).join(' ')).toContain('Effective model')
      expect(session.proposal()).toEqual({ writes: [] })
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })

  test('fails malformed trusted project configuration', () => {
    const home = mkdtempSync(join(tmpdir(), 'codex-tokenomics-'))
    try {
      const repo = join(home, 'repo')
      mkdirSync(join(repo, '.codex'), { recursive: true })
      writeFileSync(join(repo, '.codex', 'config.toml'), '=')
      const surface = createCodexSession({
        mode: 'audit',
        repository: repo,
        userHome: home,
        configuration: {}
      }).subjects[0]?.context().codex.surfaces
      expect(surface?.some((item) => item.status === 'VIOLATION' && item.message.includes('malformed'))).toBe(true)
    } finally {
      rmSync(home, { recursive: true, force: true })
    }
  })
})
