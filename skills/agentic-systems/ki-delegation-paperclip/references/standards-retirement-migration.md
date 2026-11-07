# Migration — retiring Paperclip delegation

Kris retired Paperclip delegation on 7 November 2026: "anything to do with paperclip. We know that we don't need to be doing anything with that now." The final state has no Paperclip skill, no Paperclip standard and no `[skills.ki-delegation-paperclip]` or `[skills.ki-agent-coordination-paperclip]` declaration anywhere. No standard describes Paperclip, so nothing else needs reading alongside this file.

This file holds the only transition rules, under MIGRATION-OVERLAY. Delete it, with both retirement stubs, once no repository declares either skill; no standard changes when it goes.

## Why the stubs exist

The host refuses a repository whose `.ki.toml` declares a skill that no declared harness provides. Removing both skills outright would therefore stop every audit in each repository that still declares one. `ki-delegation-paperclip` and `ki-agent-coordination-paperclip` stay published as stubs that own no rule and run one warning check, so those repositories keep auditing while they catch up.

## Leaving the declaration

A repository removes its `[skills.ki-delegation-paperclip]` or `[skills.ki-agent-coordination-paperclip]` table, with its fields such as `organisation_code`, from `.ki.toml` at its own pace. Until it does, its audit carries one RETIRED-1 warning and no Paperclip check runs. The Paperclip standards, procedures, onboarding assets and coordination-lane subagents remain readable in Git history only.

## Ending the migration

When a sweep of the registered repositories finds neither declaration, delete both stub skills, their place in the agentic-systems area list and this file in one change.
