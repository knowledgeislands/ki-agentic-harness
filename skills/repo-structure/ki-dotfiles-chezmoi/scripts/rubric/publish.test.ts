import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { KI_DOTFILES_CHEZMOI_RUBRIC } from './items/index.ts'
import { renderRubric } from './publish.ts'

test('generated rubric exactly matches its structured canonical catalogue', () => {
  expect(readFileSync(fileURLToPath(new URL('../../references/rubric.md', import.meta.url)), 'utf8')).toBe(
    renderRubric(KI_DOTFILES_CHEZMOI_RUBRIC)
  )
  expect(KI_DOTFILES_CHEZMOI_RUBRIC.families.flatMap((family) => family.items)).toHaveLength(11)
})
