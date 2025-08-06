<template>
  <AllDeclinedMessages
    :user-id="identityState.userId"
    :document="identityDocument"
    :document-denied-reasons="identityDocument?.documentDeniedReasons"
    :document-status="documentStatus"
  ></AllDeclinedMessages>
  <div v-if="identificationFiles.length > 0" class="fr-col-12 fr-mb-3w">
    <ListItem
      v-for="file in identificationFiles"
      :key="file.id"
      :file="file"
      :watermark-url="documentWatermarkUrl"
      doc-category="identification"
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument(identityState.category)"
      @cancel="AnalyticsService.cancelDelete(identityState.category)"
    />
  </div>
  <FileUpload
    ref="file-upload"
    :current-status="fileUploadStatus"
    :page="4"
    @add-files="addFiles"
  ></FileUpload>
  <IdentificationFooter />
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
import type { IdentityCategory } from '@/components/documents/share/DocumentTypeConstants'
import IdentificationFooter from './IdentificationFooter.vue'
import { useIdentificationState } from './identityDocumentState'
import { toast } from '@/components/toast/toastUtils'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ category: IdentityCategory }>()

const MAX_FILE_COUNT = 5

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])

const store = useTenantStore()
const identityState = useIdentificationState()
const fileUpload = useTemplateRef('file-upload')
const { t } = useI18n()

const identityDocument = identityState.document
const documentStatus = computed(() => identityDocument.value?.documentStatus)

const identificationFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: props.category,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles = identityDocument.value?.files || []
  return [...newFiles, ...existingFiles]
})

const documentWatermarkUrl = computed(() => identityDocument.value?.name)

async function save(): Promise<boolean> {
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    return true
  }

  if (identificationFiles.value.length > MAX_FILE_COUNT) {
    toast.maxFileError(
      identificationFiles.value.length,
      MAX_FILE_COUNT,
      fileUpload.value?.inputFile
    )
    files.value = []
    return false
  }

  for (const [key, newFile] of newFiles.entries()) {
    const f = newFile.file || new File([], '')
    formData.append(`documents[${key}]`, f, newFile.name)
  }

  formData.append('typeDocumentIdentification', props.category)
  identityState.addData?.(formData)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  return await store[identityState.action](formData)
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
  AnalyticsService.uploadFile(identityState.category, props.category)
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(identityState.category)
  if (file.id) {
    if (
      identityDocument.value?.files?.length === 1 &&
      identityDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(identityDocument.value?.documentSubCategory || '')
    }
    await RegisterService.deleteFile(file.id, silent)
  } else {
    const firstIndex = files.value.findIndex((f) => {
      return f.name === file.name && !f.path
    })
    files.value.splice(firstIndex, 1)
  }
}
</script>
