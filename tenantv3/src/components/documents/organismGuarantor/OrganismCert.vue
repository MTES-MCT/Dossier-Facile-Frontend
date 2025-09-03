<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <GuarantorBadge />
      <h1 class="fr-h6">
        {{ title }}
      </h1>
      <SimpleRadioButtons
        name="organism-type-selector"
        :value="selectedDocumentType"
        :elements="documentTypes()"
        @input="onSelectChange($event)"
      >
        <span class="sr-only">{{ title }}</span>
      </SimpleRadioButtons>
    </NakedCard>
    <NakedCard v-if="selectedDocumentType.key || files.length > 0" class="fr-p-md-5w fr-mt-md-3w">
      <div>
        <AllDeclinedMessages
          :user-id="user?.id"
          :document="guarantorCertificateDocument()"
          :document-denied-reasons="documentDeniedReasons"
          :document-status="documentStatus"
        ></AllDeclinedMessages>
        <div class="fr-col-md-12 fr-mb-3w fr-mt-3w">
          <ListItem
            v-for="file in files"
            :key="file.id"
            :file="file"
            :watermark-url="documentWatermarkUrl"
            doc-category="guarantee-provider-certificate"
            @remove="remove(Number(file.id))"
          />
        </div>
        <div class="fr-mt-3w fr-mb-3w">
          <FileUpload
            ref="file-upload"
            :current-status="fileUploadStatus"
            @add-files="addFiles"
          ></FileUpload>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal v-if="isDocDeleteVisible" @valid="validSelect()" @cancel="undoSelect()">
      <span>{{ t('identification-page.will-delete-files') }}</span>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import FileUpload from '../../uploads/FileUpload.vue'
import { UploadStatus } from 'df-shared-next/src/models/UploadStatus'
import ListItem from '../../uploads/ListItem.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DfFile } from 'df-shared-next/src/models/DfFile'
import { RegisterService } from '../../../services/RegisterService'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import AllDeclinedMessages from '../share/AllDeclinedMessages.vue'
import { DocumentDeniedReasons } from 'df-shared-next/src/models/DocumentDeniedReasons'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTenantStore } from '../../../stores/tenant-store'
import { useLoading } from 'vue-loading-overlay'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { DocumentTypeConstants } from '../../documents/share/DocumentTypeConstants'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import { AnalyticsService } from '../../../services/AnalyticsService'
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import { UtilsService } from '@/services/UtilsService'
import { toast } from '@/components/toast/toastUtils'

const props = defineProps<{
  tenantId?: number
  isCotenant?: boolean
  guarantor?: Guarantor
}>()

const { t } = useI18n()
const store = useTenantStore()
const fileUpload = useTemplateRef('file-upload')
const user = computed(() => store.user)

const MAX_FILE_COUNT = 5

const documentTypeOptions = DocumentTypeConstants.GUARANTOR_ORGANISM_DOCS
const certificateDocument = computed(() => {
  return guarantorCertificateDocument()
})

const selectedDocumentType = ref(new DocumentType())
const isDocDeleteVisible = ref(false)

const documentDeniedReasons = ref(new DocumentDeniedReasons())

const files = ref([] as DfFile[])
const fileUploadStatus = ref(UploadStatus.STATUS_INITIAL)

onBeforeMount(() => {
  loadDocument()
})

const title = computed(() => {
  const userType = props.isCotenant ? 'cotenant' : 'tenant'
  return t(`explanation-text.${userType}.organism-guarantor`)
})

function guarantorId() {
  if (props.guarantor) {
    return props.guarantor.id
  }
  return store.guarantor?.id
}

const documentStatus = computed(() => {
  return certificateDocument.value?.documentStatus
})

const documentWatermarkUrl = computed(() => {
  return certificateDocument.value?.name
})

function guarantorCertificateDocument(): DfDocument | undefined {
  if (props.guarantor) {
    return props.guarantor.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'GUARANTEE_PROVIDER_CERTIFICATE'
    })
  }
  return store.getGuaranteeProviderCertificateDocument
}

function onSelectChange($event: DocumentType) {
  selectedDocumentType.value = $event
  if (user.value?.documents !== null) {
    const doc = certificateDocument.value
    if (doc !== undefined) {
      isDocDeleteVisible.value =
        (doc?.files?.length || 0) > 0 &&
        doc?.documentSubCategory !== selectedDocumentType.value.value
    }
  }
  return false
}

function undoSelect() {
  if (user.value?.documents !== null) {
    const doc = certificateDocument.value
    if (doc !== undefined) {
      const localDoc = documentTypeOptions.find((d: DocumentType) => {
        return d.value === doc?.documentSubCategory
      })
      if (localDoc !== undefined) {
        selectedDocumentType.value = localDoc
      }
    }
  }
  isDocDeleteVisible.value = false
}

async function validSelect() {
  isDocDeleteVisible.value = false
  await removeAllFiles()
}

function addFiles(newFiles: File[]) {
  if (files.value.length >= MAX_FILE_COUNT) {
    displayTooManyFilesToast()
    return
  }
  save(newFiles)
}

function save(files: File[]) {
  const fieldName = 'documents'
  const formData = new FormData()
  if (!files.length) return

  Array.from(Array(files.length).keys()).forEach((x) => {
    formData.append(`${fieldName}[${x}]`, files[x], files[x].name)
  })

  formData.append('typeDocumentCertificate', selectedDocumentType.value.value)

  const gId = guarantorId()
  if (gId) {
    formData.append('guarantorId', gId.toString())
  }
  if (props.tenantId) {
    formData.append('tenantId', props.tenantId.toString())
  }

  fileUploadStatus.value = UploadStatus.STATUS_SAVING
  const $loading = useLoading({})
  const loader = $loading.show()
  RegisterService.saveOrganismIdentification(formData)
    .then((response) => {
      fileUploadStatus.value = UploadStatus.STATUS_INITIAL
      toast.success(t('save-success'), fileUpload.value?.inputFile)
      store.loadUserCommit(response.data)
      loadDocument()
    })
    .catch((error) => {
      fileUploadStatus.value = UploadStatus.STATUS_FAILED
      UtilsService.handleCommonSaveError(error, fileUpload.value?.inputFile)
    })
    .finally(() => {
      loader.hide()
    })
}

async function removeAllFiles() {
  const ids = files.value.map((f: DfFile) => Number(f.id))
  for (const fileId of ids) {
    await remove(fileId, true)
  }
}

async function remove(fileId: number, silent = false) {
  AnalyticsService.deleteFile('guarantee-provider-certificate')
  if (fileId) {
    if (
      files.value.length === 1 &&
      certificateDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(certificateDocument.value.documentCategory || '')
    }
    await RegisterService.deleteFile(fileId, silent)
  }
  const firstIndex = files.value.findIndex((f) => f.id === fileId)
  files.value.splice(firstIndex, 1)
}

function loadDocument() {
  // This is a needed workaround for now, since we can't identify the currently
  // edited guarantor (and thus the corresponding document) from state
  if (certificateDocument.value !== undefined) {
    const localDoc = documentTypeOptions.find((d: DocumentType) => {
      return d.value === certificateDocument.value?.documentSubCategory
    })
    if (localDoc !== undefined) {
      selectedDocumentType.value = localDoc
    }
    if (certificateDocument.value.documentDeniedReasons) {
      documentDeniedReasons.value = certificateDocument.value.documentDeniedReasons
    } else {
      documentDeniedReasons.value = new DocumentDeniedReasons()
    }
    files.value = certificateDocument.value?.files || []
  }
}

function displayTooManyFilesToast() {
  toast.maxFileError(files.value.length, MAX_FILE_COUNT, fileUpload.value?.inputFile)
}

function documentTypes() {
  return documentTypeOptions.map((d) => {
    return { id: d.key, labelKey: d.key, value: d }
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
