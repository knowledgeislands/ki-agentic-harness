/**
 * Eval scenarios for the `ki-keystone bootstrap` guidance mode.
 *
 * These target house-specific scope and trust boundaries a baseline cannot derive:
 * what first-time bootstrap installs, how harness installation differs from skill
 * activation, and why repository operations never fall back to checkout-local runners.
 */
import type { Scenario } from '../harness.ts'

export const scenarios: Scenario[] = [
  {
    skill: 'ki-keystone',
    id: 'boot-first-time-user',
    prompt:
      'What exactly does `ki bootstrap` establish for a first-time user, and what repository state does it deliberately leave alone?',
    assertions: [
      { name: 'detects agent runtimes', re: /detect[^.\n]{0,30}(agent|runtime)/i },
      { name: 'installs canonical harness', re: /(install|verified)[^.\n]{0,50}(canonical|ki-agentic-harness)/i },
      {
        name: 'activates core user skills',
        re: /(core|six)[^.\n]{0,40}user skills|user skills[^.\n]{0,40}(core|six)/i
      },
      {
        name: 'does not declare repository governance',
        re: /(does not|doesn't|never)[^.\n]{0,50}(\.ki.toml|repository|repo)/i
      }
    ],
    rubric:
      'House contract: `ki bootstrap` detects supported local agent runtimes, creates the KI XDG configuration, installs the verified canonical `knowledgeislands/ki-agentic-harness`, and activates the core user skills, `ki-keystone` and `ki-work`. `ki-delegation` is opt-in. It does not edit a repository or declare repository governance. A correct answer names both the user-environment work and the repository boundary.'
  },
  {
    skill: 'ki-keystone',
    id: 'boot-activation-scopes',
    prompt:
      'After `ki harness install example/operations`, are its skills active automatically? Explain the user-scope and repository-scope commands and what each changes.',
    assertions: [
      { name: 'installation does not activate', re: /(does not|doesn't|not)[^.\n]{0,40}(activate|active)/i },
      { name: 'user activation command', re: /ki skill add/ },
      { name: 'repository activation command', re: /ki repo skill add/ },
      { name: 'repository declaration', re: /\.ki\.toml/ }
    ],
    rubric:
      "House contract: installing a compatible harness only makes its registered capabilities available. `ki skill add <skill>` creates managed user-runtime links and records the selected provider. `ki repo skill add <skill>` updates one repository's `.ki.toml` and its managed repository-runtime links. Neither scope implies the other."
  },
  {
    skill: 'ki-keystone',
    id: 'boot-native-operation-trust',
    prompt:
      'A repository declares a governance skill that is missing from the verified installed harness set, but it still has an old local runner and a nearby harness checkout. What should `ki repo audit` do?',
    assertions: [
      {
        name: 'fail before operation',
        re: /(fail|stop|refuse)[^.\n]{0,50}(before|without)[^.\n]{0,30}(audit|operation|run)/i
      },
      { name: 'installed harness authority', re: /(verified|installed)[^.\n]{0,40}harness/i },
      { name: 'no local runner fallback', re: /(no|never|not)[^.\n]{0,50}(runner|wrapper|\.ki)/i },
      { name: 'development checkout must be explicit', re: /ki dev local (set|on)/ }
    ],
    rubric:
      'House trust boundary: repository operations resolve declared capabilities only from verified installed compatible harnesses and fail before execution when resolution is incomplete. They never fall back to `.ki` wrappers, copied runners, or a nearby checkout. A contributor may select a validated checkout only through explicit `ki dev local set <path>` followed by `ki dev local on`; this is a mutable development source, not a verified installed payload or loaded-runtime proof.'
  }
]
