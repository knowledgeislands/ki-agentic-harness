---
id: session
title: Session
type: system-layer
territory: knowledge-islands
island: ki-agentic-harness
status: agreed
origin: Cairn summit change 22, CARD-SESSION and SESSION-THREADS (Kris, 12 November 2026)
links:
  agent:
    predicate: ki:runOf
  harness:
    predicate: ki:runBy
---

# Session

A session is one run of an [agent][agent]: a conversation with its own context, its own id and the folder it works in. It is made of **turns**, each a request and the agent's work on it. The [agent harness][harness] runs the session and keeps its **transcript**, the record of every turn, so the session can be resumed later with its context intact.

A session is also made of **threads**. The agent's own line of work is its **primary thread**, and each [subagent][next] it starts works in a thread of its own within the session. A thread is a part of a session, never another word for one.

## Examples by vendor

| | Anthropic | OpenAI | Google | Microsoft and GitHub |
| --- | --- | --- | --- | --- |
| **Current names** | A Claude Code session, local or in the cloud, made of turns and stored as a transcript; claude.ai calls it a conversation | In Codex Cloud and on mobile a task; in the ChatGPT desktop app a chat; in the Codex App Server a session is a top-level thread, made of turns, themselves made of items, with each subagent in an agent thread of its own | In Antigravity a conversation in the app and a session in its CLI, with session ids; in the Agent Development Kit (ADK) a Session; in Gemini CLI a session; in Jules a task in the app and a Session in its API | In VS Code an agent session, with chats inside it; on GitHub a session, started as an agent task; in Microsoft Agent Framework an agent session |
| **Their word** | "session": "A conversation tied to your current directory, with its own independent context window" | "task" or "chat", by surface, and "thread" for its parts | "conversation" or "session"; the ADK's Session is "The Current Conversation Thread" | "session": "the conversation and activity associated with agentic work" |
| **Sources** | [A3][a3] | [O4][o4], [O8][o8], [O9][o9], [O10][o10], [O11][o11] | [G2][g2], [G4][g4], [G5][g5], [G6][g6] | [M3][m3], [M5][m5], [M7][m7], [M8][m8] |

Session is Anthropic's word and the majority's, so it is this card's name. OpenAI's task and chat, Google's conversation and Microsoft's agent session are synonyms for it. OpenAI's top-level thread is the session's primary thread. The sources and the dates they were checked are in [the skill's sources](sources.md).

## Where a name has more than one sense

- **Task** names a session in Codex Cloud, Codex on mobile and Jules, where Claude Code says session, but also a unit of delegated work, as GitHub's agent task is, scheduled work, as Anthropic's and OpenAI's scheduled tasks are, and a tool in VS Code's Copilot harness. No card uses it as a term; read it by context.
- **Thread** on this card is a part of a session: the primary thread, or a subagent's thread. OpenAI's App Server says thread for the top-level conversation, which is the primary thread; Google uses thread loosely for a conversation, and the ADK calls its Session a conversation thread.
- **Conversation** is a session on claude.ai and in Antigravity's app, and also the plain word for any exchange; this card's sense is the run, with its context and id.
- **Chat** is a session in the ChatGPT desktop app, where Claude Code says session, but in VS Code's agent session a chat is one part inside the session.
- OpenAI has renamed one heading from thread to task to chat, keeping all three anchors, so its docs still mix the three for the same thing.

## Specifications

- **Agent Client Protocol (ACP):** its session. Pending: the ACP specification card.
- **Agent Host Protocol (AHP):** its session and the chats inside it. Pending: the AHP specification card.

## Our conventions

The Knowledge Islands system already says session in this sense, as in the `ki-acquire` skill's agent-session acquisition and the housekeeping skills' session inventories, and has no convention of its own to map onto it.

## Next

A [subagent][next] is an agent started by another agent to do part of its work, in a thread of its own.

[agent]: ./term-agent.md
[harness]: ./term-agent-harness.md
[next]: ./term-subagent.md
[a3]: https://code.claude.com/docs/en/glossary.md
[o4]: https://learn.chatgpt.com/docs/app-server
[o8]: https://learn.chatgpt.com/docs/mobile.md
[o9]: https://learn.chatgpt.com/docs/changelog
[o10]: https://learn.chatgpt.com/docs/remote-connections.md
[o11]: https://learn.chatgpt.com/docs/agent-configuration/subagents
[g2]: https://antigravity.google/docs/overview
[g4]: https://antigravity.google/docs/cli/conversations/
[g5]: https://adk.dev/sessions/
[g6]: https://jules.google/docs/changelog/
[m3]: https://code.visualstudio.com/docs/copilot/agents/overview
[m5]: https://learn.microsoft.com/en-us/agent-framework/overview/
[m7]: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
[m8]: https://microsoft.github.io/agent-host-protocol/guide/what-is-ahp.html
