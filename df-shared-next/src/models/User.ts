import { DfDocument } from './DfDocument'
import { Guarantor } from './Guarantor'
import { ApartmentSharing } from './ApartmentSharing'
import type { TenantFileStatus } from './TenantFileStatus'
import type { ApplicationType } from './ApplicationType'

export class User {
  id!: number
  firstName?: string
  lastName?: string
  preferredName?: string
  zipCode?: string
  abroad?: boolean
  email!: string
  tenantType?: 'CREATE' | 'JOIN'
  status?: TenantFileStatus
  honorDeclaration?: boolean
  lastUpdateDate?: Date
  clarification?: string
  apartmentSharing: ApartmentSharing = {
    tenants: []
  }
  documents?: DfDocument[]
  guarantors: Guarantor[] = []
  franceConnect?: boolean
  passwordEnabled?: boolean
  preValidationActivated?: boolean

  /** This is not sent by the backend but added in the frontend */
  applicationType?: ApplicationType
}
