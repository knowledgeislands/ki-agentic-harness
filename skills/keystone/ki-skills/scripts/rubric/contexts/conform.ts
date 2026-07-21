import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { frontmatterLine, parseFrontmatter, replaceFrontmatterScalar } from './frontmatter.ts'
import type { SkillWritableCapabilities } from './skill.ts'

export type ConformDocumentState = {
  read: () => string
  write: (content: string) => void
  persist: () => void
}

export type SkillConformState = {
  capabilities: SkillWritableCapabilities
  document: ConformDocumentState
  persist: () => void
}

/** Hold one mutable document in memory for both real and dry-run CONFORM. */
export const createConformDocumentState = (file: string, dryRun: boolean): ConformDocumentState => {
  const original = readFileSync(file, 'utf8')
  let working = original
  return {
    read: () => working,
    write: (content) => {
      working = content
    },
    persist: () => {
      if (!dryRun && working !== original) writeFileSync(file, working)
    }
  }
}

/** Add frontmatter capabilities to the same state used for SKILL.md Markdown repairs. */
export const createSkillConformState = (directory: string, dryRun: boolean): SkillConformState => {
  const document = createConformDocumentState(join(directory, 'SKILL.md'), dryRun)
  const updateFrontmatter = (update: (block: string) => string): void => {
    const content = document.read()
    const block = parseFrontmatter(content).raw
    if (block !== null) document.write(content.replace(block, update(block)))
  }

  return {
    document,
    capabilities: {
      readContent: document.read,
      setName: (name) => {
        updateFrontmatter((block) => {
          const line = frontmatterLine(block, 'name')
          return line ? block.replace(line, `name: ${name}`) : block
        })
      },
      setArgumentHint: (argumentHint) => {
        updateFrontmatter((block) => replaceFrontmatterScalar(block, 'argument-hint', argumentHint))
      }
    },
    persist: document.persist
  }
}
