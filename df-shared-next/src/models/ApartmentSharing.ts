import { User } from './User'

type TenantFileStatus = 'TO_PROCESS' | 'VALIDATED' | 'DECLINED' | 'INCOMPLETE' | 'ARCHIVED'

export class ApartmentSharing {
  id?: number
  tenants: User[] = []
  status?: TenantFileStatus
  token?: string
  tokenPublic?: string
  applicationType?: string
  totalSalary?: number
  totalGuarantorSalary?: number
}
