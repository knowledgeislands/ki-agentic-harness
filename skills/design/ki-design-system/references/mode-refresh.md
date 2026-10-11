# Mode REFRESH - re-anchor the standard

**Precondition:** REFRESH edits this skill's own canonical files, which exist only in `ki-agentic-harness`. Invoked from an installed copy, it stops here and names the harness as where to run it.

1. Re-examine each entry in [sources.md](sources.md): has WCAG changed a requirement the floor cites, and have the Guides, Specifications, Decision Records or design-loop standards changed what they own?
2. Re-read each exemplar at its pinned revision and any newer adopting repository. Generalise a pattern that has proved itself in more than one repository into the standard; leave a single repository's choice in that repository.
3. Edit the standard and the rubric catalogue together, then regenerate `rubric.md` with `ki dev skill rubric ki-design-system --write`.
4. Update review dates and the `## Last review` block in `sources.md`; record the substantive change in the commit rather than a changelog.
