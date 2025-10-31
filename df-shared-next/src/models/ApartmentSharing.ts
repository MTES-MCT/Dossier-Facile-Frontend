import type { CoTenant } from './CoTenant'
import type { ApplicationType } from './ApplicationType'
import type { TenantFileStatus } from './TenantFileStatus'

export class ApartmentSharing {
  id?: number
  tenants: CoTenant[] = []
  status?: TenantFileStatus
  token?: string
  tokenPublic?: string
  applicationType?: ApplicationType
  totalSalary?: number
  totalGuarantorSalary?: number
  dossierPdfUrl?: string
}
