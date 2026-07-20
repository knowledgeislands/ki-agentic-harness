import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { KI_SHAPE_12, KI_SHAPE_14 } from '../items/ki-shape.ts'
import { NAME_5 } from '../items/name.ts'
import { createSkillRubricContext } from './skill.ts'

const temporaryDirectories: string[] = []

const validLocalSkill = `---
name: ki-self
ki-depends-on: []
description: Repository-local governance.
argument-hint: 'audit | conform | educate | refresh | help'
---

# KI Self

## Operating modes

HELP describes this local boundary.

### Mode AUDIT

Check the repository.

### Mode CONFORM

Apply safe fixes.

### Mode EDUCATE

Explain the local workflow.

### Mode REFRESH

Refresh only this committed .ki/self/skill/ source. If a rule is reusable, stop and promote it to its shared owner.

### Mode HELP

Describe this local boundary.
`

const createSkill = (relativeDirectory: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-skills-local-governance-'))
  temporaryDirectories.push(root)
  const directory = join(root, relativeDirectory)
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'SKILL.md'), validLocalSkill)
  return directory
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const audit = (directory: string) => {
  const context = createSkillRubricContext(directory).context()
  return {
    name: NAME_5.mechanical?.audit.run(context.name)[0],
    vocabulary: KI_SHAPE_12.mechanical?.audit.run(context.shape)[0],
    refresh: KI_SHAPE_14.mechanical?.audit.run(context.shape)[0]
  }
}

describe('repository-local ki-self source', () => {
  test('accepts only the canonical .ki/self/skill shape', () => {
    const result = audit(createSkill('.ki/self/skill'))

    expect(result.name?.status).toBe('PASS')
    expect(result.vocabulary?.status).toBe('PASS')
    expect(result.refresh?.status).toBe('PASS')
  })

  test.each([
    { relativeDirectory: 'ki-self', nameStatus: 'PASS' },
    { relativeDirectory: '.ki/self/not-skill', nameStatus: 'VIOLATION' }
  ])('does not exempt the invalid lookalike $relativeDirectory', ({ relativeDirectory, nameStatus }) => {
    const result = audit(createSkill(relativeDirectory))

    expect(result.name?.status).toBe(nameStatus)
    expect(result.vocabulary?.status).toBe('VIOLATION')
  })
})
