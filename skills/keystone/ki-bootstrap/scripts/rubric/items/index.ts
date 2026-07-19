import { defineRubricFamily, type RubricDefinition } from '../../vendored/ki-skills/rubric.ts'
import type { BootstrapRubricContext } from '../contexts/bootstrap.ts'
import { BOOT } from './boot.ts'

export const KI_BOOTSTRAP_RUBRIC: RubricDefinition<BootstrapRubricContext> = {
  name: 'ki-bootstrap',
  concern: 'repository bootstrap',
  families: [
    defineRubricFamily({
      code: 'BOOT',
      title: 'repository bootstrap and generated governance payloads',
      description: 'Project-local runtime publication and the vendored self-sufficiency surface.',
      standard: 'standards.md',
      selectContext: (context: BootstrapRubricContext) => context,
      items: BOOT
    })
  ]
}
