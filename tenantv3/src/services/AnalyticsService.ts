import useTenantStore from '@/stores/tenant-store'

type EventCategory = 'prevalidation' | 'funnel' | 'contact' | 'account' | 'misc' | 'file'

function sendEvent(category: EventCategory, name: string) {
  if (import.meta.env.VITE_MATOMO_ENABLE === 'false' || !window._paq) {
    return
  }
  const tenantStore = useTenantStore()
  window._paq.push(['trackEvent', category, name, tenantStore.user.id])
}

function getDoctypeByNumber(docType: number) {
  return ['identification', 'residency', 'professional', 'financial', 'tax'][docType - 1] || ''
}

export const AnalyticsService = {
  prevalidationEvent(documentType: string, status: string) {
    let tag = ''
    if (status === 'DENIED') {
      tag = 'pv_print_denied_' + documentType
    } else {
      tag = 'pv_print_checked_' + documentType
    }
    sendEvent('prevalidation', tag)
  },

  removeDeniedDocument(documentType: string) {
    sendEvent('prevalidation', 'pv_deleteted_denied_' + documentType)
  },

  contactEvent(tag: string) {
    sendEvent('contact', tag)
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

  deleteFile(docType: string) {
    sendEvent('funnel', 'file-delete_' + docType)
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

  uploadFile(docType: string) {
    sendEvent('funnel', 'upload-file_' + docType)
  },

  missingResidencyDocumentDetected() {
    sendEvent('funnel', 'missing-residency-document-detected')
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
  }
}
