/**
 * Eval scenarios for the `knowledgeislands-skills` skill — the Agent Skills rubric.
 * Each probes a house/standard rule (description contents, the size cap, the
 * relative-not-wikilinks rule) the skill encodes.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'knowledgeislands-skills',
    id: 'skills-description',
    prompt: "What must a good Agent Skill's `description` field contain, and in which grammatical person should it be written?",
    assertions: [
      { name: 'both what it does AND when to use', re: /when to use|when to|both[^.\n]{0,40}what/i },
      { name: 'third person', re: /third[- ]person/i },
      { name: 'concrete trigger phrases', re: /trigger/i }
    ],
    rubric:
      'House rubric (DESC): a description must state BOTH what the skill does AND when to use it, in the THIRD person (never first/second), with concrete trigger keywords/phrases a user would say, and it should lean toward firing. A correct answer names what+when, third person, and trigger phrases.'
  },
  {
    skill: 'knowledgeislands-skills',
    id: 'skills-size-cap',
    prompt: 'How long should a SKILL.md body be, and what should go elsewhere if it exceeds that?',
    assertions: [
      { name: '~500 line cap', re: /500/ },
      { name: 'token budget ~5000', re: /5,?000|5k tokens/i },
      { name: 'push detail to references/', re: /references?\/|progressive disclosure|on.demand/i }
    ],
    rubric:
      'House rubric (SIZE/REF): the SKILL.md body stays under ~500 lines and ~5,000 tokens; rarely-used detail moves into on-demand `references/` files (progressive disclosure), with SKILL.md an overview that routes to them. A correct answer gives the ~500-line / ~5,000-token caps and says move detail to references/.'
  },
  {
    skill: 'knowledgeislands-skills',
    id: 'skills-linking',
    prompt: 'Inside a SKILL.md, should I link with Obsidian [[wikilinks]] or relative markdown links, and how should I refer to another skill?',
    assertions: [
      { name: 'relative markdown links, not wikilinks', re: /relative[^.\n]{0,30}(markdown )?link|(not|never|avoid)[^.\n]{0,20}wikilink/i },
      { name: 'refer to another skill by name', re: /by (its )?name|by `?name`?/i }
    ],
    rubric:
      'House rubric (LINK): a SKILL.md uses standard relative markdown links, NEVER wikilinks; it refers to another skill by its `name` (not a file path), because a skill\'s on-disk location is not stable but its name is how it loads. A correct answer says relative-not-wikilinks and refer-to-skills-by-name.'
  }
]
