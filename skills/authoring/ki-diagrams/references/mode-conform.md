# Mode CONFORM - bring a diagram set into line

**Precondition:** run [AUDIT](mode-audit.md) first and retain the gap list.

CONFORM scaffolds structure; it never authors, regenerates or re-exports a diagram. That is [REFRESH](mode-refresh.md), because it needs Archify, judgment and the repository's evidence.

1. Run `ki repo conform --skill ki-diagrams --repo <repo> --dry-run`. The host owns only generated-publication repair; DIAG findings are diagnostic.
2. Where `docs/diagrams/diagrams.toml` or `docs/diagrams/README.md` is missing, copy it from the skill's [`assets/`](../assets/) and fill one table and one section per committed diagram from what the source records: its type, its revision as `last_checked`, and the files its nodes cite as `traced`. Ask the owner for any `question`, `audience` or `stale_when` the source does not show.
3. Remove a stray file only with the owner's agreement; otherwise list it as a diagram.
4. Rewrite a private label in the source by hand, then hand the diagram to REFRESH to rebuild and re-export it.
5. Re-run AUDIT.
