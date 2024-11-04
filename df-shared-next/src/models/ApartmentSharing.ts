import { User } from './User'

export class ApartmentSharing {
  id?: number
  tenants: User[] = []
  status?: string
  token?: string
  tokenPublic?: string
  applicationType?: string
  totalSalary?: number
  totalGuarantorSalary?: number
}
