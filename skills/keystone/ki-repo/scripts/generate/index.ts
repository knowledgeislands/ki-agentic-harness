/**
 * Publishes each shape skill's worked example of its canonical hooks, composed by `canonical-hooks.ts`, under
 * `skills/repo-structure/<shape>/assets/githooks/<package|no-package>/`, so a repository copies the exact text `HOOK-4`
 * compares against. A shape that declares no hook publishes nothing.
 *
 * Boundary: returns each surface's rendered bytes and never writes. `ki dev skill generate ki-repo` compares or
 * publishes them, and `canonical-hooks.test.ts` checks the committed assets against them.
 */
import {
  canonicalHooks,
  HOOK_VARIANTS,
  type HookName,
  hookAsset,
  hookOwner,
  SHAPE_HOOKS
} from '../rubric/contexts/canonical-hooks.ts'
import type { RepositoryShape } from '../rubric/contexts/shapes.ts'

export type GeneratedSurface = { readonly path: string; readonly content: string }

export type SkillGeneration = {
  readonly contract: 1
  readonly name: string
  readonly generate: (harnessRoot: string) => readonly GeneratedSurface[]
}

const HOOK_NAMES: readonly HookName[] = ['pre-commit', 'commit-msg']

export const generate = (_harnessRoot: string): readonly GeneratedSurface[] =>
  (Object.keys(SHAPE_HOOKS) as RepositoryShape[]).flatMap((shape) => {
    const owner = hookOwner(shape)
    if (!owner) return []
    return HOOK_VARIANTS.flatMap((variant) => {
      const hooks = canonicalHooks(shape, variant)
      return hooks ? HOOK_NAMES.map((hook) => ({ path: hookAsset(owner, variant, hook), content: hooks[hook] })) : []
    })
  })

export default { contract: 1, name: 'ki-repo', generate } satisfies SkillGeneration
