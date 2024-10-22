<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ t('residency-page.select-label') }}
        </h1>

        <div class="fr-mt-3w">
          <select
            v-model="residencyDocument"
            class="fr-select fr-mb-3w fr-mt-3w"
            id="select"
            @change="onSelectChange()"
            aria-label="Select residency type"
          >
            <option v-if="!residencyDocument" selected disabled></option>
            <option v-for="d in documents" :value="d" :key="d.key">
              {{ t('documents.' + d.key) }}
            </option>
          </select>
        </div>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="residencyDocument.key && residencyDocument.key === 'other-residency'"
    >
      <div class="fr-alert fr-alert--warning fr-mb-3w">
        {{ t('residency-page.warning-other-residency') }}
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <TextField
        name="customText"
        :fieldLabel="t('residency-page.custom-text')"
        v-model="customText"
        validation-rules="required"
        :textarea="true"
      />
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="
        (residencyDocument.key && residencyDocument.key !== 'other-residency') ||
        residencyFiles().length > 0
      "
    >
      <div class="fr-mb-3w">
        <p v-html="t(`explanation-text.tenant.${residencyDocument.key}`)"></p>
        <div
          class="fr-background-contrast--info fr-p-2w fr-mt-2w warning-box"
          v-if="residencyDocument.key === 'tenant'"
        >
          <div class="fr-text-default--info fr-h6 title">
            <i class="ri-error-warning-line"></i>
            <span class="fr-ml-1w">
              {{ t('residency-page.warning-only-rent-receipt') }}
            </span>
          </div>
        </div>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :document="tenantResidencyDocument"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="residencyFiles().length > 0" class="fr-col-12 fr-mb-3w">
        <ListItem
          v-for="(file, k) in residencyFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
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
    <ProfileFooter @on-back="emit('on-back')" @on-next="goNext"></ProfileFooter>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('residency-page.will-delete-files') }}</span>
    </ConfirmModal>
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
import { DocumentDeniedReasons } from 'df-shared-next/src/models/DocumentDeniedReasons'
import { cloneDeep } from 'lodash'
import { UtilsService } from '@/services/UtilsService'
import ProfileFooter from '@/components/footer/ProfileFooter.vue'
import TextField from 'df-shared-next/src/components/form/TextField.vue'
import { computed, onBeforeMount, ref } from 'vue'
import useTenantStore from '@/stores/tenant-store'
import { useI18n } from 'vue-i18n'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'

const { t } = useI18n()
const emit = defineEmits(['on-next', 'on-back'])
const store = useTenantStore()
const user = computed(() => store.userToEdit)
const tenantResidencyDocument = computed(() => store.getTenantResidencyDocument)
const documents = DocumentTypeConstants.RESIDENCY_DOCS

const documentDeniedReasons = ref(new DocumentDeniedReasons())
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref<{ name: string; file: File; size: number; id?: string; path?: string }[]>([])
const residencyDocument = ref(new DocumentType())
const customText = ref('')

const isDocDeleteVisible = ref(false)

function getLocalStorageKey() {
  return 'residency_' + user.value?.email
}

const documentStatus = computed(() => {
  return tenantResidencyDocument.value?.documentStatus
})

onBeforeMount(() => {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
    })
    if (doc !== undefined) {
      customText.value = doc.customText || ''
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        residencyDocument.value = localDoc
        localStorage.setItem(getLocalStorageKey(), residencyDocument.value.key || '')
      }
      if (tenantResidencyDocument.value?.documentDeniedReasons) {
        documentDeniedReasons.value = cloneDeep(tenantResidencyDocument.value.documentDeniedReasons)
      }
    } else {
      const key = localStorage.getItem(getLocalStorageKey())
      if (key) {
        const localDoc = documents.find((d: DocumentType) => {
          return d.key === key
        })
        if (localDoc !== undefined) {
          residencyDocument.value = localDoc
        }
      }
    }
  }
})

function onSelectChange() {
  localStorage.setItem(getLocalStorageKey(), residencyDocument.value.key)
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
    })
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc.files?.length || 0) > 0 && doc.documentSubCategory !== residencyDocument.value.value
    }
  }
  return false
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
    })
    if (doc !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        residencyDocument.value = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  if (user.value?.documents !== null) {
    const doc = user.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
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
  AnalyticsService.uploadFile('residency')
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}
function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}

async function goNext() {
  const saved = await save()
  if (saved) {
    emit('on-next')
  }
}

async function save(): Promise<boolean> {
  AnalyticsService.registerFile('residency')
  const fieldName = 'documents'
  const formData = new FormData()
  const newFiles = files.value.filter((f) => {
    return !f.id
  })
  if (!newFiles.length) {
    if (residencyDocument.value.key === 'other-residency') {
      formData.append('customText', customText.value)
    } else {
      return true
    }
  }

  if (
    residencyDocument.value.maxFileCount &&
    residencyFiles().length > residencyDocument.value.maxFileCount
  ) {
    ToastService.maxFileError(residencyFiles().length, residencyDocument.value.maxFileCount)
    files.value = []
    return false
  }

  Array.from(Array(newFiles.length).keys()).forEach((x) => {
    const f: File = newFiles[x].file || new File([], '')
    formData.append(`${fieldName}[${x}]`, f, newFiles[x].name)
  })

  formData.append('typeDocumentResidency', residencyDocument.value.value)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading({})
  const loader = $loading.show()
  return await store
    .saveTenantResidency(formData)
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

function residencyFiles() {
  const newFiles = files.value.map((f) => {
    return {
      documentSubCategory: residencyDocument.value.value,
      id: f.id,
      name: f.name,
      size: f.size
    }
  })
  const existingFiles =
    store.getTenantDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile('residency')
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
