# D12 mailbox standard

How D12 runs in a mailbox: queues and tags, protected labels, sweeps and Deposit routes, with what differs between Gmail and Microsoft 365. It applies the [D12 standard](standards-dodecakrisis.md), whose write and approval rules govern everything here.

## Contents

1. [Queues and tags](#queues-and-tags)
2. [Protected labels](#protected-labels)
3. [Sweeps](#sweeps)
4. [Deposit routes](#deposit-routes)
5. [Gmail](#gmail)
6. [Microsoft 365](#microsoft-365)

## Queues and tags

- **One label or folder per outcome, numbered by its D, under one root.** With the root `D12`: `D12/03 Determine`, `D12/04 Decide`, `D12/05 Discuss`, `D12/06 Delegate`, `D12/07 Defer`, `D12/08 Dormant`, `D12/09 Digest`, `D12/10 Deposit` and `D12/11 Delete`. The numbers keep the provider's name order in D12's order. Deliveries is the inbox itself and Do is the rules, so neither has a label.
- **Determine and Decide stay in the inbox**; every other outcome takes the item out of it, once forwarded for Delegate.
- **Defer carries its date** in a tag such as `Defer/2026-11-20`, and the Defer sweep returns it on that date.
- **Deposit carries its retention** in a tag such as `Keep/12 months`, `Keep/7 years` or `Keep/Owner`.
- **Provenance.** Every item a rule places also gets `<root>/Rules/<id>`, such as `D12/Rules/R07`. That label is how the learning loop notices a correction.
- **Context is shown by tags beside the outcome, never by folders.** What an item is about, who it is from and what kind of thing it is are path-named tags: one tree with a branch per Capital (`Personal/`, `HNR/`, `ER/`, `VA/`) and shared kind tags (`Kind/Invoice`, `Kind/Receipt`, `Kind/Statement`, `Kind/Contract`, `Kind/Booking`, `Kind/Newsletter`, `Kind/Notification`). One view is by action, the other by area.
- **Nothing is archived inside the mailbox.** Deposit is a holding place only until the store has taken and verified the item.

Nothing else lives under the root but the outcome labels and the provenance labels.

## Protected labels

Some labels, folders and categories must never be changed or touched, such as Gmail's `Z_ARCHIVE/` and `Z_ARCHIVE/Legal Matters`. Under PROTECTED-HOME a) and PROTECTED-READ a) (Kris, 7 November 2026):

- **The server holds the list.** Each mail server's per-account configuration declares the protected labels, folders and categories; chezmoi manages that configuration. An entry covers its sub-labels and is held by id, so renaming a label does not lift its protection.
- **The server refuses every change** to a protected label or the messages it holds, whoever calls: no label added, removed, renamed, created under or deleted; no message moved, archived, trashed, categorised, or marked read or unread; no filter or rule created that acts on one.
- **D12 reads the list from the server** before each run and keeps no copy of its own. A run against a mailbox whose server does not report protection switched on does not write.
- **No rule, sweep or Deposit route targets a protected label.** A refusal stops the run, which reports the refused call; it is never retried another way.
- **Protected labels lie outside D12.** They are not sorted, swept or learnt from, and D12 never proposes changing the list; Kris changes it in the server's configuration.

## Sweeps

Filters act only on arrivals and cannot act on age, so D12's own sweeps do. `ki-muninn d12 sweep` runs them for one mailbox, each a search over D12's labels and the item's age:

| Sweep | What it does |
| --- | --- |
| Delete | Moves an item that has carried the Delete outcome for 7 days to Trash, which the provider keeps a further 30 days |
| Digest | Lets go of a Digest item after 14 days, by placing it in Delete |
| Defer | Returns a Defer item to the inbox and the rules on its date, removing its Defer tag |
| Deposit | Removes an item from the mailbox 30 days after its route's owner has verified the stored copy |
| Short-lived | Places items in Delete after a short age, by a short-lived rule such as sign-in codes after 7 days or parcel tracking after 3 |

Each sweep runs as a dry run first and reports its count for each label, and every sweep, run or schedule cites its approval. A sweep never acts on a protected label or an item that carries one, and never trashes anything that has not passed through the Delete outcome.

## Deposit routes

Each Deposit route in the rules file names its capture folder, its form, its destination and its owner. An item placed in Deposit gets its route's capture folder; the importer, `ki-muninn`'s mail import, reads that folder and writes the item in the route's form:

- **`capture`**: a faithful Markdown capture, for mail that is knowledge. `ki-acquire` governs it from there.
- **`eml.txt`**: the raw message written unchanged, with its attachments beside it, for evidential mail. The owner, such as Legal, names, files and verifies it.

The importer marks the item `<root>/10 Deposit` once written, so a second run skips it. The item leaves the mailbox only through the Deposit sweep, after the owner has verified the stored copy; Delete never reaches it.

## Gmail

- Queues and tags are labels; `/` in a label name nests it.
- Gmail runs **every** matching filter, not the first, so order protects nothing. Every Delete or Digest filter carries the evidential guard.
- A D12 filter's action adds the outcome and provenance labels and, for an automatic rule, removes `INBOX`. A filter's name is not stored by Gmail, so a D12 filter is known by the `D12/` labels its action adds; the rules file's `filter` names it for people.
- Change history (`gsuite_email_history_list` and `gsuite_email_history_checkpoint`) feeds the learning loop.

## Microsoft 365

- Queues are folders under the root; tags are categories with path-like names, since a message is in one folder but can carry many categories.
- An Outlook rule can stop later rules from running, so order decides what a message meets; the evidential guard goes in each Delete or Digest rule's exceptions all the same, and reordering touches only D12 rules.
- Every D12 rule's name begins with `D12`, such as `D12 R07 newsletters to Digest`.
- The mail change query feeds the learning loop.
