<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ t('guarantorresidency.select-label') }}
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
              {{ t('guarantorresidency.' + d.key) }}
            </option>
          </select>
        </div>
      </div>
    </NakedCard>
    <NakedCard
      class="fr-p-md-5w fr-mt-md-3w"
      v-if="residencyDocument.key && residencyDocument.key === 'other-residency'"
    >
      <div class="fr-alert fr-alert--warning fr-mb-3w">
        {{ t('residency-page.warning-other-residency') }}
      </div>
      <AllDeclinedMessages
        :user-id="user?.id"
        :document="guarantorResidencyDocument"
        :document-denied-reasons="guarantorResidencyDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>
      <TextField
        name="customText"
        :field-label="t('residency-page.custom-text')"
        v-model="customText"
        validation-rules="required"
        :textarea="true"
      />
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('guarantorresidency.will-delete-files') }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-md-3w"
      v-if="
        (residencyDocument.key && residencyDocument.key !== 'other-residency') ||
        residencyFiles().length > 0
      "
    >
      <div
        class="fr-alert fr-alert--warning fr-mb-3w"
        v-if="residencyDocument.key === 'owner' || residencyDocument.key === 'tenant'"
      >
        {{ t('residency-page.warning-tax') }}
      </div>
      <div class="fr-mb-3w">
        <p v-html="t(`explanation-text.${guarantorKey()}.${residencyDocument.key}`)"></p>
      </div>
      <AllDeclinedMessages
        :user-id="user?.id"
        :document="guarantorResidencyDocument"
        :document-denied-reasons="guarantorResidencyDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="residencyFiles().length > 0" class="fr-col-12 fr-mb-3w">
        <ListItem
          v-for="file in residencyFiles()"
          :key="file.id"
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
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { UtilsService } from '@/services/UtilsService'
import ProfileFooter from '@/components/footer/ProfileFooter.vue'
import TextField from 'df-shared-next/src/components/form/TextField.vue'
import useTenantStore from '@/stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import { ToastService } from '@/services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { AnalyticsService } from '../../../services/AnalyticsService'
import { useI18n } from 'vue-i18n'

const store = useTenantStore()
const user = computed(() => store.userToEdit)
const selectedGuarantor = computed(() => store.selectedGuarantor)
const { t } = useI18n()

const props = defineProps<{
  tenantId?: number
}>()

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref([] as DfFile[])
const residencyDocument = ref(new DocumentType())
const customText = ref('')

const documents = DocumentTypeConstants.GUARANTOR_RESIDENCY_DOCS
const isDocDeleteVisible = ref(false)
const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

onMounted(() => {
  updateGuarantorData()
})

const guarantorResidencyDocument = computed(() => store.getGuarantorResidencyDocument)

const documentStatus = computed(() => {
  return guarantorResidencyDocument.value?.documentStatus
})

function updateGuarantorData() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
    })
    if (doc !== undefined) {
      customText.value = doc.customText || ''
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        residencyDocument.value = localDoc
      }
    }
  }
}

function onSelectChange() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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

async function goNext() {
  const saved = await save()
  if (saved) {
    emit('on-next')
  }
}

function addFiles(fileList: File[]) {
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}

function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}

async function save(): Promise<boolean> {
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
  if (store.guarantor?.id) {
    formData.append('guarantorId', store.guarantor.id.toString())
  }
  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }
  const $loading = useLoading({})
  const loader = $loading.show()
  return await store
    .saveGuarantorResidency(formData)
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
    store.getGuarantorDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'RESIDENCY'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

async function remove(file: DfFile, silent = false) {
  if (file.id) {
    if (
      files.value.length === 1 &&
      guarantorResidencyDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        guarantorResidencyDocument.value?.documentCategory || ''
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

function guarantorKey() {
  if (props.tenantId != null) {
    return 'cotenant-guarantor'
  }
  return 'guarantor'
}
</script>
