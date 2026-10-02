import type { Applicant } from './Applicant'

export const APPLICANT_COLUMNS = {
  date: 'lastUpdateDate',
  'tenant-name': 'tenantName',
  'tenant-type': 'tenantType',
  'tenant-salary': 'tenantSalary',
  'guarantor-salary': 'guarantorSalary',
  rate: 'rate',
  status: 'status'
} as const satisfies Record<string, keyof Applicant>

export type ApplicantColumn = keyof typeof APPLICANT_COLUMNS

export const APPLICANT_SELECTION_COLUMN_COUNT = 1

export const APPLICANT_TABLE_COLUMN_COUNT =
  Object.keys(APPLICANT_COLUMNS).length + APPLICANT_SELECTION_COLUMN_COUNT
