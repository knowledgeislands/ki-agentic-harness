export const DOCTOR_SCHEMA = 1 as const

export type DoctorScope = 'repo' | 'user'
export type DoctorStatus = 'healthy' | 'absent' | 'recoverable' | 'unsafe'
export type DoctorAction = 'none' | 'educate' | 'clean' | 'repo-uninstall' | 'user-uninstall' | 'manual-reconciliation'

export type DoctorFinding = {
  code: string
  status: DoctorStatus
  message: string
  evidence?: string
}

export type DoctorReport = {
  schema: typeof DOCTOR_SCHEMA
  scope: DoctorScope
  subject: string
  status: DoctorStatus
  action: DoctorAction
  exit: 0 | 1
  findings: DoctorFinding[]
}

const STATUS_RANK: Record<DoctorStatus, number> = {
  healthy: 0,
  absent: 0,
  recoverable: 1,
  unsafe: 2
}

export function report(scope: DoctorScope, subject: string, findings: DoctorFinding[], recoverableAction: DoctorAction): DoctorReport {
  const status = findings.reduce<DoctorStatus>(
    (current, finding) => (STATUS_RANK[finding.status] > STATUS_RANK[current] ? finding.status : current),
    findings.every((finding) => finding.status === 'absent') ? 'absent' : 'healthy'
  )
  const action = status === 'unsafe' ? 'manual-reconciliation' : status === 'recoverable' ? recoverableAction : 'none'
  return { schema: DOCTOR_SCHEMA, scope, subject, status, action, exit: status === 'healthy' || status === 'absent' ? 0 : 1, findings }
}

export function terminalReport(value: DoctorReport): string {
  const rows = [
    `DOCTOR ${value.scope} — ${value.status}`,
    `subject: ${value.subject}`,
    ...value.findings.map(
      (finding) => `${finding.status.padEnd(11)} ${finding.code}: ${finding.message}${finding.evidence ? ` (${finding.evidence})` : ''}`
    ),
    `next: ${value.action}`
  ]
  return `${rows.join('\n')}\n`
}
