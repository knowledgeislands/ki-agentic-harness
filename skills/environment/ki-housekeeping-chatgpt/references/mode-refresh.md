# REFRESH — re-anchor Codex housekeeping

## Preconditions

REFRESH writes only the canonical `skills/environment/ki-housekeeping-chatgpt/` source in `ki-agentic-harness`. When invoked from an installed copy, stop and redirect to the Harness.

Run quarterly and whenever the Codex CLI or app-server changes the thread inventory, descendant filtering, deletion, initialization, or maturity contract.

## Procedure

1. Read [the source list](sources.md) and its last review.
2. Fetch the current official Codex CLI command and app-server documentation.
3. Reconcile `codex delete`, initialization, `thread/list`, `cwd`, pagination, `ancestorThreadId`, `thread/delete`, descendant deletion, and experimental capability status against the standard and adapter fixtures.
4. Update the standard, adapter, tests, and source review together when the contract changed.
5. Regenerate the rubric publication and run the skill audit, focused tests, full tests, and TypeScript gate.

Do not treat a changelog mention alone as protocol proof. Preserve fail-closed behaviour when the current contract is ambiguous.
