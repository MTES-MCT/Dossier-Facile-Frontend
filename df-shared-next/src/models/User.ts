import { DfDocument } from './DfDocument'
import { Guarantor } from './Guarantor'
import { ApartmentSharing } from './ApartmentSharing'

export class User {
  id!: number
  email!: string
  password?: string
  token?: string
  confirm?: string
  captcha?: string
  lastName?: string
  preferredName?: string
  firstName?: string
  zipCode?: string
  applicationType?: string
  tenantType?: string
  status?: string
  lastUpdateDate?: Date
  honorDeclaration?: boolean
  clarification?: string
  franceConnect?: boolean
  passwordEnabled?: boolean

  identification?: string
  residency?: string
  professional?: string
  financial?: string
  tax?: string

  apartmentSharing: ApartmentSharing = {
    tenants: []
  }
  guarantors: Guarantor[] = []
  documents?: DfDocument[]
  allowCheckTax?: boolean
  linkUrl?: string
  preValidationActivated?: boolean
}
