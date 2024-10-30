import { User } from 'df-shared-next/src/models/User'

export default class Applicant extends User {
  tenantName?: string

  tenantSalary?: string

  guarantorSalary?: string

  rate?: number
}
