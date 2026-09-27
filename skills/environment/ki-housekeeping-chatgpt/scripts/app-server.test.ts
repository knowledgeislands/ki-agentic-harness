import { describe, expect, test } from 'bun:test'
import { mkdtempSync, realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { type AppServerClient, buildInventory, deleteReviewed, protocolFingerprint } from './app-server.ts'

type Call = { method: string; params: Record<string, unknown> }

const repository = realpathSync(mkdtempSync(join(tmpdir(), 'ki-housekeeping-chatgpt-')))
const version = 'codex-cli 1.2.3'

const thread = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  cwd: repository,
  createdAt: 1,
  updatedAt: 2,
  status: { type: 'notLoaded' },
  preview: 'must never enter the artifact',
  ...overrides
})

const client = (responses: unknown[]): { client: AppServerClient; calls: Call[] } => {
  const calls: Call[] = []
  return {
    calls,
    client: {
      request: async (method, params) => {
        calls.push({ method, params })
        if (responses.length === 0) throw new Error(`unexpected ${method}`)
        return responses.shift()
      },
      close: async () => undefined
    }
  }
}

describe('Codex app-server housekeeping adapter', () => {
  test('pages active and archived roots and discloses descendants without content', async () => {
    const fixture = client([
      { data: [thread('active')], nextCursor: 'next' },
      { data: [thread('child')], nextCursor: null },
      { data: [thread('archived')], nextCursor: null },
      { data: [thread('child')], nextCursor: null },
      { data: [], nextCursor: null },
      { data: [], nextCursor: null }
    ])
    const artifact = await buildInventory(fixture.client, repository, version, '2026-08-18T00:00:00.000Z')
    expect(artifact).toEqual({
      schema: 1,
      repository,
      codexVersion: version,
      generatedAt: '2026-08-18T00:00:00.000Z',
      protocolFingerprint,
      roots: [
        {
          id: 'active',
          cwd: repository,
          archived: false,
          createdAt: 1,
          updatedAt: 2,
          status: 'notLoaded',
          descendantIds: ['child']
        },
        {
          id: 'archived',
          cwd: repository,
          archived: true,
          createdAt: 1,
          updatedAt: 2,
          status: 'notLoaded',
          descendantIds: []
        }
      ]
    })
    expect(JSON.stringify(artifact)).not.toContain('preview')
    expect(fixture.calls.filter(({ method }) => method === 'thread/list')).toHaveLength(6)
  })

  test('rejects cross-repository results', async () => {
    const fixture = client([
      { data: [thread('foreign', { cwd: `${repository}-other` })], nextCursor: null },
      { data: [], nextCursor: null }
    ])
    expect(buildInventory(fixture.client, repository, version)).rejects.toThrow('cross-repository')
  })

  test('validates the complete reviewed selection before deleting', async () => {
    const auditFixture = client([
      { data: [thread('root')], nextCursor: null },
      { data: [], nextCursor: null },
      { data: [thread('child')], nextCursor: null }
    ])
    const artifact = await buildInventory(auditFixture.client, repository, version)
    const conformFixture = client([
      { data: [thread('root')], nextCursor: null },
      { data: [], nextCursor: null },
      { data: [thread('child')], nextCursor: null },
      {}
    ])
    expect(
      await deleteReviewed(
        conformFixture.client,
        artifact,
        repository,
        version,
        ['root'],
        'PERMANENTLY_DELETE_SELECTED_CODEX_THREADS'
      )
    ).toEqual(['root'])
    expect(conformFixture.calls.at(-1)).toEqual({ method: 'thread/delete', params: { threadId: 'root' } })
  })

  test('refuses stale descendants without issuing delete', async () => {
    const artifact = {
      schema: 1,
      repository,
      codexVersion: version,
      generatedAt: '2026-08-18T00:00:00.000Z',
      protocolFingerprint,
      roots: [
        {
          id: 'root',
          cwd: repository,
          archived: false,
          createdAt: 1,
          updatedAt: 2,
          status: 'notLoaded',
          descendantIds: ['old-child']
        }
      ]
    }
    const fixture = client([
      { data: [thread('root')], nextCursor: null },
      { data: [], nextCursor: null },
      { data: [thread('new-child')], nextCursor: null }
    ])
    expect(
      deleteReviewed(
        fixture.client,
        artifact,
        repository,
        version,
        ['root'],
        'PERMANENTLY_DELETE_SELECTED_CODEX_THREADS'
      )
    ).rejects.toThrow('changed after review')
    expect(fixture.calls.some(({ method }) => method === 'thread/delete')).toBe(false)
  })

  test('refuses missing confirmation, duplicates, version drift, and protocol drift', async () => {
    const artifact = {
      schema: 1,
      repository,
      codexVersion: version,
      generatedAt: '2026-08-18T00:00:00.000Z',
      protocolFingerprint,
      roots: []
    }
    const fixture = client([])
    expect(deleteReviewed(fixture.client, artifact, repository, version, ['root'], 'wrong')).rejects.toThrow(
      'confirmation'
    )
    expect(
      deleteReviewed(
        fixture.client,
        artifact,
        repository,
        version,
        ['root', 'root'],
        'PERMANENTLY_DELETE_SELECTED_CODEX_THREADS'
      )
    ).rejects.toThrow('duplicate-free')
    expect(
      deleteReviewed(
        fixture.client,
        artifact,
        repository,
        'codex-cli 2.0.0',
        ['root'],
        'PERMANENTLY_DELETE_SELECTED_CODEX_THREADS'
      )
    ).rejects.toThrow('version changed')
    expect(
      deleteReviewed(
        fixture.client,
        { ...artifact, protocolFingerprint: 'old' },
        repository,
        version,
        ['root'],
        'PERMANENTLY_DELETE_SELECTED_CODEX_THREADS'
      )
    ).rejects.toThrow('protocol changed')
  })
})
