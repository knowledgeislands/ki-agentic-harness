# The mechanical-checker contract

ADR: [ADR-KI-HARNESS-SKILLS-002](../../../docs/decisions/ADR-KI-HARNESS-SKILLS-002-mechanical-judgment-checker-split.md)

A checker is the deterministic half of a standard. It MUST:

- take a target path as its argument and read only that target (`bun scripts/audit-<concern>.ts <path>`);
- emit grouped findings on the **severity ladder** below, each tagged with an area, and a one-line summary tally;
- print a **remediation footer** whenever the summary is not clean (any FAIL / WARN / POLISH), naming the skill and mode that addresses it — see [The remediation footer](#the-remediation-footer);
- exit **non-zero iff any FAIL** (every other level exits 0);
- support **`--json`** (emit findings as JSON to stdout instead of the painted table) and **`--report [dir]`** (write the report under the target's `.ki-meta/audits/`, see `enforcement-framework.md` §5) — both are read-only with respect to the audited content;
- depend on **Node/Bun builtins only** — no npm dependencies;
- be **self-contained**: no imports from another skill's files. Skills are symlinked individually into a skills directory, so a cross-skill import would break once deployed. Checkers **compose by being run in sequence**, never by importing one another.

## The severity ladder

One ladder, used by **both** the checker's output and the rubric's findings table. A checker emits the subset of levels its domain warrants — not every concern uses every level.

| Level        | Group     | Blocks? | Meaning                                                                   |
| ------------ | --------- | ------- | ------------------------------------------------------------------------- |
| **FAIL**     | violation | yes     | A required criterion is violated — a ship-stopper.                        |
| **WARN**     | violation | no      | A recommended criterion is violated — should fix, can ship with a reason. |
| **POLISH**   | violation | no      | A minor or cosmetic divergence.                                           |
| **ADVISORY** | deferred  | no      | A judgment criterion the checker cannot decide — handed to the reader.    |
| **INFO**     | context   | no      | Neutral context, not a verdict against a criterion.                       |
| **NA**       | context   | no      | A criterion checked but not applicable to this target.                    |
| **PASS**     | met       | no      | A criterion is met.                                                       |

FAIL / WARN / POLISH replace the rubrics' old `blocker / standard / polish` grades; INFO replaces the ad-hoc `note` level. **ADVISORY vs WARN** is the line to hold: WARN means the checker _decided_ a soft criterion is violated; ADVISORY means it _cannot_ decide and is pointing the reader at a judgment criterion. The summary tallies FAIL / WARN / POLISH / PASS, then ADVISORY / NA; INFO is printed but not tallied.

The checker owns the mechanical criteria; everything it cannot decide deterministically is left to the judgment half, applied by reading — surfaced inline as ADVISORY where the checker can point at the specific criterion.

## The remediation footer

A checker reports; it does not fix. So when its summary is **not clean** — any FAIL, WARN, or POLISH — it MUST end its human output (not `--json`) with a one-line footer telling the reader how to address what it found: run the owning skill's judgment mode. The fix for a mechanical finding is rarely a matching mechanical edit — deciding _which_ change is right (which layer a fact belongs in, whether an overage is earned, whether a tier fits the work) is the judgment half. The footer routes the reader there instead of leaving them to hand-work the codes.

Shape — after the summary tally, on a non-clean run only:

```text
→ to address: run /<skill> CONFORM   (judgment criteria: references/audit-rubric.md)
```

Rules:

- **Non-clean only.** A clean run (PASS/INFO/NA/ADVISORY, no FAIL/WARN/POLISH) prints no footer — silence means nothing to do.
- **Name the mode, not the fix.** Point at `/<skill> CONFORM` (or the more specific mode the skill defines), never a per-finding how-to — the judgment lives in the mode and the rubric, not duplicated in checker output.
- **Suppressed under `--json`** and `--report`'s machine substrate — the footer is a human affordance; the JSON already carries the findings a composed audit merges.
- **One footer**, after the tally, regardless of how many findings fired.

## Relationship to [M]/[J] rubric tags

The rubric's `[M]` tag and the checker are two sides of the same coin: every `[M]` criterion must have a corresponding check in the checker; the checker's output severity for that criterion must match the rubric's severity column. `[J]` criteria are outside the checker's scope; the checker may surface them as ADVISORY to guide the reading pass, but must not emit FAIL or WARN for them. See `ki-skills/references/audit-rubric.md` for the tagging rules.
