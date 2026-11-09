import { createRubricPublicationFamily } from '../../shared/rubric.ts'
import { type KiSkillsRubricContext, selectKiSkillsContext } from '../contexts/contexts.ts'

export const RUBRIC = createRubricPublicationFamily<KiSkillsRubricContext>(
  (context) => selectKiSkillsContext(context, 'rubric'),
  'standard-rubric-authoring.md',
  ['standard-rubric-authoring.md#414-generated-rubric-publication']
)
