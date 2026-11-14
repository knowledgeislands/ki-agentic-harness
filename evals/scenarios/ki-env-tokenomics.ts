/**
 * Outcome scenarios for the portable `ki-env-tokenomics` contract.
 *
 * These test the boundary between declared policy, bounded filesystem evidence,
 * and effective session state rather than retired runtime-specific machinery.
 */
import type { Scenario } from "../harness.ts";

export const scenarios: Scenario[] = [
  {
    skill: "ki-env-tokenomics",
    id: "tokenomics-malformed-nested-policy",
    prompt:
      'A repository declares `[skills.ki-env-tokenomics]` but sets `budgets = "large"` and `model_tier_bindings = []`. Should the audit treat missing child keys as an empty policy or reject the configuration?',
    assertions: [
      { name: "fails closed", re: /fail(s)? closed|reject|violation|invalid/i },
      {
        name: "budgets must be a table",
        re: /budgets[^\.\n]{0,50}(table|mapping)/i,
      },
      {
        name: "bindings must be a table",
        re: /model_tier_bindings[^\.\n]{0,50}(table|mapping)/i,
      },
    ],
    rubric:
      "Both nested values have required table shape. The audit rejects malformed `budgets` and `model_tier_bindings`; it must not coerce either to an empty object and report a clean policy.",
  },
  {
    skill: "ki-env-tokenomics",
    id: "tokenomics-policy-is-not-observation",
    prompt:
      "A portable tokenomics configuration validates. Does that prove a budget was measured, the effective model used the declared purpose, or standing-context cost was attributed?",
    assertions: [
      {
        name: "no measurement proof",
        re: /(does not|doesn.?t|cannot)[^\.\n]{0,60}(measure|budget|overage)/i,
      },
      {
        name: "no effective model proof",
        re: /(effective|actual)[^\.\n]{0,25}model[^\.\n]{0,45}(unavailable|not|unknown)/i,
      },
      {
        name: "no attribution proof",
        re: /attribution[^\.\n]{0,45}(unavailable|not observed|not proved|unknown)/i,
      },
    ],
    rubric:
      "A valid portable table proves only declared policy. It does not observe usage, an overage, the effective model, standing-surface attribution, or routing execution. Those outcomes require adapter or session evidence and remain explicitly unavailable otherwise.",
  },
  {
    skill: "ki-env-tokenomics",
    id: "tokenomics-runtime-evidence-boundary",
    prompt:
      "What may a runtime tokenomics adapter safely report from bounded repository files, and what must remain unavailable without separate session authority?",
    assertions: [
      {
        name: "direct repository observations",
        re: /(observed|parseable|present)[^\.\n]{0,60}(repository|project|file|source)/i,
      },
      {
        name: "session facts unavailable",
        re: /(loaded context|active MCP|effective model|memory use|transcript|compaction)[\s\S]{0,140}unavailable/i,
      },
      {
        name: "no user or secret inference",
        re: /(user|secret|session)[^\.\n]{0,70}(not read|without authority|separate.*author)/i,
      },
    ],
    rubric:
      "An adapter may report direct, bounded, non-secret repository observations such as physical instruction/config sources and parse failures. Effective model, loaded context, active MCP state, trust, memory use, transcripts, compaction, and billing remain unavailable without separately authorised session evidence; no user-home or secret inference fills the gap.",
  },
];
