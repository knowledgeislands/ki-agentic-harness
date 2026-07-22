import { expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { projectPublisherPath } from './binding.ts'

test('resolves the canonical ki-bootstrap project publisher', () => {
  expect(existsSync(projectPublisherPath())).toBe(true)
})
