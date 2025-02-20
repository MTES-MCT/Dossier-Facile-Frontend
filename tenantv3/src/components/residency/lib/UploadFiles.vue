<template>
  <AllDeclinedMessages
    :user-id="userId"
    :document="tenantResidencyDocument"
    :document-denied-reasons="tenantResidencyDocument?.documentDeniedReasons"
    :document-status="documentStatus"
  ></AllDeclinedMessages>
  <div v-if="residencyFiles.length > 0" class="fr-col-12 fr-mb-3w">
    <ListItem
      v-for="file in residencyFiles"
      :key="file.id"
      :file="file"
      :watermark-url="documentWatermarkUrl" 
      @remove="remove(file)"
      @ask-confirm="AnalyticsService.deleteDocument(category)"
      @cancel="AnalyticsService.cancelDelete(category)"
    />
  </div>
  <div class="fr-mb-3w">
    <FileUpload :current-status="fileUploadStatus" @add-files="addFiles"></FileUpload>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FileUpload from '@/components/uploads/FileUpload.vue'
import ListItem from '@/components/uploads/ListItem.vue'
import AllDeclinedMessages from '@/components/documents/share/AllDeclinedMessages.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { AnalyticsService } from '@/services/AnalyticsService'
import useTenantStore from '@/stores/tenant-store'
import type { DocumentCategoryStep } from 'df-shared-next/src/models/DfDocument'
import { RegisterService } from '@/services/RegisterService'
import type { DfFile } from 'df-shared-next/src/models/DfFile'
import { UtilsService } from '@/services/UtilsService'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import type { ResidencyCategory } from '@/components/documents/share/DocumentTypeConstants'

const {
  maxFileCount = 10,
  category: residencyCategory,
  step: categoryStep,
  guarantor = false
} = defineProps<{
  category: ResidencyCategory
  step?: DocumentCategoryStep
  maxFileCount?: number
  guarantor?: boolean
}>()

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])

const store = useTenantStore()

const category = guarantor ? 'guarantor-residency' : 'residency'
const tenantResidencyDocument = computed(() =>
  guarantor ? store.getGuarantorResidencyDocument : store.getTenantResidencyDocument
)
const documentStatus = computed(() => tenantResidencyDocument.value?.documentStatus)
const userId = computed(() => (guarantor ? store.user.id : undefined))
const residencyFiles = computed(() => {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: residencyCategory,
      documentCategoryStep: categoryStep,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles = tenantResidencyDocument.value?.files || []
  return [...newFiles, ...existingFiles]
})

const documentWatermarkUrl = computed(() => tenantResidencyDocument.value?.name)

async function save(): Promise<boolean> {
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    return true
  }

  if (residencyFiles.value.length > maxFileCount) {
    ToastService.maxFileError(residencyFiles.value.length, maxFileCount)
    files.value = []
    return false
  }

  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], '')
    formData.append(`documents[${x}]`, f, newFiles[x].name)
  })

  formData.append('typeDocumentResidency', residencyCategory)
  if (categoryStep) {
    formData.append('categoryStep', categoryStep)
  }
  if (guarantor && store.guarantor?.id) {
    formData.append('guarantorId', store.guarantor.id?.toString())
  }

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading()
  const loader = $loading.show()
  const action = guarantor ? 'saveGuarantorResidency' : 'saveTenantResidency'
  return await store[action](formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      ToastService.saveSuccess()
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
  AnalyticsService.uploadFile(category, residencyCategory, categoryStep)
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile(category)
  if (file.id) {
    if (
      tenantResidencyDocument.value?.files?.length === 1 &&
      tenantResidencyDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        tenantResidencyDocument.value?.documentSubCategory || ''
      )
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
