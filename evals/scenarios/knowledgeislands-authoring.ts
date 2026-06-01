/**
 * Eval scenarios for the `knowledgeislands-authoring` skill.
 *
 * Each scenario probes a *house-specific* convention the skill owns — chosen so a
 * skill-less baseline (which still sees the user's ambient CLAUDE.md) cannot
 * already answer it. The global CLAUDE.md states the headline "wide table →
 * footnote" rule, so we deliberately do NOT test that; we test the rules it says
 * "live in the skill": the footnote-marker SERIES, the wikilink prohibition +
 * angle-bracket form, and the house TOML style.
 *
 * Assertions are regexes over the answer text — the deterministic half of the
 * hybrid score. The `rubric` is handed to the LLM judge for the qualitative half.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    // FINDING (3-model matrix, --runs 3) → RESOLVED: treatment originally scored
    // ~0/5 on every model — the marker SERIES lived only in
    // references/markdown-authoring.md, which a headless one-shot agent doesn't
    // open even with --add-dir (a real progressive-disclosure limit). The
    // skill-design call was made: the series is now stated inline in the
    // knowledgeislands-authoring SKILL.md body (a judgment convention, which the
    // skill is meant to carry), so it is reachable one-shot. The worked example,
    // gotchas, and rationale stay in the reference. This scenario now measures
    // that the inlined series surfaces. See evals/README.md.
    skill: 'knowledgeislands-authoring',
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
    skill: 'knowledgeislands-authoring',
    id: 'link-style',
    prompt:
      'Inside a SKILL.md or README.md file (a documentation file, NOT note content inside a base), should I use Obsidian [[wikilinks]] or relative markdown links to point at another file? And how do I link to a file whose path contains spaces?',
    assertions: [
      { name: 'recommends relative links', re: /relative (markdown )?link/i },
      { name: 'rejects wikilinks', re: /(never|avoid|not|don.?t|rather than|instead of|over)\b[^.\n]{0,40}wikilink/i },
      { name: 'angle-bracket form for spaces', re: /angle[- ]bracket|\(<[^>\n]+\s[^>\n]+>\)/i }
    ],
    rubric:
      'House convention: use standard RELATIVE markdown links, NEVER Obsidian wikilinks ([[…]]) — wikilinks break when a file is relocated, symlinked, or read outside the base. For a path containing spaces, use the CommonMark ANGLE-BRACKET form: [text](<path with spaces.md>). A correct answer says relative-not-wikilinks AND gives the angle-bracket form for spaces.'
  },
  {
    skill: 'knowledgeislands-authoring',
    id: 'toml-style',
    prompt:
      "Bring this `.ki-config.toml` snippet to our house TOML style:\n\n[KnowledgeIslands-Repo]\nVisibility = 'private'\nExtraTopics = 'mcp','bun'\n",
    assertions: [
      { name: 'skill-named lowercase table', re: /\[knowledgeislands-repo\]/ },
      { name: 'lowercase key', re: /\bvisibility\s*=/ },
      { name: 'double-quoted string', re: /"private"/ },
      { name: 'inline double-quoted array', re: /\[\s*"mcp"\s*,\s*"bun"\s*\]/ }
    ],
    rubric:
      'House TOML style: keys are lowercase snake_case; strings are double-quoted; short arrays use the inline ["a", "b"] form; there is one table per skill, named for the skill in lowercase ([knowledgeislands-repo]); non-obvious keys get a # comment above them. A correct conform of the snippet uses [knowledgeislands-repo], a lowercase `visibility` key, "private" double-quoted, and an inline double-quoted array.'
  }
]
