import { User } from 'df-shared-next/src/models/User'

export default class Applicant extends User {
  lastUpdateDate?: Date

  tenantName?: string

  tenantSalary?: number

  guarantorSalary?: number

  rate?: number
}
