# Next-work procedure

_On-demand procedure for `ki-next`. The kind, scope, and relationship map live in [`SKILL.md`](../SKILL.md) and are already loaded; this file is the executable decision procedure._

## 1. Preflight and grounding

1. Resolve the current git repository physically and read its `.ki-config.toml` when present. If `repo_type = "kb"`, stop: Knowledge Bases select work through `ki-kb-streams` proposals rather than this process.
2. Ask `ki-repo-roadmap` to identify the simple or thematic profile. Run its read-only AUDIT through the repository's declared script or its vendored checker. Stop on any FAIL or WARN; name the repair route, but do not run CONFORM or repair unrelated state.
3. Read the canonical source of truth: root `ROADMAP.md` for the simple profile; each `docs/roadmap/<theme>/ROADMAP.md` and its `plans/` directory, plus the generated root projection, for the thematic profile. In the thematic profile, derive active plans and dependencies from plan frontmatter before ranking items.
4. If the user continues from a current `ki-recap`, use only its grounded outstanding work, learning routes with their approval status, and Specific actions as context. Re-check every dynamic roadmap claim now; an unapproved route remains a proposal, and a roadmap item parked during recap is not automatically a candidate. Do not scan stored or historical transcripts. A recap is optional: without one, ground the same facts directly.

## 2. Optional relevance review

Run this pass when `--review` is supplied, or briefly when the grounded view shows a material concern. Identify only evidence-backed proposals:

- stale or obsolete work;
- duplicates or work already covered by an active plan;
- a Waiting condition that has changed;
- changed dependencies or an item placed in the wrong horizon.

State the evidence, the proposed wording or placement, and the effect on selection. Do not remove, move, or rewrite anything until the user confirms the exact authored change. A relevance proposal can be declined without ending the selection process.

## 3. Staged candidate loop

Apply the readiness rules in `ki-repo-roadmap`; do not invent a local substitute.

1. **Blocking and Next.** Gather items that are ready to start and not blocked by an active plan dependency. Reuse a valid existing plan rather than creating a duplicate. If any qualify, rank and present them; do not inspect later horizons for planning candidates.
2. **Soon.** Only when no eligible Blocking or Next item exists, assess Soon items against the governance-owned Next entry rule: actionable scope, understood dependencies, and readiness to start. Present the viable options. After the user confirms an item, wording, and order, move it to Next as an authored roadmap edit, regenerate derived views, re-run AUDIT, and restart from Blocking and Next. Never create a plan while the item remains Soon.
3. **Future.** Only when Soon is empty or has no viable candidate, inspect Future items. For a selected candidate, do the minimum scoping needed to state an intended outcome and boundary. Present that proposed wording and Future-to-Soon move. After confirmation, make the authored edit, regenerate and audit, then restart in Soon. A second readiness evaluation and confirmation are required before any Soon-to-Next move. If no candidate can meet the Soon entry rule, report that no eligible work exists; do not manufacture an item.
4. **Waiting for.** It never becomes a candidate merely because the immediate queue is empty. Reconsider it only when its named external condition has changed, then present the proposed re-entry horizon and the evidence for confirmation.

After every confirmed transition, return to the destination horizon's evaluation rather than assuming that an earlier assessment is still valid.

## 4. Rank and confirm

For each viable option, give a compact evidence-backed comparison covering expected benefit, leverage, risk reduction, delivery cost, reversibility, readiness, and dependency availability. Do not collapse these into a misleading single score. Preserve any order the user supplies.

Before writing, show:

- selected item or existing plan;
- proposed horizon transition and exact wording changes;
- the proposed order and dependency implications;
- existing-plan reuse or the new `<theme>/<id>` plan location.

Require explicit confirmation for the exact set and order. Write only the approved authored transitions, then regenerate and audit projections. Invoke `ki-plan` only once a confirmed item is in Blocking or Next. `ki-plan` creates or revises the plan under its own lifecycle contract; `ki-next` then stops for plan review rather than beginning implementation.

## 5. Scenario checks

Apply these behavioural checks whenever the process changes:

| Scenario | Required result |
| --- | --- |
| Eligible Blocking or Next work exists | Evaluate it before every later horizon; do not promote later work. |
| No immediate candidate, but a Soon item is ready | Confirm and move it to Next, regenerate/audit, then re-evaluate it there before planning. |
| No Soon candidate, but a Future candidate can be scoped | Confirm Future-to-Soon wording and move; re-evaluate in Soon, then separately confirm any Next move. |
| Future candidate cannot meet Soon entry | Leave it in Future and report no eligible work. |
| Waiting condition changed | Present the evidence and proposed re-entry; do not move it automatically. |
| Existing valid plan covers selected work | Reuse it and respect its cross-theme dependency edges. |
| Current recap offers a handoff | Re-audit the roadmap; use only grounded action labels and approval state as context, never as authority to write. |
| Recap contains an unapproved learning route | Keep it a proposal; do not write it while selecting or planning work. |
| User rejects a proposal | Leave roadmap and plans untouched. |
| KB repository | Stop and route to `ki-kb-streams`. |

## 6. Finish

Report the confirmed result, exact roadmap and plan files changed, and the audit result. If plans were created or revised, ask for their review; do not begin execution. If no work is eligible, say so plainly and identify the required external condition or scoping decision.
