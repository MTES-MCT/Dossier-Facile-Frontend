import type { DfDocument } from './DfDocument'
import type { Guarantor } from './Guarantor'
import type { TenantFileStatus } from './TenantFileStatus'

export type CoTenant = {
  id: number
  ownerType?: 'SELF' | 'THIRD_PARTY'
  firstName?: string
  lastName?: string
  preferredName?: string
  email: string
  tenantType?: 'CREATE' | 'JOIN'
  status?: TenantFileStatus
  documents?: DfDocument[]
  guarantors: Guarantor[]
  franceConnect?: boolean
}
