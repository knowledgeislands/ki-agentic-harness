/**
 * Eval scenarios for the `ki-bootstrap` skill — the install keystone.
 *
 * Design note: a capable model knows symlinks and gitignore generically, so testing that
 * shows "no difference". These scenarios target house-ARBITRARY specifics a baseline
 * cannot derive: the declared-coverage + repo/authoring baseline, the committed-artifacts
 * (script + gitignore line, never runtime payloads) rule, and why the global process set is small.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-bootstrap',
    id: 'boot-baseline',
    prompt:
      "When publishing a Knowledge Islands repo's project-local runtime skills, which skills are copied — and which two are always included even if the repo declares no coverage tables in its `.ki-config.toml`?",
    assertions: [
      { name: 'declared coverage from .ki-config tables', re: /declared coverage|\[ki-|coverage table|\.ki-config\.toml/i },
      { name: 'repo + authoring baseline', re: /ki-repo[^.\n]{0,30}ki-authoring|repo[^.\n]{0,8}\+[^.\n]{0,8}authoring|authoring[^.\n]{0,8}\+[^.\n]{0,8}repo/i },
      {
        name: 'keystone never project-local',
        re: /keystone[^.\n]{0,30}(never|not)[^.\n]{0,20}(project-local|copied)|global[^.\n]{0,20}only|never[^.\n]{0,20}project-local/i
      }
    ],
    rubric:
      "House model: a repo's runtime skill directory mirrors its **declared coverage** — the `[ki-<skill>]` tables in its `.ki-config.toml` — **plus a baseline of `ki-repo` + `ki-authoring`**, always, so a greenfield repo with no tables can still reach repo's EDUCATE and Markdown/TOML style is always governed. The keystone (`ki-bootstrap`) itself is **never copied project-local** because the user installer provides it globally. A correct answer names declared-coverage-from-the-config plus the repo + authoring baseline."
  },
  {
    skill: 'ki-bootstrap',
    id: 'boot-committed-artifacts',
    prompt:
      'Our project-local runtime skill copies under `.claude/skills/` are gitignored. So what actually gets committed to make publication reproducible on a fresh clone, and why are the copies not committed?',
    assertions: [
      { name: 'ki:skills:copy:project script committed', re: /skills:copy:project/i },
      { name: '.gitignore line committed', re: /\.gitignore/i },
      { name: 'copies regenerated', re: /regenerat|gitignored|bootstrap/i }
    ],
    rubric:
      'House rule: normal runtime payloads are **regular-file copies, gitignored and regenerated**. The **committed artifacts are the `ki:skills:copy:project` package.json script and the `.gitignore` line** — never the generated copies themselves. A correct answer names the committed copy script and the gitignore entry, and explains that repository bootstrap reproduces the copies.'
  },
  {
    skill: 'ki-bootstrap',
    id: 'boot-why-global',
    prompt: 'Why does `/harness/install` globally install only `ki-bootstrap` and the four process skills, while governance skills remain project-local?',
    assertions: [
      { name: 'keystone and process skills', re: /ki-bootstrap|keystone/i },
      { name: 'global description paid every turn', re: /every turn|standing (cost|description)|paid[^.\n]{0,20}(turn|everywhere)/i },
      { name: 'others project-local, load where applicable', re: /project-local[^.\n]{0,40}(load|appl|only)|load only where/i }
    ],
    rubric:
      "House reasoning (a tokenomics decision): a global skill's `description` is paid on **every turn everywhere**, so the global set is **minimal** — the `ki-bootstrap` keystone plus the four lightweight process skills used across repositories. Governance skills remain **project-local**, loading only in repos that declare them. A correct answer ties the small global set to the every-turn description cost and states governance skills load only where they apply."
  }
]
