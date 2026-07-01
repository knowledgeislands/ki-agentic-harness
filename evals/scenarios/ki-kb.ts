/**
 * Eval scenarios for the `ki-kb` skill — the Knowledge Islands zone
 * model. Each probes a house-specific rule (zone routing, the zone set, the digest
 * path) a skill-less baseline wouldn't know from general knowledge.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-kb',
    id: 'kb-routing',
    prompt:
      'In a Knowledge Islands base, where does each of these go: (a) an active, in-progress workstream, (b) settled internal knowledge about our methodology, (c) external reference material that would exist without this base? Name the top-level zone for each.',
    assertions: [
      { name: 'active work → Streams', re: /\bStreams\b/ },
      { name: 'settled internal → Pillars', re: /\bPillars\b/ },
      { name: 'external → Resources', re: /\bResources\b/ }
    ],
    rubric:
      'House zone model: active/in-progress work → Streams/; settled internal knowledge → Pillars/ (migrates there from Streams once settled); external reference that would exist without this base → Resources/. A correct answer maps all three (Streams, Pillars, Resources) accordingly.'
  },
  {
    skill: 'ki-kb',
    id: 'kb-zone-set',
    prompt: 'What are the top-level folders of a Knowledge Islands base, and which of them are zones vs. staging areas?',
    assertions: [
      { name: 'names the five zones', re: /Calendar[\s\S]*Pillars[\s\S]*Resources[\s\S]*Streams[\s\S]*Admin|Admin[\s\S]*Calendar/i },
      { name: 'Admin is a zone', re: /\bAdmin\b/ },
      { name: '+ / - are staging, not zones', re: /(`?\+`?|`?-`?)[^.\n]{0,40}(staging|inbound|outbound|not (a )?zone)/i }
    ],
    rubric:
      'House structure: FIVE zones — Calendar, Pillars, Resources, Streams, Admin — each with a same-name index note; flanked by `+` (inbound) and `-` (outbound) STAGING areas, which are not zones and carry no same-name index. A correct answer lists the five zones and identifies + / - as staging rather than zones.'
  },
  {
    skill: 'ki-kb',
    id: 'kb-digest-path',
    prompt: 'I want to save a session digest in a Knowledge Islands base. What is the exact destination path and required frontmatter?',
    assertions: [
      { name: 'outbound _DIGESTS path', re: /-\/_DIGESTS\/|_DIGESTS/ },
      { name: 'type: session-digest', re: /session-digest/ },
      { name: 'retain_until frontmatter', re: /retain_until/ }
    ],
    rubric:
      'House convention: a session digest is written to `-/_DIGESTS/<UTC timestamp> <Short Topic>.md` (timestamp YYYY-MM-DDTHHMMSSZ), with frontmatter `type: session-digest` and `retain_until: YYYY-MM-DD` (default ~30 days out). A correct answer gives the `-/_DIGESTS/` outbound location and both frontmatter keys.'
  }
]
