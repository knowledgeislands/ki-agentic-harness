/** Project specialisations; website implementation and hosting skills refine its core shape. */
export const PROJECT_SHAPES = [
  'ki-repo-project',
  'ki-repo-dotfiles-chezmoi',
  'ki-repo-harness',
  'ki-repo-homebrew-tap',
  'ki-repo-mcp',
  'ki-repo-specifications',
  'ki-repo-tools',
  'ki-repo-website'
] as const

export type ProjectShape = (typeof PROJECT_SHAPES)[number]
export type RepositoryShape = ProjectShape | 'ki-repo-kb'
export type ShapeResolution = { primaryShape?: RepositoryShape; issue?: string }

export function resolveRepositoryShape(
  declared: readonly string[],
  primaryShape: unknown,
  kind: 'project' | 'kb'
): ShapeResolution {
  if (typeof primaryShape !== 'string' || !primaryShape)
    return { issue: 'primary_shape is required and must name a declared repository shape' }
  if (kind === 'kb' && primaryShape !== 'ki-repo-kb')
    return { issue: 'a Knowledge Base requires primary_shape = "ki-repo-kb"' }
  if (kind === 'project' && !PROJECT_SHAPES.includes(primaryShape as ProjectShape))
    return { issue: 'a Project primary_shape must be one of: ' + PROJECT_SHAPES.join(', ') }
  if (!declared.includes(primaryShape))
    return { issue: `primary_shape requires a declared [skills.${primaryShape}] table` }
  return { primaryShape: primaryShape as RepositoryShape }
}
