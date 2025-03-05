<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6" v-if="isCotenant">
          {{ t('guarantorprofessional.title-cotenant') }}
        </h1>
        <h1 class="fr-h6" v-else>{{ t('guarantorprofessional.title') }}</h1>
        <div class="fr-mt-3w">
          <label v-if="isCotenant">{{ t('guarantorprofessional.select-label-cotenant') }}</label>
          <select
            v-model="professionalDocument"
            class="fr-select fr-mb-3w"
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
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('guarantorprofessional.will-delete-files') }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-md-3w"
      v-if="professionalDocument.key || professionalFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="t(`explanation-text.${guarantorKey()}.professional.${professionalDocument.key}`)"
        ></p>
      </div>
      <AllDeclinedMessages
        :user-id="user?.id"
        :document="guarantorProfessionalDocument"
        :document-denied-reasons="guarantorProfessionalDocument?.documentDeniedReasons"
        :document-status="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="professionalFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
        <ListItem
          v-for="file in professionalFiles()"
          :key="file.id"
          :file="file"
          doc-category="guarantor-professional"
          :watermark-url="documentWatermarkUrl"
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
import { UtilsService } from '../../../services/UtilsService'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../../stores/tenant-store'
import { computed, onMounted, ref } from 'vue'
import { ToastService } from '../../../services/ToastService'
import { useLoading } from 'vue-loading-overlay'
import { AnalyticsService } from '../../../services/AnalyticsService'

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)
const selectedGuarantor = computed(() => {
  return store.selectedGuarantor
})

const props = withDefaults(
  defineProps<{
    tenantId?: number
    isCotenant?: boolean
  }>(),
  {
    tenantId: undefined,
    isCotenant: false
  }
)

const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const files = ref([] as DfFile[])
const professionalDocument = ref(new DocumentType())
const documents = ref(DocumentTypeConstants.GUARANTOR_PROFESSIONAL_DOCS)
const isDocDeleteVisible = ref(false)

onMounted(() => {
  updateGuarantorData()
})

const guarantorProfessionalDocument = computed(() => store.getGuarantorProfessionalDocument)
const documentStatus = computed(() => guarantorProfessionalDocument.value?.documentStatus)

const documentWatermarkUrl = computed(() => guarantorProfessionalDocument.value?.name)

function updateGuarantorData() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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
}

function onSelectChange() {
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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
  if (selectedGuarantor.value?.documents !== null) {
    const doc = selectedGuarantor.value?.documents?.find((d: DfDocument) => {
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
  if (store.guarantor?.id) {
    formData.append('guarantorId', store.guarantor.id.toString())
  }
  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }

  const $loading = useLoading({})
  const loader = $loading.show()
  store
    .saveGuarantorProfessional(formData)
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
    store.getGuarantorDocuments?.find((d: DfDocument) => {
      return d.documentCategory === 'PROFESSIONAL'
    })?.files || []
  return [...newFiles, ...existingFiles]
}

async function remove(file: DfFile, silent = false) {
  AnalyticsService.deleteFile('guarantor-professional')
  if (file.id) {
    if (
      files.value.length === 1 &&
      guarantorProfessionalDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        guarantorProfessionalDocument.value?.documentCategory || ''
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
