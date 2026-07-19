export const relativeLinkTargets = (markdown: string): string[] => {
  const targets: string[] = []
  const links = /\[[^\]]*\]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((match = links.exec(markdown)) !== null) {
    let target = (match[1] as string).trim()
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1).trim()
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith('mailto:') || target.startsWith('#')) continue
    const hash = target.indexOf('#')
    if (hash !== -1) target = target.slice(0, hash)
    if (target) targets.push(target)
  }
  return targets
}

export const hasWikilink = (markdown: string): boolean => /\[\[[^\]]+\]\]/.test(markdown)

export const hasBackslashLink = (markdown: string): boolean => /\[[^\]]*\]\([^)]*\\[^)]*\)/.test(markdown)
