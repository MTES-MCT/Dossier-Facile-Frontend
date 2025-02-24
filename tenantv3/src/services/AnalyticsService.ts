import { DocumentTypeTranslations } from '@/components/editmenu/documents/DocumentType'
import useTenantStore from '@/stores/tenant-store'

declare global {
  interface Window {
    _paq?: (string | number | undefined)[][]
  }
}

type EventCategory = 'prevalidation' | 'funnel' | 'contact' | 'account' | 'misc' | 'file'
type Action = 'clic' | 'print' | 'unknown' | 'delete' | 'upload'
const DOCUMENT_TYPES = ['identification', 'residency', 'professional', 'financial', 'tax'] as const
const DOCUMENT_CATEGORIES = Object.values(DocumentTypeTranslations)
type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number] | 'guarantor-residency'

function sendFullEvent(category: EventCategory, action: Action, name: string) {
  if (import.meta.env.VITE_MATOMO_ENABLE === 'false' || !window._paq) {
    return
  }
  const tenantStore = useTenantStore()
  window._paq.push(['trackEvent', category, action, name, tenantStore.user.id])
}

function sendEvent(category: EventCategory, name: string) {
  sendFullEvent(category, 'unknown', name)
}

function getDoctypeByNumber(docType: number) {
  return DOCUMENT_TYPES[docType - 1] || ''
}

export const AnalyticsService = {
  prevalidationEvent(documentType: string, status: string) {
    let tag = ''
    if (status === 'DENIED') {
      tag = 'pv_print_denied_' + documentType
    } else {
      tag = 'pv_print_checked_' + documentType
    }
    sendFullEvent('prevalidation', 'print', tag)
  },

  warningRentReceipts() {
    sendFullEvent('prevalidation', 'print', 'pv_warning_quittance')
  },

  removeDeniedDocument(documentType: string) {
    sendFullEvent('prevalidation', 'delete', 'pv_deleteted_denied_' + documentType)
  },

  contactEvent(tag: string) {
    sendFullEvent('contact', 'clic', tag)
  },

  unlinkFCSuccess() {
    sendEvent('account', 'unlink-fc')
  },

  openCreateOwnerAccount() {
    sendEvent('misc', 'open_owner')
  },

  viewFromMain() {
    sendEvent('funnel', 'main-view-doc')
  },

  editFromAccount(docType: number) {
    sendEvent('funnel', 'account-edit-doc_' + getDoctypeByNumber(docType))
  },

  editAccount(editType: string) {
    sendEvent('funnel', 'account-edit-' + editType)
  },

  deleteFile(docType: DocumentCategory) {
    sendFullEvent('funnel', 'delete', 'file-delete_' + docType)
  },

  deleteAccount() {
    sendEvent('account', 'account-delete')
  },

  shareByMail(full: string) {
    sendEvent('account', 'share-by-mail_' + full)
  },

  copyLink(full: string) {
    sendEvent('account', 'copy-link_' + full)
  },

  confirmName() {
    sendEvent('funnel', 'confirm-name')
  },

  confirmType() {
    sendEvent('funnel', 'confirm-type')
  },

  uploadFile(docType: DocumentCategory | 'guarantor-financial', category?: string, step?: string) {
    const name = ['upload-file', docType, category, step].filter((x) => x).join('_')
    sendFullEvent('funnel', 'upload', name)
  },

  missingResidencyDocumentDetected() {
    sendFullEvent('funnel', 'print', 'missing-residency-document-detected')
  },
  forceMissingResidencyDocument() {
    sendEvent('funnel', 'force-missing-residency-document')
  },

  avisDetected() {
    sendEvent('funnel', 'avis-detected')
  },

  avisForceUpload() {
    sendEvent('funnel', 'avis-upload-forced')
  },

  validateFunnel() {
    sendEvent('funnel', 'validate-tenant-funnel')
  },

  addGuarantor(guarantorType: string) {
    sendEvent('funnel', 'add-guarantor_' + guarantorType)
  },

  validateFile() {
    sendEvent('file', 'validate-file')
  },

  openSimulationCAF() {
    sendEvent('funnel', 'open-simulation_caf')
  },
  openMaSecurite() {
    sendEvent('funnel', 'open-ma_securite')
  },

  selectSituation(category: DocumentCategory, subCategory: string) {
    sendFullEvent('funnel', 'clic', `${category}_${subCategory}`)
  },
  selectOther(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `${category}_others`)
  },
  selectSituation2(category: DocumentCategory, sub1Category: string, sub2Category: string) {
    sendFullEvent('funnel', 'clic', `${category}_${sub1Category}_${sub2Category}`)
  },
  editSituation(category: DocumentCategory, subCategory: string) {
    sendFullEvent('funnel', 'clic', `modify_${category}_${subCategory}`)
  },
  editSituation2(category: DocumentCategory, subCategory: string, categoryStep: string) {
    sendFullEvent('funnel', 'clic', `modify_${category}_${subCategory}_${categoryStep}`)
  },
  selectPrecariousness() {
    sendFullEvent('funnel', 'clic', 'select-precariousness')
  },
  seeDocument(category: string) {
    sendFullEvent('funnel', 'clic', `see_${category}`)
  },
  deleteDocument(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `delete-doc_${category}`)
  },
  cancelDelete(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `delete-doc-cancel_${category}`)
  },
  showWarningModale(category: DocumentCategory) {
    sendFullEvent('funnel', 'print', `modale_${category}`)
  },
  ignoreWarningModale(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `modale-ignore_${category}`)
  },
  confirmModale(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `modale-add_${category}`)
  },
  validateFunnelStep(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `validate-tenant_funnel_${category}`)
  }
}
