import { useTenantStore } from '@/stores/tenant-store'
import type {
  DfDocument,
  DocumentCategory,
  DocumentCategoryStep
} from 'df-shared-next/src/models/DfDocument'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'

export const CATEGORY_TO_PATH: Record<string, string> = {
  // Financial
  SALARY: 'travail',
  SOCIAL_SERVICE: 'social',
  PENSION: 'pension',
  RENT: 'rente',
  SCHOLARSHIP: 'bourse',
  NO_INCOME: 'pas-de-revenus',
  // Identity
  FRENCH_IDENTITY_CARD: 'carte',
  FRENCH_PASSPORT: 'passeport',
  FRENCH_RESIDENCE_PERMIT: 'titre-sejour',
  DRIVERS_LICENSE: 'permis-conduire',
  FRANCE_IDENTITE: 'france-identite',
  OTHER_IDENTIFICATION: 'autre',
  // Residency
  TENANT: 'tenant/receipts',
  OWNER: 'owner',
  GUEST: 'guest',
  GUEST_ORGANISM: 'guest-organism',
  SHORT_TERM_RENTAL: 'short-term-rental',
  OTHER_RESIDENCY: 'other-residency',
  GUEST_COMPANY: 'guest-company',
  // Professional
  CDI: 'cdi',
  CDD: 'cdd',
  PUBLIC: 'public',
  INDEPENDENT: 'independant',
  RETIRED: 'retraite',
  UNEMPLOYED: 'chomage',
  STUDENT: 'etudes',
  ALTERNATION: 'alternance',
  INTERNSHIP: 'stage',
  CTT: 'interimaire',
  INTERMITTENT: 'intermittence',
  ARTIST: 'artiste-auteur',
  STAY_AT_HOME_PARENT: 'parent-au-foyer',
  NO_ACTIVITY: 'sans-activite',
  OTHER: 'autre',
  // Tax
  MY_NAME: 'avec-avis',
  MY_PARENTS: 'sans-avis/parents',
  OTHER_TAX: 'sans-avis/autre',
  LESS_THAN_YEAR: 'non-renseigne'
}

export const STEP_TO_PATH: { [P in DocumentCategoryStep]?: string } = {
  SALARY_EMPLOYED_LESS_3_MONTHS: 'travail/salarie/moins-3-mois',
  SALARY_EMPLOYED_MORE_3_MONTHS: 'travail/salarie/plus-3-mois',
  SALARY_EMPLOYED_NOT_YET: 'travail/salarie/pas-encore',
  SALARY_FREELANCE_AUTOENTREPRENEUR: 'travail/independant/auto-entrepreneur',
  SALARY_FREELANCE_OTHER: 'travail/independant/autre',
  SALARY_INTERMITTENT: 'travail/intermittent',
  SALARY_ARTIST_AUTHOR: 'travail/artiste-auteur',
  SALARY_UNKNOWN: 'travail/inconnu',
  SOCIAL_SERVICE_CAF_LESS_3_MONTHS: 'social/caf/moins-3-mois',
  SOCIAL_SERVICE_CAF_MORE_3_MONTHS: 'social/caf/plus-3-mois',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_LESS_3_MONTHS: 'social/france-travail/moins-3-mois',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_MORE_3_MONTHS: 'social/france-travail/plus-3-mois',
  SOCIAL_SERVICE_FRANCE_TRAVAIL_NOT_YET: 'social/france-travail/pas-encore',
  SOCIAL_SERVICE_APL_LESS_3_MONTHS: 'social/apl/moins-3-mois',
  SOCIAL_SERVICE_APL_MORE_3_MONTHS: 'social/apl/plus-3-mois',
  SOCIAL_SERVICE_APL_NOT_YET: 'social/apl/pas-encore',
  SOCIAL_SERVICE_AAH_LESS_3_MONTHS: 'social/aah/moins-3-mois',
  SOCIAL_SERVICE_AAH_MORE_3_MONTHS: 'social/aah/plus-3-mois',
  SOCIAL_SERVICE_AAH_NOT_YET: 'social/aah/pas-encore',
  SOCIAL_SERVICE_OTHER: 'social/autre',
  PENSION_STATEMENT: 'pension/retraite/bulletin',
  PENSION_NO_STATEMENT: 'pension/retraite/pas-de-bulletin',
  PENSION_DISABILITY_LESS_3_MONTHS: 'pension/invalidite/moins-3-mois',
  PENSION_DISABILITY_MORE_3_MONTHS: 'pension/invalidite/plus-3-mois',
  PENSION_DISABILITY_NOT_YET: 'pension/invalidite/pas-encore',
  PENSION_ALIMONY: 'pension/alimentaire',
  PENSION_UNKNOWN: 'pension/inconnu',
  RENT_RENTAL_RECEIPT: 'rente/revenus-locatifs/quittance',
  RENT_RENTAL_NO_RECEIPT: 'rente/revenus-locatifs/pas-de-quittance',
  RENT_ANNUITY_LIFE: 'rente/viagere',
  RENT_OTHER: 'rente/autre',
  // Tax
  TAX_FOREIGN_NOTICE: 'avec-avis/etranger',
  TAX_FRENCH_NOTICE: 'avec-avis/francais',
  TAX_NOT_RECEIVED: 'sans-avis/pas-recu',
  TAX_NO_DECLARATION: 'sans-avis/sans-declaration',
  // Residency
  TENANT_PROOF: 'tenant/proof',
  GUEST_PROOF: 'guest/proof',
  GUEST_NO_PROOF: 'guest/no-proof'
}

export const useInternalNavigation = () => {
  const store = useTenantStore()

  const getNavigationStep = (category: DocumentCategory) => {
    switch (category) {
      case 'IDENTIFICATION':
        return 1
      case 'RESIDENCY':
        return 2
      case 'PROFESSIONAL':
        return 3
      case 'FINANCIAL':
        return 4
      case 'TAX':
        return 5
      case 'IDENTIFICATION_LEGAL_PERSON':
      case 'GUARANTEE_PROVIDER_CERTIFICATE':
        return 0
      default:
        return -1
    }
  }

  const getDocumentSubPath = (document: DfDocument) => {
    if (document.documentCategoryStep && STEP_TO_PATH[document.documentCategoryStep]) {
      return STEP_TO_PATH[document.documentCategoryStep]!
    } else if (document.documentSubCategory && CATEGORY_TO_PATH[document.documentSubCategory]) {
      return CATEGORY_TO_PATH[document.documentSubCategory]
    }
  }

  const getTenantNavigationPath = (
    document: DfDocument | undefined,
    documentCategory: DocumentCategory | undefined
  ) => {
    const step = getNavigationStep(
      documentCategory ?? document?.documentCategory ?? 'IDENTIFICATION'
    )
    if (document === undefined) {
      return `/documents-locataire/${step}`
    } else {
      const subPath = getDocumentSubPath(document)
      if (step === 4) {
        return `/documents-locataire/${step}/${document.id}/${subPath}`
      }
      return `/documents-locataire/${step}/${subPath}`
    }
  }

  const getTenantOwnerOfGuarantor = (guarantorId: number) => {
    if (store.user.guarantors?.some((g) => g.id === guarantorId)) {
      return store.user.id
    } else {
      const coTenant = store.coTenants.find((t) => t.guarantors?.some((g) => g.id === guarantorId))
      return coTenant?.id ?? 0
    }
  }

  const getGuarantorNavigationPath = (
    document: DfDocument | undefined,
    documentCategory: DocumentCategory | undefined,
    guarantorId: number
  ) => {
    const step = getNavigationStep(
      documentCategory ?? document?.documentCategory ?? 'IDENTIFICATION'
    )
    const isCurrentUserGuarantor = store.user.guarantors?.some((g) => g.id === guarantorId)
    const subPath = document ? getDocumentSubPath(document) : undefined

    if (isCurrentUserGuarantor) {
      if (!document) {
        return `/info-garant/${step}/${guarantorId}`
      }
      if (step === 4) {
        return `/info-garant/${step}/${guarantorId}/${document.id}/${subPath}`
      }
      return subPath
        ? `/info-garant/${step}/${guarantorId}/${subPath}`
        : `/info-garant/${step}/${guarantorId}`
    }

    const tenantId = getTenantOwnerOfGuarantor(guarantorId)
    if (!document) {
      return `/info-garant-locataire/${tenantId}/${guarantorId}/5/${step}`
    }
    if (step === 4) {
      return `/info-garant-locataire/${tenantId}/${guarantorId}/5/${step}/${document.id}/${subPath}`
    }
    return subPath
      ? `/info-garant-locataire/${tenantId}/${guarantorId}/5/${step}/${subPath}`
      : `/info-garant-locataire/${tenantId}/${guarantorId}/5/${step}`
  }

  const getCotenantNavigationPath = (
    document: DfDocument | undefined,
    documentCategory: DocumentCategory | undefined,
    coTenantId: number
  ) => {
    const step = getNavigationStep(
      documentCategory ?? document?.documentCategory ?? 'IDENTIFICATION'
    )

    if (document === undefined) {
      return `/documents-colocataire/${coTenantId}/4/${step}`
    } else {
      const subPath = getDocumentSubPath(document)
      if (step === 4) {
        return `/documents-colocataire/${coTenantId}/4/${step}/${document.id}/${subPath}`
      }
      return `/documents-colocataire/${coTenantId}/4/${step}/${subPath}`
    }
  }

  return {
    getTenantNavigationPath,
    getGuarantorNavigationPath,
    getCotenantNavigationPath
  }
}

export const useHandleValidationNavigation = () => {
  const router = useRouter()
  const route = useRoute()

  const handleValidationNavigation = (): boolean => {
    const isFromValidation = route.query.from === 'validation'
    if (isFromValidation) {
      router.push({ name: 'ValidateFile' })
      return true
    }
    return false
  }

  const getNavigationNextStep = (nextStep: RouteLocationRaw): RouteLocationRaw => {
    const isFromValidation = route.query.from === 'validation'
    if (isFromValidation) {
      return { name: 'ValidateFile' }
    }
    return nextStep
  }

  return {
    handleValidationNavigation,
    getNavigationNextStep
  }
}
