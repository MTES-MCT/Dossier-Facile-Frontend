<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <GuarantorBadge />
      <h1 class="fr-h4">
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
      <div v-if="shouldShowUploader">
        <AnalysisWrapper
          ref="analysis-wrapper"
          :is-uploading="isUploading"
          :polling-timout-ms="20000"
        >
          <template #fileUploader>
            <UploadFileWithAnalysis
              ref="upload-file-with-analysis"
              doc-category="guarantee-provider-certificate"
              :sub-category="selectedSubCategory"
              :analysis-in-progress="analysisInProgress"
              :max-file-count="5"
            />
          </template>
        </AnalysisWrapper>
      </div>
    </NakedCard>

    <ConfirmModal
      v-model:is-opened="isDocDeleteVisible"
      :title="t('delete-docs')"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <p>{{ t('identification-page.will-delete-files') }}</p>
    </ConfirmModal>

    <GuarantorFooter
      :before-submit="analysisWrapper?.beforeSubmit"
      :next-disabled="analysisWrapper?.nextDisabled"
      :next-label="analysisWrapper?.nextLabel"
      @on-back="onBack"
      @on-next="nextStep"
    ></GuarantorFooter>
  </div>
</template>

<script setup lang="ts">
import GuarantorBadge from '@/components/common/GuarantorBadge.vue'
import SimpleRadioButtons from 'df-shared-next/src/Button/SimpleRadioButtons.vue'
import ConfirmModal from 'df-shared-next/src/components/ConfirmModal.vue'
import NakedCard from 'df-shared-next/src/components/NakedCard.vue'
import { DfDocument } from 'df-shared-next/src/models/DfDocument'
import { DocumentType } from 'df-shared-next/src/models/Document'
import { Guarantor } from 'df-shared-next/src/models/Guarantor'
import { computed, provide, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AnalyticsService } from '../../../services/AnalyticsService'
import { RegisterService } from '../../../services/RegisterService'
import { useTenantStore } from '../../../stores/tenant-store'
import AnalysisWrapper from '../../analysis/AnalysisWrapper.vue'
import UploadFileWithAnalysis from '../../analysis/UploadFileWithAnalysis.vue'
import { documentFormKey } from '../../documents/documentFormState'
import {
  DocumentTypeConstants,
  type DocumentSubCategory
} from '../../documents/share/DocumentTypeConstants'
import GuarantorFooter from '../../footer/GuarantorFooter.vue'

const props = defineProps<{
  tenantId?: number
  isCotenant?: boolean
  guarantor?: Guarantor
  onBack?: () => void
  nextStep?: () => void
}>()

const { t } = useI18n()
const store = useTenantStore()
const user = computed(() => store.user)

const analysisWrapper = useTemplateRef('analysis-wrapper')

const documentTypeOptions = DocumentTypeConstants.GUARANTOR_ORGANISM_DOCS
const certificateDocument = computed(() => {
  return guarantorCertificateDocument()
})

const selectedDocumentType = ref(new DocumentType())
const isDocDeleteVisible = ref(false)

const uploadFileWithAnalysis = useTemplateRef('upload-file-with-analysis')

const isUploading = computed(() => uploadFileWithAnalysis.value?.isUploading ?? false)

const title = computed(() => {
  const userType = props.isCotenant ? 'cotenant' : 'tenant'
  return t(`explanation-text.${userType}.organism-guarantor`)
})

const shouldShowUploader = computed(
  () =>
    Boolean(selectedDocumentType.value.key) || (certificateDocument.value?.files?.length ?? 0) > 0
)
const selectedSubCategory = computed(() => selectedDocumentType.value.value as DocumentSubCategory)

const analysisInProgress = computed(() => analysisWrapper.value?.analysisInProgress ?? false)

function guarantorId() {
  if (props.guarantor) {
    return props.guarantor.id
  }
  return store.guarantor?.id
}

function guarantorCertificateDocument(): DfDocument | undefined {
  if (props.guarantor) {
    return props.guarantor.documents?.find((d: DfDocument) => {
      return d.documentCategory === 'GUARANTEE_PROVIDER_CERTIFICATE'
    })
  }
  return store.getGuaranteeProviderCertificateDocument
}

watch(
  certificateDocument,
  (document) => {
    if (!document) return
    const localDoc = documentTypeOptions.find(
      (d: DocumentType) => d.value === document.documentSubCategory
    )
    if (localDoc !== undefined) {
      selectedDocumentType.value = localDoc
    }
  },
  { immediate: true }
)

provide(documentFormKey, {
  category: 'GUARANTEE_PROVIDER_CERTIFICATE',
  textKey: props.isCotenant ? 'couple-guarantor' : 'guarantor',
  previousStep: { name: 'GuarantorName' },
  nextStep: { name: 'GuarantorName' },
  formFieldValue: 'typeDocumentCertificate',
  document: certificateDocument,
  storeAction: 'saveOrganismIdentification',
  userId: store.user.id,
  addData: (formData: FormData) => {
    const gId = guarantorId()
    if (gId) {
      formData.append('guarantorId', gId.toString())
    }
    if (props.tenantId) {
      formData.append('tenantId', props.tenantId.toString())
    }
  }
})

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
}

async function validSelect() {
  isDocDeleteVisible.value = false
  await removeAllFiles()
}

async function removeAllFiles() {
  const ids = (certificateDocument.value?.files ?? []).map((f) => Number(f.id))
  for (const fileId of ids) {
    await remove(fileId, true)
  }
}

async function remove(fileId: number, silent = false) {
  AnalyticsService.deleteFile('guarantee-provider-certificate')
  if (fileId) {
    if (
      (certificateDocument.value?.files?.length ?? 0) === 1 &&
      certificateDocument.value?.documentAnalysisReport?.analysisStatus === 'DENIED'
    ) {
      AnalyticsService.removeDeniedDocument(certificateDocument.value.documentCategory || '')
    }
    await RegisterService.deleteFile(fileId, silent)
  }
}

function documentTypes() {
  return documentTypeOptions.map((d) => {
    return { id: d.key, labelKey: d.key, value: d }
  })
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

<i18n lang="json">
{
  "en": {
    "delete-docs": "Delete my documents"
  },
  "fr": {
    "delete-docs": "Supprimer mes documents"
  }
}
</i18n>
