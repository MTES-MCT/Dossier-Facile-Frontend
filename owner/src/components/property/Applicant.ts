import type { User } from 'df-shared-next/src/models/User'

export type Applicant = User & {
  tenantName: string
  tenantSalary: string
  guarantorSalary: string
  rate: number
  token?: string
}
