/**
 * Source-local, advisory Codex model-tier evidence.
 *
 * This resolver never observes or selects an effective runtime model. A caller
 * still needs existing delegation authority and separately authorised evaluation
 * before turning a recommendation into an execution default.
 */

export const CODEX_MODEL_TIER_ROLES = ['orchestration', 'judgment', 'mechanical'] as const
export type CodexModelTierRole = (typeof CODEX_MODEL_TIER_ROLES)[number]

export const CODEX_MODEL_TIER_EVIDENCE = {
  reasoning: 'Sol',
  standard: 'Terra',
  fast: 'Luna'
} as const

type PortablePurpose = 'frontier' | keyof typeof CODEX_MODEL_TIER_EVIDENCE

export type CodexModelTierResolution = {
  readonly purpose: PortablePurpose
  readonly evidenceFamily?: (typeof CODEX_MODEL_TIER_EVIDENCE)[keyof typeof CODEX_MODEL_TIER_EVIDENCE]
  readonly advisoryBinding?: string
  readonly status: 'runtime-evidence' | 'advisory-binding' | 'inherit'
  readonly requiresAuthorisedEvaluation: true
}

const PURPOSE_BY_ROLE: Record<CodexModelTierRole, PortablePurpose> = {
  orchestration: 'frontier',
  judgment: 'reasoning',
  mechanical: 'fast'
}

/**
 * Resolves a stable work role to a portable purpose plus dated runtime evidence.
 * A repository binding remains opaque and advisory because this adapter cannot
 * establish that a configured family is available or effective in a session.
 */
export const resolveCodexModelTier = (
  role: CodexModelTierRole,
  modelTierBinding?: string
): CodexModelTierResolution => {
  const purpose = PURPOSE_BY_ROLE[role]
  const advisoryBinding = modelTierBinding?.trim() || undefined
  const evidenceFamily = CODEX_MODEL_TIER_EVIDENCE[purpose as keyof typeof CODEX_MODEL_TIER_EVIDENCE]

  return {
    purpose,
    ...(evidenceFamily ? { evidenceFamily } : {}),
    ...(advisoryBinding ? { advisoryBinding } : {}),
    status: advisoryBinding ? 'advisory-binding' : evidenceFamily ? 'runtime-evidence' : 'inherit',
    requiresAuthorisedEvaluation: true
  }
}
