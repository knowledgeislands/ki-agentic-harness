---
id: KI-HARNESS-GOV-169
area: GOV
title: Roll up since mark
kind: decide
purpose: capability
initiative: platform-foundations
component: governance
horizon: soon
status: draft
blocks: []
blocked_by: []
baseline_ref: null
created_at: 2026-10-09T12:00:00Z
updated_at: 2026-10-09T12:00:00Z
---

# KI-HARNESS-GOV-169: Roll Up Since Mark

## Goal

The owner can strike a mark at any moment and later ask for one roll-up of everything done and everything still outstanding since that mark, across the master thread and its Project threads, without reconstructing it from several recaps.

## Context

Kris runs a master state-of-play thread and Project threads, each delegating to detached background agents under `ki-delegation` and keeping a `ki-checkpoint` checkpoint. A project recap covers only one Project and only "since the last recap", and `ki-recap` covers one session. Neither answers "what has happened since I last stood back?" when that moment was chosen by the owner, spans several threads, or predates the last recap.

The idea is that the owner strikes a mark, a baseline captured at a moment, and later asks for a roll-up since that mark: delivered, decided, started, stopped or blocked, newly captured, and outstanding.

This record captures the problem and the open design questions only. Kris wants to discuss the design before any shape is chosen.

## Boundary

- **In:** the concept, where a mark lives, what a roll-up covers and how it relates to project recaps and `ki-recap`.
- **Out:** implementation in `ki agent` or any skill until the design is agreed; changing the six-section checkpoint form.

## Shaping

The approach is a design discussion with Kris before any implementation; no shape is chosen yet. The decisions still needed are the open design questions below. The record is ready for promotion once Kris has settled what a mark is, where it lives, what a roll-up covers, and which skill owns it.

## Discussion

### Open design questions

- What is a mark: a named baseline checkpoint, a timestamp, a set of commit identifiers per repository, a decisions-log number, or a combination?
- Where does a mark live durably, given that run directories are non-durable and checkpoints hold current state only?
- Does a mark belong to one thread, or to the master thread spanning every Project thread?
- Can several marks coexist, and are they named, listed, superseded or removed?
- What are the roll-up sources: Git history, work-record transitions, decisions logs, background-agent reports, checkpoints, parked items?
- How is "outstanding" defined: open work records, running agents, parked items, needs-owner items, or all of these?
- How does it relate to the project recap ("since the last recap") and to `ki-recap`: a generalisation of one, or a distinct capability?
- Which skill owns it: `ki-delegation`, `ki-checkpoint`, `ki-recap`, or a new one?
