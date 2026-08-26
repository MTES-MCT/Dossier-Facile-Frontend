<template>
  <div v-if="showAnalysisLoading" class="analysis-loading fr-mb-3w" role="status" aria-live="polite">
    <div class="analysis-loading-header">
      <VIcon
        name="ri:loader-4-line"
        :scale="1.2"
        color="var(--blue-france-sun-113-625)"
        class="analysis-loading-spinner"
        aria-hidden="true"
      />
      <span class="analysis-loading-title">
        {{ t('analysis-title') }}
      </span>
    </div>
    <p class="analysis-loading-text fr-mt-1w" :class="{ 'fr-mb-2w': !isOvertime }">
      <template v-if="!isOvertime">
        {{ t('analysis-in-progress', { n: props.analysisTime / 1000 }) }}
      </template>
      <template v-else>
        {{ t('analysis-overtime') }}
      </template>
    </p>
    <div
      v-if="!isOvertime"
      class="analysis-loading-progress"
      role="progressbar"
      :aria-valuenow="progressPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="analysis-loading-progress-bar"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
  </div>
  <ul v-if="currentFiles.length > 0" role="list" class="fr-col-12 fr-mb-3w">
    <li v-for="file in currentFiles" :key="file.id || file.name">
      <ListItem
        :file="file"
        :watermark-url="documentWatermarkUrl"
        :doc-category="docCategory"
        @remove="remove(file)"
        @ask-confirm="AnalyticsService.deleteDocument(docCategory)"
        @cancel="AnalyticsService.cancelDelete(docCategory)"
      />
    </li>
  </ul>
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    :error-message="errorMessage"
    :before-open="beforeOpen"
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
import { computed, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentFormKey } from '../documents/documentFormState'
import { type DocumentSubCategory } from '../documents/share/DocumentTypeConstants'
import { toast } from '../toast/toastUtils'

const emit = defineEmits<{ saved: [] }>()

const props = withDefaults(
  defineProps<{
    docCategory: DocumentCategory
    subCategory: DocumentSubCategory
    step?: DocumentCategoryStep
    maxFileCount?: number
    analysisInProgress?: boolean
    explanation?: string
    beforeSave?: (files: File[]) => Promise<boolean> | boolean
    beforeOpen?: () => boolean
    errorMessage?: string
    analysisTime?: number
  }>(),
  {
    analysisInProgress: false,
    maxFileCount: 5,
    step: undefined,
    explanation: undefined,
    beforeSave: undefined,
    beforeOpen: undefined,
    errorMessage: undefined,
    analysisTime: 10000
  }
)

const { t } = useI18n()
const store = useTenantStore()

const documentFormState = useDocumentFormKey()

const currentDocument = computed(() => documentFormState.document.value)

const files = ref<
  { name: string; file: File; size: number; id?: string; path?: string; preview?: string }[]
>([])
const fileUpload = useTemplateRef('file-upload')
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)

const documentWatermarkUrl = computed(() => currentDocument.value?.name)

const isUploading = computed(() => fileUploadStatus.value === UploadStatus.STATUS_SAVING)

const showAnalysisLoading = computed(() => {
  return props.analysisInProgress || isUploading.value
})

const progressPercentage = ref(0)
const isOvertime = computed(() => progressPercentage.value >= 100)
let progressInterval: ReturnType<typeof setInterval> | null = null
let startTime = 0

function startProgress() {
  stopProgress()
  progressPercentage.value = 0
  startTime = Date.now()
  const durationMs = props.analysisTime

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const current = Math.min(100, Math.round((elapsed / durationMs) * 100))
    progressPercentage.value = current
    if (current >= 100) {
      stopProgress()
    }
  }, 100)
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

watch(
  showAnalysisLoading,
  (isLoading) => {
    if (isLoading) {
      startProgress()
    } else {
      stopProgress()
      progressPercentage.value = 0
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  stopProgress()
})

defineExpose({
  isUploading
})

const currentFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: props.subCategory,
      id: f.id,
      name: f.name,
      size: f.size,
      preview: f.preview || (f.file ? URL.createObjectURL(f.file) : undefined)
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
    return { name: f.name, file: f, size: f.size, preview: URL.createObjectURL(f) }
  })
  const previousCount = files.value.length
  files.value = [...files.value, ...nf]
  const canContinue = (await props.beforeSave?.(fileList)) ?? true
  if (!canContinue) {
    files.value = files.value.slice(0, previousCount)
    return
  }
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

  if (currentFiles.value.length > props.maxFileCount) {
    toast.maxFileError(currentFiles.value.length, props.maxFileCount, fileUpload.value?.inputFile)
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
  formData.append('noDocument', 'false')
  if (props.explanation) {
    formData.append('customText', props.explanation)
  }

  documentFormState.addData?.(formData)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING

  return await store[documentFormState.storeAction](formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      toast.success(t('file-saved'), fileUpload.value?.inputFile)
      emit('saved')
      return true
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err, fileUpload.value?.inputFile)
      return false
    })
}
</script>

<style scoped>
.analysis-loading {
  display: flex;
  flex-direction: column;
  background-color: #F5F5FE;
  border-left: 4px solid var(--blue-france-sun-113-625, #000091);
  padding: 1.25rem;
}

.analysis-loading-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.analysis-loading-spinner {
  flex-shrink: 0;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.analysis-loading-title {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: var(--blue-france-sun-113-625, #000091);
}

.analysis-loading-text {
  font-size: 1rem;
  line-height: 1.5rem;
  color: var(--text-default-grey, #161616);
}

.analysis-loading-progress {
  height: 8px;
  background-color: var(--background-action-low-blue-france, #e5e5f8);
  border-radius: 0;
  overflow: hidden;
}

.analysis-loading-progress-bar {
  height: 100%;
  background-color: var(--blue-france-sun-113-625, #000091);
  transition: width 0.1s linear;
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
    "analysis-title": "Automatic analysis in progress",
    "analysis-in-progress": "We are verifying your documents. This usually takes less than {n} seconds.",
    "analysis-overtime": "The analysis is taking longer than expected. You can continue filling out your application."
  },
  "fr": {
    "analysis-title": "Analyse automatique en cours",
    "analysis-in-progress": "Nous vérifions vos documents. Cela prend généralement moins de {n} secondes.",
    "analysis-overtime": "L'analyse prend plus de temps que prévu. Vous pouvez continuer votre dossier."
  }
}
</i18n>
