import { DfDocument } from './DfDocument'

export class Guarantor {
  id?: number

  lastName?: string
  firstName?: string
  typeGuarantor?: string
  legalPersonName?: string

  documents?: DfDocument[]
}
