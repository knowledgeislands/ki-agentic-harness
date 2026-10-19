/**
 * Eval scenarios for the `ki-skills` skill — the Agent Skills rubric.
 * Each probes a house/standard rule (the declared-not-forked variation shape,
 * the size cap, the relative-not-wikilinks rule) the skill encodes — house-arbitrary
 * conventions a skill-less baseline can't derive.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    // A repository variation is declared in configuration and standing guidance;
    // it never forks a standard skill's universal modes. This tests the current
    // declared-not-forked contract, not the retired base-coupled extension pattern.
    skill: 'ki-skills',
    id: 'skills-declared-variation',
    prompt:
      'Our repository needs a base-specific variation of an existing standard skill. Should we fork the skill and copy its AUDIT/CONFORM/EDUCATE/REFRESH modes, or where should the variation be represented?',
    assertions: [
      {
        name: 'does not fork or copy the shared modes',
        re: /(do not|never|avoid|rather than)[^.\n]{0,50}(fork|copy)[^.\n]{0,50}(mode|skill)|no[^.\n]{0,30}(fork|extension)/i
      },
      {
        name: 'declares the variation in configuration or standing guidance',
        re: /(declare|configuration|\.ki\.toml|standing guidance|AGENTS\.md|CLAUDE\.md)/i
      },
      { name: 'generalises a behaviour that declaration cannot express', re: /generaliz|standard|refresh candidate/i }
    ],
    rubric:
      'House standard (skill shape): a base variation is declared rather than forked — configuration data belongs in that repository’s `.ki.toml` table and standing prose in its AGENTS.md or runtime guidance. Do not copy a standard skill’s universal governance modes into a base-coupled extension. A genuinely base-specific behaviour that cannot be declared is a REFRESH candidate to generalise into the standard. Score the decision and routing, not generic advice about writing skills.'
  },
  {
    skill: 'ki-skills',
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
    skill: 'ki-skills',
    id: 'skills-linking',
    prompt:
      'Inside a SKILL.md, what link form should I use, how does the GFM preference apply to KB notes, and how should I refer to another skill?',
    assertions: [
      {
        name: 'relative markdown links, not wikilinks',
        re: /relative[^.\n]{0,30}(markdown )?link|(not|never|avoid)[^.\n]{0,20}wikilink/i
      },
      { name: 'refer to another skill by name', re: /by (its )?name|by `?name`?/i }
    ],
    rubric:
      "House rubric (LINK): a SKILL.md uses standard relative markdown links, NEVER wikilinks; it refers to another skill by its `name` (not a file path), because a skill's on-disk location is not stable but its name is how it loads. KB notes also prefer GFM with note-relative angle-bracket Markdown links, while existing wikilinks remain supported. A correct answer gives the SKILL.md relative-link rule, the shared GFM preference without inventing a KB wikilink mandate, and refer-to-skills-by-name."
  }
]
