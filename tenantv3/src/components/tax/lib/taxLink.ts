import type { TaxCategory } from '@/components/documents/share/DocumentTypeConstants'
import { DocumentService } from '@/services/DocumentService'
import { useTenantStore } from '@/stores/tenant-store'
import type { DfDocument, TaxCategoryStep } from 'df-shared-next/src/models/DfDocument'
import type { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed } from 'vue'

const TAX_PATH = '/documents-locataire/5'

type TaxCategoryOld = TaxCategory | 'LESS_THAN_YEAR'
const CATEGORY_TO_PATH: Record<TaxCategoryOld, string> = {
  MY_NAME: 'non-renseigne',
  MY_PARENTS: 'sans-avis/parents',
  OTHER_TAX: 'sans-avis/autre',
  LESS_THAN_YEAR: 'non-renseigne'
}
const STEP_TO_PATH: Record<TaxCategoryStep, string> = {
  TAX_FOREIGN_NOTICE: 'avec-avis/etranger',
  TAX_FRENCH_NOTICE: 'avec-avis/francais',
  TAX_NO_DECLARATION: 'sans-avis/sans-declaration',
  TAX_NOT_RECEIVED: 'sans-avis/pas-recu'
}

function isCategory(string: string): string is TaxCategoryOld {
  return Object.keys(CATEGORY_TO_PATH).includes(string)
}

function isCategoryStep(step: string | undefined): step is TaxCategoryStep {
  return step ? Object.keys(STEP_TO_PATH).includes(step) : false
}

function taxToPath(doc: DfDocument | undefined) {
  const category = doc?.documentSubCategory
  if (!category || !isCategory(category)) {
    return ''
  }
  const step = doc.documentCategoryStep
  if (isCategoryStep(step)) {
    return `/${STEP_TO_PATH[step]}`
  }
  return `/${CATEGORY_TO_PATH[category]}`
}

export function makeTaxLink(doc: DfDocument | undefined, path = TAX_PATH) {
  return `${path}${taxToPath(doc)}`
}

export function makeGuarantorTaxLink(guarantor: Guarantor) {
  const document = DocumentService.getDoc('TAX', guarantor.documents)
  return makeTaxLink(document, `/info-garant/5/${guarantor.id}`)
}

export function makeSpouseGuarantorTaxLink(g: Guarantor, tenantId: number) {
  const doc = DocumentService.getDoc('TAX', g.documents)
  return makeTaxLink(doc, `/info-garant-locataire/${tenantId}/${g.id}/5/5`)
}

export function useTaxLink() {
  const store = useTenantStore()
  const link = computed(() => makeTaxLink(store.getTenantTaxDocument))
  return link
}
