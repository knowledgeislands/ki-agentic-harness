import type { RubricItem } from '../lib/rubric/rubric.ts'

export const NAME_1 = {
  code: 'NAME-1',
  title: 'name is present',
  types: ['M'],
  sources: ['SPEC', 'CC'],
  mechanical: {
    audit: 'implemented'
  }
} as const satisfies RubricItem

export const NAME_2 = {
  code: 'NAME-2',
  title: 'name is no longer than 64 characters',
  types: ['M'],
  sources: ['SPEC', 'BP'],
  mechanical: {
    audit: 'implemented'
  }
} as const satisfies RubricItem

export const NAME_3 = {
  code: 'NAME-3',
  title: 'name uses lowercase letters, digits, and hyphens only',
  types: ['M'],
  sources: ['SPEC', 'BP'],
  mechanical: {
    audit: 'implemented'
  }
} as const satisfies RubricItem

export const NAME_4 = {
  code: 'NAME-4',
  title: 'name has no leading or trailing hyphen and no consecutive hyphens',
  types: ['M'],
  sources: ['SPEC'],
  mechanical: {
    audit: 'implemented'
  }
} as const satisfies RubricItem

export const NAME_5 = {
  code: 'NAME-5',
  title: 'name matches the parent directory name exactly',
  types: ['M'],
  sources: ['SPEC'],
  mechanical: {
    audit: 'implemented',
    conform: 'safe'
  }
} as const satisfies RubricItem

export const NAME_6 = {
  code: 'NAME-6',
  title: 'name contains no XML tags or reserved words',
  types: ['M'],
  sources: ['BP'],
  mechanical: {
    audit: 'implemented'
  }
} as const satisfies RubricItem

export const NAME_7 = {
  code: 'NAME-7',
  title: 'name is specific rather than generic',
  types: ['J'],
  sources: ['BP']
} as const satisfies RubricItem

export const NAME = [NAME_1, NAME_2, NAME_3, NAME_4, NAME_5, NAME_6, NAME_7] as const satisfies readonly RubricItem[]
