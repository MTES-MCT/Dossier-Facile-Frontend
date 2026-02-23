import {
  DocumentType,
  DocumentTypeTranslations
} from '@/components/editmenu/documents/DocumentType'
import { useInternalNavigation } from '@/composables/useInternalNavigation'
import {
  DfDocument,
  STEP_LABEL,
  type DocumentCategory,
  type DocumentCategoryStep
} from 'df-shared-next/src/models/DfDocument'
import type { DocumentRule } from 'df-shared-next/src/models/DocumentRule'
import { PreviewDocument } from 'df-shared-next/src/models/User'
import { computed, unref, type MaybeRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export function getDocumentSubTitle(
  document: DfDocument | undefined,
  documentCategory: DocumentCategory | undefined,
  documentCategoryStep: DocumentCategoryStep | undefined,
  t: ReturnType<typeof useI18n>['t']
) {
  if (document && documentCategory === 'FINANCIAL' && documentCategoryStep) {
    return t(STEP_LABEL[documentCategoryStep] ?? '')
  }
  return null
}

export function getDocumentLabel(
  documentCategory: DocumentCategory | undefined,
  t: ReturnType<typeof useI18n>['t']
) {
  if (!documentCategory) {
    return ''
  } else if (documentCategory === 'IDENTIFICATION') {
    return t(DocumentTypeTranslations[DocumentType.IDENTITY])
  } else {
    return t(DocumentTypeTranslations[documentCategory as DocumentType])
  }
}

export function useDocumentPreview(
  previewDocumentRef: MaybeRef<PreviewDocument>,
  guarantorId: number | undefined = undefined,
  cotenantId: number | undefined = undefined
) {
  const { t } = useI18n()
  const router = useRouter()

  const { getTenantNavigationPath, getGuarantorNavigationPath, getCotenantNavigationPath } =
    useInternalNavigation()

  const subTitle = computed(() => {
    const previewDocument = unref(previewDocumentRef)
    return getDocumentSubTitle(
      previewDocument.document,
      previewDocument.documentCategory,
      previewDocument.document?.documentCategoryStep,
      t
    )
  })

  const documentIdForInternalLink = computed(() => {
    const previewDocument = unref(previewDocumentRef)
    const lastPartOfId = `${previewDocument.document?.id ?? previewDocument.documentCategory}`
    if (guarantorId === undefined && cotenantId === undefined) {
      return `document-${lastPartOfId}`
    }

    if (guarantorId === undefined && cotenantId !== undefined) {
      return `document-cotenant-${cotenantId}-${lastPartOfId}`
    }

    if (guarantorId !== undefined) {
      return `document-guarantor-${guarantorId}-${lastPartOfId}`
    }

    return ''
  })

  const label = computed(() => {
    const previewDocument = unref(previewDocumentRef)
    return getDocumentLabel(previewDocument.documentCategory, t)
  })

  const getRuleShortMessage = (rule: DocumentRule) => {
    switch (rule.rule) {
      case 'R_TAX_BAD_CLASSIFICATION':
        return t('documents.validation-rules.short.tax-bad-classification')
      case 'R_TAX_NAMES':
        return t('documents.validation-rules.short.tax-wrong-names')
      case 'R_TAX_WRONG_YEAR':
        return t('documents.validation-rules.short.tax-wrong-year')
      default:
        return rule.message
    }
  }

  const goToEdit = () => {
    const previewDocument = unref(previewDocumentRef)

    // current user document
    if (guarantorId === undefined && cotenantId === undefined) {
      const routePath = getTenantNavigationPath(
        previewDocument.document,
        previewDocument.document === undefined ? previewDocument.documentCategory : undefined
      )
      router.push({ path: routePath, query: { from: 'validation' } })
    }

    if (guarantorId !== undefined && cotenantId === undefined) {
      const routePath = getGuarantorNavigationPath(
        previewDocument.document,
        previewDocument.document === undefined ? previewDocument.documentCategory : undefined,
        guarantorId
      )
      router.push({ path: routePath, query: { from: 'validation' } })
    }

    if (guarantorId === undefined && cotenantId !== undefined) {
      const routePath = getCotenantNavigationPath(
        previewDocument.document,
        previewDocument.document === undefined ? previewDocument.documentCategory : undefined,
        cotenantId
      )
      router.push({ path: routePath, query: { from: 'validation' } })
    }
  }

  const status = computed((): 'MISSING' | 'SUCCESS' | 'LOADING' | 'ERROR' => {
    const previewDocument = unref(previewDocumentRef)
    const analysisStatus = previewDocument.documentAnalysisStatus
    const document = previewDocument.document

    if (!document) {
      return 'MISSING'
    }
    // If we don't have an analysis status that mean the document is not compatible for the moment with document analysis
    if (!analysisStatus) {
      return 'SUCCESS'
    }

    if (analysisStatus.isFinished && analysisStatus.isValid) {
      return 'SUCCESS'
    }
    if (analysisStatus.isFinished && !analysisStatus.isValid) {
      if (previewDocument.document?.documentAnalysisReport?.comment === undefined) {
        return 'ERROR'
      } else {
        return 'SUCCESS'
      }
    }
    return 'LOADING'
  })

  return {
    label,
    subTitle,
    status,
    documentIdForInternalLink,
    getRuleShortMessage,
    goToEdit
  }
}
