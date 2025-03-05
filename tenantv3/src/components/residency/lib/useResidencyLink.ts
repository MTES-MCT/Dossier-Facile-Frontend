import { useTenantStore } from '@/stores/tenant-store'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { User } from 'df-shared-next/src/models/User'
import { computed } from 'vue'

const RESIDENCY_PATH = '/documents-locataire/2'
const CATEGORY_TO_PATH: Record<string, string> = {
  OWNER: 'owner',
  GUEST_COMPANY: 'guest-company',
  GUEST_ORGANISM: 'guest-organism',
  SHORT_TERM_RENTAL: 'short-term-rental',
  OTHER_RESIDENCY: 'other-residency'
}

function documentPath(doc: DfDocument | undefined) {
  const category = doc?.documentSubCategory
  if (!category) {
    return ''
  }
  if (category === 'TENANT') {
    // Default to TenantReceipts for documents without a CategoryStep
    return doc.documentCategoryStep === 'TENANT_PROOF' ? `/tenant/proof` : `/tenant/receipts`
  } else if (category === 'GUEST') {
    // Default to GuestProof for documents without a CategoryStep
    return doc.documentCategoryStep === 'GUEST_NO_PROOF' ? `/guest/no-proof` : `/guest/proof`
  }
  return '/' + CATEGORY_TO_PATH[category]
}

export function makeResidencyLink(user: User | CoTenant, path = RESIDENCY_PATH) {
  const document = user.documents?.find((d) => {
    return d.documentCategory === 'RESIDENCY'
  })
  return `${path}${documentPath(document)}`
}

export function useResidencyLink() {
  const store = useTenantStore()
  const link = computed(() => makeResidencyLink(store.user))
  return link
}
