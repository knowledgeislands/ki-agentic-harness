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

- **baseline** — `claude -p <prompt> --disallowed-tools Skill` — the `Skill` tool blocked, so **no skill can load**. (`--disable-slash-commands` is _not_
  enough: a skill still auto-loads by description match, which silently contaminates the baseline with the very skill under test — a bug found and fixed during
  the first runs. Blocking the `Skill` tool is the real toggle.)
- **treatment** — `claude -p "/<skill> <prompt>" --add-dir ~/.claude/skills` — the skill loaded, and allowed to read its own reference files.

Then it scores both, **hybrid**:

- **deterministic** — regex assertions over the answer (the skill's checkable house rules). The primary signal.
- **judge** — an LLM scores each answer 0–5 against the scenario's `rubric`. The qualitative signal.

A scenario reports **skill helped / regressed / no measurable difference** from the deltas, and the run prints a summary.

## Reading the results — three honest caveats

1. **Non-deterministic.** Output varies run to run; a single run is indicative, not conclusive. Use `--runs N` to average several trials before trusting a
   signal. In early validation the TOML scenario flipped between "helped" and "regressed" across two single runs — that variance is the point of the WARN-grade
   framing, and what `--runs` damps.
2. **In-situ, marginal baseline.** `claude -p` still loads the user's ambient `~/.claude/CLAUDE.md` and auto-memory in **both** arms (auth here is OAuth, so
   `--bare`, which would suppress them, is unavailable). So the score is the skill's **marginal** value _over whatever the ambient context already supplies_ — a
   conservative bar. In practice the ambient context was verified _not_ to carry the house-internal facts the scenarios probe (the skill-blocked baseline
   answers "I don't have this information"), so the signal holds; but a "no difference" can also legitimately mean **the fact is general knowledge the model
   already has** (e.g. the `bun test` trap), which is a true finding about that scenario, not a harness fault.
3. **Skill value depends on the model reading references.** A skill's deepest conventions often live in `references/`, which a one-shot agent reads only if it
   decides to. The `--add-dir` lets it; whether it does is part of what's being measured. (The footnote-marker scenario scores ~0 without `--add-dir` and ~4/5
   with it — a real finding about progressive disclosure in headless use.)

## Layout & adding scenarios

```text
evals/
├── harness.ts                 # runner + hybrid scorer + reporter
└── scenarios/
    ├── knowledgeislands-authoring.ts   # Scenario[] — one file per skill
    ├── knowledgeislands-kb.ts
    ├── knowledgeislands-mcp.ts
    ├── knowledgeislands-repo.ts
    └── knowledgeislands-skills.ts
```

To add a skill's scenarios: create `scenarios/<skill>.ts` exporting a `Scenario[]` (see the authoring file for the shape — `prompt`, regex `assertions`, and a
judge `rubric`), then spread it into `ALL` in [`harness.ts`](harness.ts). Aim for ≥ 3 scenarios per skill (PROC-1), targeting house-specific rules a skill-less
baseline wouldn't already know.

## Status & next steps

All **five skills** now have **three scenarios** each (`scenarios/*.ts`), and the harness has `--runs N` averaging and `--model` / `--skill` / `--scenario`
filters. The pipeline is validated on Sonnet: with the corrected baseline, the `knowledgeislands-mcp` scenarios show clear "skill helped" where the skill
teaches house-internal facts (annotation presets, the access-level env var) and an honest "no difference" where the fact is general knowledge. Still open
(tracked on the [ROADMAP](../ROADMAP.md)):

- **Run the full matrix** across **Haiku / Sonnet / Opus** (PROC-2) at `--runs 3+` — the harness is ready; it's a deliberate token spend, so it's left to be
  triggered rather than run automatically. Budget ≈ (5 skills × 3 scenarios × 2 arms + judge) × 3 models × N runs.
- Tune weak scenarios as the matrix reveals them (a scenario that probes general knowledge — like the `bun test` trap — measures little; prefer house-arbitrary
  facts).
