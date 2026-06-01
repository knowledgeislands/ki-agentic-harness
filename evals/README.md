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
   decides to. The `--add-dir` lets it; whether it does is part of what's being measured. The 3-model matrix made this concrete: `footnote-marker-series` scores
   ~0/5 on **every** model even **with** `--add-dir`, because a headless one-shot `claude -p` agent doesn't open the reference file the marker series lives in.
   A reference-gated convention can be effectively unreachable one-shot — a real progressive-disclosure limit, not a harness fault (see
   [results/MATRIX.md](results/MATRIX.md)).

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

## Status

All **five skills** have **three scenarios** each (`scenarios/*.ts`); the harness has `--runs N` averaging and `--model` / `--skill` / `--scenario` filters.

**PROC-1/2 are satisfied.** The full **Haiku / Sonnet / Opus** matrix has been run at `--runs 3` — the curated result is in
[results/MATRIX.md](results/MATRIX.md) (per-model raw logs alongside it). Every scenario probing a house-_arbitrary_ fact goes baseline 0/3 → treatment 3/3,
judge 0 → 5 on all three models; the set's core value is model-independent. Cost scales ~3.5× from Haiku to Opus, so **Sonnet is the routine regression arm**
and Opus is reserved for periodic confirmation.

Re-run anytime: `bun run eval --runs 3` (Sonnet) or `--model opus` / `--model haiku`. The matrix surfaced two specification artefacts, since handled:
`link-style` was tuned (its prompt now scopes to a doc file, removing a base-content ambiguity), and `footnote-marker-series` is documented as a
progressive-disclosure limit (reference-gated, unreachable one-shot) — a skill-design call, kept as-is to keep measuring it. `skills-description` remains a
low-signal general-knowledge probe, a candidate to replace if the suite is tightened.
