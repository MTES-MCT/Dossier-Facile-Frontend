import {
  DocumentType,
  DocumentTypeTranslations,
  TENANT_COMPONENTS
} from '@/components/editmenu/documents/DocumentType'
import {
  DfDocument,
  STEP_LABEL,
  type DocumentCategory,
  type DocumentCategoryStep
} from 'df-shared-next/src/models/DfDocument'
import type { PreviewDocument } from 'df-shared-next/src/models/User'
import { computed } from 'vue'
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

export function useDocumentPreview(previewDocument: PreviewDocument) {
  const { t } = useI18n()
  const router = useRouter()

  const subTitle = computed(() => {
    return getDocumentSubTitle(
      previewDocument.document,
      previewDocument.documentCategory,
      previewDocument.document?.documentCategoryStep,
      t
    )
  })

  const label = computed(() => {
    return getDocumentLabel(previewDocument.documentCategory, t)
  })

  const goToEdit = () => {
    const type =
      previewDocument.documentCategory === 'IDENTIFICATION'
        ? DocumentType.IDENTITY
        : (previewDocument.documentCategory as DocumentType)
    const routeName = TENANT_COMPONENTS[type]
    if (routeName) {
      router.push({ name: routeName })
    }
  }

  const openDocument = () => {
    const document = previewDocument.document
    if (document?.files?.length) {
      window.open(document.files[0].path, '_blank')
    }
  }

  const status = computed((): 'MISSING' | 'SUCCESS' | 'LOADING' | 'ERROR' => {
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
      return 'ERROR'
    }
    return 'LOADING'
  })

  return {
    label,
    subTitle,
    status,
    goToEdit,
    openDocument
  }
}
