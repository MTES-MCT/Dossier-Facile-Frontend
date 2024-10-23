import { User } from './User'

export class FileUser {
  id!: number
  applicationType?: string

  tenants?: User[]
  dossierPdfUrl?: string
  dossierPdfDocumentStatus?: string
  status?: string
  lastUpdateDate?: Date
}
