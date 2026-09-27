/** Project specialisations; website implementation and hosting skills refine its core shape. */
export const PROJECT_SHAPES = [
  'ki-repo-dotfiles-chezmoi',
  'ki-repo-harness',
  'ki-repo-homebrew-tap',
  'ki-repo-mcp',
  'ki-repo-plugins',
  'ki-repo-specifications',
  'ki-repo-tools',
  'ki-repo-website'
] as const

export type ProjectShape = (typeof PROJECT_SHAPES)[number]
export type ShapeResolution = { primaryShape?: ProjectShape; issue?: string }

export function resolveProjectShape(
  declared: readonly string[],
  primaryShape: unknown,
  kind: 'project' | 'kb'
): ShapeResolution {
  if (kind === 'kb') return primaryShape === undefined ? {} : { issue: 'primary_shape is only valid for a Project' }
  const candidates = PROJECT_SHAPES.filter((shape) => declared.includes(shape))
  if (primaryShape !== undefined) {
    if (typeof primaryShape !== 'string' || !candidates.includes(primaryShape as ProjectShape))
      return { issue: 'primary_shape must name a declared Project shape: ' + PROJECT_SHAPES.join(', ') }
    return { primaryShape: primaryShape as ProjectShape }
  }
  if (candidates.length > 1) return { issue: `multiple Project shapes require primary_shape: ${candidates.join(', ')}` }
  return candidates[0] ? { primaryShape: candidates[0] } : {}
}
