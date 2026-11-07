---
note_type: streams/design
updated: 2026-10-31T02:15:00Z
author: Written with Claude
---

# Empty board - consolidated ideas

**Owner:** Kris Brown · **Owning repository:** knowledgeislands/ki-principal · **Owning work:** `ki.prj.ways-of-working` · **Date:** 2026-10-31

This is the one list Kris asked for under EMPTY-BOARD on 31 October 2026: every idea in the Knowledge Islands territory, meaning anything that is neither active work nor upcoming work, gathered in one place, each linked to where it lives today. It is a snapshot taken at about 02:00 GMT on 31 October 2026. Nothing was changed or deleted at any source; each entry is still owned where it sits. The companion [design note](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/empty-board/design.md) explains the counts, proposes the gates for admitting an idea and says where the structure contradicts itself.

## Contents

- [Ideas on Project and theme pages](#ideas-on-project-and-theme-pages)
- [Ideas in repository idea ledgers](#ideas-in-repository-idea-ledgers)
- [Concepts](#concepts)
- [Projects with no live work](#projects-with-no-live-work)
- [Roadmap records that are not upcoming](#roadmap-records-that-are-not-upcoming)
- [Packages on hold](#packages-on-hold)
- [Parked queries](#parked-queries)

## Ideas on Project and theme pages

55 ideas written as `Idea:` bullets (or an Ideas list) in the [Project registry](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/Projects.md) and on [theme pages](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Themes/Themes.md). The standard says a new idea starts here.

### Project: [Agent host](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/agent-host.md)

- **owned-host provider** - The `agent-host` recipe could bind a machine its owner already runs and reaches over the tailnet, such as an owned Mac Studio, with no provision step: `techne ...
- **split the operator guide** - The `ki-techne-harness` agent-host operator guide could read as a guide to the general `agent-host` recipe, with each provider's steps in its own guide and no ...
- **detached delegation on the host** - Once the portable delegation contract settles how detached runs are supervised and ended, the host could gain the full delegation instructions within the ...
- **Omarchy for vega** - Omarchy (<https://omarchy.org/>, Arch Linux) as a future OS candidate for vega, the agent host (Kris, 2026-10-11).
- **person-neutral recipe defaults** - The `agent-host` recipe and its scripts would carry no one person's values: the repository list, workspace layout, account, region, profile and host names come ...
- **no record identifier in controller and target tags** - The controller and disposable-target stacks tag every resource, and pass on `provision.sh`, a `ki-work-item` tag holding a record identifier from a retired ...
- **`ki` refuses roadmap writes on the host** - `ki` would refuse every roadmap write (identifier reservation, capture, lifecycle transition, acceptance and prune) on a machine carrying the agent-host ...

### Project: [AI observability](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/ai-observability.md)

- **AI-tooling observability (OTLP), with token economics** - Moved here from the Foundations theme Notes when this Project opened. Kris: OTLP is "about us getting metrics out of use of AI ...

### Project: [Baseline rollout](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/baseline-rollout.md)

- **Bun boundary proof adapter** - Let the `ki-engineering` boundary check prove a repository whose suite runs under `bun test` with TypeScript outside `src/`, and a flat repository's root ...
- **Observatory adopts `ki-diagrams`** - `apps-observatory.local` could declare `skills.ki-diagrams`, retire its own `scripts/diagrams/export-svg.ts` for the harness copy, and move the operational ...
- **enforce the commit gate** - Each repository shape states what its committed `.githooks/pre-commit` runs, repositories without a hook receive trades to add one, and once the estate ...
- **roll out the `ki` pin receivers** - Every `knowledgeislands` repository that installs a released `ki` in CI would keep its pin in `.github/ki-version`, run the auto-merging `update-ki-pin.yml` ...

### Project: [Delta evaluation](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/delta-evaluation.md)

- **decide on a Delta trial** - Kris answers whether Delta earns a bounded trial alongside Paperclip, re-evaluating from the 2026-10-06 baseline at the 2026-10-21 decision point, and the ...

### Project: [Host network](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/host-network.md)

- **setting up and addressing hosts on the tailnet** - Moved here from the Rig theme Notes when this Project opened. Kris: host-network setup "needs its own thought", and the tailnet is the VPN ...

### Project: [Island model and Tending](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/island-model-and-tending.md)

- **territory rollout** - Roll the Knowledge Islands shape out to Kris's other territories (kit, hnr with 5g-emerge, equalremedy, vallearmonia, infoschematics, techmedix and any others ...
- **territory addressing** - Kris, on 2026-10-14, wants a level above the tailnet: "a register capability where you can say that this is your territory, and therefore, as part of that, you ...

### Project: [Mac Studio setup](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/mac-studio-setup.md)

- **remote access and continuity in Rig** - A Rig profile could declare whether its machines accept screen sessions and who may connect, and on macOS Handoff (with Universal Clipboard) and Universal ...

### Project: [Observatory](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/observatory.md)

- **state-of-play view** - A clear view of Projects and themes, possibly drawing on `apps-observatory.local` and the command-centre ideas in `hnr-principal` and `legal-principal`. Parked ...
- **an Observatory Instrument** - over the Project registry, checkpoints, decisions logs and `ki agent` runs, ranking Needs, staleness and unread agent reports - the cheapest pilot of the ...
- **the Estate Map as an Observatory view, 2026-10-16** - The Estate Map, the live artifact at `personal-principal/Admin/Operations/Live Artifacts/Estate Map.html`, is critical to the Observatory but was captured ...
- **trade-routes layer** - Add trade routes to the Known Lands chart, preserving every exchange and the existing route detail. Wait for the instrument-restructure decision to settle ...
- **Activity split** - Put Activity's "what changed" on the Beacon and its 7, 14 and 30-day window on the chart as a time control, preserving every current change, window and reader. ...
- **stored positions** - Retain Kris's 19 October DESIGN-POSITIONS a) decision: any future positions are a host preference under XDG state, read and written behind the backend, with ...
- **island condition** - Replace the chart's explicit unknown condition with a projection of each island's declared maturity and its audit-health decline or ruin from the existing ...
- **Open question: ntfy as the stopgap** - Until each host has its own messaging endpoint linked over the tailnet, does ntfy on `sol`, tailnet-only, serve as the interim cross-host channel, each ...
- **the Observatory as host command centre** - Kris asked whether command-centre and the Observatory are "one thing" and pointed to the bridge docs. The Observatory's own decision on Observatory, Beacon and ...
- **inter-agent pub-sub communication** - Kris: inter-agent pub-sub is its own topic; ntfy is "decent but maybe not long term"; consider "a decentralised system per host with the Observatory as command ...
- **a single pane of glass, with agents advertising themselves** - Kris: "I'm wondering though if the observatory can also see those agentic sessions. I'm not suggesting that I want that to become the graphical user interface ...
- **token economics in the glass** - Kris: "Another key aspect of this whole command centre piece, the observatory, OTLP, the pub sub mechanism, all of that good stuff, is that we also need to ...
- **OBSERVATORY-ATC, 2026-10-17** - Captured from Kris's intake, no design: "understanding all of the initiatives and projects and work streams and roadmap items that are running within a given ...
- **KB-READER, 2026-10-17** - Captured from Kris's GO-AHEAD, no design: "hopefully, all this gets captured back into Knowledge Island in the Knowledge Base, and then there's the ...

### Project: [Paperclip capture and rebuild](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/paperclip-capture-and-rebuild.md)

- **remote Paperclip** - Running Paperclip remotely in any form, including the per-host rebuild below, is kept as an idea under the Techne Programme ...

### Project: [Secrets hygiene](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/secrets-hygiene.md)

- **repeatable 1Password triage** - A mostly read-only triage on a cadence, realised as a recurring Activity or a chezmoi housekeeping template, that files the inbox vault, catches misplaced ...

### Project: [Skill refresh](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/skill-refresh.md)

- **standing-surface design rules in `ki-tokenomics`** - `ki-tokenomics` would tell repository owners how to keep always-loaded instructions small, not only how large they may be: one routing authority per repository ...

### Project: [Specification review](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/specification-review.md)

- **KI Specifications consistency** - Give every tracked `ki-specifications` file a recorded authority class, align its KIP/KIS process documents with the documents the guides name as authority ...
- **a portable live-artifact contract** - KI Specifications could hold one portable contract for Knowledge Base live artifacts: a self-contained HTML page with a Markdown manifest (`artifact_bridge ...

### Project: [Tools burndown](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/tools-burndown.md)

- **MGIT-ESCAPE** - (Kris, 17 October 2026 intake, ki decisions log): an escape hatch from mgit's own commands, which override the git ...
- **MGIT-OUTPUT** - (Kris, 17 October 2026 intake, ki decisions log): "I really want MGIT to have much better output" - a progress bar ...

### Project: [Ways of working](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/ways-of-working.md)

- **graduate tending after further territory feedback, 2026-10-25** - Take the two-track structural and PMO process from Tending into a standard once more territories ...
- **finish findings graduation, 2026-10-25** - Retain the remaining rules of Findings after the report section and package storage landed ...
- **graduate repository metadata, 2026-10-25** - Take the settled direction in Repository metadata into `ki-repo`: configuration-owned ...
- **notification strategy for delegated work** - One Knowledge Islands wide strategy for how the owner learns about delegated work from `ki agent` runs: `ki agent` derives an append-only events log per run ...
- **agent advertisement and acting on token use** - Dispatched by the state-of-play thread from Kris's words of 14 October 2026; ideas, not records, and the wider placement is Kris's open queries OBS-MERGE and ...
- **inception Projects** - Dispatched by the state-of-play thread from Kris's words of 14 October 2026; an idea, not a record. Kris: 'Do we have different types of project? I think one ...
- **GIT-SURFACE, document the whole Git work surface, 2026-10-17** - Kris, in the intake of 17 October 2026: "we should think about how we document the entire Git work surface ... Not just Git and Git Almanac ... Git is like ...

### Project: [Website](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/website.md)

- **interactive island diagram** - The website shows an interactive, accessible diagram of a Knowledge Island as a place, rendered from Knowledge Islands Principal's geography model and ...
- **decide the landing pages** - Get Started on the Docs grid starts something, and Contribute leads to a page that knows its purpose without re-explaining the Contribution Process. ...

### Theme: [Rig](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Themes/rig.md)

- **same-boot mcporter stall** - If the same-boot stall returns - both mcporter launchd jobs running but the bridge's `tools/list` failing - diagnose it with a bounded, sanitised live trace of ...
- **per-tool development mode switch** - `rig dev local <tool>` and `rig dev release <tool>`, with `all`, would switch a KI command-line tool between its checkout and its installed release and warn ...
- **GitHub Desktop repository list** - A Rig step could add every mgit territory checkout to GitHub Desktop, only adding, waiting between opens and changing nothing on a second run, so a new ...

### Theme: [Techne](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Themes/techne.md)

- **Kitteth and Avatars** - Kitteth and any other Avatar holding delegated agency. The open questions about Avatar capability, events and telemetry sit in Avatar Roles and ...
- **messaging channels** - Telegram and every other messaging channel for Techné agents. The controller's existing Telegram dispatch path stays as it is.
- **wider K3s and controller changes** - Any change to K3s or to the controller instance `ki-techne-ops-007-primary`, its stack and its dispatch path; the controller as a recipe is noted on ...
- **the execution fabric** - The AI Execution Fabric and its provider-neutral isolated agent execution, as ...
- **other environments** - Every environment other than `vega` and `sol`, including the appliance role and anything in the organisation or its management account.

## Ideas in repository idea ledgers

43 ideas in the `docs/roadmap/_IDEAS.md` ledgers of 9 repositories. Most were roadmap records moved out under the roadmap sweep of 27 October 2026, and their full text sits in `docs/ideas/`.

### [apps-observatory.local](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/_IDEAS.md)

- **Two-way live-artifact adapter** - Bridge the Observatory and live artifacts in both directions in three phases; the outbound transport and where the pair lives are both still open. [Full text](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/ideas/KI-OBSERVA-INT-003-extensions-switchboard.md). Was `KI-OBSERVA-INT-003`.
- **Tailnet read-only appearance** - Let Kris open the Observatory from another machine over the tailnet and see everything, with acting kept on the Observatory's own host; waits on the host network thread. [Full text](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/ideas/KI-OBSERVA-OPS-004-tailnet-read-only-appearance.md). Was `KI-OBSERVA-OPS-004`.
- **Retire Sessions readers** - Retire the Sessions instrument's checkpoint, threads and run-packet readers once no territory uses them, and rename what remains to the Streams instrument; comes after ... [Full text](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/ideas/KI-OBSERVA-VIS-028-retire-sessions-readers.md). Was `KI-OBSERVA-VIS-028`.
- **Sessions from every host** - Show agent runs from every host on the tailnet in one view, each marked with its host; waits on a stable tailnet address per host. [Full text](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/ideas/KI-OBSERVA-VIS-029-sessions-from-every-host.md). Was `KI-OBSERVA-VIS-029`.
- **Machine instrument** - Show the host's Rig state, MCP servers and automation schedules in one Machine instrument; its tool-storage phase waits on the harness storage declarations idea. [Full text](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/ideas/KI-OBSERVA-VIS-038-machine-instrument.md). Was `KI-OBSERVA-VIS-038`.
- **Read and answer queries in the Observatory** - extend the Review queue so each open query can be read in full and answered with a letter or a short note, the answer landing as one line in the work's `messages.md` ...
- **Burn-down trend** - show the roadmap's net downtrend from the records themselves, so the State of play can watch it rather than keep it by hand; Kris: no rule or tooling now, just keep on ...
- **Work status from a contract** - read the five work-status views from `ki work status --format json` instead of parsing the text form; the contract itself is an idea in tools-ki's ideas list.

### [ki-agentic-harness](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/roadmap/_IDEAS.md)

- **PreToolUse quietening hook** - A Claude Code hook that would quieten noisy tool output automatically; the quiet-tools rule in briefs covers this for now. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-GOV-204-pretooluse-quietening-hook.md). Was `KI-HARNESS-GOV-204`.
- **Home the work spec** - Give the portable work-package specification a home in the ki-work-package skill, so people outside Knowledge Islands can read or write one; waits on the ... [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-GOV-228-home-work-spec.md). Was `KI-HARNESS-GOV-228`.
- **Home the acquire spec** - Give the portable acquire-package specification a home in the ki-acquire skill; waits on the portable-specifications Project. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-GOV-229-home-acquire-spec.md). Was `KI-HARNESS-GOV-229`.
- **Knowledge package skill** - A new skill for a portable knowledge package, a skill whose focus is condensed knowledge rather than an action; waits on the portable-specifications Project. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-GOV-230-knowledge-package-skill.md). Was `KI-HARNESS-GOV-230`.
- **Review ThoughtWorks Radar** - Review each new ThoughtWorks Technology Radar volume as an input to the KI tool radar; the weekly model-radar review can carry this as a per-volume check. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-REV-012-thoughtworks-radar-input.md). Was `KI-HARNESS-REV-012`.
- **Repository storage declarations** - Let a repository declare in .ki.toml what its tool or app stores in the XDG config, data, cache and state folders and why; feeds only the Observatory's Machine ... [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-GOV-227-repository-storage-declarations.md). Was `KI-HARNESS-GOV-227`.
- **Incremental ChatGPT acquisition path** - Work out whether ChatGPT acquisition can stay current incrementally through the local cache and browser instead of full exports; the acquisition Project is finished and ... [Full text](/Users/krisbrown/kis/knowledge-islands/ki-agentic-harness/docs/ideas/KI-HARNESS-OPS-009-complete-ai-session-acquisition.md). Was `KI-HARNESS-OPS-009`.

### [ki-design](/Users/krisbrown/kis/knowledge-islands/ki-design/docs/roadmap/_IDEAS.md)

- **Lit SSR spike** - Find out whether the site's two shared elements can render HTML without JavaScript and hydrate correctly when Eleventy runs under Bun; the site ships without it. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-design/docs/ideas/KI-DESIGN-ELE-001-lit-ssr-spike.md). Was `KI-DESIGN-ELE-001`.
- **Isometric renderer** - Render an IslandMap isometrically from a tile set's atlas in Canvas 2D; needs the tile set first. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-design/docs/ideas/KI-DESIGN-MAP-002-isometric-renderer.md). Was `KI-DESIGN-MAP-002`.
- **Ancient tile set** - Produce the painted, dusk-lit Ancient tile set from the picture of Arcadia; waits on the art-licensing decision. [Full text](/Users/krisbrown/kis/knowledge-islands/ki-design/docs/ideas/KI-DESIGN-TIL-002-ancient-tile-set.md). Was `KI-DESIGN-TIL-002`.

### [ki-techne-harness](/Users/krisbrown/kis/knowledge-islands/ki-techne-harness/docs/roadmap/_IDEAS.md)

- **Weekly pin bump** - A weekly job on the Mac that raises the agent host's tool pins to newer releases for Kris's review; the Focus forbids unattended agents on the hosts and releases are ... [Full text](/Users/krisbrown/kis/knowledge-islands/ki-techne-harness/docs/ideas/KI-TECHNE-OPS-024-weekly-pin-bump.md). Was `KI-TECHNE-OPS-024`.

### [mcp-gsuite](/Users/krisbrown/kis/knowledge-islands/mcp-gsuite/docs/roadmap/_IDEAS.md)

- **Consume the routing core** - Hold an exact, checked copy of the shared routing core in this server with a drift check; needs the mcp-m365 core extraction first, held with the Humans Not Robots ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-gsuite/docs/ideas/KI-MCP-GSUITE-TOOL-008-consume-the-routing-core.md). Was `KI-MCP-GSUITE-TOOL-008`.
- **Add Gmail routing report-mode** - Let the owner lint a Gmail rule note against the live labels and see where the shared rules would file each Inbox message without changing the mailbox; follows consuming ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-gsuite/docs/ideas/KI-MCP-GSUITE-TOOL-009-add-gmail-routing-report-mode.md). Was `KI-MCP-GSUITE-TOOL-009`.

### [mcp-m365](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/roadmap/_IDEAS.md)

- **Judgment verdict hook** - Let a caller that judges unclassified mail elsewhere list what needs judging and hand verdicts back for the engine to file; email-routing rollout work held with the ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-011-judgment-verdict-hook.md). Was `KI-MCP-M365-TOOL-011`.
- **Judged mail re-check** - Let every run see where each judgment-filed message now stands and settle it once the owner has acted; follows the judgment verdict hook, held with the Humans Not Robots ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-012-judged-mail-recheck.md). Was `KI-MCP-M365-TOOL-012`.
- **Per-rule hit counts** - Show which routing rules still fire and which have not fired for months, so the disposal list can be pruned on evidence; rollout phase 4, held with the Humans Not Robots ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-013-per-rule-hit-counts.md). Was `KI-MCP-M365-TOOL-013`.
- **Routing run ledger** - Leave one validated summary record per routing run in an append-only ledger, so the owner can see what every run did and notice when runs stop; rollout phase 4, held ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-014-routing-run-ledger.md). Was `KI-MCP-M365-TOOL-014`.
- **Deduplicate saved attachments** - Save each distinct attachment once, so the same receipt on several messages does not pile up as numbered copies; a small fix kept with the Humans Not Robots ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-015-deduplicate-saved-attachments.md). Was `KI-MCP-M365-TOOL-015`.
- **Thread-follow skips disposal folders** - Stop a reply following its thread into a disposal folder, so a live conversation is not deleted because an earlier message was junk; Kris said keep and fix later, with ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-016-thread-follow-skips-disposal-folders.md). Was `KI-MCP-M365-TOOL-016`.
- **Size the hold window** - Learn from real mail whether held messages ever fill a folder's listing window, and size the window apart from the action cap if they do; Kris said size later, with the ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-017-size-the-hold-window.md). Was `KI-MCP-M365-TOOL-017`.
- **Extract and distribute core** - Put the routing engine's provider-free parts behind a small provider port so a second mail provider can reuse them; the Humans Not Robots email-routing thread's work. [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-018-extract-the-routing-core.md). Was `KI-MCP-M365-TOOL-018`.
- **Move the rule specification** - Give the routing rule language one normative specification beside the engine, which both mail servers conform to; follows the core extraction, with the Humans Not Robots ... [Full text](/Users/krisbrown/kis/knowledge-islands/mcp-m365/docs/ideas/KI-MCP-M365-TOOL-019-move-the-rule-specification.md). Was `KI-MCP-M365-TOOL-019`.

### [tools-ki](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/_IDEAS.md)

- **Work status views contract** - Publish the five views of ki work status as JSON under a schema so the Observatory reads them from a contract; the text views serve the Observatory today, so a schema is ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-149-work-status-views-contract.md). Was `KI-TOOL-KI-CLI-149`.
- **Readable ChatGPT project acquisition** - Acquire a whole readable ChatGPT project with complete conversations and provenance; the acquisition Project is finished. [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-168-readable-chatgpt-project-acquisition.md). Was `KI-TOOL-KI-CLI-168`.
- **Guarded source retirement design** - Design a guarded way to delete an acquired source only after every safety gate passes; nothing deletes sources today, so there is nothing to guard. [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-170-guarded-source-retirement-design.md). Was `KI-TOOL-KI-CLI-170`.
- **Complete acquisition move proof** - Prove one complete ChatGPT project move and one agent-session no-op before source deletion could be allowed; only needed for the retirement design, which is not wanted. [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-171-complete-acquisition-move-proof.md). Was `KI-TOOL-KI-CLI-171`.
- **KI release contract** - A documented release contract for ki with per-platform archives, checksums, signing and an installer; every machine runs ki from the linked checkout and releases are ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-125-ki-release-contract.md). Was `KI-TOOL-KI-CLI-125`.
- **EBU sources sync** - Let ki keep a repository's copy of the EBU 5G-EMERGE SharePoint documents in step with SharePoint; a Humans Not Robots need rather than a KI one. [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-139-ebu-sources-sync.md). Was `KI-TOOL-KI-CLI-139`.
- **Thread session bindings** - Bind a native Claude or Codex session to its logical thread so a session knows which thread it is and what role it plays; waits on harness thread work and a launch-style ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-145-thread-session-bindings-role.md). Was `KI-TOOL-KI-CLI-145`.
- **Validator parity** - Make ki work and the harness roadmap checker read one shared field rule table with conformance cases, so the two cannot drift apart; the tools-burndown Project is on ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-157-validator-parity.md). Was `KI-TOOL-KI-CLI-157`.
- **Explicit acquisition failure outcomes** - Make acquisition report unmapped projects, overlapping mappings, missing or changed sessions and failed reads as explicit outcomes, so nothing is silently dropped; worth ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/ideas/KI-TOOL-KI-CLI-169-explicit-acquisition-failures.md). Was `KI-TOOL-KI-CLI-169`.

### [tools-mgit](/Users/krisbrown/kis/knowledge-islands/tools-mgit/docs/roadmap/_IDEAS.md)

- **Learn command shapes** - Let a learned command recognise later invocations with the same structure even when argument values change; six design questions are still open. [Full text](/Users/krisbrown/kis/knowledge-islands/tools-mgit/docs/ideas/KI-TOOL-MGIT-CLI-031-learn-command-shapes.md). Was `KI-TOOL-MGIT-CLI-031`.

### [tools-rig](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/_IDEAS.md)

- **Rig manages app configuration** - Let Rig manage an application's configuration as well as its installation, dividing cleanly with chezmoi; folded into the application configuration touch points idea. [Full text](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/ideas/KI-TOOL-RIG-CORE-064-unmanaged-configuration-scan.md). Was `KI-TOOL-RIG-CORE-064`.
- **Application configuration touch points** - Let a declared tool record where on the machine it keeps its configuration and state, so Rig can say what each application changes and what to review when it is removed ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/ideas/KI-TOOL-RIG-CORE-072-application-configuration-touch-points.md). Was `KI-TOOL-RIG-CORE-072`.
- **Host-specific software retirement** - Keep a retired tool's identity in the catalogue so a later discovery on a host where it is not selected is reported as a removal candidate; needs host and profile ... [Full text](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/ideas/KI-TOOL-RIG-CORE-074-host-specific-software-retirement.md). Was `KI-TOOL-RIG-CORE-074`.

## Concepts

Three concepts wait in [Emerging Concepts](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Emerging%20Concepts/Emerging%20Concepts.md), the Capital's home for ideas that are about the model rather than work:

- [Realm Model](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Emerging%20Concepts/Realm%20Model.md)
- [Avatar Roles and Oversight](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Emerging%20Concepts/Avatar%20Roles%20and%20Oversight.md)
- [Known World](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Pillars/Philosophy/Emerging%20Concepts/Known%20World.md)

## Projects with no live work

Projects in the registry that have no work package and are not marked active. Each is, in effect, an idea for a Project.

- **[AI observability](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/ai-observability.md)** (planned) - Kris decides how AI-tooling use, token use above all, is measured and attributed per run, per thread and per account, OTLP included, and the decision is routed to its durable owner.
- **[Delta evaluation](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/delta-evaluation.md)** (planned) - Kris decides whether Delta earns a bounded trial as a delivery and review interface alongside Paperclip, and the outcome is routed to its durable owner.
- **[Host network](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/host-network.md)** (planned) - Kris decides how hosts and services are set up and addressed on the tailnet - naming, name URLs, ACLs and tailnet-only listeners - and the decision is routed to its durable owner.
- **[Roadmap model](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/roadmap-model.md)** (paused) - The territory records work under the roadmap model, and the roadmap checker enforces it.
- **[Skill refresh](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/skill-refresh.md)** (planned) - Every Knowledge Islands skill is kept current and still relevant, prompted as part of the repository audit rather than found stale after the fact.
- **[Specification review](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/specification-review.md)** (planned) - Kris has reviewed every Specification across the Knowledge Islands projects, and each one is confirmed, revised or retired.
- **[Specifications](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/specifications.md)** (paused) - KI Specifications presents one consistent account of its authority and retained process, and the transferred KBEP and KBIP protocols each have a recorded disposition.
- **[Trades revamp](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/Streams/Projects/trades-revamp.md)** (planned) - The territory trade policy is succinct without changing what it grants, `map_bonus` is retired, and the related roadmap items agree with the result.

## Roadmap records that are not upcoming

Records that sit on a roadmap but are neither being worked on nor next in line. Triage records are unadopted by definition; held records wait on a named condition.

- [KI-TOOL-KI-CLI-172](/Users/krisbrown/kis/knowledge-islands/tools-ki/docs/roadmap/KI-TOOL-KI-CLI-172-group-vscode-workspaces-by-territory.md) - Group VS Code workspaces by territory; triage, never adopted.
- [KI-TOOL-RIG-CORE-075](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-075-restart-services-after-upgrade.md) - Restart services after upgrade; triage, never adopted.
- [KI-TOOL-RIG-CORE-076](/Users/krisbrown/kis/knowledge-islands/tools-rig/docs/roadmap/KI-TOOL-RIG-CORE-076-host-defaults-and-power.md) - Host defaults and power; triage, never adopted.
- [KI-OBSERVA-VIS-032](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-VIS-032-library-instrument.md) - Library instrument; draft on hold, waiting on the instrument restructure decision.
- [KI-OBSERVA-VIS-034](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-VIS-034-streams-instrument.md) - Streams instrument; draft on hold, waiting on the instrument restructure decision.
- [KI-OBSERVA-VIS-045](/Users/krisbrown/kis/knowledge-islands/apps-observatory.local/docs/roadmap/KI-OBSERVA-VIS-045-workers-instrument.md) - Workers instrument; draft on hold, waiting on the instrument restructure decision.

## Packages on hold

Work packages paused until a named release. While held, everything they carry (next steps, queued messages and parked queries) is neither active nor upcoming. Counts are of lines in each `messages.md` and parked entries in each `queries.md`.

- [`ki.prj.agent-host`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.agent-host/state.md) (more-expected) - release: when Kris brings this work package back up. Queued message lines: 4; parked queries: 5.
- [`ki.prj.baseline-rollout`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.baseline-rollout/state.md) (paused) - release: Kris says resume. Queued message lines: 11; parked queries: 15.
- [`ki.prj.estate-factorisation`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.estate-factorisation/state.md) (paused) - release: Kris's review of the Project close-out. Queued message lines: 1; parked queries: 13.
- [`ki.prj.paperclip-capture-and-rebuild`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.paperclip-capture-and-rebuild/state.md) (paused) - release: the island owner taking up remote Paperclip through the Enactment Process, as the Techne Programme Focus requires, with the work model settled; or resume. Queued message lines: 2; parked queries: 0.
- [`ki.prj.portable-specifications`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.portable-specifications/state.md) (paused) - release: Kris says resume. Queued message lines: 1; parked queries: 2.
- [`ki.prj.timelines`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.timelines/state.md) (paused) - release: Kris says resume. Queued message lines: 2; parked queries: 2.
- [`ki.prj.tools-burndown`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.tools-burndown/state.md) (paused) - release: Kris says resume. Queued message lines: 40; parked queries: 3.
- [`ki.prj.website`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.website/state.md) (paused) - release: when Kris opens this Project work. Queued message lines: 6; parked queries: 0.
- [`ki.reg.main`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.reg.main/state.md) (more-expected) - release: new regular work arriving. Queued message lines: 3; parked queries: 0.

## Parked queries

120 decisions put aside at a hold or by Kris, across 9 packages. Each stays in its package's `queries.md`; the summary here is cut short and the full text is at the source.

### [`ki.prj.agent-host`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.agent-host/discussions.md#parked)

- **CLI006-PLAN** -
- **DEV-MODE** -
- **RIG-LINK** -
- **HARNESS-INSTRUCTIONS** -
- **Firewall** - KI-TOOL-RIG-CORE-047 (macOS) and KI-TOOL-RIG-CORE-051 (Linux nftables) were delivered there; nothing is planned here. Recommended: leave it with that work.

### [`ki.prj.baseline-rollout`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.baseline-rollout/discussions.md#parked)

- **TMX-AREA-TITLES** - retitle Techmedix `CO` and `KB` in TMX-PRINCIPAL-KB-008; review agrees with changes at high: `CO` = "Company records and compliance", `KB` = "Knowledge base".
- **AREA-WORDING** - adopt the proposed area titles in the four HNR and 5g-emerge records; review agrees a) at high.
- **DEMO-AREA** - keep conformance work in 5g-emerge-demos `DEPLOY`, "Deployment and tooling"; review agrees a) at high.
- **VA-AREA-TITLES** - `GOV` = "Governance and operations", `KNW` = "Knowledge and sources" in VA-PRINCIPAL-GOV-007; review agrees a) at high.
- **TMX-THEMES** - registry pages `company-record` and `knowledge-stewardship`, relabel KB-003; recommended a) at medium; review agrees at high, as confirmation of the theme slice only.
- **LGL-THEMES** - remove three obsolete theme labels from five Legal records under OPS-024's rule; recommended a) at medium; review agrees with changes at medium: remove only the theme field, after ...
- **KB-THEMES** - remove `repository-governance` from PERSONAL-PRINCIPAL-011; recommended a) at medium; review agrees at high, and Rig's three parked ideas need not move.
- **ER-THEMES** - adopt the assessment's three directions as Equal Remedy themes; recommended a) at medium; review agrees with changes at medium: a theme-only answer to Equal Remedy's ALIGN ...
- **VA-THEMES** - `community-presence` and `company` pages for Valle Armonia; recommended a) at medium; review disagrees with a) as written: confirm both pages for the uncontested scope and leave ...
- **SANC008-SPLIT** - split stage 4 out of VA-WEBSITE-SANC-008; recommended a) at medium; review agrees with changes, high on separating stage 4 and medium on either resulting size.
- **VA-READY** - which apps-vallearmonia.com drafts become Ready; review agrees with changes at high on revised gates, not approving all four now.
- **SIZEKIND-CONFIRM-1** - size and kind tables for HNR, Legal and Personal; review disagrees with blanket confirmation and prefers b) with corrections (for example HNR-HARNESS-003 `m` to `s` ...
- **SPLIT-5GE-004** - record HNR-PRINCIPAL-5GE-004 as `xl` and leave the split to hnr-principal; review agrees a) at high.
- **SIZEKIND-CONFIRM-2** - size and kind tables for Equal Remedy, Valle Armonia and Techmedix; review agrees with changes at high on a revised write policy (for example VA-PRINCIPAL-GOV-003 `s` to `m`), low ...
- **ICO-DATE** - route the possibly lapsed Techmedix ICO fee (TMX-PRINCIPAL-CO-006) to Techmedix's own work; recommended a) at medium; review agrees with changes: route one line asking `tmx` ...

### [`ki.prj.estate-factorisation`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.estate-factorisation/discussions.md#parked)

- **DEPS-HOLD** -
- **STORE-REPAIR** -
- **HOST-GUARDS** -
- **HOST-WRITES** -
- **KI-RELEASE** -
- **TRIAGE-OWNERS** -
- **DOCK** -
- **RIG-REFS** -
- **ALIAS-OWNERS** -
- **RECEIVER-ROLLOUT** -
- **OBS-ACTIVATION** -
- **GOVERNANCE** -
- **PROJECT-CLOSE** -

### [`ki.prj.mac-studio-setup`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.mac-studio-setup/discussions.md#parked)

- **PLAN068-VERIFY-GRANT** -
- **PLAN068-UNPRIV** -
- **PLAN068-READY** -
- **RIG-TRIAGE** -
- **ADOBE-DATA** -
- **FW-LIVE** -
- **UE-089-SHAPE** -
- **OLD-ORPHANS** -
- **MGIT-PRESEED** -
- **SOL-SOURCES** -
- **SOL-HNR-HARNESS** -
- **SOL-WHATSAPP** -
- **SOL-KI-CONFIG-DRIFT** -
- **C56-TICK** -
- **C8-WORDING** -

### [`ki.prj.portable-specifications`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.portable-specifications/discussions.md#parked)

- **SPEC-TEXT** - draft 0.8 of `work`, `knowledge` and `acquire` in `design/specs/`, six blind reviews, the last finding nothing; recommended a) accept draft 0.8 and home it in the three skills ...
- **HOMING-EDITS** - four mechanical edits when homing (version 1 Status line, attribution kept, cross-spec links as plain names, a Contents list); recommended a) accept them as part of SPEC-TEXT ...

### [`ki.prj.timelines`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.timelines/discussions.md#parked)

- **OVERNIGHT-CONFIRM** - nine design points taken overnight under OVERNIGHT-AUTONOMY, nothing built on them yet; recommended a) confirm all nine (high).
- **CAPTURE-ADOPTION** - rollout steps 2 and 3 need draft records in 5G Emerge and legal-principal, outside the territory; recommended a) one run per repository, draft records only, linked to the decided ...

### [`ki.prj.tools-burndown`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.tools-burndown/discussions.md#parked)

- **HELD-ROADMAP-KNIP** -
- **ASK-B** -
- **SRC-PLACEMENT** - where KI-TOOL-KI-CLI-139's SharePoint mirror command sits. Recommended a) (medium, reviewer view): a separately specified source-maintenance command group in `ki`.

### [`ki.prj.ways-of-working`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.prj.ways-of-working/discussions.md#parked)

- **TERRA-LOCAL-REPORTS** -
- **TERRA-PR-CHECK** -
- **TERRA-RECOVERY** -
- **RIG-ATTENDED** -
- **ANSWER-VECTOR** -
- **AREA-COLUMN** -
- **HOST-SYNC** -
- **STREAM9-SHA** -
- **GATE-BASELINE-COMPARATOR** -
- **THREAD-DEFAULTS** -
- **LINK-EXTERNAL** -
- **PUSH-RETRY** -
- **HOMES** -
- **EXECUTION** -
- **HOST** -
- **DISPLAY** -
- **THEME** -
- **ROUTING** -
- **SIGNAL** -
- **RESTART** -
- **STATE-MACHINE-DECISIONS** - Open choices remain in work-state-machine.md. Recommended: settle them with the rollout.
- **FOLDER-MIGRATE** - This package has been tidied and its root reports moved losslessly into reports/; the wider migration remains open. Recommended: a) tidy, then git mv per package.
- **PACKAGE-FORWARDING** - PKG-POINTER original request preserved at bcb3c1a3:+/_WORK/ki.ways-of-working/messages.md and the Principal enactment report. Owner approved one authoritative package and a ...
- **PERM-PROMPTS-SETTINGS** - whether to change the chezmoi-managed permission settings; Kris, 25 October: "can we come back to it later?". Recommended: not now, revisit if Kris leaves bypass mode.
- **STEWARD-FIELD** - where a package records who looks after it; reviews disagree, the harness carries the model with a marked placeholder and the Valle Armonia pilot runs on `worker` as it is. ...
- **LEGACY-PREFIX** - whether a `repo_code` rename stays a one-sweep change; renames are rare and Personal's runs as one sweep, while an allowance costs two checkers and tools-ki. Recommended: write ...
- **PARTIAL-REPOS** - how a repository with only Pillars and Resources fits the model; Kris's own words defer it and HNR's tracked-notes workaround holds. Recommended: record the idea on the Ways of ...
- **UNATTENDED-FIELD** - recording unattended eligibility on records; a new record field with reviews disagreeing while the roadmap is cut to next to nothing. Recommended: adopt the optional `unattended` ...
- **UNATTENDED-AND-DUE-DATES** - adopting the eight criteria as the unattended assessment; the due-date half is done and the criteria stay Personal's prototype. Recommended: adopt the criteria in `ki-delegation` ...
- **CLI-PREVIEW** - whether public state-changing commands write by default and preview with `--dry-run`; a fleet-wide tool convention while tools are not ready and releases are deprioritised. ...
- **MGIT-CACHE-SCOPE** - what to build first for the mgit cache; Kris asked for the concept in plain language first, and the design note keeps the six routes. Recommended: `--repos-from` with `--to-cache` ...
- **MGIT-CACHE-FAILED** - whether a checkout the sweep failed on goes into the cached set; same feature as MGIT-CACHE-SCOPE. Recommended: exclude them, keep their names and count as diagnostics, and warn ...
- **RECORD-2** - work-package schema failures in thirteen folders; forty judgement fixes across live packages with reviews disagreeing on who makes them, and the full audit now runs only in CI. ...
- **FOLDER-1** - extras in two work folders; a rename of nine old reports and a script's home, with the review finding the counts wrong. Recommended: rename the nine to `<name>.report.md`, move ...
- **COORD-7-REST** - fifty-one identifiers in reports with no local target; a known floor in old run reports that marks will prune, and fixing it needs a fetch and a rewrite run. Recommended ...
- **LINT-WHERE** - where generated Markdown gets linted; the check-only staged hook of 26 October stops a bad report at commit with CI the backstop, and a generator check is extra machinery. ...
- **MISSING-TOOLS** - installing the missing hook tools in three package repositories; the recommendation is itself to wait, and installing would add new software. Recommended: leave them until the ...
- **REL-X64-TIMEOUT** - local timeout-only repair delivered and verified; release and pin work stays deferred until Kris explicitly reopens releases, under the current local-tools/no-release instruction.
- **MIRROR-TOKEN** - the Notion integration token and 1Password item behind the retired mirror; taken under the 27 October bulk reading, but the action is Kris's own and needs Notion and a credential ...
- **PROTECTED-PUBLICATION** - the current unpublished Principal stack has two protected report blob versions in the existing private safe-sync inventory. Owning Observatory has an IMPORTANT disposition request ...
- **MD-STANDARD-REMAINDER** - local writer/exclusion and staged-gate evidence is independently accepted Done in CLI-175; the HNR hook-bypass cause, global historical cleanliness and other-host/provider ...
- **ENACTMENT-ADMIN** - the 20 October tiered/Admin-only gate-narrowing choice remains unmade; retain the current gate. Full original decision is retained in decisions.md.
- **PROXY-SHAPER** - Kris deferred this on 25 October; no proxy or chezmoi change. Full original owner words remain in decisions.md; revisit only when taken up.

### [`ki.sop.main`](https://github.com/knowledgeislands/ki-principal/blob/d8ab8112/+/_WORK/ki.sop.main/discussions.md#parked)

- **ACCEPT-CHEZMOI** -
- **ACCEPT-KI-WEBSITE-SITE-044** -
- **ACCEPT-KI-PRINCIPAL-OPS-014** -
- **ACCEPT-KI-PRINCIPAL-MOD-009** -
- **ACCEPT-KI-TOOL-RIG-CORE-062** -
- **ACCEPT-OBSERVATORY** -
- **AGENT-HOST** -
- **CLI006-CONFIRM** -
- **CLI006-READY** -
- **ESTATE-CLOSE** -
- **KA-CLOSE** -
- **SPECS-FOLDER** -
- **MAIL-MCP-HOME** -
- **ACQUIRE-HOME** -
- **SANCTUARY-STAGE5** -
- **BASELINE** -
- **HARNESS-LINK** -
- **GRANOLA** -
- **LEGAL-GUIDANCE** -
- **HNR-GUIDANCE** -
- **THEME-REGISTRY** -
- **PRE-REBASE-REF** -
- EXTERNAL-SWEEPS (31 October 2026, from personal.reg.tower): how regular activities that pull information from external sources (such as the weekly Tower guide sweep, PERSONAL-TOWER-HK-001) should be handled. Kris: "I don't think we need to solve it now."
