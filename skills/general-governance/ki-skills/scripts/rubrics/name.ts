import type { RubricFinding, RubricItem } from '../lib/rubric/rubric.ts'
import { containsXmlTag } from './lib/text.ts'

const NAME_MAX_LENGTH = 64
const RESERVED_WORDS = ['anthropic', 'claude']

export type NameRubricContext = {
  name: string | undefined
  directoryName: string
  setName?: (name: string) => void
}

export const NAME_1: RubricItem<NameRubricContext> = {
  code: 'NAME-1',
  title: 'name is present',
  description: 'The skill frontmatter declares a non-empty `name` value.',
  sources: ['SPEC', 'CC'],
  audit: ({ name }) => (!name ? [{ type: 'M', level: 'FAIL', code: NAME_1.code, message: '`name` is missing from frontmatter' }] : [])
}

export const NAME_2: RubricItem<NameRubricContext> = {
  code: 'NAME-2',
  title: 'name is no longer than 64 characters',
  description: 'The skill name is at most 64 characters long.',
  sources: ['SPEC', 'BP'],
  audit: ({ name }) =>
    name && name.length > NAME_MAX_LENGTH
      ? [{ type: 'M', level: 'FAIL', code: NAME_2.code, message: `\`name\` is ${name.length} chars (max ${NAME_MAX_LENGTH})` }]
      : []
}

export const NAME_3: RubricItem<NameRubricContext> = {
  code: 'NAME-3',
  title: 'name uses lowercase letters, digits, and hyphens only',
  description: 'The skill name uses only lowercase letters, digits, and hyphens.',
  sources: ['SPEC', 'BP'],
  audit: ({ name }) =>
    name && !/^[a-z0-9-]+$/.test(name)
      ? [{ type: 'M', level: 'FAIL', code: NAME_3.code, message: `\`name\` "${name}" must be lowercase letters, digits, and hyphens only` }]
      : []
}

export const NAME_4: RubricItem<NameRubricContext> = {
  code: 'NAME-4',
  title: 'name has no leading or trailing hyphen and no consecutive hyphens',
  description: 'The skill name has no leading or trailing hyphen and no consecutive hyphens.',
  sources: ['SPEC'],
  audit: ({ name }) =>
    name && (name.startsWith('-') || name.endsWith('-') || name.includes('--'))
      ? [{ type: 'M', level: 'FAIL', code: NAME_4.code, message: `\`name\` "${name}" must not start/end with a hyphen or contain "--"` }]
      : []
}

export const NAME_5: RubricItem<NameRubricContext> = {
  code: 'NAME-5',
  title: 'name matches the parent directory name exactly',
  description: 'The skill name exactly matches its parent directory name.',
  sources: ['SPEC'],
  audit: ({ name, directoryName }) =>
    name && name !== directoryName
      ? [
          {
            type: 'M',
            level: 'FAIL',
            code: NAME_5.code,
            message: `\`name\` "${name}" does not match the directory name "${directoryName}"`
          }
        ]
      : [],
  conform: ({ name, directoryName, setName }) => {
    if (!name || name === directoryName) return []
    if (!setName) throw new Error('NAME-5 conform requires the setName capability')
    setName(directoryName)
    return [{ item: NAME_5, message: `name '${name}' → '${directoryName}'`, file: 'SKILL.md' }]
  }
}

export const NAME_6: RubricItem<NameRubricContext> = {
  code: 'NAME-6',
  title: 'name contains no XML tags or reserved words',
  description: 'The skill name contains neither XML tags nor reserved words.',
  sources: ['BP'],
  audit: ({ name }) => {
    if (!name) return []
    const findings: RubricFinding[] = containsXmlTag(name)
      ? [{ type: 'M', level: 'FAIL', code: NAME_6.code, message: '`name` contains an XML tag' }]
      : []
    for (const word of RESERVED_WORDS)
      if (name.includes(word))
        findings.push({ type: 'M', level: 'FAIL', code: NAME_6.code, message: `\`name\` contains the reserved word "${word}"` })
    return findings
  }
}

export const NAME_7: RubricItem<NameRubricContext> = {
  code: 'NAME-7',
  title: 'name is specific rather than generic',
  description: 'The skill name identifies a concrete capability rather than a generic helper.',
  sources: ['BP'],
  judgment: {
    prompt: 'Is this name concrete and appropriately scoped for the capability it governs?'
  }
}

export const NAME: readonly RubricItem<NameRubricContext>[] = [NAME_1, NAME_2, NAME_3, NAME_4, NAME_5, NAME_6, NAME_7]
