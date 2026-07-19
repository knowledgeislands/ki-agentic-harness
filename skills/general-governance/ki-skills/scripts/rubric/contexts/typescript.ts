export const relativeImportSpecifiers = (source: string): string[] =>
  [...source.matchAll(/\b(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"](\.\.?\/[^'"]+)['"]/g)].map((match) => match[1] as string)
