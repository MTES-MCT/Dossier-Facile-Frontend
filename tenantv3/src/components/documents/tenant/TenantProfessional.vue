<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ t('professional-page.select-label') }}
        </h1>
        <select
          v-model="professionalDocument"
          class="fr-select fr-mb-3w fr-mt-3w"
          id="select"
          as="select"
          @change="onSelectChange()"
          aria-label="Select professional situation"
        >
          <option v-if="!professionalDocument" selected disabled></option>
          <option v-for="d in documents" :value="d" :key="d.key">
            {{ t(d.key) }}
          </option>
        </select>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-md-3w"
      v-if="professionalDocument.key || professionalFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <div v-html="t(`explanation-text.tenant.professional.${professionalDocument.key}`)"></div>
      </div>
      <AllDeclinedMessages
        :document-denied-reasons="tenantProfessionalDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="professionalFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
        <ListItem
          v-for="file in professionalFiles()"
          :key="file.id"
          :file="file"
          :watermark-url="documentWatermarkUrl"
          @remove="remove(file)"
          @ask-confirm="AnalyticsService.deleteDocument('professional')"
          @cancel="AnalyticsService.cancelDelete('professional')"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('professional-page.will-delete-files') }}</span>
    </ConfirmModal>
    <ProfileFooter @on-back="$emit('on-back')" @on-next="$emit('on-next')"></ProfileFooter>
  </div>
</template>

<script setup lang="ts">
import FileUpload from '../../uploads/FileUpload.vue'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import ListItem from '../../uploads/ListItem.vue'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { RegisterService } from '../../../services/RegisterService'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { AnalyticsService } from '../../../services/AnalyticsService'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { UtilsService } from '@/services/UtilsService'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import ProfileFooter from '@/components/footer/ProfileFooter.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.userToEdit)
const tenantProfessionalDocument = computed(() => store.getTenantProfessionalDocument)
const documentWatermarkUrl = computed(() => tenantProfessionalDocument.value?.name)

const documents = ref(DocumentTypeConstants.PROFESSIONAL_DOCS)

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref([] as DfFile[])
const professionalDocument = ref(new DocumentType())
const isDocDeleteVisible = ref(false)

function getLocalStorageKey() {
  return 'professional_' + user.value?.email
}

const documentStatus = computed(() => {
  return tenantProfessionalDocument.value?.documentStatus
})

onBeforeMount(() => {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'PROFESSIONAL'
    })
    if (doc !== undefined) {
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        professionalDocument.value = localDoc
        localStorage.setItem(getLocalStorageKey(), professionalDocument.value.key || '')
      }
    } else {
      const key = localStorage.getItem(getLocalStorageKey())
      if (key) {
        const localDoc = documents.value.find((d: DocumentType) => {
          return d.key === key
        })
        if (localDoc !== undefined) {
          professionalDocument.value = localDoc
        }
      }
    }
  }
})

function onSelectChange() {
  localStorage.setItem(getLocalStorageKey(), professionalDocument.value.key)
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'PROFESSIONAL'
    })
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc.files?.length || 0) > 0 && doc.documentSubCategory !== professionalDocument.value.value
    }
  }
  return false
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'PROFESSIONAL'
    })
    if (doc !== undefined) {
      const localDoc = documents.value.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        professionalDocument.value = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'PROFESSIONAL'
    })
    if (doc?.files !== undefined) {
      for (const f of doc.files) {
        if (f.id) {
          await remove(f, true)
        }
      }
    }
  }
}

function addFiles(fileList: File[]) {
  AnalyticsService.uploadFile('professional')
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}
function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}
function save() {
  const fieldName = 'documents'
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) return

  if (
    professionalDocument.value.maxFileCount &&
    professionalFiles().length > professionalDocument.value.maxFileCount
  ) {
    ToastService.maxFileError(professionalFiles().length, professionalDocument.value.maxFileCount)
    files.value = []
    return
  }
  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], '')
    formData.append(`${fieldName}[${x}]`, f, newFiles[x].name)
  })

  formData.append('typeDocumentProfessional', professionalDocument.value.value)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .saveTenantProfessional(formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      ToastService.saveSuccess()
    })
    .catch((err) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(err)
    })
    .finally(() => {
      loader.hide()
    })
}

function professionalFiles() {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: professionalDocument.value.value,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles =
    store.getTenantDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'PROFESSIONAL'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile('professional')
  if (file.id) {
    if (
      tenantProfessionalDocument.value?.files?.length === 1 &&
      tenantProfessionalDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        tenantProfessionalDocument.value?.documentSubCategory || ''
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
