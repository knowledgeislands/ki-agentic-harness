/**
 * Strict single-document YAML parsing on Bun's built-in parser, so the compiled `ki` binary needs no npm package.
 * `Bun.YAML.parse` silently keeps the last value of a repeated mapping key and returns an array for a multi-document
 * stream, so block structure is scanned first and either is rejected as invalid YAML.
 */

const KEY_RE = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^\s#'"{[\]},&*!|>%@`-][^#]*?|-[^\s#][^#]*?)\s*:(?:\s+(.*))?$/

const BLOCK_SCALAR_RE = /^[|>][-+0-9]*\s*(?:#.*)?$/

const unquote = (key: string): string => {
  if (key.startsWith("'")) return key.slice(1, -1).replaceAll("''", "'")
  if (!key.startsWith('"')) return key.trim()
  try {
    return String(JSON.parse(key))
  } catch {
    return key.slice(1, -1)
  }
}

/**
 * Reject what a strict single-document parser rejects but `Bun.YAML.parse` accepts: a repeated block-mapping key
 * and a document marker after content, which makes the source a multi-document stream.
 */
const assertStrictBlockStructure = (source: string): void => {
  const frames: { indent: number; keys: Set<string> }[] = []
  let blockScalarIndent: number | null = null
  let seenContent = false
  const lines = source.split(/\r?\n/)
  for (const [index, line] of lines.entries()) {
    const content = line.trimStart()
    let column = line.length - content.length
    if (blockScalarIndent !== null) {
      if (content === '' || column > blockScalarIndent) continue
      blockScalarIndent = null
    }
    if (content === '' || content.startsWith('#')) continue
    if (column === 0 && /^(?:---|\.\.\.)(?:\s|$)/.test(content)) {
      if (seenContent) throw new Error(`Source contains multiple documents at line ${index + 1}`)
      continue
    }
    seenContent = true
    let rest = content
    let dashColumn: number | null = null
    for (let dash = /^-(?:\s+|$)/.exec(rest); dash; dash = /^-(?:\s+|$)/.exec(rest)) {
      while (frames.length && (frames.at(-1)?.indent ?? -1) > column) frames.pop()
      dashColumn = column
      column += dash[0].length
      rest = rest.slice(dash[0].length)
    }
    if (dashColumn !== null && BLOCK_SCALAR_RE.test(rest)) {
      blockScalarIndent = dashColumn
      continue
    }
    const match = KEY_RE.exec(rest)
    if (!match) continue
    while (frames.length && (frames.at(-1)?.indent ?? -1) > column) frames.pop()
    let frame = frames.at(-1)
    if (dashColumn !== null || !frame || frame.indent !== column) {
      frame = { indent: column, keys: new Set() }
      frames.push(frame)
    }
    const key = unquote(match[1] ?? '')
    if (frame.keys.has(key)) throw new Error(`Map keys must be unique: '${key}' repeats at line ${index + 1}`)
    frame.keys.add(key)
    if (BLOCK_SCALAR_RE.test(match[2] ?? '')) blockScalarIndent = column
  }
}

/** Parse one YAML document with Bun's built-in parser, rejecting repeated block-mapping keys and multiple documents. */
export const parseStrictYaml = (source: string): unknown => {
  assertStrictBlockStructure(source)
  return Bun.YAML.parse(source)
}
