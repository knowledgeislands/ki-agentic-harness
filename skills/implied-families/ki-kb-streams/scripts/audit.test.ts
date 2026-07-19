import { expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { collectStreamsAudit } from './rubric/contexts/streams.ts'
import { KI_KB_STREAMS_RUBRIC } from './rubric/items/index.ts'
import { renderRubric } from './rubric/publish.ts'

test('an absent Streams zone is not applicable', () => {
  const root = mkdtempSync(join(tmpdir(), 'ki-kb-streams-'))
  try {
    expect(collectStreamsAudit(root).some((finding) => finding.code === 'STREAM-1' && finding.level === 'NOT_APPLICABLE')).toBe(true)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('generated rubric matches its structured catalogue', () => {
  const rubric = join(import.meta.dir, '..', 'references', 'rubric.md')
  expect(readFileSync(rubric, 'utf8')).toBe(renderRubric(KI_KB_STREAMS_RUBRIC))
})
