import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'

const RESIDENCY_PATH = '/info-garant/2'
const CATEGORY_TO_PATH: Record<string, string> = {
  TENANT: 'tenant',
  OWNER: 'owner',
  GUEST_COMPANY: 'guest-company',
  OTHER_RESIDENCY: 'other'
}

function documentPath(doc: DfDocument | undefined) {
  const category = doc?.documentSubCategory
  if (!category) {
    return ''
  }
  if (category === 'GUEST') {
    // Default to GuestProof for documents without a CategoryStep
    return doc.documentCategoryStep === 'GUEST_NO_PROOF' ? `/guest/no-proof` : `/guest/proof`
  }
  return '/' + CATEGORY_TO_PATH[category]
}

export function makeGuarantorResidencyLink(guarantor: Guarantor) {
  const document = guarantor?.documents?.find((d) => d.documentCategory === 'RESIDENCY')
  return `${RESIDENCY_PATH}/${guarantor.id}${documentPath(document)}`
}

export function makeCotenantGuarantorResidencyLink(
  tenantId: number,
  guarantorId: number,
  document: DfDocument | undefined
) {
  return `/info-garant-locataire/${tenantId}/${guarantorId}/5/2${documentPath(document)}`
}
