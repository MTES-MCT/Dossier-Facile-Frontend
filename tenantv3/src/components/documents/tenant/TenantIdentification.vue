<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <h1 class="fr-h6">
        {{ t('identification-page.select-label') }}
      </h1>
      <div class="fr-mt-3w">
        <SimpleRadioButtons
          name="application-type-selector"
          :value="identificationDocument"
          @input="onSelectChange"
          :elements="mapDocuments()"
        ></SimpleRadioButtons>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="identificationDocument.key || identificationFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p v-html="t(`explanation-text.tenant.${identificationDocument.key}`)"></p>
      </div>
      <AllDeclinedMessages
        :user-id="user?.id"
        :document="tenantIdentificationDocument"
        :document-denied-reasons="tenantIdentificationDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="identificationFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
        <ListItem
          v-for="(file, k) in identificationFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          :page="4"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('identification-page.will-delete-files') }}</span>
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
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import ProfileFooter from '@/components/footer/ProfileFooter.vue'

defineEmits<{ 'on-back': []; 'on-next': [] }>()
const store = useTenantStore()
const user = computed(() => {
  return store.userToEdit
})
const { t } = useI18n()

const documents = DocumentTypeConstants.IDENTIFICATION_DOCS
const tenantIdentificationDocument = computed(() => {
  return store.getTenantIdentificationDocument
})
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref([] as DfFile[])
const identificationDocument = ref(new DocumentType())
const isDocDeleteVisible = ref(false)

function getLocalStorageKey() {
  return 'identification_' + user.value?.email
}

const documentStatus = computed(() => {
  return tenantIdentificationDocument.value?.documentStatus
})

onBeforeMount(() => {
  if (user.value?.documents !== null) {
    if (tenantIdentificationDocument.value !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === tenantIdentificationDocument.value?.documentSubCategory
      })
      if (localDoc !== undefined) {
        identificationDocument.value = localDoc
        localStorage.setItem(getLocalStorageKey(), identificationDocument.value.key || '')
      }
    } else {
      const key = localStorage.getItem(getLocalStorageKey())
      if (key) {
        const localDoc = documents.find((d: DocumentType) => {
          return d.key === key
        })
        if (localDoc !== undefined) {
          identificationDocument.value = localDoc
        }
      }
    }
  }
})

function onSelectChange(docType: DocumentType) {
  identificationDocument.value = docType
  localStorage.setItem(getLocalStorageKey(), identificationDocument.value.key)
  if (user.value?.documents !== null) {
    const doc = tenantIdentificationDocument.value
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc?.files?.length || 0) > 0 &&
        doc?.documentSubCategory !== identificationDocument.value.value
    }
  }
  return false
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = tenantIdentificationDocument.value
    if (doc !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc?.documentSubCategory
      })
      if (localDoc !== undefined) {
        identificationDocument.value = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  if (user.value?.documents !== null) {
    const doc = tenantIdentificationDocument.value
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
  AnalyticsService.uploadFile('identification')
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
    identificationDocument.value.maxFileCount &&
    identificationFiles().length > identificationDocument.value.maxFileCount
  ) {
    ToastService.maxFileError(
      identificationFiles().length,
      identificationDocument.value.maxFileCount
    )
    files.value = []
    return
  }

  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], '')
    formData.append(`${fieldName}[${x}]`, f, newFiles[x].name)
  })

  formData.append('typeDocumentIdentification', identificationDocument.value.value)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  // TODO : remove loader when upload status is well handled (be carefull with multiple save at the same time)
  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .saveTenantIdentification(formData)
    .then(() => {
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      files.value = []
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

function identificationFiles() {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: identificationDocument.value,
      id: f.id,
      name: f.name,
      file: f.file,
      size: f.file?.size
    }
  })
  const existingFiles =
    store.getTenantDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'IDENTIFICATION'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile('identification')
  if (file.id) {
    if (
      tenantIdentificationDocument.value?.files?.length === 1 &&
      tenantIdentificationDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        tenantIdentificationDocument.value?.documentSubCategory || ''
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

function mapDocuments() {
  return documents.map((d) => {
    return { id: d.key, labelKey: d.key, value: d }
  })
}
</script>
