<template>
  <ul v-if="currentFiles.length > 0" role="list" class="fr-col-12 fr-mb-3w">
    <li v-for="file in currentFiles" :key="file.id">
      <ListItem
        :file="file"
        :watermark-url="documentWatermarkUrl"
        doc-category="tax"
        @remove="remove(file)"
        @ask-confirm="AnalyticsService.deleteDocument(docCategory)"
        @cancel="AnalyticsService.cancelDelete(docCategory)"
      />
    </li>
  </ul>
  <div v-if="analysisInProgress" class="analysis-loading fr-mb-3w">
    <div class="analysis-loading-status">
      <VIcon
        name="ri:hourglass-fill"
        :scale="1.5"
        color="var(--blue-france-sun-113-625)"
        class="analysis-loading-icon"
        aria-hidden="true"
      />
      <output class="fr-m-0 analysis-loading-text" aria-live="polite">
        {{ t('analysis-in-progress') }}
      </output>
    </div>
    <div class="analysis-loading-progress">
      <div class="analysis-loading-progress-bar"></div>
    </div>
  </div>
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    @add-files="addFiles"
  ></FileUpload>
  <slot name="custom" />
</template>

<script setup lang="ts">
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import { AnalyticsService, type DocumentCategory } from '@/services/AnalyticsService'
import { RegisterService } from '@/services/RegisterService'
import { UtilsService } from '@/services/UtilsService'
import { useTenantStore } from '@/stores/tenant-store'
import { VIcon } from '@gouvminint/vue-dsfr'
import type { DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { useDocumentFormKey } from '../documents/documentFormState'
import { type DocumentSubCategory } from '../documents/share/DocumentTypeConstants'
import { toast } from '../toast/toastUtils'

const props = withDefaults(
  defineProps<{
    docCategory: DocumentCategory
    subCategory: DocumentSubCategory
    step?: DocumentCategoryStep
    maxFileCount?: number
    analysisInProgress?: boolean
    explanation?: string
    beforeSave?: (files: File[]) => Promise<boolean> | boolean
  }>(),
  {
    analysisInProgress: false,
    maxFileCount: 5,
    step: undefined,
    explanation: undefined,
    beforeSave: undefined
  }
)

const { t } = useI18n()
const store = useTenantStore()

const documentFormState = useDocumentFormKey()

const currentDocument = computed(() => documentFormState.document.value)

const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])
const fileUpload = useTemplateRef('file-upload')
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)

const documentWatermarkUrl = computed(() => currentDocument.value?.name)

const isUploading = computed(() => fileUploadStatus.value === UploadStatus.STATUS_SAVING)

async function forceUploadPendingFiles(): Promise<boolean> {
  return save()
}

defineExpose({
  isUploading,
  forceUploadPendingFiles
})

const currentFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: props.subCategory,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles = currentDocument.value?.files || []
  return [...newFiles, ...existingFiles]
})

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(props.docCategory)
  if (file.id) {
    if (
      currentDocument.value?.files?.length === 1 &&
      currentDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(currentDocument.value?.documentSubCategory || '')
    }
    await RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = files.value.findIndex((f) => f.name === file.name && !f.path)
    files.value.splice(firstIndex, 1)
  }
}

async function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile(props.docCategory, props.subCategory)
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  const canContinue = (await props.beforeSave?.(fileList)) ?? true
  if (!canContinue) return
  save()
}

async function save(): Promise<boolean> {
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    return true
  }

  if (files.value.length > props.maxFileCount) {
    toast.maxFileError(files.value.length, props.maxFileCount, fileUpload.value?.inputFile)
    files.value = []
    return false
  }

  for (const [key, newFile] of newFiles.entries()) {
    const f = newFile.file || new File([], '')
    formData.append(`documents[${key}]`, f, newFile.name)
  }

  formData.append(documentFormState.formFieldValue, props.subCategory)
  if (props.step) {
    formData.append('categoryStep', props.step)
  }
  formData.append('noDocument', String(newFiles.length === 0))
  if (props.explanation) {
    formData.append('customText', props.explanation)
  }

  documentFormState.addData?.(formData)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()

  return await store[documentFormState.storeAction](formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      toast.success(t('file-saved'), fileUpload.value?.inputFile)
      return true
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err, fileUpload.value?.inputFile)
      return false
    })
    .finally(() => {
      loader.hide()
    })
}
</script>

<style scoped>
.analysis-loading {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.analysis-loading-status {
  display: flex;
  align-items: center;
  gap: 3px;
}

.analysis-loading-icon {
  flex-shrink: 0;
}

.analysis-loading-text {
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #161616;
}

.analysis-loading-progress {
  height: 8px;
  background-color: var(--background-contrast-grey);
  border-radius: 0;
  overflow: hidden;
}

.analysis-loading-progress-bar {
  height: 100%;
  width: 30%;
  background-color: var(--blue-france-sun-113-625);
  animation: indeterminate 1.5s infinite ease-in-out;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(433%);
  }
}

.fr-info-text {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: #0063cb;
  margin: 0.5rem 0;
}

.info-icon {
  color: #0063cb;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.explain-form-actions {
  display: flex;
  justify-content: flex-end;
}

ul {
  --li-bottom: 1rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "analysis-in-progress": "Analyzing documents. This usually takes less than 10 seconds."
  },
  "fr": {
    "analysis-in-progress": "Analyse des documents. Cela prend généralement moins de 10 secondes."
  }
}
</i18n>
