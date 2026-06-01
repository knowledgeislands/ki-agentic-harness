# Skill evals

Behavioural validation for the skills — the complement to the linters. Where `skills:lint` checks a `SKILL.md`'s _form_, this harness checks whether loading a
skill actually _changes a model's output_ for the better. It realises rubric **PROC-1/2** from the `knowledgeislands-skills` skill: evaluation scenarios scored
**with and without the skill loaded**.

It is **advisory** — non-deterministic, a WARN-grade signal, never a build gate.

## Run it

```bash
bun run eval                      # every scenario on sonnet (judge: sonnet)
bun run eval --model opus         # another model (sonnet | opus | haiku | full id)
bun run eval --scenario toml-style   # one scenario by id
bun run eval --judge-model opus   # score with a different judge
```

Uses the local **`claude` CLI** (no API key — your existing Claude Code auth). Each run spends tokens on your quota; the summary prints the approximate cost.

## How it works

For each scenario the harness runs the same prompt twice through `claude -p`, in an isolated temp cwd:

- **baseline** — `claude -p <prompt> --disable-slash-commands` — skills off.
- **treatment** — `claude -p "/<skill> <prompt>" --add-dir ~/.claude/skills` — the skill loaded, and allowed to read its own reference files.

Then it scores both, **hybrid**:

- **deterministic** — regex assertions over the answer (the skill's checkable house rules). The primary signal.
- **judge** — an LLM scores each answer 0–5 against the scenario's `rubric`. The qualitative signal.

A scenario reports **skill helped / regressed / no measurable difference** from the deltas, and the run prints a summary.

## Reading the results — three honest caveats

1. **Non-deterministic.** Output varies run to run; a single run is indicative, not conclusive. Re-run (or, later, average N runs) before trusting a signal. In
   validation runs the TOML scenario flipped between "helped" and "regressed" across two runs — that variance is the point of the WARN-grade framing.
2. **In-situ, marginal baseline.** `claude -p` still loads the user's ambient `~/.claude/CLAUDE.md` in **both** arms (auth here is OAuth, so `--bare`, which
   would suppress it, is unavailable). So the score is the skill's **marginal** value _over whatever the ambient context already supplies_ — a conservative bar.
   A skill installed on a clean machine (no such `CLAUDE.md`) would tend to show **more** value than the number here. Scenarios are chosen to probe rules the
   ambient context does not already give away.
3. **Skill value depends on the model reading references.** A skill's deepest conventions often live in `references/`, which a one-shot agent reads only if it
   decides to. The `--add-dir` lets it; whether it does is part of what's being measured. (The footnote-marker scenario scores ~0 without `--add-dir` and ~4/5
   with it — a real finding about progressive disclosure in headless use.)

## Layout & adding scenarios

```text
evals/
├── harness.ts                 # runner + hybrid scorer + reporter
└── scenarios/
    └── knowledgeislands-authoring.ts   # Scenario[] for one skill
```

To add a skill's scenarios: create `scenarios/<skill>.ts` exporting a `Scenario[]` (see the authoring file for the shape — `prompt`, regex `assertions`, and a
judge `rubric`), then spread it into `ALL` in [`harness.ts`](harness.ts). Aim for ≥ 3 scenarios per skill (PROC-1), targeting house-specific rules a skill-less
baseline wouldn't already know.

## Status & next steps

This is the **first vertical slice**: one skill (`knowledgeislands-authoring`), three scenarios, on one model — enough to prove the pipeline. Still open
(tracked on the [ROADMAP](../ROADMAP.md)):

- Scenarios for the other four skills.
- A pass across **Haiku / Sonnet / Opus** (PROC-2) — the harness already takes `--model`; the matrix just needs running.
- `--runs N` averaging to damp the non-determinism into a stabler score.
