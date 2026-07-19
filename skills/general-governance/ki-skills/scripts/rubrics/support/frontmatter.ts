type BunYamlRuntime = { Bun: { YAML: { parse: (source: string) => unknown } } }

export const frontmatterBlock = (content: string): string | null => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return match ? (match[1] as string) : null
}

export const isYamlMapping = (block: string): boolean => {
  try {
    const parsed = (globalThis as typeof globalThis & BunYamlRuntime).Bun.YAML.parse(block)
    return Boolean(parsed && typeof parsed === 'object' && !Array.isArray(parsed))
  } catch {
    return false
  }
}

export const frontmatterLine = (block: string, key: string): string | null => {
  const match = block.match(new RegExp(`^${key}:.*$`, 'm'))
  return match ? (match[0] as string) : null
}

export const insertFrontmatterLine = (block: string, newLine: string): string => {
  for (const anchorKey of ['depends-on', 'name']) {
    const anchor = frontmatterLine(block, anchorKey)
    if (anchor) return block.replace(anchor, `${anchor}\n${newLine}`)
  }
  return `${newLine}\n${block}`
}

export const frontmatterScalar = (line: string, key: string): string => {
  const match = line.match(new RegExp(`^${key}:\\s*(['\"]?)([\\s\\S]*?)\\1\\s*$`))
  return match ? (match[2] as string) : line.replace(new RegExp(`^${key}:\\s*`), '')
}

export const replaceFrontmatterScalar = (block: string, key: string, value: string): string => {
  const line = frontmatterLine(block, key)
  if (!line) return block
  const quote = line.match(new RegExp(`^${key}:\\s*(['\"]?)`))?.[1] || "'"
  return block.replace(line, `${key}: ${quote}${value.trim()}${quote}`)
}
