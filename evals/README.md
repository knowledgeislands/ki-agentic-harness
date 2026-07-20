# Skill evals

A quick way to check that a skill **actually changes what the model does** — not just that its `SKILL.md` is well-formed (that part is what `ki:skills:audit` checks). This is the behavioural half of what the `ki-skills` rubric asks of a skill.

The idea is simple: take a question the skill is meant to help with, ask the model **twice** — once with the skill off, once with it on — and compare. If the skill is pulling its weight, the "on" answer should be clearly better.

It's a **rough signal, not a gate.** The model's output varies from run to run, so treat it as a sanity check (a WARN), never a build blocker.

## Run it

```bash
bun run ki:eval                        # all scenarios, on Sonnet
bun run ki:eval --model opus           # pick a model: sonnet | opus | haiku
bun run ki:eval --scenario toml-style  # just one scenario
bun run ki:eval --runs 3               # repeat 3× and average — steadier signal
```

It drives your local `claude` CLI (no API key needed), so each run spends a little of your normal quota. The summary prints the rough cost.

## How it works

For each scenario it asks the same question twice, in a throwaway directory:

- **without the skill** — the `Skill` tool is blocked, so no skill can load. This is the "before".
- **with the skill** — the skill is loaded and allowed to read its own `references/` files. This is the "after".

Then it scores both answers two ways:

- **assertions** — plain regex checks for the specific facts the skill should produce (e.g. the exact zone names). The hard signal.
- **judge** — a second model rates each answer 0–5 against the scenario's rubric. The soft signal.

Each scenario ends with a verdict — **skill helped / regressed / no difference** — and the run prints a summary.

## Reading a result — three things to keep in mind

1. **It wobbles.** One run is a hint, not proof. Use `--runs 3` (or more) to average out the noise before trusting a result.
2. **"No difference" is sometimes the honest answer.** Both runs still load your normal `~/.claude/CLAUDE.md`, so the score measures the skill's value _on top of_ what the model already knows. If a fact is just common knowledge, the skill can't improve on it — "no difference" is correct, not a fault. So aim scenarios at things the model _couldn't_ already know (see below).
3. **Deep detail in `references/` only helps if the model opens it.** A one-shot run reads a reference file only if it decides to. A scenario can score low purely because the model never opened the reference — which is itself worth knowing: it usually means that detail should move into the main `SKILL.md`.

## Adding scenarios

One file per skill in `scenarios/` (e.g. `scenarios/ki-kb.ts`), each exporting a list of scenarios. A scenario is just three things: a **prompt**, some regex **assertions**, and a judge **rubric**. Copy an existing file for the shape, then add it to the `ALL` list in [`harness.ts`](harness.ts).

Aim for **3+ per skill**, and test your **house-specific** names, paths, and rules — not general best practice, which the model knows with or without the skill.

## Where it stands

Nearly every skill has scenarios — `agents`, `authoring`, `engineering`, `kb`, `mcp`, `repo`, `skills`, `streams`, `tokenomics`, `website`, `website-cloudflare`, `bootstrap`, `binding`, plus `decision-records`, `feature-definitions`, `handoffs`, `repo-roadmap`, `kb-activities`, `kb-live-artifacts`, and `housekeeping`. The matrix run across Haiku, Sonnet, and Opus covered the original set, and the result in one line was: **on house-specific facts, loading a skill reliably takes the model from "I don't know" to the right answer — on every model.** That's the whole point, confirmed. The newer sets are not yet in a matrix run — re-run `bun run ki:eval` to regenerate `evals/results/`.

## The user-guide suite (a deterministic gate)

Separate from these behavioural evals is [`guide-suite.ts`](guide-suite.ts) — a **deterministic** test included in the repository's bare `test` suite. It **extracts the fenced command blocks from [`docs/guides/user-guide/onboarding.md`](../docs/guides/user-guide/onboarding.md)** and runs the documented onboarding steps against in-harness fixtures — a greenfield repo and a legacy one — driving the bootstrap chain with **no skills installed**, then asserts each fixture ends in the documented state (vendored script copies, standalone `.ki/bin` entrypoints, a working `ki:audit` aggregate, and the explicitly declared dependency set). Because the commands are the guide's own, the guide cannot drift from what actually works. Unlike the evals below it is a hard pass/fail gate, not an advisory signal. The ultimate field validation remains migrating a real sibling repo by the same guide.

The one skill left uncovered is **`ki-harness`, and that is by design.** Its assertions are pure bundle _structure_ (the five-part layout) that `audit-harness.ts` already checks mechanically — and the no-skill-baseline method here rewards a recallable house _fact_, so a behavioural eval would add little over the checker. (If a planted-violation scenario is ever shown to clear the "the model couldn't already know this" bar, this is the place to revisit — see reading note 2 above.)

**For routine runs, use Sonnet — it's the most cost-effective arm.** A full matrix (every scenario × 3 runs) costs roughly **$9 on Haiku, $23 on Sonnet, $34 on Opus** at the original scenario count. Opus gives no cleaner signal than Sonnet for about 50% more, so keep it for occasional confirmation; Sonnet is a representative, trustworthy model at a sensible price. (Haiku is cheapest and did well here, but a stronger model is the safer regression proxy.) Run results aren't checked in — they're regeneratable, so just re-run `bun run ki:eval`.
