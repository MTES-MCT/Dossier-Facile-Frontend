import { useTenantStore } from '@/stores/tenant-store'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed } from 'vue'

const CATEGORY_TO_PATH: Record<string, string> = {
  ALTERNATION: 'alternance',
  ARTIST: 'artiste-auteur',
  CDD: 'cdd',
  CDI: 'cdi',
  CDI_TRIAL: 'cdi',
  CTT: 'interimaire',
  INDEPENDENT: 'independant',
  INTERMITTENT: 'intermittence',
  INTERNSHIP: 'stage',
  NO_ACTIVITY: 'sans-activite',
  OTHER: 'autre',
  PUBLIC: 'public',
  RETIRED: 'retraite',
  STAY_AT_HOME_PARENT: 'parent-au-foyer',
  STUDENT: 'etudes',
  UNEMPLOYED: 'chomage'
}

export function makeActivityLink(category: string | undefined, path = '/documents-locataire/3') {
  if (!category || !(category in CATEGORY_TO_PATH)) {
    return path
  }
  return `${path}/${CATEGORY_TO_PATH[category]}`
}

export function useMainActivityLink() {
  const store = useTenantStore()
  const link = computed(() => {
    const document = store.user.documents?.find((d) => d.documentCategory === 'PROFESSIONAL')
    return makeActivityLink(document?.documentSubCategory)
  })
  return link
}

export function makeGuarantorActivityLink(guarantor: Guarantor) {
  const document = guarantor.documents?.find((d) => d.documentCategory === 'PROFESSIONAL')
  return makeActivityLink(document?.documentSubCategory, `/info-garant/3/${guarantor.id}`)
}

export function makeGuarantorCoupleActivityLink(g: Guarantor, tenantId: number) {
  const doc = g.documents?.find((d) => d.documentCategory === 'PROFESSIONAL')
  const path = `/info-garant-locataire/${tenantId}/${g.id}/5/3`
  return makeActivityLink(doc?.documentSubCategory, path)
}
