import type { IdentityCategory } from '@/components/documents/share/DocumentTypeConstants'
import { useTenantStore } from '@/stores/tenant-store'
import type { DfDocument } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed } from 'vue'

const IDENTIFICATION_PATH = '/documents-locataire/1'
const CATEGORY_TO_PATH: Record<IdentityCategory, string> = {
  FRENCH_IDENTITY_CARD: 'carte',
  DRIVERS_LICENSE: 'permis-conduire',
  FRENCH_PASSPORT: 'passeport',
  FRENCH_RESIDENCE_PERMIT: 'titre-sejour',
  FRANCE_IDENTITE: 'france-identite',
  OTHER_IDENTIFICATION: 'autre'
}

function isCategory(string: string): string is IdentityCategory {
  return Object.keys(CATEGORY_TO_PATH).includes(string)
}

function identityDocumentToPath(doc: DfDocument | undefined) {
  const category = doc?.documentSubCategory
  if (!category || !isCategory(category)) {
    return ''
  }
  return `/${CATEGORY_TO_PATH[category]}`
}

export function makeIdentityDocumentLink(doc: DfDocument | undefined, path = IDENTIFICATION_PATH) {
  return `${path}${identityDocumentToPath(doc)}`
}

export function makeGuarantorIdentityDocumentLink(guarantor: Guarantor) {
  const document = guarantor.documents?.find((d) => d.documentCategory === 'IDENTIFICATION')
  return makeIdentityDocumentLink(document, `/info-garant/1/${guarantor.id}`)
}

export function makeSpouseGuarantorIdDocLink(g: Guarantor, tenantId: number) {
  const doc = g.documents?.find((d) => d.documentCategory === 'IDENTIFICATION')
  return makeIdentityDocumentLink(doc, `/info-garant-locataire/${tenantId}/${g.id}/5/1`)
}

export function useIdentityDocumentLink() {
  const store = useTenantStore()
  const doc = store.getTenantIdentificationDocument
  const link = computed(() => makeIdentityDocumentLink(doc))
  return link
}
