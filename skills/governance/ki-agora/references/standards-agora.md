# Agora membership standard

## Purpose and boundary

An **Agora** is a named working set of independently governed Knowledge Islands repositories. A registered owner repository declares its direct members and optional inclusions. Ordinary members have no Agora declaration or role. A repository may be a direct member of more than one Agora. Membership and inclusion grant no authority over another repository.

`ki-agora` owns portable declaration shape. The `ki` host owns local registry resolution, diagnostics, and target selection. A user-environment owner may project the resolved roots to a client, while preserving client-owned state. Neither registry presence nor opening a repository makes it a member of a named Agora.

## Configuration

Only an Agora owner declares this skill. Its canonical identity comes from `ki-repo.repository`; it is included in each Agora it declares. The owner may declare more than one Agora:

```toml
[skills.ki-agora]

[skills.ki-agora.legal]
purpose = "Legal casework and research repositories"
members = ["https://github.com/example/legal-tools"]
includes = ["equalremedy", "https://github.com/example/plain-git-repository"]
```

Each child table name is a globally unique, stable lower-case hyphenated Agora identifier matching `[a-z][a-z0-9-]*[a-z0-9]`. `estate` is reserved for the system-managed registered estate. Each child table requires `purpose` and `members` and admits optional `includes`; unknown keys fail. A member repository declares no `[skills.ki-agora]` table solely for membership.

- `purpose` is a non-empty human explanation of the group.
- `members` is a duplicate-free array of canonical HTTPS GitHub repository identities. The owner is implicit and must not appear here. Every direct member must resolve to one locally registered KI repository.
- `includes` is an optional duplicate-free array. An Agora identifier includes that Agora's owner and direct members; a canonical HTTPS GitHub repository identity includes that repository alone. The owner and its direct members cannot also appear as repository inclusions, and an Agora cannot include itself.

An included Agora's own inclusions are not followed. This one-level rule prevents hidden expansion and cycles. Owners may declare opposite directed inclusions when both opening directions are useful. An included root is a working-set participant, not a direct member of the including Agora. The resolver deduplicates roots by canonical repository identity and sorts all projected roots alphabetically by local registry key. The same order governs display, `roots`, opening, and repository selection; no authored order field exists.

## Included repositories

A registered repository inclusion resolves through the local registry without a member declaration or separate checkout association. An unregistered Git repository inclusion may be associated on each machine with one explicitly selected absolute Git checkout whose canonical remote matches. The host never clones or selects among multiple checkouts automatically. An absent, ambiguous, missing, or remote-mismatched association omits that root with a typed diagnostic; it does not change direct membership.

The same canonical HTTPS GitHub identity grammar as `ki-repo.repository` applies to members and repository inclusions. Credentials, queries, fragments, trailing `.git`, filesystem paths, and arbitrary source directories are invalid. No inclusion grants KI conformance, trust, work routing, trade, publication, implementation, or acceptance authority.

## Resolution

A named Agora resolves only from a unique locally registered owner with a valid declaration. The owner and direct members must resolve to registered repositories; missing or ambiguous identities fail resolution. An included Agora must resolve to a unique registered owner and valid direct members, or the including profile reports a finding. Duplicate roots from several inclusion paths are projected once. A malformed or unavailable peer is an observation result and never grounds for a repository mutation.
