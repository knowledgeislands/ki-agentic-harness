/**
 * Eval scenarios for the `knowledgeislands-bootstrap` skill — the install keystone.
 *
 * Design note: a capable model knows symlinks and gitignore generically, so testing that
 * shows "no difference". These scenarios target house-ARBITRARY specifics a baseline
 * cannot derive: the declared-coverage + repo/authoring baseline, the committed-artifacts
 * (script + gitignore line, never the symlinks) rule, and why this is the one global skill.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'knowledgeislands-bootstrap',
    id: 'boot-baseline',
    prompt:
      "When wiring a Knowledge Islands repo's project-local `.claude/skills/`, which skills get linked — and which two are always linked even if the repo declares no coverage tables in its `.ki-config.toml`?",
    assertions: [
      { name: 'declared coverage from .ki-config tables', re: /declared coverage|\[knowledgeislands-|coverage table|\.ki-config\.toml/i },
      { name: 'repo + authoring baseline', re: /knowledgeislands-repo[^.\n]{0,30}knowledgeislands-authoring|repo[^.\n]{0,8}\+[^.\n]{0,8}authoring|authoring[^.\n]{0,8}\+[^.\n]{0,8}repo/i },
      { name: 'keystone never project-local', re: /keystone[^.\n]{0,30}(never|not)[^.\n]{0,20}(project-local|linked)|global[^.\n]{0,20}only|never[^.\n]{0,20}project-local/i }
    ],
    rubric:
      "House model: a repo's `.claude/skills/` mirrors its **declared coverage** — the `[knowledgeislands-<skill>]` tables in its `.ki-config.toml` — **plus a baseline of `knowledgeislands-repo` + `knowledgeislands-authoring`**, always, so a greenfield repo with no tables can still reach repo's INIT and Markdown/TOML style is always governed. The keystone (`knowledgeislands-bootstrap`) itself is **never linked project-local** — it is the one global skill. (The harness itself is the exception that links `--all`.) A correct answer names declared-coverage-from-the-config plus the repo + authoring baseline."
  },
  {
    skill: 'knowledgeislands-bootstrap',
    id: 'boot-committed-artifacts',
    prompt:
      'Our project-local skill symlinks under `.claude/skills/` are gitignored. So what actually gets committed to make skill-linking reproducible on a fresh clone, and why not the symlinks themselves?',
    assertions: [
      { name: 'skills:link:project script committed', re: /skills:link:project/i },
      { name: '.gitignore line committed', re: /\.gitignore/i },
      { name: 'symlinks would dangle / regenerated', re: /dangl|regenerat|gitignored/i }
    ],
    rubric:
      "House rule: the links are **relative symlinks, gitignored and regenerated**. The **committed artifacts are the `skills:link:project` package.json script and the `.gitignore` line** — never the symlinks themselves, which would **dangle** on a clone that doesn't have the harness checked out beside it. A correct answer names the committed `skills:link:project` script and the gitignore entry, and explains the symlinks are regenerated (would otherwise dangle)."
  },
  {
    skill: 'knowledgeislands-bootstrap',
    id: 'boot-why-global',
    prompt: 'Why is `knowledgeislands-bootstrap` the only Knowledge Islands skill kept installed globally, while every other skill is project-local?',
    assertions: [
      { name: 'keystone', re: /keystone/i },
      { name: 'global description paid every turn', re: /every turn|standing (cost|description)|paid[^.\n]{0,20}(turn|everywhere)/i },
      { name: 'others project-local, load where applicable', re: /project-local[^.\n]{0,40}(load|appl|only)|load only where/i }
    ],
    rubric:
      'House reasoning (a tokenomics decision): the global skill\'s `description` is paid on **every turn everywhere**, so the one global skill must be **minimal** — hence bootstrap is the deliberately-tiny **keystone**, and everything else is **project-local**, loading only in the repos that declare it (keeping the standing description cost out of unrelated sessions). Keeping just the keystone global is what lets any repo self-wire its own skills. A correct answer ties "only global skill" to the every-turn description cost and states the others are project-local / load only where they apply.'
  }
]
