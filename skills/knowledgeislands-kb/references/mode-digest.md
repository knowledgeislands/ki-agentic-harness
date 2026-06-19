# Mode DIGEST — session digest

_On-demand procedure for kb's DIGEST mode. The shared model — the five-zone structure, routing test, memory cascade, project bindings, and
Step 1 (Load context) — lives in [`SKILL.md`](../SKILL.md) and is already loaded; this file is the procedure only._

1. Write the digest to `-/_DIGESTS/<UTC timestamp> <Short Topic>.md` (timestamp `YYYY-MM-DDTHHMMSSZ`; topic in Title Case).
2. Carry `type: session-digest` and `retain_until: YYYY-MM-DD` (default 30 days out).
3. Structure: Context, Decisions, Facts Learned, Related Work, Keywords.
