<template>
  <div>
    <Form name="form" @submit="goNext">
      <NakedCard class="fr-p-md-5w">
        <GuarantorBadge />
        <Field
          v-slot="{ field, meta }"
          v-model="firstName"
          name="firstName"
          :rules="{
            required: true
          }"
        >
          <div class="fr-input-group">
            <h1 class="fr-label fr-text--regular" for="firstName">
              {{ t('representativeidentification.organism-name') }} :
            </h1>
            <input
              v-bind="field"
              id="firstName"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              name="firstName"
              :placeholder="t('representativeidentification.organism-name-placeholder')"
              type="text"
              required
            />
            <ErrorMessage v-slot="{ message }" name="firstName">
              <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
            </ErrorMessage>
          </div>
        </Field>
      </NakedCard>
      <NakedCard class="fr-mt-3w fr-p-md-5w">
        <div class="fr-select-group">
          <label class="fr-label" for="select">
            <b>
              J’ajoute une pièce d’identité en cours de validité. Attention, veillez à ajouter votre
              pièce recto-verso !
            </b>
          </label>
          <select
            id="selectID"
            v-model="identificationDocument"
            class="fr-select fr-mb-3w"
            as="select"
          >
            <option v-if="!identificationDocument" selected disabled></option>
            <option v-for="d in documents" :key="d.key" :value="d">
              {{ t(d.key) }}
            </option>
          </select>
        </div>
        <div v-if="identificationDocument && identificationDocument.key">
          <AllDeclinedMessages
            :user-id="store.user?.id"
            :document="guarantorIdentificationDocument"
            :document-denied-reasons="guarantorIdentificationDocument?.documentDeniedReasons"
            :document-status="documentStatus"
          ></AllDeclinedMessages>
          <div v-if="listFiles().length > 0" class="fr-col-md-12 fr-mb-3w">
            <ListItem
              v-for="file in listFiles()"
              :key="file.id"
              :file="file"
              :doc-category="analyticDocumentType"
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
        </div>
      </NakedCard>
      <GuarantorFooter @on-back="goBack"></GuarantorFooter>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { DocumentTypeTranslations } from '@/components/editmenu/documents/DocumentType'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { AnalyticsService, type DocumentCategory } from '../../../services/AnalyticsService'
import { RegisterService } from '../../../services/RegisterService'
import { ToastService } from '../../../services/ToastService'
import { useTenantStore } from '../../../stores/tenant-store'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import FileUpload from '../../uploads/FileUpload.vue'
import ListItem from '../../uploads/ListItem.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { DocumentTypeConstants } from '../share/DocumentTypeConstants'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'

const { t } = useI18n()
const documents = DocumentTypeConstants.REPRESENTATIVE_IDENTIFICATION
const props = defineProps<{
  tenantId?: number
  guarantor?: Guarantor
}>()
const store = useTenantStore()
const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

const MAX_FILE_COUNT = 5

const identificationDocument = ref(new DocumentType())

const files = ref([] as File[])
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const firstName = ref('')

onBeforeMount(() => {
  firstName.value = guarantor.value?.firstName || ''
  if (guarantor.value?.documents !== null) {
    const doc = guarantorIdentificationDocument.value
    if (doc !== undefined) {
      const localDoc = documents.find((d: DocumentType) => {
        return d.value === doc.documentSubCategory
      })
      if (localDoc !== undefined) {
        identificationDocument.value = localDoc
      }
    }
  }
})

const guarantor = computed(() => props.guarantor || store.guarantor)
const guarantorIdentificationDocument = computed(() => {
  if (props.guarantor) {
    return props.guarantor.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'IDENTIFICATION'
    })
  }
  return store.getGuarantorIdentificationDocument
})
const documentStatus = computed(() => guarantorIdentificationDocument.value?.documentStatus)

const analyticDocumentType = computed<DocumentCategory>(() => {
  if (props.guarantor) {
    return `guarantor-${DocumentTypeTranslations.IDENTIFICATION_LEGAL_PERSON}`
  } else {
    return DocumentTypeTranslations.IDENTIFICATION_LEGAL_PERSON
  }
})

function addFiles(fileList: File[]) {
  files.value = [...files.value, ...fileList]
  save()
}

function save() {
  if (!firstName.value) {
    files.value = []
    return Promise.reject(new Error('Save: no first name'))
  }
  const fieldName = 'documents'
  const formData = new FormData()
  const gId = guarantor.value?.id
  if (gId) {
    formData.append('guarantorId', gId.toString())
  }
  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }
  if (firstName.value) {
    formData.append('firstName', firstName.value)
  }

  if (!files.value.length) {
    const $loading = useLoading({})
    const loader = $loading.show()
    return RegisterService.saveLegalPersonRepresentantName(formData)
      .then(() => {
        files.value = []
        fileUploadStatus.value = UploadStatus.STATUS_INITIAL
        store.loadUser()
        return Promise.resolve(true)
      })
      .catch((err: Error) => {
        fileUploadStatus.value = UploadStatus.STATUS_FAILED
        ToastService.error('errors.submit-failed')
        return Promise.reject(err)
      })
      .finally(() => {
        loader.hide()
      })
  }

  if (listFiles().length > MAX_FILE_COUNT) {
    ToastService.maxFileError(listFiles().length, MAX_FILE_COUNT)
    return Promise.reject(new Error('Save: too many files'))
  }
  Array.from(Array(files.value.length).keys()).forEach((x) => {
    formData.append(`${fieldName}[${x}]`, files.value[x], files.value[x].name)
  })

  formData.append('typeDocumentIdentification', identificationDocument.value.value)

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading({})
  const loader = $loading.show()
  return RegisterService.saveRepresentativeIdentification(formData)
    .then(() => {
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      store.loadUser()
      ToastService.saveSuccess()
      return Promise.resolve(true)
    })
    .catch(() => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      ToastService.error('add-file-failed')
      return Promise.reject(new Error('Save: upload failed'))
    })
    .finally(() => {
      loader.hide()
    })
}

function goBack() {
  emit('on-back')
}

function goNext() {
  save().then(() => {
    emit('on-next')
  })
}

function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}

function remove(file: DfFile) {
  AnalyticsService.deleteFile(analyticDocumentType.value)
  if (file.id) {
    if (
      files.value.length === 1 &&
      guarantorIdentificationDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        guarantorIdentificationDocument.value?.documentCategory || ''
      )
    }
    RegisterService.deleteFile(file.id)
  } else {
    const firstIndex = files.value.findIndex((f) => {
      return f.name === file.name && f.size === file.size
    })
    files.value.splice(firstIndex, 1)
  }
}

function listFiles() {
  const existingFiles = guarantorIdentificationDocument.value?.files || []
  return existingFiles
}

const documentWatermarkUrl = computed(() => {
  return guarantorIdentificationDocument.value?.name
})
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>
