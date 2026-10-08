# Mode CONSOLIDATE - bring the collection back to "what is"

_On-demand and recurring procedure for decision-records' CONSOLIDATE mode. The present-state, self-contained-collection and writing rules live in [the Decision Records standard](standards-decision-records.md); this file is the procedure only._

CONSOLIDATE keeps a whole collection true to the living-record principle after decisions have drifted, accumulated history or spread across overlapping records. It runs on demand and as part of every regular repository review: `ki-repo` REVIEW performs the assessment steps read-only, and the rewrite steps run under the owner's approval of the resulting disposition. It is distinct from REFRESH, which re-anchors this skill's standard to its sources.

**Precondition:** the repository's `.ki.toml` declares `[skills.ki-repo].repo_code`, and the run has a clean, current checkout of the collection.

## Assess

1. **Run the mechanical checks**: `ki repo audit --skill ki-decision-records --repo <repo>`. Take every FILENAME-4 (a subdirectory or supporting file in the collection), BODY-11 (a link out to anything other than a sibling record or an external URL), BODY-12 (a history, changelog, supersession or alternatives section), ROOT-2 (a declared `scope` key) and ROOT-3 (a record scope that neither equals `repo_code` nor begins with `<repo_code>-`) finding as given; do not re-derive them by hand.
2. **Read every record**, not the index or a sample. For each, judge whether it states one consolidated current decision in its own words (BODY-10): no account of what it replaced or how it was reached, no rejected alternatives or options considered, no "was", "previously", "might have been" or "adopts the report as amended", and no forward-looking work.
3. **Find overlap and supersession.** Group records that decide the same concern, records whose decision another record now overrides, and records that no longer decide anything current.
4. **Propose a record-by-record disposition**: keep, rewrite in place, merge into a named surviving record, retire, or move supporting material out. Name each record by its full identifier. A merge or retirement, and any rewrite that changes what a record decides rather than how it says it, needs the owner's decision before anything is written.

## Rewrite

5. **Rewrite each record in place** as the consolidated current decision: Context states only present constraints, Decision states what is decided now in active voice, and Consequences state what follows. Delete history, rejected alternatives and "what was" narrative outright; Git keeps it.
6. **Empty the collection of everything but records and their index.** Fold any durable content from a `references/` folder or supporting file into the record that cites it, move material a skill genuinely owns into that skill's `references/`, and delete the rest. Design-loop briefs, reviews, reports and decision logs belong beside their Project or Initiative under `ki-design-loop` and are deleted once their outcome is consolidated; a record never links to them.
7. **Replace each link out** with the target named in text, or a canonical external URL at a known revision for cross-repository provenance; drop the link where the record reads completely without it.
8. **Merge and retire.** Fold each overlapping record into its surviving record, then delete the merged or superseded file. Update the index, every `decision_depends_on` edge, and every inbound reference in the repository and in peer repositories that cite the identifier, in the same change. Do not renumber surviving records.
9. **Correct scope.** Rename any record whose scope fails ROOT-3 to `repo_code` or a `<repo_code>-` sub-domain, next serial per prefix, updating its index entry and inbound references; a record owned by another repository is deleted locally and cited by its canonical URL. Remove a declared `[skills.ki-decision-records].scope` key (ROOT-2).
10. **Re-run [Mode AUDIT](mode-audit.md)** to confirm the mechanical checks pass, and report the disposition applied, the records left for the owner's decision, and any judgement-only finding not rewritten.
