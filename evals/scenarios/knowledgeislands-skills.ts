/**
 * Eval scenarios for the `knowledgeislands-skills` skill — the Agent Skills rubric.
 * Each probes a house/standard rule (the standard-vs-base-coupled-extension shape,
 * the size cap, the relative-not-wikilinks rule) the skill encodes — house-arbitrary
 * conventions a skill-less baseline can't derive.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    // Replaces the former `skills-description` scenario — that probed generic
    // "what goes in a description" advice a skill-less baseline already knows
    // (matrix: baseline ~2.7-3.0/3, no real lift). This targets a house-ARBITRARY
    // distinction the skill owns (rubric area SHAPE) that a baseline can't derive.
    skill: 'knowledgeislands-skills',
    id: 'skills-shape',
    prompt:
      "In this skill collection we distinguish a 'standard' skill from a 'base-coupled extension'. What is each, and how does an extension reuse a standard skill's shared modes?",
    assertions: [
      { name: 'standard resolves base bindings at runtime / no hard-coded base', re: /(resolv|bind)[^.\n]{0,40}runtime|hard.?codes? no|no (single )?(hard.?coded )?base/i },
      { name: 'extension supplies base bindings / delegates shared modes', re: /(supplies|provides|carries|holds)[^.\n]{0,30}base|delegat/i },
      { name: 'reuses the standard skill by name', re: /by (its )?`?name`?|reference[^.\n]{0,20}name/i }
    ],
    rubric:
      'House rubric (SHAPE-1/2): a STANDARD KI skill resolves its base bindings at runtime and hard-codes no single base, so it installs anywhere; a BASE-COUPLED EXTENSION supplies only the base-specific bindings and delegates the shared governance modes (AUDIT/CONFORM/REFRESH) to a standard skill, referencing it BY NAME (not a file path, since on-disk location is not stable). A correct answer draws this standard-vs-extension distinction and says the extension reuses the standard skill by name.'
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
