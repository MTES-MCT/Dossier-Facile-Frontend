import { DfDocument } from './DfDocument'

export class Guarantor {
  id?: number

  lastName?: string
  firstName?: string
  typeGuarantor?: 'NATURAL_PERSON' | 'LEGAL_PERSON' | 'ORGANISM'
  legalPersonName?: string

  documents?: DfDocument[]
}
