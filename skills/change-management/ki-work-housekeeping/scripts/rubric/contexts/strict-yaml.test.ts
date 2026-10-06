import { expect, test } from 'bun:test'
import { parseStrictYaml } from './strict-yaml.ts'

test('parses one document with Bun built-in YAML', () => {
  expect(parseStrictYaml('a: 1\nb:\n  - c: 2\n    d: "x"\n')).toEqual({ a: 1, b: [{ c: 2, d: 'x' }] })
  expect(parseStrictYaml('')).toBeNull()
})

test('rejects repeated keys in top-level, nested and sequence-item mappings', () => {
  for (const source of ['a: 1\na: 2', 'a:\n  b: 1\n  b: 2', 'l:\n  - id: 1\n    id: 2', '\'a\': 1\n"a": 2'])
    expect(() => parseStrictYaml(source)).toThrow('Map keys must be unique')
})

test('accepts equal keys in sibling mappings, sequence items and block scalars', () => {
  expect(parseStrictYaml('a:\n  k: 1\nb:\n  k: 2\nl:\n  - k: 1\n  - k: 2\nt: |\n  k: 1\n  k: 2\n')).toEqual({
    a: { k: 1 },
    b: { k: 2 },
    l: [{ k: 1 }, { k: 2 }],
    t: 'k: 1\nk: 2\n'
  })
})

test('rejects multiple documents and malformed YAML', () => {
  expect(() => parseStrictYaml('a: 1\n---\nb: 2')).toThrow('multiple documents')
  expect(() => parseStrictYaml('x: [unclosed')).toThrow()
})
