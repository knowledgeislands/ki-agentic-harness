/**
 * Outcome scenarios for the portable `ki-env-binding` contract.
 *
 * These distinguish canonical source validation from client projection and runtime
 * health. They intentionally avoid retired client tokens and unverified Cowork
 * behavior.
 */
import type { Scenario } from "../harness.ts";

export const scenarios: Scenario[] = [
  {
    skill: "ki-env-binding",
    id: "binding-url-transport-is-client-specific",
    prompt:
      "A canonical MCP entry has one HTTPS URL and targets Claude Code plus Codex. Is the URL alone sufficient, and what must the portable binding record contain?",
    assertions: [
      {
        name: "url alone is insufficient",
        re: /(not|isn.?t)[^\.\n]{0,50}(enough|sufficient)|must also/i,
      },
      {
        name: "transport is per client",
        re: /per-client|each client|for (both|every) client/i,
      },
      {
        name: "native transports may differ",
        re: /streamable_http|http|native transport/i,
      },
    ],
    rubric:
      "A URL is not a complete portable definition. Every targeted URL client must have one explicitly supported native transport; for example Claude Code may use `http`, while Codex uses `streamable_http`. The source must fail closed when a targeted client lacks that mapping.",
  },
  {
    skill: "ki-env-binding",
    id: "binding-source-resolution-is-shared",
    prompt:
      "How must the portable binding and its client adapters choose the canonical MCP source when KI_MCP_SOURCE and XDG_CONFIG_HOME may be set?",
    assertions: [
      {
        name: "explicit override first",
        re: /KI_MCP_SOURCE[^\.\n]{0,60}(first|precedence|override)/i,
      },
      {
        name: "absolute XDG second",
        re: /XDG_CONFIG_HOME[^\.\n]{0,80}(absolute|second|then)/i,
      },
      {
        name: "home fallback last",
        re: /\.config\/ki\/mcp-servers\.yaml|home[^\.\n]{0,40}fallback/i,
      },
      {
        name: "same resolver",
        re: /(same|shared|identical)[^\.\n]{0,40}(resolver|source)/i,
      },
    ],
    rubric:
      "The root and every adapter use the same resolver: explicit `KI_MCP_SOURCE`, then an absolute `XDG_CONFIG_HOME`, then `<home>/.config/ki/mcp-servers.yaml`. An unreadable or invalid selected source is unavailable or a violation; adapters must not silently inspect a different fallback.",
  },
  {
    skill: "ki-env-binding",
    id: "binding-definition-is-not-health",
    prompt:
      "The canonical source and a client config have the same server name. What can a binding audit conclude before it has direct authorised runtime evidence?",
    assertions: [
      {
        name: "name parity is insufficient",
        re: /name[^\.\n]{0,35}(not|isn.?t)[^\.\n]{0,35}(enough|definition|health)|name parity/i,
      },
      {
        name: "compare definition",
        re: /transport|url|command|args|full[^\.\n]{0,20}definition/i,
      },
      {
        name: "runtime health unavailable",
        re: /(health|reachability|usable tools|authentication)[^\.\n]{0,60}unavailable/i,
      },
    ],
    rubric:
      "Name parity proves neither definition parity nor runtime health. Audit compares the full non-secret targeted definition, including URL/transport or command/args. Authentication, reachability, initialized transport, and usable tools remain unavailable without separately authorised direct runtime evidence.",
  },
];
