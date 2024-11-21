import type { ApplicationType } from './ApplicationType'
import type { TenantFileStatus } from './TenantFileStatus'
import { User } from './User'

export class ApartmentSharing {
  id?: number
  tenants: User[] = []
  status?: TenantFileStatus
  token?: string
  tokenPublic?: string
  applicationType?: ApplicationType
  totalSalary?: number
  totalGuarantorSalary?: number
}
