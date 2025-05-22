<template>
  <div>
    <Form name="form" @submit="goNext">
      <NakedCard class="fr-p-md-5w">
        <Field
          v-slot="{ field, meta }"
          v-model="organismName"
          name="organismName"
          :rules="{
            required: true
          }"
        >
          <div class="fr-input-group">
            <label class="fr-label" for="organismName"
              >{{ t('corporationidentification.organism-name') }} :</label
            >
            <input
              v-bind="field"
              id="organismName"
              class="form-control fr-input validate-required"
              :class="{
                'fr-input--valid': meta.valid,
                'fr-input--error': !meta.valid
              }"
              name="organismName"
              :placeholder="t('corporationidentification.organism-name-placeholder')"
              type="text"
              required
            />
            <ErrorMessage v-slot="{ message }" name="organismName">
              <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
            </ErrorMessage>
          </div>
        </Field>
      </NakedCard>
      <NakedCard class="fr-mt-3w fr-p-md-5w">
        <div>
          <h1 class="fr-label">
            {{ t('corporationidentification.kbis-label') }}
          </h1>
          <AllDeclinedMessages
            :user-id="store.user?.id"
            :document="guarantorIdentificationLegalPersonDocument"
            :document-denied-reasons="
              guarantorIdentificationLegalPersonDocument?.documentDeniedReasons
            "
            :document-status="documentStatus"
          ></AllDeclinedMessages>
          <div class="fr-col-md-12 fr-mb-3w">
            <ListItem
              v-for="file in listFiles()"
              :key="file.id"
              :file="file"
              :doc-category="analyticDocumentType"
              :watermark-url="documentWatermarkUrl"
              @remove="remove(file)"
            />
          </div>
          <div class="fr-mt-3w fr-mb-3w">
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
import { ToastService } from '@/services/ToastService'
import { useTenantStore } from '@/stores/tenant-store'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { computed, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoading } from 'vue-loading-overlay'
import { AnalyticsService, type DocumentCategory } from '../../../services/AnalyticsService'
import { RegisterService } from '../../../services/RegisterService'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'
import FileUpload from '../../uploads/FileUpload.vue'
import ListItem from '../../uploads/ListItem.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'

const store = useTenantStore()
const { t } = useI18n()

const props = defineProps<{
  tenantId?: number
  guarantor?: Guarantor
}>()

const organismName = ref('')

const files = ref([] as DfFile[])
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)
const emit = defineEmits<{ 'on-back': []; 'on-next': [] }>()

onBeforeMount(() => {
  organismName.value = guarantor.value?.legalPersonName || ''
})

const guarantor = computed(() => props.guarantor || store.guarantor)
const guarantorIdentificationLegalPersonDocument = computed(() => {
  if (props.guarantor) {
    return props.guarantor.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'IDENTIFICATION_LEGAL_PERSON'
    })
  }
  return store.getGuarantorIdentificationLegalPersonDocument
})
const documentStatus = computed(
  () => guarantorIdentificationLegalPersonDocument.value?.documentStatus
)

const analyticDocumentType = computed<DocumentCategory>(() => {
  if (props.guarantor) {
    return `guarantor-${DocumentTypeTranslations.IDENTIFICATION_LEGAL_PERSON}`
  } else {
    return DocumentTypeTranslations.IDENTIFICATION_LEGAL_PERSON
  }
})

const documentWatermarkUrl = computed(() => guarantorIdentificationLegalPersonDocument.value?.name)

function addFiles(fileList: File[]) {
  const nf = Array.from(fileList).map((f) => {
    return { name: f.name, file: f, size: f.size }
  })
  files.value = [...files.value, ...nf]
  save()
}

function save() {
  if (!organismName.value) {
    return Promise.resolve(true)
  }
  const fieldName = 'documents'
  const formData = new FormData()
  formData.append('legalPersonName', organismName.value)
  const gId = guarantor.value?.id
  if (gId) {
    formData.append('guarantorId', gId.toString())
  }
  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }

  const $loading = useLoading({})
  const loader = $loading.show()
  if (!files.value.length) {
    return RegisterService.saveCorporationName(formData)
      .then(() => {
        files.value = []
        fileUploadStatus.value = UploadStatus.STATUS_INITIAL
        store.loadUser()
        ToastService.saveSuccess()
        return Promise.resolve(true)
      })
      .catch((err: Error) => {
        fileUploadStatus.value = UploadStatus.STATUS_FAILED
        ToastService.saveFailed()
        return Promise.reject(err)
      })
      .finally(() => {
        loader.hide()
      })
  }

  Array.from(Array(files.value.length).keys()).forEach((x) => {
    const f: File = files.value[x].file || new File([], '')
    formData.append(`${fieldName}[${x}]`, f, files.value[x].name)
  })

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  return RegisterService.saveCorporationIdentification(formData)
    .then(() => {
      files.value = []
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      store.loadUser()
      ToastService.saveSuccess()
      return Promise.resolve(true)
    })
    .catch((err: Error) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      ToastService.saveFailed()
      return Promise.reject(err)
    })
    .finally(() => {
      loader.hide()
    })
}

function resetFiles() {
  fileUploadStatus.value = UploadStatus.STATUS_INITIAL
}

function remove(file: DfFile) {
  if (file.id) {
    if (
      files.value.length === 1 &&
      guarantorIdentificationLegalPersonDocument.value?.documentAnalysisReport?.analysisStatus ===
        'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(
        guarantorIdentificationLegalPersonDocument.value?.documentCategory || ''
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
  const newFiles = files.value.map((f) => {
    return {
      id: f.id,
      name: f.name,
      file: f.file,
      size: f.file?.size
    }
  })
  const existingFiles = guarantorIdentificationLegalPersonDocument.value?.files || []
  return [...newFiles, ...existingFiles]
}

function goBack() {
  emit('on-back')
}

function goNext() {
  save().then(() => {
    emit('on-next')
  })
}
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
