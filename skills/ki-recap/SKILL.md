---
name: ki-recap
implies: []
description: >
  Recaps a live session in three legs — summarise what happened (changes, decisions, files touched), surface what is outstanding (unfinished threads, deferred fixes, work that belongs on ROADMAP or a `ki-plan`), and harvest the learnings (dead-ends, workarounds, conventions), routing each to its proper home. Optionally compresses the recapped span into a compact carry-forward digest. A process skill (kind: process, ADR-KI-HARNESS-SKILLS-006): it drives an action, it does not hold a standard. Installable globally, cross-repo — usable in any repo on the machine, not just this one. Triggers: "recap this session", "summarise what happened", "what's outstanding", "harvest what we learned", "/ki-recap". Not the offline, mechanical mining of historical transcripts after the fact — that is a separate ROADMAP candidate sharing this skill's grounding substrate.
argument-hint: 'recap [--compress] | help'
---

# ki-recap

**Kind:** process. Recaps a **live** session — warm, in-context, run inside the session itself. Full procedure in [references/recap.md](references/recap.md).

## What this skill does

Three legs, always in this order:

1. **Summarise** what happened this session — changes, decisions, files touched.
2. **Surface what is outstanding** — unfinished threads, deferred fixes, work that should land on `ROADMAP.md` or a `ki-plan`. A ROADMAP item **added this session** is "what happened", not outstanding.
3. **Harvest the learnings** — dead-ends, workarounds, conventions discovered in-session — and route each to its proper home: a `CLAUDE.md` learned-pattern entry (via `headroom learn`'s block, never duplicated), a skill fix or rubric criterion, a new agent, a hook, memory, or a ROADMAP/`ki-plan` item. Confirm with the user before writing anywhere durable.

Optionally, with `--compress`, add a fourth leg: write a carry-forward digest of the recapped span (Context / Decisions / Files Touched / Outstanding / Learnings-routed / Keywords). This is honestly scoped — a skill cannot rewrite its own context window; true in-context compression is the native or `PreCompact`-hook path (`ki-tokenomics`). The digest is a carry-forward artefact, not a context reduction.

A mechanical **grounding helper**, [`scripts/recap-grounding.ts`](scripts/recap-grounding.ts), resolves the session transcript and emits files-touched / tool-tally / high-cost-candidate data — it grounds the summarise and harvest legs, it does not replace judgment over them.

## Invocation

`help` / `-h` / `?` explains this skill and stops, taking no action. With no argument, run the three-leg procedure over the current session. `--compress` adds the fourth leg.

## Notes

- No universal AUDIT/CONFORM/INIT/REFRESH modes — this is a process skill (ADR-KI-HARNESS-SKILLS-001, ADR-KI-HARNESS-SKILLS-006); it has one procedure with an optional leg.
- Sibling to the offline, mechanical "mine historical sessions" ROADMAP candidate — that is the **cold** leg (after the fact, over stored transcripts); this is the **warm** leg (in-session, while context is live). They share the grounding substrate and the routing table, not an implementation.
- Installable globally (`ki:skills:link:global`), alongside `ki-bootstrap` — usable in any repo on the machine.
