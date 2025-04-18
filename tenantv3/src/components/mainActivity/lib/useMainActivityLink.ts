import { useTenantStore } from '@/stores/tenant-store'
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

export function makeActivityLink(category: string | undefined) {
  const path = '/documents-locataire/3'
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
