import { expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricItem } from '../../shared/rubric.ts'
import { BOUNDARY } from '../items/boundary.ts'
import { RECORD } from '../items/records.ts'
import { createWorkPackageSession } from './work-package.ts'

const mechanical = <Context>(family: { items: readonly RubricItem<Context>[] }, code: string) => {
  const item = family.items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} mechanical item is missing`)
  return item.mechanical
}

test('fresh agent can reconstruct a portable hand-off without transcript or runtime state', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-work-package-handoff-'))
  const folder = join(repository, 'work', 'ki', 'ki.prj.remote-agent-proof')

  try {
    mkdirSync(folder, { recursive: true })
    writeFileSync(
      join(folder, '_index.md'),
      [
        '---',
        'id: ki.prj.remote-agent-proof',
        'parent: ki.sop.main',
        'level: project',
        'project: remote-agent-proof',
        'description: Delivers the approved remote-agent proof. Takes proof units. Not for provider choice.',
        'worker: agent',
        'supervisor: owner',
        'role: warden',
        'created_at: 2026-09-15T12:00:00Z',
        'repositories:',
        '  - ki-agent-backpack',
        'state: with-worker',
        'since: 2026-09-15T13:00:00Z',
        '---',
        '',
        '# ki.prj.remote-agent-proof',
        '',
        '## Goals',
        '',
        'Deliver the approved remote-agent proof.',
        '',
        '## Scope',
        '',
        'In: the proof. Out: provider choice. Works mainly in ki-agent-backpack and may change others.',
        '',
        '## Now',
        '',
        `- Repository ${repository} is at immutable baseline ${'a'.repeat(40)}; return the result after \`bun test\`.`,
        '',
        '## Held',
        '',
        'None',
        '',
        '## Changes',
        '',
        '- [10-proof.change.md](10-proof.change.md) - the proof, in hand.',
        ''
      ].join('\n')
    )
    writeFileSync(join(folder, '10-proof.change.md'), '# Proof\n')

    const session = createWorkPackageSession({
      mode: 'audit',
      repository,
      userHome: tmpdir(),
      configuration: {}
    })
    const context = session.subjects[0]?.context()
    if (!context) throw new Error('ki-work-package session did not expose its repository subject')

    expect(mechanical(RECORD, 'RECORD-2').audit.run(RECORD.selectContext(context))[0]?.status).toBe('PASS')
    expect(mechanical(BOUNDARY, 'BOUNDARY-1').audit.run(BOUNDARY.selectContext(context))[0]?.status).toBe('PASS')
  } finally {
    rmSync(repository, { recursive: true, force: true })
  }
})
