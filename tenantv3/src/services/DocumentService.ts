import { DfDocument, type DocumentCategory } from 'df-shared-next/src/models/DfDocument'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { useTenantStore } from '@/stores/tenant-store'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

const CATEGORIES_ORDER: DocumentCategory[] = [
  'IDENTIFICATION',
  'RESIDENCY',
  'PROFESSIONAL',
  'FINANCIAL',
  'TAX'
]

export const DocumentService = {
  getDoc(docType: DocumentCategory, documents: DfDocument[] | undefined): DfDocument | undefined {
    return documents?.find((d) => d.documentCategory === docType)
  },
  getDocs(docType: DocumentCategory, documents: DfDocument[] | undefined): DfDocument[] {
    return documents?.filter((d) => d.documentCategory === docType) || []
  },
  getFinancialStatus(documents: DfDocument[] | undefined): string {
    const docs = DocumentService.getDocs('FINANCIAL', documents)
    if (docs.some((d) => d.documentStatus === 'DECLINED')) {
      return 'DECLINED'
    }
    if (docs.some((d) => d.documentStatus === 'TO_PROCESS')) {
      return 'TO_PROCESS'
    }
    if (docs.every((d) => d.documentStatus === 'VALIDATED')) {
      return 'VALIDATED'
    }
    return docs[0]?.documentStatus || ''
  },
  tenantStatus(documentType: DocumentCategory | 'IDENTITY', user?: CoTenant) {
    const store = useTenantStore()
    const tenant = user || store.user
    const docType = documentType === 'IDENTITY' ? 'IDENTIFICATION' : documentType
    const doc = DocumentService.getDoc(docType, tenant.documents)
    const status =
      documentType === 'FINANCIAL'
        ? DocumentService.getFinancialStatus(tenant.documents)
        : doc?.documentStatus
    if (status === 'TO_PROCESS' && tenant.status !== 'TO_PROCESS') {
      return 'FILLED'
    }
    return status || 'EMPTY'
  },
  guarantorStatus(documentType: DocumentCategory | 'IDENTITY', guarantor: Guarantor) {
    if (documentType === 'FINANCIAL') {
      return DocumentService.getFinancialStatus(guarantor.documents) || 'EMPTY'
    }
    const docType = documentType === 'IDENTITY' ? 'IDENTIFICATION' : documentType
    const doc = DocumentService.getDoc(docType, guarantor.documents)
    return doc?.documentStatus || 'EMPTY'
  },
  getCoTenantDocument(coTenantId: number, documentCategory: DocumentCategory) {
    const store = useTenantStore()
    const coTenant = store.getTenant(coTenantId)
    return DocumentService.getDoc(documentCategory, coTenant.documents)
  },
  sortByCategory(this: void, doc1: DfDocument, doc2: DfDocument) {
    if (!doc1.documentCategory || !doc2.documentCategory) {
      return 0
    }
    return (
      CATEGORIES_ORDER.indexOf(doc1.documentCategory) -
      CATEGORIES_ORDER.indexOf(doc2.documentCategory)
    )
  }
}
