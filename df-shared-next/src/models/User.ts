import { DfDocument } from './DfDocument'
import type { DocumentCategory } from './DfDocument'
import { Guarantor } from './Guarantor'
import { ApartmentSharing } from './ApartmentSharing'
import type { TenantFileStatus } from './TenantFileStatus'
import type { ApplicationType } from './ApplicationType'
import type { FranceConnectIdentity } from './FranceConnectIdentity'
import type { DocumentRule } from './DocumentRule'

export class User {
  id!: number
  ownerType?: 'SELF' | 'THIRD_PARTY'
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
  franceConnectIdentity?: FranceConnectIdentity

  /** This is not sent by the backend but added in the frontend */
  applicationType?: ApplicationType
}

export class DocumentAnalysisStatus {
  id!: number
  isFinished!: boolean
  isValid!: boolean
  failedRules?: DocumentRule[]
}

export class PreviewDocument {
  documentCategory!: DocumentCategory
  document?: DfDocument
  documentAnalysisStatus?: DocumentAnalysisStatus
}
