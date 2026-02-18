import {
  DocumentTypeTranslations,
  type DocumentType
} from '@/components/editmenu/documents/DocumentType'
import type { ExternalDocumentationEvent } from '@/components/identity/lib/ExternalDocumentation'

declare global {
  interface Window {
    _paq?: (string | number | undefined)[][]
  }
}

type EventCategory =
  | 'prevalidation'
  | 'funnel'
  | 'contact'
  | 'account'
  | 'misc'
  | 'file'
  | 'partage'
type Action = 'clic' | 'print' | 'unknown' | 'delete' | 'upload' | 'write'
const DOCUMENT_TYPES = ['identification', 'residency', 'professional', 'financial', 'tax'] as const
type DocumentCategoryBase = (typeof DocumentTypeTranslations)[DocumentType]
type DocumentCategory =
  | DocumentCategoryBase
  | `guarantor-${DocumentCategoryBase}`
  | `couple-${DocumentCategoryBase}`
  | `couple-guarantor-${DocumentCategoryBase}`
  | `cotenant-${DocumentCategoryBase}`

function sendFullEvent(category: EventCategory, action: Action, name: string) {
  if (!window._paq) {
    return
  }
  window._paq.push(['trackEvent', category, action, name])
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

  tenantIdentityOpenExternalDoc(event: ExternalDocumentationEvent) {
    sendFullEvent('funnel', 'clic', 'tenant_identity_open_external_doc_' + event)
  },

  tenantIdentitySelectSelf() {
    sendFullEvent('funnel', 'clic', 'tenant_identity_self')
  },

  tenantIdentitySelectThirdParty() {
    sendFullEvent('funnel', 'clic', 'tenant_identity_third_party')
  },

  tenantIdentityModifySelf() {
    sendFullEvent('funnel', 'clic', 'modify_tenant_identity_self')
  },

  tenantIdentityModifyThirdParty() {
    sendFullEvent('funnel', 'clic', 'modify_tenant_identity_third_party')
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

  viewFromMain(docType: DocumentCategory) {
    sendEvent('funnel', 'main-view-doc_' + docType)
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

  getDefaultLink(type: string) {
    sendEvent('partage', 'sharing_get_default_' + type)
  },

  sharingToggleAllLinks(action: 'disable' | 'enable') {
    sendEvent('partage', 'sharing_' + action + '_all')
  },

  sharingNew(type: 'link' | 'mail', content: 'full' | 'limited') {
    sendEvent('partage', `sharing_new_${type}_${content}`)
  },

  sharingCopyNewLink() {
    sendEvent('partage', 'sharing_copy_new_link')
  },

  sharingDownloadFull() {
    sendEvent('partage', 'sharing_download_full')
  },

  sharingResendMail() {
    sendEvent('partage', 'sharing_resend_mail')
  },

  sharingToggleLink(action: 'enable' | 'disable') {
    sendEvent('partage', `sharing_${action}_link`)
  },

  sharingReportSuspiciousActivity() {
    sendEvent('partage', 'sharing_report_suspicious_activity')
  },

  sharingGoToDetailsAll() {
    sendEvent('partage', 'sharing_go_to_details_all')
  },

  sharingCopyDefaultLink() {
    sendEvent('partage', 'sharing_copy_default_link')
  },

  sharingSeeDefaultLink() {
    sendEvent('partage', 'sharing_see_default_link')
  },

  sharingGoToAll() {
    sendEvent('partage', 'sharing_go_to_all')
  },

  sharingAction(action: 'enable' | 'disable' | 'delete' | 'copy') {
    sendEvent('partage', `sharing_action_${action}_link`)
  },

  sharingExpandDetails() {
    sendEvent('partage', 'sharing_expand_details')
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
  openAttestationMesDroitsSociaux() {
    sendFullEvent('funnel', 'clic', 'open-attestation_mes_droits_sociaux')
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
  selectSituation3(
    category: DocumentCategory,
    sub1Category: string,
    sub2Category: string,
    sub3Category: string
  ) {
    sendFullEvent('funnel', 'clic', `${category}_${sub1Category}_${sub2Category}_${sub3Category}`)
  },
  editSituation(category: DocumentCategory, subCategory: string) {
    sendFullEvent('funnel', 'clic', `modify_${category}_${subCategory}`)
  },
  editSituation2(category: DocumentCategory, subCategory: string, categoryStep: string) {
    sendFullEvent('funnel', 'clic', `modify_${category}_${subCategory}_${categoryStep}`)
  },
  editSituation3(
    category: DocumentCategory,
    subCategory: string,
    categoryStep: string,
    substep: string
  ) {
    sendFullEvent('funnel', 'clic', `modify_${category}_${subCategory}_${categoryStep}_${substep}`)
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
  },
  addIncome(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `add-revenu_${category}`)
  },
  deleteIncome(category: DocumentCategory, step: 'ask' | 'confirm' | 'cancel') {
    const suffix = step === 'ask' ? '' : `-${step}`
    sendFullEvent('funnel', 'clic', `delete-revenu${suffix}_${category}`)
  },
  writeText(category: DocumentCategory) {
    sendFullEvent('funnel', 'write', `text_${category}`)
  },

  openFullLink() {
    sendFullEvent('file', 'print', 'full-link-opened')
  },

  displayTrigramFeature() {
    sendFullEvent('file', 'print', 'full-link-trigram-feature')
  },

  trigramError() {
    sendFullEvent('file', 'clic', 'full-link-trigram-error')
  },

  document_analysis_show_comment_from_link(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `document_analysis_show_comment_error_${category}`)
  },

  document_analysis_show_comment(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `document_analysis_show_comment_${category}`)
  },

  document_analysis_save_comment(category: DocumentCategory) {
    sendFullEvent('funnel', 'clic', `document_analysis_save_comment_${category}`)
  },

  document_analysis_timout(category: DocumentCategory) {
    sendFullEvent('funnel', 'unknown', `document_analysis_timeout_${category}`)
  },

  validate_anchor_error_click(prefix: 'tenant' | 'guarantor' | 'couple', category: string) {
    sendFullEvent('funnel', 'clic', `validate_anchor_error_${prefix}_${category}`)
  },

  validate_correct_error_click(prefix: 'tenant' | 'guarantor' | 'couple', category: string) {
    sendFullEvent('funnel', 'clic', `validate_correct_error_${prefix}_${category}`)
  }
}

export type { DocumentCategory }
