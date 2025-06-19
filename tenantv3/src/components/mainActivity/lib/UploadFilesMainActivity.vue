<template>
  <AllDeclinedMessages
    :user-id="userId"
    :document="mainActivityDocument"
    :document-denied-reasons="mainActivityDocument?.documentDeniedReasons"
    :document-status="documentStatus"
  ></AllDeclinedMessages>
  <div v-if="professionalFiles.length > 0" class="fr-col-12 fr-mb-3w">
    <ListItem
      v-for="file in professionalFiles"
      :key="file.id"
      :file="file"
      :watermark-url="documentWatermarkUrl"
      :doc-category="stateCategory"
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument(stateCategory)"
      @cancel="AnalyticsService.cancelDelete(stateCategory)"
    />
  </div>
  <FileUpload :current-status="fileUploadStatus" @add-files="addFiles"></FileUpload>
  <MainActivityFooter />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { AnalyticsService } from '@/services/AnalyticsService'
import { useTenantStore } from '@/stores/tenant-store'
import { RegisterService } from '@/services/RegisterService'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { UtilsService } from '@/services/UtilsService'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import type { MainActivityCategory } from '@/components/documents/share/DocumentTypeConstants'
import { useMainActivityState } from './mainActivityState'
import MainActivityFooter from './MainActivityFooter.vue'

const props = defineProps<{ category: MainActivityCategory }>()

const MAX_FILE_COUNT = 20

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])

const store = useTenantStore()
const mainActivityState = useMainActivityState()

const stateCategory = mainActivityState.category
const mainActivityDocument = mainActivityState.document
const documentStatus = computed(() => mainActivityDocument.value?.documentStatus)
const userId = mainActivityState.userId
const professionalFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: props.category,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles = mainActivityDocument.value?.files || []
  return [...newFiles, ...existingFiles]
})

const documentWatermarkUrl = computed(() => mainActivityDocument.value?.name)

async function save(): Promise<boolean> {
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    return true
  }

  if (professionalFiles.value.length > MAX_FILE_COUNT) {
    ToastService.maxFileError(professionalFiles.value.length, MAX_FILE_COUNT)
    files.value = []
    return false
  }

  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], '')
    formData.append(`documents[${x}]`, f, newFiles[x].name)
  })

  formData.append('typeDocumentProfessional', props.category)
  mainActivityState?.addData?.(formData)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  return await store[mainActivityState.action](formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      ToastService.success('file-saved')
      return true
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
      return false
    })
    .finally(() => {
      loader.hide()
    })
}

function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile(stateCategory, props.category)
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(stateCategory)
  if (file.id) {
    if (
      mainActivityDocument.value?.files?.length === 1 &&
      mainActivityDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(mainActivityDocument.value?.documentSubCategory || '')
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
