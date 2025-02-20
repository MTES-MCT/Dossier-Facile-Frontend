import { DfDocument, type DocumentCategory } from 'df-shared-next/src/models/DfDocument'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import useTenantStore from '@/stores/tenant-store'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import type { CoTenant } from 'df-shared-next/src/models/CoTenant'

const CATEGORIES_ORDER: DocumentCategory[] = [
  'IDENTIFICATION',
  'RESIDENCY',
  'PROFESSIONAL',
  'FINANCIAL',
  'TAX'
]

export const DocumentService = {
  hasDocument() {
    const store = useTenantStore()
    return store.user.documents !== undefined && store.user.documents.length > 0
  },
  hasDoc(docType: string, tenant: CoTenant): DfDocument | undefined {
    if (tenant.documents === undefined) {
      return undefined
    }
    return tenant.documents.find((d: DfDocument) => {
      return d.documentCategory === docType
    })
  },
  getDocs(docType: string, tenant: CoTenant): DfDocument[] {
    if (tenant.documents === undefined) {
      return []
    }
    return tenant.documents.filter((d: DfDocument) => {
      return d.documentCategory === docType
    })
  },
  getUserDocs(docType: string) {
    const store = useTenantStore()
    return this.getDocs(docType, store.user)
  },
  hasFile(docType: string, tenant?: CoTenant) {
    const store = useTenantStore()
    const user = tenant ? tenant : store.user
    const document: DfDocument | undefined = this.hasDoc(docType, user)
    if (document === undefined || document.files === undefined) {
      return false
    }
    return document.files.length > 0
  },
  guarantorHasDoc(g: Guarantor, docType: string) {
    if (!g || !g.documents) {
      return undefined
    }
    return g.documents.find((d: DfDocument) => {
      return d.documentCategory === docType
    })
  },
  getGuarantorDocs(g: Guarantor | undefined, docType: string): DfDocument[] {
    if (!g || !g.documents) {
      return []
    }
    return g.documents.filter((d: DfDocument) => {
      return d.documentCategory === docType
    })
  },
  guarantorHasFile(g: Guarantor, docType: string) {
    const document = this.guarantorHasDoc(g, docType)
    if (!document || !document.files) {
      return false
    }
    return document.files.length > 0
  },
  hasGuarantor(guarantorType: string) {
    const store = useTenantStore()
    const g = store.selectedGuarantor
    return g !== undefined && g.documents !== undefined && g.typeGuarantor === guarantorType
  },
  getFiles(documentCategory: string) {
    const store = useTenantStore()
    if (!store.user.documents) {
      return []
    }
    const docs = store.user.documents.filter((d: DfDocument) => {
      return d.documentCategory === documentCategory
    })
    let files: DfFile[] = []
    if (docs === undefined) {
      return []
    }
    for (let i = 0; i < docs.length; i++) {
      files = files.concat(docs[i].files || [])
    }

    return files
  },
  getGuarantorFiles(g: Guarantor, documentCategory: string) {
    if (!g.documents) {
      return []
    }
    const docs = g.documents.filter((d: DfDocument) => {
      return d.documentCategory === documentCategory
    })
    let files: DfFile[] = []
    if (docs === undefined) {
      return files
    }
    for (let i = 0; i < docs.length; i++) {
      files = files.concat(docs[i].files || [])
    }
    return files
  },
  getTenantIdentityStatus(user: CoTenant): string {
    const doc = this.hasDoc('IDENTIFICATION', user)
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getTenantResidencyStatus(user: CoTenant): string {
    const doc = this.hasDoc('RESIDENCY', user)
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getTenantProfessionalStatus(user: CoTenant): string {
    const doc = this.hasDoc('PROFESSIONAL', user)
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getTenantFinancialStatus(user: CoTenant): string {
    const docs = this.getDocs('FINANCIAL', user)
    if (docs.length <= 0) {
      return ''
    }
    if (docs.find((d: DfDocument) => d.documentStatus === 'DECLINED')) {
      return 'DECLINED'
    }
    if (docs.find((d: DfDocument) => d.documentStatus === 'TO_PROCESS')) {
      return 'TO_PROCESS'
    }
    if (!docs.find((d: DfDocument) => d.documentStatus !== 'VALIDATED')) {
      return 'VALIDATED'
    }
    return docs[0].documentStatus || ''
  },
  getTenantTaxStatus(user: CoTenant): string {
    const doc = this.hasDoc('TAX', user)
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getGuarantorIdentityStatus(g: Guarantor): string {
    const store = useTenantStore()
    const doc = this.guarantorHasDoc(g || store.selectedGuarantor, 'IDENTIFICATION')
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getGuarantorResidencyStatus(g: Guarantor): string {
    const store = useTenantStore()
    const doc = this.guarantorHasDoc(g || store.selectedGuarantor, 'RESIDENCY')
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getGuarantorProfessionalStatus(g: Guarantor): string {
    const store = useTenantStore()
    const doc = this.guarantorHasDoc(g || store.selectedGuarantor, 'PROFESSIONAL')
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getGuarantorFinancialStatus(g: Guarantor): string {
    const store = useTenantStore()
    const docs = this.getGuarantorDocs(g || store.selectedGuarantor, 'FINANCIAL')
    if (docs.length <= 0) {
      return ''
    }
    if (docs.find((d: DfDocument) => d.documentStatus === 'DECLINED')) {
      return 'DECLINED'
    }
    if (docs.find((d: DfDocument) => d.documentStatus === 'TO_PROCESS')) {
      return 'TO_PROCESS'
    }
    if (!docs.find((d: DfDocument) => d.documentStatus !== 'VALIDATED')) {
      return 'VALIDATED'
    }
    return docs[0].documentStatus || ''
  },
  getGuarantorTaxStatus(g: Guarantor): string {
    const store = useTenantStore()
    const doc = this.guarantorHasDoc(g || store.selectedGuarantor, 'TAX')
    return doc?.documentStatus || ''
  },
  getGuarantorLegalPersonIdentityStatus(guarantor: Guarantor): string {
    const doc = this.guarantorHasDoc(guarantor, 'IDENTIFICATION_LEGAL_PERSON')
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getGuarantorLegalPersonRepresentantStatus(guarantor: Guarantor): string {
    const doc = this.guarantorHasDoc(guarantor, 'IDENTIFICATION')
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  getGuaranteeProviderCertificateStatus(guarantor: Guarantor): string {
    const doc = this.guarantorHasDoc(guarantor, 'GUARANTEE_PROVIDER_CERTIFICATE')
    if (!doc) {
      return ''
    }
    return doc.documentStatus || ''
  },
  tenantStatus(documentType: string, user?: CoTenant) {
    const store = useTenantStore()
    const tenant = user == undefined ? store.user : user
    let status
    switch (documentType) {
      case 'IDENTITY':
        status = DocumentService.getTenantIdentityStatus(tenant) || 'EMPTY'
        break
      case 'RESIDENCY':
        status = DocumentService.getTenantResidencyStatus(tenant) || 'EMPTY'
        break
      case 'PROFESSIONAL':
        status = DocumentService.getTenantProfessionalStatus(tenant) || 'EMPTY'
        break
      case 'FINANCIAL':
        status = DocumentService.getTenantFinancialStatus(tenant) || 'EMPTY'
        break
      case 'TAX':
        status = DocumentService.getTenantTaxStatus(tenant) || 'EMPTY'
        break
    }
    if (status === 'TO_PROCESS' && tenant.status !== 'TO_PROCESS') {
      return 'FILLED'
    }
    return status
  },
  guarantorStatus(documentType: string, guarantor: Guarantor) {
    let status
    switch (documentType) {
      case 'IDENTITY':
        status = DocumentService.getGuarantorIdentityStatus(guarantor) || 'EMPTY'
        break
      case 'RESIDENCY':
        status = DocumentService.getGuarantorResidencyStatus(guarantor) || 'EMPTY'
        break
      case 'PROFESSIONAL':
        status = DocumentService.getGuarantorProfessionalStatus(guarantor) || 'EMPTY'
        break
      case 'FINANCIAL':
        status = DocumentService.getGuarantorFinancialStatus(guarantor) || 'EMPTY'
        break
      case 'TAX':
        status = DocumentService.getGuarantorTaxStatus(guarantor) || 'EMPTY'
        break
      case 'IDENTIFICATION_LEGAL_PERSON':
        status = DocumentService.getGuarantorLegalPersonIdentityStatus(guarantor) || 'EMPTY'
        break
      case 'IDENTIFICATION':
        status = DocumentService.getGuarantorLegalPersonRepresentantStatus(guarantor) || 'EMPTY'
        break
      case 'GUARANTEE_PROVIDER_CERTIFICATE':
        status = DocumentService.getGuaranteeProviderCertificateStatus(guarantor) || 'EMPTY'
        break
    }
    return status
  },
  getCoTenantDocument(coTenantId: number, documentCategory: string) {
    const store = useTenantStore()
    const coTenant = store.getTenant(Number(coTenantId))
    if (coTenant.documents !== null) {
      return coTenant.documents?.find((d: DfDocument) => {
        return d.documentCategory === documentCategory
      })
    }
    return undefined
  },
  sortByCategory(doc1: DfDocument, doc2: DfDocument) {
    if (!doc1.documentCategory || !doc2.documentCategory) {
      return 0
    }
    return (
      CATEGORIES_ORDER.indexOf(doc1.documentCategory) -
      CATEGORIES_ORDER.indexOf(doc2.documentCategory)
    )
  }
}
