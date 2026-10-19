/**
 * Eval scenarios for the `ki-authoring` skill.
 *
 * Each scenario probes a *house-specific* convention the skill owns — chosen so a
 * skill-less baseline (which still sees the user's ambient CLAUDE.md) cannot
 * already answer it. The global CLAUDE.md states the headline "wide table →
 * footnote" rule, so we deliberately do NOT test that; we test the rules it says
 * "live in the skill": the footnote-marker SERIES, the GFM preference +
 * angle-bracket form, TOML presentation, and knowledge-promotion routing.
 *
 * Assertions are regexes over the answer text — the deterministic half of the
 * hybrid score. The `rubric` is handed to the LLM judge for the qualitative half.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    // FINDING (3-model matrix, --runs 3) → RESOLVED: treatment originally scored
    // ~0/5 on every model — the marker SERIES lived only in
    // references/standards/markdown.md, which a headless one-shot agent doesn't
    // open even with --add-dir (a real progressive-disclosure limit). The
    // skill-design call was made: the series is now stated inline in the
    // ki-authoring SKILL.md body (a judgment convention, which the
    // skill is meant to carry), so it is reachable one-shot. The worked example,
    // gotchas, and rationale stay in the reference. This scenario now measures
    // that the inlined series surfaces. See evals/README.md.
    skill: 'ki-authoring',
    id: 'footnote-marker-series',
    prompt:
      'I am adding footnotes beneath several markdown tables in our docs (each has a cell with too much content). What exact footnote-marker series should we use, and in what order? List the markers.',
    assertions: [
      { name: 'dagger †', re: /†/ },
      { name: 'double-dagger ‡', re: /‡/ },
      { name: 'section §', re: /§/ },
      { name: 'pilcrow ¶', re: /¶/ },
      { name: 'second series ※', re: /※/ }
    ],
    rubric:
      'House convention: a too-long table cell moves to a footnote with a marker. The marker SERIES, in order, is † (dagger), ‡ (double dagger), § (section), ¶ (pilcrow), ‖ (parallel), then doubled (††, ‡‡, …) — Chicago-style, omitting * (it collides with markdown emphasis). A visually distinct SECOND series, for a separate footnote category in the same table, is ※ ❡ ¤ ¥. A correct answer gives this dagger series in order; a poor one invents generic markers (*, [^1], plain numbers).'
  },
  {
    skill: 'ki-authoring',
    id: 'link-style',
    prompt:
      'What Markdown flavour and internal-link form should I prefer in Knowledge Islands documentation and KB notes? How should I handle existing wikilinks and Obsidian %20 spaces?',
    assertions: [
      { name: 'prefers GFM', re: /GFM|GitHub[- ]flavou?red/i },
      { name: 'recommends relative links', re: /relative (markdown )?link/i },
      { name: 'angle-bracket destinations', re: /angle[- ]bracket|\(<[^>\n]+>\)/i },
      { name: 'supports existing flavours', re: /support|tolerat|remain|existing/i },
      { name: 'normalises encoded spaces', re: /%20|encoded space/i }
    ],
    rubric:
      'GFM is preferred across documentation and KB notes. House links are descriptive and note-relative, in angle brackets; normalise Obsidian %20 spaces within destinations without globally decoding other escapes. Existing flavours and wikilinks remain supported and never fail merely for syntax. Whole-file conversion uses the converter once available; refusal is flagged or an approved exception recorded, and constructs with no GFM equivalent need a decision. No per-note flavour field is required.'

  },
  {
    skill: 'ki-authoring',
    // TOML presentation must not rename configuration identifiers or change table
    // topology; those semantic decisions belong to ki-repo. This tests only the
    // value formatting that this skill actually owns.
    id: 'toml-style',
    prompt:
      "Rewrite this TOML snippet for readable value presentation only. Preserve every key and table name exactly. Reply with only the corrected TOML, no explanation:\n\n[release-policy]\nvisibility = 'private'\ntopics = ['mcp','bun']\n",
    assertions: [
      { name: 'preserves the declared table identity', re: /\[\s*release-policy\s*\]/ },
      { name: 'double-quoted value', re: /\bvisibility\s*=\s*"private"/ },
      { name: 'inline double-quoted array', re: /\[\s*"mcp"\s*,\s*"bun"\s*\]/ }
    ],
    rubric:
      'House TOML presentation: preserve existing key and table identity; strings are double-quoted and short arrays use the inline ["a", "b"] form. `ki-repo` owns configuration semantics such as key/table naming and topology. Score exact preservation plus these value-formatting moves, not a renamed table or generic prose.'
  },
  {
    skill: 'ki-authoring',
    id: 'knowledge-promotion-routing',
    prompt:
      'We learned a stable rule that applies across several Knowledge Islands repositories, but it is not an unfinished task. Where should it live, and what should happen to duplicate repository copies?',
    assertions: [
      { name: 'routes to a shared standard, reference, or decision', re: /shared (standard|reference)|decision record|owning ki-/i },
      { name: 'requires evidence and scope before durable write', re: /scope|evidence|confirm|approval/i },
      { name: 'reconciles duplicate repository copies', re: /replace|remove|pointer|duplicate/i }
    ],
    rubric:
      'Knowledge-promotion placement ladder: a cross-repository rule, source, decision, or method belongs in its owning shared ki-* standard/reference or decision record after scope and evidence are assessed and the durable write is confirmed. Reconcile lower-layer duplicates by removing them or replacing them with a pointer, unless they serve a distinct audience. It is not roadmap work.'
  }
]
