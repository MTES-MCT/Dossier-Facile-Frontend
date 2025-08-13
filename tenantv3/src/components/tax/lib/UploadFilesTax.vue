<template>
  <AllDeclinedMessages
    :user-id="taxState.userId"
    :document="taxDocument"
    :document-denied-reasons="taxDocument?.documentDeniedReasons"
    :document-status="documentStatus"
  ></AllDeclinedMessages>
  <div v-if="taxFiles.length > 0" class="fr-col-12 fr-mb-3w">
    <ListItem
      v-for="file in taxFiles"
      :key="file.id"
      :file="file"
      :watermark-url="documentWatermarkUrl"
      doc-category="tax"
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument(taxState.category)"
      @cancel="AnalyticsService.cancelDelete(taxState.category)"
    />
  </div>
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    @add-files="addFiles"
  ></FileUpload>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RegisterService } from '@/services/RegisterService'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { UtilsService } from '@/services/UtilsService'
import { useLoading } from 'vue-loading-overlay'
import { toast } from '@/components/toast/toastUtils'
import { useI18n } from 'vue-i18n'
import { useTaxState } from './taxState'
import type {
  TaxCategory,
  TaxCategoryStep
} from '@/components/documents/share/DocumentTypeConstants'

const props = defineProps<{ category: TaxCategory; step?: TaxCategoryStep; explanation?: string }>()

const MAX_FILE_COUNT = 5

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])

const store = useTenantStore()
const taxState = useTaxState()
const fileUpload = useTemplateRef('file-upload')
const { t } = useI18n()

const taxDocument = taxState.document
const documentStatus = computed(() => taxDocument.value?.documentStatus)

const taxFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: props.category,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles = taxDocument.value?.files || []
  return [...newFiles, ...existingFiles]
})

const documentWatermarkUrl = computed(() => taxDocument.value?.name)

async function save(): Promise<boolean> {
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    return true
  }

  if (taxFiles.value.length > MAX_FILE_COUNT) {
    toast.maxFileError(taxFiles.value.length, MAX_FILE_COUNT, fileUpload.value?.inputFile)
    files.value = []
    return false
  }

  for (const [key, newFile] of newFiles.entries()) {
    const f = newFile.file || new File([], '')
    formData.append(`documents[${key}]`, f, newFile.name)
  }

  formData.append('typeDocumentTax', props.category)
  if (props.step) {
    formData.append('categoryStep', props.step)
  }
  formData.append('noDocument', String(newFiles.length === 0))
  if (props.explanation) {
    formData.append('customText', props.explanation)
  }
  taxState.addData?.(formData)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  return await store[taxState.action](formData)
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

function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile(taxState.category, props.category)
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(taxState.category)
  if (file.id) {
    if (
      taxDocument.value?.files?.length === 1 &&
      taxDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(taxDocument.value?.documentSubCategory || '')
    }
    await RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = files.value.findIndex((f) => f.name === file.name && !f.path)
    files.value.splice(firstIndex, 1)
  }
}
</script>
